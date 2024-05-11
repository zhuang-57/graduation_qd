<script setup lang="ts">
import { StatusCondition, getStatusAudit, ProCondition, GetPage, ProjectApplyList, GETPageList, EditMenuList, getProjectUpdate, getAllProMenu, DeleteProMsg, FileUrlList, getFileUrl } from "../../api/project"
import { FormInstance, FormRules } from 'element-plus';
import { timeFormatter } from "../../utils/timeFormatter"
import { reactive } from 'vue';
import { useUserStore } from "../../stores/users"
const userStore = useUserStore()

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


// 状态属性
const statusMap = {
    WAIT_AUDIT: "待审核",
    REFUSE: "驳回",
    WAIT_MIDDLE_CHECK: "待中期检查",
    WAIT_END: "待结题",
    END: "结束"
}

const frontStatus = (query: string) => {
    return statusMap[query]
}

//获取项目列表数据
const ProMenus = ref([] as ProjectApplyList[])

const ProMenusList = reactive<ProjectApplyList>({
    academyId: 1,
    endUrl: '',//结题链接
    endtime: '',
    id: 1,
    level: '',
    link: '',
    member: '',
    middleCheckUrl: '', //中期检查链接
    proName: '',
    remark: '',
    startime: '',
    status: '',
    statusName: '',
    teacherName: '',
    teacherPhone: '',
    type: '',
    userId: 1,
    username: ''
})

const getProjectMenus = async (proQuery: ProCondition) => {
    Object.assign(getPageQuery, proQuery);
    const { data } = await getAllProMenu(getPageQuery);
    //获取数据成功
    if (data.code === 0) {
        const ProStartusList = data.data.data.map((item) => {
            const getStatus = frontStatus(item.status)
            return { ...item, status: getStatus };
        })
        ProMenus.value = ProStartusList;
        Object.assign(pageList, data.data.page);

    } else {
        ElMessage.error(data.msg)
        throw new Error(data.msg)
    }
}
getProjectMenus(getPageQuery)

//分页设置
const handleSizeChange = (sizePage: number) => {
    getPageQuery.page.pageSize = sizePage
    getProjectMenus(getPageQuery)
}

const handleCurrentChange = (pageNo: number) => {
    getPageQuery.page.pageNo = pageNo
    getProjectMenus(getPageQuery)
}

//编辑项目
const updateVisible = ref(false);
const updateProForm = reactive<EditMenuList>({
    id: 1,
    proName: '',
    level: '',
    type: '',
    teacherName: '',
    teacherPhone: '',
    member: '',
    startime: '',
    endtime: '',
    remark: '',
    link: '',
})


//重置内容
const resetContent = () => {
    if (getPageQuery.likeProjectName.trim()) {
        getPageQuery.likeProjectName = "";
    }
}

