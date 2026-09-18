import traceback

import bpy

ADDON = "blender_mcp"


def start() -> None:
    try:
        if not hasattr(bpy.types.Scene, "blendermcp_auto_start_server"):
            bpy.ops.preferences.addon_enable(module=ADDON)
            bpy.ops.wm.save_userpref()
            print(f"MCP_BOOTSTRAP addon {ADDON} enabled + prefs saved")
        scene = bpy.context.scene
        scene.blendermcp_auto_start_server = True
        bpy.ops.blendermcp.start_server()
        bpy.ops.wm.save_homefile()
        print(f"MCP_BOOTSTRAP_OK running={scene.blendermcp_server_running}")
    except Exception:
        traceback.print_exc()
        print("MCP_BOOTSTRAP_FAILED")


start()
