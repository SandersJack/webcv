# Jack Sanders Portfolio
## Blender voxel mini-scene plan

**Status:** Production brief
**Parent plan:** `docs/PRODUCTION_IMPLEMENTATION_PLAN.md`
**Purpose:** Define the Blender models, scene layouts, reusable kits, export rules, and review gates for the portfolio's interactive 3D world.

## 1. Visual brief

Create a connected set of voxel-inspired, low-poly miniature scenes. Each scene should look like a small scientific diorama or game environment that can be viewed from a controlled camera angle in the browser.

The scenes are not realistic simulations and should not be built as large photorealistic environments. Their job is to explain Jack's story quickly:

```text
detector -> particle tracks -> data network -> mobile experiences -> projects -> swimming pool
```

### Style keywords

- Voxel-inspired
- Low-poly
- Miniature diorama
- Scientific exhibit
- Calm and tactile
- Modular
- Deliberately simplified
- Strong silhouettes
- Carefully lit

### Avoid

- Photorealistic materials
- Generic sci-fi corridors
- Neon cyberpunk colour overload
- Smooth, glossy toy-like objects everywhere
- Tiny detail that cannot be read in the browser
- Random floating props with no narrative purpose
- Huge scenes that require loading every asset at once

## 2. Voxel language rules

### Shared grid

Use a common authoring grid so assets from different scenes feel related.

- Primary grid unit: `1 Blender unit` for hero block proportions.
- Small detail unit: `0.5` units where needed for handles, rails, cables, and controls.
- Avoid arbitrary dimensions that make assets impossible to align.
- Keep object origins at the logical base or centre of the asset, depending on interaction needs.
- Align modular pieces to the grid whenever practical.
- A visible grid is not required in the final render; the grid is a modelling discipline.

### Geometry

- Start with cubes, prisms, cylinders with low radial segments, planes, and curves.
- Use stepped forms instead of smooth continuous curvature.
- Use flat shading by default.
- Use bevels only on selected edges that need a readable highlight.
- Use a limited number of larger shapes rather than many tiny cubes.
- Use instancing for repeated modules such as tiles, detector stations, server units, and lane ropes.
- Keep cables and particle trails as low-segment curves or thin faceted tubes.

### Materials

Use a shared material library across all `.blend` files:

| Material | Use | Direction |
| --- | --- | --- |
| `MAT_dark_metal` | Detector frames, server racks, goal supports | Near-black charcoal, matte |
| `MAT_light_metal` | Detector rings, rails, equipment edges | Muted grey, matte |
| `MAT_off_white` | Labels, pool edges, exhibit bases | Warm white |
| `MAT_glass` | Detector windows, phone screen | Dark transparent or opaque fallback |
| `MAT_rubber` | Cables, tyres, ball seams | Dark soft contrast |
| `MAT_cyan_emissive` | Particle, hits, packets, signal | Small controlled glow |
| `MAT_science_blue` | Physics accents and tracks | Blue/cyan family |
| `MAT_mobile_warm` | Mobile development accents | Restrained amber or orange |
| `MAT_water_deep` | Pool volume and water planes | Deep blue |
| `MAT_water_light` | Surface highlights and bubbles | Lighter blue |
| `MAT_plant_green` | PlantPulse foliage | Muted natural green |
| `MAT_safety_yellow` | Warning stripes and pool markings | Used sparingly |

Use vertex colours or simple materials before adding textures. If a texture is necessary, it must be compressed and have a documented source.

### Lighting

- Use one consistent broad key light direction across the portfolio.
- Add a soft fill so dark objects remain readable.
- Use small emissive accents to guide attention, not to illuminate whole environments.
- Use ambient occlusion only if its cost is measured and acceptable.
- Avoid heavy bloom, volumetric fog, depth-of-field, and screen-space effects at launch.
- Ensure silhouettes remain readable with post-processing disabled.

## 3. Scene composition rules

Every scene is a small diorama with four layers:

