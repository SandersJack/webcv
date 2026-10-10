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
  mobileGlbUrl: string
  posterUrl: string
  description: string
  animationMode: WorldAnimationMode
  sway: boolean
}

export const worldScenes: Record<WorldSceneId, WorldScene> = {
  detector_scene: {
    id: 'detector_scene',
    glbUrl: '/models/detector_scene.glb',
    mobileGlbUrl: '/models/detector_scene_mobile.glb',
    posterUrl: '/models/posters/detector_scene.png',
    description:
      'Low-poly voxel model of the NA62 detector at CERN on an exhibit plinth, laid out in beam order: the KTAG kaon tagger and Gigatracker plates feed a long green decay vacuum tank lined with amber LAV veto rings and four gold STRAW tracking chambers straddling the dark MNP33 dipole magnet, followed by the long stepped RICH cylinder, the CHOD disk, the fat blue octagonal LKr calorimeter, and the MUV muon-veto slabs behind their iron wall. A glowing signature kaon and cyan hit markers trace the particle path; stations slide apart along the beam axis in a disassembly animation.',
    animationMode: 'pingpong',
    sway: false,
  },
  mobile_scene: {
    id: 'mobile_scene',
    glbUrl: '/models/mobile_scene.glb',
    mobileGlbUrl: '/models/mobile_scene_mobile.glb',
    posterUrl: '/models/posters/mobile_scene.png',
    description:
      'Low-poly voxel smartphone standing on an exhibit plinth, its replaceable glass screen showing a grid of app tiles including EE and BT: the phone is the hub of a small connected world, with a home hub router and two IoT plant sensors whose cyan signal arcs carry glowing packets into the phone. Represents connected mobile experiences.',
    animationMode: 'loop',
    sway: true,
  },
  waterpolo_scene: {
    id: 'waterpolo_scene',
    glbUrl: '/models/waterpolo_scene.glb',
    mobileGlbUrl: '/models/waterpolo_scene_mobile.glb',
    posterUrl: '/models/posters/waterpolo_scene.png',
    description:
      "Low-poly voxel water polo pool in match setup: goal lines, 2 m and 5 m lines, half-distance line with a ball release ring, re-entry markers, officials' table and goal judge seats on a dark deck, lane ropes, and two floating goals with net cages riding on the water behind the goal lines. The yellow faceted ball floats at the centre; bubbles rise where the network story dissolves into water.",
    animationMode: 'loop',
    sway: false,
  },
}
