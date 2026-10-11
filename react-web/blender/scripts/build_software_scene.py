import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import bpy
import kit_parts as K
from mathutils import Euler, Vector, Matrix


SOFTWARE_BLEND = os.path.join(C.BLENDER_ROOT, "software", "software_scene.blend")
DESKTOP_RES = (1600, 900)
MOBILE_RES = (430, 932)
LOW = os.environ.get("WEBCV_DETAIL") == "low"

PLINTH_TOP_Z = 0.45

# Device positions on the plinth
LAPTOP_POS = (-0.6, 0.0, PLINTH_TOP_Z)
SERVER_POS = (0.7, 0.2, PLINTH_TOP_Z)
PHONE_POS = (0.7, -0.8, PLINTH_TOP_Z)
IOT_POS = (-1.2, -0.8, PLINTH_TOP_Z)

# Laptop geometry
LAPTOP_BASE_SIZE = (1.4, 1.0, 0.06)
LAPTOP_SCREEN_SIZE = (1.4, 0.06, 1.0)
LAPTOP_OPEN_ANGLE = -math.radians(20)  # lid leans back 20 degrees from vertical
LAPTOP_BASE_TOP_Z = PLINTH_TOP_Z + LAPTOP_BASE_SIZE[2]


# Packet animation
PACKET_END_FRAME = 96  # slower: 96 frames instead of 48

# Terminal lines (green/cyan bars on laptop screen)
TERMINAL_LINES = 8

def tilt_about(objs, pivot, angle, axis='X'):
    """Rotate objects together about an axis line through `pivot`."""
    bpy.context.view_layer.update()
    m = Matrix.Translation(pivot) @ Matrix.Rotation(angle, 4, axis) @ Matrix.Translation(-pivot)
    for o in objs:
        o.matrix_world = m @ o.matrix_world

def make_flat_material(name, color, roughness=0.5):
    mat = bpy.data.materials.get(name)
    if mat is None:
        mat = bpy.data.materials.new(name)
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            bsdf.inputs["Base Color"].default_value = color
            bsdf.inputs["Roughness"].default_value = roughness
    return mat