1. **Base:** floor, plinth, pool, or abstract environment plane.
2. **Hero:** the object that communicates the section's subject.
3. **Supporting props:** only objects that clarify the system or story.
4. **Motion layer:** particles, packets, bubbles, water movement, or a moving signature sphere.

### Camera

- Use an orthographic or restrained perspective camera for a miniature exhibit feel.
- Establish a hero framing for desktop and a tighter crop for mobile.
- Keep interactive targets within the camera frustum at all supported sizes.
- Place important forms against uncluttered negative space.
- Do not require the user to freely fly through a large 3D level to find content.

### Scene scale

- Prefer compact scenes that can be understood in one camera view.
- Use scene transitions to suggest travel rather than increasing world size indefinitely.
- Keep each environment independently loadable.
- Build hero assets so their bounding boxes and pivot points are predictable.

## 4. Asset repository layout

Store Blender source files separately from exported web assets:

```text
blender/
  shared/
    materials.blend
    voxel_kit.blend
    lighting_rig.blend
    camera_rig.blend
    collection_template.blend
  detector/
    detector_scene.blend
    beam_pipe.blend
    detector_ring.blend
    tracker_station.blend
    straw_tracker.blend
    calorimeter_block.blend
    support_frame.blend
  physics/
    particle_station.blend
    event_display.blend
    histogram_terrain.blend
    measurement_module.blend
  mobile/
    smartphone_hero.blend
    network_context.blend
    network_node.blend
    network_landscape.blend
    router.blend
    server_rack.blend
    telecom_tower.blend
    home_network.blend
  projects/
    exhibition_base.blend
    plantpulse.blend
    na62_exhibit.blend
    homelab.blend
    mobile_device_exhibit.blend
  waterpolo/
    pool_scene.blend
    pool_tile.blend
    goal.blend
    ball.blend
    player.blend
    scoreboard.blend
    equipment.blend
  exports/
    models/
    previews/
    manifests/
```

Export web assets to a separate generated directory. Never edit exported GLB files manually; fix the Blender source and export again.

The `mobile/` directory replaces the earlier `work/` naming. The smartphone is the hero of this scene; `network_landscape`, `router`, `server_rack`, `telecom_tower`, and `home_network` are post-launch supporting assets.

## 5. Shared reusable kit

Build these before the environment-specific models:

### Voxel kit

- `VoxelBlock_S`, `VoxelBlock_M`, `VoxelBlock_L`.
- Half-block and quarter-block variants for steps and trim.
- Low-segment cylinder and ring primitives.
- Modular plate, rail, bracket, and support pieces.
- Faceted cable and pipe pieces.
- Small label plate and sign frame.
- Low-poly emissive orb.
- Particle trail curve with controlled taper.
- Shared plinth/base for exhibit objects.

### Interaction pivots

Every interactive object needs:

- A clean root object named `INT_<id>`.
- A visible mesh collection.
- An optional highlight collection or material slot.
- An empty named `PIVOT_<id>` for camera focus.
- A collision or hitbox proxy where pointer selection needs it.
- A short human-readable description stored in the asset manifest, not only in Blender.

## 6. Detector mini-scene

**Purpose:** Establish physics, CERN/NA62 context, and the first transformation of the signature sphere.

### Layout

```text
                 [support frame]
       [detector ring]  [detector ring]
  ======== beam pipe / particle path ========
       [tracker]       [photon blocks]
              [plinth / dark base]
```

### Models

- `detector_beam_pipe`: segmented pipe with open ends and a visible beam path.
- `detector_ring`: one modular ring, instanced into a short sequence.
- `detector_tracker_station`: stacked frame with simplified tracking elements.
- `detector_straw_tracker`: repeated faceted tubes, intentionally abstracted.
- `detector_photon_blocks`: chunky detector blocks with a few cyan hit points.
- `detector_calorimeter`: stepped block wall, not a detailed engineering replica.
- `detector_support_frame`: rails, feet, and braces to create scale.
- `detector_particle_track`: reusable curved trail with hit markers.
- `signature_particle`: small cyan/white faceted sphere with a stable origin.

