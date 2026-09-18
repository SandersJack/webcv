# Jack Sanders — Interactive 3D Portfolio
## Complete Concept + Blender Model Plan

## 1. Core idea

The portfolio should not feel like a normal developer CV with a 3D background.

It should be an **interactive 3D world that tells the story of Jack's work**:

> **Physics → Engineering → Software → Data → Water**

The visitor explores rather than simply scrolls through cards.

The visual metaphor is movement and transformation:
- particles move through detectors
- data moves through networks
- software connects systems
- people move through water
- a single object travels through every environment

The site should demonstrate technical ability through the experience itself.

---

# 2. Main experience

Use one persistent Three.js / React Three Fiber world.

Suggested journey:

```text
HOME
  ↓
PARTICLE DETECTOR
  ↓
PHYSICS
  ↓
DATA / NETWORK
  ↓
MOBILE DEVELOPMENT (BT / myEE)
  ↓
PROJECT EXHIBITION
  ↓
UNDERWATER TRANSITION
  ↓
WATER POLO
  ↓
CONTACT
```

The environments should transition into each other rather than feeling like separate pages.

The visitor should always feel as though they are moving through one world.

---

# 3. The signature object

Create one small glowing low-poly sphere.

It travels through the entire website.

Its meaning changes:

```text
HOME       → particle
PHYSICS    → collision / detector hit
MOBILE     → network packet
PROJECTS   → data point
WATER      → bubble
WATER POLO → ball
```

This creates a hidden narrative tying the entire website together.

---

# 4. HOME — The Detector

Start almost completely black.

A tiny particle appears.

Minimal typography:

```text
JACK SANDERS

Physicist · Engineer · Developer

SCROLL TO EXPLORE
```

The particle accelerates. The camera follows it. Darkness gradually reveals a huge low-poly particle detector.

### Interaction
- mouse → camera/look
- scroll → move through detector
- hover → detector components highlight
- click → component information
- particle tracks react to movement
- scroll deeper → detector disassembles

### Blender models
Build the detector modularly:
- beam pipe
- CEDAR/KTAG-inspired gas Cherenkov detector
- photon detector
- GTK-style tracking stations
- STRAW-style tracker
- calorimeter blocks
- muon veto
- support frames
- cables/pipes
- beam particles

It does not need to be a fully accurate CERN model. The goal is recognisable scientific machinery with artistic simplification.

Suggested structure:

```text
Detector
├── BeamPipe
├── CEDAR
├── PhotonDetector
├── GTK
├── StrawTracker
├── RICH
├── LKr
├── MUV
└── SupportStructure
```

---

# 5. Detector disassembly transition

One of the site's signature animations:

```text
DETECTOR
   ↓
PARTICLES
   ↓
DATA
   ↓
NETWORK
```

As the visitor scrolls:
1. components separate
2. beam pipe opens
3. detector rings move apart
4. particle tracks appear
5. particles leave the detector
6. particles become points
7. points become data
8. data becomes network connections

---

# 6. PHYSICS WORLD

After the detector breaks apart, enter a scientific landscape.

Possible objects:
- detector fragments
- particle tracks
- data points
- scientific graphs
- orbiting particles
- measurement stations
- beam pipes
- small experiment modules
- floating equations
- histogram-like terrain

Keep typography minimal and avoid fake sci-fi HUDs.

### Actual physics interactions

Use real/simplified simulations where practical.

#### Charged particle
Particle has:

```text
position
velocity
charge
momentum
```

and curves in a magnetic field.

#### Detector hits
Particles pass through detector layers and leave hits.

#### Monte Carlo
Allow visitors to change:
- particle energy
- mass
- charge
- magnetic field

and see trajectories change.

#### Event display
Click a collision and open an interactive event display.

---

# 7. Physics → Engineering

Transform:

```text
particle hit
     ↓
data point
     ↓
node
     ↓
connection
     ↓
network
```

The camera flies through the network and the environment becomes more technological.

---

# 8. MOBILE DEVELOPMENT — smartphone hero

Do not use a normal corporate timeline.

The smartphone is the hero of this world, not a background prop. A giant low-poly phone sits on an exhibit plinth. An abstract app interface emerges from the screen. A minimal network of nodes and packets flows into the phone to represent connected experiences. BT/myEE content appears beside the phone as HTML, scoped to publicly shareable details.

