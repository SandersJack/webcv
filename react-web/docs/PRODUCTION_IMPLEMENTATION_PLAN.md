# Jack Sanders Portfolio
## Production implementation plan

**Status:** Approved — key decisions recorded in section 0
**Audience:** Jack Sanders and implementation contributors
**Repository:** `react-web`
**Primary task:** Help a visitor quickly understand Jack's work as a physics PhD researcher, water polo player, and mobile/software developer, then choose an appropriate way to explore the work or make contact.

## 0. Agreed decisions

- **Deployment:** `react-web` replaces the existing vanilla WebCV site at `portfolio.jack-sanders.uk`. Migrate the existing Docker/nginx deployment to serve the React build, update CI to build the new stack, and retire the vanilla templates only after the new site is verified in production.
- **Contact form:** reuse the existing Express contact-form service (`contact-form/`, port 3333). Keep its validation, spam protection, and rate limiting, and update its CORS allowlist to the production domain.
- **Mobile demonstration:** the live interactive piece on the mobile development page is the physics trajectory simulation embedded in a device frame. Build it once so it serves both the physics and mobile development stories.

## 1. Product direction

Build a distinctive personal portfolio as an interactive scientific world, not a conventional CV with decorative 3D behind it.

The central story is:

```text
physics -> engineering -> software -> data -> mobile -> water -> people
```

One glowing low-poly sphere travels through the world and changes meaning:

```text
particle -> detector hit -> network packet -> data point -> bubble -> water polo ball
```

The experience should communicate how Jack thinks: observing a system, modelling it, building tools around it, and working effectively with people. The 3D world is the expressive layer; clear HTML content remains the dependable product.

### Product principles

- Make the visitor's first scan understandable without interaction.
- Give equal respect to the physics, water polo, and mobile development stories.
- Use real work and verifiable claims; never invent metrics, employers, responsibilities, or project outcomes.
- Give every visual effect a narrative or explanatory purpose.
- Prefer restrained scientific visualisation over neon cyberpunk, fake dashboards, and generic AI portfolio patterns.
- Make the site useful on a phone, slow connection, keyboard, screen reader, reduced motion, and low-power GPU.
- Use progressive enhancement: HTML content first, 3D enhancement second.

## 2. Current repository baseline

The existing `react-web` directory is a minimal Vite React TypeScript application:

- `package.json` already contains React 19, Three.js, React Three Fiber, Framer Motion, Vite, TypeScript, ESLint, and Vitest.
- `package.json` does not yet include a router, Drei, or a scroll/animation library. Add these as explicit dependency decisions because shareable routes and scene helpers are load-bearing: for example `react-router-dom`, `@react-three/drei`, and `lenis`.
- `index.html` already contains a viewport, theme color, description, and initial title.
- `src/` is not currently present, so the application shell, tests, styles, and components must be created.
- `public/` contains `favicon.svg` and `icons.svg`.
- `dist/` exists as generated output and must not be treated as source.
- The wider WebCV repository contains the vanilla HTML site and contact-form service that this app replaces. Inspect their deployment and contact API contracts during migration, and do not break the production contact endpoint during cutover.

### Initial repository tasks

1. Replace the wider WebCV site: plan the migration of the existing Docker/nginx deployment and CI to the React build.
2. Inspect the existing contact form, domain, analytics policy, CV, social links, and project content before writing final copy.
3. Add the missing `src/` tree and application entry point.
4. Add a committed lockfile policy and ensure the existing `yarn.lock` is used consistently in CI.
5. Add a production deployment configuration for the actual host, including SPA fallback only if client-side routes are used.
6. Add the routing and scene-helper dependencies (`react-router-dom`, `@react-three/drei`, `lenis`) or record deliberate descoping decisions.

## 3. Information architecture

The visitor can travel through one continuous world, use direct navigation, or open a shareable page without needing to understand the 3D experience.

### Primary routes

