import { createRequire } from 'module'
import fs from 'fs'
import path from 'path'
const require = createRequire(import.meta.url)
const markdownit = require('./node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it')
const md = markdownit({ html: true })

const dir = 'pages/posts'
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])

function check(file) {
  const src = fs.readFileSync(path.join(dir, file), 'utf8')
  const html = md.render(src)
  const open = [...html.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)(?=[\s>])/g)].map(m => m[1]).filter(t => !VOID.has(t.toLowerCase()))
  const close = [...html.matchAll(/<\/([a-zA-Z][a-zA-Z0-9-]*)>/g)].map(m => m[1])
  const diff = []
  for (const t of open) {
    const ci = close.indexOf(t)
    if (ci >= 0) close.splice(ci, 1)
    else diff.push(`<${t}> 未闭合`)
  }
  for (const t of close) diff.push(`</${t}> 无匹配开始标签`)
  return diff
}

let any = false
for (const f of files) {
  const issues = check(f)
  if (issues.length) {
    any = true
    console.log(`[${f}]`)
    for (const i of issues) console.log('  ' + i)
  }
}
if (!any) console.log('全部文章检查通过，无未闭合标签')