### Blender models

#### Smartphone hero
- low-poly phone on an exhibit plinth
- abstract, non-confidential app UI emerging from the screen
- replaceable screen material/plane
- root pivot for camera approach

#### Network context
- network nodes with ports
- packets as small emissive cubes or the signature sphere
- packets flow into the phone

#### Deferred supporting assets (post-launch)
- BT building: stylised abstract office/building
- network tower: antennas, cables, signal waves
- oversized router with packets travelling through it
- server rack: servers, switches, LEDs, fibre connections
- home network cutaway:

```text
Smart Hub
   ↓
WiFi
   ↓
Devices
```

Represent the work without exposing confidential implementation details.

### Live interactive demonstration

Do not only describe mobile skill — demonstrate it. Embed one working interactive piece in a device frame. Prefer reusing the physics trajectory simulation presented as a mobile app UI, or ship a small installable demo. It must work with keyboard, touch, and reduced motion.

---

# 9. Phone interaction

The smartphone hero is clickable.

When clicked:
1. camera approaches phone
2. environment darkens
3. phone screen becomes readable
4. HTML UI appears alongside it

Example:

```text
BT / myEE

Graduate Software Engineer

Building software for connected
home and network experiences.
```

Only include publicly shareable technical details.

---

# 10. PROJECT EXHIBITION

Instead of project cards, create a physical exhibition/laboratory.

Each project is a physical object.

## PlantPulse

Models:
- potted plant
- succulent
- soil
- moisture sensor
- MCU board
- temperature/light sensor
- battery
- solar panel
- phone
- QR code
- enclosure
- wireless signal particles

Visual flow:

```text
PLANT
  ↓
SENSOR
  ↓
WIRELESS
  ↓
CLOUD
  ↓
PHONE
```

Click the plant → project case study.

## NA62 exhibit

Miniature detector:
- CEDAR
- beam pipe
- particle tracks
- detector layers
- kaon
- pion
- photon
- electron/positron tracks

Click the kaon and have it travel through the detector while components activate.

## HomeLab

Miniature server room:
- 4U server rack
- mini computer
- switches
- router
- NAS
- patch panel
- cables
- virtual-machine blocks
- Docker containers
- monitoring screen
- network nodes

Animated request flow:

```text
REQUEST
  ↓
REVERSE PROXY
  ↓
SERVICE
  ↓
DATABASE
```

## Future exhibits

### AI / LLM
Low-poly neural network:
- neurons
- connections
- tokens
- transformer blocks
- GPU
- server

### Computer graphics
GPU/rendering environment:

```text
vertex
 ↓
triangle
 ↓
shader
 ↓
pixel
```

### Data science
3D histogram/statistical landscape.

### Mobile development
Promoted from a future exhibit to the mobile development world hero (see section 8).

---

# 11. WATER POLO TRANSITION

Another major signature moment.

```text
NETWORK
   ↓
FLOW
   ↓
PARTICLES
   ↓
WATER
   ↓
POOL
```

Connections begin flowing. Nodes disappear. Particles fall. The camera follows. The environment turns blue. Bubbles appear. The visitor enters an underwater pool.

---

# 12. WATER POLO WORLD

Create a stylised low-poly swimming pool.

### Blender models

#### Pool
- floor
- walls
- lane markings
- tiles
- depth markings
- ladders
- pool edge

#### Water polo goal
- frame
- net
- floats
- support bars

#### Ball
Low-poly water polo ball. This is the signature sphere from the beginning.

#### Players
Simplified low-poly water polo players:
- head
- torso
- arms
- hands
- legs
- swimwear
- cap
- ear guards

Keep them stylised rather than realistic.

#### Other props
- referee
- scoreboard
- shot clock
- benches
- caps
- spare balls
- whistles
- lane ropes

---

# 13. Water polo interactions

### Player hover
Highlight a player and show factual position/role information.

### Ball
Make the ball react to the mouse using:
- buoyancy
- drag
- bounce
- throw trajectory
- water resistance

### Tactical mode
Switch to a top-down tactical view:

```text
1   2   3
  4   5
    GK
```

Players become moving markers, then return to the 3D world.

---

# 14. CONTACT

After Water Polo, simplify everything.

