import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import bpy

DETECTOR_BLEND = os.path.join(C.BLENDER_ROOT, "detector", "detector_scene.blend")
DESKTOP_RES = (1600, 900)
MOBILE_RES = (430, 932)
LOW = os.environ.get("WEBCV_DETAIL") == "low"

BEAM_Z = 2.4
BASE_TOP_Z = 0.45
EXPLODE_FRAME = 60

KTAG_X = -5.0
GTK_X = -4.2
LAV_XS = (-2.95, -1.8, -0.6)
STRAW_XS = (-3.35, -2.6, -1.05, -0.15)
MAGNET_X = -1.75
CHOD_X = 3.55
LKR_X = 4.35
MUV1_X = 5.25
MUV2_X = 5.95
WALL_X = 6.6
MUV3_X = 7.15


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


def explode_keyframe(obj, dx, dz=0.0):
    obj.keyframe_insert("location", frame=1)
    obj.location.x += dx
    obj.location.z += dz
    obj.keyframe_insert("location", frame=EXPLODE_FRAME)
    obj.location.x -= dx
    obj.location.z -= dz


def build_base(base):
    slab = C.add_box("base_slab", (14.4, 5.4, 0.3), location=(0.7, 0.0, 0.0))
    step = C.add_box("base_step", (13.6, 4.6, BASE_TOP_Z - 0.3), location=(0.7, 0.0, 0.3))
    plinth = C.join_objects([slab, step], "PROP_plinth")
    C.assign_material(plinth, "MAT_dark_metal")
    C.link_only(plinth, base)

    floor = C.add_box("ENV_floor", (60.0, 60.0, 0.2), location=(0.0, 0.0, -0.2))
    C.assign_material(floor, "MAT_dark_metal")
    C.link_only(floor, base)


def build_beam_pipe(hero):
    segments = [
        local_cylinder(f"seg_{i}", 0.09, 1.75, (x, 0.0, BEAM_Z), vertices=8)
        for i, x in enumerate((-4.75, -3.0, -1.25, 0.5, 2.25, 4.0, 5.75) if not LOW else (-4.75, -1.25, 2.25, 5.75))
    ]
    pipe = C.join_objects(segments, "HERO_beam_pipe")
    C.assign_material(pipe, "MAT_light_metal")
    C.link_only(pipe, hero)
    return pipe


def build_ktag(hero):
    body = local_cylinder("ktag_body", 0.3, 0.7, (KTAG_X, 0.0, BEAM_Z))
    parts = [body]
    for i, (dy, dz) in enumerate(((-0.28, 0.0), (0.28, 0.0), (0.0, -0.28), (0.0, 0.28))):
        parts.append(
            C.add_box(f"ktag_pmt_{i}", (0.18, 0.16, 0.16), location=(KTAG_X - 0.32, dy, BEAM_Z + dz), base_origin=False)
        )
    ktag = C.join_objects(parts, "PROP_na62_ktag")
    C.assign_material(ktag, "MAT_light_metal")
    C.link_only(ktag, hero)
    return ktag


def build_gtk(hero):
    plates = [
        C.add_box(f"gtk_plate_{i}", (0.05, 0.35, 0.35), location=(GTK_X + i * 0.16, 0.0, BEAM_Z), base_origin=False)
        for i in range(3)
    ]
    gtk = C.join_objects(plates, "PROP_na62_gtk")
    C.assign_material(gtk, "MAT_science_blue")
    C.link_only(gtk, hero)
    return gtk


def build_decay_tank(hero):
    segments = [
        local_cylinder("tank_0", 0.95, 0.55, (-3.6, 0.0, BEAM_Z), open_ended=True),
        local_cylinder("tank_1", 1.2, 0.55, (-2.1, 0.0, BEAM_Z), open_ended=True),
        local_cylinder("tank_2", 1.4, 0.55, (-0.55, 0.0, BEAM_Z), open_ended=True),
    ]
    tank = C.join_objects(segments, "PROP_na62_decay_tank")
    C.assign_material(tank, "MAT_na62_green")
    C.link_only(tank, hero)
    return tank


def build_lav_rings(hero):
    rings = []
    for i, x in enumerate(LAV_XS):
        bpy.ops.mesh.primitive_torus_add(
            major_segments=8 if LOW else 12,
            minor_segments=3 if LOW else 4,
            major_radius=1.1 + i * 0.18,
            minor_radius=0.09,
            location=(x, 0.0, BEAM_Z),
            rotation=(0.0, math.pi / 2, 0.0),
        )
        ring = bpy.context.active_object
        ring.name = f"lav_{i}"
        C.shade_flat(ring)
        rings.append(ring)
    lav = C.join_objects(rings, "PROP_na62_lav_rings")
    C.assign_material(lav, "MAT_safety_yellow")
    C.link_only(lav, hero)
    return lav


