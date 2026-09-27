import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C

SCENES = {
    "detector_scene": ("build_detector_scene", "SCN_detector"),
    "mobile_scene": ("build_mobile_scene", "SCN_mobile"),
    "waterpolo_scene": ("build_waterpolo_scene", "SCN_waterpolo"),
}
EXCLUDE = ("ENV_floor",)


def main() -> None:
    scene_id = os.environ["WEBCV_VARIANT_SCENE"]
    module_name, coll_name = SCENES[scene_id]
    __import__(module_name)  # module-level main() builds the scene in low mode
    glb_path = os.path.join(C.MODELS_DIR, f"{scene_id}_mobile.glb")
    objs = C.export_collection_glb(coll_name, glb_path, EXCLUDE)
    tris, mat_count, dims = C.gather_stats(objs)
    print(
        json.dumps(
            {
                "id": f"{scene_id}_mobile",
                "triangleCount": tris,
                "materialCount": mat_count,
                "dimensions": dims,
                "fileSizeBytes": os.path.getsize(glb_path),
            },
            indent=2,
        )
    )


main()
