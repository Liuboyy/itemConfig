<template>
    <div style="position: relative;">
        <div class="ui-echart" ref="myEchart" :style="{height, width}"></div>
        <h1 class="ui-mark" v-if="!isOn"><span class="el-icon-loading"></span></h1>
    </div>
</template>

<script>

    const toHtml = (contents, top) => {
        // 小圈圈
        let rflag = color => `<span class="ui-echart--tooltip__flag" style="background: ${color}"></span>`;
        return contents.reduce((rhtml, ctn) => {
            return (rhtml ? `${rhtml}<br>` : '') + `${ctn.marker}${ctn.seriesName}: ${ctn.seriesName === '退款率' ? ctn.value + '%' : ctn.value}   ${ctn.data.order_sum !== undefined ? `订单量:${ctn.data.order_sum}` : ''}`;
        }, `${top}`);
    }

    const colorList = ['#fc8a8b', '#DCDCDC', '#fad44d', '#77b2fc'];
    const colorLine = ['#ff7778', '#DCDCDC', '#ffc700', '#78b3fc'];
    const colorList2 = ['#fc7777', '#f9d34d','#77b2fc', ];
    const colorLine2 = ['#ff7778', '#ffc700','#78b3fc', ];

    let option = {
        color: '',
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
            bottom: '4%',
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
            },
        ],
        series: []
    };

    import echarts from 'echarts';
    export default {
        name: "ComEchart",
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
            }
        },
        data() {
            return {
                ECharts: {},
                isOn: false,
                isDispose: false,
                scrollTime: '',
                showLineList: ['销售额', '订单量', 'FBA销售额', 'FBM销售额']
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

                    option.color = this.name === 'refund' ?  colorList2 : colorList;


                    if (this.name === 'sccrcl') {
                        item = [[], [], []];
                        option.legend.data = ['销售额', '订单量'];
                        chart.forEach(_v => {
                            item[0].push(_v.total_price);
                            item[1].push(_v.total_order_sum);
                            item[2].push(_v.date);
                        });
                        option.xAxis[0].data = item[2];
                        option.series = [
                            {
                                name:'销售额',
                                type:'line',
                                animation: false,
                                areaStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: colorList[0] // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#FFE' // 100% 处的颜色
                                        }],
                                        global: false // 缺省为 false
                                    },
                                    opacity: 0.3
                                },
                                lineStyle: {
                                    color: colorLine[0]
                                },
                                data:[120, 132, 101, 134, 90, 230, 210],
                                smooth: true,
                                yAxisIndex: 0,
                            },
                            {
                                name:'订单量',
                                type:'line',
                                animation: false,
                                areaStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: colorList[1] // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#FFE' // 100% 处的颜色
                                        }],
                                        global: false // 缺省为 false
                                    },
                                    opacity: 0.3
                                },
                                lineStyle: {
                                    color: colorLine[1]
                                },
                                data:[220, 182, 191, 234, 290, 330, 110],
                                smooth: true,
                                yAxisIndex: 1
                            }
                        ]
                    } else if (this.name === 'refund') {

                        item = [[], [], [], []];
                        option.legend.data = ['退款额', '销售额', '退款率'];
                        chart.forEach(_v => {
                            item[0].push(_v.refund_usd_total_price);
                            item[1].push(_v.usd_total_price);
                            item[2].push(_v.ratio);
                            item[3].push(_v.date);
                        });
                        option.xAxis[0].data = item[3];

                        option.tooltip.formatter = (params) => {
                            return toHtml([...params], params[0].name);
                        };

                        option.series = [
                            {
                                name: '退款额',
                                type:'line',
                                animation: false,
                                areaStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: colorList2[0] // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#FFE' // 100% 处的颜色
                                        }],
                                        global: false // 缺省为 false
                                    },
                                    opacity: 0.3
                                },
                                lineStyle: {
                                    color: colorLine2[0]
                                },
                                data:[120, 132, 101, 134, 90, 230, 210],
                                smooth: true,
                                yAxisIndex: 0,
                            },
                            {
                                name: '销售额',
                                type:'line',
                                animation: false,
                                areaStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: colorList2[1] // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#FFE' // 100% 处的颜色
                                        }],
                                        global: false // 缺省为 false
                                    },
                                    opacity: 0.3
                                },
                                lineStyle: {
                                    color: colorLine2[1]
                                },
                                data:[120, 132, 101, 134, 90, 230, 210],
                                smooth: true,
                                yAxisIndex: 0,
                            },
                            {
                                name: '退款率',
                                type:'line',
                                animation: false,
                                areaStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: colorList2[2] // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#FFE' // 100% 处的颜色
                                        }],
                                        global: false // 缺省为 false
                                    },
                                    opacity: 0.3
                                },
                                lineStyle: {
                                    color: colorLine2[2]
                                },
                                data:[220, 182, 191, 234, 290, 330, 110],
                                smooth: true,
                                yAxisIndex: 1
                            }
                        ]
                    }else if (this.name === 'fmsvf') {
                        option.legend.data = this.showLineList.filter(item => this.showLine.indexOf(item) > -1);
                        item = [...this.showLine.map(() => []), []];
                        let itemKeys = {
                            '销售额': 'total_price',
                            'FBA销售额': 'total_price_afn',
                            'FBM销售额': 'total_price_mfn'
                        }
                        chart.forEach(_v => {
                            option.legend.data.forEach((keys, inx) => {
                                item[inx].push({
                                    value: _v[itemKeys[keys]],
                                    order_sum: _v[itemKeys[keys].replace('price', 'order_sum')]
                                });
                            })
                            item[item.length - 1].push(_v.date);
                        });

                        option.xAxis[0].data = item[item.length - 1];

                        // 配置颜色
                        option.color = option.legend.data.map(color => colorList[this.showLineList.indexOf(color)])

                        option.tooltip.formatter = (params) => {
                            return toHtml([...params], params[0].name);
                        };

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
                                            offset: 0, color: colorList[this.showLineList.indexOf(item)] // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#FFE' // 100% 处的颜色
                                        }],
                                        global: false // 缺省为 false
                                    },
                                    opacity: 0.3
                                },
                                lineStyle: {
                                    color: colorLine[this.showLineList.indexOf(item)]
                                },
                                data:[120, 132, 101, 134, 90, 230, 210],
                                smooth: true,
                                yAxisIndex: item === '订单量' ? 1 : 0,
                            }
                        });
                    } else if (this.name === 'brCurve') {
                        let showLineList = ['sessions', 'pv'];
                        option.legend.data = showLineList.filter(item => this.showLine.indexOf(item) > -1);
                        item = [...this.showLine.map(() => []), []];
                        let itemKeys = {
                            'sessions': 'total_sessions',
                            'pv': 'total_pv',
                        };
                        chart.forEach(_v => {
                            option.legend.data.forEach((keys, inx) => {
                                item[inx].push(_v[itemKeys[keys]]);
                            });
                            item[item.length - 1].push(_v.date);
                        });

                        option.xAxis[0].data = item[item.length - 1];

                        // 配置颜色
                        option.color = option.legend.data.map(color => colorList2[showLineList.indexOf(color)])

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
                                            offset: 0, color: colorList2[showLineList.indexOf(item)] // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#FFE' // 100% 处的颜色
                                        }],
                                        global: false // 缺省为 false
                                    },
                                    opacity: 0.3
                                },
                                lineStyle: {
                                    color: colorLine2[showLineList.indexOf(item)]
                                },
                                data:[120, 132, 101, 134, 90, 230, 210],
                                smooth: true,
                                yAxisIndex: item === 'pv' ? 1 : 0,
                            }
                        })
                    }else {
                        option.legend.data = this.showLineList.filter(item => this.showLine.indexOf(item) > -1);
                        item = [...this.showLine.map(() => []), []];
                        let itemKeys = {
                            '销售额': 'total_price',
                            '订单量': 'total_order_sum',
                            'FBA销售额': 'total_price_afn',
                            'FBM销售额': 'total_price_mfn'
                        }
                        chart.forEach(_v => {
                            option.legend.data.forEach((keys, inx) => {
                                item[inx].push(_v[itemKeys[keys]]);
                            })
                            item[item.length - 1].push(_v.date);
                        });

                        option.xAxis[0].data = item[item.length - 1];

                        // 配置颜色
                        option.color = option.legend.data.map(color => colorList[this.showLineList.indexOf(color)])

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
                                            offset: 0, color: colorList[this.showLineList.indexOf(item)] // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#FFE' // 100% 处的颜色
                                        }],
                                        global: false // 缺省为 false
                                    },
                                    opacity: 0.3
                                },
                                lineStyle: {
                                    color: colorLine[this.showLineList.indexOf(item)]
                                },
                                data:[120, 132, 101, 134, 90, 230, 210],
                                smooth: true,
                                yAxisIndex: item === '订单量' ? 1 : 0,
                            }
                        });
                    }

                    option.series = option.series.map((_v, _i) => {
                        return {
                            ..._v,
                            data: item[_i]
                        }
                    });
                    option.yAxis[1].max = this.name === 'refund' ? this.data.data_max.max_ratio : this.name === 'brCurve' ? this.data.data_max.max_pv : this.data.data_max.max_total_order_sum * 2;
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