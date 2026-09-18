/**
 * Registry of the Blender MLE (minimum lovable experience) voxel scenes
 * embedded in the page heroes. Descriptions are copied verbatim from
 * blender/exports/manifests/<id>.json — keep them in sync with the manifests.
 *
 * Animation modes:
 * - 'pingpong': play forward then reverse (detector disassembly is one-way,
 *   frames 1-60, so reversing gives a smooth loop).
 * - 'loop': clips are authored to loop (mobile packets 1-48, water polo ball
 *   bob + bubbles 1-48).
 */

export type WorldSceneId = 'detector_scene' | 'mobile_scene' | 'waterpolo_scene'

export type WorldAnimationMode = 'loop' | 'pingpong'

export type WorldScene = {
  id: WorldSceneId
  glbUrl: string
  posterUrl: string
  description: string
  animationMode: WorldAnimationMode
}

export const worldScenes: Record<WorldSceneId, WorldScene> = {
  detector_scene: {
    id: 'detector_scene',
    glbUrl: '/models/detector_scene.glb',
    posterUrl: '/models/posters/detector_scene.png',
    description:
      'Low-poly voxel model of a particle physics detector on an exhibit plinth: a segmented beam pipe passes through three faceted detector rings, a tracking station with straw tubes, photon detector blocks with cyan hit markers, and a stepped calorimeter wall. A glowing signature particle and curved track show the particle path. Stations can slide apart along the beam axis in a disassembly animation.',
    animationMode: 'pingpong',
  },
  mobile_scene: {
    id: 'mobile_scene',
    glbUrl: '/models/mobile_scene.glb',
    posterUrl: '/models/posters/mobile_scene.png',
    description:
      'Low-poly voxel smartphone standing on an exhibit plinth: a stepped dark device with a replaceable glass screen, abstract app interface cards emerging from the display, and a small network of nodes whose cables carry glowing packets into the phone. Represents connected mobile experiences.',
    animationMode: 'loop',
  },
  waterpolo_scene: {
    id: 'waterpolo_scene',
    glbUrl: '/models/waterpolo_scene.glb',
    posterUrl: '/models/posters/waterpolo_scene.png',
    description:
      "Low-poly voxel water polo pool in match setup: goal lines, 2 m and 5 m lines, half-distance line with a ball release ring, re-entry markers, officials' table and goal judge seats on a dark deck, lane ropes, and two floating goals with net cages riding on the water behind the goal lines. The yellow faceted ball floats at the centre; bubbles rise where the network story dissolves into water.",
    animationMode: 'loop',
  },
}
