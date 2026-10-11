import { describe, expect, it } from 'vitest'

import detectorManifest from '../../blender/exports/manifests/detector_scene.json'
import mobileManifest from '../../blender/exports/manifests/mobile_scene.json'
import softwareManifest from '../../blender/exports/manifests/software_scene.json'
import waterpoloManifest from '../../blender/exports/manifests/waterpolo_scene.json'
import { worldScenes, type WorldSceneId } from './scenes'

const expectedIds: WorldSceneId[] = [
  'detector_scene',
  'mobile_scene',
  'software_scene',
  'waterpolo_scene',
]

const manifests = {
  detector_scene: detectorManifest,
  mobile_scene: mobileManifest,
  software_scene: softwareManifest,
  waterpolo_scene: waterpoloManifest,
} as const

describe('worldScenes registry', () => {
  it('contains exactly the four MLE scenes', () => {
    expect(Object.keys(worldScenes).sort()).toEqual([...expectedIds].sort())
  })

  it.each(expectedIds)('%s has well-formed glb and poster URLs', (id) => {
    const scene = worldScenes[id]
    expect(scene.id).toBe(id)
    expect(scene.glbUrl).toBe(`/models/${id}.glb`)
    expect(scene.posterUrl).toBe(`/models/posters/${id}.png`)
  })

  it.each(expectedIds)(
    '%s reuses the manifest description verbatim',
    (id) => {
      expect(worldScenes[id].description).toBe(manifests[id].description)
    },
  )

  it('ping-pongs the one-way detector disassembly and loops the others', () => {
    expect(worldScenes.detector_scene.animationMode).toBe('pingpong')
    expect(worldScenes.mobile_scene.animationMode).toBe('loop')
    expect(worldScenes.software_scene.animationMode).toBe('loop')
    expect(worldScenes.waterpolo_scene.animationMode).toBe('loop')
  })

  it('sways the mobile scene but not software, detector, or waterpolo', () => {
    expect(worldScenes.mobile_scene.sway).toBe(true)
    expect(worldScenes.software_scene.sway).toBe(false)
    expect(worldScenes.detector_scene.sway).toBe(false)
    expect(worldScenes.waterpolo_scene.sway).toBe(false)
  })
})
