import axios, { type AxiosRequestHeaders } from 'axios'
import { request } from 'https'
import {useRouter} from 'vue-router'
import {useTokenStore} from '@/stores/mytoken'
// import { refreshToken } from '@/api/users'
import router from "@/router/index"
const request = axios.create({
    // baseURL:'http://127.0.0.1:5173'
    baseURL:"/api",
    // timeout:5000
})

//请求拦截器
request.interceptors.request.use((config) => {
    if(!config.headers) {
        config.headers = {} as AxiosRequestHeaders
    }
    const store = useTokenStore()
    
    config.headers.token = store.token

    return config
})

//响应拦截器
request.interceptors.response.use((response) => response,async (error) => {
    // console.log("1000 token过期请重新登陆");
    console.log("response:",response);
    console.log("error:",error);
    
    
    // if(error.response.status === 401) {
    //     //刷新token
    //    const {data} = await refreshToken()

    //    if(data.success) {
    //     // 保存新token
    //     useTokenStore().saveToken(data.content)
    //     // 重新请求之前的接口，并把结果返回
    //     return request(error.config)
    //    }else{
    //     // 跳转到login
    //     ElMessage.error('刷新token失败，需要重新登录')
    //     router.push({name:"login"})
    //     return
    //    }
    // }
    // return Promise.reject(error)
})
export default request