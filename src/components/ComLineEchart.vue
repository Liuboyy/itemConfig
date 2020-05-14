<template>
    <div class="ui-echart" ref="myEchart" :style="{height, width}"></div>
</template>

<script>

    const toHtml = (contents, append) => {
        // 小圈圈
        let rflag = color => `<span class="ui-echart--tooltip__flag" style="background: ${color}"></span>`;
        return contents.reduce((rhtml, ctn) => {
            if (rhtml) {
                return `${rhtml}<br>${rflag(ctn.color)}${ctn.seriesName}: ${ctn.value}${append}`;
            } else {
                return `${ctn.axisValue}`
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
        tooltip: {
            trigger: 'axis',
            confine: true,
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
            data: []
        },
//        grid: {
//            left: '3%',
//            right: '4%',
//            bottom: '3%',
//            containLabel: true
//        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: [],
            }
        ],
        yAxis: [
            {
                name: '',
                type: 'value',
                axisLabel: {
                    formatter: '{value} %'
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
        series: [
            {
                data: [],
                yAxisIndex: 0,
            }
        ]
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
            },
            tooltip: {
                type: String,
                default: '%'
            },
            propName: {
                type: String,
                default: ''
            },
            defaultSelected: {
                type: Array,
                default() {
                    return [];
                }
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
                    let item = [[], [], []];
                    let series = [];
                    chart.forEach(_v => {
                        item[0].push(_v.total_price);
                        item[2].push(_v.date);
                        _v.list.forEach((_vs, _is) => {
                            if (!series[_is]) {
                                series[_is] = {
                                    name: _vs.site,
                                    type: 'line',
                                    // stack: '统计',
                                    data: [_vs[this.propName]]
                                }
                                option.color.push(_vs.color);
                                option.legend.data.push(_vs.site);
                                if (this.defaultSelected.length) {
                                    if (option.legend.selected) {
                                        option.legend.selected[_vs.site] = this.defaultSelected.indexOf(_vs.site) > -1;
                                    } else {
                                        option.legend.selected = {
                                            [_vs.site]: this.defaultSelected.indexOf(_vs.site) > -1
                                        };
                                    }
                                }
                            } else {
                                series[_is].data.push(_vs[this.propName]);
                            }
                        });
                    })

                    option.series = series;
                    option.xAxis[0].data = item[2];
                    option.title.text = this.title;
                    option.yAxis[0].name = this.yName;
                    option.yAxis[0].axisLabel.formatter = `{value} ${this.unit}`;
                    option.tooltip.formatter = (params) => {
                        return toHtml([{axisValue: params[0].axisValue}, ...params], this.tooltip);
                    }
                    this.init(option)
                } else {
                    this.ECharts.dispose && this.ECharts.dispose();
                }
            },
            scroll() {
                this.refresh(this.data.chart);
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
            data({chart}) {
                this.refresh(chart);
            }
        },
        beforeDestroy() {
            let areaEle = document.querySelector('.ui-content_area--main');
            areaEle && areaEle.removeEventListener('scroll', this.scroll);
        }
    }
</script>

<style scoped>
    /deep/ .ui-echart--tooltip__flag {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
    }
</style>