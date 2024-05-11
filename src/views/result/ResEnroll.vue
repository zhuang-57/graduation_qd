<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ResultApply, ResultList, getResultApply } from "../../api/result"
import { getAllProMenu, GetPage, ProCondition } from "../../api/project";
import router from "../../router/index"

const ruleFormRef = ref<FormInstance>()

const resultList = reactive<ResultList>({
    id: 1,
    userId: 1,
    academyId: null,
    proName: '',
    remark: '',
    resultType: '',
    createTime: '',
    status: ''
})

const resultApplyList = reactive<ResultApply>({
    projectId: null,
    proName: '',
    resultType: '',
    remark: ''
})

const rules = reactive<FormRules<typeof resultApplyList>>({
    projectId: [
        { required: true, message: '请输入关联项目', trigger: 'blur' },
    ],
    resultType: [
        { required: true, message: '请选择关联类型', trigger: 'change' },
    ],
    remark: [
        { required: true, message: '请填写项目备注', trigger: 'blur' },
    ],
})

//分页查询条件
const page = reactive<GetPage>(
    {
        pageNo: 1,
        pageSize: 5
    }
)
const getPageQuery = reactive<ProCondition>({
    likeProjectName: '',
    page
})

//项目名称模糊搜索
interface ListItem {
    label: string
    value: string
    disabled: boolean
}
const loading = ref(false);
const fundOption = ref<ListItem[]>([])
const FundremoteMethod = async (query: string) => {
    if (query.trim()) {
        loading.value = true
        getPageQuery.likeProjectName = query
        const { data } = await getAllProMenu(getPageQuery).finally(() => {
            loading.value = false
        })
        fundOption.value = data.data.data.map((item) => {
            let dis = false
            if (item.status !== "END") dis = true
            return { label: item.proName, value: item.id, disabled: dis }
        })
    }
}

//提交申请
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate().catch((err) => {
        ElMessage.error("申请成果失败！");
        return err
    })
    const { data } = await getResultApply(resultApplyList);
    if (data.code === 0) {
        ElMessage.success("申请经费成功！")
        router.push({ name: "ResAuditing" })
        // formEl.resetFields()
    } else {
        ElMessage.error(data.msg)
        throw new Error(`申请失败！`)
    }

}

//重置
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
</script>

<template>
    <div class="main-container">
        <div class="main-title">
            成果申请
        </div>
        <div class="content">
            <el-form ref="ruleFormRef" style="max-width: 770px" label-width="auto" :model="resultApplyList" :rules="rules"
                status-icon>
                <el-form-item label="关联项目" prop="projectId">
                    <el-select v-model="resultApplyList.projectId" clearable filterable remote reserve-keyword
                        placeholder="请输入内容" :remote-method="FundremoteMethod" :loading="loading" style="width: 702px">
                        <el-option v-for="item in fundOption" :key="item.value" :label="item.label" :value="item.value"
                            :disabled="item.disabled" />
                    </el-select>
                </el-form-item>
                <el-form-item label="类型:" prop="resultType">
                    <el-select v-model="resultApplyList.resultType" placeholder="请选择" style="width: 702px">
                        <el-option label="课题" value="TOPIC" />
                        <el-option label="软著" value="BOOK" />
                        <el-option label="专利" value="PATENT" />
                        <el-option label="论文" value="PAPER" />
                        <el-option label="著作" value="WRITINGS" />
                    </el-select>
                </el-form-item>

                <el-form-item label="备注:" prop="remark">
                    <el-input v-model="resultApplyList.remark" type="textarea"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="btn-add">
                        <el-button class="btn-add" type="primary" @click="submitForm(ruleFormRef)">
                            立即提交
                        </el-button>
                        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                    </div>
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
        margin-left: 60px;

        // display: flex;
        // justify-content: center;
        // align-items: center;
        .btn-add {
            margin-left: 150px;
        }
    }
}
</style>
