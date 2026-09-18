# Content gaps

**Status:** Open inventory. Feeds the content workflow in plan §10 and the Phase 0/1 exit criteria in plan §14.
**Source:** `grep -r "TODO(content)" src/` (four markers, all in `src/content/pages.ts`) plus review of `src/content/pages.ts`, `src/content/profile.ts`, and `src/content/projects.ts`.
**Rule:** No item below can be written by an implementer alone. Each needs Jack's verified facts, approval, or a decision. Plan §10 requires every content item to be marked public, restricted, or awaiting approval before Phase 1 exits.

## Gaps blocking Phase 1 exit

### 1. BT/myEE professional experience

- **Status:** Baseline closed 2026-09-18. Jack approved the role, stack, and duration: mobile developer at BT/EE for the past year, across Flutter, React Native, and native Swift/Kotlin. Now live in `mobilePage.sections.experience` and `workExperience` in `src/content/profile.ts`.
- **Still open:** Deeper specifics (named features, outcomes, screenshots, or app-store references) still need employer approval before they are added. Plan §4 scopes this section to publicly shareable details, and plan §12 bans confidential BT/myEE information from models, screenshots, source maps, and logs.

### 2. Water polo playing history

- **File:** `src/content/pages.ts`, `waterPoloPage.sections.history` (TODO(content) marker at line 117).
- **Needed:** Confirmed role/position, teams, competitions, and achievements.
- **Why Jack:** Fact verification. Plan §4 allows sporting details only where confirmed, and plan §1 forbids inventing metrics or achievements. The placeholder says details "are being finalised"; that finalisation is Jack's task.

### 3. CV file for download

- **Files:** `react-web/public/` contains only `favicon.svg` and `icons.svg`; no CV exists anywhere in the app. Plan §3 requires a CV link on `/about` and `/contact`, and plan §4 lists a "Download CV" secondary action on the home page. `homePage.primaryActions` in `src/content/pages.ts` does not include it yet because there is nothing to link.
- **Needed:** An approved CV PDF added to `react-web/public/`, then the download action wired into the home, about, and contact pages.
- **Why Jack:** The document does not exist. Only Jack can produce it and approve its contents.

### 4. About page timeline entries

- **File:** `src/content/pages.ts`, `aboutPage.sections.timeline` (has a title and no entries; not yet marked with TODO(content)).
- **Needed:** Dated milestones for education, research, and work, selected and worded by Jack. `src/content/profile.ts` (`education`, `workExperience`) provides verified source material, but the timeline selection needs approval.
- **Why Jack:** Dates and framing must match the real record; plan §10 step 4 requires review of biographical claims.

## Gaps landing with later phases

### 5. Shared physics trajectory demonstration copy

- **File:** `src/content/pages.ts`, `mobilePage.sections.demo` (TODO(content) marker at line 96).
- **Phase:** 3/4. Plan §4 and §0 define one trajectory simulation, presented in a device frame, serving both the physics and mobile development pages.
- **Needed:** Final copy once the demo exists, including plain-language explanations of the HTML controls (energy, mass, charge, magnetic field per plan §8).
- **Why Jack:** Approval of how the work is presented. The copy cannot be finalised before the demo is built, and the current text is explicitly a placeholder.

### 6. Water polo tactical view content

- **File:** `src/content/pages.ts`, `waterPoloPage.sections.tactical` (TODO(content) marker at line 133).
- **Phase:** 6. The MLE ships the HTML tactical view (plan §14); the 3D tactical mode is post-launch.
- **Needed:** The formation description and its accessible text equivalent (plan §4 requires a labelled top-down formation with an accessible text description).
- **Why Jack:** Tactical content must come from real playing knowledge, and the text description needs his review for accuracy.

### 7. Dark-photon analysis public details

- **File:** `src/content/projects.ts`, project `dark-photon-analysis`.
- **Phase:** Content update whenever collaboration approval arrives.
- **Needed:** Real `approach`, `result`, and `limitations` text. Current values are explicit placeholders ("details will be published when approved", "results are not yet public").
- **Why Jack:** Collaboration approval. Plan §4 accuracy constraints forbid exposing restricted experiment details, and plan §12 repeats the restriction. The public framing on the physics page (`physicsPage` in `src/content/pages.ts`) is already approved; the project-level detail is not.

## Assets to prepare

Not copy gaps, but files Jack should prepare so later phases are not blocked:

- **Project images.** The vanilla site has images in `static/imgs/` (`placeguesser_game.png`, `placeguesser_home.png`, `orbits.png`, `tempMonitor.png`, `ukenergy.png`, `climate.png`, logos, and `photo_jack_edit.jpg`). The React app has no project images in `react-web/public/`. Jack should confirm which existing images carry over, supply images for projects that have none (`flexible-na62-framework`, `slim-mc`, `dark-photon-analysis`, `crypto-trading-bot`, `this-site`), or approve image-free case studies. The project model in `src/content/projects.ts` reserves an `image` field in plan §4's content model.
- **CV PDF.** See gap 3.
- **Social preview image.** Plan §11 requires a social preview image that works without WebGL. None exists yet.
- **3D assets.** GLB production is tracked in `docs/BLENDER_VOXEL_SCENE_PLAN.md`, not here. Listed only so asset work is not duplicated.

## Closing a gap

Per plan §10: gather the verified fact, mark it public, restricted, or awaiting approval, write the non-specialist and technical summaries, have research and professional claims reviewed, then replace the placeholder, remove the TODO(content) marker, and check the item off here.
