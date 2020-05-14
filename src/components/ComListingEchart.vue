<template>
    <div style="position: relative;">
        <div class="ui-echart" ref="myEchart" :style="{height, width}"></div>
        <h1 class="ui-mark" v-if="!isOn"><span class="el-icon-loading"></span></h1>
    </div>
</template>

<script>

    const toHtml = (contents, top, name) => {
        // 小圈圈
        let rflag = color => `<span class="ui-echart--tooltip__flag" style="background: ${color}"></span>`;
        return contents.reduce((rhtml, ctn) => {

            let ctnValue = ctn.seriesName === '利润率'? (ctn.value + '%')  : (name === 'platformSale' && ctn.seriesName === '销售额' ? ctn.value + '（USD）' : name === 'platformProfit' && ctn.seriesName === '利润' ?  ctn.value + '（CNY）' : ctn.seriesName === '占比'? (ctn.value + '%') : ctn.value);

            return (rhtml ? `${rhtml}<br>` : '') + `${ctn.marker}${ctn.seriesName}: ${ctnValue}`;
        }, `${top}`);
    }

    let option = {
        color: ['#FF201B', '#F48314'],
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
//        grid: {
//            left: '3%',
//            right: '4%',
//            bottom: '3%',
//            containLabel: true
//        },
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
                }
            }
        ],
        series : [
            {
                name: '',
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
                            offset: 0, color: '#FF201B' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#FFFFFF' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                },
                lineStyle: {
                    color: '#FF201B'
                },
                data:[120, 132, 101, 134, 90, 230, 210],
                smooth: true,
                yAxisIndex: 0,
            },
            {
                name: '',
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
                            offset: 0, color: '#F48314' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#FFFFFF' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                },
                lineStyle: {
                    color: '#F48314'
                },
                data:[220, 182, 191, 234, 290, 330, 110],
                smooth: true,
                yAxisIndex: 1
            }
        ]
    };

    import echarts from 'echarts';
    export default {
        name: "ComListingEchart",
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
            }
        },
        data() {
            return {
                ECharts: {},
                isOn: false,
                isDispose: false,
                scrollTime: ''
            }
        },
        methods: {
            init(option) {
                this.ECharts = echarts.init(this.$refs.myEchart);
                this.ECharts.setOption(option);
            },
            refresh(chart) {
                if (chart) {
                    let item = [[], [], []];
                    chart.forEach(_v => {
                        item[0].push(_v.total_price);
                        item[1].push(_v.total_order_sum);
                        item[2].push(_v.date);
                    });

                    option.tooltip.formatter = (params) => {
                        return toHtml([...params], params[0].name, this.name);
                    };

                    option.series = option.series.map((_v, _i) => {
                        return {
                            ..._v,
                            data: item[_i]
                        }
                    });
                    option.xAxis[0].data = item[2];
                    option.yAxis[1].max = this.data.data_max.max_total_order_sum * 2;
                    option.title.text = this.data.name;

                    if (this.name === 'platformSale') {
                        option.legend.data = ['销售额', '订单量'];
                        option.series[0].name = '销售额';
                        option.series[1].name = '订单量';
                    }else if (this.name === 'platformProfit') {
                        option.legend.data = ['利润', '利润率'];
                        option.series[0].name = '利润';
                        option.series[1].name = '利润率';
                    }else if (this.name === 'productCost') {
                        option.legend.data = ['产品成本', '占比'];
                        option.series[0].name = '产品成本';
                        option.series[1].name = '占比';
                        option.yAxis[1].max = this.data.data_max.max_usd_total_price * 2;
                    }else if (this.name === 'freightCost') {
                        option.legend.data = ['运费成本', '占比'];
                        option.series[0].name = '运费成本';
                        option.series[1].name = '占比';
                        option.yAxis[1].max = this.data.data_max.max_usd_total_price * 2;
                    }else {
                        option.legend.data = ['销售额','listing数'];
                        option.series[0].name = '销售额';
                        option.series[1].name = 'listing数';
                    }
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
</style>
