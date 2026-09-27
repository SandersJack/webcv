import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import bpy
from mathutils import Vector

WATERPOLO_BLEND = os.path.join(C.BLENDER_ROOT, "waterpolo", "waterpolo_scene.blend")
DESKTOP_RES = (1600, 900)
MOBILE_RES = (430, 932)
LOW = os.environ.get("WEBCV_DETAIL") == "low"

DECK_TOP_Z = 0.3
WATER_Z = 0.2
POOL_FLOOR_Z = -0.35                      # top of the pool floor tiles
WALL_H = DECK_TOP_Z - POOL_FLOOR_Z        # basin walls run from pool floor to deck
POOL_LX, POOL_LY = 6.04, 2.94             # inner size of the basin (wall to wall)
GOAL_LINE_X = 2.47
GOAL_X = 2.42
CAGE_DEPTH = 0.45
BALL_RADIUS = 0.11                        # was 0.16, scaled down to sit next to player heads
SHOT_SCENE = True                         # True: one shot on goal with a save. False: mid-play scrum
BUBBLE_FRAME = 48

# Players. Everything about a player is authored at scale 1.0 (head is 0.14 wide).
PLAYER_SCALE = 1.0
ANIMATE_PLAYERS = True                    # gentle bob on the same 48 frame loop as the ball

# Field: 4.94 units between goal lines plays as 30 m, so 1 unit = 6.07 m.
LINE_2M_X = GOAL_LINE_X - 0.33
LINE_5M_X = GOAL_LINE_X - 0.82

# ---------------------------------------------------------------------------
# Materials created in this script (the shared library has no team colours or
# skin tones). They are plain Principled materials, swap by name if you have
# library equivalents.
# ---------------------------------------------------------------------------

MATS = {}
SKIN_TONES = (
    (0.62, 0.34, 0.24),
    (0.45, 0.25, 0.16),
    (0.30, 0.15, 0.09),
    (0.75, 0.48, 0.36),
)


def _set(node, names, value):
    for n in names:
        sock = node.inputs.get(n)
        if sock is not None:
            sock.default_value = value
            return True
    return False


def _blend(mat):
    if hasattr(mat, "surface_render_method"):      # Blender 4.2+
        mat.surface_render_method = 'BLENDED'
    else:
        mat.blend_method = 'BLEND'
        mat.show_transparent_back = False


def new_material(name, color, roughness=0.6, alpha=1.0, blended=False, culling=False):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = next(n for n in nodes if n.type == 'BSDF_PRINCIPLED')
    _set(bsdf, ("Base Color",), (color[0], color[1], color[2], 1.0))
    _set(bsdf, ("Roughness",), roughness)
    _set(bsdf, ("Alpha",), alpha)
    mat.diffuse_color = (color[0], color[1], color[2], alpha)
    mat.use_backface_culling = culling
    if blended:
        _blend(mat)
    MATS[name] = mat
    return mat, bsdf


def set_mat(obj, name):
    obj.data.materials.clear()
    obj.data.materials.append(MATS[name])


def build_floor_material():
    mat, bsdf = new_material("MAT_pool_floor", (0.20, 0.62, 0.78), 0.35)
    try:
        nodes, links = mat.node_tree.nodes, mat.node_tree.links
        geo = nodes.new('ShaderNodeNewGeometry')   # world position, independent of object scale

        # Square tiles with light grout
        brick = nodes.new('ShaderNodeTexBrick')
        brick.offset = 0.0
        brick.squash = 1.0
        brick.inputs['Color1'].default_value = (0.22, 0.64, 0.80, 1.0)
        brick.inputs['Color2'].default_value = (0.18, 0.58, 0.76, 1.0)
        brick.inputs['Mortar'].default_value = (0.62, 0.86, 0.92, 1.0)
        brick.inputs['Scale'].default_value = 4.0
        brick.inputs['Mortar Size'].default_value = 0.014
        brick.inputs['Mortar Smooth'].default_value = 0.2
        brick.inputs['Brick Width'].default_value = 0.5
        brick.inputs['Row Height'].default_value = 0.5
        links.new(geo.outputs['Position'], brick.inputs['Vector'])

        # Caustic web (bright cell edges) added on top of the tiles
        vor = nodes.new('ShaderNodeTexVoronoi')
        vor.feature = 'DISTANCE_TO_EDGE'
        vor.inputs['Scale'].default_value = 3.0
        links.new(geo.outputs['Position'], vor.inputs['Vector'])

        ramp = nodes.new('ShaderNodeValToRGB')
        ramp.color_ramp.elements[0].position = 0.0
        ramp.color_ramp.elements[0].color = (1.0, 1.0, 1.0, 1.0)
        ramp.color_ramp.elements[1].position = 0.07
        ramp.color_ramp.elements[1].color = (0.0, 0.0, 0.0, 1.0)
        links.new(vor.outputs['Distance'], ramp.inputs['Fac'])

        mix = nodes.new('ShaderNodeMixRGB')
        mix.blend_type = 'ADD'
        mix.inputs['Fac'].default_value = 0.22
        links.new(brick.outputs['Color'], mix.inputs['Color1'])
        links.new(ramp.outputs['Color'], mix.inputs['Color2'])
        links.new(mix.outputs['Color'], bsdf.inputs['Base Color'])
    except Exception as exc:  # keep the flat colour if a node API differs in this Blender version
        print(f"[waterpolo] procedural pool floor unavailable, using flat colour: {exc}")


