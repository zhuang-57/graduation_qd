<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { FundItemMenu, getFundApply, getFundQuery } from "../../api/fund"
import { getAllProMenu, GetPage, ProCondition } from "../../api/project";

const ruleFormRef = ref<FormInstance>()

const fundForm = ref<FundItemMenu>({
    proId: null,
    fund: 0,
    account: '',
    remark: '',
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

const rules = reactive<FormRules<typeof fundForm>>({
    proId: [
        { required: true, message: '请输入项目名称', trigger: 'blur' },
    ],
    fund: [
        { required: true, message: '请输入申请金额', trigger: 'blur' },
    ],
    account: [
        { required: true, message: '请输入申请打款账号', trigger: 'blur' },
    ],
    remark: [
        { required: true, message: '请填写申请经费原因', trigger: 'blur' },
    ],
})

//项目名称模糊搜索
interface ListItem {
    label: string
    value: string
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
            return { label: item.proName, value: item.id }
        })
    }


}

//提交申请
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate().catch((err) => {
        ElMessage.error("申请经费失败！");
        return err
    })
    const { data } = await getFundApply(fundForm.value);
    console.log(data);

    if (data.code === 0) {
        ElMessage.success("申请经费成功！")
        formEl.resetFields()
    } else {
        throw new Error(`申请失败！`)
    }
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
</script>

<template>
    <div class="main-container">
        <div class="main-title">
            经费申请
        </div>
        <div class="content">
            <el-form ref="ruleFormRef" style="max-width: 770px" label-width="auto" :model="fundForm" :rules="rules"
                status-icon>
                <el-form-item label="项目名称：" prop="proId">
                    <el-select v-model="fundForm.proId" clearable filterable remote reserve-keyword placeholder="请输入内容"
                        :remote-method="FundremoteMethod" :loading="loading" style="width: 240px">
                        <el-option v-for="item in fundOption" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="申请金额(单位/元)：" prop="fund">
                    <el-input v-model="fundForm.fund"></el-input>
                </el-form-item>
                <el-form-item label="打款账号：" prop="account">
                    <el-input v-model="fundForm.account"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="fundForm.remark" type="textarea"></el-input>
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
