import { cpSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'blender', 'exports', 'models')
const dest = join(root, 'public', 'models')

mkdirSync(dest, { recursive: true })
for (const file of readdirSync(src)) {
  if (file.endsWith('.glb')) cpSync(join(src, file), join(dest, file))
}
console.log(`synced assets: ${readdirSync(dest).sort().join(', ')}`)