| Route | Purpose | Required content |
| --- | --- | --- |
| `/` | Introduction and guided world | Identity, positioning, three paths, primary calls to action, accessible exploration entry point |
| `/physics` | Physics PhD and NA62 work | Research focus, contribution, methods, experiment context, publications or links where approved |
| `/water-polo` | Water polo identity | Role/position, experience, values, team contribution, factual sporting details |
| `/mobile-development` | Mobile/software work | Mobile products, technical approach, selected projects, public technologies, outcomes |
| `/projects` | Project exhibition and case-study index | NA62, PlantPulse, HomeLab, mobile work, and future projects with filters only if needed |
| `/projects/:projectId` | Individual case study | Problem, role, process, technical decisions, result, limitations, links, related path |
| `/about` | Cross-disciplinary biography | Short biography, timeline, CV link, current focus, location only if intentionally public |
| `/contact` | Contact and professional links | Email, LinkedIn, GitHub, CV, validated contact form if retained |

The three required pages are first-class pages, not tabs hidden inside a home page. They must be readable and useful when opened directly from a search engine or shared link.

### Navigation

- Desktop navigation: `Physics`, `Mobile development`, `Water polo`, `Projects`, `About`, `Contact`.
- Mobile navigation: native button with a labelled disclosure menu, focus management, Escape-to-close, and a visible current-page state.
- Persistent `Explore the world` action may return to `/` and the relevant scene position.
- Every scene hotspot has a normal HTML link or button equivalent.
- Breadcrumbs or a clear back link appear on project detail routes.

## 4. Page and content specifications

### Home: The Detector

**Visual purpose:** Begin in near-black space with a small particle, reveal a simplified detector, and establish the journey.

**Content hierarchy:**

1. `Jack Sanders`
2. `Physicist. Engineer. Developer.`
3. One plain-language sentence explaining the intersection of particle physics, software, and water polo.
4. Three path links: `Explore physics`, `Explore mobile development`, `Explore water polo`.
5. Secondary actions: `View projects`, `Get in touch`, `Download CV`.
6. Short instruction: `Scroll or swipe to explore. Use the section links to jump directly.`

**3D sequence:** particle, detector reveal, detector hover labels, controlled disassembly into tracks and data. The animation must never prevent reading or navigation.

### Physics PhD page

**Positioning:** Explain the research contribution to a non-specialist first, then provide technical depth for scientific and engineering readers.

**Sections:**

- Research summary: what question the work addresses and why it matters.
- NA62 context: experiment purpose and Jack's specific contribution, only using approved public details.
- Methods: analysis, instrumentation, simulation, data processing, software, or collaboration responsibilities as factually applicable.
- Interactive event display: a simplified, labelled event that explains particle tracks and detector hits.
- Research timeline: milestones with dates, not an animated corporate timeline.
- Publications, talks, code, or collaboration links where public.
- `What I built` and `What I learned` summaries.
- CTA to selected projects and contact.

**3D sequence:** detector modules, particle trajectories, detector hits, tunable simplified trajectory demo, then transition from hits to data nodes.

**Accuracy constraints:** Label any artistic simplification. Distinguish Jack's work from the full collaboration. Do not expose restricted experiment details or imply authorship beyond the source material.

### Mobile development page

**Positioning:** Show how Jack turns real user and system needs into reliable mobile and connected experiences.

**Sections:**

- Mobile development introduction in user language.
- BT/myEE experience, using only publicly shareable details.
- Technical practice: platform choices, UI state, networking, testing, accessibility, release quality, and collaboration where applicable.
- Selected mobile projects, including PlantPulse if it is ready for public presentation.
- Live interactive demonstration: the physics trajectory simulation embedded in a device frame and presented as a mobile app UI, so one implementation serves both the physics and mobile development stories. It must work with keyboard, touch, and reduced motion.
- Product walkthrough or device mock-up with HTML captions beside the 3D phone.
- Case-study links with role, constraints, decisions, and outcome.
- CTA to GitHub, CV, and contact.

**3D sequence:** the smartphone is the hero object on an exhibit plinth; an abstract app interface emerges from its screen; a minimal network of nodes and packets flows into the phone to represent connected experiences; the HTML case study appears beside it. The full router/server landscape is post-launch enrichment. The scene must not imitate confidential software or display private data.

### Water polo page

**Positioning:** Present water polo as a serious part of Jack's identity and as evidence of discipline, communication, anticipation, and team performance, without reducing it to a list of soft skills.

**Sections:**

- Sporting introduction and current status.
- Factual playing history, role/position, teams, competitions, or achievements where confirmed.
- What the sport demands: decision-making under pressure, spatial awareness, fitness, communication, and trust.
- Tactical mode with a labelled top-down formation and an accessible text description.
- Optional ball interaction demonstrating buoyancy, drag, and throw trajectory.
- Team and club links only where permission and public attribution are clear.
- CTA back to the cross-disciplinary story and contact.

