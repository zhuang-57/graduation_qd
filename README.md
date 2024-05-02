## node版本和npm版本

node: v16.16.0
npm:8.11.0

配置镜像地址：npm config set registry=https://registry.npmmirror.com/

## 创建项目

1.创建项目命令：npm init vue@latest

## 插件安装与配置

1）安装，开启Volar，禁用Vetur，安装ESlint扩展插件
2）在App.vue中，右键选择使用格式化文档，选择ESlint
3）右下角设置->设置输入onsave勾选Format On Save
4）eslintrc.cjs文件

```
rules: {
    "prettier/prettier": [
      "error",
      {
        <!-- 没有分号 -->
        semi:false,
        <!-- 不用特意换行 -->
        wrapAttributes:false,
        <!-- 每一行至少100 -->
        printWidth:100,
        <!-- 换行自动处理不报错 -->
        endOfLine:"auto",
      }
    ]
  }
```

## 使用VS code代码片段功能

### 4.布局处理

#### 1.UI库安装

1.安装
npm i element-plus

2.自动导入第一步：安装依赖
npm i -D uniplugin-vue-components unplugin-auto-import

3.自动按需导入第二步，编辑vite.config.ts

```
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import {viteMockServe} from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      resolvers: [ElementPlusResolver(), IconsResolver()]
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ['ep']
        })
      ]
    }),
    Icons({
      autoInstall: true
    }),
  ],

})
```

4.ts报错处理
在tsconfig.json中

```
 "include": ["auto-imports.d.ts","components.d.ts"],

```

#### 2.图标处理

1.安装element-plus图标模块
npm i @element-plus/icon-vue

2.在组件中测试
src/App.vue

```
<script setup lang="ts">
import {Menu as IconMenu, User as IconUser, Setting} from '@element-plus/icon-vue'
</script>

<template>
 <IconMenu /> <Message /> <IconUser /> <Setting />
</template>
```

3.自动导入 - 安装插件
npm i unplugin-icons -D

4.自动导入 - 进行配置
vite.config.ts

```
export default defineConfig({
  plugins: [
    vue(),
    Icons({
      autoInstall: true
    }),
  ]

})

```

5.自动导入 - 测试使用

```
<template>
  <i-ep-menu/> <IEpMessage /> <i-ep-user /> <i-ep-setting />
</template>
```

### 3.主体总布局

1.编辑App.vue - 去掉无用内容

```
<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style scoped></style>

```

2.主文件AppLayout.vue - 复制 element-plus/组件/Container容器 倒数第二个情况

```
<script setup lang="ts">
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px"> Aside </el-aside>
      <el-container>
        <el-header>Header </el-header>
        <el-main>
          Main
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

```

3.编辑router/ index.ts 修改路由配置

```
import { createRouter,createwebHistory } from "vue-router'
import Homeview from '../ views / HomeView.vue "
import AppLayout from "@/components/layout/AppLayout.vue'// 1.导入const router = createRouter({
  history: createwebHistory( import.meta.env.BASE_URL),
  routes: [
    {
      path: '/ ',
      name : " home ' ,
      component: AppLayout1//2.使用
    },
  ]
})
export default router
```

4.安装sass
npm i sass

5.创建编辑src/styles.index.scss - 作为自定义样式文件

```
{
  padding:0;
  margin:0;
}
```

6.在main.ts文件中引入自定义样式
import '@/styles/index.scss'

### 4.侧边栏布局

1.创建src/components.layout.AppAside.vue - 把el-aside剪切过来

### 5.头部布局组件

### 6.折叠按钮处理

## 5.认识路由

在AppLayout.vue中加入路由

```

<el-main>
  <el-scrollbar>
    <RouterView />
  </scrollbar>
</el-main>

```

在header-and-main中设置主体框架不进行滚动，（如果组件很长）只在main中滚动:height:100vh

### 默认页

HomeView.vue文件中设置登录后进入的首页面

```

<script setup lang="ts">
</>

<template>
  这是默认显示的首页
</template>

<style></style>

```