### Interaction anchors

- `INT_detector_beam_pipe`: explains beam and particle path.
- `INT_detector_tracker`: explains tracking stations.
- `INT_detector_photon`: explains detection of light/energy.
- `INT_detector_signature_particle`: starts the journey and camera focus.

### Animation requirements

- Particle passes through the pipe.
- Detector rings separate during disassembly.
- Track and hit markers remain readable after components move apart.
- Fragments can transition into the physics scene without a hard cut.

## 7. Physics mini-scenes

**Purpose:** Turn the research story into understandable visual experiments.

### Particle station

Models:

- Small plinth with a magnetic-field indicator.
- Three faceted trajectory tracks.
- Charge and momentum markers as simple blocks/arrows.
- Adjustable field rings or directional bars.
- Particle start gate and detector hit markers.

Keep controls in HTML. The Blender scene provides a visual stage, not the simulation logic.

### Event display

Models:

- Central collision point.
- Concentric detector layers.
- Coloured track segments.
- Named particle markers with high-level labels.
- Small legend plate that has an HTML equivalent.

### Histogram landscape

Use a low-resolution stepped terrain made from instanced blocks. It should read as data without becoming a generic chart floating in space.

## 8. Mobile development mini-scene

**Purpose:** Show the transition from scientific data to connected mobile experiences, with the smartphone as the hero object.

### Smartphone hero

- Low-poly rounded rectangle body or a stepped rectangular device on a shared exhibit plinth, sized as the scene hero.
- Abstract app interface emerging from the screen, built from simple UI blocks.
- Neutral screen material with a simple abstract interface.
- No confidential screenshots, user data, or copied proprietary branding.
- Screen should be replaceable as a separate material/plane.
- Root pivot named `PIVOT_mobile_phone` for the camera transition.
- Interaction anchor `INT_mobile_phone` opens the mobile development case-study content and the live interactive demonstration.

### Network context

- A small number of `network_node` blocks with one or two connection ports.
- Faceted cables or thin lines between nodes.
- Packets represented by the signature sphere or small emissive cubes flowing into the phone.

Keep node count low enough that individual connections are visible. The network explains connected experiences; it must not overshadow the phone.

### Deferred supporting assets (post-launch)

#### Network landscape

- Dark modular base plane.
- A central router as a secondary hero.
- Server rack and telecom tower as background silhouettes.
- Layout should resemble a miniature infrastructure exhibit rather than a floating graph.

#### Router

- Chunky rectangular body.
- Simple port row and one or two signal lights.
- Oversized readable antenna or signal arc.
- Root pivot for camera approach.

#### Server rack

- Four to six repeated server units.
- Rails, patch panel, one switch, and a few cables.
- LEDs as small emissive blocks.
- No vendor branding unless licensed and relevant.

#### Telecom tower

- Stepped tower frame.
- Small antenna blocks.
- Three restrained signal arcs or packet paths.
- Stable base so the object reads at a distance.

#### Home network

Use a miniature house cutaway:

```text
        [devices]
           ^
        [Wi-Fi]
           ^
       [smart hub]
```

The house should be an explanatory prop, not a literal domestic interior.

## 9. Project exhibition mini-scenes

**Purpose:** Give real projects physical, memorable anchors while keeping the case studies in accessible HTML.

Use one shared exhibition base with separate plinths. Projects should feel like museum exhibits in the same world.

### Exhibition base

- Modular dark floor or off-white plinth.
- Low steps and a small label plate per exhibit.
- Consistent key light and spacing.
- Empty plinth reserved for future work without implying that the work exists yet.

### PlantPulse

Layout:

```text
[plant] -> [sensor/soil] -> [wireless signal] -> [phone]
```

Models:

- Potted plant with chunky leaves.
- Soil block and moisture probe.
- Small MCU board with oversized readable components.
- Temperature/light sensor blocks.
- Battery and optional solar panel.
- Phone or display endpoint.
- Wireless packets using small dots or the signature sphere.

Interaction anchor: clicking the plant opens the PlantPulse case study. The flow should communicate sensing, transmission, and feedback in that order.

### NA62 exhibit

Use a compact detector model related to the hero detector but not a second full environment.

- Beam pipe.
- Two or three detector layers.
- Kaon, pion, photon, and track markers as labelled abstract objects.
- A small activation sequence when the kaon is selected.

Clearly label the scene as a simplified educational exhibit.

### HomeLab

Models:

- Four-unit server rack.
- Mini computer, switch, router, NAS, and patch panel.
- Chunky cable connections.
- Monitoring screen with abstract bars/lines.
- Request packet travelling through a short route.

Animation:

```text
request -> reverse proxy -> service -> database
```

Use labels in HTML and keep the model readable if the animation is disabled.

### Mobile device exhibit

Use a giant low-poly phone or tablet rising from a project plinth. It can reuse the smartphone hero asset from the mobile development scene with a different screen material and surrounding props.

## 10. Water polo mini-scene

**Purpose:** Transform the network into water and show the sporting identity with an energetic but respectful scene.

### Pool layout

```text
        [goal]                 [goal]
  ========================================
  | lane | lane | player formation | lane |
  |      |      |                  |      |
  ========================================
```

Models:

- Pool floor and walls.
- Repeated voxel tile kit.
- Lane markings and lane ropes.
- Depth markings as simple readable blocks/decals.
- Ladders, benches, and pool edge.
- Two goals with faceted frames and simplified nets.
- Scoreboard and shot clock.
- Spare balls and equipment props used sparingly.

### Ball

- Low-poly faceted sphere with a small number of seam bands.
- Same root identity as the opening particle where possible.
- Buoyancy point and throw pivot empties.
- Readable silhouette against deep water.

### Player

- Abstract low-poly body with head, torso, arms, cap, and waterline.
- Use a small number of pose variants rather than realistic animation rigs at launch.
- No identifying facial features.
- Team colours should be generic until approved.
- Keep player models as tactical markers first and characters second.

### Tactical view

Create a separate top-down formation asset or use simplified player markers. Do not force the browser camera to rotate unpredictably. The HTML tactical explanation remains the source of truth.

## 11. Transition assets

Build transitions from reusable objects rather than bespoke effects for every section:

- `transition_particle_to_hit`: sphere gains a hit ring and leaves a track.
- `transition_hit_to_node`: hit markers flatten into data blocks.
- `transition_node_to_network`: blocks gain ports and connect with cables.
- `transition_network_to_water`: cables dissolve into flowing dots and bubbles.
- `transition_bubble_to_ball`: the signature sphere changes material, scale, and context.

Each transition should have an instant/static state for reduced motion and a poster frame for loading/error fallback.

## 12. Object naming and collections

Use predictable names for scene code and asset review:

```text
SCN_<scene>
ENV_<environment>
HERO_<asset>
PROP_<asset>
FX_<effect>
INT_<interactive-id>
PIVOT_<camera-target>
COLL_<collection-purpose>
MAT_<material>
```

Example:

```text
SCN_detector
  ENV_detector_base
  HERO_detector_beam_pipe
  PROP_detector_tracker_01
  FX_detector_particle_track
  INT_detector_beam_pipe
  PIVOT_detector_beam_pipe
```

Do not depend on Blender-generated names such as `Cube.001` in application code.

## 13. Export specification

For every web asset, export:

- `.glb` with transforms applied where safe.
- Compressed mesh using the selected Draco or Meshopt pipeline.
- No unused cameras, lights, hidden collections, or source-only helpers.
- Materials converted to the supported web material set.
- Stable object names retained.
- Origin and scale verified against the scene manifest.
- Poster image at a fixed preview size.
- Optional low-detail GLB for mobile or low-graphics mode.

