import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LazyWorldCanvas } from './LazyWorldCanvas'
import { worldScenes, type WorldSceneId } from './scenes'

const sceneIds: WorldSceneId[] = [
  'detector_scene',
  'mobile_scene',
  'waterpolo_scene',
]

describe('LazyWorldCanvas loader fallback', () => {
  it.each(sceneIds)(
    '%s renders the loader and accessible description while the canvas loads',
    (sceneId) => {
      const scene = worldScenes[sceneId]
      render(<LazyWorldCanvas sceneId={sceneId} />)

      const loader = screen.getByLabelText('Loading 3D scene')
      expect(loader).toBeInTheDocument()

      expect(
        screen.getByRole('heading', { name: 'Scene description' }),
      ).toBeInTheDocument()
      expect(screen.getByText(scene.description)).toBeInTheDocument()
    },
  )
})
