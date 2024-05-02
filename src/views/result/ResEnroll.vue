<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { FundItemMenu, getFundApply } from "../../api/fund"

const ruleFormRef = ref<FormInstance>()

const fundForm = ref<FundItemMenu>({
    id: '',
    name: '',
    money: 0,
    book: '',
})

const rules = reactive<FormRules<typeof fundForm>>({
    id: [
        { required: true, message: '请输入项目ID', trigger: 'blur' },
    ],
    name: [
        { required: true, message: '请输入项目名称', trigger: 'blur' },
    ],
    money: [
        { required: true, message: '请输入申请金额', trigger: 'blur' },
    ],
    book: [
        { required: true, message: '请填写项目备注', trigger: 'blur' },
    ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    const { data } = await getFundApply(fundForm.value);

    await formEl.validate((valid, fields) => {
        if (valid && data.code === '000000') {
            ElMessage.success("申请经费成功！")
        } else {
            throw new Error(`申请失败！${fields}`)
        }
    })
}

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
            <el-form ref="ruleFormRef" style="max-width: 770px" label-width="auto" :model="fundForm" :rules="rules"
                status-icon>
                <el-form-item label="项目编号：" prop="id">
                    <el-input v-model="fundForm.id"></el-input>
                </el-form-item>
                <el-form-item label="项目名称：" prop="name">
                    <el-input v-model="fundForm.name"></el-input>
                </el-form-item>
                <el-form-item label="成果申请：" prop="money">
                    <el-input v-model="fundForm.money"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="book">
                    <el-input v-model="fundForm.book" type="textarea"></el-input>
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
