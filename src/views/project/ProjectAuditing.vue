<script setup lang="ts">
import { ProCondition, GetPage, ProjectApplyList, GETPageList, EditMenuList, getProjectUpdate, getAllProMenu, DeleteProMsg } from "../../api/project"
import { FormInstance, FormRules } from 'element-plus';
import router from "../../router/index"
import { timeFormatter } from "../../utils/timeFormatter"
import { reactive } from 'vue';

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



//获取项目列表数据
const ProMenus = ref([] as ProjectApplyList[])
const getProjectMenus = async (proQuery: ProCondition) => {
    Object.assign(getPageQuery, proQuery);
    const { data } = await getAllProMenu(getPageQuery);
    //获取数据成功
    if (data.code === 0) {
        ProMenus.value = data.data.data;
        Object.assign(pageList, data.data.page);
    } else {
        ElMessage.error('获取项目详细信息失败！')
        throw new Error("获取项目详细信息失败！")
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

const updateVisible = ref(false);
//编辑项目
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

//(1)编辑表单
const handleEditPro = async (id: number) => {
    updateVisible.value = true;
    const getProItem = ProMenus.value.find((item) => item.id === id)
    Object.assign(updateProForm, getProItem);
}

//文件上传
const FileList = ref([]);

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
        updateProForm.link = response.data.newName;
    } else {
        ElMessage.error("文件上传失败！")
        return new Error("文件上传失败！")
    }
}

//表单验证
const proRuleRef = ref<FormInstance>();
//(2)表单提交
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
const visible = ref(false);
const handleCheck = (id: number) => {
    const getProItem = ProMenus.value.find((item) => item.id === id)
    Object.assign(updateProForm, getProItem);
    visible.value = true;
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
            ElMessage.success("删除项目成功！");
        })
    } else {
        ElMessage.error("删除项目失败！");
    }
}

// const formatStatus = (status: string) => {
//     switch (status) {
//         case "WAIT_AUDIT":
//             return "未审核";
//         default:
//             return status;
//     }
// }

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
                            placeholder="输入角色名" />
                    </div>
                </el-card>
            </template>
            <el-table :data="ProMenus" border style="width: 100%">
                <el-table-column prop="id" label="项目编号" width="120" align="center">
                </el-table-column>
                <el-table-column prop="proName" label="项目名称" width="220" align="center">
                </el-table-column>
                <el-table-column prop="type" label="项目类别" width="150" align="center">
                </el-table-column>
                <el-table-column prop="level" label="项目级别" align="center">
                </el-table-column>
                <el-table-column prop="startime" label="预期开始日期" :formatter="timeFormatter" width="180" align="center">
                </el-table-column>
                <el-table-column prop="endtime" label="预期结束日期" :formatter="timeFormatter" width="180" align="center">
                </el-table-column>
                <el-table-column prop="statusName" label="状态" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200" align="center" v-slot="scope">
                    <el-button @click="handleCheck(scope.row.id)" size="small">查看</el-button>
                    <el-button type="primary" size="small" @click="handleEditPro(scope.row.id)">编辑</el-button>
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

            <el-card style="max-width: 480px" shadow="never">
                <p class="drawer-item">项目编号：{{ updateProForm.id }}</p>
                <p class="drawer-item">项目名称：{{ updateProForm.proName }}</p>
                <p class="drawer-item">项目级别：{{ updateProForm.level }}</p>
                <p class="drawer-item">项目类型：{{ updateProForm.type }}</p>
                <p class="drawer-item">指导老师名称：{{ updateProForm.teacherName }}</p>
                <p class="drawer-item">指导老师手机号：{{ updateProForm.teacherPhone }}</p>
                <p class="drawer-item">项目成员：{{ updateProForm.member }}</p>
                <p class="drawer-item">开始时间：{{ timeFormatter(undefined, undefined, updateProForm.startime) }}</p>
                <p class="drawer-item">结束时间：{{ timeFormatter(undefined, undefined, updateProForm.endtime) }}</p>
                <p class="drawer-item">备注：{{ updateProForm.remark }}</p>
                <p class="drawer-item">项目附件：<a :href="updateProForm.link">附件</a></p>


            </el-card>
            <div style="margin-top: 10px;">
                <el-button type="danger">驳回申请</el-button>
                <el-button type="primary">审核通过</el-button>
            </div>
        </el-drawer>
        <!-- 编辑弹窗 -->
        <el-dialog v-model="updateVisible" title="编辑项目信息" min-width="500">
            <el-form ref="proRuleRef" :model="updateProForm" :inline="true" label-width="100px" class="pro-apply-from">
                <el-form-item label="项目名称" prop="proName">
                    <el-input v-model="updateProForm.proName"></el-input>
                </el-form-item>
                <el-form-item label="项目级别" prop="level">
                    <el-select v-model="updateProForm.level" placeholder="请选择">
                        <el-option label="国家级" value="国家级" />
                        <el-option label="省级" value="省级" />
                        <el-option label="校级" value="校级" />
                    </el-select>
                </el-form-item>
                <el-form-item label="项目类型" prop="type">
                    <el-select v-model="updateProForm.type" placeholder="请选择">
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
                    <el-date-picker type="date" placeholder="请选择日期" v-model="updateProForm.startime"></el-date-picker>
                </el-form-item>
                <el-form-item label="预期结束时间" prop="endtime">
                    <el-date-picker type="date" placeholder="请选择日期" v-model="updateProForm.endtime"></el-date-picker>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="updateProForm.remark" type="textarea"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-upload v-model="updateProForm.link" class="upload-demo" drag :on-success="handleFileSuccess"
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
                <div class="dialog-footer">
                    <el-button @click="updateVisible = false">取消</el-button>
                    <el-button type="primary" @click="onSubmit(proRuleRef)">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
  


<style scoped lang="scss">
.pro-apply-from {
    width: 80%;
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
</style>
