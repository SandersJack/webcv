import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { LazyWorldCanvas } from './LazyWorldCanvas'
import { worldScenes, type WorldSceneId } from './scenes'

const sceneIds: WorldSceneId[] = [
  'detector_scene',
  'mobile_scene',
  'waterpolo_scene',
]

describe('LazyWorldCanvas poster fallback', () => {
  it.each(sceneIds)(
    '%s renders the poster image and accessible description while the canvas loads',
    (sceneId) => {
      const scene = worldScenes[sceneId]
      render(<LazyWorldCanvas sceneId={sceneId} />)

      const poster = screen.getByRole('img', { name: scene.description })
      expect(poster).toHaveAttribute('src', scene.posterUrl)
      // Explicit dimensions reserve the aspect ratio (no layout shift).
      expect(poster).toHaveAttribute('width', '1600')
      expect(poster).toHaveAttribute('height', '900')

      expect(
        screen.getByRole('heading', { name: 'Scene description' }),
      ).toBeInTheDocument()
      expect(screen.getByText(scene.description)).toBeInTheDocument()
    },
  )
})