def build_water_materials():
    surf, bsdf = new_material("MAT_pool_water", (0.02, 0.32, 0.58), 0.03, alpha=0.42, blended=True)
    _set(bsdf, ("Specular IOR Level", "Specular"), 0.9)
    _set(bsdf, ("IOR",), 1.33)
    _set(bsdf, ("Emission Color", "Emission"), (0.02, 0.22, 0.45, 1.0))
    _set(bsdf, ("Emission Strength",), 0.3)
    try:
        nodes, links = surf.node_tree.nodes, surf.node_tree.links
        geo = nodes.new('ShaderNodeNewGeometry')
        noise = nodes.new('ShaderNodeTexNoise')
        noise.inputs['Scale'].default_value = 9.0
        noise.inputs['Detail'].default_value = 3.0
        noise.inputs['Distortion'].default_value = 0.5
        bump = nodes.new('ShaderNodeBump')
        bump.inputs['Strength'].default_value = 0.35
        bump.inputs['Distance'].default_value = 0.05
        links.new(geo.outputs['Position'], noise.inputs['Vector'])
        links.new(noise.outputs['Fac'], bump.inputs['Height'])
        links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    except Exception as exc:
        print(f"[waterpolo] water ripple bump unavailable: {exc}")

    # Faint tint for the volume under the surface
    new_material("MAT_pool_water_body", (0.0, 0.16, 0.36), 0.2, alpha=0.28, blended=True, culling=True)


def build_materials():
    MATS.clear()
    new_material("MAT_cap_white", (0.90, 0.92, 0.95), 0.55)
    new_material("MAT_cap_blue", (0.02, 0.10, 0.70), 0.55)
    new_material("MAT_cap_red", (0.75, 0.02, 0.02), 0.55)
    for i, col in enumerate(SKIN_TONES):
        new_material(f"MAT_skin_{i}", col, 0.65)
    new_material("MAT_foam", (0.92, 0.98, 1.0), 0.9)
    new_material("MAT_pool_lane_line", (0.02, 0.10, 0.28), 0.7)
    new_material("MAT_pool_band", (0.03, 0.22, 0.48), 0.5)
    build_floor_material()
    build_water_materials()


# ---------------------------------------------------------------------------
# Geometry helpers
# ---------------------------------------------------------------------------

def bar_between(name, p1, p2, radius=0.025, vertices=8):
    p1, p2 = Vector(p1), Vector(p2)
    direction = p2 - p1
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices, radius=radius, depth=direction.length, location=(p1 + p2) / 2
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.rotation_mode = 'QUATERNION'
    obj.rotation_quaternion = direction.to_track_quat('Z', 'Y')
    return obj


def build_environment(base):
    # Ground with a hole where the pool sits, so the pool can have its own deeper floor.
    hx, hy, span = 3.05, 1.5, 20.0
    pieces = [
        C.add_box("env_n", (2 * span, span - hy, 0.2), location=(0.0, (span + hy) / 2, -0.2)),
        C.add_box("env_s", (2 * span, span - hy, 0.2), location=(0.0, -(span + hy) / 2, -0.2)),
        C.add_box("env_e", (span - hx, 2 * hy, 0.2), location=((span + hx) / 2, 0.0, -0.2)),
        C.add_box("env_w", (span - hx, 2 * hy, 0.2), location=(-(span + hx) / 2, 0.0, -0.2)),
    ]
    floor = C.join_objects(pieces, "ENV_floor")
    C.assign_material(floor, "MAT_dark_metal")
    C.link_only(floor, base)


