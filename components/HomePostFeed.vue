<script setup lang="ts">
import type { Post } from 'valaxy'
import { usePostListWithCollections, useSiteConfig } from 'valaxy'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const siteConfig = useSiteConfig()
const postList = usePostListWithCollections()
const selectedCategory = ref('')
const categoryItems = ref<HTMLDivElement>()
const posts = computed(() => postList.value.filter(post => import.meta.env.DEV || !post.hide))

function categoryOf(post: Post) {
  return (Array.isArray(post.categories) ? post.categories[0] : post.categories) || '未分类'
}

const categories = computed(() => [...new Set(posts.value.map(categoryOf))])

function scrollCategories(direction: -1 | 1) {
  const items = categoryItems.value
  if (items) {
    items.scrollBy({
      left: direction * items.clientWidth * 0.75,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }
}

// Apply query filters after hydration so static HTML and the initial client render agree.
onMounted(() => {
  watch(() => route.query.category, (category) => {
    selectedCategory.value = typeof category === 'string' && categories.value.includes(category)
      ? category
      : ''
  }, { immediate: true })
})

const filteredPosts = computed(() => selectedCategory.value
  ? posts.value.filter(post => categoryOf(post) === selectedCategory.value)
  : posts.value,
)
const pageSize = computed(() => siteConfig.value.pageSize)
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize.value))
const currentPage = computed(() => Math.max(1, Math.min(Number(route.params.page) || 1, totalPages.value || 1)))
const displayedPosts = computed(() => filteredPosts.value.slice(
  (currentPage.value - 1) * pageSize.value,
  currentPage.value * pageSize.value,
))

function categoryTo(category: string) {
  const query = { ...route.query }
  if (category)
    query.category = category
  else
    delete query.category
  return { path: '/', query }
}

function pageTo(page: number) {
  return { path: page === 1 ? '/' : `/page/${page}`, query: route.query }
}

function showPage(page: number) {
  return page === 1 || page === totalPages.value || Math.abs(page - currentPage.value) <= 2
}
</script>

<template>
  <section class="home-post-feed" aria-label="博客文章">
    <nav class="home-category-bar" aria-label="文章分类">
      <button type="button" class="home-category-arrow" aria-label="向左查看更多分类" @click="scrollCategories(-1)">
        <i class="i-ri-arrow-left-double-line" aria-hidden="true" />
      </button>
      <div ref="categoryItems" class="home-category-items">
        <RouterLink
          :to="categoryTo('')"
          class="home-category-item"
          :class="{ active: !selectedCategory }"
          :aria-current="!selectedCategory ? 'true' : 'false'"
        >
          全部
        </RouterLink>
        <ValaxyFootnoteTooltip class="home-category-game-tooltip" placement="top">
          <RouterLink
            :to="categoryTo('游戏')"
            class="home-category-item home-category-game"
            :class="{ active: selectedCategory === '游戏' }"
            :aria-current="selectedCategory === '游戏' ? 'true' : 'false'"
          >
            游戏
          </RouterLink>
          <template #popper>
            <span class="game-category-hint">游戏是爱好~但不希望占用过多空间 所以查看游戏内容请点击我</span>
          </template>
        </ValaxyFootnoteTooltip>
        <RouterLink
          v-for="category in categories.filter(category => category !== '游戏')"
          :key="category"
          :to="categoryTo(category)"
          class="home-category-item"
          :class="{ active: selectedCategory === category }"
          :aria-current="selectedCategory === category ? 'true' : 'false'"
        >
          {{ category }}
        </RouterLink>
      </div>
      <button type="button" class="home-category-arrow" aria-label="向右查看更多分类" @click="scrollCategories(1)">
        <i class="i-ri-arrow-right-double-line" aria-hidden="true" />
      </button>
      <RouterLink to="/categories/" class="home-category-more">更多</RouterLink>
    </nav>

    <div class="yun-post-list gap-4 items-center" flex="~ col" w="full" p="x-4 lt-sm:0">
      <div v-if="!displayedPosts.length" py2 op50 text-center>
        博主还什么都没写哦～
      </div>
      <template v-for="post in displayedPosts" :key="post.path">
        <YunCollectionCard v-if="post._collection" :post="post" :collection="post._collection" />
        <YunPostCard v-else :post="post" />
      </template>
    </div>

    <nav v-if="totalPages > 1" class="pagination" aria-label="文章分页">
      <RouterLink v-if="currentPage > 1" class="page-number" :to="pageTo(currentPage - 1)" aria-label="上一页">
        <i class="i-ri-arrow-left-s-line" aria-hidden="true" />
      </RouterLink>
      <template v-for="page in totalPages" :key="page">
        <RouterLink
          v-if="showPage(page)"
          class="page-number"
          :class="{ active: currentPage === page }"
          :to="pageTo(page)"
          :aria-label="`第 ${page} 页`"
          :aria-current="currentPage === page ? 'page' : 'false'"
        >
          {{ page }}
        </RouterLink>
        <span v-else-if="page === currentPage - 3 || page === currentPage + 3" class="space">…</span>
      </template>
      <RouterLink v-if="currentPage < totalPages" class="page-number" :to="pageTo(currentPage + 1)" aria-label="下一页">
        <i class="i-ri-arrow-right-s-line" aria-hidden="true" />
      </RouterLink>
    </nav>
  </section>
