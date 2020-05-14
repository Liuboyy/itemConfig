<template>
    <div style="position: relative;">
        <div class="ui-echart" ref="myEchart" :style="{height, width}"></div>
        <h1 class="ui-mark" v-if="!isOn"><span class="el-icon-loading"></span></h1>
    </div>
</template>

<script>

    const toHtml = (contents) => {
        // 小圈圈
        let rflag = color => `<span class="ui-echart--tooltip__flag" style="background: ${color}"></span>`;
        return contents.reduce((rhtml, ctn) => {
            if (rhtml) {
                let ctnValue = ctn.seriesName === '90天以上库存金额占比' ? ctn.value + '%' : ctn.value;
                return `${rhtml}<br>${rflag(ctn.color)}${ctn.seriesName}: ${ctnValue}`;
            } else {
                return `${ctn.axisValue}`
            }
        }, '');
    };

    let option = {
        color: ['#66a6ff', '#ffdd61', '#ff9f7e'],
        title: {
            text: '深圳小组',
            textStyle: {
                fontSize: 16,
                color: '#333',
            }
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            extraCssText: 'text-align: left',
            formatter(params) {
                return toHtml([{axisValue: params[0].axisValue}, ...params]);
            }
        },
        legend: {
            data:['在库金额', '在途金额',  '90天以上库存金额占比']
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
//        grid: {
//            left: '3%',
//            right: '4%',
//            bottom: '3%',
//            containLabel: true
//        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : ['10%', '10%'],
                data : []
            }
        ],
        yAxis : [
            {
                type: 'value',
//                min: 50000000,
                axisLabel : {
                    show : true,
                },
                splitLine: {
                    show: false
                }
            },
             {
                 type: 'value',
                 axisLabel : {
                     show : true,
                 },
                 splitLine: {
                     show: false
                 }
             }
        ],
        series: [
            {
                name: '在库金额',
                type: 'bar',
                stack: '金额',
                data: []
            },
            {
                name: '在途金额',
                type: 'bar',
                stack: '金额',
                data: []
            },
            {
                name: '90天以上库存金额占比',
                type: 'line',
                data: [],
                yAxisIndex: 1,
            },
        ],
        animation: false
    };

    import echarts from 'echarts';
    export default {
        name: "FbaStockCurve",
        props: {
            height: {
                type: String,
                default: '400px'
            },
            width: {
                type: String,
                default: '100%'
            },
            data: {
                type: [Array, Object]
            },
            name: {
                type: String,
                default: ''
            },
            showLine: {
                type: Array,
                default() {
                    return [ '在库金额', '在途金额','90天以上库存金额占比']
                }
            },
            showLineList: {
                type: Object,
                default() {
                    return {
                        '名': 'key'
                    }
                }
            }
        },
        data() {
            return {
                ECharts: {},
                isOn: false,
                isDispose: false,
                scrollTime: '',
            }
        },
        methods: {
            init(option) {
                this.ECharts = echarts.init(this.$refs.myEchart);
                this.ECharts.setOption(option);
            },
            refresh(chart) {
                if (chart) {
                    let item;
                    item = [[], [], [], []];
                    chart.forEach(_v => {
                        item[0].push(Number(_v.warehouse_money));
                        item[1].push(Number(_v.onway_money));
                        item[2].push(Number(_v.over90_warehouse_money_percent));
                        item[3].push(_v.date);
                    });

                    option.xAxis[0].data = item[3];

                    option.series = option.series.map((_v, _i) => {
                        let obj = {
                            ..._v,
                            data: item[_i]
                        };

                        if (_i === 2) {
                            obj.yAxisIndex = 1
                        }
                        return obj;
                    });

                    option.yAxis[1].max = this.data.data_max.max_percent;
                    option.title.text = this.data.name;
                    this.init(option)
                } else {
                    this.ECharts.dispose && this.ECharts.dispose();
                    this.isOn = false;
                }
            },
            scroll() {
                clearTimeout(this.scrollTime);
                this.scrollTime = setTimeout(() => {
                    if (!this.$refs.myEchart) return;
                    const times = 3 * 500;
                    const offsetTop = this.$refs.myEchart.getBoundingClientRect().top;
                    if (offsetTop < times && offsetTop > -times && !this.isOn) {
                        this.refresh(this.data.chart);
                        this.isOn = true;
                    } else if ((offsetTop > times || offsetTop < -times) && this.isOn) {
                        this.refresh();
                    }
                }, 100)
            }
        },
        mounted() {
            this.$nextTick(() => {
                let areaEle = document.querySelector('.ui-content_area--main');
                areaEle.addEventListener('scroll', this.scroll);
            });
            this.scroll();
        },
        watch: {
            data({ chart }) {
                // this.refresh(chart);
            }
        },
        beforeDestroy() {
            let areaEle = document.querySelector('.ui-content_area--main');
            areaEle && areaEle.removeEventListener('scroll', this.scroll);
        }
    }
</script>

<style scoped lang="less">
    .ui-mark {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 1;
        margin-top: -40px;
        margin-left: -40px;

        span {
            font-size: 50px;
            color: #CCCCCC;
        }
    }

    /deep/ .ui-echart--tooltip__flag {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
    }
</style>