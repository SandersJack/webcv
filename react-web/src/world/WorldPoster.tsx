import type { WorldScene } from './scenes'

// Posters are the Blender desktop previews (1600x900), synced to
// public/models/posters by scripts/sync-assets.mjs.
const POSTER_WIDTH = 1600
const POSTER_HEIGHT = 900

type WorldPosterProps = {
  scene: WorldScene
}

/**
 * Static poster shown while the 3D scene loads, on error, and when WebGL is
 * unavailable. Explicit width/height keep the aspect ratio reserved so the
 * fallback never shifts layout (CLS budget 0.1).
 */
export function WorldPoster({ scene }: WorldPosterProps) {
  return (
    <div className="world-hero__poster">
      <img
        className="world-hero__poster-img"
        src={scene.posterUrl}
        alt={scene.description}
        width={POSTER_WIDTH}
        height={POSTER_HEIGHT}
        decoding="async"
      />
    </div>
  )
}