//结束时间迟于开始时间
const validateEndTime = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('结束时间不能为空'))
    } else if (updateProForm.startime && new Date(value) <= new Date(updateProForm.startime)) {
        callback(new Error('结束时间必须晚于开始时间'))
    } else {
        callback()
    }
}
//表单限制
const EditRules = reactive<FormRules<ProjectApplyList>>({
    teacherPhone: [
        { required: true, message: '请输入指导老师手机号', trigger: 'blur' },
        { len: 11, message: '手机号需要11位', trigger: 'blur' }
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
})

//(1)编辑表单
const handleEditPro = async (id: number) => {
    updateVisible.value = true;
    const getProItem = ProMenus.value.find((item) => item.id === id)
    Object.assign(updateProForm, getProItem);
}

const EditIsDisabled = (id: number) => {
    const getProItem = ProMenus.value.find((item) => item.id === id)
    return getProItem.statusName !== statusMap.WAIT_AUDIT
}

//文件上传
const beforeUpload = (file) => {
    const isListMaxSize = file.size / 1024 / 1024 < 10;
    if (!isListMaxSize) {
        ElMessage.error('文件上传大小不能超过10MB！');
        return false;
    }
    return true;
}

const handleFileSuccess = (response, file, fileList) => {
    if (response.code === 0) {
        updateProForm.link = response.data.fileUrl;
    } else {
        ElMessage.error("文件上传失败！")
        return new Error("文件上传失败！")
    }
}

//表单验证
const proRuleRef = ref<FormInstance>();
//(2)编辑表单提交
const onSubmit = async (proForm: FormInstance | undefined) => {
    if (!proForm) return
    await proForm.validate().catch((err) => {
        ElMessage.error("编辑信息有误！")
        throw err;
    })
    const { data } = await getProjectUpdate(updateProForm).finally(() => {
        updateVisible.value = false;
    })
    if (data.code === 0) {
        getProjectMenus(getPageQuery)
    } else {
        ElMessage.error("更新项目信息失败！");
        throw new Error("更新项目信息失败！")
    }
}

//查看项目详情
const statusItem = reactive<StatusCondition>({
    id: 1,
    acceptFlag: false
})
// 按钮是否可见
const BtnVisible = ref(true)

//查看详情
const visible = ref(false);
//进度条状态值
const activeBtn = ref(0)

const handleCheck = (id: number) => {
    const getProItem = ProMenus.value.find((item) => item.id === id)
    Object.assign(ProMenusList, getProItem)
    if (userStore.userInfo.roleId !== 3) {
        BtnVisible.value = false
    } else if (ProMenusList.status === statusMap.REFUSE || ProMenusList.status === statusMap.END) {
        BtnVisible.value = false
    } else {
        BtnVisible.value = true
    }
    if (getProItem.status === statusMap.WAIT_MIDDLE_CHECK || getProItem.status === statusMap.REFUSE) activeBtn.value = 0
    if (getProItem.status === statusMap.WAIT_END) activeBtn.value = 1
    if (getProItem.status === statusMap.END) activeBtn.value = 2

    // Object.assign(updateProForm, getProItem);
    visible.value = true;
}

//驳回申请
const RejectProReq = async (id: number) => {
    statusItem.id = id
    statusItem.acceptFlag = false
    const { data } = await getStatusAudit(statusItem);
    if (data.code === 0) {
        ElMessage.success("驳回项目信息成功！")
        BtnVisible.value = false
        getProjectMenus(getPageQuery)
    } else {
        ElMessage.error(data.msg)
    }
}

//通过审核申请
const PassProReq = async (id: number) => {
    statusItem.id = id
    statusItem.acceptFlag = true
    const { data } = await getStatusAudit(statusItem);
    if (data.code === 0) {
        ElMessage.success("审核通过！")
        getProjectMenus(getPageQuery)
        visible.value = false
        const getSuccessStatus = ProMenus.value.find((item) => item.id === id)
        if (getSuccessStatus.status === statusMap.WAIT_END) BtnVisible.value = false
    } else {
        ElMessage.error(data.msg)
    }
}

// 附件提交请求属性
const getFileReq = reactive<FileUrlList>({
    id: 1,
    middleCheckUrl: '',
    endUrl: ''
})

//中期文件提交
const handleFileUpload = (response, file, fileList) => {
    if (response.code === 0) {
        ProMenusList.middleCheckUrl = response.data.fileUrl;
    } else {
        ElMessage.error("文件上传失败！")
        return new Error("文件上传失败！")
    }
}

//中期检查提交按钮是否可用
const getMiddleStatus = (id: number) => {
    const getProItem = ProMenus.value.find((item) => item.id === id)
    if (getProItem.statusName === statusMap.WAIT_MIDDLE_CHECK) {
        return false
    }
    return true
}

//提交中期检查
const middleVisible = ref(false)

//打开中期检查弹窗
// const getMiddleOpen = async (id: number) => {
//     middleVisible.value = true
// }
//提交中期检查附件
const onMiddleSubmit = async (id: number) => {
    getFileReq.id = id;
    getFileReq.middleCheckUrl = ProMenusList.middleCheckUrl
    const { data } = await getFileUrl(getFileReq).finally(() => {
        middleVisible.value = false
    })
    if (data.code === 0) {
        ElMessage.success("中期检查材料提交成功！")
    } else {
        ElMessage.error(data.msg)
        throw new Error("上传失败！");
    }

}

//结题提交按钮是否可用
const getEndStatus = (id: number) => {
    const getProItem = ProMenus.value.find((item) => item.id === id)
    if (getProItem.statusName === statusMap.WAIT_END) {
        return false
    }
    return true
}
const EndVisible = ref(false);

//结题文件提交
const handleEndFileUpload = (response, file, fileList) => {
    if (response.code === 0) {
        ProMenusList.endUrl = response.data.fileUrl;
    } else {
        ElMessage.error("文件上传失败！")
        return new Error("文件上传失败！")
    }
}

//提交结题检查附件
const onEndSubmit = async (id: number) => {
    getFileReq.id = id;
    getFileReq.endUrl = ProMenusList.endUrl
    const { data } = await getFileUrl(getFileReq).finally(() => {
        EndVisible.value = false
    })
    if (data.code === 0) {
        ElMessage.success("结题材料提交成功！")
    } else {
        ElMessage.error(data.msg)
        throw new Error("上传失败！");

    }
}

//删除项目
const handleDelete = async (id: number) => {
    await ElMessageBox.confirm("确定要删除整个项目信息吗？", "删除提示：", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).catch(() => {
        ElMessage.info('删除项目信息被取消！');
        return new Promise(() => { })
    })

    //调用接口函数
    const { data } = await DeleteProMsg(id);
    // console.log(data);
    if (data.code === 0) {
        getAllProMenu(getPageQuery).then((res) => {
            ProMenus.value = res.data.data.data;
            ElMessage.success("项目删除成功！");
        })
    } else {
        ElMessage.error("删除项目失败！");
    }
}

//项目类型
const options = [
    { lable: "基础研究项目", value: "基础研究项目" },
    { lable: "应用研究项目", value: "应用研究项目" },
    { lable: "实验发展类项目", value: "实验发展类项目" },
]
</script>

<template>
    <div class="content">
        <el-card style="min-width: 480px">
            <template #header>
                <div style="margin-bottom: 20px;">项目列表 </div>
                <el-card shadow="never">
                    <div class="card-content">
                        <div class="card-icon">
                            <el-icon size="20" style="padding-right:5px ;">
                                <IEpSearch />
                            </el-icon><span>筛选搜索</span>
                        </div>
                        <div>
                            <el-button @click="resetContent">重置</el-button>
                            <el-button type="primary" @click="getProjectMenus(getPageQuery)">搜索</el-button>
                        </div>
                    </div>
                    <div class="card-input">
                        <span>输入搜索：</span>
                        <el-input v-model="getPageQuery.likeProjectName" style="width: 240px" type="text"
                            placeholder="输入项目名" />
                    </div>
                </el-card>
            </template>
            <el-table :data="ProMenus" border style="width: 100%">
                <el-table-column prop="id" label="项目编号" width="100" align="center">
                </el-table-column>
                <el-table-column prop="proName" label="项目名称" width="200" align="center">
                </el-table-column>
                <el-table-column prop="type" label="项目类别" align="center">
                </el-table-column>
                <el-table-column prop="level" label="项目级别" align="center">
                </el-table-column>
                <el-table-column v-if="userStore?.userInfo?.roleId === 3" prop="academyId" label="所属学院" align="center">
                    <template #default="scope">
                        {{ userStore?.academyInfo?.[scope.row.academyId - 1]?.acadName || '未知学院' }}
                    </template>
                </el-table-column>
                <el-table-column prop="startime" label="预期开始日期" :formatter="timeFormatter" width="180" align="center">
                </el-table-column>
                <el-table-column prop="endtime" label="预期结束日期" :formatter="timeFormatter" width="180" align="center">
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center">
                    <template #default="scope">
                        <el-tag
                            :type="scope.row.status === '待审核' ? 'danger' : scope.row.status === '驳回' ? 'info' : scope.row.status === '结束' ? 'success' : 'warning'"
                            disable-transitions>{{ scope.row.status
                            }}</el-tag>
                    </template>


                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200" align="center" v-slot="scope">
                    <el-button @click="handleCheck(scope.row.id)" size="small">查看</el-button>
                    <template v-if="EditIsDisabled(scope.row.id) === true">
                        <el-tooltip class="box-item" effect="dark" content="编辑按钮已禁用" placement="bottom"><el-button
                                v-if="userStore.userInfo.roleId !== 3" type="primary" size="small"
                                :disabled="EditIsDisabled(scope.row.id)"
                                @click="handleEditPro(scope.row.id)">编辑</el-button></el-tooltip>
                    </template>
                    <template v-else>
                        <el-button v-if="userStore.userInfo.roleId !== 3" type="primary" size="small"
                            :disabled="EditIsDisabled(scope.row.id)" @click="handleEditPro(scope.row.id)">编辑</el-button>
                    </template>
                    <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
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
        <!-- 侧边栏展示 -->
        <el-drawer v-model="visible" class="drawer-content" title="项目详情：" direction="rtl" size="30%">
            <div class="drawer-btn" v-if="BtnVisible">
                <el-button type="danger" plain @click="RejectProReq(ProMenusList.id)">驳回申请</el-button>
                <el-button type="success" plain @click="PassProReq(ProMenusList.id)"> 审核通过
                </el-button>
            </div>

            <el-card style=" max-width: 480px" shadow="never">
                <ul>
                    <li class="drawer-item">项目编号：{{ ProMenusList.id }}</li>
                    <li class="drawer-item">项目名称：{{ ProMenusList.proName }}</li>
                    <li class="drawer-item">项目级别：{{ ProMenusList.level }}</li>
                    <li class="drawer-item">项目类型：{{ ProMenusList.type }}</li>
                    <li class="drawer-item">指导老师名称：{{ ProMenusList.teacherName }}</li>
                    <li class="drawer-item">指导老师手机号：{{ ProMenusList.teacherPhone }}</li>
                    <li class="drawer-item">项目成员：{{ ProMenusList.member }}</li>
                    <li class="drawer-item">开始时间：{{ timeFormatter(undefined, undefined, ProMenusList.startime) }}</li>
                    <li class="drawer-item">结束时间：{{ timeFormatter(undefined, undefined, ProMenusList.endtime) }}</li>
                    <li class="drawer-item">备注：{{ ProMenusList.remark }}</li>
                    <li class="drawer-item">项目附件：<a :href="ProMenusList.link">下载附件</a></li>
                </ul>
            </el-card>

            <!-- 提交中期、结题附件 -->
            <template v-if="ProMenusList.statusName !== statusMap.WAIT_AUDIT">
                <el-card v-if="userStore.userInfo.roleId !== 3" style="margin-top:20px " shadow="never">
                    <div style="height: 160px; max-width: 600px">
                        <el-steps direction="vertical" :active="activeBtn" finish-status="success">
                            <el-step title="提交中期检查材料">
                                <template #description>
                                    <el-button type="primary" plain :disabled="getMiddleStatus(ProMenusList.id)"
                                        @click="middleVisible = true">提交附件</el-button>
                                    <!-- <span v-if="ProMenusList.status === statusMap.REFUSE"></span>
                                    <span v-else-if="ProMenusList.middleCheckUrl">(已提交)</span>
                                    <span v-else>(未提交)</span> -->
                                </template>
                            </el-step>
                            <el-step title="提交结题材料">
                                <template #description>
                                    <el-button type="primary" plain :disabled="getEndStatus(ProMenusList.id)"
                                        @click="EndVisible = true">提交附件 </el-button>
                                    <!-- <span v-if="ProMenusList.status === statusMap.REFUSE"></span>
                                    <span v-else-if="ProMenusList.endUrl">(已提交)</span>
                                    <span v-else>(未提交)</span> -->
                                </template>
                            </el-step>
                        </el-steps>
                    </div>
                </el-card>
            </template>

            <!-- 下载中期、结题附件 -->
            <template v-if="ProMenusList.statusName !== statusMap.WAIT_AUDIT">
                <el-card v-if="userStore.userInfo.roleId === 3" style="margin-top:20px " shadow="never">
                    <div style="height: 160px; max-width: 600px">
                        <el-steps direction="vertical" :active="activeBtn" finish-status="success">
                            <el-step title="审核中期检查材料">
                                <template #description>
                                    <el-button type="text" :disabled="getMiddleStatus(ProMenusList.id)"><a
                                            :href="ProMenusList.middleCheckUrl">中期检查材料附件</a></el-button>
                                    <!-- <span v-if="ProMenusList.status === statusMap.REFUSE"></span> -->
                                    <!-- <span v-else-if="ProMenusList.middleCheckUrl">(已提交)</span> -->
                                    <span v-if="ProMenusList.middleCheckUrl">(已提交)</span>
                                    <span v-else>(未提交)</span>
                                </template>
                            </el-step>
                            <el-step title="审核结题材料">
                                <template #description>
                                    <el-button type="text" :disabled="getEndStatus(ProMenusList.id)"><a
                                            :href="ProMenusList.endUrl">结题材料附件</a></el-button>

                                    <!-- <span v-if="ProMenusList.status === statusMap.REFUSE"></span> -->
                                    <!-- <span v-else-if="ProMenusList.endUrl">(已提交)</span> -->
                                    <span v-if="ProMenusList.endUrl">(已提交)</span>
                                    <span v-else>(未提交)</span>
                                </template>
                            </el-step>
                        </el-steps>
                    </div>
                </el-card>
            </template>
        </el-drawer>
        <!-- 编辑弹窗 -->
        <el-dialog v-model="updateVisible" title="编辑项目信息" width="870">
            <el-form ref="proRuleRef" :rules="EditRules" :model="updateProForm" :inline="true" label-width="125px"
                class="pro-apply-form">
                <el-form-item label="项目名称" prop="proName">
                    <el-input v-model="updateProForm.proName"></el-input>
                </el-form-item>
                <el-form-item label="项目级别" prop="level">
                    <el-select style="width: 250px;" v-model="updateProForm.level" placeholder="请选择">
                        <el-option label="国家级" value="国家级" />
                        <el-option label="省级" value="省级" />
                        <el-option label="校级" value="校级" />
                    </el-select>
                </el-form-item>
                <el-form-item label="项目类型" prop="type">
                    <el-select style="width: 250px;" v-model="updateProForm.type" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.lable" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="指导老师名称" prop="teacherName">
                    <el-input v-model="updateProForm.teacherName"></el-input>
                </el-form-item>
                <el-form-item label="指导老师手机号" prop="teacherPhone">
                    <el-input v-model="updateProForm.teacherPhone"></el-input>
                </el-form-item>
                <el-form-item label="项目成员" prop="member">
                    <el-input v-model="updateProForm.member"></el-input>
                </el-form-item>
                <el-form-item label="预期开始时间" prop="startime">
                    <el-date-picker type="date" style="width: 250px;" placeholder="请选择日期"
                        v-model="updateProForm.startime"></el-date-picker>
                </el-form-item>
                <el-form-item label="预期结束时间" prop="endtime">
                    <el-date-picker type="date" style="width: 250px;" placeholder="请选择日期"
                        v-model="updateProForm.endtime"></el-date-picker>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input style="width: 250px;" rows="10" v-model="updateProForm.remark" type="textarea"></el-input>
                </el-form-item>
                <el-form-item class="upload-demo">
                    <el-upload v-model="updateProForm.link" drag :on-success="handleFileSuccess"
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

            </el-form>
            <template #footer>
                <div>
                    <el-button @click="updateVisible = false">取消</el-button>
                    <el-button type="primary" @click="onSubmit(proRuleRef)">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 上传中期附件-->
        <el-dialog v-model="middleVisible" title="上传附件信息">
            <el-upload v-model="ProMenusList.middleCheckUrl" drag :on-success="handleFileUpload"
                action="http://127.0.0.1:5173/api/file/uploadFile" multiple aria-required="true">
                <el-icon class="el-icon--upload">
                    <IEpUploadFilled />
                </el-icon>
                <div> 将文件拖到此处，或 <em>点击上传</em></div>
                <template #tip>
                    <div> jpg/png文件小于500kb</div>
                </template>
            </el-upload>
            <template #footer>
                <div>
                    <el-button @click="middleVisible = false">取消</el-button>
                    <el-button type="primary" @click="onMiddleSubmit(ProMenusList.id)">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 上传结题附件-->
        <el-dialog v-model="EndVisible" title="上传附件信息">
            <el-upload v-model="ProMenusList.endUrl" drag :on-success="handleEndFileUpload"
                action="http://127.0.0.1:5173/api/file/uploadFile" multiple aria-required="true">
                <el-icon class="el-icon--upload">
                    <IEpUploadFilled />
                </el-icon>
                <div> 将文件拖到此处，或 <em>点击上传</em></div>
                <template #tip>
                    <div> jpg/png文件小于500kb</div>
                </template>
            </el-upload>
            <template #footer>
                <div>
                    <el-button @click="EndVisible = false">取消</el-button>
                    <el-button type="primary" @click="onEndSubmit(ProMenusList.id)">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>



    </div>
</template>
  


<style scoped lang="scss">
.pro-apply-form .el-input {
    --el-input-width: 250px;
}

.pro-apply-form .el-select {
    --el-select-width: 250px;
}

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

.drawer-content {
    .drawer-item {
        padding-bottom: 20px;
        color: #72767b;
    }
}

a {
    text-decoration: none;
}

.drawer-btn {
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
}

//上传文件
.upload-demo {
    margin-left: 30px;
    margin-top: 20px;
}
</style>
