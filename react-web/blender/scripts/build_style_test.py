import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import bpy

STYLE_TEST_BLEND = os.path.join(C.BLENDER_ROOT, "style_test.blend")
DESKTOP_RES = (1600, 900)
MOBILE_RES = (430, 932)


def dup(src, name, loc=(0.0, 0.0, 0.0), rot=None, scale=None, coll=None):
    obj = bpy.data.objects.new(name, src.data)
    (coll or bpy.context.scene.collection).objects.link(obj)
    obj.location = loc
    if rot is not None:
        obj.rotation_euler = rot
    if scale is not None:
        obj.scale = scale
    return obj


def kit_obj(name):
    obj = bpy.data.objects.get(name)
    if obj is None:
        raise KeyError(f"kit object {name} not linked")
    return obj


def set_eevee(scene) -> None:
    for engine in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE", "CYCLES"):
        try:
            scene.render.engine = engine
            print(f"render engine: {engine}")
            return
        except TypeError:
            continue


def main() -> None:
    C.reset_scene()
    scene = bpy.context.scene

    C.link_library_materials(C.MATERIALS_BLEND)
    C.link_library_collection(C.VOXEL_KIT_BLEND, "COLL_voxel_kit")
    C.link_library_collection(C.LIGHTING_RIG_BLEND, "COLL_lighting_rig", place_in_scene=True)
    C.link_library_collection(C.CAMERA_RIG_BLEND, "COLL_camera_rig", place_in_scene=True)

    stage = C.make_collection("SCN_style_test")

    plinth = dup(kit_obj("Plinth_exhibit"), "PROP_plinth", coll=stage)
    dup(kit_obj("Plinth_label"), "PROP_plinth_label", loc=(0.0, -1.5, 0.45), coll=stage)

    floor = C.add_box("ENV_floor", (40.0, 40.0, 0.2), location=(0.0, 0.0, -0.2))
    C.assign_material(floor, "MAT_dark_metal")
    C.link_only(floor, stage)

    ring_z = 0.45 + 1.2
    for i, x in enumerate((-0.9, 0.9)):
        dup(
            kit_obj("Ring_12"),
            f"PROP_detector_ring_{i:02d}",
            loc=(x, 0.0, ring_z),
            rot=(0.0, math.pi / 2, 0.0),
            coll=stage,
        )
        dup(kit_obj("Support_strut"), f"PROP_ring_support_{i:02d}", loc=(x, 0.0, 0.45), coll=stage)

    pipe = dup(
        kit_obj("Pipe_straight"),
        "HERO_beam_pipe",
        loc=(0.0, 0.0, ring_z),
        scale=(1.9, 1.0, 1.0),
        coll=stage,
    )

    # Plan section 5 hierarchy: INT_ root -> FX mesh + PIVOT_ empty. Ids are
    # scene-qualified because the linked kit masters already own the generic names.
    particle = dup(kit_obj("FX_signature_particle"), "FX_signature_particle", coll=stage)
    int_root = bpy.data.objects.new("INT_detector_signature_particle", None)
    int_root.empty_display_size = 0.3
    stage.objects.link(int_root)
    int_root.location = (-0.6, 0.0, ring_z)
    pivot = bpy.data.objects.new("PIVOT_detector_signature_particle", None)
    pivot.empty_display_size = 0.2
    stage.objects.link(pivot)
    particle.parent = int_root
    particle.location = (0.0, 0.0, 0.0)
    pivot.parent = int_root
    pivot.location = (0.0, 0.0, 0.0)
    dup(
        kit_obj("FX_particle_trail"),
        "FX_particle_trail",
        loc=(0.0, 0.0, ring_z - 0.3),
        scale=(0.9, 1.0, 0.6),
        coll=stage,
    )

    block_m = kit_obj("VoxelBlock_M")
    blue_block = bpy.data.objects.new("PROP_data_block", block_m.data.copy())
    stage.objects.link(blue_block)
    blue_block.location = (1.35, 1.25, 0.45)
    C.assign_material(blue_block, "MAT_science_blue")
    dup(kit_obj("VoxelBlock_S"), "PROP_trim_block", loc=(1.35, 1.25, 1.45), coll=stage)

    dup(kit_obj("Rail_2u"), "PROP_packet_rail", loc=(0.0, -1.6, 0.45), coll=stage)
    dup(kit_obj("FX_packet"), "FX_packet", loc=(-0.5, -1.6, 0.61), coll=stage)
    dup(kit_obj("Sign_frame"), "PROP_sign", loc=(1.62, -1.5, 0.45), rot=(0.0, 0.0, math.pi / 4), coll=stage)

    cam = bpy.data.objects.get("CAM_hero")
    scene.camera = cam

    set_eevee(scene)
    scene.render.image_settings.file_format = 'PNG'
    scene.render.film_transparent = False
    scene.render.resolution_percentage = 100

    for tag, res, ortho_prop in (("desktop", DESKTOP_RES, "ortho_desktop"), ("mobile", MOBILE_RES, "ortho_mobile")):
        scene.render.resolution_x, scene.render.resolution_y = res
        cam.data.ortho_scale = cam[ortho_prop]
        scene.render.filepath = os.path.join(C.PREVIEWS_DIR, f"style_test_{tag}.png")
        bpy.ops.render.render(write_still=True)
        print(f"rendered {scene.render.filepath}")

    cam.data.ortho_scale = cam["ortho_desktop"]
    C.save(STYLE_TEST_BLEND)


main()
