import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import bpy
from mathutils import Matrix, Vector

DETECTOR_BLEND = os.path.join(C.BLENDER_ROOT, "detector", "detector_scene.blend")
DESKTOP_RES = (1600, 900)
MOBILE_RES = (430, 932)
LOW = os.environ.get("WEBCV_DETAIL") == "low"

BEAM_Z = 2.4
BASE_TOP_Z = 0.45

# Decay animation (frames). Everything loops back to frame 1.
F_START = 1
F_DECAY = 30   # kaon decays here
F_STOP = 75    # pion reaches the calorimeter
ANIM_END = 90  # hold the final state, then loop
PREVIEW_FRAME = 62  # frame used for the PNG previews (pion in flight, neutrinos out)

# Stations along the beam (x), in NA62 order:
# KTAG -> GTK -> CHANTI -> decay volume (LAVs) -> STRAW1/2 -> MNP33 -> STRAW3/4
# -> RICH -> CHOD -> LKr -> MUV1 -> MUV2 -> iron wall -> MUV3 -> SAC
KTAG_X = -5.25
GTK_X = -4.45
CHANTI_XS = (-3.95, -3.8)
LAV_XS = (-3.4, -3.1, -2.35, -0.55, 0.05)
STRAW_XS = (-2.65, -2.0, -0.8, -0.2)
MAGNET_X = -1.4
RICH_X0 = 0.8
CHOD_X = 3.55
LKR_X = 4.35
MUV1_X = 5.35
MUV2_X = 6.05
WALL_X = 6.72
MUV3_X = 7.25
SAC_X = 7.6

# Decay kinematics (stylised K+ -> pi+ nu nubar)
KAON_X0 = -6.35
DECAY_X = -3.2
PION_SLOPE_IN = 0.03    # dy/dx before the magnet
PION_SLOPE_OUT = 0.14   # dy/dx after the magnet (positive pion is bent sideways)
# Neutrino end points relative to the decay vertex (dx, y, dz): one up and over the
# magnet, one out sideways past the base, so both leave the detector in clear view.
NU_DIRS = ((3.2, 1.9, 2.9), (3.4, -3.4, -0.5))

# Vacuum tank: narrow upstream section, short cone, wide section that the
# spectrometer sits in (the magnet yoke wraps around it).
TANK_X0 = -3.55
TANK_X1 = 0.3
TANK_STEP0 = -2.95
TANK_STEP1 = -2.75
TANK_R_NARROW = 0.95
TANK_R_WIDE = 1.2


# ---------------------------------------------------------------- helpers
def local_cylinder(name, radius, depth, location, rotation=(0.0, math.pi / 2, 0.0), vertices=12, open_ended=False):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=8 if LOW else vertices,
        radius=radius,
        depth=depth,
        end_fill_type="NOTHING" if open_ended else "TRIFAN",
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.active_object
    obj.name = name
    return obj


def x_axis_rot(spin=0.0):
    """Euler for a cylinder lying along x, optionally spun about its own axis."""
    m = Matrix.Rotation(math.pi / 2, 3, "Y") @ Matrix.Rotation(spin, 3, "Z")
    return tuple(m.to_euler())


def rot_box(name, size, location, rotation=(0.0, 0.0, 0.0)):
    """Centred box with an arbitrary rotation, transform applied."""
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location, rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    C.shade_flat(obj)
    return obj


def ring_of_blocks(name, x, count, radius, size, phase=0.0):
    """Blocks around the beam axis. size = (along beam, tangential, radial)."""
    blocks = []
    for k in range(count):
        a = phase + 2.0 * math.pi * k / count
        blocks.append(
            rot_box(
                f"{name}_{k}",
                size,
                (x, radius * math.cos(a), BEAM_Z + radius * math.sin(a)),
                (a - math.pi / 2, 0.0, 0.0),
            )
        )
    return blocks


def group(parts, name, material):
    obj = C.join_objects(parts, name)
    C.assign_material(obj, material)
    return obj


def tank_radius(x):
    if x <= TANK_STEP0:
        return TANK_R_NARROW
    if x >= TANK_STEP1:
        return TANK_R_WIDE
    t = (x - TANK_STEP0) / (TANK_STEP1 - TANK_STEP0)
    return TANK_R_NARROW + t * (TANK_R_WIDE - TANK_R_NARROW)


# ------------------------------------------------------------------- base
def build_base(base):
    slab = C.add_box("base_slab", (14.4, 5.4, 0.3), location=(0.7, 0.0, 0.0))
    step = C.add_box("base_step", (13.6, 4.6, BASE_TOP_Z - 0.3), location=(0.7, 0.0, 0.3))
    plinth = C.join_objects([slab, step], "PROP_plinth")
    C.assign_material(plinth, "MAT_dark_metal")
    C.link_only(plinth, base)

    floor = C.add_box("ENV_floor", (60.0, 60.0, 0.2), location=(0.0, 0.0, -0.2))
    C.assign_material(floor, "MAT_dark_metal")
    C.link_only(floor, base)


