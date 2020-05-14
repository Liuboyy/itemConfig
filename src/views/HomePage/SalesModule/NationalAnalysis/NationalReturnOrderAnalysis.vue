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
                    <li>
                        <SearchRequirement label="渠道">
                            <el-select size="small" v-model="queryData.fulfillment_type">
                                <el-option v-for="item in optionList.fulfillmentList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement v-model="queryData.is_kevin" label="是否Kevin" template="select" :options="optionList.isKevinList">
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :params="{}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module"></div>
        <TemplateDefault :staticNum="120" color="#FFFFFF">
            <div class="ui-content_area clearFix">
                <div class="ui-content_area--main">
                    <Eachrts v-for="(item, index) in chartData" width="100%" :key="index" :data="item" name="returnOrder"></Eachrts>
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
        getNationalReturnOrderInfo,
        getOptionList
    } from '@/api/sales_module/national_return_order_analysis';

    import Eachrts from './components/Eachrts.vue'

    const component_name = 'national_return_order_analysis';

    export default {
        name: component_name,
        components: { Eachrts },
        data () {
            return {

                ECharts: {},

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    countTime: [],
                    summary_type: 'd',
                    fulfillment_type: '',
                    is_kevin: '',
                },

                optionList: {
                    fulfillmentList: [],
                    isKevinList: {
                        '': '全部',
                        'y': '是',
                        'n': '否'
                    },
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
            getNationalReturnOrderInfo,

            // 列表信息查询
            handleQueryInfo (params, isFn, success) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['national_return_order_analysis']);
                }


                let obj = {
                    start_date: this.queryData.countTime[0],
                    end_date: this.queryData.countTime[1],
                    summary_type: this.queryData.summary_type,
                    fulfillment_type: this.queryData.fulfillment_type,
                    is_kevin: this.queryData.is_kevin,
                };

                this.getNationalReturnOrderInfo(obj).then(({data}) => {

                    if (!data.status) {
                        this.$message.error(data.errorMess || '查询失败！');
                        return;
                    }

                    this.handleQueryInfoCallBack(data, success, params);
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData.countTime = this.saveDefaultTime;
                this.queryData.summary_type = 'd';
                this.queryData.fulfillment_type = '';
                this.queryData.is_kevin = '';
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

            //查询回调
            handleQueryInfoCallBack (data, success) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'national_return_order_analysis',
                    value: JSON.stringify(this.queryData)
                });

                let chartData = [...data.data];

                if (this.chartData.length) {
                    chartData = [...data.data];
                }
                this.handleRefreshEChart(chartData);


                success && success();
            }
        },
        created () {
            this.thisVm = this;

            getOptionList().then(({ data }) => {
                this.optionList.fulfillmentList = data.data.fulfillment_list;
            });
            this.queryData.countTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
            this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
            this.handleQueryInfo();
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
