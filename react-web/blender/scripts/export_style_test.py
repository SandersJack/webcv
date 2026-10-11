import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import bpy
import build_style_test
from mathutils import Vector

GLB_PATH = os.path.join(C.MODELS_DIR, "style_test.glb")
MANIFEST_PATH = os.path.join(C.MANIFESTS_DIR, "style_test.json")
EXCLUDE = {"ENV_floor"}


def export_objects():
    coll = bpy.data.collections["SCN_style_test"]
    objs = [o for o in coll.all_objects if o.name not in EXCLUDE and o.type in {'MESH', 'CURVE', 'EMPTY'}]
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objs:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    for obj in objs:
        if obj.type == 'CURVE':
            bpy.context.view_layer.objects.active = obj
            bpy.ops.object.convert(target='MESH')
    bpy.ops.export_scene.gltf(
        filepath=GLB_PATH,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_cameras=False,
        export_lights=False,
        export_draco_mesh_compression_enable=True,
    )
    return objs


def gather_stats(objs):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    tris = 0
    materials = set()
    low = Vector((float("inf"),) * 3)
    high = Vector((float("-inf"),) * 3)
    for obj in objs:
        if obj.type not in {'MESH', 'CURVE'}:
            continue
        evaluated = obj.evaluated_get(depsgraph)
        mesh = evaluated.to_mesh()
        tris += sum(len(p.vertices) - 2 for p in mesh.polygons)
        materials.update(m.name for m in mesh.materials if m)
        for corner in obj.bound_box:
            world = obj.matrix_world @ Vector(corner)
            low = Vector(map(min, low, world))
            high = Vector(map(max, high, world))
        evaluated.to_mesh_clear()
    dims = [round(high[i] - low[i], 3) for i in range(3)]
    return tris, len(materials), dims


def main() -> None:
    # Importing build_style_test already ran its module-level main(): the scene
    # is built, previews rendered, and style_test.blend saved.
    objs = export_objects()
    tris, mat_count, dims = gather_stats(objs)
    manifest = {
        "id": "style_test",
        "scene": "detector",
        "sourceFile": "blender/style_test.blend",
        "glbFile": "blender/exports/models/style_test.glb",
        "previewFile": "blender/exports/previews/style_test_desktop.png",
        "previewFileMobile": "blender/exports/previews/style_test_mobile.png",
        "version": "0.1.0",
        "gridUnit": 1.0,
        "dimensions": dims,
        "triangleCount": tris,
        "materialCount": mat_count,
        "loadingPriority": "initial",
        "interactiveIds": ["INT_detector_signature_particle"],
        "description": (
            "Voxel style-test diorama on an exhibit plinth: two faceted detector rings "
            "threaded on a beam pipe, a glowing cyan signature particle with a tapered "
            "trail, a blue data block, and a sign. Establishes the shared low-poly "
            "material and lighting language for the portfolio's 3D scenes."
        ),
        "interactiveDescriptions": {
            "INT_detector_signature_particle": (
                "The signature particle inside the beam pipe. Selecting it starts the "
                "journey through the detector scene."
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
