// 导入request对象
import request from '../utils/request';

type Common<T> = {
    code:number
    data:object
    msg:string
}

export type RolesList = {
    id:number
    rolesName:string
    remark:string
    createTime:string
    updateTime:string
}

//查询条件
export type GetPage = {
    pageNo:number,
    pageSize:number
}

export type RolesCondition = Partial<{
    likeRoleName:string
    page:GetPage
}>

//分页信息
export type GETPageList = {
    curPage:number
    firstPage:boolean
    lastPage:boolean
    pageSize:number
    sort:string
    totalPage:number
    totalSize:number
}

// 获取角色信息
export const getSystemRole = (condition:RolesCondition) => {
    return request({
        method:"POST",
        url:"/role/pageQuery",
        data:condition,
    })
}

export type AddRoleItem = Pick<RolesList,  "rolesName" | "remark"> 
// 添加角色信息
export const getRoleAdd = (condition:AddRoleItem) => {
    return request<Common<boolean>>({
        method:"POST",
        url:"/role/add",
        data:condition
    })
}

export type UpdateRoleItem = Pick<RolesList,  "rolesName" | "remark"> & {roleId:number}

//更新角色信息
export const getRoleUpdate = (condition:UpdateRoleItem) => {
    return request<Common<boolean>>({
        method:"POST",
        url:"/role/update",
        data:condition
    })
}

//删除角色信息
export const DeleteRolesMsg = (id:number) => {
    return request<Common<boolean>>({
        method:"POST",
        url:'/role/delete',
        data:{
            id
        }
    })
}