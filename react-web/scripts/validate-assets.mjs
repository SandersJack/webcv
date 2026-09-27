import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const manifestDir = join(root, 'blender', 'exports', 'manifests')

const MAX_TRIANGLES = 12000
const MAX_BYTES = 256000
const NAME_PREFIX = /^(SCN|ENV|HERO|PROP|FX|INT|PIVOT|COLL)_/
const BLENDER_SUFFIX = /\.\d+$/
const LOADING_PRIORITIES = new Set(['initial', 'next', 'deferred'])
const REQUIRED_STRING_FIELDS = [
  'id',
  'scene',
  'sourceFile',
  'glbFile',
  'previewFile',
  'previewFileMobile',
  'version',
  'description',
]

let failures = 0
const fail = (id, message) => {
  failures += 1
  console.error(`FAIL ${id}: ${message}`)
}

const rows = []
for (const file of readdirSync(manifestDir).filter((f) => f.endsWith('.json'))) {
  const manifest = JSON.parse(readFileSync(join(manifestDir, file), 'utf8'))
  const id = manifest.id ?? file

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof manifest[field] !== 'string' || manifest[field].length === 0) {
      fail(id, `missing required field ${field}`)
    }
  }
  if (typeof manifest.description === 'string' && manifest.description.length < 40) {
    fail(id, 'description too short for accessibility fallback')
  }
  if (!LOADING_PRIORITIES.has(manifest.loadingPriority)) {
    fail(id, `loadingPriority ${manifest.loadingPriority} not in initial|next|deferred`)
  }
  if (manifest.publicityLevel !== 'public') {
    fail(id, `publicityLevel is ${manifest.publicityLevel}; launch gate requires public`)
  }
  if (typeof manifest.triangleCount !== 'number' || manifest.triangleCount > MAX_TRIANGLES) {
    fail(id, `triangleCount ${manifest.triangleCount} exceeds budget ${MAX_TRIANGLES}`)
  }
  if (typeof manifest.fileSizeBytes !== 'number' || manifest.fileSizeBytes > MAX_BYTES) {
    fail(id, `fileSizeBytes ${manifest.fileSizeBytes} exceeds budget ${MAX_BYTES}`)
  }
  if (
    !Array.isArray(manifest.dimensions) ||
    manifest.dimensions.length !== 3 ||
    manifest.dimensions.some((d) => typeof d !== 'number' || d <= 0)
  ) {
    fail(id, 'dimensions must be three positive numbers')
  }

  for (const key of ['glbFile', 'previewFile', 'previewFileMobile', 'mobileVariant']) {
    if (typeof manifest[key] === 'string' && !existsSync(join(root, manifest[key]))) {
      fail(id, `${key} not found on disk: ${manifest[key]}`)
    }
  }
  if (typeof manifest.glbFile === 'string' && existsSync(join(root, manifest.glbFile))) {
    const actual = statSync(join(root, manifest.glbFile)).size
    if (actual !== manifest.fileSizeBytes) {
      fail(id, `fileSizeBytes ${manifest.fileSizeBytes} != actual ${actual}`)
    }
  }

  const objects = Array.isArray(manifest.exportedObjects) ? manifest.exportedObjects : []
  for (const name of objects) {
    if (!NAME_PREFIX.test(name)) fail(id, `object name breaks convention: ${name}`)
    if (BLENDER_SUFFIX.test(name)) fail(id, `object name has Blender suffix: ${name}`)
  }
  const ids = Array.isArray(manifest.interactiveIds) ? manifest.interactiveIds : []
  for (const interactiveId of ids) {
    if (!objects.includes(interactiveId)) {
      fail(id, `interactiveId ${interactiveId} not in exportedObjects`)
    }
    if (!objects.includes(interactiveId.replace(/^INT_/, 'PIVOT_'))) {
      fail(id, `missing pivot for ${interactiveId}`)
    }
  }
  for (const key of Object.keys(manifest.interactiveDescriptions ?? {})) {
    if (!ids.includes(key)) {
      fail(id, `interactiveDescriptions key ${key} not in interactiveIds`)
    }
  }

  rows.push({
    id,
    tris: manifest.triangleCount,
    kb: (manifest.fileSizeBytes / 1024).toFixed(1),
    materials: manifest.materialCount,
    objects: objects.length,
  })
}

console.table(rows)
if (failures > 0) {
  console.error(`validate-assets: ${failures} failure(s)`)
  process.exit(1)
}
console.log('validate-assets: all manifests pass budgets, naming, pivots, and fallbacks')
