import { Suspense } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

// Decoder is vendored in public/draco (Apache-2.0, Google) so the app never
// fetches decoders from a third-party CDN.
useGLTF.setDecoderPath('/draco/')

function DetectorSceneModel() {
  const { scene } = useGLTF('/models/detector_scene.glb')
  return <primitive object={scene} />
}

/**
 * Development preview for Blender-exported assets (blender/exports via the
 * public/models symlink). Not part of the public navigation.
 */
export function WorldPreviewPage() {
  return (
    <section className="section">
      <div className="container flow">
        <h1>Asset preview: detector scene</h1>
        <p className="text-muted">
          Development route for checking Blender GLB exports in the browser. Drag to orbit.
        </p>
        <div style={{ blockSize: '70vh' }}>
          <Canvas camera={{ position: [11, 9, 11], fov: 35 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5.5, 8, 4.5]} intensity={2.4} />
            <Suspense fallback={null}>
              <DetectorSceneModel />
            </Suspense>
            <OrbitControls target={[0, 1.4, 0]} />
          </Canvas>
        </div>
      </div>
    </section>
  )
}
