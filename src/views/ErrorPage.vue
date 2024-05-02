<script setup lang="ts">

</script>

<template>
    <div class="main-title">
        <div class="img-404">
            <img src="../assets/404.png" alt="">
        </div>
        <div class="main-text">
            <div class="title">页面不存在</div>
            <span>抱歉！我们找不到您想访问的页面...</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.main-title {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100vh;
    background-color: #e9e9eb;

    .img-404 {
        width: 700px;

        img {
            width: 50%;
            margin-left: 370px;
        }
    }

    .main-text {
        width: 700px;

        .title {
            color: #000;
            font-size: 24px;
            margin-bottom: 10px;
        }
    }



}
</style>
