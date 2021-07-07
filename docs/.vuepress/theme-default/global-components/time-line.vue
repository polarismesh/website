<template>
  <ClientOnly>
    <b-row class="timeline-item">
      <b-col cols="2" class="timeline-intro">
        <div style="float:right;">
          <p class="timeline-badge">{{this.version}}</p>
          <div class="dash-line"></div>
        </div>
        <p class="timeline-time">发布于 {{this.time}}</p>
      </b-col>
      <b-col cols="10">
        <b-card :title="this.version" class="mb-2 timeline-body">
          <b-card-text>{{this.introText}}</b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </ClientOnly>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

export default {
  name:"time-line",
  components: {},
    props: ["time","version","introText"],
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
</style>
