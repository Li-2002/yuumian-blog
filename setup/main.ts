import { defineAppSetup } from 'valaxy'

export default defineAppSetup(({ isClient }) => {
  if (!isClient)
    return

  // 51LA 访问统计（迁移自 Hexo 安知鱼主题）
  const laScript = document.createElement('script')
  laScript.src = 'https://sdk.51.la/js-sdk-pro.min.js'
  laScript.async = true
  laScript.onload = () => {
    ;(window as any).LA?.init({ id: '3QMSDLh40WIi9Wr4' })
  }
  document.head.appendChild(laScript)
})
