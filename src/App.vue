<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
html,body{
  height: 100%;
  padding: 0;
  margin: 0;
}
h1{
  padding: 0;
  margin: 0;
  background-color:#002140;
  line-height: 60px;
}
.content{
  height: 100%;
}
.el-container .is-vertical{
    background-color: #f0f2f5;
}
.content-wrap{
  height: 90%;
}
#app {
  font-family: Arial,Helvetica,sans-serif;
  height: 100%;
  color: #fff!important;
  &>div{
    height: 100%;
  }
  // .login_box {
  //   position: absolute;
  //   width: 770px;
  //   height: 440px;
  //   background-image: url(../src/assets/image/box.png);
  //   background-size: 100% 100%;
  //   top: calc(50% - 220px);
  //   left: calc(50% - 385px);
  // }
  .el-table{
      height:90%;
      overflow:auto;
  }
  .content{
    overflow:auto;
  }
  .allcontent{
      height:90%;
      width: auto
  }

}
</style>
