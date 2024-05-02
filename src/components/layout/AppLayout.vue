<script setup lang="ts">
import AppAside from './AppAside.vue'
import AppHeader from './AppHeader.vue';
</script>

<template>
  <div class="common-layout">
    <el-container>
      <AppAside />
      <el-container class="header-and-main">
        <AppHeader />
        <el-main>
          <el-scrollbar>
            <RouterView />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.header-and-main {
  flex-direction: column;
  height: 100vh;

}

.el-main {
  width: 100%;
  background-color: rgb(239, 239, 239);

  .img-main {
    position: fixed;
    top: 0;
    width: 100%;
  }

}
</style>