def build_straw_chamber(index, x, hero):
    half = 1.05
    frame_parts = [
        C.add_box(f"frame_{index}_top", (0.12, 2.2, 0.12), location=(x, 0.0, BEAM_Z + half), base_origin=False),
        C.add_box(f"frame_{index}_bottom", (0.12, 2.2, 0.12), location=(x, 0.0, BEAM_Z - half), base_origin=False),
        C.add_box(f"frame_{index}_l", (0.12, 0.12, 2.2), location=(x, -half, BEAM_Z), base_origin=False),
        C.add_box(f"frame_{index}_r", (0.12, 0.12, 2.2), location=(x, half, BEAM_Z), base_origin=False),
    ]
    frame = C.join_objects(frame_parts, f"straw_frame_{index}")
    C.assign_material(frame, "MAT_light_metal")

    straws = [
        local_cylinder(
            f"straw_{index}_{j}",
            0.028,
            2.0,
            (x, -0.8 + j * 0.27, BEAM_Z),
            rotation=(math.pi / 2, 0.0, 0.0),
            vertices=6,
        )
        for j in range(5 if LOW else 7)
    ]
    straw_obj = C.join_objects(straws, f"straw_grid_{index}")
    C.assign_material(straw_obj, "MAT_straw_gold")

    chamber = C.join_objects([frame, straw_obj], f"PROP_na62_straw_chamber_{index}")
    C.link_only(chamber, hero)
    return chamber


def build_magnet(hero):
    yoke = C.add_box("magnet_yoke", (0.9, 2.3, 2.3), location=(MAGNET_X, 0.0, BEAM_Z), base_origin=False)
    magnet = C.join_objects([yoke], "PROP_na62_magnet")
    C.assign_material(magnet, "MAT_dark_metal")
    C.link_only(magnet, hero)
    return magnet


def build_rich(hero):
    sections = [
        local_cylinder("rich_0", 1.7, 0.8, (0.95, 0.0, BEAM_Z)),
        local_cylinder("rich_1", 1.85, 0.8, (1.75, 0.0, BEAM_Z)),
        local_cylinder("rich_2", 2.0, 0.8, (2.55, 0.0, BEAM_Z)),
    ]
    mirror = local_cylinder("rich_mirror", 1.9, 0.12, (3.05, 0.0, BEAM_Z))
    C.assign_material(mirror, "MAT_dark_metal")
    rich = C.join_objects(sections + [mirror], "PROP_na62_rich")
    C.assign_material(rich, "MAT_light_metal")
    C.link_only(rich, hero)
    return rich


def build_chod(hero):
    disk = local_cylinder("chod_disk", 1.07, 0.08, (CHOD_X, 0.0, BEAM_Z), vertices=12)
    chod = C.join_objects([disk], "PROP_na62_chod")
    C.assign_material(chod, "MAT_off_white")
    C.link_only(chod, hero)
    return chod


def build_lkr(hero):
    cryostat = local_cylinder("lkr_cryostat", 1.28, 1.1, (LKR_X, 0.0, BEAM_Z), vertices=8)
    lkr = C.join_objects([cryostat], "PROP_na62_lkr")
    C.assign_material(lkr, "MAT_science_blue")
    C.link_only(lkr, hero)
    return lkr


def build_muon_system(hero):
    muv1 = C.add_box("muv1", (0.75, 2.6, 2.6), location=(MUV1_X, 0.0, BEAM_Z), base_origin=False)
    muv2 = C.add_box("muv2", (0.65, 2.6, 2.6), location=(MUV2_X, 0.0, BEAM_Z), base_origin=False)
    wall = C.add_box("iron_wall", (0.7, 2.6, 2.6), location=(WALL_X, 0.0, BEAM_Z), base_origin=False)
    slabs = C.join_objects([muv1, muv2, wall], "PROP_na62_muv_slabs")
    C.assign_material(slabs, "MAT_dark_metal")
    C.link_only(slabs, hero)

    tiles = [
        C.add_box(f"muv3_tile_{i}", (0.08, 1.3, 1.3), location=(MUV3_X, dy, BEAM_Z + dz), base_origin=False)
        for i, (dy, dz) in enumerate(((-0.65, -0.65), (-0.65, 0.65), (0.65, -0.65), (0.65, 0.65)))
    ]
    muv3 = C.join_objects(tiles, "PROP_na62_muv3")
    C.assign_material(muv3, "MAT_off_white")
    C.link_only(muv3, hero)
    return slabs, muv3


