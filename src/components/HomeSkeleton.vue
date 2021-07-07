<template>
  <div class="home-skeleton">
    <div class="navbar-skeleton" :style="style"></div>
    <!-- <img src="../assets/image/banner.jpeg" class="banner-info" /> -->
    <div class="function-info responsive-function-info">
      <b-row align-v="start">
        <b-col align-self="center" class="skeleton-background-text">
          <h1 class="title-skeleton-text">CORE FUNCTION</h1>
        </b-col>
      </b-row>
    </div>
    <div class="topo-info responsive-topo-info"></div>
    <div class="feature-info feature-container">
      <b-row align-v="start">
        <b-col align-self="center" class="skeleton-background-text">
          <h1 class="title-skeleton-text">FEATURE OF PRODUCT</h1>
        </b-col>
      </b-row>
    </div>
    <div class="customer-case">
      <b-row align-v="start">
        <b-col align-self="center" class="skeleton-background-text">
          <h1 class="title-skeleton-text">CUSTOMER CASE</h1>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      style: {},
      opacity: 0,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.windowScroll); //监听页面滚动
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
      };
    },
  },
  destroyed() {
    window.removeEventListener("scroll", this.windowScroll); //销毁滚动事件
  },
};
</script>

<style>
.banner-info {
  width: 100vw;
  height: 37.5vw;
}
.function-info {
  background-color: #f2f3f5;
}
.title-skeleton-text {
  opacity: 0.1;
  font-family: MHeiSungPRC-UltraBold;
  font-size: 40px;
  color: #8f989d;
  letter-spacing: 0;
}
.topo-info {
  height: 33vw;
}
.feature-info {
  height: 48vw;
  background-color: #f2f3f5;
}
.skeleton-background-text {
  margin: 5.8vw 0 0 0;
  text-align: center;
  color: #8f989d;
}
.customer-case {
  height: 30vw;
}
.home-skeleton {
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  overflow-x: hidden;
}
.navbar-skeleton {
  background-color: rgba(14, 17, 36, 0);
  position: fixed;
  width: 100%;
  height: 56px;
}
</style>