# ------------------------------------------------------------------- beam
def build_beam_pipe(hero):
    xs = (-5.5, -3.75, -2.0, -0.25, 1.5, 3.25, 5.0, 6.75)
    if LOW:
        xs = xs[::2]
    segments = [local_cylinder(f"seg_{i}", 0.09, 1.75, (x, 0.0, BEAM_Z), vertices=8) for i, x in enumerate(xs)]
    pipe = C.join_objects(segments, "HERO_beam_pipe")
    C.assign_material(pipe, "MAT_light_metal")
    C.link_only(pipe, hero)
    return pipe


# ------------------------------------------------------------------- KTAG
def build_ktag(hero):
    """Differential Cherenkov counter: gas vessel, ring of 8 PMT octants at the upstream end."""
    vessel = group(
        [
            local_cylinder("ktag_body", 0.3, 0.9, (KTAG_X, 0.0, BEAM_Z)),
            local_cylinder("ktag_nose", 0.18, 0.25, (KTAG_X + 0.55, 0.0, BEAM_Z)),
            local_cylinder("ktag_flange", 0.42, 0.06, (KTAG_X - 0.47, 0.0, BEAM_Z)),
        ],
        "ktag_vessel",
        "MAT_light_metal",
    )
    pmts = group(
        ring_of_blocks("ktag_pmt", KTAG_X - 0.6, 8, 0.4, (0.22, 0.2, 0.2)),
        "ktag_pmts",
        "MAT_science_blue",
    )
    ktag = C.join_objects([vessel, pmts], "PROP_na62_ktag")
    C.link_only(ktag, hero)
    return ktag


# -------------------------------------------------------------------- GTK
def build_gtk(hero):
    """Three silicon pixel stations: small sensor on a larger readout board."""
    boards, sensors = [], []
    for i in range(3):
        x = GTK_X + i * 0.16
        boards.append(C.add_box(f"gtk_pcb_{i}", (0.02, 0.5, 0.5), location=(x, 0.0, BEAM_Z), base_origin=False))
        sensors.append(C.add_box(f"gtk_sensor_{i}", (0.04, 0.3, 0.17), location=(x + 0.03, 0.0, BEAM_Z), base_origin=False))
    gtk = C.join_objects(
        [group(boards, "gtk_boards", "MAT_na62_green"), group(sensors, "gtk_sensors", "MAT_science_blue")],
        "PROP_na62_gtk",
    )
    C.link_only(gtk, hero)
    return gtk


# ----------------------------------------------------------------- CHANTI
def build_chanti(hero):
    """Veto stations: square scintillator frames around the beam."""
    s, t = 0.64, 0.1
    parts = []
    for i, x in enumerate(CHANTI_XS):
        off = (s - t) / 2
        parts += [
            C.add_box(f"chanti_{i}_top", (0.06, s, t), location=(x, 0.0, BEAM_Z + off), base_origin=False),
            C.add_box(f"chanti_{i}_bot", (0.06, s, t), location=(x, 0.0, BEAM_Z - off), base_origin=False),
            C.add_box(f"chanti_{i}_l", (0.06, t, s - 2 * t), location=(x, -off, BEAM_Z), base_origin=False),
            C.add_box(f"chanti_{i}_r", (0.06, t, s - 2 * t), location=(x, off, BEAM_Z), base_origin=False),
        ]
    chanti = group(parts, "PROP_na62_chanti", "MAT_off_white")
    C.link_only(chanti, hero)
    return chanti


