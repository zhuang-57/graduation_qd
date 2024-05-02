import Mock from 'mockjs'
let id = Mock.mock("@id")
 
 //登录
const loginResp = function() {
    const a = Mock.mock({
        code:0,
        msg:"请求成功",
        data:"{\"token\":\"abscjhs329vhksehun11\"}"
        // content:"{\"access_token\":\"nfdkngslef\",\"token_type\":\"dmfjrsd\",\"refresh_type\":\"fnewoifn\",\"exprire_in\":3924,\"user_id\":\"sdmnk\"}",
    })
    return a;
}
//获取用户页面显示信息
const userHeader = function() {
    const a = Mock.mock({
        code:0,
        msg:'请求成功',
        data: {
            isUpdatedPassword:true,
            // portrait:'https://p9.itc.cn/images01/20230903/f52f8ccd912441448e8d0e838d71d961.jpeg',
            portrait:'',
            userName:'向建南'
        }
        })

        return a
}

//用户登出
const userLogout = function() {
    const a = Mock.mock({
        code:0,
        msg:'请求成功',
        data:true,
    })
    return a;
}

//更新token
// const refreshToken = function() {
//     const a = Mock.mock({
//         code:0,
//         msg:"请求成功",
//         // token:"{\"access_token\":\"nfdkngslef\",\"token_type\":\"dmfjrsd\",\"refresh_type\":\"fnewoifn\",\"exprire_in\":3924,\"user_id\":\"sdmnk\"}",
//         token:"32vjdfieh849042u",
//     })
//     return a
// }

//获取用户详情列表
const getAllUserList = function() {
    const a = Mock.mock({
        code:0,
        msg:"请求成功！",
        data:[
            {id:1,username:"向建南",password:"111111",sex:"女",birthday:"2001-09-03",img:"https://p9.itc.cn/images01/20230903/f52f8ccd912441448e8d0e838d71d961.jpeg",academy_id:1,educational:"本科",major:"物联网工程",phone:"17752797812",remark:"关关难过关关过，步步难行步步行！"},
        ]
    })
}
//project模块
//申请项目
const getProjectAdd = function() {
    const a = Mock.mock({
        code: 0,
        data:true,
        message:"处理成功！",
    })
    return a;
}

//编辑项目
const getEditId = function(){
    const a = Mock.mock({
        code:0,
        data:{
            menuInfo:{id:"@id()", name:"关于高校科研系统项目的研究",belong:"二级院校",academy:"信息工程学院", type:"B类",teacher:"聂作财", director:'@cname',member:"张三", startTime:'@date()',endTime:'@date()',book:"book"},
        },
        message:"处理成功！"
    })
    return a;
}
//项目详情
const getProAuditing = function() {
    const a = Mock.mock({
        code:0,
        data:[
            {id:'@id()', name:"关于高校科研系统项目的研究",academy:"信息工程学院", type:"B类", director:"向建南", startTime:'@date()',endTime:'@date()',status:"未审核"},
            {id:"@id()", name:"关于高校科研系统项目的研究",academy:"信息工程学院", type:"B类", director:'@cname', startTime:'@date()',endTime:'@date()',status:"未审核"},
            {id:"@id()", name:"关于高校科研系统项目的研究",academy:"信息工程学院", type:"B类", director:'@cname', startTime:'@date()',endTime:'@date()',status:"未审核"},
            {id:"@id()", name:"关于高校科研系统项目的研究",academy:"信息工程学院", type:"B类", director:'@cname', startTime:'@date()',endTime:'@date()',status:"未审核"},
            {id:"@id()", name:"关于高校科研系统项目的研究",academy:"信息工程学院", type:"B类", director:'@cname', startTime:'@date()',endTime:'@date()',status:"未审核"},
        ],
        message:"处理成功！"
    })
    return a;
}

//删除项目信息
const DeleteProject = function(id) {
    const a = Mock.mock(id,{
        code:0,
        data:true,
        message:"处理成功！"
    })
    return a;
}

//经费模块
const getFundApplyMenu = function() {
    const a = Mock.mock({
        code:0,
        data:true,
        message:"处理成功！"
    })
    return a;
}

