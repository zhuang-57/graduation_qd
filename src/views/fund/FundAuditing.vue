<script setup lang="ts">
import { reactive } from 'vue';
import { FundApplyList, getFundQuery, DeleteFundMsg, GetPage, GETPageList, FundCondition, AuditFundCondition, getAuditFund } from "../../api/fund"
import { FormInstance, FormRules } from 'element-plus';
import { timeFormatter } from "../../utils/timeFormatter"
import router from "../../router/index"
import { useUserStore } from "../../stores/users"
const userStore = useUserStore()

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

//经费申请状态
const FundStatusEnum = {
    WAIT_AUDIT: "待审核",
    CANCEL: "取消",
    ACCEPT: "同意",
    REFUSE: "拒绝"
}

const frontStatus = (query: string) => {
    return FundStatusEnum[query]
}

//获取经费详细数据
const FundMenus = ref([] as FundApplyList[])
const getFundMenus = async (fundQuery: FundCondition) => {
    Object.assign(getPageQuery, fundQuery);
    const { data } = await getFundQuery(getPageQuery);

    //获取数据成功
    if (data.code === 0) {
        const fundStartusList = data.data.data.map((item) => {
            const getStatus = frontStatus(item.status)
            return { ...item, status: getStatus };
        })
        FundMenus.value = fundStartusList;
        Object.assign(pageList, data.data.page)
    } else {
        ElMessage.error(data.msg)
        throw new Error(data.msg)
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

//添加经费按钮
const addFundBtn = () => {
    router.push({ name: "FundApply" })
}
//审核项目
const fundAuditForm = reactive<AuditFundCondition>({
    fundId: 1,
    acceptFlag: false
})

// 同意经费申请
const passFundReq = async (id: number) => {
    await ElMessageBox.confirm("确定要同意经费申请吗？", "经费提示：", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).catch(() => {
        ElMessage.info('经费申请被取消！');
        return new Promise(() => { })
    })
    //调用接口函数
    fundAuditForm.fundId = id
    fundAuditForm.acceptFlag = true
    const { data } = await getAuditFund(fundAuditForm);
    if (data.code === 0) {
        ElMessage.success("经费申请执行成功！");
        getFundMenus(getPageQuery)
    } else {
        ElMessage.error(data.msg)
    }
}

//同意按钮是否可用
const getBtnUse = (id: number) => {
    const getFundItem = FundMenus.value.find((item) => item.id === id)
    return getFundItem.status !== FundStatusEnum.WAIT_AUDIT
}



// 拒绝经费申请
const rejectFundReq = async (id: number) => {
    await ElMessageBox.confirm("确定要拒绝经费申请吗？", "经费提示：", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).catch(() => {
        ElMessage.info('经费申请被取消！');
        return new Promise(() => { })
    })
    //调用接口函数
    fundAuditForm.fundId = id
    fundAuditForm.acceptFlag = false
    const { data } = await getAuditFund(fundAuditForm);
    if (data.code === 0) {
        ElMessage.success("拒绝经费申请成功执行！");
        getFundMenus(getPageQuery)
    } else {
        ElMessage.error(data.msg)
    }
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
            <!-- 中间添加按钮 -->
            <el-card shadow="never" style="margin-bottom: 20px;">
                <div class="role-list">
                    <div> 经费库 </div>
                    <div>
                        <el-button plain @click="addFundBtn">添加</el-button>
                    </div>
                </div>
            </el-card>
            <!-- 下面的经费表格 -->
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
                    <template #default="scope">
                        <el-tag
                            :type="scope.row.status === '拒绝' ? 'danger' : scope.row.status === '同意' ? 'success' : scope.row.status === '待审核' ? 'primary' : 'warning'"
                            disable-transitions>{{ scope.row.status
                            }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200" align="center" v-slot="scope">
                    <el-button v-if="userStore.userInfo.roleId === 3" type="success" size="small"
                        @click="passFundReq(scope.row.id)" :disabled="getBtnUse(scope.row.id)">同意</el-button>
                    <el-button v-if="userStore.userInfo.roleId === 3" type="danger" size="small"
                        @click="rejectFundReq(scope.row.id)" :disabled="getBtnUse(scope.row.id)">拒绝</el-button>
                    <el-button v-if="userStore.userInfo.roleId !== 3" type="danger" size="small"
                        @click="handleCancel(scope.row.id)">撤回</el-button>
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

.role-list {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
