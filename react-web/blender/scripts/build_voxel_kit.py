import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import bpy
import kit_parts as K


def main() -> None:
    C.reset_scene()
    C.link_library_materials(C.MATERIALS_BLEND)

    kit = C.make_collection("COLL_voxel_kit")
    blocks = C.make_collection("COLL_kit_blocks", kit)
    prims = C.make_collection("COLL_kit_primitives", kit)
    modular = C.make_collection("COLL_kit_modular", kit)
    pipes = C.make_collection("COLL_kit_pipes", kit)
    signage = C.make_collection("COLL_kit_signage", kit)
    fx = C.make_collection("COLL_kit_fx", kit)
    plinths = C.make_collection("COLL_kit_plinths", kit)

    K.build_blocks(blocks)
    K.build_primitives(prims)
    K.build_modular(modular)
    K.build_pipes(pipes)
    K.build_signage(signage)
    K.build_fx(fx)
    K.build_plinth(plinths)

    # Display grid so the kit file is browsable in the viewport.
    for i, obj in enumerate(bpy.context.scene.objects):
        if obj.parent is None and obj.type in {'MESH', 'CURVE'}:
            obj.location = ((i % 6) * 3.0, (i // 6) * 3.0, 0.0)
        if obj.type in {'MESH', 'CURVE'} and obj.data:
            obj.data.name = obj.name

    C.save(C.VOXEL_KIT_BLEND)
    print("objects:", sorted(o.name for o in bpy.context.scene.objects))


main()
