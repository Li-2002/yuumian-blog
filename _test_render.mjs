import { createRequire } from 'module'
import fs from 'fs'
const require = createRequire(import.meta.url)
const markdownit = require('./node_modules/.pnpm/markdown-it@14.3.0/node_modules/markdown-it')
const md = markdownit({ html: true })
const src = fs.readFileSync('pages/posts/saa-chatModel-and-chatClient.md', 'utf8')
const html = md.render(src)
fs.writeFileSync('_test_render.html', html)
console.log('rendered length:', html.length)
// 粗查未闭合标签：找所有 <xxx 形式的开始标签
const open = [...html.matchAll(/<([a-zA-Z][a-zA-Z0-9-]*)(?=[\s>])/g)].map(m => m[1])
const close = [...html.matchAll(/<\/([a-zA-Z][a-zA-Z0-9-]*)>/g)].map(m => m[1])
console.log('open tags:', open.join(','))
console.log('close tags:', close.join(','))