**3D sequence:** network connections become flowing particles, then water, pool, goal, players, and the signature ball. Keep players stylised and non-identifying unless explicit permission exists.

### Projects and case studies

Each project must be a real case study rather than a decorative object. Use a consistent content model:

- `id`, `title`, `category`, `summary`, `status`, `year`.
- `role`, `team`, `problem`, `approach`, `result`, `limitations`.
- `technologies`, `links`, `image`, `model`, and `relatedPath`.
- `publicityLevel` to prevent accidental publication of private details.

Initial projects from the concept:

- `NA62`: physics experiment and analysis/research work.
- `PlantPulse`: plant sensor, embedded device, wireless data, and mobile/cloud experience.
- `HomeLab`: reverse proxy, services, network, containers, monitoring, and deployment learning.
- `BT/myEE`: professional software experience, scoped to approved public information.
- `Mobile development`: a dedicated project grouping for future public applications.

Avoid a filter-heavy gallery until there are enough projects to justify it. On mobile and direct routes, a simple list with clear links is preferable.

### Contact page

Keep the ending intentionally quiet:

```text
Jack Sanders
Physicist. Engineer. Developer.

Email
GitHub
LinkedIn
CV
```

The contact form is retained and reuses the existing Express service. Show explicit validation, loading, success, server error, offline, and rate-limit states. Preserve all entered values after failure. Add bot protection without blocking keyboard or assistive technology users.

## 5. Experience architecture

### Application layers

```text
routes/page composition
  -> accessible content and UI
  -> shared world state
  -> R3F scene renderer
  -> lazy-loaded GLB assets and simulations
```

React owns navigation, content, disclosure controls, focus, project data, and status messages. Three.js owns models, camera movement, particles, scene lighting, and visual transitions. The two layers communicate through typed state and events, not DOM queries or duplicated business logic.

### Suggested source tree

```text
src/
  app/
    App.tsx
    routes.tsx
    routeMetadata.ts
  components/
    AccessibleSceneSummary.tsx
    ButtonLink.tsx
    ContactForm.tsx
    Footer.tsx
    Header.tsx
    ProjectList.tsx
    SkipLink.tsx
  content/
    profile.ts
    projects.ts
    pages.ts
  features/
    home/
    physics/
    mobileDevelopment/
    waterPolo/
    projects/
    contact/
  world/
    WorldCanvas.tsx
    WorldScene.tsx
    worldState.ts
    sceneRegistry.ts
    transitions.ts
    components/
    simulations/
    loaders/
  lib/
    contactApi.ts
    analytics.ts
    formatters.ts
    validation.ts
  styles/
    tokens.css
    reset.css
    global.css
    layout.css
  test/
    setup.ts
    fixtures.ts
```

### Shared world state

Use a small typed state model. Do not store derived scene values that can be calculated from progress.

```ts
type Environment = 'home' | 'physics' | 'mobile' | 'projects' | 'water'

type WorldState = {
  progress: number
  environment: Environment
  selectedObject: string | null
  graphicsMode: 'auto' | 'high' | 'low' | 'off'
  reducedMotion: boolean
}
```

Environment names match the concept document; `mobile` replaces the earlier `work` naming so mobile development has first-class identity. The continuous route can map progress approximately as follows, subject to usability testing:

```text
0.00 - 0.20  detector / home
0.20 - 0.38  physics and event display
0.38 - 0.58  mobile development and connected software
0.58 - 0.78  project exhibition
0.78 - 1.00  water transition and water polo
```

Direct pages should open at a meaningful scene position when enhancement is available, but the HTML page must not depend on this mapping.

### Interaction model

Desktop:

- Scroll travels through the narrative.
- Pointer movement subtly influences camera look.
- Hover previews labelled objects only where hover is available.
- Click or Enter opens detail.

Mobile and touch:

- Swipe/scroll travels through the narrative.
- Tap opens an object or route.
- Use lower geometry, fewer particles, and shorter camera motion.
- Do not require multi-touch or precise dragging.

Keyboard and assistive technology:

- Tab reaches every control and link in reading order.
- Enter/Space activates buttons.
- Escape closes menus, dialogs, and object detail panels.
- Scene objects are not the only navigation mechanism.
- A `Skip to content` link is present.
- `AccessibleSceneSummary` provides a concise text equivalent of each scene and links to the related page.

