<script setup lang="ts">
import { reactive } from 'vue'
import { getInfo, getUserInfoList, getUpdateUserInfo, PwdCondition, getUpdateUserPwd } from "../../api/users"
import { FormInstance } from 'element-plus';
import { timeDayFormatter } from "../../utils/timeFormatter"
import router from "../../router/index"
//获取用户信息详情
const userInfo = reactive<getUserInfoList>({
    academyId: 1,
    birthday: '未填写',
    educational: '未填写',
    id: 1,
    img: '',
    major: '未填写',
    password: '',
    phone: '未填写',
    remark: '未填写',
    roleId: 1,
    roleName: '',
    username: '',
    sex: '',
})


const getUserInfo = async () => {
    const { data } = await getInfo();
    if (data.code === 0) {
        Object.assign(userInfo, data.data);
    }
}
getUserInfo()

//编辑信息
const updateVisible = ref(false)
const userRef = ref<FormInstance>()
const onSubmit = async (userForm: FormInstance | undefined) => {
    if (!userForm) return
    await userForm.validate().catch((err) => {
        ElMessage.error("编辑信息有误！")
        throw err;
    })
    const { data } = await getUpdateUserInfo(userInfo).finally(() => {
        updateVisible.value = false
    })
    if (data.code === 0) {
        getUserInfo()
    } else {
        ElMessage.error("更新个人信息失败！");
        throw new Error("更新个人信息失败！")
    }
}

//修改用户密码
const updatePwdVisible = ref(false)
const userPwdRef = ref<FormInstance>()
const userUpdatePwdList = reactive<PwdCondition>({
    password: '',
    newPassword: '',
    againPassword: ''
})
const updateUserPwd = async (userPwdForm: FormInstance | undefined) => {
    if (!userPwdForm) return
    userPwdForm.validate().catch((err) => {
        ElMessage.error("信息没有填写完整！")
        throw err
    })
    const { data } = await getUpdateUserPwd(userUpdatePwdList).finally(() => {
        updatePwdVisible.value = false
    })
    if (data.code === 0) {
        ElMessage.success("用户密码修改成功，请重新登录！")
        router.push({ name: "Login" })
    }
}
</script>

