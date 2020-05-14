<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计类型" >
                            <el-select size="small" v-model="queryData.summary_type" @change="handleChangeType">
                                <el-option
                                        v-for="(label, value) in optionList.countTypeList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.summary_type == 'd'">
                        <SearchRequirement label="统计日期" v-model="queryData.countTime" template="daterange" :isOption="false">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.summary_type == 'm'">
                        <SearchRequirement label="统计月份">
                            <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.countTime"
                                    type="monthrange"
                                    range-separator="至"
                                    start-placeholder="开始月份"
                                    end-placeholder="结束月份"
                                    format="yyyy-MM"
                                    value-format="yyyy-MM">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <!--<li>-->
                        <!--<SearchRequirement label="站点">-->
                            <!--<el-select size="small" v-model="queryData.site">-->
                                <!--<el-option v-for="item in optionList.siteList"-->
                                           <!--:key="item.value"-->
                                           <!--:value="item.value"-->
                                           <!--:label="item.label"></el-option>-->
                            <!--</el-select>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                </ul>
                <FilterBtn refTable="tableArea" :params="{}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module"></div>
        <TemplateDefault :staticNum="120" color="#FFFFFF">
            <!--<div ref="myMap" class="ui-echarts"></div>-->
            <div class="ui-content_area clearFix">
                <div class="ui-content_area--main">
                    <Eachrts v-for="(item, index) in chartData" width="100%" :key="index" :data="item"></Eachrts>
                </div>
            </div>
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
        getSixMonthRange
    } from '../../../../api/common/date_format'
    import {
        mapActions,
        mapGetters
    } from 'vuex';
    import {
        getNationalFbaTimeInventoryInfo,
        getOptionList
    } from '@/api/sales_module/national_time_inventory';

    import Eachrts from './components/Eachrts.vue'

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

    const option = {
        color: [ '#66a6ff', '#ffdd61', '#ff9f7e'],
        title: {
            text: '',
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
            extraCssText: 'text-align: left',
            formatter(params) {
                return toHtml([{axisValue: params[0].axisValue}, ...params]);
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
//        grid: {
//            left: '4%',
//            right: '4%',
//            bottom: '3%',
//            containLabel: true
//        },
        legend: {
            data:['在库金额', '在途金额', '90天以上库存金额占比']
        },
        xAxis: [
            {
                type : 'category',
                boundaryGap : ['10%', '10%'],
                data : [],
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '库存金额',
                axisLabel : {
                    show : true,
                },
                splitLine: {
                    show: false
                }
            },
            {
                type: 'value',
                name: '90天以上库存金额占比',
                min: 0,
                axisLabel : {
                    show: true,
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
                data: [],
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

    const component_name = 'national_time_inventory';

    export default {
        name: component_name,
        components: {Eachrts},
        data () {
            return {

                ECharts: {},

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    countTime: [],
                    site: 'us',
                    summary_type: 'd'
                },

                optionList: {
                    siteList: [],
                    countTypeList: {
                        'd': '日',
                        'm': '月'
                    },
                },

                chartData: [],

                saveDefaultTime: [],

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
            getNationalFbaTimeInventoryInfo,
            getOptionList,

            // 列表信息查询
            handleQueryInfo (item, isFn, success) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['national_time_inventory']);
                }

                let obj = {
                    start_date: this.queryData.countTime[0],
                    end_date: this.queryData.countTime[1],
                    summary_type: this.queryData.summary_type
//                    site: this.queryData.site,
                };

                this.getNationalFbaTimeInventoryInfo(obj).then(({data}) => {

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
                    countTime: this.saveDefaultTime,
                    site: 'us',
                    summary_type: 'd'
                }
            },

            //监听日期类型
            handleChangeType(val) {
                if(val && val === 'd'){
                    this.queryData.countTime = this.saveDefaultTime
                }else {
                    getSixMonthRange().then((data) => {
                        this.queryData.countTime =  [data.start, data.end];
                    });
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

            // 刷新图表
            handleRefreshEChart(data) {
                this.chartData.splice(0);
                this.$nextTick().then(() => {
                    this.chartData = data;
                })
            },

            init(option) {
                this.ECharts = echarts.init(this.$refs.myMap);
                this.ECharts.setOption(option);
            },

            //查询回调
            handleQueryInfoCallBack (data, item, success) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'national_time_inventory',
                    value: JSON.stringify(this.queryData)
                });

//                let arr;
//                arr = [[], [], [], []];
//
//                data.data.chart.forEach(_v => {
//                    arr[0].push(Number(_v.warehouse_money));
//                    arr[1].push(Number(_v.onway_money));
//                    arr[2].push(Number(_v.over90_warehouse_money_percent));
//                    arr[3].push(_v.date);
//                });
//
//                option.xAxis[0].data = arr[3];
//                option.series = option.series.map((_v, _i) => {
//                    let obj = {
//                        ..._v,
//                        data: arr[_i]
//                    };
//
//                    if (_i === 2) {
//                        obj.yAxisIndex = 1
//                    }
//                    return obj;
//                });
//
//                option.yAxis[1].max = data.data.data_max.max_percent;
//
//                this.init(option);

                let chartData = [...data.data];

                if (this.chartData.length) {
                    chartData = [...data.data];
                }
                this.handleRefreshEChart(chartData)


                success && success();
            }
        },
        created () {
            this.thisVm = this;

            this.getOptionList().then(({ data }) => {
                this.optionList.siteList = data.data.site_list;
                this.queryData.countTime = getThirtyDayDateRange(new Date(new Date().getTime()));
                this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime()));
                this.handleQueryInfo();
            });
        },
        mounted() {
//            this.init(option);
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
