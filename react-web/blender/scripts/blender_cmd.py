#!/usr/bin/env python3
"""Minimal socket client for the mcp-for-blender addon (localhost:9876).

Usage:
    blender_cmd.py get_scene_info
    blender_cmd.py execute_code '{"code": "import bpy; print(bpy.data.objects.keys())"}'
    blender_cmd.py run_file path/to/script.py

The addon speaks one JSON request -> one JSON response per connection.
"""
from __future__ import annotations

import json
import os
import socket
import sys

HOST = "localhost"
PORT = 9876
TIMEOUT = 120.0


def send_command(cmd_type: str, params: dict | None = None) -> dict:
    payload = json.dumps({"type": cmd_type, "params": params or {}}).encode("utf-8")
    with socket.create_connection((HOST, PORT), timeout=TIMEOUT) as sock:
        sock.sendall(payload)
        # The addon keeps the connection open after answering, so parse the
        # buffer after every chunk and stop as soon as one full JSON object
        # has arrived.
        buffer = b""
        while True:
            data = sock.recv(65536)
            if not data:
                break
            buffer += data
            try:
                return json.loads(buffer.decode("utf-8"))
            except (json.JSONDecodeError, UnicodeDecodeError):
                continue
    if not buffer:
        return {"status": "error", "message": "empty response from Blender"}
    return json.loads(buffer.decode("utf-8"))


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    cmd = sys.argv[1]
    if cmd == "run_file":
        if len(sys.argv) < 3:
            print("run_file requires a path")
            return 2
        # Resolve on the client: the Blender process has a different CWD, so a
        # relative path would break the module-cache purge in the exec wrapper.
        path = os.path.abspath(sys.argv[2])
        with open(path, "r", encoding="utf-8") as fh:
            code = fh.read()
        # exec with a real __file__ so scripts can resolve siblings; drop cached
        # sibling modules first - sys.modules persists across execute_code calls
        # in the same Blender process, so stale _common/kit_parts would win.
        wrapped = (
            f"__file__ = {path!r}\n"
            "import sys as _s, os as _o\n"
            "_d = _o.path.dirname(_o.path.abspath(__file__))\n"
            "for _k in [k for k, m in list(_s.modules.items())\n"
            "           if getattr(m, '__file__', None)\n"
            "           and _o.path.dirname(_o.path.abspath(m.__file__)) == _d]:\n"
            "    _s.modules.pop(_k)\n"
        ) + code
        result = send_command("execute_code", {"code": wrapped})
    elif cmd == "execute_code":
        result = send_command("execute_code", json.loads(sys.argv[2]))
    else:
        params = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
        result = send_command(cmd, params)

    status = result.get("status")
    if status == "success":
        print(json.dumps(result.get("result"), indent=2, default=str))
        return 0
    print(json.dumps(result, indent=2, default=str))
    return 1


if __name__ == "__main__":
    sys.exit(main())
