---
title: 游戏人生
layout: game
steam: https://steamcommunity.com/
games:
  - id: elden-ring
    name: 艾尔登法环
    spec: Elden Ring.
    category: 剧情超绝
    playTime: 待记录
    desc: 即使引导早已破碎，也请您当上艾尔登之王
    image: https://yuumii.top/about/about3-fahuan.jpg
    link: https://www.xiaoheihe.cn/app/topic/game/pc/1245620
  - id: where-winds-meet
    name: 燕云十六声
    spec: 松子糖. / Where Wind Meeting.
    category: 剧情超绝 · 武侠江湖
    playTime: 待记录
    desc: 苍生无言，侠为其声
    image: https://yuumii.top/pic/yysls/MEITU_20260315_182144963.jpg
    link: https://www.yysls.cn/fab/bingsem/
  - id: black-myth-wukong
    name: 黑神话悟空
    spec: 只怕你聋了耳，又乱了心
    category: 剧情超绝
    playTime: 待记录
    desc: 小猴子你听，那风里传来的，都是求而不得的声音
    image: https://yuumii.top/games/blackMeth.jpg
    link: https://gamesci.cn/wukong
  - id: naraka
    name: 永劫无间
    spec: 武侠游戏之首
    category: 武侠江湖
    playTime: 待记录
    desc: 我身无拘 武道无穷
    image: https://yuumii.top/games/%E6%B0%B8%E5%8A%AB.png
    link: https://www.yjwujian.cn/
  - id: forza-horizon-4
    name: 地平线4
    spec: Xbox
    category: 风景超绝
    playTime: 待记录
    desc: 你知道，我真的爱你，句句不轻易~
    image: https://yuumii.top/games/dpx4.png
    link: https://www.xiaoheihe.cn/app/topic/game/pc/1293830
---

<!-- 上面编辑游戏封面、介绍和 playTime（游玩时间，例如 120 小时）；下面在对应 id 的 template 内写感想，支持 Markdown。新增游戏时，两处的 id 保持一致。 -->

<script setup>
import ValaxyMain from '../../components/GameLifeMain.vue'
</script>

<GameLife :games="frontmatter.games" :steam="frontmatter.steam">

<template #elden-ring>

感想待补。

</template>

<template #where-winds-meet>

感想待补。

</template>

<template #black-myth-wukong>

感想待补。

</template>

<template #naraka>

感想待补。

</template>

<template #forza-horizon-4>

感想待补。

</template>

</GameLife>
