<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="付款时间" v-model="queryData.paymentTime" template="daterange" :isOption="false">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="渠道">
                            <el-select size="small" v-model="queryData.fulfillmentType">
                                <el-option v-for="item in optionList.fulfillmentList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :params="{}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module"></div>
        <TemplateDefault :staticNum="120" color="#FFFFFF">
            <div ref="myMap1" class="ui-echarts"></div>
            <div ref="myMap2" class="ui-echarts"></div>
        </TemplateDefault>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import config from '@/assets/js/config';
    import {
        autoAddTableInx,
        getDefaultTime,
        changeTableInfoProps,
        getThirtyDayDateRange
    } from '@/services/index';
    import {
        mapActions,
        mapGetters
    } from 'vuex';
    import {
        getTobPerformanceCountInfo
    } from '@/api/am_order_count/tob_performance_count';

    const toHtml = (contents, type) => {
        // 小圈圈
        let rflag = color => `<span class="ui-echart--tooltip__flag" style="background: ${color}"></span>`;

        if (type === 'type2') {
            return contents.reduce((rhtml, ctn) => {
                if (ctn.seriesType) {
                    let extraStr = `(${ctn.data.percent + '%'})     客单价:${ctn.data.unit_price}`;
                    return (rhtml ? `${rhtml}<br>` : '') + `${rflag(ctn.color)}${ctn.seriesName}: ${ctn.value}${extraStr}`;
                } else {
                    return `${ctn.axisValue}`
                }
            }, '');
        } else {
            return contents.reduce((rhtml, ctn) => {
                if (ctn.seriesType) {
                    let extraStr = ctn.seriesType === 'line' ? '%' : 'USD';
                    return (rhtml ? `${rhtml}<br>` : '') + `${rflag(ctn.color)}${ctn.seriesName}: ${ctn.value}${extraStr}`;
                } else {
                    return `${ctn.axisValue}`
                }
            }, '');
        }
    }


    const optionPrice = {
        title: {
            text: 'B2B各国业绩销售额和各国占比统计表',
            textStyle: {
                fontSize: 16,
                color: '#333',
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
//            extraCssText: 'text-align: left',
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
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        legend: {
            data:['销售额','销售额占比']
        },
//        grid: {
//            left: '2%',
//            right: '8%',
//            bottom: '3%',
//            containLabel: true
//        },
        xAxis: [
            {
                type: 'category',
                data: [],
                axisPointer: {
                    type: 'line'
                },
                axisTick:{//坐标刻度
                    boundaryGap:true,
                    alignWithLabel:true,//可使坐标刻度线居中，此时需要设置 boundaryGap:true,
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '销售额',
                axisLabel: {
                    formatter: '{value} USD',
                },
            },
            {
                type: 'value',
                name: '销售额占比',
                axisLabel: {
                    formatter: '{value} %',
                }
            },
        ],
        series: [
            {
                name:'销售额',
                type:'bar',
                data:[],
                itemStyle: {
                    color: '#66a6ff'
                },
            },
            {
                name:'销售额占比',
                type:'line',
                yAxisIndex: 1,
                itemStyle: {
                    color: '#ff9f7e'
                },
                data:[],
            }
        ]
    };

    const optionSum = {
        title: {
            text: 'B2B各国业绩销量统计表',
            textStyle: {
                fontSize: 16,
                color: '#333',
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            formatter(params) {
                let in_html = '';
                let count = params.reduce((cun, item) => {
                    in_html += `${item.color}`;
                    return cun + item.value
                }, 0);
                count = Math.ceil(count * 100) / 100;
                let top = {
                    axisValue: params[0].axisValue
                }
                return toHtml([top, ...params], 'type2');
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        legend: {
            data:['销量']
        },
//        grid: {
//            left: '2%',
//            right: '8%',
//            bottom: '3%',
//            containLabel: true
//        },
        xAxis: [
            {
                type: 'category',
                data: [],
                axisPointer: {
                    type: 'line'
                },
                axisTick:{//坐标刻度
                    boundaryGap:true,
                    alignWithLabel:true,//可使坐标刻度线居中，此时需要设置 boundaryGap:true,
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '销量',
            },
        ],
        series: [
            {
                name:'销量',
                type:'bar',
                data:[],
                itemStyle: {
                    color: '#66a6ff'
                },
            },
        ]
    };

    export default {
        data () {
            return {

                ECharts: {},

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    fulfillmentType: '',
                    paymentTime: [],
                },

                optionList: {
                    fulfillmentList: []
                },

                chartData: [],

            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'storeKey'
            ])
        },
        methods: {
            ...mapActions([
                'Fn'
            ]),
            autoAddTableInx,
            getDefaultTime,
            getTobPerformanceCountInfo,

            // 列表信息查询
            handleQueryInfo (item, isFn, success) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['tob_ac_count']);
                }

                let obj = {
                    ...this.queryData,
                    start_date: this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime[1],
                    fulfillment_type: this.queryData.fulfillmentType,
                };

                getTobPerformanceCountInfo(obj).then(({data}) => {

                    if (!data.status) {
                        this.$message.error(data.errorMess || '查询失败！');
                        return;
                    }

                    this.handleQueryInfoCallBack(data, item, success);
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData = {
                    fulfillmentType: '',
                    paymentTime: this.saveDefaultTime
                }
            },

            // 操作回调
            handleOperationCallBack (data, successFn, errorFn) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    this.handleQueryInfo();
                    successFn && successFn();
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                    errorFn && errorFn();
                }
            },

            init(option) {
                const title = option.title.text;
                switch (title) {
                    case 'B2B各国业绩销售额和各国占比统计表':
                        this.ECharts = echarts.init(this.$refs.myMap1);
                        this.ECharts.setOption(option);
                        break;
                    case 'B2B各国业绩销量统计表':
                        this.ECharts = echarts.init(this.$refs.myMap2);
                        this.ECharts.setOption(option);
                        break;
                }
            },

            //查询回调
            handleQueryInfoCallBack (data, item, success) {

                this.optionList.fulfillmentList = data.data.fulfillment_list;

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'tob_ac_count',
                    value: JSON.stringify(this.queryData)
                });


                const countryName = [];
                const salesPrice = [];
                const salesPercent = [];
                const salesSum = [];
                data.data.chart.forEach(item => {
                    countryName.push(item.site);
                    salesPrice.push({
                        ...item,
                        value: item.total_price
                    });
                    salesPercent.push({
                        value: item.price_percent,
                        ...item,
                    });
                    salesSum.push({
                        value: item.total_order_sum,
                        ...item,
                    });
                });

                optionPrice.xAxis[0].data = countryName;
                optionPrice.series[0].data = salesPrice;
                optionPrice.series[1].data = salesPercent;
                optionSum.xAxis[0].data = countryName;
                optionSum.series[0].data = salesSum;

                // this.queryChartData = Array.isArray(data) ? data : [data];
                this.init(optionPrice);
                this.init(optionSum);

                success && success();
            }
        },
        created () {
            this.thisVm = this;
            // 默认时间
            this.queryData.paymentTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
            this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
            this.handleQueryInfo();
        },
        mounted() {
            this.init(optionPrice);
            this.init(optionSum);
        },
    };
</script>

<style lang="less" scoped>

    .ui-echarts {
        width: 100%;
        height: 350px;
    }

    /deep/ .ui-echart--tooltip__flag {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
    }
</style>