def build_laptop(hero):
    """Open laptop showing a terminal session; lid is built upright, then tilted about the hinge."""
    lx, ly, _ = LAPTOP_POS
    lid_w, lid_t, lid_h = LAPTOP_SCREEN_SIZE

    # Base sits on the plinth (default origin = bottom)
    base = C.add_box("PROP_laptop_base", LAPTOP_BASE_SIZE, location=LAPTOP_POS)
    C.assign_material(base, "MAT_light_metal")
    C.link_only(base, hero)

    # Hinge on the back edge of the base
    hinge_pos = Vector((lx, ly + LAPTOP_BASE_SIZE[1] / 2 - 0.04, LAPTOP_BASE_TOP_Z))
    hinge = C.add_box("PROP_laptop_hinge", (1.3, 0.08, 0.08),
                      location=tuple(hinge_pos), base_origin=False)
    C.assign_material(hinge, "MAT_dark_metal")
    C.link_only(hinge, hero)

    # ---- Lid, built upright with its bottom edge on the hinge ----
    cz = hinge_pos.z + lid_h / 2
    screen = C.add_box("PROP_laptop_screen", LAPTOP_SCREEN_SIZE,
                       location=(lx, hinge_pos.y, cz), base_origin=False)
    C.assign_material(screen, "MAT_dark_metal")
    C.link_only(screen, hero)

    # Terminal background (near-black, slightly blue)
    display_y = hinge_pos.y - lid_t / 2 - 0.005
    display = C.add_box("PROP_laptop_display", (1.24, 0.02, 0.86),
                        location=(lx, display_y, cz), base_origin=False)
    display.data.materials.clear()
    display.data.materials.append(
        make_flat_material("MAT_terminal_bg", (0.015, 0.02, 0.03, 1.0), 0.35))
    C.link_only(display, hero)

    lid_parts = [screen, display]
    front = display_y - 0.01  # front face of the display

    def term(name, u, v, w, h, mat, layer=0, t=0.01):
        """u = across the screen, v = up the screen, built upright."""
        y = front - layer * t - t / 2
        o = C.add_box(name, (w, t, h), location=(lx + u, y, cz + v), base_origin=False)
        C.assign_material(o, mat)
        C.link_only(o, hero)
        lid_parts.append(o)
        return o

    # Title bar with window dots
    term("PROP_term_titlebar", 0.0, 0.385, 1.24, 0.06, "MAT_dark_metal")
    for i, mat in enumerate(("MAT_mobile_warm", "MAT_plant_green", "MAT_cyan_emissive")):
        term(f"PROP_term_dot_{i}", -0.54 + i * 0.06, 0.385, 0.03, 0.03, mat, layer=1)
    term("PROP_term_title", 0.0, 0.385, 0.28, 0.02, "MAT_light_metal", layer=1)

    # Session: ("cmd", words) has a prompt and command; other kinds are output lines
    rows = [
        ("cmd", [0.08, 0.16, 0.12]),
        ("ok",  [0.30, 0.22]),
        ("out", [0.20, 0.10, 0.14]),
        ("cmd", [0.08, 0.22]),
        ("out", [0.40, 0.18]),
        ("out", [0.26, 0.30]),
        ("warn", [0.34, 0.12]),
        ("cmd", [0.08, 0.14, 0.10]),
        ("cmd", [0.08, 0.10]),   # last line, gets the cursor
    ]
    margin_x = -0.56
    pitch = 0.073
    row_h = 0.028
    gap = 0.03
    cmd_start = margin_x + 0.07
    cursor = None

    for r, (kind, words) in enumerate(rows):
        v = 0.27 - r * pitch
        if kind == "cmd":
            term(f"PROP_term_prompt_{r}", margin_x + 0.0175, v, 0.035, row_h, "MAT_cyan_emissive")
            x = cmd_start
            for k, w in enumerate(words):
                mat = "MAT_plant_green" if k == 0 else "MAT_off_white"
                term(f"PROP_term_cmd_{r}_{k}", x + w / 2, v, w, row_h, mat)
                x += w + gap
            if r == len(rows) - 1:
                cursor = term("PROP_term_cursor", x + 0.015, v, 0.03, 0.05, "MAT_cyan_emissive")
        else:
            mat = {"ok": "MAT_plant_green", "warn": "MAT_mobile_warm"}.get(kind, "MAT_light_metal")
            x = margin_x
            for k, w in enumerate(words):
                term(f"PROP_term_out_{r}_{k}", x + w / 2, v, w, row_h, mat)
                x += w + gap

    # One rotation about the hinge moves the whole lid together
    tilt_about(lid_parts, hinge_pos, LAPTOP_OPEN_ANGLE)

    # Blinking cursor (booleans keyframe as on/off steps)
    for f in range(1, PACKET_END_FRAME + 1, 16):
        for frame, visible in ((f, True), (f + 8, False)):
            cursor.hide_viewport = not visible
            cursor.hide_render = not visible
            cursor.keyframe_insert("hide_viewport", frame=frame)
            cursor.keyframe_insert("hide_render", frame=frame)

    parts = [base, hinge] + lid_parts

    # Keyboard keys on the base top surface
    for row in range(4):
        for col in range(8):
            key = C.add_box(f"PROP_key_{row}_{col}", (0.09, 0.09, 0.02),
                            location=(lx - 0.42 + col * 0.12, ly - 0.3 + row * 0.12,
                                      LAPTOP_BASE_TOP_Z + 0.01),
                            base_origin=False)
            C.assign_material(key, "MAT_off_white")
            C.link_only(key, hero)
            parts.append(key)

    return C.make_anchor("software_laptop", LAPTOP_POS, parts, hero)


