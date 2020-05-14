<template>
    <div style="position: relative;">
        <div class="ui-echart" ref="myEchart" :style="{height, width, 'padding-top': '10px'}"></div>
        <h1 class="ui-mark" v-if="!isOn"><span class="el-icon-loading"></span></h1>
    </div>
</template>

<script>

    const toHtml = (contents, top) => {

        // 小圈圈
        let rflag = color => `<span class="ui-echart--tooltip__flag" style="background: ${color}"></span>`;
        return contents.reduce((rhtml, ctn) => {
            return `${ctn.marker}${ctn.name}: ${ctn.value}（${ctn.percent + '%'}）`;
        }, `${top}`);
    };
    let option = {
        color: ['#78b3fc', '#ff7778', '#77d6c7', '#bbaff1', '#fd96c1','#fad44d'],
        title: {
            text: '',
            left: 'text'
        },
        tooltip: {
            trigger: 'item',
//            formatter: '{a} <br/>{b} : {c} ({d}%)'
            formatter: function(params) {
                return toHtml([params]);
            }
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            top: 20,
            bottom: 10,
            left: '70%',
            data: [],
        },
        series: [
            {
                name: '渠道分布',
                type: 'pie',
                radius: '60%',
                center: ['30%', '65%'],
                data: [],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
//                roseType: 'radius',
            }
        ]
    };

    import echarts from 'echarts';
    export default {
        name: "CdChannelCurve",
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
                    let item = [[], []];
                    let seriesData = [];
                    chart.forEach(_v => {
                        item[0].push(_v.total_price);
                        item[1].push(_v.ship_name);
                    });

                    option.legend.data = item[1];

                    option.legend.data.forEach((_item, index) => {
                        seriesData.push({
                            value: item[0][index] * 1,
                            name: item[1][index]
                        })
                    });

                    option.title.text = this.data.name;

                    option.series = option.series.map(_v => {
                        return {
                            ..._v,
                            data: seriesData
                        }
                    });

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
