<template>
  <div class="logo"
       :class="isCollapse?'is-collapse-logo':''">
    <router-link to="/"
                 tag="span">
      <transition name="fade">
        <span v-if="isCollapse"
              class="logo_title is-bold "
              key="0"
              :class="{'is-text':!type,'is-img':type}">
          <template v-if="type">
            <img :src="website.logo"
                 width="40"
                 height="40" />
          </template>
          <template v-else>
            {{website.logo}}
          </template>
        </span>
      </transition>
      <transition-group name="fade">
        <template v-if="!isCollapse">
          <span key="1"
                class="logoNormal">
            <img :src="logoImg"
                 class="logoImg" />
            <span class="logo_title is-bold"
                  v-if="tenantShortName">{{website.author}}</span>
          </span>
        </template>
      </transition-group>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import logoImg from '@/assets/img/logo.png'
export default {
  name: 'logo',
  data() {
    return {
      logoImg: logoImg
    }
  },
  props: ['isCollapse'],
  created() {
  },
  computed: {
    ...mapGetters(['website']),
    ...mapGetters(['tenantShortName']),
    type: function(val) {
      return this.website.logo.indexOf('static') !== -1
    }
  },
  methods: {}
}
</script>
<style scoped="scoped" lang="scss">
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-active {
  transition: opacity 2.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 203px;
  transition: width 0.6s;
  height: 90px;
  line-height: 90px;
  background: #313c44;
  color: #fdfdfd;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  overflow: hidden;
  box-sizing: border-box;
  position: absolute;
  z-index: 2;
  cursor: pointer;
}

.logo_title {
  padding: 0 5px 0 0;
  font-size: 28px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(173, 184, 237, 1);
  line-height: 9px;
}

.is-text {
  position: absolute;
  top: 46px;
  left: 10px;
}

.is-img {
  position: absolute;
  top: 10px;
  left: 10px;
}

.logo_subtitle {
  font-size: 16px;
  padding-top: 5px;
}
.logoImg {
  margin-top: 45px;
  width: 33px;
  height: 38px;
  padding-left: 8px;
  padding-right: 8px;
  vertical-align: sub;
}
.is-collapse-logo {
  width: 64px;
  transition: width 0s;
}
</style>
