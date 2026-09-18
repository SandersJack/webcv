"""Shared helpers for the webcv Blender asset build scripts.

Every build script runs inside Blender via the mcp-for-blender socket
(scripts/blender_cmd.py run_file ...) and starts from a factory-empty scene,
so builds are idempotent: rerun a script, get the same .blend.
"""
from __future__ import annotations

import os
import tempfile

import bpy

BLENDER_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHARED_DIR = os.path.join(BLENDER_ROOT, "shared")
EXPORTS_DIR = os.path.join(BLENDER_ROOT, "exports")
MODELS_DIR = os.path.join(EXPORTS_DIR, "models")
PREVIEWS_DIR = os.path.join(EXPORTS_DIR, "previews")
MANIFESTS_DIR = os.path.join(EXPORTS_DIR, "manifests")

MATERIALS_BLEND = os.path.join(SHARED_DIR, "materials.blend")
VOXEL_KIT_BLEND = os.path.join(SHARED_DIR, "voxel_kit.blend")
LIGHTING_RIG_BLEND = os.path.join(SHARED_DIR, "lighting_rig.blend")
CAMERA_RIG_BLEND = os.path.join(SHARED_DIR, "camera_rig.blend")

GRID_UNIT = 1.0
DETAIL_UNIT = 0.5

WORKING_BLEND = os.path.join(tempfile.gettempdir(), "webcv_working.blend")


def reset_scene() -> None:
    # Purge by hand instead of read_factory_settings(): reloading the startup
    # file tears down the mcp-for-blender socket server mid-request.
    # Detach from any shared library file first: libraries.load() refuses to
    # read from the current blend file.
    if bpy.data.filepath.startswith(SHARED_DIR + os.sep):
        bpy.ops.wm.save_as_mainfile(filepath=WORKING_BLEND)
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    master = bpy.context.scene.collection
    for _ in range(10):
        leftover = [c for c in bpy.data.collections if c != master]
        if not leftover:
            break
        for coll in leftover:
            try:
                bpy.data.collections.remove(coll)
            except Exception:
                pass
    for block in (bpy.data.materials, bpy.data.meshes, bpy.data.curves, bpy.data.cameras, bpy.data.lights):
        for datablock in list(block):
            block.remove(datablock)
    # Unload linked libraries too: Blender refuses to overwrite a .blend that
    # the current session links against, and rebuilds must stay idempotent.
    for lib in list(bpy.data.libraries):
        bpy.data.libraries.remove(lib, do_unlink=True)
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 1.0


def save(filepath: str) -> None:
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=filepath)
    bpy.ops.wm.save_as_mainfile(filepath=WORKING_BLEND)
    print(f"saved {filepath}")


def make_collection(name: str, parent: bpy.types.Collection | None = None) -> bpy.types.Collection:
    coll = bpy.data.collections.get(name) or bpy.data.collections.new(name)
    parent = parent or bpy.context.scene.collection
    if coll.name not in [c.name for c in parent.children]:
        parent.children.link(coll)
    return coll


def link_only(obj: bpy.types.Object, coll: bpy.types.Collection) -> None:
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    coll.objects.link(obj)


def set_principled_input(bsdf: bpy.types.Node, names: tuple[str, ...], value) -> None:
    for name in names:
        socket = bsdf.inputs.get(name)
        if socket is not None:
            socket.default_value = value
            return
    raise KeyError(f"none of {names} found on {bsdf.bl_idname}")


def make_material(
    name: str,
    base_color: tuple[float, float, float],
    metallic: float = 0.0,
    roughness: float = 0.6,
    emission: tuple[float, float, float] | None = None,
    emission_strength: float = 0.0,
    transmission: float = 0.0,
    alpha: float = 1.0,
) -> bpy.types.Material:
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    # Orphan datablocks are dropped on save; library files hold zero-user materials.
    mat.use_fake_user = True
    mat.use_nodes = True
    mat.diffuse_color = (*base_color, alpha)
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    set_principled_input(bsdf, ("Base Color",), (*base_color, 1.0))
    set_principled_input(bsdf, ("Metallic",), metallic)
    set_principled_input(bsdf, ("Roughness",), roughness)
    if emission is not None:
        set_principled_input(bsdf, ("Emission Color", "Emission"), (*emission, 1.0))
        set_principled_input(bsdf, ("Emission Strength",), emission_strength)
    if transmission > 0.0:
        set_principled_input(bsdf, ("Transmission Weight", "Transmission"), transmission)
    if alpha < 1.0:
        set_principled_input(bsdf, ("Alpha",), alpha)
        mat.surface_render_method = 'DITHERED'
    return mat


def link_library_collection(blend_path: str, coll_name: str, place_in_scene: bool = False) -> bpy.types.Collection:
    with bpy.data.libraries.load(blend_path, link=True) as (data_from, data_to):
        data_to.collections = [coll_name]
    coll = data_to.collections[0]
    if place_in_scene:
        bpy.context.scene.collection.children.link(coll)
    return coll


def link_library_materials(blend_path: str) -> None:
    with bpy.data.libraries.load(blend_path, link=True) as (data_from, data_to):
        data_to.materials = data_from.materials


def add_box(
    name: str,
    size: tuple[float, float, float],
    location: tuple[float, float, float] = (0.0, 0.0, 0.0),
    base_origin: bool = True,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True)
    if base_origin:
        for v in obj.data.vertices:
            v.co.z += size[2] / 2
        obj.data.update()
    return obj


def assign_material(obj: bpy.types.Object, mat_name: str) -> None:
    mat = bpy.data.materials.get(mat_name)
    if mat is None:
        raise KeyError(f"material {mat_name} not loaded")
    if obj.data and hasattr(obj.data, "materials"):
        obj.data.materials.clear()
        obj.data.materials.append(mat)


def shade_flat(obj: bpy.types.Object) -> None:
    if obj.type == 'MESH':
        for poly in obj.data.polygons:
            poly.use_smooth = False