# ------------------------------------------------------------- decay tank
def build_decay_tank(hero):
    """Solid stepped vacuum tank: narrow tube, cone, wide tube, with rib rings."""
    n_len = TANK_STEP0 - TANK_X0
    w_len = TANK_X1 - TANK_STEP1
    c_len = TANK_STEP1 - TANK_STEP0
    verts = 8 if LOW else 24
    narrow = local_cylinder("tank_narrow", TANK_R_NARROW, n_len, ((TANK_X0 + TANK_STEP0) / 2, 0.0, BEAM_Z), vertices=24, open_ended=True)
    wide = local_cylinder("tank_wide", TANK_R_WIDE, w_len, ((TANK_STEP1 + TANK_X1) / 2, 0.0, BEAM_Z), vertices=24, open_ended=True)
    bpy.ops.mesh.primitive_cone_add(
        vertices=verts,
        radius1=TANK_R_NARROW,
        radius2=TANK_R_WIDE,
        depth=c_len,
        end_fill_type="NOTHING",
        location=((TANK_STEP0 + TANK_STEP1) / 2, 0.0, BEAM_Z),
        rotation=(0.0, math.pi / 2, 0.0),
    )
    cone = bpy.context.active_object
    cone.name = "tank_cone"
    C.shade_flat(cone)
    parts = [narrow, cone, wide]

    ribs = [(TANK_X0, 0.14), (TANK_X1, 0.14)]
    step = 0.75 if LOW else 0.5
    x = TANK_X0 + step
    while x < TANK_X1 - 0.2:
        ribs.append((x, 0.07))
        x += step
    for i, (rx, depth) in enumerate(ribs):
        parts.append(local_cylinder(f"tank_rib_{i}", tank_radius(rx) + 0.04, depth, (rx, 0.0, BEAM_Z), vertices=24, open_ended=True))

    tank = group(parts, "PROP_na62_decay_tank", "MAT_na62_green")
    C.link_only(tank, hero)
    return tank


# -------------------------------------------------------------------- LAV
def build_lav_rings(hero):
    """Large-angle vetoes: rings of lead-glass blocks hugging the tank wall."""
    count = 8 if LOW else 12
    blocks = []
    for i, x in enumerate(LAV_XS):
        r = tank_radius(x) + 0.12
        tangent = 2.0 * r * math.tan(math.pi / count) + 0.02
        blocks += ring_of_blocks(f"lav_{i}", x, count, r, (0.16, tangent, 0.16))
    lav = group(blocks, "PROP_na62_lav_rings", "MAT_safety_yellow")
    C.link_only(lav, hero)
    return lav


# ------------------------------------------------------------------ straws
def build_straw_chamber(index, x, hero):
    """Octagonal frame, four views (vertical, horizontal, +45, -45), beam hole in the middle."""
    apothem = 1.0
    frame = group(
        ring_of_blocks(f"straw_frame_{index}", x, 8, apothem, (0.14, 2 * apothem * math.tan(math.pi / 8) + 0.1, 0.1)),
        f"straw_frame_{index}",
        "MAT_light_metal",
    )

    views = (0.0, math.pi / 2, math.pi / 4, -math.pi / 4)
    step = 0.28 if LOW else 0.2
    ks = (-3, -1, 1, 3) if LOW else (-4, -3, -2, -1, 1, 2, 3, 4)
    reach = 0.93
    straws = []
    for v, theta in enumerate(views):
        vx = x + (v - 1.5) * 0.045
        for k in ks:
            s = k * step
            half = math.sqrt(reach**2 - s**2)
            y = s * math.cos(theta)
            z = BEAM_Z + s * math.sin(theta)
            straws.append(
                local_cylinder(
                    f"straw_{index}_{v}_{k}",
                    0.03,
                    2 * half,
                    (vx, y, z),
                    rotation=(theta, 0.0, 0.0),
                    vertices=6,
                )
            )
    straw_obj = group(straws, f"straw_grid_{index}", "MAT_straw_gold")

    chamber = C.join_objects([frame, straw_obj], f"PROP_na62_straw_chamber_{index}")
    C.link_only(chamber, hero)
    return chamber


# ------------------------------------------------------------------ magnet
def build_magnet(hero):
    """MNP33 dipole: window-frame iron yoke around the tank, coil end-turns front and back."""
    dx = 0.7
    z_off = 1.5
    yoke = group(
        [
            C.add_box("magnet_top", (dx, 3.5, 0.5), location=(MAGNET_X, 0.0, BEAM_Z + z_off), base_origin=False),
            C.add_box("magnet_bottom", (dx, 3.5, 0.5), location=(MAGNET_X, 0.0, BEAM_Z - z_off), base_origin=False),
            C.add_box("magnet_left", (dx, 0.5, 2.5), location=(MAGNET_X, -z_off, BEAM_Z), base_origin=False),
            C.add_box("magnet_right", (dx, 0.5, 2.5), location=(MAGNET_X, z_off, BEAM_Z), base_origin=False),
        ],
        "magnet_yoke",
        "MAT_dark_metal",
    )
    coils = group(
        [
            C.add_box(f"magnet_coil_{i}_{j}", (0.1, 2.2, 0.5), location=(MAGNET_X + sx * (dx / 2 + 0.03), 0.0, BEAM_Z + sz * z_off), base_origin=False)
            for i, sx in enumerate((-1, 1))
            for j, sz in enumerate((-1, 1))
        ],
        "magnet_coils",
        "MAT_straw_gold",
    )
    magnet = C.join_objects([yoke, coils], "PROP_na62_magnet")
    C.link_only(magnet, hero)
    return magnet


