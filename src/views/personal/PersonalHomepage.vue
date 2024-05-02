<script setup lang="ts">
import { UserList, getUserMenu } from "../../api/users"
//获取用户信息详情
const userInfo = ref([] as UserList[])
const getUserInfo = async () => {
    const { data } = await getUserMenu();
}

const baseMsg = [
    { label: "用户名称:", value: "向建南" },
    { label: "用户id:", value: "1" },
    { label: "性别:", value: "女" },
    { label: "出生日期:", value: "2024-09-03" },
    { label: "手机号:", value: "17734371291" },
    { label: "个人简介:", value: "关关难过关关过，步步难行步步行！" },
]

const educateMsg = [
    { label: "学院名称:", value: "信息工程学院" },
    { label: "专业:", value: "物联网工程" },
    { label: "学历:", value: "本科" },
]
</script>

<template>
    <div class="main-container">
        <el-card style="min-width: 480px; margin-bottom: 10px;">
            <div class="user-hander">
                <div class="user-img">
                    <img src="../../assets/img/portrait.jpg" alt="">
                </div>
                <div class="user-content">
                    <div class="user-name" style="font-size: 24px;">向建南</div>
                    <span>个人简介: 关关难过关关过，步步难行步步行！</span>
                    <div class="user-btn">
                        <el-button round color="#ccc">编辑信息</el-button>
                        <el-button round color="#ccc">修改密码</el-button>
                    </div>
                </div>
            </div>
        </el-card>

        <el-card style="min-width: 480px; margin-bottom: 10px;">
            <div class="main-title">基本信息</div>

            <el-row class="main-content" v-for="(item, index) in baseMsg" :key="index" type="flex" justify="space-between"
                align="middle">
                <el-col :span="2">
                    <span class="info-label">{{ item.label }}</span>
                </el-col>
                <el-col :span="21">
                    <span class="info-value">{{ item.value }}</span>
                </el-col>
            </el-row>

        </el-card>
        <el-card style="min-width: 480px; margin-bottom: 10px;">
            <div class="main-title">教育信息</div>
            <el-row class="main-content" v-for="(item, index) in educateMsg" :key="index" type="flex"
                justify="space-between" align="middle">
                <el-col :span="2">
                    <span class="info-label">{{ item.label }}</span>
                </el-col>
                <el-col :span="21">
                    <span class="info-value">{{ item.value }}</span>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<style scoped lang="scss">
.main-container {
    width: 960px;
    margin-left: 15%;
    border-radius: 15px;
    background-color: #fff;

    .user-hander {
        display: flex;

        .user-img {
            width: 150px;
            height: 150px;
            display: flex;
            justify-content: space-around;
            align-items: center;

            img {
                width: 100%;
                border-radius: 50%;
            }
        }

        .user-content {
            flex: 1;
            margin-left: 20px;

            .user-name {
                margin: 10px 0;
            }

            .user-btn {
                margin-top: 20px;
            }
        }
    }

    .main-title {
        font-size: 20px;
        font-weight: 900;
        padding-bottom: 8px;
        border-bottom: 1px solid #ddd;
    }

    .main-content {
        color: #444;
        padding: 15px 0;
        padding-left: 10px;

        .info-label {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            /* 标签靠右对齐 */
            width: 100px;
            padding-right: 10px;
            text-align: justify;
        }

        .info-value {}
    }
}
</style>