在router/index.ts中创建路由：

```

routes: [
{
path: '/',
name: 'home',
component: () => import('@/components/layout/AppLayout.vue'),
children: [
{
path:"",
component: () => import('@/views/HomeView.vue'),
},
]

    }

]

```

### 关于页

AboutView.vue页面

```

<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

```

在路由中进行配置：

```

routes: [
{
path: '/',
name: 'home',
component: () => import('@/components/layout/AppLayout.vue'),
children: [
{
path:"",
component: () => import('@/views/HomeView.vue'),
},
{
path: '/about',
name: 'about',
component: () => import('../views/AboutView.vue')
}
]

    },

]

```

### 报错页面

1.创建一个用于显示路由报错的组件ErrorPage.vue
在src/views/ErrorPage中：

```

<script setup lang="ts">

</script>

<template>
    <h1>路径报错，没有此页面，请重试！</h1>
</template>

<style scoped lang="scss"></style>

```

2.在路由文件中配置404 not fount路由

```

{
path:'/:404(._)_',
name:'ErrorPage',
component: () => import('@/views/ErrorPage.vue')
},

```

## 6.数据接口准备

### 基本概念

### 练习接口请求

1.安装axios

```

npm i axios

```

### 配置请求代理

```

```

## 用户登录

users.ts

```
export const login = (loginInfo: LoginInfo) => {
    return request<LoginResult>({
        method:'POST',
        url:"/login",
        data:loginInfo,
        //data:`username=${loginInfo.username}&password=${loginInfo.password}`参数需要以 属性=1&属性=2的字符串形式传输,不能有任何空格
    })
}
```

接口文档中:
请求类型为：application/x-www-form-urlencoded
参数需要以 属性=1&属性=2的字符串形式传输,不能有任何空格
请求类型为：application/Json
可以直接传递一个JS对象，挨熊是会自动转为json字符串传送

问题1：如何使用mock发送post请求，
发送请求时需要携带参数进行验证。

## 存储用户登录信息

1. 使用pinia进行状态存储-创建src/store/token.ts
2. 导入token并保存token，编辑src/login/LoginView.vue

## 用户基本信息展示

获取用户基本信息
接口地址：
请求方式：
请求数据类型：
响应数据类型：
接口描述：
请求参数：Authorization

## token过期处理

在一段时间后，需要重新获取token(用户无感知的刷新token)
access_token: 向接口请求数据
expires_in:access_token过期时间
refresh_token:用于刷新获取新的access_token,expires_in,refresh_token

1.当看到报错信息401时，说明token过期，可使用响应拦截器，封装刷新token的接口函数 api/users.ts

刷新token
接口地址：refresh*token
请求方式：POST
请求数据类型：application/json
响应数据类型：*/\_,application/json
接口描述：根据refresh_token,重新获取token信息
请求参数：Authorization，refreshtoken(query)

2.刷新token成功
修改LocalStorage中access_token,
观察Network:一个getInfo 401,refresh_token,最后一个getInfo成功

3.刷新token失败
access_token和refresh_token 都有问题，必然去login

## 重复刷新token

token过期时，同时连续发出多个请求，
第一次refreshToken(),用旧refresh_token, 得到新access_token和新refresh_token
第二次refreshToken(),用旧refresh_token,会报错，此时应该用新refresh_token
这两次是异步操作，会导致进入login页面

## 新颖点：加入背景

1.npm install vue-particles --save

2.main.js中加入：
import VueParticles from 'vue-particles';
app.use(VueParticles);

3.加入：

```js
 <!-- <vue-particles color="#555" :particleOpacity="0.7" :particlesNumber="150" shapeType="circle" :particleSize="4"
            linesColor="#555" :linesWidth="1" :lineLinked="true" :lineOpacity="0.4" :lineDistance="150" :moveSpeed="2"
            :hoverEffect="true" hoverMode="false" :clickEffect="false" clickMode="push" class="img-main"></vue-particles> -->
```
