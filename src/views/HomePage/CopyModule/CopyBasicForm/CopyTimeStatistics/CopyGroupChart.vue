<template>
    <div>
        <div class="ui-echarts" ref="myMap"></div>
    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import echarts from 'echarts'
    export default {
        data () {
            return {
                ECharts: {}
            };
        },
        computed: {
        },
        mounted() {
            this.drawLine();
        },
        methods: {
            drawLine() {
                // 基于准备好的dom，初始化echarts实例
                this.ECharts = echarts.init(this.$refs.myMap);
                // 绘制图表
                this.ECharts.setOption({
                    title: { text: 'AECharts 入门示例' },
                    tooltip: {},
                    xAxis: {
                        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }]
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .ui-echarts {
        width: 100%;
        height: 600px;
    }
</style>
