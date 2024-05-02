<script setup lang="ts">
</script>

<template>
  <h1>欢迎来到:</h1>

  <div class="main-title">
    <div class="title">高校科研项目管理系统！</div>
  </div>
</template>

<style scoped lang="scss">
h1 {
  font-size: 40px;
  margin: 100px;
}

.main-title {
  display: flex;
  justify-content: center;
  align-items: center;

  .title {
    color: #000;
    position: relative;
    font-weight: 900;
    font-size: 70px;
    // margin: 100px 200px;
    z-index: 1;
  }

  .title::after {
    content: "高校科研项目管理系统！";
    position: absolute;
    left: 0;
    color: #000;
    transform: translate(-21px, 13px) scaleY(0.5) skew(50deg);
    z-index: -1;
    filter: blur(5px);
    -webkit-mask: linear-gradirnt(transparent, #000);
  }
}
</style>
