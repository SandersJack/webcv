import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import bpy
import kit_parts as K

MOBILE_BLEND = os.path.join(C.BLENDER_ROOT, "mobile", "mobile_scene.blend")
DESKTOP_RES = (1600, 900)
MOBILE_RES = (430, 932)

PLINTH_TOP_Z = 0.45
PHONE_POS = (0.3, 0.42, 1.78)
PHONE_TILT = -0.17  # lean back ~10 degrees, top edge away from the camera
PACKET_END_FRAME = 48

# (name, base position) for the three network nodes on the plinth
NODES = [
    ("00", (-1.3, 0.9, PLINTH_TOP_Z)),
    ("01", (-1.4, -1.0, PLINTH_TOP_Z)),
    ("02", (1.5, 1.2, PLINTH_TOP_Z)),
]
CABLE_POINTS = [
    [(-1.3, 0.9, 0.95), (-0.9, 0.8, 0.6), (-0.2, 0.5, 0.55), (0.1, 0.35, 0.8)],
    [(-1.4, -1.0, 0.95), (-0.8, -0.8, 0.55), (-0.1, -0.3, 0.6), (0.2, -0.05, 0.85)],
    [(1.5, 1.2, 0.95), (1.2, 0.9, 0.6), (0.8, 0.6, 0.55), (0.45, 0.4, 0.8)],
]
PACKET_END = (0.28, 0.1, 1.2)


def build_phone(hero):
    body = C.add_box("HERO_mobile_phone", (1.3, 0.14, 2.6), location=PHONE_POS, base_origin=False)
    body.rotation_euler = (PHONE_TILT, 0.0, 0.0)
    C.assign_material(body, "MAT_dark_metal")
    C.link_only(body, hero)

    # Separate mesh and material slot so the web app can swap screen content.
    screen = C.add_box(
        "PROP_mobile_phone_screen", (1.14, 0.02, 2.34), location=(0.3, 0.336, 1.794), base_origin=False
    )
    screen.rotation_euler = (PHONE_TILT, 0.0, 0.0)
    C.assign_material(screen, "MAT_glass")
    C.link_only(screen, hero)

    stand = C.add_box("PROP_mobile_stand", (0.9, 0.5, 0.3), location=(0.3, 0.75, PLINTH_TOP_Z))
    lip = C.add_box("stand_lip", (1.0, 0.08, 0.14), location=(0.3, 0.16, PLINTH_TOP_Z))
    stand_obj = C.join_objects([stand, lip], "PROP_mobile_stand")
    C.assign_material(stand_obj, "MAT_dark_metal")
    C.link_only(stand_obj, hero)

    cards = []
    for i, (size, loc) in enumerate(
        (
            ((1.0, 0.06, 0.55), (0.35, 0.15, 1.6)),
            ((0.85, 0.06, 0.5), (0.55, -0.05, 2.0)),
            ((0.7, 0.06, 0.45), (0.75, -0.25, 2.4)),
        )
    ):
        card = C.add_box(f"PROP_ui_card_{i:02d}", size, location=loc, base_origin=False)
        C.assign_material(card, "MAT_off_white")
        C.link_only(card, hero)
        cards.append(card)

    accent = C.add_box("PROP_ui_accent", (0.3, 0.03, 0.09), location=(0.2, 0.1, 1.72), base_origin=False)
    C.assign_material(accent, "MAT_mobile_warm")
    C.link_only(accent, hero)
    cards.append(accent)
    dot = C.add_box("PROP_ui_dot", (0.1, 0.03, 0.1), location=(0.75, -0.1, 2.12), base_origin=False)
    C.assign_material(dot, "MAT_cyan_emissive")
    C.link_only(dot, hero)
    cards.append(dot)

    return C.make_anchor("mobile_phone", PHONE_POS, [body, screen, stand_obj, *cards], hero)


def build_nodes(props):
    for tag, loc in NODES:
        block = C.add_box(f"node_{tag}", (0.5, 0.5, 0.5), location=loc)
        C.assign_material(block, "MAT_dark_metal")
        port = C.add_box(
            f"port_{tag}", (0.14, 0.14, 0.14), location=(loc[0], loc[1], loc[2] + 0.57), base_origin=False
        )
        C.assign_material(port, "MAT_cyan_emissive")
        node = C.join_objects([block, port], f"PROP_network_node_{tag}")
        C.link_only(node, props)


def build_cables_and_packets(fx):
    for i, points in enumerate(CABLE_POINTS):
        cable = K.make_tube_curve(f"PROP_network_cable_{i:02d}", 0.03, points, [1.0] * len(points))
        C.assign_material(cable, "MAT_rubber")
        fx.objects.link(cable)

        start = [(points[0][j] + points[1][j]) / 2 for j in range(3)]
        packet = C.dup(C.kit_obj("FX_packet"), f"FX_packet_{i:02d}", loc=start, coll=fx)
        packet.keyframe_insert("location", frame=1)
        packet.location = points[2]
        packet.keyframe_insert("location", frame=PACKET_END_FRAME // 2)
        packet.location = PACKET_END
        packet.keyframe_insert("location", frame=PACKET_END_FRAME)
        packet.location = points[0]


def main() -> None:
    C.reset_scene()
    scene = bpy.context.scene

    C.link_library_materials(C.MATERIALS_BLEND)
    C.link_library_collection(C.VOXEL_KIT_BLEND, "COLL_voxel_kit")
    C.link_library_collection(C.LIGHTING_RIG_BLEND, "COLL_lighting_rig", place_in_scene=True)
    C.link_library_collection(C.CAMERA_RIG_BLEND, "COLL_camera_rig", place_in_scene=True)

    stage = C.make_collection("SCN_mobile")
    base = C.make_collection("COLL_base", stage)
    hero = C.make_collection("COLL_hero", stage)
    props = C.make_collection("COLL_props", stage)
    fx = C.make_collection("COLL_fx", stage)

    C.dup(C.kit_obj("Plinth_exhibit"), "PROP_plinth", coll=base)
    floor = C.add_box("ENV_floor", (40.0, 40.0, 0.2), location=(0.0, 0.0, -0.2))
    C.assign_material(floor, "MAT_dark_metal")
    C.link_only(floor, base)

    build_phone(hero)
    build_nodes(props)
    build_cables_and_packets(fx)

    scene.frame_start = 1
    scene.frame_end = PACKET_END_FRAME
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
        scene.render.filepath = os.path.join(C.PREVIEWS_DIR, f"mobile_{tag}.png")
        bpy.ops.render.render(write_still=True)
        print(f"rendered {scene.render.filepath}")

    cam.data.ortho_scale = cam["ortho_desktop"]
    C.save(MOBILE_BLEND)


main()
