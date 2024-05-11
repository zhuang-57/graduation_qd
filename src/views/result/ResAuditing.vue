<script setup lang="ts">
import { reactive } from 'vue';
import { ResultList, AuditResultCondition, getAuditResult, getResultQuery, CancelResultMsg, ResultCondition, GetPage, GETPageList } from "../../api/result"
import { FormInstance, FormRules } from 'element-plus';
import router from "../../router/index"
import { timeFormatter } from "../../utils/timeFormatter"
import { useUserStore } from "../../stores/users"
const userStore = useUserStore()
//分页查询条件
const page = reactive<GetPage>(
    {
        pageNo: 1,
        pageSize: 5
    }
)
const getPageQuery = reactive<ResultCondition>({
    likeProName: '',
    resultType: '',
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
    if (getPageQuery.likeProName.trim() || getPageQuery.resultType.trim()) {
        getPageQuery.likeProName = "";
        getPageQuery.resultType = "";
    }
}

//成果申请状态
const ResultStatusEnum = {
    WAIT_AUDIT: "待审核",
    CANCEL: "取消",
    ACCEPT: "同意",
    REFUSE: "拒绝"
}


//成果类型
const ResultTypeEnum = {
    TOPIC: "课题",
    BOOK: "论著",
    PATENT: "专利",
    PAPER: "论文",
    WRITINGS: "著作",
}
const frontStatus = (query: string) => {
    return ResultStatusEnum[query]
}

//获取成果详细数据
const ResultMenus = ref([] as ResultList[])
const getResultMenus = async (resultQuery: ResultCondition) => {
    Object.assign(getPageQuery, resultQuery);
    const { data } = await getResultQuery(getPageQuery);
    console.log(data);

    //获取数据成功
    if (data.code === 0) {
        const resultStartusList = data.data.data.map((item) => {
            const getStatus = frontStatus(item.status)
            return { ...item, status: getStatus };
        })
        ResultMenus.value = resultStartusList;
        Object.assign(pageList, data.data.page)
    } else {
        ElMessage.error(data.msg)
        throw new Error(data.msg)
    }
}
getResultMenus(getPageQuery)

//分页设置
const handleSizeChange = (sizePage: number) => {
    getPageQuery.page.pageSize = sizePage
    getResultMenus(getPageQuery)
}

const handleCurrentChange = (pageNo: number) => {
    getPageQuery.page.pageNo = pageNo
    getResultMenus(getPageQuery)
}

//添加成果按钮
const addResultBtn = () => {
    router.push({ name: "ResEnroll" })
}

//审核项目
const ResultAuditForm = reactive<AuditResultCondition>({
    resultId: 1,
    acceptFlag: false
})

// 同意成果申请
const passResultReq = async (id: number) => {
    await ElMessageBox.confirm("确定要同意成果申请吗？", "消息提示：", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).catch(() => {
        ElMessage.info('成果申请被取消！');
        return new Promise(() => { })
    })
    //调用接口函数
    ResultAuditForm.resultId = id
    ResultAuditForm.acceptFlag = true
    const { data } = await getAuditResult(ResultAuditForm);
    if (data.code === 0) {
        ElMessage.success("成果申请执行成功！");
        getResultMenus(getPageQuery)
    } else {
        ElMessage.error(data.msg)
    }
}

//同意按钮是否可用
const getBtnUse = (id: number) => {
    const getResultItem = ResultMenus.value.find((item) => item.id === id)
    return getResultItem.status !== ResultStatusEnum.WAIT_AUDIT
}

// 拒绝经费申请
const rejectResultReq = async (id: number) => {
    await ElMessageBox.confirm("确定要拒绝成果申请吗？", "消息提示：", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).catch(() => {
        ElMessage.info('成果申请被取消！');
        return new Promise(() => { })
    })
    //调用接口函数
    ResultAuditForm.resultId = id
    ResultAuditForm.acceptFlag = false
    const { data } = await getAuditResult(ResultAuditForm);
    if (data.code === 0) {
        ElMessage.success("拒绝成果申请成功执行！");
        getResultMenus(getPageQuery)
    } else {
        ElMessage.error(data.msg)
    }
}

//撤回成果申请
const handleCancel = async (id: string) => {
    await ElMessageBox.confirm("确定要撤回成果申请吗？", "消息提示：", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).catch(() => {
        ElMessage.info('成果申请报错！');
        return new Promise(() => { })
    })

    //调用接口函数
    const { data } = await CancelResultMsg(id);
    // console.log(data);
    if (data.code === 0) {
        ElMessage.success("成果申请被取消！");
        getResultMenus(getPageQuery)
    } else {
        ElMessage.error(data.msg)
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
                            <el-button type="primary" @click="getResultMenus(getPageQuery)">搜索</el-button>
                        </div>
                    </div>
                    <div class="card-input">
                        <el-form :inline="true" label-width="100px">
                            <el-form-item label="关联项目:" prop="likeProName">
                                <el-input v-model="getPageQuery.likeProName" style="width: 240px" type="text"
                                    placeholder="请输入关联项目" />
                            </el-form-item>
                            <el-form-item label="成果类型:" prop="resultType">
                                <!-- <el-input v-model="getPageQuery.resultType" style="width: 240px" type="text"
                                    placeholder="请输入成果类型" /> -->
                                <el-select v-model="getPageQuery.resultType" placeholder="请选择成果类型" style="width: 240px"
                                    prop="resultType">
                                    <el-option label="课题" value="TOPIC" />
                                    <el-option label="软著" value="BOOK" />
                                    <el-option label="专利" value="PATENT" />
                                    <el-option label="论文" value="PAPER" />
                                    <el-option label="著作" value="WRITINGS" />
                                </el-select>
                            </el-form-item>
                        </el-form>

                    </div>
                </el-card>
            </template>
            <!-- 中间添加按钮 -->
            <el-card shadow="never" style="margin-bottom: 20px;">
                <div class="role-list">
                    <div> 成果列表</div>
                    <div>
                        <el-button plain @click="addResultBtn">添加</el-button>
                    </div>
                </div>
            </el-card>
            <el-table :data="ResultMenus" border style="width: 100%">
                <el-table-column prop="id" label="项目编号" align="center">
                </el-table-column>
                <el-table-column prop="proName" label="关联项目" align="center">
                </el-table-column>
                <el-table-column prop="resultType" label="获奖类型" width="120" align="center">
                    <template #default="scope">
                        {{ ResultTypeEnum[scope.row.resultType] }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" :formatter="timeFormatter" label="获奖日期" align="center">
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template #default="scope">
                        <el-tag
                            :type="scope.row.status === '拒绝' ? 'danger' : scope.row.status === '同意' ? 'success' : scope.row.status === '待审核' ? 'primary' : 'warning'"
                            disable-transitions>{{ scope.row.status
                            }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200" align="center" v-slot="scope">
                    <el-button v-if="userStore.userInfo.roleId === 3" type="success" size="small"
                        @click="passResultReq(scope.row.id)">同意</el-button>
                    <el-button v-if="userStore.userInfo.roleId === 3" type="danger" size="small"
                        @click="rejectResultReq(scope.row.id)">拒绝</el-button>
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
