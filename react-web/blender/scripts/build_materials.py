import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C


def main() -> None:
    C.reset_scene()

    C.make_material("MAT_dark_metal", (0.018, 0.02, 0.024), metallic=0.7, roughness=0.5)
    C.make_material("MAT_light_metal", (0.32, 0.35, 0.4), metallic=0.55, roughness=0.52)
    C.make_material("MAT_off_white", (0.78, 0.74, 0.68), metallic=0.0, roughness=0.62)
    C.make_material(
        "MAT_glass", (0.02, 0.035, 0.05), metallic=0.0, roughness=0.15, transmission=0.65, alpha=0.85
    )
    C.make_material("MAT_rubber", (0.012, 0.012, 0.016), metallic=0.0, roughness=0.92)
    C.make_material(
        "MAT_cyan_emissive",
        (0.0, 0.28, 0.35),
        roughness=0.4,
        emission=(0.0, 0.75, 1.0),
        emission_strength=4.0,
    )
    C.make_material("MAT_science_blue", (0.045, 0.16, 0.62), metallic=0.1, roughness=0.5)
    C.make_material("MAT_mobile_warm", (0.72, 0.28, 0.05), metallic=0.0, roughness=0.55)
    C.make_material("MAT_water_deep", (0.008, 0.05, 0.16), metallic=0.0, roughness=0.32)
    C.make_material("MAT_water_light", (0.1, 0.32, 0.62), metallic=0.0, roughness=0.28)
    C.make_material("MAT_water_surface", (0.1, 0.32, 0.62), metallic=0.0, roughness=0.18, alpha=0.6)
    C.make_material("MAT_plant_green", (0.09, 0.28, 0.09), metallic=0.0, roughness=0.72)
    C.make_material("MAT_safety_yellow", (0.85, 0.55, 0.02), metallic=0.0, roughness=0.5)
    C.make_material("MAT_marker_red", (0.5, 0.05, 0.05), metallic=0.0, roughness=0.55)

    C.save(C.MATERIALS_BLEND)
    print("materials:", sorted(m.name for m in C.bpy.data.materials))


main()
