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
SCREEN_CENTER = (0.3, 0.336, 1.794)
PACKET_END_FRAME = 48

HUB_POS = (-1.3, 0.9, PLINTH_TOP_Z)
PLANT_A_POS = (-1.4, -1.0, PLINTH_TOP_Z)
PLANT_B_POS = (1.5, 1.2, PLINTH_TOP_Z)

PACKET_PATHS = [
    [(-1.3, 0.9, 1.35), (-0.9, 0.75, 1.95), (0.28, 0.2, 1.5)],
    [(-1.4, -1.0, 1.15), (-0.8, -0.7, 1.8), (0.28, 0.1, 1.4)],
    [(1.5, 1.2, 1.15), (1.1, 0.9, 1.9), (0.4, 0.35, 1.5)],
]

APP_TILES = [
    ("ee", "MAT_ee_yellow", "MAT_cyan_emissive"),
    ("bt", "MAT_bt_blue", "MAT_off_white"),
    ("plantpulse", "MAT_plant_green", "MAT_off_white"),
    ("messages", "MAT_science_blue", "MAT_off_white"),
    ("photos", "MAT_mobile_warm", "MAT_off_white"),
    ("settings", "MAT_light_metal", "MAT_dark_metal"),
]


def screen_point(dx, dz, lift=0.03):
    cos_t = math.cos(PHONE_TILT)
    sin_t = math.sin(PHONE_TILT)
    y_l = SCREEN_CENTER[1] - lift
    z_l = SCREEN_CENTER[2] + dz
    return (
        SCREEN_CENTER[0] + dx,
        y_l * cos_t - z_l * sin_t,
        y_l * sin_t + z_l * cos_t,
    )


def tilted_box(name, size, location, material, hero):
    obj = C.add_box(name, size, location=(0.0, 0.0, 0.0), base_origin=False)
    obj.rotation_euler = (PHONE_TILT, 0.0, 0.0)
    obj.location = location
    C.assign_material(obj, material)
    C.link_only(obj, hero)
    return obj


def build_phone(hero):
    body = C.add_box("HERO_mobile_phone", (1.3, 0.14, 2.6), location=PHONE_POS, base_origin=False)
    body.rotation_euler = (PHONE_TILT, 0.0, 0.0)
    C.assign_material(body, "MAT_dark_metal")
    C.link_only(body, hero)

    # Separate mesh and material slot so the web app can swap screen content.
    screen = C.add_box(
        "PROP_mobile_phone_screen", (1.14, 0.02, 2.34), location=SCREEN_CENTER, base_origin=False
    )
    screen.rotation_euler = (PHONE_TILT, 0.0, 0.0)
    C.assign_material(screen, "MAT_glass")
    C.link_only(screen, hero)

    stand = C.add_box("PROP_mobile_stand", (0.9, 0.5, 0.3), location=(0.3, 0.75, PLINTH_TOP_Z))
    lip = C.add_box("stand_lip", (1.0, 0.08, 0.14), location=(0.3, 0.16, PLINTH_TOP_Z))
    stand_obj = C.join_objects([stand, lip], "PROP_mobile_stand")
    C.assign_material(stand_obj, "MAT_dark_metal")
    C.link_only(stand_obj, hero)

    parts = [body, screen, stand_obj]

    status = tilted_box("PROP_ui_status_bar", (0.9, 0.02, 0.06), screen_point(0.0, 1.05), "MAT_off_white", hero)
    parts.append(status)

    for i, (tag, tile_mat, stripe_mat) in enumerate(APP_TILES):
        col = i % 2
        row = i // 2
        dx = -0.27 + col * 0.54
        dz = 0.62 - row * 0.62
        parts.append(tilted_box(f"PROP_app_{tag}", (0.42, 0.02, 0.42), screen_point(dx, dz), tile_mat, hero))
        parts.append(
            tilted_box(
                f"PROP_app_{tag}_stripe",
                (0.24, 0.02, 0.07),
                screen_point(dx, dz - 0.1, lift=0.045),
                stripe_mat,
                hero,
            )
        )

    return C.make_anchor("mobile_phone", PHONE_POS, parts, hero)


def build_home_hub(props):
    body = C.add_box("hub_body", (0.6, 0.2, 0.85), location=HUB_POS)
    foot = C.add_box("hub_foot", (0.4, 0.3, 0.06), location=(HUB_POS[0], HUB_POS[1], PLINTH_TOP_Z))
    strip = C.add_box(
        "hub_strip",
        (0.44, 0.03, 0.06),
        location=(HUB_POS[0], HUB_POS[1] - 0.11, PLINTH_TOP_Z + 0.55),
        base_origin=False,
    )
    led = C.add_box(
        "hub_led",
        (0.06, 0.03, 0.06),
        location=(HUB_POS[0] + 0.18, HUB_POS[1] - 0.11, PLINTH_TOP_Z + 0.72),
        base_origin=False,
    )
    hub = C.join_objects([body, foot], "PROP_mobile_home_hub")
    C.assign_material(hub, "MAT_dark_metal")
    C.assign_material(strip, "MAT_off_white")
    C.assign_material(led, "MAT_cyan_emissive")
    C.link_only(hub, props)
    C.link_only(strip, props)
    C.link_only(led, props)