def build_server(props):
    """Compact 2U server rack with LED indicators."""
    # Main chassis
    chassis = C.add_box("PROP_server_chassis", (0.5, 0.5, 0.8), location=SERVER_POS)
    C.assign_material(chassis, "MAT_dark_metal")
    C.link_only(chassis, props)

    # Rack rails (top and bottom)
    rail_top = C.add_box("PROP_server_rail_top", (0.54, 0.04, 0.04),
                          location=(SERVER_POS[0], SERVER_POS[1], SERVER_POS[2] + 0.78), base_origin=False)
    rail_bot = C.add_box("PROP_server_rail_bot", (0.54, 0.04, 0.04),
                          location=(SERVER_POS[0], SERVER_POS[1], SERVER_POS[2] + 0.02), base_origin=False)
    C.assign_material(rail_top, "MAT_light_metal")
    C.assign_material(rail_bot, "MAT_light_metal")
    C.link_only(rail_top, props)
    C.link_only(rail_bot, props)

    # Ventilation slots on front
    for i in range(6):
        slot = C.add_box(f"PROP_server_slot_{i}", (0.36, 0.02, 0.025),
                          location=(SERVER_POS[0], SERVER_POS[1] - 0.26, SERVER_POS[2] + 0.15 + i * 0.08),
                          base_origin=False)
        C.assign_material(slot, "MAT_dark_metal")
        C.link_only(slot, props)

    # Status LEDs (cyan emissive)
    for i in range(3):
        led = C.add_box(f"PROP_server_led_{i}", (0.04, 0.04, 0.02),
                         location=(SERVER_POS[0] - 0.15 + i * 0.15,
                                   SERVER_POS[1] - 0.26,
                                   SERVER_POS[2] + 0.72),
                         base_origin=False)
        C.assign_material(led, "MAT_cyan_emissive")
        C.link_only(led, props)

    # Network ports on back
    for i in range(4):
        port = C.add_box(f"PROP_server_port_{i}", (0.06, 0.04, 0.04),
                          location=(SERVER_POS[0] - 0.12 + i * 0.08,
                                    SERVER_POS[1] + 0.26,
                                    SERVER_POS[2] + 0.35),
                          base_origin=False)
        C.assign_material(port, "MAT_dark_metal")
        C.link_only(port, props)


