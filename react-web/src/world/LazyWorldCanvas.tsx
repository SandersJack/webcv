import { lazy, Suspense } from 'react'

import { worldScenes, type WorldSceneId } from './scenes'

const WorldCanvas = lazy(() =>
  import('./WorldCanvas').then((m) => ({ default: m.WorldCanvas })),
)

type LazyWorldCanvasProps = {
  sceneId: WorldSceneId
}

export function LazyWorldCanvas({ sceneId }: LazyWorldCanvasProps) {
  const scene = worldScenes[sceneId]

  return (
    <div className="world-hero">
      <Suspense
        fallback={
          <div className="world-hero__stage world-hero__stage--loading">
            <div className="world-hero__loader" aria-label="Loading 3D scene">
              <span className="visually-hidden">Loading</span>
            </div>
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
