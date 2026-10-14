import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

// Generates display variants only. Original portfolio images remain untouched.
const require = createRequire(import.meta.url)
const sharp = require(process.argv[2] || 'sharp')
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicRoot = path.join(root, 'public')
const output = path.join(publicRoot, 'optimized')
const files = []
async function collect(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.name === 'optimized') continue
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) await collect(filename)
    else if (/\.(webp|png|jpe?g)$/i.test(entry.name)) files.push(filename)
  }
}
await collect(publicRoot)
const manifest = {}
let originalBytes = 0, mobileBytes = 0
for (const filename of files) {
  const stat = await fs.stat(filename)
  if (stat.size < 180000) continue
  const metadata = await sharp(filename).metadata()
  if (!metadata.width || metadata.width <= 960 || metadata.pages > 1) continue
  const relative = path.relative(publicRoot, filename).replaceAll('\\', '/')
  const variants = []
  for (const width of [960, 1600]) {
    if (width >= metadata.width) continue
    const target = path.join(output, relative.replace(/\.[^.]+$/, `-${width}.webp`))
    const buffer = await sharp(filename).resize({ width, withoutEnlargement: true }).webp({ quality: 90, effort: 5 }).toBuffer()
    if (buffer.length >= stat.size * .9) continue
    await fs.mkdir(path.dirname(target), { recursive: true })
    await fs.writeFile(target, buffer)
    variants.push({ src: '/' + path.relative(publicRoot, target).replaceAll('\\', '/'), width, bytes: buffer.length })
  }
  if (variants.length) {
    manifest['/' + relative] = { width: metadata.width, height: metadata.height, variants }
    originalBytes += stat.size
    mobileBytes += variants[0].bytes
  }
}
await fs.writeFile(path.join(root, 'src/imageVariants.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(JSON.stringify({ images: Object.keys(manifest).length, originalBytes, mobileBytes, reduction: (1 - mobileBytes / originalBytes) * 100 }))
