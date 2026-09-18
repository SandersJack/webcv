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
        "version": "0.2.0",
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
            "Low-poly voxel model of the NA62 detector at CERN on an exhibit plinth, "
            "laid out in beam order: the KTAG kaon tagger and Gigatracker plates feed "
            "a long green decay vacuum tank lined with amber LAV veto rings and four gold "
            "STRAW tracking chambers straddling the dark MNP33 dipole magnet, followed "
            "by the long stepped RICH cylinder, the CHOD disk, the fat blue octagonal LKr "
            "calorimeter, and the MUV muon-veto slabs behind their iron wall. A glowing "
            "signature kaon and cyan hit markers trace the particle path; stations "
            "slide apart along the beam axis in a disassembly animation."
        ),
        "interactiveDescriptions": {
            "INT_detector_beam_pipe": "Segmented beam pipe carrying the kaon beam through the detector.",
            "INT_detector_tracker": "STRAW chambers: gold straw tubes track the decay products around the MNP33 magnet.",
            "INT_detector_photon": "LKr liquid-krypton calorimeter measuring photon and electron energy.",
            "INT_detector_signature_particle": "The signature kaon entering the detector; starts the journey.",
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