# -------------------------------------------------------------------- RICH
def build_rich(hero):
    """Long steel vessel that narrows downstream, rib rings, mirror end plate, two PMT flanges."""
    radii = (1.9, 1.8, 1.7)
    shell = group(
        [local_cylinder(f"rich_{i}", r, 0.8, (RICH_X0 + 0.8 * i, 0.0, BEAM_Z), vertices=16) for i, r in enumerate(radii)],
        "rich_shell",
        "MAT_light_metal",
    )
    rib_r = (1.9, 1.85, 1.75, 1.7)
    ribs = group(
        [
            local_cylinder(f"rich_rib_{i}", r + 0.05, 0.07, (RICH_X0 - 0.4 + 0.8 * i, 0.0, BEAM_Z), vertices=16, open_ended=True)
            for i, r in enumerate(rib_r)
        ],
        "rich_ribs",
        "MAT_light_metal",
    )
    mirror = group(
        [local_cylinder("rich_mirror", 1.72, 0.08, (RICH_X0 + 2.44, 0.0, BEAM_Z), vertices=16)],
        "rich_mirror",
        "MAT_dark_metal",
    )
    ears = group(
        [
            local_cylinder(f"rich_pmt_flange_{i}", 0.42, 0.3, (RICH_X0, sy * (radii[0] + 0.1), BEAM_Z), rotation=(math.pi / 2, 0.0, 0.0))
            for i, sy in enumerate((-1, 1))
        ],
        "rich_pmt_flanges",
        "MAT_science_blue",
    )
    rich = C.join_objects([shell, ribs, mirror, ears], "PROP_na62_rich")
    C.link_only(rich, hero)
    return rich


# -------------------------------------------------------------------- CHOD
def build_chod(hero):
    """Two crossed planes of scintillator slabs (vertical, then horizontal) with a beam gap."""
    if LOW:
        pos = [(i - 2.5) * 0.4 for i in range(6)]
        gap = 0.3
    else:
        pos = [(i - 5.5) * 0.2 for i in range(12)]
        gap = 0.15
    pos = [p for p in pos if abs(p) > gap]
    r = 1.15
    parts = []
    for i, p in enumerate(pos):
        length = 2 * math.sqrt(r**2 - p**2)
        parts.append(C.add_box(f"chod_v_{i}", (0.04, 0.18, length), location=(CHOD_X - 0.04, p, BEAM_Z), base_origin=False))
        parts.append(C.add_box(f"chod_h_{i}", (0.04, length, 0.18), location=(CHOD_X + 0.04, 0.0, BEAM_Z + p), base_origin=False))
    chod = group(parts, "PROP_na62_chod", "MAT_off_white")
    C.link_only(chod, hero)
    return chod


# --------------------------------------------------------------------- LKr
def build_lkr(hero):
    """Liquid krypton calorimeter: round cryostat with an octagonal active face."""
    cryostat = group(
        [local_cylinder("lkr_cryostat", 1.28, 1.1, (LKR_X, 0.0, BEAM_Z), vertices=16)],
        "lkr_cryostat",
        "MAT_science_blue",
    )
    face = group(
        [local_cylinder("lkr_face", 1.1, 0.06, (LKR_X - 0.58, 0.0, BEAM_Z), rotation=x_axis_rot(math.pi / 8), vertices=8)],
        "lkr_face",
        "MAT_off_white",
    )
    lkr = C.join_objects([cryostat, face], "PROP_na62_lkr")
    C.link_only(lkr, hero)
    return lkr


# -------------------------------------------------------------------- muons
def build_sandwich(name, x_center, depth, layers, horizontal_strips):
    """Iron/scintillator sandwich. Scintillator layers are split into strips."""
    size = 2.4
    pitch = depth / layers
    x0 = x_center - depth / 2
    iron_t, scint_t = 0.6 * pitch, 0.25 * pitch
    n_strips = 1 if LOW else 6
    w = size / n_strips
    iron, scint = [], []
    for i in range(layers):
        iron.append(C.add_box(f"{name}_iron_{i}", (iron_t, size, size), location=(x0 + (i + 0.3) * pitch, 0.0, BEAM_Z), base_origin=False))
        sx = x0 + (i + 0.8) * pitch
        for j in range(n_strips):
            c = -size / 2 + w * (j + 0.5)
            dims_yz = (size, w - 0.02) if horizontal_strips else (w - 0.02, size)
            loc_yz = (0.0, c) if horizontal_strips else (c, 0.0)
            scint.append(
                C.add_box(
                    f"{name}_scint_{i}_{j}",
                    (scint_t, dims_yz[0], dims_yz[1]),
                    location=(sx, loc_yz[0], BEAM_Z + loc_yz[1]),
                    base_origin=False,
                )
            )
    return [group(iron, f"{name}_iron", "MAT_dark_metal"), group(scint, f"{name}_scint", "MAT_off_white")]