def build_water_surface(base):
    """Subdivided plane with a small static swell. The bump map adds the fine ripples."""
    nx, ny = (24, 12) if LOW else (72, 36)
    lx, ly = POOL_LX - 0.01, POOL_LY - 0.01
    z0 = WATER_Z - 0.004
    amp = 0.005
    verts, faces = [], []
    for j in range(ny + 1):
        for i in range(nx + 1):
            x = -lx / 2 + lx * i / nx
            y = -ly / 2 + ly * j / ny
            swell = (
                0.5 * math.sin(x * 9.0 + y * 4.0)
                + 0.3 * math.sin(x * 4.5 - y * 11.0)
                + 0.2 * math.sin(x * 17.0 + y * 13.0)
            )
            verts.append((x, y, z0 + amp * swell))
    for j in range(ny):
        for i in range(nx):
            a = j * (nx + 1) + i
            faces.append((a, a + 1, a + nx + 2, a + nx + 1))

    mesh = bpy.data.meshes.new("PROP_water_surface_mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    for poly in mesh.polygons:
        poly.use_smooth = True
    surface = bpy.data.objects.new("PROP_water_surface", mesh)
    surface.data.materials.append(MATS["MAT_pool_water"])
    base.objects.link(surface)


def build_floor_lines(base):
    """Dark lane lines and T marks on the pool floor, like a competition pool."""
    parts = []
    for i, y in enumerate((-1.275, 0.0, 1.275)):
        parts.append(C.add_box(f"floor_line_{i}", (5.5, 0.06, 0.006), location=(0.0, y, POOL_FLOOR_Z)))
        for j, x in enumerate((-2.75, 2.75)):
            parts.append(C.add_box(f"floor_t_{i}_{j}", (0.06, 0.4, 0.006), location=(x, y, POOL_FLOOR_Z)))
    lines = C.join_objects(parts, "PROP_pool_floor_lines")
    set_mat(lines, "MAT_pool_lane_line")
    C.link_only(lines, base)


def build_deck(base):
    slabs = [
        C.add_box("deck_n", (7.9, 0.5, DECK_TOP_Z), location=(0.0, 1.75, 0.0)),
        C.add_box("deck_s", (7.9, 0.5, DECK_TOP_Z), location=(0.0, -1.75, 0.0)),
        C.add_box("deck_e", (0.9, 3.0, DECK_TOP_Z), location=(3.5, 0.0, 0.0)),
        C.add_box("deck_w", (0.9, 3.0, DECK_TOP_Z), location=(-3.5, 0.0, 0.0)),
    ]
    deck = C.join_objects(slabs, "PROP_pool_deck")
    C.assign_material(deck, "MAT_dark_metal")
    C.link_only(deck, base)

    walls = [
        C.add_box("wall_n", (6.1, 0.03, WALL_H), location=(0.0, 1.485, POOL_FLOOR_Z)),
        C.add_box("wall_s", (6.1, 0.03, WALL_H), location=(0.0, -1.485, POOL_FLOOR_Z)),
        C.add_box("wall_e", (0.03, 2.94, WALL_H), location=(3.035, 0.0, POOL_FLOOR_Z)),
        C.add_box("wall_w", (0.03, 2.94, WALL_H), location=(-3.035, 0.0, POOL_FLOOR_Z)),
    ]
    basin = C.join_objects(walls, "PROP_pool_walls")
    C.assign_material(basin, "MAT_off_white")
    C.link_only(basin, base)

    # Tiled pool floor, well below the waterline
    pool_floor = C.add_box("PROP_pool_floor", (POOL_LX, POOL_LY, 0.1), location=(0.0, 0.0, POOL_FLOOR_Z - 0.1))
    set_mat(pool_floor, "MAT_pool_floor")
    C.link_only(pool_floor, base)

    # Dark tile band just under the waterline on the inner wall faces
    band_z = WATER_Z - 0.075
    bands = [
        C.add_box("band_n", (POOL_LX, 0.012, 0.07), location=(0.0, POOL_LY / 2 - 0.006, band_z)),
        C.add_box("band_s", (POOL_LX, 0.012, 0.07), location=(0.0, -POOL_LY / 2 + 0.006, band_z)),
        C.add_box("band_e", (0.012, POOL_LY - 0.024, 0.07), location=(POOL_LX / 2 - 0.006, 0.0, band_z)),
        C.add_box("band_w", (0.012, POOL_LY - 0.024, 0.07), location=(-POOL_LX / 2 + 0.006, 0.0, band_z)),
    ]
    band = C.join_objects(bands, "PROP_waterline_band")
    set_mat(band, "MAT_pool_band")
    C.link_only(band, base)

    if not LOW:
        build_floor_lines(base)

    # Water: a faint tinted volume plus the rippled surface plane
    water = C.add_box(
        "PROP_water", (POOL_LX - 0.04, POOL_LY - 0.04, WATER_Z - 0.03 - POOL_FLOOR_Z),
        location=(0.0, 0.0, POOL_FLOOR_Z),
    )
    set_mat(water, "MAT_pool_water_body")
    C.link_only(water, base)

    build_water_surface(base)

    marker_low = C.add_box("depth_low", (0.25, 0.25, 0.08), location=(-2.75, 1.75, DECK_TOP_Z))
    marker_high = C.add_box("depth_high", (0.15, 0.15, 0.08), location=(-2.75, 1.75, DECK_TOP_Z + 0.08))
    marker = C.join_objects([marker_low, marker_high], "PROP_depth_marker")
    C.assign_material(marker, "MAT_off_white")
    C.link_only(marker, base)


def build_field_markings(props):
    def line(name, x, material, width=0.05):
        obj = C.add_box(name, (width, 2.9, 0.015), location=(x, 0.0, WATER_Z + 0.002))
        C.assign_material(obj, material)
        C.link_only(obj, props)

    for tag, x in (("00", -GOAL_LINE_X), ("01", GOAL_LINE_X)):
        line(f"PROP_goal_line_{tag}", x, "MAT_off_white")
    for tag, x in (("00", -LINE_2M_X), ("01", LINE_2M_X)):
        line(f"PROP_line_2m_{tag}", x, "MAT_marker_red")
    for tag, x in (("00", -LINE_5M_X), ("01", LINE_5M_X)):
        line(f"PROP_line_5m_{tag}", x, "MAT_safety_yellow")
    line("PROP_half_line", 0.0, "MAT_off_white", width=0.04)

    for i, (x, y) in enumerate(((LINE_2M_X, 1.28), (LINE_2M_X, -1.28), (-LINE_2M_X, 1.28), (-LINE_2M_X, -1.28))):
        marker = C.add_box(f"PROP_reentry_marker_{i:02d}", (0.22, 0.22, 0.015), location=(x, y, WATER_Z + 0.002))
        C.assign_material(marker, "MAT_marker_red")
        C.link_only(marker, props)

    bpy.ops.mesh.primitive_torus_add(
        major_segments=16, minor_segments=4, major_radius=0.35, minor_radius=0.02,
        location=(0.0, 0.0, WATER_Z + 0.005),
    )
    ring = bpy.context.active_object
    ring.name = "PROP_release_ring"
    C.shade_flat(ring)
    C.assign_material(ring, "MAT_off_white")
    C.link_only(ring, props)


def build_deck_furniture(props):
    table_top = C.add_box("table_top", (0.8, 0.3, 0.05), location=(0.0, -1.75, DECK_TOP_Z + 0.2))
    table_base = C.add_box("table_base", (0.7, 0.25, 0.2), location=(0.0, -1.75, DECK_TOP_Z))
    C.assign_material(table_top, "MAT_off_white")
    C.assign_material(table_base, "MAT_dark_metal")
    table = C.join_objects([table_top, table_base], "PROP_officials_table")
    C.link_only(table, props)

    for tag, x in (("00", -3.45), ("01", 3.45)):
        seat = C.add_box(f"PROP_goal_judge_seat_{tag}", (0.28, 0.28, 0.22), location=(x, 1.1, DECK_TOP_Z))
        C.assign_material(seat, "MAT_off_white")
        C.link_only(seat, props)


def build_tiles(props):
    tile_a = C.add_box("tile_a", (0.18, 0.18, 0.06))
    C.assign_material(tile_a, "MAT_off_white")
    tile_b = C.add_box("tile_b", (0.18, 0.18, 0.06))
    C.assign_material(tile_b, "MAT_water_light")
    tiles = bpy.data.objects.new("PROP_pool_tiles", None)
    props.objects.link(tiles)

    spots = []
    tile_step = 2 if LOW else 1
    for i in range(0, 9, tile_step):
        y = -1.24 + i * 0.31
        spots.append((-2.97, y))
        spots.append((2.97, y))
    for i in range(0, 15, tile_step):
        x = -2.17 + i * 0.31
        spots.append((x, -1.42))
        spots.append((x, 1.42))
    for i, (x, y) in enumerate(spots):
        src = tile_a if i % 2 == 0 else tile_b
        tile = C.dup(src, f"PROP_tile_{i:02d}", loc=(x, y, DECK_TOP_Z), coll=props)
        tile.parent = tiles
    bpy.data.objects.remove(tile_a)
    bpy.data.objects.remove(tile_b)


def build_lane_ropes(props):
    for i, y in enumerate((-1.1, 1.1)):
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=6 if LOW else 8, radius=0.025, depth=5.9, location=(0.0, y, WATER_Z + 0.005), rotation=(0.0, math.pi / 2, 0.0)
        )
        line = bpy.context.active_object
        line.name = f"rope_line_{i}"
        C.assign_material(line, "MAT_rubber")
        beads = [line]
        bead_count = 6 if LOW else 10
        for j in range(bead_count):
            x = -2.7 + j * (5.4 / (bead_count - 1))
            bead = C.add_box(f"bead_{i}_{j}", (0.09, 0.09, 0.09), location=(x, y, WATER_Z), base_origin=False)
            C.assign_material(bead, "MAT_off_white" if j % 2 == 0 else "MAT_water_light")
            beads.append(bead)
        rope = C.join_objects(beads, f"PROP_lane_rope_{i:02d}")
        C.link_only(rope, props)


