<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ProjectApplyList, getApplyPro } from '../../api/project'
import router from "../../router/index"
import type { FormInstance, FormRules } from 'element-plus'

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<ProjectApplyList>({
    proName: '',
    level: '',
    type: '',
    teacherName: '',
    teacherPhone: '',
    academyId: null,
    member: '',
    startime: '',
    endtime: '',
    remark: '',
    link: '',
})

//结束时间迟于开始时间
const validateEndTime = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('结束时间不能为空'))
    } else if (ruleForm.startime && new Date(value) <= new Date(ruleForm.startime)) {
        callback(new Error('结束时间必须晚于开始时间'))
    } else {
        callback()
    }
}

const rules = reactive<FormRules<ProjectApplyList>>({
    proName: [
        { required: true, message: '请输入项目名称', trigger: 'blur' },
    ],
    level: [
        {
            required: true,
            message: '请输入项目级别',
            trigger: 'change',
        },
    ],
    type: [
        {
            required: true,
            message: '请输入项目类型',
            trigger: 'change',
        },
    ],
    teacherName: [
        { required: true, message: '请输入指导老师名称', trigger: 'blur' }
    ],
    teacherPhone: [
        { required: true, message: '请输入指导老师手机号', trigger: 'blur' },
        { len: 11, message: '手机号需要11位', trigger: 'blur' }
    ],
    startime: [
        {
            type: 'date',
            required: true,
            message: '请选择预期开始时间',
            trigger: 'change',
        },
    ],
    endtime: [
        {
            type: 'date',
            required: true,
            message: '请选择预期结束时间',
            trigger: 'change',
        },
        { validator: validateEndTime, trigger: 'change' }
    ],
    remark: [
        { required: true, message: '请填写项目描述', trigger: 'blur' },
    ],
    link: [
        { required: true, message: '请添加上传附件', trigger: 'blur' },
    ],
})



//文件上传
// const FileList = ref([]);

// const beforeUpload = (file) => {
//     const isListMaxSize = file.size / 1024 / 1024 < 10;
//     if (!isListMaxSize) {
//         ElMessage.error('文件上传大小不能超过10MB！');
//         return false;
//     }
//     return true;
// }

const handleFileSuccess = (response, file, fileList) => {
    if (response.code === 0) {
        ruleForm.link = response.data.fileUrl;
        console.log(ruleForm.link);

    } else {
        ElMessage.error("文件上传失败！")
        return new Error("文件上传失败！")
    }
}


//提交表单
// const submitForm = async (formList: FormInstance | undefined) => {
//     if (!formList) return
//     await formList.validate((valid, fields) => {
//         if (valid) {
//             var data = getApplyPro(ruleForm)
//             console.log(data);
//             if (data.code === 0) {
//                 ElMessage.success("申请项目成功！")
//                 router.push({ name: "ProAuditing" })
//             }
//         } else {
//             throw new Error(`申请失败！${fields}`)
//         }
//     })
// }

const submitForm = async (formList: FormInstance | undefined) => {
    if (!formList) return
    await formList.validate().catch((err) => {
        ElMessage.error("提交有误！")
        throw err
    })
    const { data } = await getApplyPro(ruleForm)
    if (data.code === 0) {
        ElMessage.success("申请项目成功！")
        router.push({ name: "ProAuditing" })
    }
}

//重置
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

//项目类型
const options = [
    { lable: "基础研究项目", value: "基础研究项目" },
    { lable: "应用研究项目", value: "应用研究项目" },
    { lable: "实验发展类项目", value: "实验发展类项目" },
]

</script>

<template>
    <div class="main-container">
        <div class="main-title">
            项目申报
        </div>
        <div class="content">
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto"
                status-icon>
                <el-form-item label="项目名称" prop="proName">
                    <el-input v-model="ruleForm.proName" />
                </el-form-item>
                <el-form-item label="项目级别" prop="level">
                    <el-select v-model="ruleForm.level" placeholder="请选择">
                        <el-option label="国家级" value="国家级" />
                        <el-option label="省级" value="省级" />
                        <el-option label="校级" value="校级" />
                    </el-select>
                </el-form-item>
                <el-form-item label="项目类型" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.lable" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="指导老师名称" prop="teacherName">
                    <el-input v-model="ruleForm.teacherName" />
                </el-form-item>
                <el-form-item label="指导老师手机号" prop="teacherPhone">
                    <el-input v-model="ruleForm.teacherPhone" />
                </el-form-item>
                <el-form-item label="成员名称" prop="member">
                    <el-input v-model="ruleForm.member" />
                </el-form-item>
                <el-form-item label="项目预期启动时间" prop="startime" required>
                    <el-date-picker v-model="ruleForm.startime" type="datetime" placeholder="请选择日期" />
                </el-form-item>
                <el-form-item label="项目预期结束时间" prop="endtime" required>
                    <el-date-picker v-model="ruleForm.endtime" type="datetime" placeholder="请选择日期" />
                </el-form-item>

                <el-form-item label="项目描述" prop="remark">
                    <el-input v-model="ruleForm.remark" type="textarea" />
                </el-form-item>
                <el-form-item prop="link">
                    <el-upload v-model="ruleForm.link" class="upload-demo" drag :on-success="handleFileSuccess"
                        action="http://127.0.0.1:5173/api/file/uploadFile" multiple aria-required="true">
                        <el-icon class="el-icon--upload">
                            <IEpUploadFilled />
                        </el-icon>
                        <div> 将文件拖到此处，或 <em>点击上传</em></div>
                        <template #tip>
                            <div> jpg/png文件小于500kb</div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button class="btn-add" type="primary" @click="submitForm(ruleFormRef)">
                        立即创建
                    </el-button>
                    <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
  
<style scoped lang="scss">
.main-container {
    width: 960px;
    margin-left: 15%;
    border-radius: 15px;
    border: 1px solid #e4e7ed;
    background-color: #fff;

    .main-title {
        width: 96%;
        padding: 18px 20px;
        border-bottom: 1px solid #e4e7ed;
    }

    .content {
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;

        .text-center {
            padding: 0 15px;
        }

        .upload-demo {
            margin-left: 140px;
            width: 460px;
        }

        .btn-add {
            margin-left: 150px;
        }
    }

}
</style>