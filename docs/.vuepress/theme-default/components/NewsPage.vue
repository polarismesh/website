<template>
  <main class="page news-page">
    <Content class="theme-default-content" />
  </main>
</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue'
import PageNav from '@theme/components/PageNav.vue'

export default {
  components: { PageEdit, PageNav },
  props: ['sidebarItems']
}
</script>

<style lang="stylus">
@require '../styles/wrapper.styl';

.page {
  padding-bottom: 2rem;
  display: block;
}

.news-page {
  .theme-default-content {
    padding: 2rem 1.5rem;
  }
}

.news-back {
  background: url('/vuepress-image/news.png');
  height: 12vw;
  background-size: cover;
}
</style>
