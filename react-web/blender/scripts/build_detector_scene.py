import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import bpy

DETECTOR_BLEND = os.path.join(C.BLENDER_ROOT, "detector", "detector_scene.blend")
DESKTOP_RES = (1600, 900)
MOBILE_RES = (430, 932)

BEAM_Z = 1.65
PLINTH_TOP_Z = 0.45
EXPLODE_FRAME = 60

RING_XS = (-1.6, -0.2, 1.2)
TRACKER_X = -0.9
PHOTON_X = 0.5
CALORIMETER_X = 1.6


def local_cylinder(name, radius, depth, location, rotation=(0.0, 0.0, 0.0), vertices=8):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices, radius=radius, depth=depth, location=location, rotation=rotation
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


def build_beam_pipe(fx):
    segments = [
        local_cylinder(f"seg_{i}", 0.09, 1.0, (x, 0.0, BEAM_Z), rotation=(0.0, math.pi / 2, 0.0))
        for i, x in enumerate((-1.3, 0.0, 1.3))
    ]
    pipe = C.join_objects(segments, "HERO_beam_pipe")
    bpy.ops.object.transform_apply(rotation=True)
    C.assign_material(pipe, "MAT_light_metal")
    C.link_only(pipe, fx)
    return pipe


def build_rings(props):
    rings = []
    for i, x in enumerate(RING_XS):
        ring = C.dup(
            C.kit_obj("Ring_12"),
            f"PROP_detector_ring_{i:02d}",
            loc=(x, 0.0, BEAM_Z),
            rot=(0.0, math.pi / 2, 0.0),
            coll=props,
        )
        support = C.dup(
            C.kit_obj("Support_strut"), f"PROP_ring_support_{i:02d}", loc=(x, 0.0, PLINTH_TOP_Z), coll=props
        )
        bpy.context.view_layer.update()  # dup() sets location directly; refresh before inverse
        support.parent = ring
        support.matrix_parent_inverse = ring.matrix_world.inverted()
        rings.append(ring)
    return rings


def build_tracker(hero):
    posts = [
        C.add_box(f"post_{i}", (0.12, 0.12, 1.8), location=(TRACKER_X, y, PLINTH_TOP_Z))
        for i, y in enumerate((-0.6, 0.6))
    ]
    crossbar = C.add_box("crossbar", (0.1, 1.32, 0.12), location=(TRACKER_X, 0.0, 2.25))
    plates = [
        C.add_box(f"plate_{i}", (0.06, 1.0, 1.0), location=(TRACKER_X + dx, 0.0, BEAM_Z), base_origin=False)
        for i, dx in enumerate((-0.12, 0.0, 0.12))
    ]
    frame = C.join_objects(posts + [crossbar], "frame")
    C.assign_material(frame, "MAT_dark_metal")
    for plate in plates:
        C.assign_material(plate, "MAT_science_blue")
    station = C.join_objects([frame] + plates, "PROP_tracker_station")
    C.link_only(station, hero)

    straws = [
        local_cylinder(f"straw_{i}", 0.045, 1.1, (TRACKER_X - 0.28, y, BEAM_Z))
        for i, y in enumerate([-0.45, -0.3, -0.15, 0.0, 0.15, 0.3, 0.45])
    ]
    straw_obj = C.join_objects(straws, "PROP_straw_tracker")
    C.assign_material(straw_obj, "MAT_light_metal")
    C.link_only(straw_obj, hero)
    return C.make_anchor("detector_tracker", (TRACKER_X, 0.0, BEAM_Z), [station, straw_obj], hero)


def build_photon_blocks(hero):
    blocks = [
        C.add_box(f"block_{i}", (0.45, 0.8, 1.1), location=(PHOTON_X, y, BEAM_Z - 0.55))
        for i, y in enumerate((-0.85, 0.85))
    ]
    blocks_obj = C.join_objects(blocks, "PROP_photon_blocks")
    C.assign_material(blocks_obj, "MAT_light_metal")
    C.link_only(blocks_obj, hero)

    hits = [
        C.add_box(f"hit_{i}", (0.14, 0.14, 0.14), location=(PHOTON_X, y, z), base_origin=False)
        for i, (y, z) in enumerate(((-0.42, 1.3), (0.42, 1.65), (-0.42, 2.0)))
    ]
    hits_obj = C.join_objects(hits, "FX_photon_hits")
    C.assign_material(hits_obj, "MAT_cyan_emissive")
    C.link_only(hits_obj, hero)
    return C.make_anchor("detector_photon", (PHOTON_X, 0.0, BEAM_Z), [blocks_obj, hits_obj], hero)