def build_goal(tag, x_goal_line, props):
    # The net cage extends backward from the goal line, away from the field.
    o = 1.0 if x_goal_line > 0 else -1.0
    xb = x_goal_line + CAGE_DEPTH * o

    frame = [
        C.add_box(f"post_{tag}_{i}", (0.06, 0.06, 0.7), location=(x_goal_line, y, WATER_Z))
        for i, y in enumerate((-0.45, 0.45))
    ]
    frame.append(C.add_box(f"bar_{tag}", (0.06, 0.96, 0.06), location=(x_goal_line, 0.0, WATER_Z + 0.67)))
    frame.append(C.add_box(f"float_{tag}", (0.14, 1.0, 0.07), location=(x_goal_line, 0.0, WATER_Z - 0.05)))
    frame.append(C.add_box(f"rearfloat_{tag}", (0.12, 0.9, 0.07), location=(xb, 0.0, WATER_Z - 0.05)))
    frame.append(C.add_box(f"backpost_{tag}_0", (0.06, 0.06, 0.43), location=(xb, -0.42, WATER_Z + 0.02)))
    frame.append(C.add_box(f"backpost_{tag}_1", (0.06, 0.06, 0.43), location=(xb, 0.42, WATER_Z + 0.02)))
    frame.append(C.add_box(f"backbar_{tag}", (0.06, 0.9, 0.06), location=(xb, 0.0, DECK_TOP_Z + 0.32)))
    frame.append(bar_between(f"stay_{tag}_0", (x_goal_line, -0.45, WATER_Z + 0.67), (xb, -0.42, DECK_TOP_Z + 0.35)))
    frame.append(bar_between(f"stay_{tag}_1", (x_goal_line, 0.45, WATER_Z + 0.67), (xb, 0.42, DECK_TOP_Z + 0.35)))
    frame.append(bar_between(f"rail_{tag}_0", (x_goal_line, -0.45, WATER_Z + 0.02), (xb, -0.42, WATER_Z + 0.03)))
    frame.append(bar_between(f"rail_{tag}_1", (x_goal_line, 0.45, WATER_Z + 0.02), (xb, 0.42, WATER_Z + 0.03)))
    for part in frame:
        C.assign_material(part, "MAT_off_white")

    net = []
    for j, z in enumerate((DECK_TOP_Z + 0.1, DECK_TOP_Z + 0.22)):
        net.append(C.add_box(f"net_bh_{tag}_{j}", (0.02, 0.84, 0.02), location=(xb, 0.0, z)))
    for j, y in enumerate((-0.28, 0.0, 0.28)):
        net.append(C.add_box(f"net_bv_{tag}_{j}", (0.02, 0.02, 0.43), location=(xb, y, WATER_Z + 0.02)))
    for j, t in enumerate((0.35, 0.7)):
        x = x_goal_line + CAGE_DEPTH * o * t
        z = (WATER_Z + 0.7) + (DECK_TOP_Z + 0.35 - WATER_Z - 0.7) * t
        net.append(C.add_box(f"net_top_{tag}_{j}", (0.02, 0.88, 0.02), location=(x, 0.0, z)))
    for part in net:
        C.assign_material(part, "MAT_light_metal")

    goal = C.join_objects(frame + net, f"PROP_waterpolo_goal_{tag}")
    C.link_only(goal, props)


# ---------------------------------------------------------------------------
# Players
# ---------------------------------------------------------------------------

# Arm poses in the player's local frame: x forward, y left, z above the waterline.
# Each arm is (elbow, hand). Shoulders sit at (0, +/-0.15, 0.09).
POSES = {
    "reach": {
        "L": ((0.11, 0.17, 0.07), (0.25, 0.13, 0.11)),
        "R": ((0.11, -0.17, 0.07), (0.25, -0.13, 0.11)),
    },
    "swim": {
        "L": ((0.10, 0.20, 0.17), (0.24, 0.15, 0.06)),
        "R": ((-0.06, -0.23, 0.05), (-0.16, -0.25, 0.0)),
    },
    "block": {
        "L": ((0.04, 0.22, 0.20), (0.06, 0.20, 0.36)),
        "R": ((0.09, -0.22, 0.05), (0.16, -0.28, 0.06)),
    },
    "throw": {
        "L": ((0.12, 0.17, 0.06), (0.24, 0.10, 0.09)),
        "R": ((-0.02, -0.28, 0.16), (-0.02, -0.24, 0.32)),
    },
    "keeper": {
        "L": ((0.03, 0.26, 0.22), (0.04, 0.30, 0.40)),
        "R": ((0.03, -0.26, 0.22), (0.04, -0.30, 0.40)),
    },
}


def facing(x, y, tx, ty):
    return math.atan2(ty - y, tx - x)


# ---------------------------------------------------------------------------
# Shot choreography (SHOT_SCENE)
#
# White #1 shoots at the blue keeper, who saves it and parries the ball away.
# Everything here is plain maths (no bpy) so the ball can be keyed to the shooter's hand
# frame by frame, and to the keeper's hand at the moment of the save.
# The whole action fits inside the 1..BUBBLE_FRAME timeline.
# ---------------------------------------------------------------------------
# >>> choreography

SHOT_RELEASE_F = 15          # ball leaves the shooter's hand
SHOT_SAVE_F = 22             # ball meets the keeper's hand
SHOOTER_XY = (1.15, 0.28)
KEEPER_XY = (2.20, 0.0)

