// 导入request对象
import request from '../utils/request';

type Common = {
    code:number
    data:object
    msg:string
}

//Partial<applyOrEditMenu>(每一项都加入可选？) Pick<applyOrEditMenu,"id" | "name"> & {id?: number}---id可选-(将我想要的挑选出来)
//Omit<applyOrEditMenu, "id" | "name">(将不要的去掉某几个)
export type ProjectList = {
    academyId:number,
    endUrl:string,//结题链接
    endtime:string,
    id:number,
    level:string,
    link:string,
    member:string,
    middleCheckUrl:string, //中期检查链接
    proName:string,
    remark:string,
    startime:string,
    status:string,
    statusName:string,
    teacherName:string,
    teacherPhone:string,
    type:string,
    userId:number
    username:string,
}

export type ProjectApplyList = Partial<ProjectList>;

// 申请项目
export const getApplyPro = (menuInfo : ProjectApplyList) => {
    return request<Common<boolean>>({
        method:"POST",
        url:"/project/apply",
        data:menuInfo,
    })
}

//项目详情页面
export type ProjectAuditingList = Pick<ProjectList,"id" | "proName" | "type" | "level" | "academyId" | "username" | "startTime" | "endTime" | "status" | "endUrl" | "middleCheckUrl">

//查询条件
export type ProCondition = {
    likeProjectName:string,
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
//获取整个项目数据
export const getAllProMenu = (condition: ProCondition) => {
    return request<Common<ProjectAuditingList[]>>({
        method:"POST",
        url:"/project/pageQuery",
        data:condition
    })
}

export type StatusCondition = {
    id: number
    acceptFlag: boolean
}

//查看项目中的审核信息
export const getStatusAudit = (condition:StatusCondition) => {
    return request({
        method:"POST",
        url:"/project/audit",
        data:condition
    })
}

//中期-结题申请
export type FileUrlList = {
    id: number,
    middleCheckUrl:string,
    endUrl:string
}
export const getFileUrl = (condition:FileUrlList) => {
    return request({
        method:"POST",
        url:"/project/uploadAttachment",
        data:condition
    })
}

 export type EditMenuList = Pick<ProjectList, "id" | "proName" | "level" | "link" | "member" | "type" | "teacherName" | "teacherPhone" |"startime" | "endtime" | "remark" >
//更新项目
export const getProjectUpdate = (updateProjectItem:EditMenuList) => {
    return request<Common<ProjectApplyList>>({
        method:"POST",
        url:"/project/update",
        data:updateProjectItem
    })
}



//删除
export const DeleteProMsg = (id: number) => {
    return request<Common<boolean>>({
        method:"POST",
        url:'/project/delete',
        headers: {
            'Content-Type': 'application/json' 
          },
        data:{
            id
        }
    })
}

