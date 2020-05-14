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
                return `${rhtml}<br>${rflag(ctn.color)}${ctn.seriesName}: ${ctn.value}`;
            } else {
                return `${ctn.axisValue}`
            }
        }, '');
    }

    const colorList = ['#fc8a8b', '#DCDCDC'];
    const colorLine = ['#ff7778', '#DCDCDC'];
    let option = {
        color: colorList,
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
            data:[]
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
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['周一','周二','周三','周四','周五','周六','周日']
            }
        ],
        yAxis : [
            {
                type: 'value',
                axisLabel : {
                    show : true,
                    formatter: function (value) {
                        const len = value.toString().length;
                        const maxLen = 10;
                        const newLeng = '  '.repeat(maxLen - len);
                        return newLeng + value;
                    }
                },
                splitLine: {
                    show: false
                }
            },
            {
                type: 'value',
                min: 0,
                axisLabel : {
                    show : true,
                    formatter: function (value) {
                        const len = value.toString().length;
                        const maxLen = 10;
                        const newLeng = '  '.repeat(maxLen - len);
                        return value + newLeng;
                    }
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: []
    };

    import echarts from 'echarts';
    export default {
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
                    return ['销售额', '订单量']
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
                    if (this.name === 'platform_curve') {
                        option.legend.data = Object.keys(this.showLineList).filter(item => this.showLine.indexOf(item) > -1);
                        item = [...this.showLine.map(() => []), []];
                        let itemKeys = {...this.showLineList};
                        chart.forEach(_v => {
                            option.legend.data.forEach((keys, inx) => {
                                item[inx].push(_v[itemKeys[keys]]);
                            });
                            item[item.length - 1].push(_v.date);
                        });

                        option.xAxis[0].data = item[item.length - 1];

                        // 配置颜色
                        option.color = option.legend.data.map(color => colorList[Object.keys(this.showLineList).indexOf(color)])

                        option.series = option.legend.data.map(item => {
                            return {
                                name: item,
                                type: 'line',
                                animation: false,
                                areaStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: colorList[Object.keys(this.showLineList).indexOf(item)] // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#FFE' // 100% 处的颜色
                                        }],
                                        global: false // 缺省为 false
                                    },
                                    opacity: 0.3
                                },
                                lineStyle: {
                                    color: colorLine[Object.keys(this.showLineList).indexOf(item)]
                                },
                                data:[120, 132, 101, 134, 90, 230, 210],
                                smooth: true,
                                // yAxisIndex: item === '订单量' ? 1 : 0,
                            }
                        });
                    }
                    option.series = option.series.map((_v, _i) => {
                        return {
                            ..._v,
                            data: item[_i]
                        }
                    });
                    option.yAxis[1].max = this.data.max_order_sum * 2;
                    option.title.text = this.data.target === 'ALL' ?  '所有平台数据统计图' : this.data.name + '数据统计图';
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
//                 this.refresh(chart);
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