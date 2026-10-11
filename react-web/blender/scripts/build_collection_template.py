import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import bpy

TEMPLATE_BLEND = os.path.join(C.SHARED_DIR, "collection_template.blend")


def main() -> None:
    C.reset_scene()
    C.link_library_materials(C.MATERIALS_BLEND)
    C.link_library_collection(C.LIGHTING_RIG_BLEND, "COLL_lighting_rig", place_in_scene=True)
    C.link_library_collection(C.CAMERA_RIG_BLEND, "COLL_camera_rig", place_in_scene=True)

    scene_root = C.make_collection("SCN_template")
    for layer in ("COLL_base", "COLL_hero", "COLL_props", "COLL_fx"):
        C.make_collection(layer, scene_root)

    notes = bpy.data.texts.new("README_template")
    notes.write(
        "Scene template for the webcv voxel portfolio.\n"
        "\n"
        "Start every scene from this file (or copy build_collection_template.py's\n"
        "structure into a new build script):\n"
        "  1. Rename SCN_template to SCN_<scene>.\n"
        "  2. Build geometry into the four layer collections: COLL_base (floor/\n"
        "     plinth), COLL_hero (subject), COLL_props (supporting story props),\n"
        "     COLL_fx (particles, trails, packets).\n"
        "  3. Follow plan naming: ENV_/HERO_/PROP_/FX_/INT_/PIVOT_.\n"
        "  4. Interactive objects get an INT_<scene>_<id> root with a PIVOT_ child.\n"
        "  5. Materials come from shared/materials.blend (linked); do not create\n"
        "     scene-local duplicates.\n"
    )

    C.save(TEMPLATE_BLEND)
    print("template collections:", sorted(c.name for c in bpy.data.collections))


main()