### Asset manifest fields

```ts
type AssetManifest = {
  id: string
  scene: 'detector' | 'physics' | 'mobile' | 'projects' | 'waterpolo'
  sourceFile: string
  glbFile: string
  previewFile: string
  version: string
  gridUnit: number
  dimensions: [number, number, number]
  triangleCount: number
  materialCount: number
  loadingPriority: 'initial' | 'next' | 'deferred'
  mobileVariant?: string
  interactiveIds: string[]
  publicityLevel: 'public' | 'review-required'
}
```

## 14. Budgets and review gates

Set exact budgets after the first detector prototype, then enforce them in CI or an asset validation script.

Initial guidance:

- Hero asset should favour silhouette and composition over detail.
- Repeated modules must be instanced where possible.
- Avoid large textures; use materials and vertex colours first.
- Keep each scene independently loadable and measurable.
- Keep mobile variants materially simpler, not just scaled down.
- Record triangle count, material count, file size, and texture memory for every export.

### Review gates

An asset is ready when:

1. Its silhouette is recognisable in the browser camera.
2. It follows the shared voxel grid and material language.
3. It has a clear narrative purpose.
4. It has a stable origin, pivot, and object naming scheme.
5. It includes a fallback preview and accessibility description.
6. It passes the export and compression pipeline.
7. It has no unapproved branding, private data, or licensing problems.
8. It is tested in high, low, and no-3D modes where applicable.

## 15. Blender production sequence

Sprints 1-5 produce the minimum lovable experience assets. Sprint 6 is the launch gate. Sprint 7 and beyond are post-launch enrichment.

### Sprint 1: shared kit

- Create voxel blocks, materials, plinth, lighting rig, camera rig, particle, packet, and trail.
- Export a small style test scene.
- Review on desktop and mobile-sized viewport.

### Sprint 2: detector hero

- Build beam pipe, rings, tracker, support frame, particle path, and disassembly poses.
- Test the first browser import before modelling more scenes.

### Sprint 3: mobile development hero

- Build the smartphone hero with abstract app UI, minimal network nodes, and packets.
- Test the data-to-network transition into the phone scene.

### Sprint 4: water polo core

- Build pool kit, goals, and ball.
- Test the network-to-water transition and mobile camera framing.

### Sprint 5: minimum lovable experience assembly

- Assemble the detector, phone, and pool scenes with the signature sphere travelling between them.
- Add reduced-motion and fallback poster states for every MLE scene.

### Sprint 6: optimisation and launch gate

- Create low-detail variants.
- Compress and measure exports.
- Remove unused geometry and materials.
- Validate names, pivots, fallbacks, and public-content approval.

### Sprint 7+: post-launch enrichment

- Physics mini-scenes: interactive event display, particle station, and histogram terrain.
- Full network landscape: router, server rack, telecom tower, and home network cutaway.
- Project exhibition assets: exhibition base, PlantPulse, NA62 exhibit, and HomeLab.
- Water polo extras: scoreboard, tactical markers, and abstract player poses.

## 16. Acceptance checklist

- The voxel-inspired style is visible immediately in the detector hero.
- The minimum lovable experience (detector hero, signature particle, smartphone hero, pool, goal, ball) can launch without any deferred asset.
- All five environments look like one world rather than unrelated asset packs.
- Physics, mobile development, and water polo each have a distinct hero mini-scene; projects may launch as accessible HTML case studies with 3D exhibits added post-launch.
- The signature sphere is recognisable and reusable across scenes.
- Important objects are readable at both desktop and mobile camera framings.
- No scene requires photorealistic rendering or heavy post-processing.
- All models have HTML descriptions and route links outside the canvas.
- Asset loading can be progressive and failures have poster/static fallbacks.
- GLB exports are compressed, named, measurable, and traceable to Blender sources.
- The final scene library can grow without requiring a monolithic Blender file.
