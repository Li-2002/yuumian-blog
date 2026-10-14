<script setup lang="ts">
import type { Post } from 'valaxy'
import { useSiteConfig } from 'valaxy'

defineProps<{ frontmatter: Post }>()

const siteConfig = useSiteConfig()
</script>

<template>
  <slot name="main-content-md" />
  <section v-if="siteConfig.comment.enable && frontmatter.comment !== false" class="game-comments" aria-label="游戏人生评论">
    <YunComment />
  </section>
</template>

<style scoped>
.game-comments {
  width: calc(100% - 48px);
  max-width: var(--yun-post-card-max-width, 900px);
  margin: 0 auto 64px;
}

@media (width < 640px) {
  .game-comments {
    width: calc(100% - 32px);
    margin-bottom: 40px;
  }
}
</style>