# Shooter's throwing arm, in arm-local space (origin at the shoulder, straight arm points +z).
SHOULDER_R = (0.0, -0.15, 0.09)      # right shoulder in the body's local frame
ARM_ELBOW = (0.0, 0.0, 0.17)
ARM_HAND = (0.05, 0.0, 0.33)
ARM_BALL = (0.065, 0.0, 0.378)       # ball centre while held, just beyond the hand
ARM_REST_DEG = 90.0                  # arm pointing straight forward, ball on the water

# Control points are (frame, value[, mode]); mode "e" eases into the point, "l" is linear.
ARM_ANGLE = [(1, ARM_REST_DEG), (5, ARM_REST_DEG), (11, -70.0, "e"), (15, 70.0, "l"),
             (20, 125.0, "l"), (32, 92.0, "e")]           # wind-up, whip, follow-through
SHOOTER_RISE = [(1, 0.0), (9, 0.0), (14, 0.07, "e"), (20, 0.05, "e"), (30, 0.0, "e")]

KEEPER_LUNGE = [(1, 0.0), (12, 0.0), (22, 1.0, "e"), (26, 1.0, "e"), (40, 0.0, "e")]
KEEPER_ROLL_DEG = -14.0              # lean toward the ball side
KEEPER_SHIFT = 0.04                  # sideways shift toward the ball
KEEPER_RISE = 0.10                   # lift out of the water

PARRY_V = (-0.012, -0.020, 0.040)    # ball velocity after the save, units per frame
GRAVITY = 0.006
REST_Z = WATER_Z + 0.04              # ball centre height when floating


def _smooth(t):
    t = min(1.0, max(0.0, t))
    return t * t * (3.0 - 2.0 * t)


def curve(f, pts):
    if f <= pts[0][0]:
        return pts[0][1]
    for a, b in zip(pts, pts[1:]):
        if f <= b[0]:
            t = (f - a[0]) / (b[0] - a[0])
            if len(b) < 3 or b[2] == "e":
                t = _smooth(t)
            return a[1] + (b[1] - a[1]) * t
    return pts[-1][1]


def _rot_x(v, a):
    c, s = math.cos(a), math.sin(a)
    return (v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c)


def _rot_y(v, a):
    c, s = math.cos(a), math.sin(a)
    return (v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c)


def _rot_z(v, a):
    c, s = math.cos(a), math.sin(a)
    return (v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2])


def _scaled(v):
    return (v[0] * PLAYER_SCALE, v[1] * PLAYER_SCALE, v[2] * PLAYER_SCALE)


KEEPER_YAW = facing(KEEPER_XY[0], KEEPER_XY[1], SHOOTER_XY[0], SHOOTER_XY[1])


def keeper_state(f):
    """Keeper body location and rotation_euler at frame f."""
    w = curve(f, KEEPER_LUNGE)
    off = _rot_z((0.0, KEEPER_SHIFT * w, 0.0), KEEPER_YAW)
    loc = (KEEPER_XY[0] + off[0], KEEPER_XY[1] + off[1], WATER_Z + KEEPER_RISE * w)
    rot = (math.radians(KEEPER_ROLL_DEG) * w, 0.0, KEEPER_YAW)
    return loc, rot


def keeper_hand(f):
    """World position of the keeper's left hand (the one that makes the save)."""
    loc, rot = keeper_state(f)
    h = _rot_z(_rot_x(_scaled(POSES["keeper"]["L"][1]), rot[0]), rot[2])
    return (loc[0] + h[0], loc[1] + h[1], loc[2] + h[2])


_KH = keeper_hand(SHOT_SAVE_F)
SHOOTER_YAW = facing(SHOOTER_XY[0], SHOOTER_XY[1], _KH[0], _KH[1])


def shooter_arm_angle(f):
    return math.radians(curve(f, ARM_ANGLE))


def shooter_rise(f):
    return curve(f, SHOOTER_RISE)


def shooter_ball(f):
    """Ball centre while the shooter holds it."""
    p = _rot_y(_scaled(ARM_BALL), shooter_arm_angle(f))
    s = _scaled(SHOULDER_R)
    p = _rot_z((p[0] + s[0], p[1] + s[1], p[2] + s[2]), SHOOTER_YAW)
    return (SHOOTER_XY[0] + p[0], SHOOTER_XY[1] + p[1], WATER_Z + shooter_rise(f) + p[2])


_dx, _dy = SHOOTER_XY[0] - _KH[0], SHOOTER_XY[1] - _KH[1]
_dn = math.hypot(_dx, _dy)
# Ball centre at the save: at the keeper's hand, nudged toward the shooter so it touches it.
MEET = (_KH[0] + 0.12 * _dx / _dn, _KH[1] + 0.12 * _dy / _dn, _KH[2])
RELEASE = shooter_ball(SHOT_RELEASE_F)

# Parry flight: up and away, then it drops into the water and settles.
_H0 = MEET[2] - REST_Z
K_LAND = (PARRY_V[2] + math.sqrt(PARRY_V[2] ** 2 + 2 * GRAVITY * _H0)) / GRAVITY
LAND_XY = (MEET[0] + PARRY_V[0] * K_LAND, MEET[1] + PARRY_V[1] * K_LAND)


def ball_pos(f):
    if f <= SHOT_RELEASE_F:
        return shooter_ball(f)
    if f <= SHOT_SAVE_F:
        s = (f - SHOT_RELEASE_F) / (SHOT_SAVE_F - SHOT_RELEASE_F)
        z = RELEASE[2] + (MEET[2] - RELEASE[2]) * s + 0.05 * 4.0 * s * (1.0 - s)
        return (RELEASE[0] + (MEET[0] - RELEASE[0]) * s, RELEASE[1] + (MEET[1] - RELEASE[1]) * s, z)
    k = f - SHOT_SAVE_F
    if k < K_LAND:
        return (
            MEET[0] + PARRY_V[0] * k,
            MEET[1] + PARRY_V[1] * k,
            MEET[2] + PARRY_V[2] * k - 0.5 * GRAVITY * k * k,
        )
    d = k - K_LAND
    return (LAND_XY[0], LAND_XY[1], REST_Z - 0.05 * math.exp(-0.3 * d) * math.sin(0.8 * d))

