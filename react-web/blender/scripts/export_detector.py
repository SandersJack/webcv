import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import build_detector_scene  # noqa: F401  (module-level main() builds and saves the scene)

GLB_PATH = os.path.join(C.MODELS_DIR, "detector_scene.glb")
MANIFEST_PATH = os.path.join(C.MANIFESTS_DIR, "detector_scene.json")
EXCLUDE = ("ENV_floor",)


def main() -> None:
    objs = C.export_collection_glb("SCN_detector", GLB_PATH, EXCLUDE)
    tris, mat_count, dims = C.gather_stats(objs)
    manifest = {
        "id": "detector_scene",
        "scene": "detector",
        "sourceFile": "blender/detector/detector_scene.blend",
        "glbFile": "blender/exports/models/detector_scene.glb",
        "previewFile": "blender/exports/previews/detector_desktop.png",
        "previewFileMobile": "blender/exports/previews/detector_mobile.png",
        "version": "0.1.0",
        "gridUnit": 1.0,
        "dimensions": dims,
        "triangleCount": tris,
        "materialCount": mat_count,
        "loadingPriority": "initial",
        "interactiveIds": [
            "INT_detector_beam_pipe",
            "INT_detector_tracker",
            "INT_detector_photon",
            "INT_detector_signature_particle",
        ],
        "description": (
            "Low-poly voxel model of a particle physics detector on an exhibit plinth: "
            "a segmented beam pipe passes through three faceted detector rings, a "
            "tracking station with straw tubes, photon detector blocks with cyan hit "
            "markers, and a stepped calorimeter wall. A glowing signature particle and "
            "curved track show the particle path. Stations can slide apart along the "
            "beam axis in a disassembly animation."
        ),
        "interactiveDescriptions": {
            "INT_detector_beam_pipe": "Segmented beam pipe carrying the particle through the detector.",
            "INT_detector_tracker": "Tracking station: layered plates and straw tubes record the particle's position.",
            "INT_detector_photon": "Photon detector blocks; cyan markers show detected light.",
            "INT_detector_signature_particle": "The signature particle entering the detector; starts the journey.",
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
