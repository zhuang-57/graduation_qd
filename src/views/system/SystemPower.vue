<script setup lang="ts">
import { reactive } from 'vue';
import { getUserPowerMenus, DeleteUserMsg, updateUserList } from "../../api/users"
import type { GetPage, UserCondition, GETPageList, UserPowerList, EditUserList, UserRoleCondition } from "../../api/users"
import { FormInstance, FormRules } from 'element-plus';
import type { RolesCondition } from '../../api/system'
import { getSystemRole } from '../../api/system'
//分页查询条件
const page = reactive<GetPage>(
    {
        pageNo: 1,
        pageSize: 5
    }
)
const getPageQuery = reactive<UserCondition>({
    likeUsername: '',
    page
})

const getRolePageQuery = reactive<RolesCondition>({
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

//获取用户列表数据
const UserMenus = ref([] as UserPowerList[])
const getUserMenus = async (userQuery: UserCondition) => {
    Object.assign(getPageQuery, userQuery)
    const { data } = await getUserPowerMenus(getPageQuery);
    // 获取数据成功
    if (data.code === 0) {
        UserMenus.value = data.data.data;
        Object.assign(pageList, data.data.page);
    } else {
        ElMessage.error('获取用户列表失败！')
        throw new Error("获取用户列表失败！")
    }
}
getUserMenus(getPageQuery)

//分页设置
const handleSizeChange = (sizePage: number) => {
    getPageQuery.page.pageSize = sizePage
    getUserMenus(getPageQuery)
}

const handleCurrentChange = (pageNo: number) => {
    getPageQuery.page.pageNo = pageNo
    getUserMenus(getPageQuery)
}

//编辑用户角色信息
const updateVisible = ref(false);

const updateUserForm = reactive<EditUserList>({
    id: 1,
    roleName: '',
    roleId: 1,
    username: '',
})

//编辑用户请求参数
const updateUserReq = reactive<UserRoleCondition>({
    userId: 1,
    roleId: 1
})

//编辑用户角色信息

//获取角色信息
interface ListItem {
    label: string
    value: string
}

const UserRoleOption = ref<ListItem[]>([])
const handleEditUser = async (id: number) => {
    updateVisible.value = true;
    const getUserItem = UserMenus.value.find((item) => item.id === id)
    Object.assign(updateUserForm, getUserItem);

    //获取角色信息
    const { data } = await getSystemRole(getRolePageQuery);
    if (data.code === 0) {
        UserRoleOption.value = data.data.data.map((item) => {
            return { label: item.rolesName, value: item.id }
        })
    }
}

//重置内容
const resetContent = async () => {
    if (getPageQuery.likeUsername.trim()) {
        getPageQuery.likeUsername = "";
    }
}


//表单提交
const userRuleRef = ref<FormInstance>()
const onSubmit = async (userForm: FormInstance | undefined) => {
    if (!userForm) return
    //todo
    await userForm.validate().catch((err) => {
        ElMessage.error("有必填项未填写！")
        throw err;
    })
    updateUserReq.roleId = updateUserForm.roleId;
    updateUserReq.userId = updateUserForm.id;

    const { data } = await updateUserList(updateUserReq).finally(() => {
        updateVisible.value = false;
    })
    console.log(data);


    if (data.code === 0) {
        ElMessage.success("修改用户角色成功！");
        getUserMenus(getPageQuery)
    } else {
        ElMessage.error(data.msg)
        throw new Error("修改用户角色失败！")
    }
}

//删除用户信息
const handleDelete = async (id: number) => {
    await ElMessageBox.confirm("确定要删除这个用户吗？", "删除提示：", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
    }).catch(() => {
        ElMessage.info('删除用户被取消！');
        return new Promise(() => { })
    })

    //调用接口函数
    const { data } = await DeleteUserMsg(id);
    if (data.code === 0) {
        ElMessage.success("删除用户成功！");
        getUserMenus(getPageQuery)
    } else {
        ElMessage.error(data.msg);
    }
}

</script>

<template>
    <div class="content">
        <el-card style="min-width: 480px">
            <template #header>
                <div>
                    <div style="margin-bottom: 20px;">用户列表</div>
                    <el-card shadow="never">
                        <div class="card-content">
                            <div class="card-icon">
                                <el-icon size="20" style="padding-right:5px ;">
                                    <IEpSearch />
                                </el-icon><span>筛选搜索</span>
                            </div>
                            <div>
                                <el-button @click="resetContent">重置</el-button>
                                <el-button type="primary" @click="getUserMenus(getPageQuery)">查询</el-button>
                            </div>
                        </div>
                        <div class="card-input">
                            <span>输入搜索：</span>
                            <el-input v-model="getPageQuery.likeUsername" style="width: 240px" type="text"
                                placeholder="输入用户名" />
                        </div>
                    </el-card>
                </div>
            </template>
            <el-table :data="UserMenus" border style="width: 100%">
                <el-table-column prop="id" label="用户ID" width="100" align="center">
                </el-table-column>
                <el-table-column prop="username" label="用户名" align="center">
                </el-table-column>
                <el-table-column prop="academyId" label="所属学院" align="center">
                </el-table-column>
                <el-table-column prop="roleName" label="角色名称" align="center">
                </el-table-column>
                <el-table-column prop="phone" label="手机号" align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200" align="center" v-slot="scope">
                    <el-button type="primary" size="small" @click="handleEditUser(scope.row.id)">编辑</el-button>
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

        <!-- 编辑弹窗 -->
        <el-dialog v-model="updateVisible" title="修改用户角色" min-width="500">
            <el-form ref="userRuleRef" :model="updateUserForm" :inline="true" label-width="100px" class="pro-apply-from">
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="updateUserForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleId">
                    <el-select v-model="updateUserForm.roleId" clearable placeholder="请选择一个角色" style="width: 240px">
                        <el-option v-for="item in UserRoleOption" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>

            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="updateVisible = false">取消</el-button>
                    <el-button type="primary" @click="onSubmit(userRuleRef)">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>
  


<style scoped lang="scss">
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

.card-input {
    margin-left: 40px;
    font-size: 14px;
}
</style>