</template>

<style scoped>
.home-post-feed {
  width: 100%;
}

.home-category-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  width: calc(100% - 64px);
  max-width: var(--yun-post-card-max-width);
  margin: 0 auto 20px;
  padding: 4px 6px;
  border: 1px solid color-mix(in srgb, var(--va-c-primary) 14%, transparent);
  border-radius: 8px;
  background-color: var(--va-c-bg-opacity);
}

.home-category-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--va-c-text-light);
  cursor: pointer;
}

.home-category-arrow i {
  width: 18px;
  height: 18px;
}

.home-category-items {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 4px;
  min-width: 0;
  padding: 2px;
  overflow-x: auto;
  scrollbar-width: none;
}

.home-category-items::-webkit-scrollbar {
  display: none;
}

.home-category-item {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 6px;
  color: var(--va-c-text-light);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  white-space: nowrap;
  transition: color var(--va-transition-duration), background-color var(--va-transition-duration);
}

.home-category-more {
  flex-shrink: 0;
  padding: 4px 6px;
  border-radius: 6px;
  color: var(--va-c-text-light);
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}

.home-category-item:hover,
.home-category-arrow:hover,
.home-category-more:hover {
  color: var(--va-c-primary);
  background-color: var(--va-c-bg-soft);
}

.home-category-item.active {
  color: white;
  background-color: var(--va-c-primary);
}

.home-category-item.home-category-game {
  color: #f97316;
}

.home-category-game-tooltip {
  display: inline-flex;
  flex-shrink: 0;
}

.game-category-hint {
  display: block;
  max-width: min(240px, calc(100vw - 64px));
  font-size: 13px;
  line-height: 1.6;
  white-space: normal;
}

.home-category-item.home-category-game.active {
  background-color: color-mix(in srgb, currentColor 12%, transparent);
}

.home-category-item:focus-visible,
.home-category-arrow:focus-visible,
.home-category-more:focus-visible,
.page-number:focus-visible {
  outline: 2px solid var(--va-c-primary);
  outline-offset: 2px;
}

.pagination {
  display: flex;
  align-items: center;
  width: fit-content;
  margin: 20px auto 0;
  border-radius: 16px;
  overflow: hidden;
}

.pagination .page-number,
.pagination .space {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--va-c-text);
  background-color: var(--va-c-bg-opacity);
}

.pagination .page-number:hover,
.pagination .page-number.active {
  color: white;
  background-color: var(--va-c-primary);
}

.pagination .page-number:focus-visible {
  outline-offset: -2px;
}

@media (width < 640px) {
  .home-category-bar {
    width: calc(100% - 32px);
    gap: 2px;
    padding: 2px 4px;
  }

  .home-category-arrow {
    width: 40px;
    height: 40px;
  }

  .home-category-items {
    gap: 2px;
    overscroll-behavior-x: contain;
  }

  .home-category-item,
  .home-category-more {
    min-width: 40px;
    min-height: 40px;
    justify-content: center;
  }

  .home-category-more {
    display: inline-flex;
    align-items: center;
    padding-inline: 4px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-category-item {
    transition: none;
  }
}
</style>