<template>
    <div class="main-container">
        <el-card style="min-width: 480px; margin-bottom: 10px;">
            <div class="user-hander">
                <div class="user-img">
                    <img src="../../assets/img/portrait.jpg" alt="">
                </div>
                <div class="user-content">
                    <div class="user-name" style="font-size: 24px;">{{ userInfo.username }}</div>
                    <span>个人简介: {{ userInfo.remark === null ? "未填写" : userInfo.remark }}</span>
                    <div class="user-btn">
                        <el-button round color="#ccc" @click="updateVisible = true">编辑信息</el-button>
                        <el-button round color="#ccc" @click="updatePwdVisible = true">修改密码</el-button>
                    </div>
                </div>
            </div>
        </el-card>

        <el-card style="min-width: 480px; margin-bottom: 10px;">
            <div class="main-title">基本信息</div>
            <div class="main-content">
                <ul>
                    <li class="info-item">
                        <div class="info-label">
                            <span>用</span>
                            <span>户</span>
                            <span>名</span>
                            <span>称：</span>
                        </div>
                        <div>{{ userInfo.username }}</div>
                        <!-- <div class="icon-edit">
                            <div class="icon-span">
                                <el-icon>
                                    <IEpEdit />
                                </el-icon>
                                <span>编辑</span>
                            </div>
                        </div> -->
                    </li>
                    <li class="info-item">
                        <div class="info-label">
                            <span>用</span>
                            <span>户</span>
                            <span>id：</span>
                        </div>
                        <div>{{ userInfo.id }}</div>
                    </li>
                    <li class="info-item">
                        <div class="info-label">
                            <span>性</span>
                            <span>别：</span>
                        </div>
                        <div>{{ userInfo.sex === null ? "未填写" : userInfo.sex }}</div>
                    </li>
                    <li class="info-item">
                        <div class="info-label">
                            <span>出</span>
                            <span>生</span>
                            <span>日</span>
                            <span>期：</span>
                        </div>
                        <div>{{ userInfo.birthday === null ? "未填写" : timeDayFormatter(undefined, undefined,
                            userInfo.birthday) }}</div>
                    </li>
                    <li class="info-item">
                        <div class="info-label">
                            <span>手</span>
                            <span>机</span>
                            <span>号：</span>
                        </div>
                        <div>{{ userInfo.phone === null ? "未填写" : userInfo.phone }}</div>
                    </li>
                    <li class="info-item">
                        <div class="info-label">
                            <span>个</span>
                            <span>人</span>
                            <span>简</span>
                            <span>介：</span>
                        </div>
                        <div>{{ userInfo.remark === null ? "未填写" : userInfo.remark }}</div>
                    </li>

                </ul>
            </div>

        </el-card>
        <el-card style="min-width: 480px; margin-bottom: 10px;">
            <div class="main-title">教育信息</div>
            <div class="main-content">
                <ul>
                    <li class="info-item">
                        <div class="info-label">
                            <span>学</span>
                            <span>院</span>
                            <span>名</span>
                            <span>称：</span>
                        </div>
                        <div>{{ userInfo.academyId }}</div>
                    </li>
                    <li class="info-item">
                        <div class="info-label">
                            <span>专</span>
                            <span>业：</span>
                        </div>
                        <div>{{ userInfo.major === null ? "未填写" : userInfo.major }}</div>
                    </li>
                    <li class="info-item">
                        <div class="info-label">
                            <span>学</span>
                            <span>历：</span>
                        </div>
                        <div>{{ userInfo.educational === null ? "未填写" : userInfo.educational }}</div>
                    </li>
                </ul>
            </div>

        </el-card>

        <!-- 编辑信息 -->
        <el-dialog v-model="updateVisible" title="编辑用户信息" min-width="500">
            <el-form ref="userRef" :model="userInfo" :inline="true" label-width="100px" class="pro-apply-from">
                <el-form-item label="用户名:" prop="username">
                    <el-input v-model="userInfo.username"></el-input>
                </el-form-item>
                <el-form-item label="用户id:" prop="id">
                    <el-input v-model="userInfo.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="性别:" prop="sex">
                    <el-input v-model="userInfo.sex"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday">
                    <el-date-picker type="date" placeholder="请选择日期" v-model="userInfo.birthday"></el-date-picker>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="userInfo.phone"></el-input>
                </el-form-item>
                <el-form-item label="个人简介" prop="remark">
                    <el-input v-model="userInfo.remark" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="updateVisible = false">取消</el-button>
                    <el-button type="primary" @click="onSubmit(userRef)">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 编辑用户密码 -->
        <el-dialog class="dialog-css" v-model="updatePwdVisible" title="修改用户密码" width="450">
            <el-form ref="userPwdRef" :model="userUpdatePwdList" label-width="100px" class="pro-apply-from">
                <el-form-item label="旧密码:" prop="password">
                    <el-input v-model="userUpdatePwdList.password" type="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码:" prop="newPassword">
                    <el-input v-model="userUpdatePwdList.newPassword" type="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码:" prop="againPassword">
                    <el-input v-model="userUpdatePwdList.againPassword" type="password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="updatePwdVisible = false">取消</el-button>
                    <el-button type="primary" @click="updateUserPwd(userPwdRef)">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>

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
            display: -webkit-flex;
            justify-content: space-between;
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

    .main-content ul {
        color: #444;
        padding: 15px 0;
        padding-left: 10px;

        .info-item {
            display: flex;
            position: relative;
            line-height: 24px;
            margin-bottom: 20px;
            -webkit-box-align: baseline;
            align-items: baseline;
        }

        .info-label {
            width: 100px;
            margin-right: 10px;
            flex-shrink: 0;
            padding-left: 10px;
            display: flex;
            box-sizing: content-box;
            -webkit-box-pack: justify;
            justify-content: space-between;
        }

        // .icon-edit {
        //     z-index: 1000;
        //     width: 80px;
        //     visibility: hidden;
        //     margin-left: 10px;
        //     background-color: red;
        //     cursor: pointer;
        //     -webkit-box-align: baseline;
        //     align-items: baseline;
        //     position: absolute;
        //     right: 0;

        //     .icon-span {
        //         display: flex;
        //         align-items: center;
        //     }
        // }

        // .icon-edit:hover {
        //     visibility: visible;
        //     color: #409eff;
        // }
    }

    .dialog-css {
        padding: 0;
    }

}
</style>
