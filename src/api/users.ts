// 导入request对象
import { type } from 'os';
import request from '../utils/request';
import { useTokenStore } from '@/stores/mytoken';

// 提取公共类型
type CommonReturn = {
    code:number,
    msg:string,
    data:object,
}

//用户列表
export type UserList = Partial<{
    academyId:number,
    birthday:string,
    educational:string,
    id:number,
    img:string,
    major:string,
    password:string,
    phone:string,
    remark:string
    roleId:number,
    roleName:string,
    username:string,
    sex:string,
}>

// 类型定义 - 用户登录 - 传递的数据类型
export type LoginInfo = Pick<UserList, "username" | "password">

// 类型定义 - 用户登录 - 返回的数据类型
// type LoginResult = CommonReture
// 封装login接口函数，并导出
export const login = (loginInfo: LoginInfo) => {
    return request<CommonReture>({
        method:'POST',
        url:"/user/login",
        data:loginInfo,
    })
}

// 类型定义 - 用户登录 - 传递的数据类型
export type RegisterInfo = Pick<UserList, "username" | "password" | "academyId">
//用户注册
export const register = (register: RegisterInfo) => {
    return request<CommonReture>({
        method:'POST',
        url:"/user/register",
        data:register,
    })
}

// 类型定义 - 获取数据 - 传递的数据类型
type UserInfo = CommonReture<{
    isUpdatedPassword:boolean
    portrait:string
    username:string
}>
//获取用户信息
export const getInfo = () => {
    return request<UserInfo>({
        mathod:"GET",
        url:'/user/getInfo',

    })
}

//退出操作
export const logout = () => {
    return request({
        method:"POST",
        url:'/user/logout'
    })
}

//获取完整用户列表
export const getUserMenu = () => {
    return request<Common<UserList[]>>({
        method:'GET',
        url:"/user/getUserList"
    })
}

//获取学院列表信息
export const getAcademyList = () => {
    return request({
        method:"POST",
        url:"/academy/queryList"
    })
}

//查询条件
export type GetPage = {
    pageNo:number,
    pageSize:number
}

export type UserCondition = Partial<{
    likeUserName:string
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

//获取用户列表
export type UserPowerList = pick<UserList, "id" | "username" | "academyId" | "phone" | "roleName">
export const getUserPowerMenus = (condition:UserCondition) => {
    return request({
        method:"POST",
        url:"/user/query",
        data:condition
    })
}
export type UserRoleCondition = {
    roleId:number
    userId:number
}

export type EditUserList = pick<UserList, "roleId" | "id" | "roleName" | "username">
//更新用户角色信息
export const updateUserList = (condition:UserRoleCondition) => {
    return request({
        method:"POST",
        url:"/user/updateRole",
        data:condition
    })
}
//删除用户信息
export const DeleteUserMsg = (id:number) => {
    return request({
        method:"POST",
        url:"/user/delete",
        data:{
            id
        }
    })
}

//刷新token
// type RToken = CommonReture<string>

// let promiseRT: Promise<any>
// let isRefreshing = false
// export const refreshToken = () => {
//     //防止多次promise请求
//     if(isRefreshing) {
//         return promiseRT
//     }
//     isRefreshing = true
//     promiseRT = request<CommonReture>({
//         method:"POST",
//         url:"/user/refreshToken",
//         params:{
//             refreshtoken:useTokenStore().token?.refresh_token
//         }
//     }).finally(() => {
//         isRefreshing = false
//     })
//     return promiseRT
// }


