

<template>
  <div class="pull-height animated"
       :class="{'zoomOutUp': isLock}">
    <div class="index">
      <sidebar class="left"></sidebar>
      <div class="right">
        <div class="nav">
          <top class="top"></top>
          <!-- <tags></tags> -->
        </div>
        <div class="main">
          <div :style="{ background: $route.meta.isIndex ? '#f1f4f5': '#fff' }" class="router">
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import tags from './tags'
import top from './top/'
import sidebar from './sidebar/'
export default {
  components: {
    top,
    tags,
    sidebar
  },
  name: 'index',
  data() {
    return {
    }
  },
  created() { },
  mounted() { },
  computed: mapGetters(['isLock']),
  props: [],
  methods: {}
}
</script>

<style lang="scss" scoped>
.index {
  display: flex;
  position: relative;
  height: 100%;
  background: #fff;
  overflow: hidden;
  .left {
    width: 205px;
    overflow-x: auto;
  }
  .right {
    padding-top: 56px;
    position: relative;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    flex: 1;
  }
  .main {
    height: 100%;
    background: #f1f4f5;
    padding: 15px;
    box-sizing: border-box;
    overflow-y: scroll;
    .router {
      padding: 15px 8px;
      background: #fff;
      min-height: 100%;
      height: auto;
      overflow: hidden;
      border-radius: 5px;
      box-sizing: border-box;
    }
  }
  .nav {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }
  .top {
    margin-bottom: 2px;
    // background-color: #7b9ef3;
    background: linear-gradient(to right, #7caff6, #7a8ff0);
  }
}
</style>