def build_muon_system(hero):
    layers = 3 if LOW else 6
    muv1 = build_sandwich("muv1", MUV1_X, 0.75, layers, horizontal_strips=True)
    muv2 = build_sandwich("muv2", MUV2_X, 0.65, layers, horizontal_strips=False)
    wall = group(
        [C.add_box("iron_wall", (0.7, 2.6, 2.6), location=(WALL_X, 0.0, BEAM_Z), base_origin=False)],
        "iron_wall",
        "MAT_dark_metal",
    )
    slabs = C.join_objects(muv1 + muv2 + [wall], "PROP_na62_muv_slabs")
    C.link_only(slabs, hero)

    # MUV3: grid of scintillator tiles with a gap for the beam
    n = 4 if LOW else 6
    pitch = 2.52 / n
    tiles = []
    for i in range(n):
        for j in range(n):
            if i in (n // 2 - 1, n // 2) and j in (n // 2 - 1, n // 2):
                continue
            dy = (i - (n - 1) / 2) * pitch
            dz = (j - (n - 1) / 2) * pitch
            tiles.append(
                C.add_box(f"muv3_tile_{i}_{j}", (0.08, pitch - 0.03, pitch - 0.03), location=(MUV3_X, dy, BEAM_Z + dz), base_origin=False)
            )
    muv3 = group(tiles, "PROP_na62_muv3", "MAT_off_white")
    C.link_only(muv3, hero)
    return slabs, muv3


def build_sac(hero):
    """Small-angle calorimeter sitting on the beam axis at the very end."""
    sac = group(
        [local_cylinder("sac_body", 0.2, 0.35, (SAC_X, 0.0, BEAM_Z))],
        "PROP_na62_sac",
        "MAT_science_blue",
    )
    C.link_only(sac, hero)
    return sac


# ----------------------------------------------------------------- support
def build_support_frame(props):
    rails = [
        C.add_box(f"rail_{i}", (13.2, 0.12, 0.12), location=(0.7, y, BASE_TOP_Z + 0.05))
        for i, y in enumerate((-1.9, 1.9))
    ]
    feet = [
        C.add_box(f"foot_{i}", (0.5, 0.5, 0.14), location=(x, y, BASE_TOP_Z))
        for i, (x, y) in enumerate(
            ((-5.0, -1.9), (-5.0, 1.9), (-2.9, -1.9), (-2.9, 1.9), (1.8, -1.9), (1.8, 1.9), (5.9, -1.9), (5.9, 1.9))
        )
    ]
    legs = []
    # no legs under the magnet (-1.75 .. -1.05)
    leg_xs = (-5.0, -3.6, -2.7, -0.6, 0.9, 2.6, 4.35, 5.9) if not LOW else (-5.0, -2.7, 0.9, 4.35)
    for i, x in enumerate(leg_xs):
        for j, y in enumerate((-1.55, 1.55)):
            legs.append(C.add_box(f"leg_{i}_{j}", (0.14, 0.14, BEAM_Z - 1.1 - BASE_TOP_Z), location=(x, y, BASE_TOP_Z + 0.1)))
    frame = C.join_objects(rails + feet + legs, "PROP_support_frame")
    C.assign_material(frame, "MAT_na62_green")
    C.link_only(frame, props)
    return frame


# --------------------------------------------------------------------- FX
def set_linear_keys():
    bpy.context.preferences.edit.keyframe_new_interpolation_type = "LINEAR"


def key_loc(obj, pairs):
    for frame, loc in pairs:
        obj.location = loc
        obj.keyframe_insert("location", frame=frame)


def key_scale(obj, pairs):
    base = Vector(obj.scale)
    for frame, k in pairs:
        obj.scale = base * k
        obj.keyframe_insert("scale", frame=frame)


GLOW_COLORS = {"yellow": (1.0, 0.7, 0.08), "cyan": (0.1, 0.85, 1.0), "white": (1.0, 1.0, 1.0)}


def glow_material(key):
    name = f"MAT_fx_glow_{key}"
    mat = bpy.data.materials.get(name)
    if mat:
        return mat
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()
    emission = nt.nodes.new("ShaderNodeEmission")
    emission.inputs["Color"].default_value = (*GLOW_COLORS[key], 1.0)
    emission.inputs["Strength"].default_value = 8.0
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    nt.links.new(emission.outputs["Emission"], out.inputs["Surface"])
    return mat


def assign_glow(obj, key):
    if obj.data is None:
        return
    obj.data = obj.data.copy()  # never touch the kit's shared mesh
    obj.data.materials.clear()
    obj.data.materials.append(glow_material(key))


def spawn_particle(name, mult, material, coll):
    obj = C.dup(C.kit_obj("FX_signature_particle"), name, coll=coll)
    obj.scale = Vector(obj.scale) * mult
    try:
        assign_glow(obj, material)
    except Exception as exc:  # keep the kit look if it can't be re-materialled
        print(f"glow skipped for {obj.name}: {exc}")
    return obj


def grow_segment(name, p0, p1, f0, f1, thickness, material, coll):
    """Thin bar from p0 to p1 that grows from p0 between frames f0 and f1 (a track)."""
    d = Vector(p1) - Vector(p0)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=p0)
    obj = bpy.context.active_object
    obj.name = name
    obj.data.transform(Matrix.Translation((0.5, 0.0, 0.0)))  # origin at the start of the bar
    obj.rotation_euler = (0.0, -math.atan2(d.z, math.hypot(d.x, d.y)), math.atan2(d.y, d.x))
    C.shade_flat(obj)
    assign_glow(obj, material)
    C.link_only(obj, coll)
    obj.scale = (0.0, thickness, thickness)
    obj.keyframe_insert("scale", frame=F_START)
    if f0 > F_START:
        obj.keyframe_insert("scale", frame=f0)
    obj.scale = (d.length, thickness, thickness)
    obj.keyframe_insert("scale", frame=f1)
    return obj


