import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const mcq = JSON.parse(readFileSync(join(__dirname, 'mcq-data.json'), 'utf8'))

const src = join(__dirname, '../src/data/questions.js')
const lines = readFileSync(src, 'utf8').split('\n')

let count = 0
const out = lines.map(line => {
  const m = line.match(/\{ m:(\d+),w:(\d+),d:(\d+),/)
  if (!m) return line
  const key = `${m[1]}_${m[2]}_${m[3]}`
  const data = mcq[key]
  if (!data) return line
  // Skip if already has opts
  if (line.includes('opts:')) return line
  // Find last } in line and insert before it
  const lastBrace = line.lastIndexOf('}')
  if (lastBrace === -1) return line
  const optsJson = JSON.stringify(data.opts)
  const injection = `, opts: ${optsJson}, ans: ${data.ans}`
  count++
  return line.slice(0, lastBrace) + injection + line.slice(lastBrace)
})

writeFileSync(src, out.join('\n'), 'utf8')
console.log(`Injected ${count} questions`)
