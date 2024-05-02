<script setup lang="ts">
import { reactive } from 'vue';
import { FundApplyList, getFundQuery, DeleteFundMsg, GetPage, GETPageList, FundCondition } from "../../api/fund"
import { FormInstance, FormRules } from 'element-plus';
import { timeFormatter } from "../../utils/timeFormatter"
//分页查询条件
const page = reactive<GetPage>(
    {
        pageNo: 1,
        pageSize: 5
    }
)
const getPageQuery = reactive<FundCondition>({
    proName: '',
    page
})

//结束分页信息
const pageList = reactive<GETPageList>({
    curPage: 1,
    firstPage: true,
    lastPage: true,
    pageSize: 1,
    sort: '',
    totalPage: 1,
    totalSize: 1
})

//重置内容
const resetContent = () => {
    if (getPageQuery.proName.trim()) {
        getPageQuery.proName = "";
    }
}

//获取项目详细数据
const FundMenus = ref([] as FundApplyList[])
const getFundMenus = async (fundQuery: FundCondition) => {
    Object.assign(getPageQuery, fundQuery);
    const { data } = await getFundQuery(getPageQuery);
    console.log(data);

    //获取数据成功
    if (data.code === 0) {
        FundMenus.value = data.data.data;
        Object.assign(pageList, data.data.page)
    } else {
        ElMessage.error('获取项目详细信息失败！')
        throw new Error("获取项目详细信息失败！")
    }
}
getFundMenus(getPageQuery)

//分页设置
const handleSizeChange = (sizePage: number) => {
    getPageQuery.page.pageSize = sizePage
    getFundMenus(getPageQuery)
}

const handleCurrentChange = (pageNo: number) => {
    getPageQuery.page.pageNo = pageNo
    getFundMenus(getPageQuery)
}

//编辑项目
const FundRuleRef = ref<FormInstance>()
const updateVisible = ref(false);
const fundRuleForm = reactive<FundApplyList>({
    proId: 1,
    proName: '',
    fund: 0,
    status: '',
    account: '',
    createTime: '',
    remark: ''
})

//获取编辑经费数据
const handleEditFund = async (id: number) => {
    updateVisible.value = true;
    const getFundItem = FundMenus.value.find((item) => item.id === id)
    Object.assign(fundRuleForm, getFundItem);
}


//发送编辑请求
const onSubmit = async (fundFrom: FormInstance | undefined) => {
    if (!fundFrom) return
    await fundFrom.validate().catch((err) => {
        ElMessage.error("有必填项未填写！")
        throw err;
    })
    // const { data } = await getUpdateFund(fundRuleForm);

    // if (data.code === 0) {
    //     // ruleForm.value = data.data.menuInfo;

    // } else {
    //     ElMessage.error("获取编辑信息失败！");
    //     throw new Error("获取编辑数据失败")
    // }
}

//撤回项目
const handleCancel = async (id: string) => {
    await ElMessageBox.confirm("确定要撤回申请经费信息吗？", "撤回提示：", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).catch(() => {
        ElMessage.info('撤回经费信息被取消！');
        return new Promise(() => { })
    })

    //调用接口函数
    const { data } = await DeleteFundMsg(id);
    if (data.code === 0) {
        ElMessage.success("撤回经费信息成功！");
        getFundMenus(getPageQuery);
    } else {
        ElMessage.error("撤回经费失败！");
    }
}
</script>

<template>
    <div class="content">
        <el-card style="min-width: 480px">
            <template #header>
                <div style="margin-bottom: 20px;"> 经费库 </div>
                <el-card shadow="never">
                    <div class="card-content">
                        <div class="card-icon">
                            <el-icon size="20" style="padding-right:5px ;">
                                <IEpSearch />
                            </el-icon><span>筛选搜索</span>
                        </div>
                        <div>
                            <el-button @click="resetContent">重置</el-button>
                            <el-button type="primary" @click="getFundMenus(getPageQuery)">搜索</el-button>
                        </div>
                    </div>
                    <div class="card-input">
                        <span>输入搜索：</span>
                        <el-input v-model="getPageQuery.proName" style="width: 240px" type="text" placeholder="输入角色名" />
                    </div>
                </el-card>
            </template>
            <el-table :data="FundMenus" border style="width: 100%">
                <el-table-column prop="proId" label="项目编号" align="center">
                </el-table-column>
                <el-table-column prop="proName" label="项目名称" align="center">
                </el-table-column>
                <el-table-column prop="fund" label="申请金额" width="120" align="center">
                </el-table-column>
                <el-table-column prop="account" label="打款账号" align="center">
                </el-table-column>
                <el-table-column prop="createTime" :formatter="timeFormatter" label="申请日期" align="center">
                </el-table-column>
                <el-table-column prop="status" label="状态" width="120" align="center">
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200" align="center" v-slot="scope">
                    <el-button type="primary" size="small" @click="handleEditFund(scope.row.id)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleCancel(scope.row.id)">撤回</el-button>
                </el-table-column>
            </el-table>
            <template #footer>
                <div class="pagination">
                    <el-pagination v-model:current-page="pageList.curPage" v-model:page-size="pageList.pageSize"
                        :page-sizes="[5, 10, 20, 30]" layout="total, sizes, prev, pager, next, jumper"
                        :total="pageList.totalSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </div>
            </template>
        </el-card>

        <!-- 编辑弹窗 -->
        <el-dialog v-model="updateVisible" title="编辑项目信息" min-width="500">
            <el-form ref="FundRuleRef" :model="fundRuleForm" :inline="true" label-width="100px" class="pro-apply-from">
                <el-form-item label="项目名称" prop="proName">
                    <el-input v-model="fundRuleForm.proName"></el-input>
                </el-form-item>
                <el-form-item label="申请经费" prop="fund">
                    <el-input v-model="fundRuleForm.fund"></el-input>
                </el-form-item>
                <el-form-item label="打款账号" prop="account">
                    <el-input v-model="fundRuleForm.account"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="fundRuleForm.remark" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="updateVisible = false">取消</el-button>
                    <el-button type="primary" @click="onSubmit(FundRuleRef)">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
  


<style scoped lang="scss">
.card-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .card-icon {
        display: flex;
        align-items: center;
    }
}

.pagination {
    display: flex;
    justify-content: center;
}
</style>
