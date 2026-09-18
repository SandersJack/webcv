import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import build_waterpolo_scene  # noqa: F401  (module-level main() builds and saves the scene)

GLB_PATH = os.path.join(C.MODELS_DIR, "waterpolo_scene.glb")
MANIFEST_PATH = os.path.join(C.MANIFESTS_DIR, "waterpolo_scene.json")
EXCLUDE = ("ENV_floor",)


def main() -> None:
    objs = C.export_collection_glb("SCN_waterpolo", GLB_PATH, EXCLUDE)
    tris, mat_count, dims = C.gather_stats(objs)
    manifest = {
        "id": "waterpolo_scene",
        "scene": "waterpolo",
        "sourceFile": "blender/waterpolo/waterpolo_scene.blend",
        "glbFile": "blender/exports/models/waterpolo_scene.glb",
        "previewFile": "blender/exports/previews/waterpolo_desktop.png",
        "previewFileMobile": "blender/exports/previews/waterpolo_mobile.png",
        "version": "0.1.0",
        "gridUnit": 1.0,
        "dimensions": dims,
        "triangleCount": tris,
        "materialCount": mat_count,
        "loadingPriority": "deferred",
        "interactiveIds": ["INT_waterpolo_ball"],
        "description": (
            "Low-poly voxel water polo pool in match setup: goal lines, 2 m and 5 m "
            "lines, half-distance line with a ball release ring, re-entry markers, "
            "officials' table and goal judge seats on a dark deck, lane ropes, and "
            "two floating goals with net cages riding on the water behind the goal lines. The "
            "yellow faceted ball floats at the centre; bubbles rise where the "
            "network story dissolves into water."
        ),
        "interactiveDescriptions": {
            "INT_waterpolo_ball": (
                "The water polo ball - the signature particle in its final form, "
                "changed in material, scale, and context. Buoyancy and throw pivots "
                "support the ball interaction."
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
