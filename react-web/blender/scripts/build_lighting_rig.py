import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import bpy
from mathutils import Vector


def add_area(name, location, energy, size, color, target=(0.0, 0.0, 0.0)):
    data = bpy.data.lights.new(name, type='AREA')
    data.energy = energy
    data.shape = 'DISK'
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    obj.location = location
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()
    return obj


def main() -> None:
    C.reset_scene()
    rig = C.make_collection("COLL_lighting_rig")

    key = add_area("LIGHT_key", (5.5, -4.5, 8.0), 800.0, 5.0, (1.0, 0.96, 0.9))
    C.link_only(key, rig)

    fill = add_area("LIGHT_fill", (-5.0, 3.0, 4.5), 320.0, 6.0, (0.72, 0.8, 1.0))
    C.link_only(fill, rig)

    rim = add_area("LIGHT_rim", (0.5, 6.0, 7.0), 550.0, 3.0, (0.9, 0.95, 1.0))
    C.link_only(rim, rig)

    world = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = (0.012, 0.02, 0.038, 1.0)
    bg.inputs["Strength"].default_value = 0.45

    C.save(C.LIGHTING_RIG_BLEND)
    print("lights:", [o.name for o in bpy.context.scene.objects])


main()
