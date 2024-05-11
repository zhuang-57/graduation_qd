import '@/styles/index.scss'

import { createApp } from 'vue'
import Echarts from "vue-echarts";
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index'
import "echarts"


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('e-charts',Echarts)
app.mount('#app')

