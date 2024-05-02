<script setup lang="ts">
import { isCollapse } from './isCollapse';
</script>

<template>
  <el-aside>
    <el-scrollbar>
      <!-- 菜单 ：icon标签后面需要加一个span标签，否则折叠会没有效果-->
      <el-menu router unique-opened :collapse="isCollapse">
        <a href="/" class="logo">
          <img src="@/assets/校标.svg" alt="">
          <h1 v-show="!isCollapse">管理平台</h1>
        </a>
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <IEpFiles />
            </el-icon> <span>项目管理</span>
          </template>
          <el-menu-item index="/pro-apply">
            <el-icon>
              <IEpDocumentAdd />
            </el-icon> <span>申报项目</span>
          </el-menu-item>
          <el-menu-item index="/pro-auditing">
            <el-icon>
              <IEpFolderChecked />
            </el-icon> <span>项目列表</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <IEpCoin />
            </el-icon> <span>经费管理</span>
          </template>
          <el-menu-item index="/fund-apply">
            <el-icon>
              <IEpFirstAidKit />
            </el-icon> <span>申请经费</span>
          </el-menu-item>
          <el-menu-item index="/fund-auditing">
            <el-icon>
              <IEpWallet />
            </el-icon> <span>经费库</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <!-- title：具名插槽 -->
          <template #title>
            <el-icon>
              <IEpGoldMedal />
            </el-icon> <span>成果管理</span>
          </template>
          <el-menu-item index="/res-enroll">
            <el-icon>
              <IEpBox />
            </el-icon> <span>申请成果</span>
          </el-menu-item>
          <el-menu-item index="/res-auditing">
            <el-icon>
              <IEpTrophyBase />
            </el-icon> <span>成果列表</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>
            <el-icon>
              <IEpOperation />
            </el-icon> <span>系统管理</span>
          </template>
          <el-menu-item index="/user-roles">
            <el-icon>
              <IEpVideoCamera />
            </el-icon> <span>角色管理</span>
          </el-menu-item>
          <el-menu-item index="/user-power">
            <el-icon>
              <IEpUser />
            </el-icon> <span>用户管理</span>
          </el-menu-item>
        </el-sub-menu>




      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<style scoped lang="scss">
.el-aside {
  background-color: #e9e9eb;
  height: 100vh;
  width: auto;
}

.el-menu {
  width: 200px;
  border-right: none;
  background-color: #e9e9eb;
  white-space: nowrap;

  &.el-menu--collapse {
    width: 60px;

    & h1 {
      display: none;
    }
  }

}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: black;
  height: 60px;

  & img {
    width: 60px;
    height: 60px;
  }

  & h1 {
    padding: 20px 5px;
    font-size: 22px;
  }
}
</style>
