<template>
    <div>
        <div class="ui-echarts" ref="myMap"></div>
    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import echarts from 'echarts'

    const option = {
        series: [
            {
                name: '中国地图',
                type: 'map',
                mapType: 'china', // 自定义扩展图表类型
                data: [
                    {
                        name: '新疆',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '西藏',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '内蒙古',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '青海',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '四川',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '黑龙江',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '甘肃',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '云南',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '广西',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '湖南',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '陕西',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '广东',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '吉林',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '河北',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '湖北',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '贵州',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '山东',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '江西',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '河南',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '辽宁',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '山西',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '安徽',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '福建',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '浙江',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '江苏',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '重庆',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '宁夏',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '海南',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '台湾',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '北京',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '天津',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '上海',
                        value: Math.random() * 200000000
                    },
                    {
                        name: '澳门',
                        value: Math.random() * 200000000
                    },
                ]
            }
        ],
        visualMap: {
            left: 'left',
            min: 500000,
            max: 38000000,
            inRange: {
                color: ['#313695', '#a50026']
            },
            text:['High','Low'],           // 文本，默认为数值文本
            calculable: true
        }
    }

    export default {
        data () {
            return {
                ECharts: {}
            };
        },
        computed: {
        },
        methods: {

        },
        mounted () {
            this.$nextTick().then(() => {
                echarts.registerMap('china', require('../../api/common/china_map'));
                this.ECharts = echarts.init(this.$refs.myMap);
                this.ECharts.setOption(option);
                this.ECharts.on('click', function(e) {
                    console.log(e);
                })
            })
        },
    };
</script>

<style lang="less" scoped>
    .ui-echarts {
        width: 100%;
        height: 600px;
    }
</style>