## 6. Visual system

### Direction

Use restrained scientific visualisation, voxel-inspired low-poly mini scenes, and museum-exhibit composition. The 3D world should feel like a collection of carefully lit miniature dioramas: chunky readable silhouettes, stepped forms, simplified materials, and deliberate negative space. Environments carry the visual interest; typography and controls remain calm and legible.

Voxel is a visual language, not a requirement that every object be made from thousands of literal cubes. Use a consistent grid and block vocabulary for hero assets, then use efficient low-poly meshes, instancing, and flat-shaded surfaces where that produces a cleaner result. Every object must remain recognisable at the camera distance used on the web.

### Tokens

Define tokens before page implementation:

- Background: `#08090A` and lighter surface values for readable panels.
- Text: warm off-white with a measured secondary text color.
- Science accent: cyan/blue.
- Water accent: deep blue with a clearly different focus color.
- Mobile accent: restrained warm neutral.
- Status colors: accessible success, warning, and error values.
- Type: one distinctive display face only if it remains readable; use a robust system or locally hosted sans-serif for body text.
- Spacing, radius, border, shadow, focus ring, and motion duration tokens.

Check all color combinations against WCAG 2.2 AA. Do not use accent color as the only state signal.

### Layout

- Use a readable max-width for text and a full-viewport canvas only where the scene needs it.
- Use CSS Grid/Flexbox, `clamp()`, intrinsic sizing, and logical properties before adding breakpoints.
- Make content width and line length comfortable at 200% zoom.
- Avoid fixed canvas UI that covers content on small screens.
- Reserve layout space for images and media to prevent cumulative layout shift.

## 7. 3D asset and Blender pipeline

### Asset order

Build and approve the minimum lovable experience assets first, then the post-launch enrichment assets, in this order:

1. Detector hero.
2. Signature particle/ball.
3. Particle track.
4. Smartphone hero with a neutral, non-confidential screen.
5. Network node and packet.
6. Water polo ball and goal.
7. Pool and water environment.
8. Server rack and router (post-launch).
9. PlantPulse sensor and plant (post-launch).
10. Stylised player (post-launch).

Use reusable `.blend` source files and export individual `.glb` assets. Do not create one unmaintainable monolithic Blender file. The complete model brief, scene layouts, grid rules, naming conventions, and per-scene asset list are in `docs/BLENDER_VOXEL_SCENE_PLAN.md`.

### Blender style

- Voxel-inspired mini scenes with a shared grid, stepped silhouettes, chunky proportions, deliberate geometry, selective bevels, and a limited material library.
- Prefer block-built hero forms, modular kits, and flat-shaded low-poly meshes over smooth photorealistic modelling.
- Keep small details large enough to read at the web camera distance; remove detail that only appears in a close-up render.
- Use a few intentional bevels or chamfers to catch light, but do not round every voxel or turn the style into glossy toy plastic.
- Use dark metal, light metal, off-white, glass, rubber, cyan emissive, deep blue water, and one warm accent.
- Use emissive materials sparingly and avoid bloom that harms text or performance.
- Use Geometry Nodes for repeated detector rings, tracker straws, network nodes, pool tiles, server units, and player formations where it genuinely reduces manual work.
- Name objects and collections predictably so scene code can target them.
- Keep the shared world grid, camera scale, light direction, and shadow softness consistent across scenes.
- Add dimensions, origin, grid scale, material count, triangle count, texture count, and license/source metadata to the asset inventory.

### Web pipeline

```text
Blender -> GLB -> Draco/Meshopt compression -> lazy R3F loader -> GPU
```

Each asset needs:

- A compressed production GLB.
- A poster/thumbnail or static fallback image.
- A declared loading priority.
- A lower-detail alternative where needed.
- An owner and license/source record.

Never load every environment at startup. Load the detector first, then preload only the next environment during idle time when network and device budgets allow it.

## 8. Physics and interaction implementation

Implement real or simplified models only when they improve understanding.

### Physics scene

- Charged particle state: position, velocity, charge, momentum, and magnetic field.
- Integrate a stable, bounded trajectory model and cap simulation work per frame.
- Allow visitors to change energy, mass, charge, and magnetic field through labelled HTML controls.
- Show detector hits as discrete events and explain that the visualisation is simplified.
- Provide a reset control and a static example when the simulation is disabled.