def build_plant_sensor(tag, pos, props):
    pot = C.add_box(f"pot_{tag}", (0.42, 0.42, 0.3), location=pos)
    soil = C.add_box(f"soil_{tag}", (0.36, 0.36, 0.05), location=(pos[0], pos[1], pos[2] + 0.3))
    pot_obj = C.join_objects([pot, soil], f"PROP_iot_pot_{tag}")
    C.assign_material(pot_obj, "MAT_mobile_warm")
    C.link_only(pot_obj, props)

    stem = C.add_box(f"stem_{tag}", (0.07, 0.07, 0.4), location=(pos[0], pos[1], pos[2] + 0.35))
    leaf_a = C.add_box(f"leaf_a_{tag}", (0.22, 0.06, 0.12), location=(pos[0] - 0.1, pos[1], pos[2] + 0.55), base_origin=False)
    leaf_b = C.add_box(f"leaf_b_{tag}", (0.06, 0.22, 0.12), location=(pos[0] + 0.06, pos[1] + 0.08, pos[2] + 0.68), base_origin=False)
    plant = C.join_objects([stem, leaf_a, leaf_b], f"PROP_iot_plant_{tag}")
    C.assign_material(plant, "MAT_plant_green")
    C.link_only(plant, props)

    probe = C.add_box(f"probe_{tag}", (0.04, 0.04, 0.25), location=(pos[0] + 0.12, pos[1] - 0.1, pos[2] + 0.25))
    puck = C.add_box(
        f"puck_{tag}", (0.16, 0.16, 0.08), location=(pos[0] + 0.12, pos[1] - 0.1, pos[2] + 0.5), base_origin=False
    )
    dot = C.add_box(
        f"puck_dot_{tag}", (0.05, 0.05, 0.03), location=(pos[0] + 0.12, pos[1] - 0.1, pos[2] + 0.58), base_origin=False
    )
    sensor = C.join_objects([probe, puck], f"PROP_iot_sensor_{tag}")
    C.assign_material(sensor, "MAT_dark_metal")
    C.assign_material(dot, "MAT_cyan_emissive")
    C.link_only(sensor, props)
    C.link_only(dot, props)


def build_signal_arcs(fx):
    devices = [
        ("hub", (HUB_POS[0], HUB_POS[1], PLINTH_TOP_Z + 0.95)),
        ("plant_a", (PLANT_A_POS[0], PLANT_A_POS[1], PLINTH_TOP_Z + 0.75)),
        ("plant_b", (PLANT_B_POS[0], PLANT_B_POS[1], PLINTH_TOP_Z + 0.75)),
    ]
    for tag, (cx, cy, cz) in devices:
        for j, radius in enumerate((0.3, 0.48, 0.66)):
            points = []
            for k in range(9):
                angle = math.radians(35 + k * 13.75)
                points.append((cx + radius * math.cos(angle), cy, cz + radius * math.sin(angle)))
            arc = K.make_tube_curve(f"FX_signal_arc_{tag}_{j}", 0.018, points, [1.0] * len(points))
            C.assign_material(arc, "MAT_cyan_emissive")
            fx.objects.link(arc)


def build_packets(fx):
    for i, points in enumerate(PACKET_PATHS):
        packet = C.dup(C.kit_obj("FX_packet"), f"FX_packet_{i:02d}", loc=points[0], coll=fx)
        packet.keyframe_insert("location", frame=1)
        packet.location = points[1]
        packet.keyframe_insert("location", frame=PACKET_END_FRAME // 2)
        packet.location = points[2]
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
    build_home_hub(props)
    build_plant_sensor("a", PLANT_A_POS, props)
    build_plant_sensor("b", PLANT_B_POS, props)
    build_signal_arcs(fx)
    build_packets(fx)

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
        cam.data.ortho_scale = 7.5 if tag == "mobile" else cam[ortho_prop]
        scene.render.filepath = os.path.join(C.PREVIEWS_DIR, f"mobile_{tag}.png")
        bpy.ops.render.render(write_still=True)
        print(f"rendered {scene.render.filepath}")

    cam.data.ortho_scale = cam["ortho_desktop"]
    C.save(MOBILE_BLEND)


main()
