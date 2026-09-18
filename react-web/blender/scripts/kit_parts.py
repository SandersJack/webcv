import _common as C
import bpy


def join_objects(objs: list, name: str):
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    objs[0].name = name
    return objs[0]


def make_tube_curve(name: str, bevel: float, points: list, radii: list):
    cu = bpy.data.curves.new(name, 'CURVE')
    cu.dimensions = '3D'
    cu.resolution_u = 2
    cu.bevel_depth = bevel
    cu.bevel_resolution = 1
    sp = cu.splines.new('BEZIER')
    sp.bezier_points.add(len(points) - 1)
    for bp, co, r in zip(sp.bezier_points, points, radii):
        bp.co = co
        bp.radius = r
        bp.handle_left_type = 'AUTO'
        bp.handle_right_type = 'AUTO'
    return bpy.data.objects.new(name, cu)


def build_blocks(coll) -> None:
    for name, size in [
        ("VoxelBlock_S", (0.5, 0.5, 0.5)),
        ("VoxelBlock_M", (1.0, 1.0, 1.0)),
        ("VoxelBlock_L", (2.0, 2.0, 2.0)),
        ("VoxelBlock_half", (1.0, 1.0, 0.5)),
        ("VoxelBlock_quarter", (1.0, 0.5, 0.5)),
    ]:
        o = C.add_box(name, size)
        C.assign_material(o, "MAT_off_white")
        C.link_only(o, coll)


def build_primitives(coll) -> None:
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.5, depth=1.0)
    cyl8 = bpy.context.active_object
    cyl8.name = "Cyl_8"
    C.assign_material(cyl8, "MAT_light_metal")
    C.link_only(cyl8, coll)

    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.5, depth=1.0)
    cyl12 = bpy.context.active_object
    cyl12.name = "Cyl_12"
    C.assign_material(cyl12, "MAT_light_metal")
    C.link_only(cyl12, coll)

    bpy.ops.mesh.primitive_torus_add(
        major_segments=12, minor_segments=4, major_radius=1.0, minor_radius=0.15
    )
    ring = bpy.context.active_object
    ring.name = "Ring_12"
    C.shade_flat(ring)
    C.assign_material(ring, "MAT_light_metal")
    C.link_only(ring, coll)


def build_modular(coll) -> None:
    plate = C.add_box("Plate_1x1", (1.0, 1.0, 0.1))
    C.assign_material(plate, "MAT_dark_metal")
    C.link_only(plate, coll)

    rail = C.add_box("Rail_2u", (2.0, 0.1, 0.1))
    C.assign_material(rail, "MAT_dark_metal")
    C.link_only(rail, coll)

    b_vert = C.add_box("bracket_vert", (0.1, 0.1, 0.5))
    b_horiz = C.add_box("bracket_horiz", (0.4, 0.1, 0.1), location=(0.25, 0.0, 0.45), base_origin=False)
    bracket = join_objects([b_vert, b_horiz], "Bracket_L")
    C.assign_material(bracket, "MAT_dark_metal")
    C.link_only(bracket, coll)

    s_strut = C.add_box("strut", (0.2, 0.2, 1.0))
    s_foot = C.add_box("foot", (0.5, 0.5, 0.1))
    support = join_objects([s_strut, s_foot], "Support_strut")
    C.assign_material(support, "MAT_dark_metal")
    C.link_only(support, coll)


def build_pipes(coll) -> None:
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=8, radius=0.08, depth=2.0, rotation=(0.0, 1.5707963, 0.0)
    )
    pipe = bpy.context.active_object
    pipe.name = "Pipe_straight"
    bpy.ops.object.transform_apply(rotation=True)
    C.assign_material(pipe, "MAT_light_metal")
    C.link_only(pipe, coll)

    cable = make_tube_curve(
        "Cable_curve",
        0.03,
        [(-1.0, 0.0, 0.0), (-0.4, 0.3, 0.2), (0.4, -0.3, 0.1), (1.0, 0.0, 0.0)],
        [1.0, 1.0, 1.0, 1.0],
    )
    C.assign_material(cable, "MAT_rubber")
    coll.objects.link(cable)


def build_signage(coll) -> None:
    label = C.add_box("Label_plate", (0.6, 0.05, 0.3))
    C.assign_material(label, "MAT_off_white")
    C.link_only(label, coll)

    post = C.add_box("sign_post", (0.06, 0.06, 0.8))
    plate = C.add_box("sign_plate", (1.0, 0.06, 0.6), location=(0.0, 0.0, 0.8))
    C.assign_material(post, "MAT_dark_metal")
    C.assign_material(plate, "MAT_off_white")
    sign = join_objects([post, plate], "Sign_frame")
    C.link_only(sign, coll)


def build_fx(coll) -> None:
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.15)
    particle = bpy.context.active_object
    particle.name = "FX_signature_particle"
    C.shade_flat(particle)
    C.assign_material(particle, "MAT_cyan_emissive")
    C.link_only(particle, coll)

    root = bpy.data.objects.new("INT_signature_particle", None)
    root.empty_display_size = 0.3
    coll.objects.link(root)
    pivot = bpy.data.objects.new("PIVOT_signature_particle", None)
    pivot.empty_display_size = 0.2
    coll.objects.link(pivot)
    particle.parent = root
    pivot.parent = root

    packet = C.add_box("FX_packet", (0.12, 0.12, 0.12), base_origin=False)
    C.assign_material(packet, "MAT_cyan_emissive")
    C.link_only(packet, coll)

    trail = make_tube_curve(
        "FX_particle_trail",
        0.05,
        [(-2.0, 0.0, 0.5), (-0.7, 0.4, 0.9), (0.7, -0.4, 0.6), (2.0, 0.0, 0.5)],
        [1.0, 0.8, 0.5, 0.25],
    )
    C.assign_material(trail, "MAT_cyan_emissive")
    coll.objects.link(trail)


def build_plinth(coll) -> None:
    base = C.add_box("plinth_base", (4.0, 4.0, 0.3))
    top = C.add_box("plinth_top", (3.4, 3.4, 0.15), location=(0.0, 0.0, 0.3))
    C.assign_material(base, "MAT_dark_metal")
    C.assign_material(top, "MAT_off_white")
    plinth = join_objects([base, top], "Plinth_exhibit")
    C.link_only(plinth, coll)

    label = C.add_box("plinth_label", (0.8, 0.06, 0.25))
    C.assign_material(label, "MAT_off_white")
    label.name = "Plinth_label"
    C.link_only(label, coll)
