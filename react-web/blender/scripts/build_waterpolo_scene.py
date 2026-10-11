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
GOAL_LINE_X = 2.47
GOAL_X = 2.42
CAGE_DEPTH = 0.45
BALL_POS = (0.0, 0.0, WATER_Z + 0.04)
BUBBLE_FRAME = 48

# Field: 4.94 units between goal lines plays as 30 m, so 1 unit = 6.07 m.
LINE_2M_X = GOAL_LINE_X - 0.33
LINE_5M_X = GOAL_LINE_X - 0.82


def bar_between(name, p1, p2, radius=0.025):
    p1, p2 = Vector(p1), Vector(p2)
    direction = p2 - p1
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=8, radius=radius, depth=direction.length, location=(p1 + p2) / 2
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.rotation_mode = 'QUATERNION'
    obj.rotation_quaternion = direction.to_track_quat('Z', 'Y')
    return obj


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
        C.add_box("wall_n", (6.1, 0.03, DECK_TOP_Z), location=(0.0, 1.485, 0.0)),
        C.add_box("wall_s", (6.1, 0.03, DECK_TOP_Z), location=(0.0, -1.485, 0.0)),
        C.add_box("wall_e", (0.03, 2.94, DECK_TOP_Z), location=(3.035, 0.0, 0.0)),
        C.add_box("wall_w", (0.03, 2.94, DECK_TOP_Z), location=(-3.035, 0.0, 0.0)),
    ]
    basin = C.join_objects(walls, "PROP_pool_walls")
    C.assign_material(basin, "MAT_off_white")
    C.link_only(basin, base)

    water = C.add_box("PROP_water", (5.98, 2.9, 0.55), location=(0.0, 0.0, WATER_Z - 0.575))
    C.assign_material(water, "MAT_water_deep")
    C.link_only(water, base)

    surface = C.add_box("PROP_water_surface", (5.98, 2.9, 0.02), location=(0.0, 0.0, WATER_Z - 0.02))
    C.assign_material(surface, "MAT_water_surface")
    C.link_only(surface, base)

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


def build_ball(fx):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1 if LOW else 2, radius=0.16, location=BALL_POS)
    ball = bpy.context.active_object
    ball.name = "ball_body"
    C.assign_material(ball, "MAT_safety_yellow")

    seams = [ball]
    for i, rot in enumerate(((math.pi / 2, 0.0, 0.0), (0.0, math.pi / 2, 0.0))):
        bpy.ops.mesh.primitive_torus_add(
            major_segments=12, minor_segments=4, major_radius=0.155, minor_radius=0.014,
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

    ball_obj.keyframe_insert("location", frame=1)
    ball_obj.location.z += 0.04
    ball_obj.keyframe_insert("location", frame=BUBBLE_FRAME // 2)
    ball_obj.location.z -= 0.04
    ball_obj.keyframe_insert("location", frame=BUBBLE_FRAME)


def build_bubbles(fx):
    for i, (x, y) in enumerate(((0.6, 0.5), (0.45, 0.7), (0.75, 0.62)) if not LOW else ((0.6, 0.5), (0.75, 0.62))):
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

    stage = C.make_collection("SCN_waterpolo")
    base = C.make_collection("COLL_base", stage)
    props = C.make_collection("COLL_props", stage)
    fx = C.make_collection("COLL_fx", stage)

    floor = C.add_box("ENV_floor", (40.0, 40.0, 0.2), location=(0.0, 0.0, -0.2))
    C.assign_material(floor, "MAT_dark_metal")
    C.link_only(floor, base)

    build_deck(base)
    build_field_markings(props)
    build_deck_furniture(props)
    build_tiles(props)
    build_lane_ropes(props)
    build_goal("00", -GOAL_X, props)
    build_goal("01", GOAL_X, props)
    build_ball(fx)
    build_bubbles(fx)

    scene.frame_start = 1
    scene.frame_end = BUBBLE_FRAME
    scene.frame_set(1)

    cam = bpy.data.objects.get("CAM_hero")
    scene.camera = cam
    
    cam.location = Vector((7.0, -7.0, 5.5))
    pivot = bpy.data.objects.get("PIVOT_cam_target")
    if pivot:
        pivot.location = Vector((0.0, 0.0, 1.5))
        from mathutils import Quaternion
        rot_quat = (pivot.location - cam.location).to_track_quat('-Z', 'Y')
        cam.rotation_euler = rot_quat.to_euler()
    cam.data.lens = 35

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