def build_support_frame(props):
    rails = [
        C.add_box(f"rail_{i}", (13.2, 0.12, 0.12), location=(0.7, y, BASE_TOP_Z + 0.05))
        for i, y in enumerate((-1.9, 1.9))
    ]
    feet = [
        C.add_box(f"foot_{i}", (0.5, 0.5, 0.14), location=(x, y, BASE_TOP_Z))
        for i, (x, y) in enumerate(
            ((-5.0, -1.9), (-5.0, 1.9), (-1.7, -1.9), (-1.7, 1.9), (1.8, -1.9), (1.8, 1.9), (5.9, -1.9), (5.9, 1.9))
        )
    ]
    legs = []
    leg_xs = (-5.0, -3.6, -2.1, -0.55, 1.0, 2.6, 4.35, 5.9) if not LOW else (-5.0, -2.1, 1.0, 4.35)
    for i, x in enumerate(leg_xs):
        for j, y in enumerate((-1.55, 1.55)):
            legs.append(C.add_box(f"leg_{i}_{j}", (0.14, 0.14, BEAM_Z - 1.1 - BASE_TOP_Z), location=(x, y, BASE_TOP_Z + 0.1)))
    frame = C.join_objects(rails + feet + legs, "PROP_support_frame")
    C.assign_material(frame, "MAT_na62_green")
    C.link_only(frame, props)
    return frame


def build_particle_path(fx):
    track = C.dup(
        C.kit_obj("FX_particle_trail"),
        "FX_particle_track",
        loc=(-1.2, 0.0, BEAM_Z - 0.35),
        scale=(2.2, 0.5, 0.4),
        coll=fx,
    )
    markers = [
        C.add_box(f"hit_{i}", (0.12, 0.12, 0.12), location=(x, 0.0, BEAM_Z), base_origin=False)
        for i, x in enumerate((-3.35, -2.6, -1.05, -0.15, 1.75, 4.35))
    ]
    markers_obj = C.join_objects(markers, "FX_hit_markers")
    C.assign_material(markers_obj, "MAT_cyan_emissive")
    C.link_only(markers_obj, fx)
    return track, markers_obj


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
    tank = build_decay_tank(hero)
    lav = build_lav_rings(hero)
    straws = [build_straw_chamber(i, x, hero) for i, x in enumerate(STRAW_XS)]
    magnet = build_magnet(hero)
    rich = build_rich(hero)
    chod = build_chod(hero)
    lkr = build_lkr(hero)
    slabs, muv3 = build_muon_system(hero)
    build_support_frame(props)
    build_particle_path(fx)

    particle = C.dup(C.kit_obj("FX_signature_particle"), "FX_signature_particle", coll=fx)
    particle.location = (KTAG_X - 0.6, 0.0, BEAM_Z)
    C.make_anchor("detector_signature_particle", (KTAG_X - 0.6, 0.0, BEAM_Z), [particle], fx)
    C.make_anchor("detector_beam_pipe", (0.7, 0.0, BEAM_Z), [pipe], hero)
    C.make_anchor("detector_tracker", (STRAW_XS[1], 0.0, BEAM_Z), [straws[1]], hero)
    C.make_anchor("detector_photon", (LKR_X, 0.0, BEAM_Z), [lkr], hero)

    station_xs = (
        [(ktag, KTAG_X), (gtk, GTK_X), (tank, -2.1), (lav, -2.2), (magnet, MAGNET_X), (rich, 1.8), (chod, CHOD_X), (lkr, LKR_X), (slabs, 5.6), (muv3, MUV3_X)]
        + [(chamber, x) for chamber, x in zip(straws, STRAW_XS)]
    )
    for station, sx in station_xs:
        explode_keyframe(station, (sx - 0.7) * 0.35, dz=0.3 if station in (lav, tank) else 0.0)
    scene.frame_start = 1
    scene.frame_end = EXPLODE_FRAME
    scene.frame_set(1)

    cam = bpy.data.objects.get("CAM_hero")
    scene.camera = cam

    C.set_eevee(scene)
    if LOW:
        return

    scene.render.image_settings.file_format = 'PNG'
    scene.render.film_transparent = False
    scene.render.resolution_percentage = 100

    for tag, res, scale in (("desktop", DESKTOP_RES, 18.0), ("mobile", MOBILE_RES, 21.0)):
        scene.render.resolution_x, scene.render.resolution_y = res
        cam.data.ortho_scale = scale
        scene.render.filepath = os.path.join(C.PREVIEWS_DIR, f"detector_{tag}.png")
        bpy.ops.render.render(write_still=True)
        print(f"rendered {scene.render.filepath}")

    cam.data.ortho_scale = cam["ortho_desktop"]
    C.save(DETECTOR_BLEND)


main()