def build_phone(props):
    """Phone lying flat on the plinth, running a plant-details app."""
    px, py, _ = PHONE_POS
    body_h = 0.08
    glass_top = PLINTH_TOP_Z + body_h + 0.015
    parts = []

    def add(name, u, v, w, h, mat, layer=0, t=0.01):
        # u = across the phone, v = up the phone, built unrotated
        z = glass_top + layer * 0.01 + t / 2
        o = C.add_box(name, (w, h, t), location=(px + u, py + v, z), base_origin=False)
        C.assign_material(o, mat)
        C.link_only(o, props)
        parts.append(o)
        return o

    # Body (bottom rests on the plinth)
    body = C.add_box("PROP_phone_body", (0.5, 1.0, body_h), location=PHONE_POS)
    C.assign_material(body, "MAT_dark_metal")
    C.link_only(body, props)
    parts.append(body)

    # Screen glass, light app background
    glass = C.add_box("PROP_phone_screen", (0.44, 0.88, 0.02),
                      location=(px, py, PLINTH_TOP_Z + body_h + 0.005), base_origin=False)
    C.assign_material(glass, "MAT_off_white")
    C.link_only(glass, props)
    parts.append(glass)

    # Header bar
    add("PROP_app_header", 0.0, 0.37, 0.40, 0.09, "MAT_science_blue")
    add("PROP_app_header_dot", -0.15, 0.37, 0.04, 0.04, "MAT_cyan_emissive", layer=1)
    add("PROP_app_header_title", 0.02, 0.37, 0.18, 0.03, "MAT_off_white", layer=1)

    # Plant card with a little plant illustration
    add("PROP_app_card", 0.0, 0.17, 0.40, 0.26, "MAT_dark_metal")
    add("PROP_app_chip", 0.13, 0.26, 0.11, 0.04, "MAT_plant_green", layer=1)
    add("PROP_app_pot", 0.0, 0.08, 0.10, 0.07, "MAT_mobile_warm", layer=1, t=0.03)
    add("PROP_app_stem", 0.0, 0.15, 0.015, 0.09, "MAT_plant_green", layer=1, t=0.02)
    add("PROP_app_leaf_a", -0.04, 0.17, 0.07, 0.025, "MAT_plant_green", layer=1, t=0.02)
    add("PROP_app_leaf_b", 0.04, 0.21, 0.07, 0.025, "MAT_plant_green", layer=1, t=0.02)

    # Stat rows: icon + track + fill (fill is a fraction of the track)
    stats = [
        ("moisture", -0.04, 0.70, "MAT_cyan_emissive"),
        ("temp",     -0.13, 0.55, "MAT_mobile_warm"),
        ("light",    -0.22, 0.85, "MAT_science_blue"),
        ("battery",  -0.31, 0.90, "MAT_plant_green"),
    ]
    track_w, track_cx = 0.30, 0.04
    track_left = track_cx - track_w / 2
    for name, v, frac, mat in stats:
        add(f"PROP_app_{name}_icon", -0.16, v, 0.05, 0.05, mat)
        add(f"PROP_app_{name}_track", track_cx, v, track_w, 0.045, "MAT_light_metal")
        fw = track_w * frac
        add(f"PROP_app_{name}_fill", track_left + fw / 2, v, fw, 0.045, mat, layer=1)

    # Nav bar
    add("PROP_app_nav", 0.0, -0.39, 0.40, 0.07, "MAT_science_blue")
    add("PROP_app_nav_a", -0.12, -0.39, 0.05, 0.03, "MAT_off_white", layer=1)
    add("PROP_app_nav_b", 0.0, -0.39, 0.05, 0.03, "MAT_cyan_emissive", layer=1)
    add("PROP_app_nav_c", 0.12, -0.39, 0.05, 0.03, "MAT_off_white", layer=1)

    # One rotation for the whole phone
    tilt_about(parts, Vector((px, py, PLINTH_TOP_Z)), math.radians(-25), axis='Z')


def build_iot_sensor(props):
    """Plant sensor with pot, stem, probe, and puck (same pattern as mobile)."""
    pos = IOT_POS
    pot = C.add_box("iot_pot", (0.35, 0.35, 0.25), location=pos)
    soil = C.add_box("iot_soil", (0.3, 0.3, 0.04), location=(pos[0], pos[1], pos[2] + 0.25))
    pot_obj = C.join_objects([pot, soil], "PROP_iot_pot")
    C.assign_material(pot_obj, "MAT_mobile_warm")
    C.link_only(pot_obj, props)

    stem = C.add_box("iot_stem", (0.05, 0.05, 0.35), location=(pos[0], pos[1], pos[2] + 0.3))
    leaf_a = C.add_box("iot_leaf_a", (0.18, 0.05, 0.1), location=(pos[0] - 0.08, pos[1], pos[2] + 0.5), base_origin=False)
    leaf_b = C.add_box("iot_leaf_b", (0.05, 0.18, 0.1), location=(pos[0] + 0.05, pos[1] + 0.06, pos[2] + 0.6), base_origin=False)
    plant = C.join_objects([stem, leaf_a, leaf_b], "PROP_iot_plant")
    C.assign_material(plant, "MAT_plant_green")
    C.link_only(plant, props)

    probe = C.add_box("iot_probe", (0.03, 0.03, 0.2), location=(pos[0] + 0.1, pos[1] - 0.08, pos[2] + 0.2))
    puck = C.add_box("iot_puck", (0.12, 0.12, 0.06), location=(pos[0] + 0.1, pos[1] - 0.08, pos[2] + 0.42), base_origin=False)
    dot = C.add_box("PROP_iot_dot", (0.04, 0.04, 0.025), location=(pos[0] + 0.1, pos[1] - 0.08, pos[2] + 0.5), base_origin=False)
    sensor = C.join_objects([probe, puck], "PROP_iot_sensor")
    C.assign_material(sensor, "MAT_dark_metal")
    C.assign_material(dot, "MAT_cyan_emissive")
    C.link_only(sensor, props)
    C.link_only(dot, props)


