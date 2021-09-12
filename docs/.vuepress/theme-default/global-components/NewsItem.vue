<template>
  <ClientOnly>
    <b-card class="news-item">
      <b-card-title>
        <router-link :to="`/${language}/news/${this.fileName}`" class="card-link">{{this.title}}</router-link>
      </b-card-title>
      <b-card-sub-title>发布于{{this.time}}</b-card-sub-title>
      <b-card-text style="margin-top:30px">{{this.introText}}</b-card-text>
      <router-link :to="`/${language}/news/${this.fileName}`" class="card-link">阅读更多</router-link>
    </b-card>
  </ClientOnly>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

export default {
  name:"time-line",
  components: {},
    props: ["time","title","introText","fileName"],
    data() {
    return {
      language: "",
    };
  },
  watch: {
    $route(to, from) {
      this.language = window.localStorage.getItem("language") || "zh";
    },
  },
  mounted() {
    this.language = window.localStorage.getItem("language") || "zh";
  },
};
</script>

<style lang="stylus">
.timeline-item {
  margin-bottom: 30px;

  .card-title {
    margin-bottom: 12px;
  }
}

.timeline-intro {
  margin-top: 30px;
}

.timeline-time {
  width: 119px;
  height: 20px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #888888;
  letter-spacing: 0;
  font-weight: 400;
  float: left;
}

.timeline-body {
  background: #f8f8f8;
  padding: calc(1.5vw - 25px) 2vw;
  border: 0px;
  border-radius: 0px;
}

.dash-line {
  width: 5vw;
  height: 1px;
  border: 1px dashed #b1bbcd;
  margin: 11px 0.35vw;
  vertical-align: middle;
  display: inline-block;
}

.timeline-badge {
  display: inline-block;
  width: 60px;
  height: 24px;
  background: #014fdb;
  border-radius: 12px;
  text-align: center;
  vertical-align: middle;
  color: #fff;
  margin-bottom: 0px;
  line-height: 24px;
}

.news-item {
  border: none;

  .card-body {
    padding: 0;
  }
}
</style>
