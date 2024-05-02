<script setup lang="ts">
import { reactive } from 'vue';
import { FundMenu, getFundMenu, getEditFund, DeleteFundMsg } from "../../api/fund"
import { FormInstance, FormRules } from 'element-plus';

//获取项目详细数据
const FundMenus = ref([] as FundMenu[])
const getFundMenus = async () => {
    const { data } = await getFundMenu();
    console.log(data);

    //获取数据成功
    if (data.code === 0) {
        FundMenus.value = data.data;
    } else {
        ElMessage.error('获取项目详细信息失败！')
        throw new Error("获取项目详细信息失败！")
    }
}
getFundMenus()

//编辑项目
const visible = ref(false);
const ruleForm = ref<FundMenu>({
    id: '',
    name: '',
    money: 0,
    startTime: 0,
    status: false,
    type: '',
    book: ''
})

const handleEditFund = async (id: string) => {
    const { data } = await getEditFund(id);
    //todo: console.log(data);

    visible.value = true;
    if (data.code === 0) {
        ruleForm.value = data.data.menuInfo;

    } else {
        ElMessage.error("获取编辑信息失败！");
        throw new Error("获取编辑数据失败")
    }
}


//删除项目
const handleDelete = async (id: string) => {
    await ElMessageBox.confirm("确定要删除整个项目信息吗？", "删除提示：", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).catch(() => {
        ElMessage.info('删除项目信息被取消！');
        return new Promise(() => { })
    })

    //调用接口函数
    const { data } = await DeleteFundMsg(id);
    // console.log(data);
    if (data.code === 0 && data.data) {
        ElMessage.success("删除菜单成功！");
        getFundMenus();
    } else {
        ElMessage.error("删除菜单失败！");
    }
}
</script>

<template>
    <div class="content">
        <el-card style="min-width: 480px">
            <template #header>
                <div class="card-header">
                    <span>成果列表</span>
                </div>
            </template>
            <el-table :data="FundMenus" border style="width: 100%">
                <el-table-column label="序号" type="index" width="80" align="center">
                </el-table-column>
                <el-table-column prop="id" label="项目编号" align="center">
                </el-table-column>
                <el-table-column prop="name" label="项目名称" align="center">
                </el-table-column>
                <el-table-column prop="money" label="奖励名称" width="120" align="center">
                </el-table-column>
                <el-table-column prop="money" label="发证单位" width="120" align="center">
                </el-table-column>
                <el-table-column prop="startTime" label="获奖日期" align="center">
                </el-table-column>
                <el-table-column prop="type" label="获奖级别" width="120" align="center">
                </el-table-column>
                <!-- <el-table-column prop="status" label="状态" width="120" align="center">
                </el-table-column> -->
                <el-table-column fixed="right" label="操作" width="200" align="center" v-slot="scope">
                    <el-button type="primary" size="small" @click="handleEditFund(scope.row.id)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
                </el-table-column>
            </el-table>
            <template #footer>
                <div class="pagination">
                    <el-pagination background layout="prev, pager, next" :total="5" />
                </div>
            </template>
        </el-card>
    </div>
</template>
  


<style scoped lang="scss">
.main-container {
    width: 960px;
    margin-left: 15%;
    border-radius: 15px;
    border: 1px solid #ebeef5;
    background-color: #fff;

    .content {
        padding: 20px;
        margin-top: 25px;

        display: flex;
        justify-content: center;
        align-items: center;

        .pro-apply-from {
            width: 80%;
        }
    }
}

.pagination {
    display: flex;
    justify-content: center;
}
</style>
