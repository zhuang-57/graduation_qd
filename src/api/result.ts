// 导入request对象
import { number } from 'echarts';
import request from '../utils/request';

export type ResultList = {
    id:number,
    userId:number,
    academyId:number,
    proName:string,
    remark:string,
    status:string
    resultType:string,
    createTime:string,
}

// 申请成果类型
export type ResultApply = {
    projectId:number,
    proName:string,
    resultType:string,
    remark:string,
}
// 申请成果
export const getResultApply = (condition:ResultApply) => {
    return request({
        method:"POST",
        url:"/result/apply",
        data:condition
    })
}

//查询条件
export type ResultCondition = {
    likeProName:string,
    resultType:string,
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

//获取所有成果列表
export const getResultQuery = (condition:ResultCondition) => {
    return request({
        method:"POST",
        url:"/result/pageQuery",
        data:condition
    })
}

//审核成果信息

export type AuditResultCondition = {
    resultId:number,
    acceptFlag:boolean
}
export const getAuditResult = (condition: AuditResultCondition) => {
    return request({
        method:"POST",
        url:"/result/audit",
        data:condition
    })
}


//撤回申请信息
export const CancelResultMsg = (id:string) => {
    return request({
        method:"POST",
        url:'/result/cancel',
        data:{
            id
        }
    })
}


export interface AcademyAnalyses {
    academyId:number;
    monthCntList:number[];
}

export interface QuarterAnalyses {
    cnt:number;
    quarter:string;
}

export interface TypeAnalyses {
    cnt:number;
    resultType:string;
    resultTypeName:string;
}

export type ChartLists = {
    resultAcademyAnalyses:AcademyAnalyses[],
    resultQuarterAnalyses:QuarterAnalyses[],
    resultTypeAnalyses:TypeAnalyses[]

}
// 成果数据
export const getResultChart = () => {
    return request({
        method:"POST",
        url:'/result/analysis',
    })
}