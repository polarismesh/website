<template>
  <div class="wrap-container wrap-navbar-background" :style="style">
    <b-navbar
      toggleable="lg"
      type="dark"
      sticky
      :style="style"
      class="navbar-background"
    >
      <b-navbar-brand href="/">
        <img
          src="../assets/image/logo-polaris.png"
          class="d-inline-block align-top"
          alt="Polaris"
          style="height: 30px"
        />
      </b-navbar-brand>
      <b-navbar-toggle
        target="nav-collapse"
        class="navbar-toggle-btn"
      ></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto nav-dropdown-list">
          <b-nav-item href="/" class="navlink">首页</b-nav-item>
          <!-- <b-nav-item :href="`${language}/news/`" class="navlink"
            >新闻</b-nav-item
          > -->
          <b-nav-item :href="`/project`" class="navlink">项目</b-nav-item>
          <b-nav-item
            :href="`${language}/doc/简介/北极星是什么.html#北极星是什么`"
            class="navlink"
            >文档</b-nav-item
          >
          <b-nav-item
            href="https://github.com/PolarisMesh"
            target="_Blank"
            class="navlink"
            >Github</b-nav-item
          >
          <b-nav-item
            href="http://14.116.241.63:8080/"
            target="_blank"
            class="navlink"
            >体验版</b-nav-item
          >
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      style: {},
      opacity: 0,
      language: window.localStorage.getItem("language") || "zh",
    };
  },
  mounted() {
    window.addEventListener("scroll", this.windowScroll); //监听页面滚动
    this.style = {
      background: `rgba(14, 17, 36, ${this.opacity})`,
      "z-index": 1020,
    };
  },
  methods: {
    windowScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      this.opacity = Math.abs(Math.round(scrollTop)) / 250;
      this.style = {
        background: `rgba(14, 17, 36, ${this.opacity})`,
        "z-index": 1020,
      };
      console.log(scrollTop);
    },
  },
  destroyed() {
    window.removeEventListener("scroll", this.windowScroll); //销毁滚动事件
  },
};
</script>
<style>
.navbar-background {
  background-color: rgba(14, 17, 36, 0);
  width: 70vw;
}
.wrap-navbar-background,
.navbar-bone {
  padding: 0 15vw;
  background-color: rgba(14, 17, 36, 0);
  position: fixed;
  height: 56px;
}
.navbar-toggle-btn {
  outline: none;
  border: none;
  box-shadow: none;
}
.nav-dropdown-list {
}
</style>
