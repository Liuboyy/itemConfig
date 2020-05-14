<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计日期">
                            <el-date-picker
                                    size="small"
                                    type="date"
                                    :clearable="false"
                                    v-model="queryData.countTime"
                                    placeholder="选择日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :params="{}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module"></div>
        <TemplateDefault :staticNum="120" color="#FFFFFF">
            <div ref="myMap" class="ui-echarts"></div>
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
        getPreDateRange,
        getCurrentDateRange
    } from '../../../../api/common/date_format'
    import {
        mapActions,
        mapGetters
    } from 'vuex';
    import {
        getNationalFbaInventoryAnalysis
    } from '@/api/sales_module/national_inventory_analysis';

    const option = {
        color: ['#66a6ff' ,'#ffdd61'],
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
            data:[ '在库金额','在途金额',]
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
                },
//                nameTextStyle: {
//                    color: '#FF2E2F'
//                },
//                axisLine: {
//                    lineStyle: {
//                        color: '#FF2E2F'
//                    }
//                }
            },
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
        ],
        animation: false
    };

    const component_name = 'national_inventory_analysis';

    export default {
        name: component_name,
        data () {
            return {

                ECharts: {},

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    countTime: '',
                },

                chartData: [],

                saveDefaultTime: '',

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
            getNationalFbaInventoryAnalysis,

            // 列表信息查询
            handleQueryInfo (item, isFn, success) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['national_inventory_analysis']);
                }

                let obj = {
                    date: this.queryData.countTime,
                };

                this.getNationalFbaInventoryAnalysis(obj).then(({data}) => {

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
                    countTime: this.saveDefaultTime
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
                this.ECharts = echarts.init(this.$refs.myMap);
                this.ECharts.setOption(option);
            },

            //查询回调
            handleQueryInfoCallBack (data, item, success) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'national_inventory_analysis',
                    value: JSON.stringify(this.queryData)
                });


                let arr;
                arr = [[], [], [], []];
                data.data.chart.forEach(_v => {
                    arr[0].push(Number(_v.warehouse_money));
                    arr[1].push(Number(_v.onway_money));
                    arr[2].push(_v.site);
                });

                option.xAxis[0].data = arr[2];

                option.series = option.series.map((_v, _i) => {
                    return {
                        ..._v,
                        data: arr[_i]
                    }
                });

                this.init(option);

                success && success();
            }
        },
        created () {
            this.thisVm = this;
            // 默认时间

            getCurrentDateRange().then(( data ) => {
                this.saveDefaultTime = data.end;
                this.queryData.countTime = this.saveDefaultTime;
                this.handleQueryInfo();
            });
        },
        mounted() {
            this.init(option);
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