### Water polo scene

- Implement ball motion with bounded buoyancy, drag, bounce, and throw trajectory parameters.
- Keep the interaction playful but optional; it must not obscure page content.
- Provide a text tactical view that does not depend on 3D orientation or animation.
- Avoid simulating player identity or making unsupported claims about teams and matches.

### Transition design

Implement and test the meaningful transitions separately:

1. Detector components separate.
2. Particle hits become data points.
3. Data points become network connections.
4. Network flow becomes particles and fluid.
5. Fluid becomes the pool and the sphere becomes the water polo ball.

When reduced motion is active, replace these with instant state changes, crossfades, or static illustrations.

## 9. Performance and resilience

### Targets

Use the 75th percentile targets from the frontend standards:

- LCP at or below 2.5 seconds.
- INP at or below 200 ms.
- CLS at or below 0.1.
- Fast readable HTML before 3D assets finish loading.
- No blank screen while WebGL initializes or fails.

Set a practical scene budget during prototyping, then measure rather than guessing:

- Frame rate target: 60 FPS on a current laptop, 30 FPS minimum on supported mobile devices.
- Explicit limits for draw calls, triangles, texture memory, and particles per graphics mode.
- Initial page JavaScript and detector asset budgets recorded in the repository.

### Graphics modes

- `Auto`: choose based on device capability, reduced-motion preference, and load failures.
- `High`: full approved scene quality.
- `Low`: reduced particles, lighting, geometry, and effects.
- `Off`: static visual or no canvas, with complete HTML content.

Expose a labelled graphics control in settings or navigation. Persist only a non-sensitive preference in local storage.

### Reliability requirements

- Catch WebGL context creation and context-loss failures.
- Show a useful fallback if a model fails to load.
- Avoid blocking the main thread with simulation or asset parsing.
- Keep the world canvas isolated so a rendering error does not remove navigation and content.
- Use `prefers-reduced-motion` and a visible manual reduced-motion option.
- Respect `Save-Data` and coarse-pointer devices where possible.
- Provide offline-friendly static content; contact submission should clearly identify offline failure.

### Optional WebGPU

Treat WebGPU/TSL and GPU particle simulation as experiments after the WebGL experience is stable. Maintain a WebGL fallback and do not make WebGPU a launch dependency.

## 10. Accessibility and content quality

Target WCAG 2.2 AA.

- One meaningful `h1` per page and logical heading levels.
- Semantic `header`, `nav`, `main`, `section`, and `footer` landmarks.
- Native anchors and buttons rather than clickable `div`s.
- Visible focus state with sufficient contrast and a sensible focus order.
- Text alternatives for meaningful images and empty alt for decorative assets.
- Captions or text explanation for every interactive visualisation.
- No information conveyed by color, motion, sound, or position alone.
- Dialogs trap focus only while open and return focus to the triggering control.
- Form inputs have visible labels, instructions, and adjacent errors.
- Test at 200% zoom, keyboard-only, reduced motion, narrow widths, landscape, and screen reader navigation.

### Content workflow

Create a content inventory before visual polish:

1. Gather verified biography, research role, dates, public project links, sporting facts, and contact details.
2. Mark each item as public, restricted, or awaiting approval.
3. Write a non-specialist summary and a technical summary for each major page.
4. Have research and professional claims reviewed for accuracy.
5. Add alt text, captions, and link labels as part of content entry, not at the end.

## 11. SEO, metadata, and sharing

- Give every route a unique title and description.
- Add canonical URLs and Open Graph/Twitter metadata.
- Create a useful social preview image that works without WebGL.
- Add JSON-LD `Person` and `WebSite` data only for accurate public information.
- Add `sitemap.xml`, `robots.txt`, and a custom 404 page.
- Ensure direct links to `/physics`, `/water-polo`, `/mobile-development`, `/projects`, and project details work from the production server.
- Use descriptive link text, not `click here`.
- Track no analytics until consent, privacy, and data retention decisions are documented.

## 12. Security and privacy

