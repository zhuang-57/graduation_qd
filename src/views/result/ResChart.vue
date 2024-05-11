<template>
    <div class="main-chart">
        <el-card style="width: 670px" shadow="never">
            <template #header>
                <div>
                    <span>成果类型统计图</span>
                </div>
            </template>
            <e-charts id="resultType" :option="optionType"
                :style="{ width: '670px', height: '400px', marginTop: '10px' }"></e-charts>
        </el-card>
        <el-card style="width: 670px" shadow="never">
            <template #header>
                <div>
                    <span>成果季度统计图</span>
                </div>
            </template>
            <e-charts id="resultTime" :option="optionTime"
                :style="{ width: '670px', height: '400px', marginTop: '10px' }"></e-charts>

        </el-card>
    </div>
    <el-card style="margin-top: 20px;" shadow="never" v-if="userStore.userInfo.roleId === 3">
        <template #header>
            <div>
                <span>学院成果统计图</span>
            </div>
        </template>
        <e-charts id="stack" :option="optionAcademy"
            :style="{ width: '1200px', height: '400px', marginTop: '10px' }"></e-charts>

    </el-card>
</template>
 
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
// import * as echarts from 'echarts'
import { getResultChart, ChartLists, AcademyAnalyses, QuarterAnalyses, TypeAnalyses } from "../../api/result"
import { useUserStore } from "../../stores/users"
const userStore = useUserStore()

//学院信息
const academyAnalysesMenu = reactive<AcademyAnalyses>({
    academyId: null,
    monthCntList: []
})
//季度信息
const quarterAnalysesMenu = reactive<QuarterAnalyses>({
    cnt: null,
    quarter: ''
})
//成果类型
const typeAnalysesMenu = reactive<TypeAnalyses>({
    cnt: null,
    resultType: '',
    resultTypeName: ''
})
//总表
const chartMenus = reactive<ChartLists>({
    resultAcademyAnalyses: [academyAnalysesMenu],
    resultQuarterAnalyses: [quarterAnalysesMenu],
    resultTypeAnalyses: [typeAnalysesMenu]
})

//转换成果类型信息
const getType = ref([{
    value: null,
    name: ''
}])

const getTypeList = () => {
    getType.value = chartMenus.resultTypeAnalyses.map((item) => {
        return { value: item.cnt, name: item.resultTypeName }
    })
}

//转换成果季度信息
const getQuarter = ref([{
    value: null,
    name: ''
}]);
const getQuarterList = () => {
    getQuarter.value = chartMenus.resultQuarterAnalyses.map((item) => {
        return { value: item.cnt, name: item.quarter }
    })
}

//获取表信息
const getCharts = async () => {
    const { data } = await getResultChart();
    if (data.code === 0) {
        chartMenus.resultAcademyAnalyses = data.data.resultAcademyAnalyses
        chartMenus.resultQuarterAnalyses = data.data.resultQuarterAnalyses
        chartMenus.resultTypeAnalyses = data.data.resultTypeAnalyses
        getQuarterList()
        getTypeList()
    } else {
        ElMessage.error(data.msg)
    }

}
getCharts()

// 获取学院信息
// const getAcademy = ref([{
//     academyId: null,
//     monthCntList: []
// }])
const getAcademyList = () => {
    chartMenus.resultAcademyAnalyses.map((item) => {
        return {
            name: '机电工程学院',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            data: [191, 234, 290, 330, 310]
        }
    })
}




//学院图
const optionAcademy = computed(() => {
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            // data: ['信息工程学院', '机电工程学院', '文化传媒学院', '经济管理学院', '园林科技学院', '设计艺术学院', '马克思主义学院', '创新创业就业学院', '继续教育学院']
            data: ['信息工程学院', '机电工程学院', '文化传媒学院', '经济管理学院', '园林科技学院', '设计艺术学院', '马克思主义学院', '创新创业就业学院', '继续教育学院']

        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series:
            [
                {
                    name: '信息工程学院',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [9, 4, 3, 2, 10, 2, 4, 6, 2, 1, 7, 2]
                },
                {
                    name: '机电工程学院',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [3, 6, 4, 5, 3, 3, 4, 3, 2, 2, 7, 3]
                },
                {
                    name: '文化传媒学院',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [5, 4, 6, 7, 4, 3, 9, 3, 4, 3, 6, 4]
                },
                {
                    name: '经济管理学院',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [8, 7, 3, 2, 6, 4, 5, 6, 7, 8, 5, 2, 7]
                },
                {
                    name: '园林科技学院',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [9, 3, 10, 8, 2, 6, 7, 6, 4, 8, 6, 8]
                },
                {
                    name: '设计艺术学院',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [8, 3, 9, 3, 4, 2, 8, 3, 7, 2, 4, 8]
                },
                {
                    name: '马克思主义学院',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [5, 5, 9, 7, 2, 6, 5, 1, 8, 3, 7, 3]
                },
                {
                    name: '创新创业就业学院',
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [1, 2, 2, 4, 3, 8, 4, 3, 5, 6, 4, 2]
                },
                {
                    name: '继续教育学院',
                    type: 'line',
                    stack: 'Total',
                    label: {
                        show: true,
                        position: 'top'
                    },
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [1, 2, 1, 4, 3, 6, 1, 1, 4, 9, 5, 3]
                },

            ]
    }
})

//成果类型
const optionType = computed(() => {
    return {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'horizontal',
            left: 'center',
        },
        series: [
            {
                name: '类型数据',
                type: 'pie',
                radius: '70%',
                data: getType.value,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
})

//成果季度
const optionTime = computed(() => {
    return {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'horizontal',
            left: 'center',
        },
        series: [
            {
                name: '类型数据',
                type: 'pie',
                radius: '70%',
                data: getQuarter.value,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
})
</script>
 
<style lang="scss" scoped>
.main-chart {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>