# <<< choreography

MIDPLAY_BALL = (0.0, 0.0, WATER_Z + 0.04)
BALL_POS = ball_pos(1) if SHOT_SCENE else MIDPLAY_BALL

# White defends the -X goal and attacks +X. Blue is the mirror image.
# (team, x, y, yaw, pose, is_keeper, role). Field players stay clear of the lane ropes at y = +/-1.1.
# role: "shooter" and "saver" are animated by animate_shot(); everyone else just bobs.
_SX, _SY = SHOOTER_XY
_KX, _KY = KEEPER_XY

ROSTER_SHOT = [
    ("white", -2.20, 0.00, 0.0, "keeper", True, None),
    ("white", _SX, _SY, SHOOTER_YAW, "throw", False, "shooter"),
    ("white", 1.55, 0.80, facing(1.55, 0.80, _KX, _KY), "reach", False, None),
    ("white", 0.55, -0.62, facing(0.55, -0.62, _KX, _KY), "swim", False, None),
    ("white", 0.20, 0.55, facing(0.20, 0.55, _KX, _KY), "swim", False, None),
    ("white", -0.45, -0.10, 0.0, "throw", False, None),
    ("white", -0.95, 0.60, 0.0, "swim", False, None),
    ("blue", _KX, _KY, KEEPER_YAW, "keeper", True, "saver"),
    ("blue", 0.95, 0.78, facing(0.95, 0.78, _SX, _SY), "block", False, None),
    ("blue", 2.00, 0.50, facing(2.00, 0.50, _SX, _SY), "block", False, None),
    ("blue", 0.55, 0.15, facing(0.55, 0.15, _SX, _SY), "reach", False, None),
    ("blue", 0.00, -0.62, facing(0.00, -0.62, _SX, _SY), "swim", False, None),
    ("blue", -0.35, 0.55, facing(-0.35, 0.55, _SX, _SY), "swim", False, None),
    ("blue", 1.15, -0.72, facing(1.15, -0.72, _SX, _SY), "block", False, None),
]

ROSTER_MIDPLAY = [
    ("white", -2.20, 0.00, 0.0, "keeper", True, None),
    ("white", -0.40, 0.04, facing(-0.40, 0.04, 0.0, 0.0), "reach", False, None),
    ("white", -0.95, 0.72, facing(-0.95, 0.72, 0.0, 0.0), "swim", False, None),
    ("white", -0.95, -0.72, facing(-0.95, -0.72, 0.0, 0.0), "throw", False, None),
    ("white", -1.55, 0.38, facing(-1.55, 0.38, 0.0, 0.0), "block", False, None),
    ("white", -1.55, -0.40, facing(-1.55, -0.40, 0.0, 0.0), "block", False, None),
    ("white", 0.05, 0.72, 0.0, "swim", False, None),
    ("blue", 2.20, 0.00, math.pi, "keeper", True, None),
    ("blue", 0.40, -0.04, facing(0.40, -0.04, 0.0, 0.0), "reach", False, None),
    ("blue", 0.95, -0.72, facing(0.95, -0.72, 0.0, 0.0), "swim", False, None),
    ("blue", 0.95, 0.72, facing(0.95, 0.72, 0.0, 0.0), "throw", False, None),
    ("blue", 1.55, -0.38, facing(1.55, -0.38, 0.0, 0.0), "block", False, None),
    ("blue", 1.55, 0.40, facing(1.55, 0.40, 0.0, 0.0), "block", False, None),
    ("blue", -0.05, -0.72, math.pi, "swim", False, None),
]

ROSTER = ROSTER_SHOT if SHOT_SCENE else ROSTER_MIDPLAY


class PlayerMesh:
    """Accumulates boxes and prisms for one player into a single mesh.

    Built directly with from_pydata (no C.add_box, no bpy.ops, no joins). Coordinates are in
    the player's local frame: origin on the waterline under the player, x forward, y left, z up.
    Yaw and PLAYER_SCALE are baked into the vertices, and the object is placed at (x, y, WATER_Z).
    """

    def __init__(self, yaw, scale):
        self.c, self.s, self.k = math.cos(yaw), math.sin(yaw), scale
        self.verts, self.faces, self.face_mats, self.mat_names = [], [], [], []

    def _mat(self, name):
        if name not in self.mat_names:
            self.mat_names.append(name)
        return self.mat_names.index(name)

    def _pt(self, lx, ly, lz):
        lx, ly, lz = lx * self.k, ly * self.k, lz * self.k
        return Vector((lx * self.c - ly * self.s, lx * self.s + ly * self.c, lz))

    def box(self, center, size, mat):
        m = self._mat(mat)
        cx, cy, cz = self._pt(*center)
        hx, hy, hz = (v * self.k / 2 for v in size)
        base = len(self.verts)
        for sx in (-1, 1):
            for sy in (-1, 1):
                for sz in (-1, 1):
                    lx, ly = sx * hx, sy * hy
                    self.verts.append((
                        cx + lx * self.c - ly * self.s,
                        cy + lx * self.s + ly * self.c,
                        cz + sz * hz,
                    ))
        # vertex index = 4*(sx>0) + 2*(sy>0) + (sz>0); quads wound so normals face outward
        for f in ((4, 6, 7, 5), (0, 1, 3, 2), (2, 3, 7, 6), (0, 4, 5, 1), (1, 5, 7, 3), (0, 2, 6, 4)):
            self.faces.append(tuple(base + i for i in f))
            self.face_mats.append(m)

    def limb(self, a, b, radius, mat, sides):
        m = self._mat(mat)
        p1, p2 = self._pt(*a), self._pt(*b)
        d = p2 - p1
        if d.length < 1e-6:
            return
        d.normalize()
        ref = Vector((0.0, 0.0, 1.0)) if abs(d.z) < 0.9 else Vector((1.0, 0.0, 0.0))
        u = d.cross(ref).normalized()
        v = d.cross(u).normalized()
        r = radius * self.k
        ring = [
            (u * math.cos(2 * math.pi * k / sides) + v * math.sin(2 * math.pi * k / sides)) * r
            for k in range(sides)
        ]
        base = len(self.verts)
        for off in ring:
            self.verts.append(tuple(p1 + off))
        for off in ring:
            self.verts.append(tuple(p2 + off))
        for k in range(sides):
            k2 = (k + 1) % sides
            self.faces.append((base + k, base + k2, base + sides + k2, base + sides + k))
            self.face_mats.append(m)
        self.faces.append(tuple(base + sides + k for k in range(sides)))
        self.face_mats.append(m)
        self.faces.append(tuple(base + k for k in reversed(range(sides))))
        self.face_mats.append(m)

    def to_object(self, name, coll):
        mesh = bpy.data.meshes.new(name + "_mesh")
        mesh.from_pydata(self.verts, [], self.faces)
        for mname in self.mat_names:
            mesh.materials.append(MATS[mname])
        mesh.update()
        for poly, mi in zip(mesh.polygons, self.face_mats):
            poly.material_index = mi
        obj = bpy.data.objects.new(name, mesh)
        coll.objects.link(obj)
        return obj


