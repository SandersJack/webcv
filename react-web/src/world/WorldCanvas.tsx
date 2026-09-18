import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  AnimationMixer,
  Box3,
  LoopPingPong,
  LoopRepeat,
  MathUtils,
  PerspectiveCamera,
  Sphere,
  Vector3,
} from 'three'

import { usePrefersReducedMotion } from '../lib/usePrefersReducedMotion'
import { worldScenes, type WorldScene, type WorldSceneId } from './scenes'
import { WorldPoster } from './WorldPoster'

// Decoder is vendored in public/draco (Apache-2.0, Google) so the app never
// fetches decoders from a third-party CDN. Shared by every world canvas.
useGLTF.setDecoderPath('/draco/')

// Small margin around the bounding sphere so every scene size (detector,
// phone, pool) frames consistently.
const CAMERA_FIT_MARGIN = 1.12
// Isometric-ish elevation shared across scenes so they read as one world.
const CAMERA_ELEVATION = MathUtils.degToRad(32)
const INITIAL_AZIMUTH = Math.PI / 4
const SWAY_AMPLITUDE = MathUtils.degToRad(14)
const SWAY_SPEED = (Math.PI * 2) / 22

let webGLAvailable: boolean | null = null

function isWebGLAvailable(): boolean {
  if (webGLAvailable !== null) return webGLAvailable
  try {
    const probe = document.createElement('canvas')
    webGLAvailable =
      probe.getContext('webgl2') !== null || probe.getContext('webgl') !== null
  } catch {
    webGLAvailable = false
  }
  return webGLAvailable
}

type WorldErrorBoundaryProps = {
  fallback: ReactNode
  children: ReactNode
}

type WorldErrorBoundaryState = {
  hasError: boolean
}

/** GLB or canvas failures degrade to the poster, never a broken hero. */
class WorldErrorBoundary extends Component<
  WorldErrorBoundaryProps,
  WorldErrorBoundaryState
> {
  override state: WorldErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): WorldErrorBoundaryState {
    return { hasError: true }
  }

  override render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

type CameraFit = {
  center: Vector3
  distance: number
  azimuth: number
}

// Imperative three.js camera work lives outside component scope so the React
// Compiler immutability rule stays intact (mutating hook-returned values in
// component scope is rejected by react-hooks/immutability).
function fitCameraToSphere(
  camera: PerspectiveCamera,
  sphere: Sphere,
  margin: number,
): number {
  const verticalHalf = MathUtils.degToRad(camera.fov) / 2
  const horizontalHalf = Math.atan(Math.tan(verticalHalf) * camera.aspect)
  const distance =
    (sphere.radius / Math.sin(Math.min(verticalHalf, horizontalHalf))) * margin
  camera.near = Math.max(distance / 100, 0.01)
  camera.far = distance * 100
  camera.updateProjectionMatrix()
  return distance
}

function positionCamera(camera: PerspectiveCamera, fit: CameraFit): void {
  const ringRadius = Math.cos(CAMERA_ELEVATION) * fit.distance
  camera.position.set(
    fit.center.x + ringRadius * Math.cos(fit.azimuth),
    fit.center.y + Math.sin(CAMERA_ELEVATION) * fit.distance,
    fit.center.z + ringRadius * Math.sin(fit.azimuth),
  )
  camera.lookAt(fit.center)
}

type AnimatedSceneProps = {
  scene: WorldScene
  reducedMotion: boolean
  onReady: () => void
}

function AnimatedScene({ scene, reducedMotion, onReady }: AnimatedSceneProps) {
  const { scene: model, animations } = useGLTF(scene.glbUrl)
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const mixerRef = useRef<AnimationMixer | null>(null)
  const fitRef = useRef<CameraFit | null>(null)

  // Fit the camera to the model's bounding sphere; refits on resize so narrow
  // viewports keep the whole scene in frame.
  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return
    const box = new Box3().setFromObject(model)
    const sphere = box.getBoundingSphere(new Sphere())
    const distance = fitCameraToSphere(camera, sphere, CAMERA_FIT_MARGIN)
    fitRef.current = {
      center: sphere.center.clone(),
      distance,
      azimuth: fitRef.current?.azimuth ?? INITIAL_AZIMUTH,
    }
  }, [model, camera, size])

  // Play every baked clip. The mixer is created paused at t=0 (the assembled
  // state) and only advances when the user allows motion.
  useEffect(() => {
    const mixer = new AnimationMixer(model)
    for (const clip of animations) {
      const action = mixer.clipAction(clip)
      action.setLoop(
        scene.animationMode === 'pingpong' ? LoopPingPong : LoopRepeat,
        Infinity,
      )
      action.play()
    }
    mixer.update(0)
    mixerRef.current = mixer
    onReady()
    return () => {
      mixer.stopAllAction()
      mixer.uncacheRoot(model)
      mixerRef.current = null
    }
  }, [model, animations, scene.animationMode, onReady])

  useFrame((state, delta) => {
    const fit = fitRef.current
    if (!fit || !(camera instanceof PerspectiveCamera)) return
    if (!reducedMotion) {
      mixerRef.current?.update(delta)
      fit.azimuth =
        INITIAL_AZIMUTH +
        SWAY_AMPLITUDE * Math.sin(state.clock.elapsedTime * SWAY_SPEED)
    }
    positionCamera(camera, fit)
  })

  return <primitive object={model} />
}

type WorldCanvasProps = {
  sceneId: WorldSceneId
}

export function WorldCanvas({ sceneId }: WorldCanvasProps) {
  const scene = worldScenes[sceneId]
  const reducedMotion = usePrefersReducedMotion()
  const [ready, setReady] = useState(false)
  const handleReady = useCallback(() => setReady(true), [])

  if (!isWebGLAvailable()) {
    return (
      <div className="world-hero__stage">
        <WorldPoster scene={scene} />
      </div>
    )
  }

  return (
    <WorldErrorBoundary
      fallback={
        <div className="world-hero__stage">
          <WorldPoster scene={scene} />
        </div>
      }
    >
      <div className="world-hero__stage">
        {!ready && <WorldPoster scene={scene} />}
        <Canvas
          camera={{ fov: 35, near: 0.1, far: 100 }}
          dpr={[1, 2]}
          role="img"
          aria-label={scene.description}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[5.5, 8, 4.5]} intensity={2.4} />
          <Suspense fallback={null}>
            <AnimatedScene
              scene={scene}
              reducedMotion={reducedMotion}
              onReady={handleReady}
            />
          </Suspense>
        </Canvas>
      </div>
    </WorldErrorBoundary>
  )
}
