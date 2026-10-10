<script setup lang="ts">
interface FriendLink {
  text: string
  url: string
  title: string
  icon?: string
  img?: string
}

const links: FriendLink[] = [
  {
    text: '开往',
    icon: 'i-ri-train-line',
    url: 'https://www.travellings.cn/go.html',
    title: '开往-友链接力',
  },
  {
    text: '萌国旅游团',
    icon: 'i-ri-plane-line',
    url: 'https://travel.moe/go.html?travel=on',
    title: '萌国旅游团',
  },
  {
    text: '萌ICP备',
    icon: 'i-ri-shield-check-line',
    url: 'https://icp.gov.moe/?keyword=20262190',
    title: '萌ICP备20262190号',
  },
  {
    text: 'BlogsClub',
    icon: 'i-ri-article-line',
    url: 'https://www.blogsclub.org/',
    title: 'BlogsClub',
  },
  {
    text: 'BLOGS·CN',
    img: 'https://photo.xiangming.site/img/blogscn_icon.png',
    url: 'https://blogscn.fun/',
    title: 'BLOGS·CN',
  },
  {
    text: '博友圈',
    img: 'https://www.boyouquan.com/assets/images/sites/logo/logo-small.svg',
    url: 'https://www.boyouquan.com/planet-shuttle',
    title: '博友圈-星球穿梭',
  },
]
</script>

<template>
  <div class="home-friend-bar">
    <a
      v-for="link in links"
      :key="link.text"
      class="home-friend-bar-item"
      :href="link.url"
      :title="link.title"
      target="_blank"
      rel="noopener"
    >
      <i v-if="link.icon" :class="link.icon" class="home-friend-bar-icon" />
      <img v-else-if="link.img" :src="link.img" :alt="link.title" class="home-friend-bar-img">
      <span>{{ link.text }}</span>
    </a>
  </div>
</template>

<style scoped>
.home-friend-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 20px;
  width: 100%;
  margin-bottom: 20px;
  padding: 0 16px;
}

.home-friend-bar-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--va-c-text-light);
  text-decoration: none;
  transition: color 0.2s;
}

.home-friend-bar-item:hover {
  color: var(--va-c-primary);
}

.home-friend-bar-icon {
  font-size: 16px;
  width: 16px;
  height: 16px;
}

.home-friend-bar-img {
  width: auto;
  height: 15px;
}
</style>