def pop_marker(name, loc, frame, size, coll, material="cyan", fade_after=None):
    """Cube that pops into existence at `frame` (a detector hit or flash)."""
    obj = rot_box(name, (size, size, size), loc)
    assign_glow(obj, material)
    C.link_only(obj, coll)
    frame = max(int(round(frame)), F_START + 1)
    pairs = [(F_START, 0.0), (frame - 1, 0.0), (frame, 1.0)]
    if fade_after:
        pairs += [(frame + fade_after, 0.0)]
    key_scale(obj, pairs)
    return obj


def frame_between(x, xa, xb, fa, fb):
    return fa + (x - xa) / (xb - xa) * (fb - fa)


def pion_path():
    """Straight, then a smooth parabolic arc through the magnet (uniform B field), then straight."""
    samples = 3 if LOW else 8
    mag_in, mag_out = MAGNET_X - 0.35, MAGNET_X + 0.35
    length = mag_out - mag_in
    x_end = LKR_X - 0.6
    y_in = PION_SLOPE_IN * (mag_in - DECAY_X)

    def y_mag(x):
        u = x - mag_in
        return y_in + PION_SLOPE_IN * u + 0.5 * (PION_SLOPE_OUT - PION_SLOPE_IN) * u * u / length

    pts = [(DECAY_X, 0.0)]
    for k in range(samples + 1):
        x = mag_in + length * k / samples
        pts.append((x, y_mag(x)))
    pts.append((x_end, y_mag(mag_out) + PION_SLOPE_OUT * (x_end - mag_out)))
    return pts


def path_y(path, x):
    for (xa, ya), (xb, yb) in zip(path, path[1:]):
        if xa <= x <= xb:
            return ya + (x - xa) / (xb - xa) * (yb - ya)
    return path[-1][1]


