import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _common as C
import bpy

ORTHO_DESKTOP = 10.0
ORTHO_MOBILE = 6.0


def main() -> None:
    C.reset_scene()
    rig = C.make_collection("COLL_camera_rig")

    cam_data = bpy.data.cameras.new("CAM_hero")
    cam_data.type = 'ORTHO'
    cam_data.ortho_scale = ORTHO_DESKTOP
    cam_data.lens = 50.0
    cam = bpy.data.objects.new("CAM_hero", cam_data)
    cam.location = (11.0, -11.0, 9.0)
    cam["ortho_desktop"] = ORTHO_DESKTOP
    cam["ortho_mobile"] = ORTHO_MOBILE
    rig.objects.link(cam)

    pivot = bpy.data.objects.new("PIVOT_cam_target", None)
    pivot.empty_display_size = 0.4
    pivot.location = (0.0, 0.0, 0.8)
    rig.objects.link(pivot)

    track = cam.constraints.new('TRACK_TO')
    track.target = pivot
    track.track_axis = 'TRACK_NEGATIVE_Z'
    track.up_axis = 'UP_Y'

    bpy.context.scene.camera = cam
    C.save(C.CAMERA_RIG_BLEND)
    print("camera rig:", [o.name for o in bpy.context.scene.objects])


main()
