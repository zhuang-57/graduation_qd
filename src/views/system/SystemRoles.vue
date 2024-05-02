<script setup lang="ts">
import { getSystemRole, getRoleUpdate, DeleteRolesMsg, getRoleAdd } from "../../api/system";
import type { RolesCondition, RolesList, GetPage, GETPageList, UpdateRoleItem, AddRoleItem } from "../../api/system"
import { timeFormatter } from "../../utils/timeFormatter"
import { FormInstance } from 'element-plus';
//分页查询条件
const page = reactive<GetPage>(
    {
        pageNo: 1,
        pageSize: 5
    }
)

const getPageQuery = reactive<RolesCondition>({
    likeRoleName: '',
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

//获取角色列表
const RolesMenus = ref([] as RolesList[])
const getRolesMenus = async (rolesQuery: RolesCondition = {}) => {
    Object.assign(getPageQuery, rolesQuery);
    const { data } = await getSystemRole(getPageQuery);
    //获取数据成功
    if (data.code === 0) {
        RolesMenus.value = data.data.data;
        Object.assign(pageList, data.data.page)
    } else {
        ElMessage.error('获取角色信息失败！')
        throw new Error("获取角色信息失败！")
    }
}
getRolesMenus(getPageQuery)

//分页设置
const handleSizeChange = (sizePage: number) => {
    getPageQuery.page.pageSize = sizePage
    getRolesMenus(getPageQuery)
}

const handleCurrentChange = (pageNo: number) => {
    getPageQuery.page.pageNo = pageNo
    getRolesMenus(getPageQuery)
}

//重置内容
const resetContent = async () => {
    if (getPageQuery.likeRoleName.trim()) {
        getPageQuery.likeRoleName = "";
    }
}
//添加
const addRolesMenus = reactive<AddRoleItem>({
    rolesName: '',
    remark: '',
})


//添加角色
let addVisible = ref(false)
const roleAddRuleRef = ref<FormInstance>()
const handleAddItem = async (RoleFrom: FormInstance | undefined) => {
    if (!RoleFrom) return
    await RoleFrom.validate().catch((err) => {
        ElMessage.error("有必填项未填写！");
        throw err
    })
    const { data } = await getRoleAdd(addRolesMenus).finally(() => {
        RoleFrom.resetFields()
        addVisible.value = false;
    });
    if (data.code === 0) {
        getRolesMenus(getPageQuery)
    } else {
        ElMessage.error("添加角色信息失败！");
        throw new Error("添加角色信息失败")
    }
}

//编辑
let updateVisible = ref(false)
const roleRuleRef = ref<FormInstance>()

const updateRolesMenus = reactive<UpdateRoleItem>({
    roleId: 1,
    rolesName: '',
    remark: '',
})
//编辑内容
const EditForm = ref([] as RolesCondition[])

const handleEditRole = async (id: number) => {
    updateVisible.value = true;
    const getRoleItem = RolesMenus.value.find((item) => item.id === id)
    updateRolesMenus.roleId = getRoleItem.id
    Object.assign(updateRolesMenus, getRoleItem)
    console.log(updateRolesMenus);

}

//提交更新内容
const handleUpdateItem = async (RoleFrom: FormInstance | undefined) => {
    if (!RoleFrom) return
    await RoleFrom.validate().catch((err) => {
        ElMessage.error("有必填项未填写！");
        throw err
    })
    const { data } = await getRoleUpdate(updateRolesMenus).finally(() => {
        updateVisible.value = false;
    });
    if (data.code === 0) {
        getRolesMenus(getPageQuery)
    } else {
        ElMessage.error("更新角色信息失败！");
        throw new Error("更新角色信息失败")
    }
}
//删除数据
const handleDeleteRole = async (id: number) => {
    await ElMessageBox.confirm("确定要删除这个角色信息吗？", "删除提示：", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).catch(() => {
        ElMessage.info('删除角色信息被取消！');
        return new Promise(() => { })
    })

    //调用接口函数
    const { data } = await DeleteRolesMsg(id);
    console.log(data);
    if (data.code === 0) {
        ElMessage.success("删除角色成功！");
        getRolesMenus(getPageQuery)
    } else {
        ElMessage.error("删除角色失败！");
    }
}
</script>

<template>
    <el-card style="min-width: 480px">
        <!-- 头部搜索 -->
        <template #header>
            <div>
                <el-card shadow="never">
                    <div class="card-content">
                        <div class="card-icon">
                            <el-icon size="20" style="padding-right:5px ;">
                                <IEpSearch />
                            </el-icon><span>筛选搜索</span>
                        </div>
                        <div>
                            <el-button @click="resetContent">重置</el-button>
                            <el-button type="primary" @click="getRolesMenus()">搜索</el-button>
                        </div>
                    </div>
                    <div class="card-input">
                        <span>输入搜索：</span>
                        <el-input v-model="getPageQuery.likeRoleName" style="width: 240px" type="text"
                            placeholder="输入角色名" />
                    </div>
                </el-card>
            </div>
        </template>
        <!-- 中间添加按钮 -->
        <el-card shadow="never" style="margin-bottom: 20px;">
            <div class="role-list">
                <div> 角色列表 </div>
                <div>
                    <el-button plain @click=" addVisible = true">添加</el-button>
                </div>
            </div>
        </el-card>
        <!-- 尾部表单 -->
        <el-table :data="RolesMenus" border style="width: 100%">
            <el-table-column prop="id" label="角色ID" width="100" align="center" />
            <el-table-column prop="rolesName" label="角色名称" align="center" />
            <el-table-column prop="createTime" label="创建时间" width="200" :formatter="timeFormatter" align="center" />
            <el-table-column prop="updateTime" label="更新时间" width="200" :formatter="timeFormatter" align="center" />
            <el-table-column prop="remark" label="描述" align="center" />
            <el-table-column label="操作" align="center" v-slot="scope">
                <el-button type="primary" @click="handleEditRole(scope.row.id)">编辑</el-button>
                <el-button type="danger" @click="handleDeleteRole(scope.row.id)">删除</el-button>
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
    <!-- 添加 -->
    <el-dialog v-model="addVisible" title="添加角色" width="500">
        <el-form :model="addRolesMenus" ref="roleAddRuleRef">
            <el-form-item label="角色名称:" prop="rolesName" label-width="80">
                <el-input v-model="addRolesMenus.rolesName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="角色描述:" prop="remark" label-width="80">
                <el-input v-model="addRolesMenus.remark" type="textarea" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addVisible = false">取消</el-button>
                <el-button type="primary" @click="handleAddItem(roleAddRuleRef)">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog v-model="updateVisible" title="编辑角色" width="500">
        <el-form :model="updateRolesMenus" ref="roleRuleRef">
            <el-form-item label="角色Id:" prop="roleId" label-width="80">
                <!-- <el-input v-model="updateRolesMenus.roleId" disabled></el-input> -->
                {{ updateRolesMenus.roleId }}
            </el-form-item>
            <el-form-item label="角色名称:" prop="rolesName" label-width="80">
                <el-input v-model="updateRolesMenus.rolesName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="角色描述:" prop="remark" label-width="80">
                <el-input v-model="updateRolesMenus.remark" type="textarea" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="updateVisible = false">取消</el-button>
                <el-button type="primary" @click="handleUpdateItem(roleRuleRef)">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
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

.role-list {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-input {
    margin-left: 40px;
    font-size: 14px;
}

.pagination {
    display: flex;
    justify-content: center;
}
</style>
 