def build_decay_animation(fx):
    """Static detector; a K+ comes down the beam, decays in the tank, the pi+ is bent by
    the magnet and stops in the calorimeter, the neutrinos leave unseen."""
    set_linear_keys()
    start = (KAON_X0, 0.0, BEAM_Z)
    decay = (DECAY_X, 0.0, BEAM_Z)

    # --- kaon: GTK hits on the way in, then the decay flash
    kaon = spawn_particle("FX_kaon", 1.0, "yellow", fx)
    key_loc(kaon, [(F_START, start), (F_DECAY, decay)])
    key_scale(kaon, [(F_START, 1.0), (F_DECAY, 1.0), (F_DECAY + 1, 0.0)])
    grow_segment("FX_kaon_trail", start, decay, F_START, F_DECAY, 0.06, "yellow", fx)
    for i in range(3):
        x = GTK_X + i * 0.16 + 0.03
        pop_marker(f"FX_gtk_hit_{i}", (x, 0.0, BEAM_Z), frame_between(x, KAON_X0, DECAY_X, F_START, F_DECAY), 0.12, fx)
    pop_marker("FX_decay_flash", decay, F_DECAY, 0.4, fx, material="yellow", fade_after=8)

    # --- charged pion: follows the curved path (bent by the magnet)
    path = pion_path()
    x_end = path[-1][0]
    pts = [(x, y, BEAM_Z) for x, y in path]
    pion_frames = [frame_between(p[0], DECAY_X, x_end, F_DECAY, F_STOP) for p in pts]
    pion = spawn_particle("FX_pion", 0.7, "cyan", fx)
    key_loc(pion, [(F_START, pts[0])] + list(zip(pion_frames, pts)))
    key_scale(pion, [(F_START, 0.0), (F_DECAY, 0.0), (F_DECAY + 1, 1.0), (F_STOP, 1.0), (F_STOP + 1, 0.0)])
    for i in range(len(pts) - 1):
        grow_segment(f"FX_pion_trail_{i}", pts[i], pts[i + 1], pion_frames[i], pion_frames[i + 1], 0.07, "cyan", fx)

    # pion hits: straw chambers, CHOD, then a bigger flash where it enters the LKr
    for i, x in enumerate(STRAW_XS):
        f = frame_between(x, DECAY_X, x_end, F_DECAY, F_STOP)
        pop_marker(f"FX_straw_hit_{i}", (x, path_y(path, x), BEAM_Z), f, 0.12, fx)
    pop_marker("FX_chod_hit", (CHOD_X, path_y(path, CHOD_X), BEAM_Z), frame_between(CHOD_X, DECAY_X, x_end, F_DECAY, F_STOP), 0.12, fx)
    pop_marker("FX_lkr_flash", (x_end, path[-1][1], BEAM_Z), F_STOP, 0.35, fx)

    # --- neutrinos: fly clear out of the detector at wide angles, nothing sees them
    f_out = F_DECAY + 40
    for i, (dx, dy, dz) in enumerate(NU_DIRS):
        nu = spawn_particle(f"FX_neutrino_{i}", 0.55, "white", fx)
        end = (DECAY_X + dx, dy, BEAM_Z + dz)
        key_loc(nu, [(F_START, decay), (F_DECAY, decay), (f_out, end)])
        key_scale(nu, [(F_START, 0.0), (F_DECAY, 0.0), (F_DECAY + 1, 1.0), (f_out, 1.0), (f_out + 1, 0.0)])
        grow_segment(f"FX_neutrino_trail_{i}", decay, end, F_DECAY, f_out, 0.04, "white", fx)


# ------------------------------------------------------- on-top glow overlay
def _contains(lc, name):
    return lc.name == name or any(_contains(c, name) for c in lc.children)


def _find_lc(lc, name):
    if lc.name == name:
        return lc
    for child in lc.children:
        found = _find_lc(child, name)
        if found:
            return found
    return None


def _isolate(lc, keep):
    for child in lc.children:
        if child.name == keep:
            continue
        if _contains(child, keep):
            _isolate(child, keep)
        else:
            child.exclude = True


def _world_color(scene):
    world = scene.world
    if world and world.use_nodes:
        for node in world.node_tree.nodes:
            if node.type == "BACKGROUND":
                c = node.inputs["Color"].default_value
                return (c[0], c[1], c[2], 1.0)
    if world:
        return (*world.color, 1.0)
    return (0.05, 0.05, 0.06, 1.0)


def setup_on_top_glow(scene):
    """Render COLL_fx on its own view layer and composite it over the scene, with bloom.
    The detectors stay solid; particles and tracks show through them.
    Returns a restore() function that undoes everything (so the saved .blend still shows
    the particles in the viewport), or None if the setup failed."""
    main_vl = scene.view_layers[0]
    fx_lc = _find_lc(main_vl.layer_collection, "COLL_fx")
    fx_vl = None
    try:
        fx_lc.exclude = True  # main layer renders the detector only

        fx_vl = scene.view_layers.new("FX_TOP")
        _isolate(fx_vl.layer_collection, "COLL_fx")

        scene.use_nodes = True
        tree = scene.node_tree
        tree.nodes.clear()
        n = tree.nodes

        rl_main = n.new("CompositorNodeRLayers")
        rl_main.layer = main_vl.name
        rl_fx = n.new("CompositorNodeRLayers")
        rl_fx.layer = fx_vl.name

        bg = n.new("CompositorNodeRGB")
        bg.outputs[0].default_value = _world_color(scene)

        over_main = n.new("CompositorNodeAlphaOver")   # detector over world colour
        over_fx = n.new("CompositorNodeAlphaOver")     # particles over that, ignoring depth
        glare = n.new("CompositorNodeGlare")
        glare.glare_type = "FOG_GLOW"
        glare.threshold = 0.4
        glare.size = 8
        glare.mix = 1.0                                 # glow only
        add = n.new("CompositorNodeMixRGB")
        add.blend_type = "ADD"
        add.inputs[0].default_value = 1.0
        comp = n.new("CompositorNodeComposite")

        L = tree.links.new
        L(bg.outputs[0], over_main.inputs[1])
        L(rl_main.outputs["Image"], over_main.inputs[2])
        L(over_main.outputs[0], over_fx.inputs[1])
        L(rl_fx.outputs["Image"], over_fx.inputs[2])
        L(rl_fx.outputs["Image"], glare.inputs[0])
        L(over_fx.outputs[0], add.inputs[1])
        L(glare.outputs[0], add.inputs[2])
        L(add.outputs[0], comp.inputs[0])
    except Exception as exc:
        print(f"on-top glow compositing skipped: {exc}")
        fx_lc.exclude = False
        if fx_vl is not None:
            scene.view_layers.remove(fx_vl)
        return None

    def restore():
        fx_lc.exclude = False
        scene.view_layers.remove(fx_vl)
        scene.use_nodes = False
        scene.render.film_transparent = False

    return restore


