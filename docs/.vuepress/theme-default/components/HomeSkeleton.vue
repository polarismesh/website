<template>
  <div style="width: 100%; position: absolute; top: 0px; left: 0px">
    <div class="navbar-skeleton"></div>
    <div>
      <img v-bind:src="bannerSrc" class="banner-info" />
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

export default {
  components: {},
  props: ["bannerSrc"],
};
</script>

<style>
.banner-info {
  width: 100vw;
  height: 11.5vw;
}
.navbar-skeleton {
  height: 56px;
  background-color: #030213;
}
</style>