- Keep contact credentials and server configuration out of the client bundle.
- Treat contact API responses and route parameters as untrusted.
- Render all content as text; do not use unsanitised HTML.
- The existing contact service is reused: update its CORS allowlist to the production domain and preserve its rate-limit and validation behaviour.
- Add server-side validation, message length limits, spam protection, and safe error messages.
- Use HTTPS in production and configure security headers, including a restrictive Content Security Policy compatible with Three.js assets.
- Do not put confidential BT, myEE, experiment, club, or personal information in models, screenshots, source maps, or logs.
- Review model, font, icon, image, and social assets for licenses and attribution requirements.
- Publish a minimal privacy notice if contact or analytics data is collected.

## 13. Testing strategy

### Unit tests

Test pure functions for:

- Progress-to-environment mapping.
- Project filtering and publicity rules.
- Particle trajectory calculations.
- Ball motion bounds.
- Contact validation and error mapping.
- Route metadata generation.

### Component tests

Use React Testing Library to verify user-visible behavior:

- Navigation links and current page state.
- Mobile menu open/close and Escape behavior.
- Accessible scene summaries and fallback content.
- Project links and case-study content.
- Physics controls, reset behavior, and reduced-motion behavior.
- Contact validation, loading, success, server error, and offline states.
- Focus return from dialogs and keyboard operation of all controls.

### End-to-end tests

Add a small Playwright suite when the app shell is stable:

- Home loads with readable content before the canvas is ready.
- Direct navigation to all required pages returns HTTP 200 and renders the correct heading.
- Mobile navigation works at a narrow viewport.
- WebGL-disabled or forced-low-graphics mode remains usable.
- Keyboard navigation reaches the primary content and contact links.
- Production build serves assets and SPA routes through the real NGINX/deployment path.

### Manual review matrix

Test at minimum:

- Narrow phone portrait and landscape.
- Large phone/tablet.
- Laptop and wide desktop.
- Keyboard-only navigation.
- VoiceOver or another screen reader.
- Browser zoom at 200%.
- `prefers-reduced-motion` enabled.
- Slow network and offline mode.
- WebGL unavailable or context lost.
- Low-power mobile device.

## 14. Delivery phases

### Minimum lovable experience

The first production launch targets a minimum lovable experience (MLE), not the complete world. The MLE contains every signature element of the concept so the site is unique on day one, while deferring enrichment that can arrive after launch.

MLE scope:

- Complete HTML versions of every route (Phase 1 scope).
- Home sequence: detector hero, signature particle, particle track, and the detector-to-data transition.
- Physics page: the detector world plus the trajectory demonstration with HTML controls; a static labelled event display is optional.
- Mobile development page: smartphone hero with abstract app UI, minimal network context, and one live interactive demonstration.
- Water polo page: pool, goal, ball with buoyancy and throw interaction, the network-to-water transition, and the HTML tactical view.
- Projects page: accessible HTML case studies only; 3D exhibits are deferred.

At MLE the project exhibition environment does not exist yet, so the water transition occupies the remaining progress range; the exhibition environment is inserted when it is built post-launch.

Deferred to post-launch enrichment (Phase 9):

- Full network landscape: server rack, router, telecom tower, and home network cutaway.
- Interactive physics mini-scenes: event display interactivity, particle station, and histogram terrain.
- Project exhibition 3D exhibits: PlantPulse, NA62 exhibit, HomeLab, and the mobile device exhibit.
- Stylised players, scoreboard, equipment props, and the 3D tactical mode.

The MLE cut for each phase is noted below.

### Phase 0: Discovery and content lock

Deliverables:

- Write the migration plan for replacing the vanilla site: nginx changes, CI updates, contact API CORS update, and cutover/rollback steps.
- Approve biography, three page narratives, project facts, public links, and visual references.
- Create content and asset inventory with publicity status.
- Define success metrics and performance budgets.

Exit criteria: no major page depends on unknown facts or unapproved confidential material.

### Phase 1: Accessible application shell

Deliverables:

- Create `src/` architecture, routing, styles, metadata, header, footer, skip link, and 404 page.
- Implement complete HTML versions of home, physics, mobile development, water polo, projects, about, and contact.
- Add route tests and responsive layout.

Exit criteria: the site is understandable and navigable with JavaScript/3D disabled.

### Phase 2: World prototype

Deliverables:

- R3F canvas boundary and error fallback.
- Camera, progress state, mouse/touch behavior, signature particle, and one detector asset.
- Low-graphics and off modes.
- Accessible scene summaries.

Exit criteria: entering the detector is compelling without harming page performance or navigation.

### Phase 3: Physics world

Deliverables:

- Modular detector, tracks, hit visualisation, simplified trajectory controls, and physics page integration.
- Detector-to-data transition.
- Public-content and accuracy review.

MLE cut: the deliverables above except the wider science landscape; the interactive event display may ship as a static labelled version, and the remaining physics mini-scenes are post-launch.

Exit criteria: a non-specialist can explain the page's purpose; a technical visitor can find deeper material.

### Phase 4: Mobile development world

Deliverables:

- Smartphone hero with abstract app UI, network landscape, server rack/router, myEE content boundary, and mobile page case studies.
- Data-to-network transition.
- Live interactive demonstration in a device frame.

MLE cut: smartphone hero, minimal network nodes and packets, the myEE content boundary, and the live demonstration; the full network landscape (server rack, router, telecom tower, home network) is post-launch.

Exit criteria: no confidential UI or implementation detail is exposed; mobile page works as a standalone route.

### Phase 5: Project exhibition

Deliverables:

- Data-driven project model.
- NA62, PlantPulse, HomeLab, and approved mobile projects.
- Accessible project list and individual case studies.

MLE cut: the data-driven project model and accessible HTML case studies ship with Phase 1 content; the 3D exhibition objects are post-launch enrichment.

Exit criteria: every project has real content, a role statement, an outcome or honest status, and a working link where applicable.

### Phase 6: Water polo world

Deliverables:

- Pool, goal, ball, stylised players, tactical view, water transition, and water polo page.

MLE cut: pool, goal, ball, water transition, and the HTML tactical view; stylised players, scoreboard, equipment props, and the 3D tactical mode are post-launch.

Exit criteria: sporting content is factual and respectful; the page remains useful without animation or identifying player models.

### Phase 7: Production hardening

Deliverables:

- GLB compression, lazy loading, LODs, responsive assets, loading/error states, security headers, SEO files, contact integration, and analytics/privacy decision.
- Remove development HUD and debug controls from production.

Exit criteria: all review gates and performance budgets pass through the production serving path.

### Phase 8: Launch and iteration

Deliverables:

- Staging review on real devices.
- Accessibility and content sign-off.
- Production release, smoke test, rollback procedure, and issue triage.
- Post-launch review of real performance and broken links.

### Phase 9: Post-launch enrichment

Deliverables:

- Full network landscape: server rack, router, telecom tower, and home network cutaway.
- Interactive physics mini-scenes: event display interactivity, particle station, and histogram terrain.
- Project exhibition 3D exhibits: PlantPulse, NA62 exhibit, HomeLab, and the mobile device exhibit.
- Stylised players, scoreboard, equipment props, and the 3D tactical mode.

Exit criteria: each addition preserves the performance budgets, accessibility guarantees, and accuracy constraints of the launched site.

## 15. Definition of done

The site is production-ready when:

- The three required pages are complete, directly routable, shareable, and useful without 3D.
- The homepage clearly explains Jack within the first visual scan.
- The interactive world tells one coherent story from detector to water polo.
- All 3D objects have a purpose, fallback, and loading strategy.
- Keyboard, screen reader, mobile, reduced-motion, low-graphics, and WebGL-failure paths work.
- `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` pass from a clean install.
- The production build is tested through NGINX or the actual static host, not only Vite dev server.
- LCP, INP, CLS, asset size, draw-call, and memory measurements are recorded and within agreed budgets.
- Contact handling is validated, rate-limited, privacy-aware, and free of client-side secrets.
- SEO metadata, social previews, sitemap, robots rules, 404 handling, and direct routes are verified.
- All biography, research, employment, sporting, project, image, model, and license claims have been reviewed.

## 16. Immediate next actions

1. Write the migration plan for replacing the vanilla site: nginx, CI, contact API CORS update, and cutover/rollback steps.
2. Add the routing and scene-helper dependencies (`react-router-dom`, `@react-three/drei`, `lenis`).
3. Collect verified content for the physics, mobile development, and water polo pages.
4. Create the accessible application shell and route structure before modelling the full detector.
5. Prototype one detector, one signature particle, and one accessible HTML scene summary.
6. Measure the prototype on a laptop and a representative phone before adding more environments.
7. Build the trajectory demonstration once, in a device frame, so it serves both the physics and mobile development pages.
8. Approve the minimum lovable experience Blender assets (detector hero, signature particle, smartphone hero) and their budgets before producing the rest of the library.
