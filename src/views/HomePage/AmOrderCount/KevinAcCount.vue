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
                            <el-select size="small" v-model="queryData.fulfillment_type">
                                <el-option v-for="item in optionList.fulfillmentList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <!--<li>-->
                    <!--<SearchRequirement v-model="queryData.summary_type" label="统计类型" template="select" :options="optionList.countTypeList">-->
                    <!--</SearchRequirement>-->
                    <!--</li>-->
                </ul>
                <FilterBtn refTable="tableArea" :params="{limit: pageData.currentList}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <!--<span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon-->
                    <!--:name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>-->
        </div>
        <TemplateDefault :staticNum="120" color="#FFFFFF">
            <div class="ui-content_area clearFix">
                <div class="ui-content_area--main">
                    <ComBarEchart v-for="(item, index) in chartData" :key="item.value"
                                  :data="item"
                                  title="亚马逊站点销售额统计表"
                                  y-name="销售额"
                                  unit="USD"
                                  dataKey="total_price"></ComBarEchart>
                </div>
            </div>
            <div class="ui-content_area clearFix">
                <div class="ui-content_area--main">
                    <ComBarEchart v-for="(item, index) in chartData" :key="item.value"
                                  :data="item"
                                  title="亚马逊站点销量统计表"
                                  y-name="销量"
                                  dataKey="total_order_sum"></ComBarEchart>
                </div>
            </div>
            <div class="ui-content_area clearFix">
                <div class="ui-content_area--main">
                    <ComLineEchart v-for="(item, index) in chartData"
                                   :key="item.value"
                                   :data="item"
                                   title="亚马逊站点销量占比统计"
                                   unit="%"
                                   y-name="销量占比"></ComLineEchart>
                </div>
            </div>
        </TemplateDefault>
    </div>
</template>

<script>
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
        getCountriesAcCountInfo
    } from '@/api/am_order_count/countries_ac_count';
    import {
        getGroupOptionList
    } from '@/api/common';
    export default {
        data () {
            return {

                // 时间搜索框宽度设置
                searchDateWidth: config.SEARCH_DATE_WIDTH,

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    group_id: '',
                    group_ids: '',
                    account_id: '',
                    account_ids: '',
                    fulfillment_type: '',
                    summary_type: 'd',
                    paymentTime: [],
                },

                optionList: {
                    countTypeList: {
                        'd': '日'
                    },
                    fulfillmentList: []
                },

                tableData: [],
                tableKey: [],
                tableProps: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                chartData: [],
                queryChartData: {},
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
            getCountriesAcCountInfo,
            getGroupOptionList,

            // 列表信息查询
            handleQueryInfo (item, isFn, success) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['kevin_ac_count']);
                }

                let obj = {
                    ...this.queryData,
                    start_date: this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime[1],
                    is_kevin: 1
                };

                this.getCountriesAcCountInfo(obj).then(({data}) => {

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
                    group_id: '',
                    group_ids: '',
                    account_id: '',
                    account_ids: '',
                    fulfillment_type: '',
                    summary_type: 'd',
                    paymentTime: this.saveDefaultTime
                }
            },

            //高级筛选
            handleClickFilter () {
                this.FilterShow = !this.FilterShow;
            },

            // 分页条数切换
            handleSizeChange (val) {
                this.handleQueryInfo({
                    limit: val,
                    offset: 1
                }, true);
            },

            // 跳转页数切换
            handleCurrentChange (val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true);
            },

            // 操作回调
            handleOperationCallBack (data, successFn, errorFn) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                    successFn && successFn();
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                    errorFn && errorFn();
                }
            },

            //查询回调
            handleQueryInfoCallBack ({ data }, item, success) {

                this.optionList.countTypeList = data.summary_type_list
                this.optionList.fulfillmentList = data.fulfillment_list

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'kevin_ac_count',
                    value: JSON.stringify(this.queryData)
                });

                // this.queryChartData = Array.isArray(data) ? data : [data];
                this.chartData.splice(0);
                this.$nextTick().then(() => {
                    this.chartData = [data];
                })

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
    };
</script>

<style lang="less" scoped>

</style>
