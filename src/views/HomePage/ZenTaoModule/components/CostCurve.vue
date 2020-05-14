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

    const colorList = ['#fc8a8b','#77b2fc', '#fad44d', '#6FFC7F', '#634121'];
    const colorLine = ['#ff7778','#78b3fc', '#ffc700', '#6FFC7F', '#634121'];
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

        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : []
            }
        ],
        yAxis : [
            {
                type: 'value',
                axisLabel : {
                    show : true,
                },
                splitLine: {
                    show: false
                },
            },
            {
                type: 'value',
                max: 0,
                axisLabel : {
                    show : true,
                },
                splitLine: {
                    show: false
                },

            },
        ],
        series: []
    };

    import echarts from 'echarts';
    export default {
        name: "CostCurve",
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
                    return ['统计应付金额', '实付金额', '折扣']
                }
            },
            showLineList: {
                type: Object,
                default() {
                    return {
                        '统计应付金额': 'yf_price',
                        '实付金额': 'xj_payment',
                        '折扣': 'discount',
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
                    option.legend.data = Object.keys(this.showLineList).filter(item => this.showLine.indexOf(item) > -1);
                    item = [...this.showLine.map(() => []), []];
                    let itemKeys = {...this.showLineList};
                    chart.forEach(_v => {
                        option.legend.data.forEach((keys, inx) => {
                            item[inx].push(_v[itemKeys[keys]]);
                        })
                        item[item.length - 1].push(_v.m_month);
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
                            data:[],
                            smooth: true,
                        }
                    });

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
                    option.yAxis[1].max = this.data.data_max.max_xj_price;
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
            })
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