//获取经费列表
const getAllFundMenus = function() {
    const a = Mock.mock({
        code:0,
        data:[
            {id:'@id()', name:"关于高校科研系统项目的研究",money:50000, startTime:'@date()',type:"国家级", book:"设备器材、交通费",status:true},
            {id:'@id()', name:"关于高校科研系统项目的研究",money:300000, startTime:'@date()',type:"省级", book:"设备器材、交通费",status:true},
            {id:'@id()', name:"关于高校科研系统项目的研究",money:80000, startTime:'@date()',type:"国家级", book:"设备器材、交通费",status:false},
            {id:'@id()', name:"关于高校科研系统项目的研究",money:150000, startTime:'@date()',type:"校级", book:"设备器材、交通费",status:true},
            {id:'@id()', name:"关于高校科研系统项目的研究",money:4000, startTime:'@date()',type:"国家级",book:"设备器材、交通费",status:false},
            
        ],
        message:"处理成功！",
    })
    return a;
}

//修改经费信息
const EditFundMenus = function() {
    const a = Mock.mock({
        code:0,
        data:{
            menuInfo:{id:"@id()", name:"关于高校科研系统项目的研究",money:43000,book:"book"},
        },
        message:"处理成功！",
    })
    return a;
}

//删除经费信息
const DeleteFundMenus = function() {
    const a = Mock.mock({
        code:0,
        data:true,
        message:"删除成功！"
    })
    return a;
}

//system模块
//获取角色信息
const getSystemRoles = function() {
    const a = Mock.mock({
        code:0,
        data:{
            current:1,
            pageSize:5,
            total:12,
            records:[
                {id:"001",remark:'项目申请、经费申请和成果检查',roles_name:"项目人员"},
                {id:"002",remark:'项目审批和成果审批',roles_name:"院级管理员"},
                {id:"003",remark:'项目审批、经费和成果审批',roles_name:"校级管理员"},
                {id:"003",remark:'经费审批',roles_name:"经费管理员"},
            ],
            pageNum:1
        },
        msg:"处理成功！",

    })
    return a;
}

//编辑角色信息
const getEditRoles = function() {
    const a = Mock.mock({
        code:0,
        data:[
            {id:"001",remark:'项目申请、经费申请和成果检查',roles_name:"项目人员"}
        ],
        message:"处理成功！",
    })
    return a;
}

//确认编辑信息
const getEditComfirm = function() {
    const a = Mock.mock({
        code:0,
        data:true,
        message:"处理成功！",
    })
    return a;
}

//删除数据信息
const getDeleteRoles = function() {
    const a = Mock.mock({
        code:0,
        data:true,
        message:"处理成功！",
    })
    return a;
}
 
export default [
    {
        url:'/user/login',
        method:'post',
        header:{
            "content-type":"application/json"
        },
        response:() => {
            return loginResp;
        }
    },
    {
        // 需要进行token验证（这里没加）
        url:'/user/getInfo',
        method:'get',
        response:() => {
            return userHeader;
        }
    },
    {
        url:'/user/logout',
        method:'post',
        response:() => {
            return userLogout;
        }
    },
    // {
    //     url:'/user/refreshToken',
    //     method:'post',
    //     response:() => {
    //         return refreshToken;
    //     }
    // }, 
    
    // Project
    {
        url:"/project/apply",
        method:'post',
        response:() => {
            return getProjectAdd;
        }
    },
    {
        url:"project/edit-id/:id",
        method:'get',
        response:() => {
            return getEditId;
        }
    },
    {
        url:"/project/get-pro-menus",
        method:'get',
        response:() => {
            return getProAuditing;
        }
    },
    {
        url:"/project/delete-msg/:id",
        method:'delete',
        forms: {
            id:"005"
          },
        response:() => {
            return DeleteProject;
        }
    },
    //fund
    {
        url:"/fund/fund-apply",
        method:'post',
        response:() => {
            return getFundApplyMenu;
        }
    },
    {
        url:"/fund/get-fund-menus",
        method:'get',
        response:() => {
            return getAllFundMenus;
        }
    },
    {
        url:"/fund/edit-fund",
        method:'get',
        response:() => {
            return EditFundMenus;
        }
    },
    {
        url:"/fund/delete-fund/:id",
        method:'delete',
        response:() => {
            return DeleteFundMenus;
        }
    },
    //system
    {
        url:"/system/roles",
        method:'post',
        response:() => {
            return getSystemRoles;
        }
    },
    {
        url:"/system/edit-roles/:id",
        method:"post",
        response:() => {
            return getEditRoles;
        }
    },
    {
        url:"/system/edit-comfirm",
        method:"get",
        response:() => {
            return getEditComfirm;
        }
    },
    {
        url:"/system/delete-roles/:id",
        method:"delete",
        response:() => {
            return getDeleteRoles;
        }
    }
]