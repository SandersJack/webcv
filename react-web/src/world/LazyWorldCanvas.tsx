import { lazy, Suspense } from 'react'

import { worldScenes, type WorldSceneId } from './scenes'
import { WorldPoster } from './WorldPoster'

// Lazy so three.js stays out of the main bundle; the Suspense fallback is the
// same poster state used for errors and missing WebGL.
const WorldCanvas = lazy(() =>
  import('./WorldCanvas').then((m) => ({ default: m.WorldCanvas })),
)

type LazyWorldCanvasProps = {
  sceneId: WorldSceneId
}

/**
 * Hero embed for a Blender voxel scene. The page remains fully useful without
 * the canvas: the poster carries the scene description as alt text and the
 * visually-hidden summary is always present for screen readers.
 */
export function LazyWorldCanvas({ sceneId }: LazyWorldCanvasProps) {
  const scene = worldScenes[sceneId]

  return (
    <div className="world-hero">
      <Suspense
        fallback={
          <div className="world-hero__stage">
            <WorldPoster scene={scene} />
          </div>
        }
      >
        <WorldCanvas sceneId={sceneId} />
      </Suspense>
      <aside className="visually-hidden">
        <h2>Scene description</h2>
        <p>{scene.description}</p>
      </aside>
    </div>
  )
}