def build_wifi_arcs(fx):
    """Wifi signal arcs radiating from the server."""
    cx, cy, cz = SERVER_POS[0], SERVER_POS[1], SERVER_POS[2] + 0.9
    for j, radius in enumerate((0.35, 0.55, 0.75) if not LOW else (0.4, 0.7)):
        points = []
        for k in range(5 if LOW else 9):
            angle = math.radians(20 + k * (35 if LOW else 17.5))
            points.append((cx + radius * math.cos(angle), cy, cz + radius * math.sin(angle)))
        arc = K.make_tube_curve(f"FX_wifi_arc_{j}", 0.02, points, [1.0] * len(points))
        C.assign_material(arc, "MAT_cyan_emissive")
        fx.objects.link(arc)


def build_packets(fx):
    """Animated data packets flowing between devices."""
    paths = [
        # Server -> Laptop
        [(SERVER_POS[0] - 0.3, SERVER_POS[1], SERVER_POS[2] + 0.5),
         (-0.1, 0.1, 1.0),
         (LAPTOP_POS[0] + 0.7, LAPTOP_POS[1], LAPTOP_POS[2] + 0.1)],
        # Server -> Phone
        [(SERVER_POS[0], SERVER_POS[1] - 0.3, SERVER_POS[2] + 0.5),
         (0.7, -0.3, 1.1),
         (PHONE_POS[0], PHONE_POS[1], PHONE_POS[2] + 0.2)],
        # Server -> IoT
        [(SERVER_POS[0] - 0.3, SERVER_POS[1] - 0.3, SERVER_POS[2] + 0.4),
         (-0.2, -0.3, 0.9),
         (IOT_POS[0] + 0.1, IOT_POS[1] + 0.1, IOT_POS[2] + 0.5)],
    ]
    for i, points in enumerate(paths):
        packet = C.dup(C.kit_obj("FX_packet"), f"FX_packet_{i:02d}", loc=points[0], coll=fx)
        packet.scale = (0.4, 0.4, 0.4)
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

    stage = C.make_collection("SCN_software")
    base = C.make_collection("COLL_base", stage)
    hero = C.make_collection("COLL_hero", stage)
    props = C.make_collection("COLL_props", stage)
    fx = C.make_collection("COLL_fx", stage)

    C.dup(C.kit_obj("Plinth_exhibit"), "PROP_plinth", coll=base)
    floor = C.add_box("ENV_floor", (40.0, 40.0, 0.2), location=(0.0, 0.0, -0.2))
    C.assign_material(floor, "MAT_dark_metal")
    C.link_only(floor, base)

    build_laptop(hero)
    build_server(props)
    build_phone(props)
    build_iot_sensor(props)
    build_wifi_arcs(fx)
    build_packets(fx)

    scene.frame_start = 1
    scene.frame_end = PACKET_END_FRAME
    scene.frame_set(1)

    cam = bpy.data.objects.get("CAM_hero")
    scene.camera = cam
    
    cam.location = Vector((7.0, -7.0, 5.5))
    pivot = bpy.data.objects.get("PIVOT_cam_target")
    if pivot:
        pivot.location = Vector((0.7, 0.0, 2.2))
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

    for tag, res in (("desktop", DESKTOP_RES), ("mobile", MOBILE_RES)):
        scene.render.resolution_x, scene.render.resolution_y = res
        scene.render.filepath = os.path.join(C.PREVIEWS_DIR, f"software_{tag}.png")
        bpy.ops.render.render(write_still=True)
        print(f"rendered {scene.render.filepath}")

    C.save(SOFTWARE_BLEND)


main()