def build_calorimeter(props):
    blocks = []
    for row, z in enumerate((0.85, 1.3, 1.75, 2.2)):
        for col, y in enumerate((-0.675, -0.225, 0.225, 0.675)):
            blocks.append(
                C.add_box(
                    f"cal_{row}_{col}", (0.3, 0.4, 0.4), location=(CALORIMETER_X + 0.08 * row, y, z)
                )
            )
    wall = C.join_objects(blocks, "PROP_calorimeter")
    C.assign_material(wall, "MAT_light_metal")
    C.link_only(wall, props)
    return wall


def build_support_frame(props):
    rails = [
        C.add_box(f"rail_{i}", (3.8, 0.1, 0.1), location=(0.0, y, PLINTH_TOP_Z + 0.05))
        for i, y in enumerate((-0.8, 0.8))
    ]
    feet = [
        C.add_box(f"foot_{i}", (0.4, 0.4, 0.1), location=(x, y, PLINTH_TOP_Z))
        for i, (x, y) in enumerate(((-1.6, -0.8), (-1.6, 0.8), (1.6, -0.8), (1.6, 0.8)))
    ]
    frame = C.join_objects(rails + feet, "PROP_support_frame")
    C.assign_material(frame, "MAT_dark_metal")
    C.link_only(frame, props)
    return frame


def build_particle_path(fx):
    track = C.dup(
        C.kit_obj("FX_particle_trail"),
        "FX_particle_track",
        loc=(0.0, 0.0, BEAM_Z - 0.3),
        scale=(0.95, 0.5, 0.4),
        coll=fx,
    )
    markers = [
        C.add_box(f"hit_{i}", (0.12, 0.12, 0.12), location=(x, 0.0, BEAM_Z), base_origin=False)
        for i, x in enumerate((-1.6, -0.9, -0.2, 0.5, 1.2))
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

    C.dup(C.kit_obj("Plinth_exhibit"), "PROP_plinth", coll=base)
    floor = C.add_box("ENV_floor", (40.0, 40.0, 0.2), location=(0.0, 0.0, -0.2))
    C.assign_material(floor, "MAT_dark_metal")
    C.link_only(floor, base)

    pipe = build_beam_pipe(hero)
    rings = build_rings(props)
    tracker_root = build_tracker(hero)
    photon_root = build_photon_blocks(hero)
    calorimeter = build_calorimeter(props)
    build_support_frame(props)
    build_particle_path(fx)

    particle = C.dup(C.kit_obj("FX_signature_particle"), "FX_signature_particle", coll=fx)
    particle.location = (-1.9, 0.0, BEAM_Z)
    C.make_anchor("detector_signature_particle", (-1.9, 0.0, BEAM_Z), [particle], fx)
    C.make_anchor("detector_beam_pipe", (0.0, 0.0, BEAM_Z), [pipe], hero)

    for ring in rings:
        explode_keyframe(ring, ring.location.x * 0.6, dz=0.35)
    explode_keyframe(tracker_root, TRACKER_X * 0.6)
    explode_keyframe(photon_root, PHOTON_X * 0.6)
    explode_keyframe(calorimeter, CALORIMETER_X * 0.6)
    scene.frame_start = 1
    scene.frame_end = EXPLODE_FRAME
    scene.frame_set(1)

    cam = bpy.data.objects.get("CAM_hero")
    scene.camera = cam

    C.set_eevee(scene)
    scene.render.image_settings.file_format = 'PNG'
    scene.render.film_transparent = False
    scene.render.resolution_percentage = 100

    for tag, res, ortho_prop in (("desktop", DESKTOP_RES, "ortho_desktop"), ("mobile", MOBILE_RES, "ortho_mobile")):
        scene.render.resolution_x, scene.render.resolution_y = res
        cam.data.ortho_scale = cam[ortho_prop]
        scene.render.filepath = os.path.join(C.PREVIEWS_DIR, f"detector_{tag}.png")
        bpy.ops.render.render(write_still=True)
        print(f"rendered {scene.render.filepath}")

    cam.data.ortho_scale = cam["ortho_desktop"]
    C.save(DETECTOR_BLEND)


main()
