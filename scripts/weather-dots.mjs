#!/usr/bin/env node
// Builds the cloud → sun dot morph for the Pragmatica weather screen from the Figma SVG exports.
// Output: components/play/screens/weather/dots.json — [{ x, y, r, tx, ty, tr }] in 393×852 screen space.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ASSETS = path.join(ROOT, 'public/play/pragmatica/weather')

// Where Figma places each group on the 393×852 screen (from get_design_context insets).
const CLOUD = { left: 0.2137 * 393, top: 0.5446 * 852 }
const SUN = { left: 0.2628 * 393, top: 0.5293 * 852 }

/** Each dot is a closed path; its control points bound the circle, so the bbox gives centre and radius. */
function dots(file, offset) {
  const svg = fs.readFileSync(path.join(ASSETS, file), 'utf8')
  return [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map(([, d]) => {
    const n = d.match(/-?\d*\.?\d+(?:e-?\d+)?/g).map(Number)
    const xs = n.filter((_, i) => i % 2 === 0)
    const ys = n.filter((_, i) => i % 2 === 1)
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
    return { x: offset.left + (minX + maxX) / 2, y: offset.top + (minY + maxY) / 2, r: Math.max(maxX - minX, maxY - minY) / 2 }
  })
}

const cloud = dots('cloud-dots.svg', CLOUD)
const sun = dots('sun-dots.svg', SUN)

// Greedy matching on shapes normalised to their own centroids, longest-distance pairs resolved first.
const centroid = (pts) => ({ x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length })
const cc = centroid(cloud)
const sc = centroid(sun)
const free = new Set(sun.map((_, i) => i))
const order = cloud.map((p, i) => ({ i, d: Math.hypot(p.x - cc.x, p.y - cc.y) })).sort((a, b) => b.d - a.d)
const pairs = []
for (const { i } of order) {
  const p = cloud[i]
  let best = -1
  let bestD = Infinity
  for (const j of free) {
    const q = sun[j]
    const d = Math.hypot(p.x - cc.x - (q.x - sc.x), p.y - cc.y - (q.y - sc.y))
    if (d < bestD) [best, bestD] = [j, d]
  }
  if (best === -1) {
    pairs.push({ ...p, tx: sc.x, ty: sc.y, tr: 0 }) // extra cloud dots shrink into the sun's core
    continue
  }
  free.delete(best)
  const q = sun[best]
  pairs.push({ ...p, tx: q.x, ty: q.y, tr: q.r })
}
for (const j of free) pairs.push({ x: sun[j].x, y: sun[j].y, r: 0, tx: sun[j].x, ty: sun[j].y, tr: sun[j].r })

const round = (v) => Math.round(v * 100) / 100
const out = pairs.map((p) => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, round(v)])))
const dst = path.join(ROOT, 'components/play/screens/weather/dots.json')
fs.mkdirSync(path.dirname(dst), { recursive: true })
fs.writeFileSync(dst, JSON.stringify(out) + '\n')
console.log(`cloud ${cloud.length} dots, sun ${sun.length} dots → ${out.length} pairs`)
console.log('cloud r range', Math.min(...cloud.map((p) => p.r)).toFixed(2), Math.max(...cloud.map((p) => p.r)).toFixed(2), '| sun r range', Math.min(...sun.map((p) => p.r)).toFixed(2), Math.max(...sun.map((p) => p.r)).toFixed(2))
