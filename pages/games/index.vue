<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  router.replace({ path: '/game/', query: route.query, hash: route.hash })
})
</script>

<template>
  <main class="legacy-game-page">
    <RouterLink to="/game/">前往游戏人生</RouterLink>
  </main>
</template>

<route lang="yaml">
meta:
  layout: game
  frontmatter:
    title: 游戏人生
</route>

<style scoped>
.legacy-game-page {
  flex: 1;
  margin: 100px auto;
}
</style>
