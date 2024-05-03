<script setup lang="ts">
import { reactive } from 'vue';
import { FormInstance, FormRules } from 'element-plus';
import { User } from "@element-plus/icons-vue"

// 导入接口函数
import { login, LoginInfo, RegisterInfo, getAcademyList, register } from '../../api/users';

//导入savetoken
import { useTokenStore } from "../../stores/mytoken"
//路由跳转
import { useRouter, useRoute } from "vue-router"

//获取表单
const formRef = ref<FormInstance>()

const store = useTokenStore()
const router = useRouter()
const route = useRoute()

//登录注册按钮
const getRegister = ref(false);

//登录表格
const form = reactive<LoginInfo>({
    username: '向建南',
    password: '111111',
})

//注册表格
const registerForm = reactive<RegisterInfo>({
    username: '',
    password: '',
    academyId: 1,
})

// 防止多次重复点击按钮
const isLoading = ref(false);
//判断提交按钮是否可以点击
const isButtonEnabled = computed(() => {
    return !form.username || !form.password;
});

// const getView = computed(() => {
//     if()
// })

// 表单提交时进行校验
const onSubmit = async (formRef: FormInstance | undefined) => {
    if (!formRef) return
    isLoading.value = true;
    // 表单验证
    await formRef.validate().catch(err => {
        ElMessage.error('表单验证失败......');
        isLoading.value = false
        throw err
        //或者使用promise
        //return new Promise(() => {})
    })
    // 表单验证成功，对请求结果进行判断
    const data = await login(form).then((res) => {
        // 失败

        if (res.data.code !== 0) {
            ElMessage.error(res.data.msg);
            isLoading.value = false;
            throw new Error(res.data.msg);
        }
        // 成功
        return res.data.data;
    })
    //登录成功，保存token
    store.saveToken(data.token)

    isLoading.value = false;
    //如果有query参数，就跳转到参数代表的路由地址
    router.push((route.query.redirect as string) || "/")

}

const AcademyMenus = ref();

//获取学院列表数据
const AcademyList = async () => {
    const { data } = await getAcademyList();
    AcademyMenus.value = data.data
}

AcademyList()

//用户注册
const onRegister = async (formRef: FormInstance | undefined) => {
    if (!formRef) return
    isLoading.value = true;
    // 表单验证
    await formRef.validate((vaild, fields) => {
        if (vaild) {
            register(registerForm).then((res) => {
                if (res.data.code !== 0) {
                    ElMessage.error(res.data.msg);
                    isLoading.value = false;
                    throw new Error(res.data.msg);
                } else if (res.data.code === 0 && res.data.data) {
                    ElMessage.success("用户注册成功！");
                    getRegister.value = !getRegister
                    isLoading.value = false;

                }
            })
        }
    }).catch(err => {
        ElMessage.error('表单验证失败......');
        isLoading.value = false
        throw err
    })

}
const rules = reactive<FormRules>({
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 6, max: 18, message: '密码长度为6-18位', trigger: 'blur' }
    ]
})
</script>

<template>
    <div class="login">
        <div class="login-content">
            <p>天才不过是不断的思索，凡是有脑子的人，都有天才。 —— 莫泊桑</p>
            <p>当你还不能对自己说今天学到了什么东西时，你就不要去睡觉。 —— 利希顿堡</p>
            <p> 科学的每一项巨大成就，都是以大胆的幻想为出发点的。 —— 杜威</p>
            <p> 如果说我看得远，那是正因我站在巨人们的肩上。—— 牛顿</p>
            <p>不管怎么样，明天又是新的一天。 ——《飘》玛格丽特·米切尔</p>
            <p> 骏马要看它的前胸，人要看他的行动。 —— 维吾尔族</p>
        </div>

        <div v-if="!getRegister">
            <el-form :model="form" :rules="rules" ref="formRef" size="large">
                <h2 class="login-name">科研项目管理系统登录</h2>
                <el-form-item prop="username" class="base-input">
                    <el-input v-model="form.username" placeholder="用户名 (请输入真实姓名)" :suffix-icon="User" />
                </el-form-item>
                <el-form-item prop="password" class="base-input">
                    <el-input type="password" v-model="form.password" placeholder="密码" show-password>
                    </el-input>
                </el-form-item>
                <el-link style="margin-left: 180px;font-size: 12px;" type="primary"
                    @click="getRegister = !getRegister">没有注册？去注册</el-link>
                <el-form-item>
                    <el-button color="#FC5531" @click="onSubmit(formRef)" :loading="isLoading" :disabled="isButtonEnabled"
                        class="submit-btn">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div v-else>
            <el-form :model="registerForm" :rules="rules" ref="formRef" size="large">
                <h2 class="login-name">科研项目管理系统注册</h2>
                <el-form-item prop="username" class="base-input">
                    <el-input v-model="registerForm.username" placeholder="用户名 (请输入真实姓名)" :suffix-icon="User" />
                </el-form-item>
                <!-- todo: -->
                <el-form-item prop="academyId" class="base-input">
                    <el-select v-model="registerForm.academyId" placeholder="请选择所属学院" style="width: 330px">
                        <el-option v-for="item in AcademyMenus" :key="item.id" :label="item.acadName" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item prop="password" class="base-input">
                    <el-input type="password" v-model="registerForm.password" placeholder="密码" show-password />
                </el-form-item>
                <el-link style="margin-left: 200px;font-size: 12px;" type="primary"
                    @click="getRegister = !getRegister">已注册？去登录</el-link>
                <el-form-item>
                    <el-button color="#FC5531" @click="onRegister(formRef)" :loading="isLoading" :disabled="isButtonEnabled"
                        class="submit-btn">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style scoped lang="scss">
h2 {
    text-align: center;
}

.login {
    background: url("../../assets/img/head.jpg");
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    height: 100vh;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .login-content {
        // width: 350px;
        // height: 300px;
        color: #fff;

        font-size: 18px;

        p {
            margin: 15px 0;

        }
    }

    .el-form {
        width: 350px;
        padding: 30px;
        border-radius: 10px;
        background-color: #fff;

        .el-form-item {
            margin-top: 30px;
        }

        .login-name {
            color: #999AAA;
        }

        // .base-input .el-form__content .el-input .el-input--large .el-input__wrapper {
        //     color: #fff;
        //     background-color: #999AAA !important;
        // }

        .submit-btn {
            width: 100%;
            border-radius: 20px;
            color: #fff;
            font-size: 16px;
            margin-top: -20px;
            margin-bottom: -15px;
        }

    }

}
</style>
