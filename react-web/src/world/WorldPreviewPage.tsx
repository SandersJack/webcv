import { Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

// Decoder is vendored in public/draco (Apache-2.0, Google) so the app never
// fetches decoders from a third-party CDN.
useGLTF.setDecoderPath('/draco/')

// Mirrors blender/exports/manifests; the whitelist keeps the dev route from
// resolving arbitrary paths.
const KNOWN_MODELS = new Set(['detector_scene', 'mobile_scene', 'software_scene', 'style_test', 'waterpolo_scene'])
const DEFAULT_MODEL = 'detector_scene'

function SceneModel({ model }: { model: string }) {
  const { scene } = useGLTF(`/models/${model}.glb`)
  return <primitive object={scene} />
}

/**
 * Development preview for Blender-exported assets (blender/exports via the
 * public/models symlink). Not part of the public navigation.
 */
export function WorldPreviewPage() {
  const [searchParams] = useSearchParams()
  const requested = searchParams.get('model') ?? DEFAULT_MODEL
  const model = KNOWN_MODELS.has(requested) ? requested : DEFAULT_MODEL

  return (
    <section className="section">
      <div className="container flow">
        <h1>Asset preview: {model}</h1>
        <p className="text-muted">
          Development route for checking Blender GLB exports in the browser. Drag to orbit. Select
          with ?model=detector_scene, ?model=mobile_scene, or ?model=style_test.
        </p>
        <div style={{ blockSize: '70vh' }}>
          <Canvas camera={{ position: [11, 9, 11], fov: 35 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5.5, 8, 4.5]} intensity={2.4} />
            <Suspense fallback={null}>
              <SceneModel model={model} />
            </Suspense>
            <OrbitControls target={[0, 1.4, 0]} />
          </Canvas>
        </div>
      </div>
    </section>
  )
}