```text
JACK SANDERS

Physicist.
Engineer.
Developer.

EMAIL
GITHUB
LINKEDIN
CV
```

No giant dashboard. No excessive animation.

---

# 15. Blender asset library

Build reusable assets rather than one giant Blender file.

```text
blender/
├── detector/
│   ├── detector.blend
│   ├── cedar.blend
│   ├── beam_pipe.blend
│   ├── tracker.blend
│   └── support.blend
├── physics/
│   ├── particle_station.blend
│   ├── collision.blend
│   ├── data_node.blend
│   └── graph.blend
├── mobile/
│   ├── smartphone_hero.blend
│   ├── server_rack.blend
│   ├── router.blend
│   ├── telecom_tower.blend
│   └── house_network.blend
├── projects/
│   ├── plantpulse.blend
│   ├── homelab.blend
│   ├── na62_exhibit.blend
│   └── ai_network.blend
└── waterpolo/
    ├── pool.blend
    ├── goal.blend
    ├── ball.blend
    ├── player.blend
    ├── scoreboard.blend
    └── equipment.blend
```

Export individual assets/scenes as `.glb`.

---

# 16. Blender modelling style

Target:

> Low-poly scientific visualisation + indie game environment + museum exhibit.

Use:
- bevels
- flat/smooth shading selectively
- simple primitives
- deliberately visible geometry
- repeated modular parts

Do not over-model. A detector should look complex because of many simple components, not because every screw is modelled.

Keep materials limited:
- dark metal
- light metal
- off-white
- glass
- rubber
- cyan emissive
- blue water
- warm accent

Use emissive materials sparingly.

---

# 17. Procedural Blender opportunities

Use Geometry Nodes/procedural generation for:

### Detector rings
Generate repeated detector modules around a circle.

### Straw tracker
Generate many straws procedurally.

### Network
Generate nodes and edges.

### Particle tracks
Generate curves from trajectories.

### Pool tiles
Generate repeated tiles.

### Server rack
Generate repeated server units.

### Player formations
Generate player positions.

---

# 18. Web asset pipeline

```text
BLENDER
   ↓
GLB
   ↓
Draco / Meshopt
   ↓
React Three Fiber
   ↓
GPU
```

Optimise using:
- low polygon counts
- shared materials
- instancing
- compressed textures
- GLB
- lazy loading
- LODs

Do not load the entire world initially.

---

# 19. React / Three.js architecture

Suggested stack:

```text
React
TypeScript
Vite
React Router
React Three Fiber
Three.js
Drei
Motion
Lenis
```

React handles:
- navigation
- text
- accessibility
- project information
- UI
- state

Three.js/R3F handles:
- world
- models
- camera
- particles
- physics
- transitions
- interactions

---

# 20. Shared world state

```ts
type WorldState = {
  progress: number
  environment: "home" | "physics" | "mobile" | "projects" | "water"
  cameraTarget: Vector3
  transition: number
}
```

Scroll drives `progress`.

For example:

```text
0.00 - 0.20 → detector / home
0.20 - 0.38 → physics
0.38 - 0.58 → mobile development
0.58 - 0.78 → projects
0.78 - 1.00 → water polo
```

These names and ranges match the production implementation plan, which is the authoritative source for the world-state model.

---

# 21. Data-driven projects

Use configuration instead of hardcoding every project:

```ts
const projects = [
  {
    id: "na62",
    title: "NA62",
    model: "/models/na62.glb",
    position: [...],
    description: "...",
    technologies: ["C++", "Python", "ROOT"],
  },
  {
    id: "plantpulse",
    title: "PlantPulse",
    model: "/models/plantpulse.glb",
    position: [...],
    description: "...",
    technologies: ["React Native", "Python", "MQTT"],
  },
]
```

This makes adding future projects easy.

---

# 22. Cutting-edge technical features

## WebGPU
Experiment with Three.js WebGPU/TSL for:
- GPU particles
- custom shaders
- large particle systems
- fluid-like effects

Maintain a WebGL fallback.

## GPU particle system
Potentially thousands/millions of particles using GPU simulation rather than individual React components.

## Real physics
Where practical, use actual:
- Lorentz force
- buoyancy
- drag
- particle motion
- network latency

The website becomes a demonstration of engineering, not just decoration.

---

# 23. Mobile

