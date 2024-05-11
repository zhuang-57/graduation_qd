import { createRouter, createWebHistory } from 'vue-router'
import {useTokenStore} from '@/stores/mytoken'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/user/login',
      name:'Login',
      component:() => import('@/views/login/LoginView.vue')
    },
    {
      path: '/',
      name: '',
      meta: {requiresAuth: true,title:'首页'},
      component: () => import('@/components/layout/AppLayout.vue'),
      children: [
        {
          path:"",
          name:'Home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path:"/personal",
          name:"PersonalHomePage",
          meta: {title:"个人主页"},
          component:() => import("@/views/personal/PersonalHomepage.vue")
        },
       
      ]
    },
    {
      path:'/project',
      name:'Project',
      component: () => import('@/components/layout/AppLayout.vue'),
      meta: {requiresAuth: true, title:"项目管理"},
      children:[
        {
          path:'/pro-apply',
          name:"ProApply",
          meta: { title:"申报项目"},
          component:() => import('@/views/project/ProjectApply.vue')
        },
        {
          path:'/pro-auditing',
          name:'ProAuditing',
          meta: { title:"项目列表"},
          component:() => import('@/views/project/ProjectAuditing.vue')
        },
      ]
    },
    {
      path:'/fund',
      name:'Fund',
      component: () => import('@/components/layout/AppLayout.vue'),
      meta: {requiresAuth: true, title:"经费管理"},
      children:[
        {
          path:'/fund-apply',
          name:"FundApply",
          meta: { title:"经费申请"},
          component:() => import('@/views/fund/FundApply.vue')
        },
        {
          path:'/fund-auditing',
          name:'FundAuditing',
          meta: { title:"经费库"},
          component:() => import('@/views/fund/FundAuditing.vue')
        },
      ]
    },
    {
      path:'/result',
      name:'Result',
      component: () => import('@/components/layout/AppLayout.vue'),
      meta: {requiresAuth: true, title:"成果管理",},
      children:[
      {
        path:'/res-enroll',
        name:"ResEnroll",
        meta: { title:"申请成果"},
        component:() => import('@/views/result/ResEnroll.vue')
      },
      {
        path:'/res-auditing',
        name:'ResAuditing',
        meta: { title:"成果列表"},
        component:() => import('@/views/result/ResAuditing.vue')
      },
      {
        path:'/res-chart',
        name:'ResChart',
        meta: { title:"成果统计"},
        component:() => import('@/views/result/ResChart.vue')
      },
      ]
    },
    {
      path:'/system',
      name:'System',
      component: () => import('@/components/layout/AppLayout.vue'),
      meta: {requiresAuth: true, title:"系统管理"},
      children:[
        {
          path:'/user-roles',
          name:"SystemRoles",
          meta: { title:"角色管理"},
          component:() => import('@/views/system/SystemRoles.vue')
        },
        {
          path:'/user-power',
          name:'SystemPower',
          meta: { title:"用户管理"},
          component:() => import('@/views/system/SystemPower.vue')
        },
        
      ]
    },
    {
      path:'/:404(.*)*',
      name:'ErrorPage',
      component: () => import('@/views/ErrorPage.vue')
    },
    
  ]
})
/* /aa/bb/cc/dd
  /aa
  /aa/bb
  /aa/bb/cc
  /aa/bb/cc/dd  
*/

//路由守卫：在每一次路由变化之前，to:目标地址（去哪），from：从哪来的，next：之后的动作，判断目标地址是否需要登录判断
router.beforeEach((to,from,next) => {
  if(to.matched.some(r => r.meta?.requiresAuth)) {
    const store = useTokenStore();
    
    if(!store.token) {
      //query:我想跳转到A页面，但没有login，跳到login，login之后直接跳到A页面
      next({name:"Login",query:{redirect: to.fullPath}})
      return
    }
  }
  next()
})

export default router
