import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import build_mobile_scene  # noqa: F401  (module-level main() builds and saves the scene)

GLB_PATH = os.path.join(C.MODELS_DIR, "mobile_scene.glb")
MANIFEST_PATH = os.path.join(C.MANIFESTS_DIR, "mobile_scene.json")
EXCLUDE = ("ENV_floor",)


def main() -> None:
    objs = C.export_collection_glb("SCN_mobile", GLB_PATH, EXCLUDE)
    tris, mat_count, dims = C.gather_stats(objs)
    manifest = {
        "id": "mobile_scene",
        "scene": "mobile",
        "sourceFile": "blender/mobile/mobile_scene.blend",
        "glbFile": "blender/exports/models/mobile_scene.glb",
        "previewFile": "blender/exports/previews/mobile_desktop.png",
        "previewFileMobile": "blender/exports/previews/mobile_mobile.png",
        "version": "0.2.0",
        "gridUnit": 1.0,
        "dimensions": dims,
        "mobileVariant": "blender/exports/models/mobile_scene_mobile.glb",
        "triangleCount": tris,
        "materialCount": mat_count,
        "loadingPriority": "next",
        "interactiveIds": ["INT_mobile_phone"],
        "description": (
            "Low-poly voxel smartphone standing on an exhibit plinth, its replaceable "
            "glass screen showing a grid of app tiles including EE and BT: the phone "
            "is the hub of a small connected world, with a home hub router and two "
            "IoT plant sensors whose cyan signal arcs carry glowing packets into the "
            "phone. Represents connected mobile experiences."
        ),
        "interactiveDescriptions": {
            "INT_mobile_phone": (
                "The smartphone hub: apps such as EE and BT on screen, with packets "
                "arriving from the home hub and the plant sensors. Selecting it opens "
                "the mobile development case-study content."
            )
        },
        "publicityLevel": "public",
        "fileSizeBytes": os.path.getsize(GLB_PATH),
        "exportedObjects": sorted(o.name for o in objs),
    }
    os.makedirs(C.MANIFESTS_DIR, exist_ok=True)
    with open(MANIFEST_PATH, "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2)
    print(json.dumps(manifest, indent=2))


main()