Do not simply shrink desktop.

Desktop:
```text
mouse → look
scroll → travel
click → interact
```

Mobile:
```text
swipe → look
scroll → travel
tap → interact
```

Reduce geometry and particle counts on mobile.

Provide a lower graphics mode if necessary.

Respect:

```text
prefers-reduced-motion
```

---

# 24. Performance

Load environments progressively.

Initial:
```text
Home detector
```

Then lazy-load:
```text
Physics
Mobile
Projects
Water Polo
```

Useful development HUD:

```text
FPS
Draw Calls
Triangles
GPU memory
Loaded models
```

Remove it in production.

---

# 25. What to avoid

Do NOT make it look like:
- generic AI portfolio
- crypto website
- futuristic dashboard
- excessive glassmorphism
- neon cyberpunk UI
- huge glowing text
- cards everywhere
- fake statistics
- random floating 3D objects
- excessive bloom
- meaningless particles

The 3D should have a reason to exist.

---

# 26. Visual direction

Overall:

**Apple-level restraint + low-poly indie game + scientific visualisation.**

Suggested palette:

```text
Background       #08090A
Text             warm off-white
Primary accent   cyan / blue
Water            deep blue
Science          neutral dark tones
Mobile           subtle warm/neutral tones
```

The environments should carry most of the visual interest.

---

# 27. First Blender models to build

Do not attempt everything at once.

Start with:

Minimum lovable experience assets first:

1. **Detector hero** — most important asset
2. **Particle** — reusable signature object
3. **Particle track** — reusable trail
4. **Smartphone hero** — mobile development world
5. **Network node** — reusable data object and phone-scene context
6. **Water polo ball** — signature object
7. **Water polo goal**
8. **Pool** — main water environment

Post-launch enrichment assets:

9. **Server rack** — network landscape and HomeLab
10. **PlantPulse sensor** — technical exhibit
11. **Plant** — PlantPulse anchor
12. **Low-poly player**

---

# 28. Development order

Ship the minimum lovable experience first: detector hero, signature particle, smartphone hero, pool, goal, and ball, plus the detector-to-data and network-to-water transitions. Project 3D exhibits, the full network landscape, players, and the 3D tactical mode arrive after launch.

## Phase 1 — Interaction prototype
Build:
- R3F scene
- camera
- mouse look
- scroll movement
- one low-poly detector
- particle
- hover
- click

Goal:

> Entering the detector should already feel impressive.

## Phase 2 — Detector
Build:
- modular detector
- particle tracks
- lighting
- environment
- disassembly animation

## Phase 3 — Physics
Build:
- particle simulation
- event display
- data transformation
- physics environment

## Phase 4 — Mobile development
Build:
- smartphone hero with abstract app UI
- minimal network of nodes and packets
- live interactive demonstration in a device frame
- BT/myEE content

## Phase 5 — Projects (3D exhibits are post-launch; HTML case studies ship with the application shell)
Build:
- exhibition
- NA62
- PlantPulse
- HomeLab
- future projects

## Phase 6 — Water Polo
Build:
- pool
- water
- goal
- ball
- tactical view (HTML first; 3D tactical mode and players are post-launch)

## Phase 7 — Transitions
Polish:
- detector → particles
- particles → network
- network → fluid
- fluid → pool

## Phase 8 — Optimisation
- GLB compression
- instancing
- lazy loading
- mobile
- WebGL fallback
- WebGPU experiments
- reduced motion

---

# 29. Core design rule

Every impressive effect should communicate something.

Bad:
> "Look, particles!"

Good:
> "The detector is breaking apart and its particle hits are becoming the data network that represents my engineering work."

Bad:
> "Look, underwater!"

Good:
> "The network has transformed into fluid and the same particle has become the water polo ball."

The site should make the visitor understand **how Jack thinks**, not just what technologies Jack has used.

---

# 30. Final concept

The finished experience should feel like entering a small interactive world.

You begin as a particle.

You travel through a detector.

You become data.

You travel through networks and software.

You encounter real projects.

You descend through the network.

You become a bubble.

You enter a swimming pool.

The bubble becomes a water polo ball.

Then the world disappears.

```text
JACK SANDERS

Physicist.
Engineer.
Developer.
```

That is the portfolio.

**Not a CV with 3D added to it.**
