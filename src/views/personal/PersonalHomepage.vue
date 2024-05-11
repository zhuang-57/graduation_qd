<script setup lang="ts">
import { reactive } from 'vue'
import { getInfo, getUserInfoList, getUpdateUserInfo, PwdCondition, getUpdateUserPwd } from "../../api/users"
import { FormInstance, FormRules } from 'element-plus';
import { timeDayFormatter } from "../../utils/timeFormatter"
import { useUserStore } from "../../stores/users"
import router from "../../router/index"

const userStore = useUserStore()
//获取用户信息详情
const userInfo = reactive<getUserInfoList>({
    academyId: 1,
    birthday: '',
    educational: '',
    id: 1,
    img: '',
    major: '',
    password: '',
    phone: '',
    remark: '',
    roleId: 1,
    roleName: '',
    username: '',
    sex: '',
})

//密码规则
const userPwdRules = reactive<FormRules>({
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' }
    ],
    againPassword: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' }
    ],
})

//获取个人用户信息
const getUserInfo = async () => {
    const { data } = await getInfo();
    if (data.code === 0) {
        Object.assign(userInfo, data.data);
    }
}
getUserInfo()

//获取头像
const getHeadImg = computed(() => {
    if (userInfo.img) {
        return userInfo.img
    } else {
        return userInfo.username.charAt(userInfo.username.length - 1)
    }
})

//编辑头像
const ImgVisible = ref(false)
const handleFileSuccess = (response, file, fileList) => {
    if (response.code === 0) {
        userInfo.img = response.data.fileUrl;
    } else {
        ElMessage.error("文件上传失败！")
        return new Error("文件上传失败！")
    }
}

const onImgSubmit = async () => {
    if (!userInfo?.img) return
    const { data } = await getUpdateUserInfo(userInfo).finally(() => {
        ImgVisible.value = false
    })
    if (data.code === 0) {
        ElMessage.success("图片修改成功！")
    } else {
        ElMessage.error(data.msg)
    }
}

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
    await userPwdForm.validate((valid, fields) => {
        if (valid) {
            getUpdateUserPwd(userUpdatePwdList).then((res) => {
                if (res.data.code === 0) {
                    ElMessage.success("用户密码修改成功，请重新登录！")
                    router.push({ name: "Login" })
                }
            }).finally(() => {
                updatePwdVisible.value = false
            })
        }
    }).catch((err) => {
        ElMessage.error("信息没有填写完整！")
        return new Promise(() => { })
    })
}

//图片上传
const beforeImageUpload = (rawFile) => {
    if (rawFile.size / 1024 / 1024 > 10) {
        ElMessage.error("单张图片大小不能超过10MB!");
        return false;
    }
    return true;
}
</script>

<template>
    <div class="main-container">
        <el-card style="min-width: 480px; margin-bottom: 10px;">
            <div class="user-hander">
                <div class="user-img">
                    <el-avatar :src="getHeadImg" class="custom-avatar">{{ getHeadImg }}</el-avatar>
                </div>
                <div class="user-content">
                    <div class="user-name" style="font-size: 24px;">{{ userInfo.username }}</div>
                    <span>个人简介: {{ userInfo.remark === null ? "未填写" : userInfo.remark }}</span>
                    <div class="user-btn">
                        <el-button round color="#ccc" @click="ImgVisible = true">编辑头像</el-button>
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
                        <div>{{ userStore.academyInfo?.[userInfo.academyId - 1]?.acadName }}</div>
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
        <el-dialog v-model="updateVisible" title="编辑用户信息" width="780">
            <el-form ref="userRef" :model="userInfo" :inline="true" label-width="80px" class="demo-form-inline">
                <el-form-item label="用户名:" prop="username">
                    <el-input v-model="userInfo.username"></el-input>
                </el-form-item>
                <el-form-item label="用户id:" prop="id">
                    <el-input v-model="userInfo.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="性别:" prop="sex" style="width: 330px;">
                    <el-radio-group v-model="userInfo.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday">
                    <el-date-picker style="width: 250px;" type="date" placeholder="请选择日期"
                        v-model="userInfo.birthday"></el-date-picker>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="userInfo.phone"></el-input>
                </el-form-item>
                <el-form-item label="个人简介" prop="remark">
                    <el-input v-model="userInfo.remark" type="textarea" style="width: 250px;"></el-input>
                </el-form-item>
                <el-form-item label="学历:" prop="educational">
                    <el-select v-model="userInfo.educational" placeholder="请选择">
                        <el-option label="小学" value="小学" />
                        <el-option label="初学" value="初学" />
                        <el-option label="高中" value="高中" />
                        <el-option label="大专" value="大专" />
                        <el-option label="大学本科" value="大学本科" />
                        <el-option label="研究生" value="研究生" />
                        <el-option label="博士" value="博士" />
                    </el-select>
                </el-form-item>
                <el-form-item label="专业:" prop="major">
                    <el-input v-model="userInfo.major"></el-input>
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
            <el-form ref="userPwdRef" :rules="userPwdRules" :model="userUpdatePwdList" label-width="100px"
                class="pro-apply-from">
                <el-form-item label="旧密码:" prop="password">
                    <el-input v-model="userUpdatePwdList.password" type="password" show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码:" prop="newPassword">
                    <el-input v-model="userUpdatePwdList.newPassword" type="password" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认新密码:" prop="againPassword">
                    <el-input v-model="userUpdatePwdList.againPassword" type="password" show-password></el-input>
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
        <!-- 编辑头像 -->
        <el-dialog v-model="ImgVisible">
            <el-upload class="avatar-upload" action="http://127.0.0.1:5173/api/file/uploadFile" :show-file-list="false"
                :on-success="handleFileSuccess" :before-upload="beforeImageUpload" list-type="picture" accept="image/*">
                <el-image v-if="userInfo.img" :src="userInfo.img" fit="cover" class="img-background"></el-image>
                <div v-else class="img-background">
                    <el-icon class="el-icon--upload">
                        <IEpUploadFilled />
                    </el-icon>
                </div>
                <template #tip>
                    <div class="el-upload__tip">只能上传图片,且单张图片大小不能超过10MB</div>
                </template>
            </el-upload>
            <!-- <el-upload v-model="userInfo.img" class="upload-demo" drag :on-success="handleFileSuccess"
                action="http://127.0.0.1:5173/api/file/uploadFile" multiple aria-required="true">
                <el-icon class="el-icon--upload">
                    <IEpUploadFilled />
                </el-icon>
                <div>点击上传图片</div>
                <template #tip>
                    <div> jpg/png文件小于500kb</div>
                </template>
            </el-upload> -->
            <template #footer>
                <div>
                    <el-button @click="ImgVisible = false">取消</el-button>
                    <el-button type="primary" @click="onImgSubmit">
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

            .el-avatar {
                width: 100%;
                height: 100%;
                background-color: #000;
                font-size: 80px;
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

    .demo-form-inline .el-input {
        --el-input-width: 250px;
    }

    .demo-form-inline .el-select {
        --el-select-width: 250px;
    }
}

.avatar-upload {

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .img-background {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 300px;
        height: 300px;
        border-radius: 10px;
        border: 1px dashed #444;

        .el-icon--upload {
            font-size: 100px;
        }
    }


}
</style>
