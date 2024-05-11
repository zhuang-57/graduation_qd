<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { isCollapse } from './isCollapse';
import { getInfo, logout, UserList, getAcademyList } from '../../api/users';
import { useRouter } from 'vue-router';
import { useTokenStore } from '../../stores/mytoken';
import { useUserStore } from "../../stores/users"
const router = useRouter()
const userInfo = ref<UserList>({ img: "", username: "" })

//获取用户登录信息
const getInfoLogin = async () => {
    const userStore = useUserStore()
    const { data } = await getInfo()
    if (data.code === 0) {
        userStore.loginSuccess(data.data)

        userInfo.value = data.data
    }
    else {
        ElMessage.error(data.msg)
        useTokenStore().saveToken("")
        router.push(
            { name: 'Login' }
        )
    }
    // 将学院进行集中管理
    await getAcademyList().then((res) => {
        if (res.data.code === 0) {
            userStore.AcademyList(res.data.data);
        } else {
            ElMessage.error(res.data.msg)
        }
    })

}
getInfoLogin()

//获取头像
const getHeadImg = computed(() => {
    if (userInfo.value.img) {
        return userInfo.value.img
    } else {
        return userInfo.value.username.charAt(userInfo.value.username.length - 1)
    }
})

//跳转到个人主页
const navigateToPersonalHomePage = () => {
    router.push({ name: "PersonalHomePage" })
}

const handleLogOut = async () => {
    //1.确认是否退出
    await ElMessageBox.confirm("确认要退出登录吗？", "退出询问", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
    }).catch(() => {
        return new Promise(() => { })
    })
    //2.执行退出
    await logout().catch(() => { })
    ElMessage.success("用户成功登出！")
    // 3.清空token，跳转到login页面
    useTokenStore().saveToken("")
    router.push(
        { name: 'Login' }
    )
}
</script>

<template>
    <el-header>
        <div class="handle-left">
            <!-- 图标 -->
            <el-icon @click="isCollapse = !isCollapse">
                <IEpExpand v-show="isCollapse" />
                <IEpFold v-show="!isCollapse" />
            </el-icon>
            <!-- 面包屑 -->
            <el-breadcrumb :separator-icon="ArrowRight">
                <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" :to="{ path: item.path }">{{
                    item.meta.title }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 下拉菜单 -->
        <div class="handle-right">
            <span class="user-text">Hi,{{ userInfo.username }} !</span>
            <el-dropdown>
                <span>
                    <el-avatar :src="getHeadImg" class="custom-avatar">{{ getHeadImg }}</el-avatar>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="navigateToPersonalHomePage">个人中心</el-dropdown-item>
                        <el-dropdown-item @click="handleLogOut">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-header>
</template>

<style scoped lang="scss">
.el-header {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    background-color: #dedfe0;

    .handle-left {
        display: flex;

        .el-breadcrumb {
            margin-left: 20px;
        }
    }


    .handle-right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 140px;

        .user-text {
            margin-right: 10px;
            // color: #999AAA;
            color: #000;

        }

        .el-dropdown {
            // margin-left: auto;

            .custom-avatar {
                font-size: 20px;
                font-weight: bold;
                background-color: #000;
            }

            // .custom-avatar:focus,
            // .custom-avatar:hover,
            // .custom-avatar:active {
            //     outline: none;
            //     box-shadow: none;
            // }
        }
    }
}
</style>
