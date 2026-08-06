<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { usePostList } from 'valaxy'

defineProps<{
  content: string
}>()

// Valaxy 的 wordCount 是格式化字符串（如 "2.1k"、"3569"），解析回数字再累加
function parseWordCount(wc: string): number {
  if (!wc)
    return 0
  if (wc.endsWith('k'))
    return Math.round(parseFloat(wc.slice(0, -1)) * 1000)
  return parseInt(wc, 10) || 0
}

const posts = usePostList()
const totalWords = computed(() =>
  posts.value.reduce((sum, p) => sum + parseWordCount(p.wordCount || ''), 0),
)

// 不蒜子访问统计（迁移自 Hexo 安知鱼主题，jsd 国内 CDN）
onMounted(() => {
  if (typeof document === 'undefined' || document.getElementById('busuanzi-script'))
    return
  const script = document.createElement('script')
  script.id = 'busuanzi-script'
  script.src = 'https://jsd.dusays.com/npm/penndu@17.0.0/bsz.js'
  script.async = true
  script.dataset.prefix = 'busuanzi_value'
  document.head.appendChild(script)
})
</script>

<template>
  <div class="w-full px-4 flex-center">
    <div class="yun-notice w-full">
      <span v-html="content" />
      <div class="yun-notice-stats">
        <span>本站访客 <span id="busuanzi_value_site_uv" /> 人次</span>
        <span>访问量 <span id="busuanzi_value_site_pv" /> 次</span>
        <span>写文总字数 {{ totalWords }} 字</span>
      </div>
      <slot />
    </div>
  </div>
</template>

<style>
.yun-notice {
  border: 1px solid var(--va-c-text);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: var(--va-font-serif);
  font-weight: bold;
  padding: 1rem;
  max-width: var(--yun-post-card-max-width);
  background-color: rgb(200 200 200 / 0.1);
}

.yun-notice-stats {
  margin-top: 0.5rem;
  font-weight: normal;
  font-size: 0.9rem;
  font-family: var(--va-font-sans);
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
