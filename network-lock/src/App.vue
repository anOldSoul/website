<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {}
  },
  created: function () {
    // 每次进入app check 用户是否登录
    // const _this = this;
  },
  computed: {
  },
  mounted: function () {

  }
}
</script>

<style>

* {
  font-family:
  -apple-system,            /* Safari on MacOS X and iOS */
  BlinkMacSystemFont,       /* Chrome on MacOS X */

  /*English First*/
  "Helvetica Neue",         /* Old OSX Capitan */
  "Segoe UI",               /* Windows and Windows Phone */
  "Roboto",                 /* Android and newer Chrome OS */
  "Oxygen",                 /* Linux KDE Desktop */
  "Ubuntu",                 /* Linux Ubuntu System */
  "Cantarell",              /* Linux GNOME Desktop */
  "Fira Sans",              /* Firefox OS */
  "Droid Sans",             /* Android */

  /*Chinese Fallback*/
  "PingFang SC",            /* OSX ^10.11 & iOS ^9  苹方丽黑 */
  "Hiragino Sans GB",       /* OSX ^10.6            冬青黑体 */
  "STHeiti",                /* OSX <10.6  & iOS <9  华文黑体 */
  "Microsoft YaHei",        /* Win                  微软雅黑 */
  "Microsoft JhengHei",     /* Win                  微软正黑 */
  "Source Han Sans SC",     /* Android 5.0^         思源黑体 */
  "Noto Sans CJK SC",       /* Android 5.0^         思源黑体 */
  "Source Han Sans CN",     /* Android 5.0^         思源黑体 */
  "Noto Sans SC",           /* Android 5.0^         思源黑体 */
  "Source Han Sans TC",     /* Android 5.0^         思源黑体 */
  "Noto Sans CJK TC",       /* Android 5.0^         思源黑体 */
  "WenQuanYi Micro Hei",    /* Linux             文泉驿微米黑 */
  SimSun,                   /* Win old              中易宋体 */
  sans-serif!important;               /* System Fallback              */
}
#app {
  height: 100%;
}
</style>