def fx_objects(coll):
    return list(coll.all_objects)


def main() -> None:
    C.reset_scene()
    scene = bpy.context.scene

    C.link_library_materials(C.MATERIALS_BLEND)
    C.link_library_collection(C.VOXEL_KIT_BLEND, "COLL_voxel_kit")
    C.link_library_collection(C.LIGHTING_RIG_BLEND, "COLL_lighting_rig", place_in_scene=True)
    C.link_library_collection(C.CAMERA_RIG_BLEND, "COLL_camera_rig", place_in_scene=True)

    stage = C.make_collection("SCN_detector")
    base = C.make_collection("COLL_base", stage)
    hero = C.make_collection("COLL_hero", stage)
    props = C.make_collection("COLL_props", stage)
    fx = C.make_collection("COLL_fx", stage)

    build_base(base)

    pipe = build_beam_pipe(hero)
    ktag = build_ktag(hero)
    gtk = build_gtk(hero)
    chanti = build_chanti(hero)
    tank = build_decay_tank(hero)
    lav = build_lav_rings(hero)
    straws = [build_straw_chamber(i, x, hero) for i, x in enumerate(STRAW_XS)]
    magnet = build_magnet(hero)
    rich = build_rich(hero)
    chod = build_chod(hero)
    lkr = build_lkr(hero)
    slabs, muv3 = build_muon_system(hero)
    sac = build_sac(hero)
    build_support_frame(props)

    # Static anchor object kept for the site; the animated kaon is a separate object.
    particle = C.dup(C.kit_obj("FX_signature_particle"), "FX_signature_particle", coll=fx)
    particle.location = (KAON_X0, 0.0, BEAM_Z)
    particle.hide_render = True
    particle.hide_viewport = True
    C.make_anchor("detector_signature_particle", (KAON_X0, 0.0, BEAM_Z), [particle], fx)
    C.make_anchor("detector_beam_pipe", (0.7, 0.0, BEAM_Z), [pipe], hero)
    C.make_anchor("detector_tracker", (STRAW_XS[1], 0.0, BEAM_Z), [straws[1]], hero)
    C.make_anchor("detector_photon", (LKR_X, 0.0, BEAM_Z), [lkr], hero)

    build_decay_animation(fx)
    scene.frame_start = F_START
    scene.frame_end = ANIM_END
    scene.frame_set(F_START)

    cam = bpy.data.objects.get("CAM_hero")
    scene.camera = cam
    
    cam.location = Vector((8.0, -8.0, 6.0))
    pivot = bpy.data.objects.get("PIVOT_cam_target")
    if pivot:
        pivot.location = Vector((0.7, 0.0, 2.0))
        from mathutils import Quaternion
        rot_quat = (pivot.location - cam.location).to_track_quat('-Z', 'Y')
        cam.rotation_euler = rot_quat.to_euler()
    cam.data.lens = 35

    C.set_eevee(scene)
    for obj in fx_objects(fx):
        obj["render_on_top"] = True  # flag for the web viewer: draw without depth test
    if LOW:
        return

    restore_view = setup_on_top_glow(scene)
    on_top = restore_view is not None
    scene.frame_set(PREVIEW_FRAME)

    scene.render.image_settings.file_format = "PNG"
    scene.render.film_transparent = on_top
    scene.render.resolution_percentage = 100

    for tag, res, scale in (("desktop", DESKTOP_RES, 18.0), ("mobile", MOBILE_RES, 21.0)):
        scene.render.resolution_x, scene.render.resolution_y = res
        cam.data.ortho_scale = scale
        scene.render.filepath = os.path.join(C.PREVIEWS_DIR, f"detector_{tag}.png")
        bpy.ops.render.render(write_still=True)
        print(f"rendered {scene.render.filepath}")

    cam.data.ortho_scale = cam["ortho_desktop"]
    if restore_view:
        restore_view()
    scene.frame_set(F_START)
    C.save(DETECTOR_BLEND)


main()