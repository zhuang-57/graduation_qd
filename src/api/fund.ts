// 导入request对象
import request from '../utils/request';
import { Condition } from './system';

type Common<T> = {
    code:number
    data:T
    message:string
}

export type FundList = {
    id:number,
    proId:number,
    proName:string,
    fund:number,
    userId:number,
    account:string,
    remark:string,
    status:string,
    createTime:string
}

// 申请经费
export type FundItemMenu = Pick<FundList, "proId" | "fund" | "remark" | "account">

export const getFundApply = (menuInfo : FundItemMenu) => {
    return request({
        method:"POST",
        url:"/fund/apply",
        data:menuInfo,
    })
}

//查询条件
export type FundCondition = {
    proName:string,
    page:GetPage
}
export type GetPage = {
    pageNo:number,
    pageSize:number
}

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


export type FundApplyList = Partial<FundList>;

//获取所有经费信息
export const getFundQuery = (condition:FundCondition) => {
    return request({
        method:"POST",
        url:"/fund/pageQuery",
        data:condition
    })
}

//审核经费信息

export type AuditFundCondition = {
    fundId:number,
    acceptFlag:boolean
}
export const getAuditFund = (condition: AuditFundCondition) => {
    return request({
        method:"POST",
        url:"/fund/audit",
        data:condition
    })
}

//撤回经费申请信息
export const DeleteFundMsg = (id:string) => {
    return request<Common<boolean>>({
        method:"POST",
        url:'/fund/cancel',
        data:{
            id
        }
    })
}
