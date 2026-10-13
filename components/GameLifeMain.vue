<script setup lang="ts">
import type { Post } from 'valaxy'

defineProps<{ frontmatter: Post }>()
</script>

<template>
  <slot name="main-content-md" />
</template>
