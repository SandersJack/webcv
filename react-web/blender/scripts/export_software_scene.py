import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import build_software_scene  # noqa: F401  (module-level main() builds and saves the scene)

GLB_PATH = os.path.join(C.MODELS_DIR, "software_scene.glb")
MANIFEST_PATH = os.path.join(C.MANIFESTS_DIR, "software_scene.json")
EXCLUDE = ("ENV_floor",)


def main() -> None:
    objs = C.export_collection_glb("SCN_software", GLB_PATH, EXCLUDE)
    tris, mat_count, dims = C.gather_stats(objs)
    manifest = {
        "id": "software_scene",
        "scene": "software",
        "sourceFile": "blender/software/software_scene.blend",
        "glbFile": "blender/exports/models/software_scene.glb",
        "previewFile": "blender/exports/previews/software_desktop.png",
        "previewFileMobile": "blender/exports/previews/software_mobile.png",
        "version": "0.1.0",
        "gridUnit": 1.0,
        "dimensions": dims,
        "mobileVariant": "blender/exports/models/software_scene_mobile.glb",
        "triangleCount": tris,
        "materialCount": mat_count,
        "loadingPriority": "next",
        "interactiveIds": ["INT_software_laptop"],
        "description": (
            "Low-poly voxel hybrid workspace: an open laptop with a terminal screen showing "
            "code lines, a compact server rack with status LEDs, a smartphone on a stand, "
            "and an IoT plant sensor with a glowing probe. Cyan wifi arcs radiate from the "
            "server with animated data packets flowing to each device. Represents the full "
            "stack from C++ backends to mobile frontends and connected devices."
        ),
        "interactiveDescriptions": {
            "INT_software_laptop": (
                "The developer laptop: terminal lines represent C++, Python, and infrastructure "
                "code. Selecting it opens the software development case-study content."
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
