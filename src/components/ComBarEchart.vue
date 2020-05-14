<template>
    <div class="ui-echart" ref="myEchart" :style="{height, width}"></div>
</template>

<script>

    const toHtml = (contents) => {
        // 小圈圈
        let rflag = color => `<span class="ui-echart--tooltip__flag" style="background: ${color}"></span>`;
        return contents.reduce((rhtml, ctn) => {
            if (ctn.seriesName) {
                let extraStr = ctn.data.is_show_p ? `（${ctn.data.price_percent}%）` : `（${ctn.data.percent}%）客单价：${ctn.data.unit_price}`;
                return (rhtml ? `${rhtml}<br>` : '') + `${rflag(ctn.color)}${ctn.seriesName}: ${ctn.value}${extraStr}`;
            } else {
                return `${ctn.axisValue}<br>合计：${ctn.count}`
            }
        }, '');
    }

    let option = {
        color: [],
        title: {
            text: '',
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
            confine: true,
            formatter(params) {
                let in_html = '';
                let count = params.reduce((cun, item) => {
                    in_html += `${item.color}`;
                    return cun + item.value
                }, 0);
                count = Math.ceil(count * 100) / 100;
                let top = {
                    axisValue: params[0].axisValue,
                    count
                };
                return toHtml([top, ...params]);
            }
        },
        legend: {
            data:[]
        },
        toolbox: {
            feature: {
                // saveAsImage: {}
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
                data : [],
            }
        ],
        yAxis : [
            {
                name: '销售额',
                type: 'value',
                axisLabel: {
                    formatter: '{value} USD'
                },
                nameTextStyle: {
                    color: '#FF2E2F'
                },
                axisLine: {
                    lineStyle: {
                        color: '#FF2E2F'
                    }
                }
            }
        ],
        series : [
            {
                data:[],
                smooth: true
            }
        ]
    };

    import echarts from 'echarts';
    export default {
        name: "ComBarchart",
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
            dataKey: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: '统计表'
            },
            yName: {
                type: String,
                default: ''
            },
            unit: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                ECharts: {},
                isOn: false,
                isDispose: false
            }
        },
        methods: {
            init(option) {
                this.ECharts = echarts.init(this.$refs.myEchart);
                this.ECharts.setOption(option);
            },
            refresh(chart) {
                if (chart) {
                    let date = [];
                    let series = [];
                    chart.forEach(_v => {
                        date.push(_v.date);
                        _v.list.forEach((_vs, _is) => {
                            if (!series[_is]) {
                                series[_is] = {
                                    name: _vs.site,
                                    type:'bar',
                                    stack: '统计',
                                    data:[{
                                        is_show_p: this.dataKey === 'total_price',
                                        ..._vs,
                                        value: _vs[this.dataKey]
                                    }],
                                    smooth: true
                                }
                                option.color.push(_vs.color);
                                option.legend.data.push(_vs.site);
                            } else {
                                series[_is].data.push({
                                    ..._vs,
                                    is_show_p: this.dataKey === 'total_price',
                                    value: _vs[this.dataKey]
                                });
                            }
                        });
                    })

                    option.series = series;
                    option.xAxis[0].data = date;
                    option.title.text = this.title;
                    option.yAxis[0].name = this.yName;
                    option.yAxis[0].axisLabel.formatter = `{value} ${this.unit}`;
                    this.init(option)
                } else {
                    this.ECharts.dispose && this.ECharts.dispose();
                }
            },
            scroll() {
                const offsetTop = this.$refs.myEchart.getBoundingClientRect().top;
                if (offsetTop < 1750 && !this.isOn) {
                    this.refresh(this.data.chart);
                    this.isOn = true;
                }
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
    /deep/ .ui-echart--tooltip__flag {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
    }
</style>