def build_player(idx, team, x, y, yaw, pose, is_keeper, role, coll):
    """One semi-submerged player as a single mesh.

    Below the waterline: swim trunks (team colour). Above: chest, shoulders, arms, neck,
    head and cap. The waterline sits at local z = 0.

    Animated players (role "shooter" / "saver") keep their yaw on the object's rotation
    instead of baking it into the mesh, so animate_shot() can rotate them. The shooter's
    right arm is a separate child object pivoting at the shoulder.
    """
    cap = "MAT_cap_red" if is_keeper else f"MAT_cap_{team}"
    skin = f"MAT_skin_{idx % len(SKIN_TONES)}"
    sides = 6 if LOW else 8
    animated = role is not None
    pm = PlayerMesh(0.0 if animated else yaw, PLAYER_SCALE)

    # Body: trunks under water, chest breaking the surface, neck, head, cap
    pm.box((0.0, 0.0, -0.15), (0.17, 0.25, 0.22), cap)
    pm.box((0.0, 0.0, 0.04), (0.18, 0.30, 0.16), skin)
    pm.box((0.0, 0.0, 0.14), (0.07, 0.07, 0.04), skin)
    pm.box((0.0, 0.0, 0.23), (0.14, 0.13, 0.14), skin)
    pm.box((0.0, 0.0, 0.265), (0.15, 0.145, 0.075), cap)
    if not LOW:
        for sign in (1.0, -1.0):
            pm.box((0.0, sign * 0.075, 0.235), (0.035, 0.02, 0.05), cap)   # cap ear guards
        pm.box((0.085, 0.0, 0.215), (0.03, 0.03, 0.035), skin)            # nose

    # Arms: shoulder -> elbow -> hand
    for side, sign in (("L", 1.0), ("R", -1.0)):
        if role == "shooter" and side == "R":
            continue  # separate animated arm below
        shoulder = (0.0, sign * 0.15, 0.09)
        elbow, hand = POSES[pose][side]
        pm.limb(shoulder, elbow, 0.030, skin, sides)
        pm.limb(elbow, hand, 0.026, skin, sides)
        if not LOW:
            pm.box(hand, (0.055, 0.055, 0.055), skin)

    player = pm.to_object(f"PROP_player_{team}_{idx:02d}", coll)
    player.location = (x, y, WATER_Z)
    if animated:
        player.rotation_euler = (0.0, 0.0, yaw)
    elif ANIMATE_PLAYERS:
        amp = 0.012 if idx % 2 == 0 else -0.012
        player.keyframe_insert("location", frame=1)
        player.location.z += amp
        player.keyframe_insert("location", frame=BUBBLE_FRAME // 2)
        player.location.z -= amp
        player.keyframe_insert("location", frame=BUBBLE_FRAME)

    arm = None
    if role == "shooter":
        am = PlayerMesh(0.0, PLAYER_SCALE)
        am.limb((0.0, 0.0, 0.0), ARM_ELBOW, 0.030, skin, sides)
        am.limb(ARM_ELBOW, ARM_HAND, 0.026, skin, sides)
        if not LOW:
            am.box(ARM_HAND, (0.055, 0.055, 0.055), skin)
        arm = am.to_object(f"PROP_player_{team}_{idx:02d}_arm", coll)
        arm.parent = player
        arm.location = _scaled(SHOULDER_R)
        arm.rotation_euler = (0.0, math.radians(ARM_REST_DEG), 0.0)
    return player, arm


def build_foam(fx, spots):
    """Small ripple rings on the surface around each player to sell the waterline."""
    rings = []
    radii = (0.20,) if LOW else (0.19, 0.27)
    for i, (x, y) in enumerate(spots):
        for j, r in enumerate(radii):
            bpy.ops.mesh.primitive_torus_add(
                major_segments=14, minor_segments=3,
                major_radius=r * PLAYER_SCALE, minor_radius=0.010 if j == 0 else 0.006,
                location=(x, y, WATER_Z + 0.004),
            )
            ring = bpy.context.active_object
            ring.name = f"foam_{i}_{j}"
            C.shade_flat(ring)
            set_mat(ring, "MAT_foam")
            rings.append(ring)
    foam = C.join_objects(rings, "FX_player_foam")
    C.link_only(foam, fx)


def build_players(players, fx):
    spots, actors = [], {}
    for idx, (team, x, y, yaw, pose, is_keeper, role) in enumerate(ROSTER):
        body, arm = build_player(idx, team, x, y, yaw, pose, is_keeper, role, players)
        if role == "shooter":
            actors["shooter"] = (body, arm)
        elif role == "saver":
            actors["saver"] = body
        spots.append((x, y))
    build_foam(fx, spots)
    return actors


def animate_shot(actors, ball_root):
    """Key the shot frame by frame: wind-up, throw, flight, save, parry, settle."""
    shooter, arm = actors["shooter"]
    saver = actors["saver"]
    base = ball_root.location.copy()
    start = ball_pos(1)
    for f in range(1, BUBBLE_FRAME + 1):
        shooter.location = (SHOOTER_XY[0], SHOOTER_XY[1], WATER_Z + shooter_rise(f))
        shooter.keyframe_insert("location", frame=f)
        arm.rotation_euler = (0.0, shooter_arm_angle(f), 0.0)
        arm.keyframe_insert("rotation_euler", frame=f)

        loc, rot = keeper_state(f)
        saver.location = loc
        saver.rotation_euler = rot
        saver.keyframe_insert("location", frame=f)
        saver.keyframe_insert("rotation_euler", frame=f)

        p = ball_pos(f)
        ball_root.location = (base.x + p[0] - start[0], base.y + p[1] - start[1], base.z + p[2] - start[2])
        ball_root.keyframe_insert("location", frame=f)


# ---------------------------------------------------------------------------
# Ball and bubbles
# ---------------------------------------------------------------------------

def build_ball(fx):
    """Exactly one ball, floating at the centre."""
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1 if LOW else 2, radius=BALL_RADIUS, location=BALL_POS)
    ball = bpy.context.active_object
    ball.name = "ball_body"
    C.assign_material(ball, "MAT_safety_yellow")

    seams = [ball]
    for i, rot in enumerate(((math.pi / 2, 0.0, 0.0), (0.0, math.pi / 2, 0.0))):
        bpy.ops.mesh.primitive_torus_add(
            major_segments=12, minor_segments=4,
            major_radius=BALL_RADIUS * 0.97, minor_radius=BALL_RADIUS * 0.0875,
            location=BALL_POS, rotation=rot,
        )
        seam = bpy.context.active_object
        seam.name = f"ball_seam_{i}"
        C.shade_flat(seam)
        C.assign_material(seam, "MAT_rubber")
        seams.append(seam)

    ball_obj = C.join_objects(seams, "FX_waterpolo_ball")
    C.link_only(ball_obj, fx)
    root = C.make_anchor("waterpolo_ball", BALL_POS, [ball_obj], fx)

    bpy.context.view_layer.update()
    for pivot_name, offset in (("PIVOT_ball_buoyancy", (0.0, 0.0, -0.035)), ("PIVOT_ball_throw", (0.0, 0.0, 0.0))):
        pivot = bpy.data.objects.new(pivot_name, None)
        pivot.empty_display_size = 0.15
        fx.objects.link(pivot)
        pivot.parent = root
        pivot.location = offset

    if not SHOT_SCENE:  # in the shot scene the ball is driven by animate_shot()
        ball_obj.keyframe_insert("location", frame=1)
        ball_obj.location.z += 0.04
        ball_obj.keyframe_insert("location", frame=BUBBLE_FRAME // 2)
        ball_obj.location.z -= 0.04
        ball_obj.keyframe_insert("location", frame=BUBBLE_FRAME)
    return root


def build_bubbles(fx):
    # Spots chosen to stay clear of the players for each layout
    spots = ((-1.45, 0.05), (-1.35, -0.55), (-1.0, -0.2)) if SHOT_SCENE else ((0.65, -0.45), (-0.65, 0.42), (-0.70, -0.30))
    if LOW:
        spots = spots[:2]
    for i, (x, y) in enumerate(spots):
        bpy.ops.mesh.primitive_ico_sphere_add(
            subdivisions=1, radius=0.03 + 0.01 * i, location=(x, y, WATER_Z - 0.015)
        )
        bubble = bpy.context.active_object
        bubble.name = f"FX_bubble_{i:02d}"
        C.assign_material(bubble, "MAT_water_light")
        C.link_only(bubble, fx)
        bubble.keyframe_insert("location", frame=1)
        bubble.location.z = WATER_Z + 0.16
        bubble.keyframe_insert("location", frame=BUBBLE_FRAME)
        bubble.location.z = WATER_Z - 0.015


def main() -> None:
    C.reset_scene()
    scene = bpy.context.scene

    C.link_library_materials(C.MATERIALS_BLEND)
    C.link_library_collection(C.VOXEL_KIT_BLEND, "COLL_voxel_kit")
    C.link_library_collection(C.LIGHTING_RIG_BLEND, "COLL_lighting_rig", place_in_scene=True)
    C.link_library_collection(C.CAMERA_RIG_BLEND, "COLL_camera_rig", place_in_scene=True)

    build_materials()

    stage = C.make_collection("SCN_waterpolo")
    base = C.make_collection("COLL_base", stage)
    props = C.make_collection("COLL_props", stage)
    players = C.make_collection("COLL_players", stage)
    fx = C.make_collection("COLL_fx", stage)

    build_environment(base)
    build_deck(base)
    build_field_markings(props)
    build_deck_furniture(props)
    build_tiles(props)
    build_lane_ropes(props)
    build_goal("00", -GOAL_X, props)
    build_goal("01", GOAL_X, props)
    actors = build_players(players, fx)
    ball_root = build_ball(fx)
    if SHOT_SCENE:
        animate_shot(actors, ball_root)
    build_bubbles(fx)

    scene.frame_start = 1
    scene.frame_end = BUBBLE_FRAME
    scene.frame_set(1)

    cam = bpy.data.objects.get("CAM_hero")
    scene.camera = cam

    C.set_eevee(scene)
    if LOW:
        return

    scene.render.image_settings.file_format = 'PNG'
    scene.render.film_transparent = False
    scene.render.resolution_percentage = 100

    for tag, res, ortho_prop in (("desktop", DESKTOP_RES, "ortho_desktop"), ("mobile", MOBILE_RES, "ortho_mobile")):
        scene.render.resolution_x, scene.render.resolution_y = res
        cam.data.ortho_scale = 8.5 if tag == "mobile" else cam[ortho_prop]
        scene.render.filepath = os.path.join(C.PREVIEWS_DIR, f"waterpolo_{tag}.png")
        bpy.ops.render.render(write_still=True)
        print(f"rendered {scene.render.filepath}")

    cam.data.ortho_scale = cam["ortho_desktop"]
    C.save(WATERPOLO_BLEND)


main()