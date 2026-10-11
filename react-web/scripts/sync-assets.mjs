import { cpSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'blender', 'exports', 'models')
const dest = join(root, 'public', 'models')

mkdirSync(dest, { recursive: true })
for (const file of readdirSync(src)) {
  if (file.endsWith('.glb')) cpSync(join(src, file), join(dest, file))
}
console.log(
  `synced assets: ${readdirSync(dest)
    .filter((file) => file.endsWith('.glb'))
    .sort()
    .join(', ')}`,
)

// Hero posters: the desktop preview of each MLE scene, copied under the scene
// id so the registry can reference /models/posters/<id>.png.
const MLE_SCENE_IDS = ['detector_scene', 'mobile_scene', 'software_scene', 'waterpolo_scene']
const manifestDir = join(root, 'blender', 'exports', 'manifests')
const posterDest = join(dest, 'posters')
mkdirSync(posterDest, { recursive: true })
for (const id of MLE_SCENE_IDS) {
  const manifest = JSON.parse(
    readFileSync(join(manifestDir, `${id}.json`), 'utf8'),
  )
  cpSync(join(root, manifest.previewFile), join(posterDest, `${id}.png`))
}
console.log(`synced posters: ${readdirSync(posterDest).sort().join(', ')}`)
