<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li v-if="queryData.query_type === '1'">
                        <SearchRequirement label="SKU降价日期" v-model="queryData.cutPriceTime" template="daterange" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.query_type === '1'">
                        <SearchRequirement label="SKU在售日期" v-model="queryData.salesTime" template="daterange" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.query_type === '2'">
                        <SearchRequirement label="付款日期" v-model="queryData.paymentTime" template="daterange" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="采购员" >
                            <el-select size="small" v-model="queryData.purchaser" filterable v-filter multiple collapseTags>
                                <el-option
                                        v-for="item in optionList.purchaserList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="组别">
                            <el-select size="small" v-model="queryData.group" filterable v-filter multiple collapseTags>
                                <el-option
                                        v-for="item in optionList.groupList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.query_type === '2'">
                        <SearchRequirement label="业务线">
                            <el-select size="small" v-model="queryData.businessLine" filterable v-filter multiple collapseTags>
                                <el-option
                                        v-for="item in optionList.businessLineList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="一级产品线">
                            <el-select size="small" v-model="queryData.productLine" filterable v-filter multiple collapseTags>
                                <el-option
                                        v-for="item in optionList.productLineList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.query_type === '2'">
                        <SearchRequirement label="创建日期" v-model="queryData.createTime" template="daterange" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.query_type === '2'">
                        <SearchRequirement label="采购仓库" >
                            <el-select size="small" v-model="queryData.warehouse" filterable v-filter multiple collapseTags>
                                <el-option
                                        v-for="item in optionList.warehouseList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.query_type === '2'">
                        <SearchRequirement label="应回货天数" >
                            <el-input size="small" placeholder="请输入" v-model="queryData.returnDays"></el-input>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.query_type === '2'">
                        <SearchRequirement label="应完结订单天数" >
                            <el-input size="small" placeholder="请输入" v-model="queryData.orderDays"></el-input>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"
                           :params="{limit: pageData.currentList}"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button
                    v-if="item.method && item.permit(thisVm) && item.icon"
                    v-for="item in buttonList"
                    size="small"
                    :type="item.type"
                    :key="item.value"
                    :icon="item.icon"
                    @click="item.action(thisVm, item.method)">{{item.name}}</el-button>
            <div v-if="queryData.query_type === '2'" class="ui-summary_area">
                <span>平均回货天数：<span class="ui-com_money">{{saveSummaryData && saveSummaryData.sum_avg_retrun_day || 0}}</span></span>
                <span>采购订单回货准确性：<span class="ui-com_money">{{saveSummaryData && saveSummaryData.sum_avg_finish_rate || 0}}</span></span>
                <span>交期达成率：<span class="ui-com_money">{{saveSummaryData && saveSummaryData.sum_delivery_rate || 0}}</span></span>
                <span>订单完结率：<span class="ui-com_money">{{saveSummaryData && saveSummaryData.sum_ordar_rate || 0}}</span></span>
                <span>平均订单完结时间：<span class="ui-com_money">{{saveSummaryData && saveSummaryData.sum_avg_finish_day || 0}}</span></span>
                <span>平均异常处理时效：<span class="ui-com_money">{{saveSummaryData && saveSummaryData.sum_avg_abnormal_day || 0}}</span></span>
            </div>
        </div>
        <div class="ui-tabs_box">
            <el-tabs v-model="queryData.query_type" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="采购决策-降价" name="1"></el-tab-pane>
                <el-tab-pane label="采购决策-完结" name="2"></el-tab-pane>
            </el-tabs>
        </div>
        <ComTableInfo
                ref="tableArea"
                :tableWidth="tableWidth"
                :showSearch="showSearch"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :otherHeight="['el-tabs__header']">
        </ComTableInfo>

        <div class="ui-main-module-page">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageData.currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pageData.currentList"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageData.currentTotal">
            </el-pagination>
        </div>

    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        autoAddTableInx,
        getDefaultTime,
        changeTableInfoProps,
        goToNewPage,
        getThirtyDayDateRange
    } from '@/services/index';
    import {
        mapActions,
        mapGetters
    } from 'vuex';

    import {
        getPreDateRange,
        getCurrentDateRange,
        validTime
    } from '@/api/common/date_format'

    import {
        getPurchasingReducePriceInfo,
        getPurchasingCloseOrderInfo,
        getOptionList,
    } from '../../../api/purchasing_module/purchasing_decision'


    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'purchasing_decision';

    export default {
        name: component_name,
        data () {
            return {

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    query_type: '1',
                    cutPriceTime: [],
                    salesTime: [],
                    paymentTime: [],
                    createTime: [],
                    businessLine: [],
                    group: [],
                    purchaser: [],
                    productLine: [],
                    warehouse: [],
                    returnDays: '',
                    orderDays: '',
                },

                //保存默认日期
                saveDefaultDate: '',

                optionList: {
                    businessLineList: [],
                    groupList: [],
                    purchaserList: [],
                    productLineList: [],
                    warehouseList: [],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableWidth: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                saveSummaryData: {}

            };
        },
        computed: {
            ...mapGetters([
                'queryParamsInfo',
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,
            getPurchasingReducePriceInfo,
            getPurchasingCloseOrderInfo,

            // 列表信息查询
            handleQueryInfo (params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['purchasing_decision']);
                }

                let reg = /^\d+(\.\d+)?$/;
                if(this.queryData.returnDays) {
                    if(!reg.test(this.queryData.returnDays)) {
                        this.$message.warning('应回货天数请输入数字！');
                        return;
                    }
                }
                if(this.queryData.orderDays) {
                    if(!reg.test(this.queryData.orderDays)) {
                        this.$message.warning('应完结订单天数请输入数字！');
                        return;
                    }
                }

                let obj = {
                    sku_edition_date_s: this.queryData.cutPriceTime && this.queryData.cutPriceTime[0] && this.queryData.cutPriceTime[0] + ' 00:00:00',
                    sku_edition_date_e: this.queryData.cutPriceTime && this.queryData.cutPriceTime[1] && this.queryData.cutPriceTime[1] + ' 23:59:59',
                    sku_sale_date_s: this.queryData.salesTime && this.queryData.salesTime[0] && this.queryData.salesTime[0] + ' 00:00:00',
                    sku_sale_date_e: this.queryData.salesTime && this.queryData.salesTime[1] && this.queryData.salesTime[1] + ' 23:59:59',
                    pay_time_s: this.queryData.salesTime && this.queryData.paymentTime[0] && this.queryData.paymentTime[0] + ' 00:00:00',
                    pay_time_e: this.queryData.salesTime && this.queryData.paymentTime[1] && this.queryData.paymentTime[1] + ' 23:59:59',
                    po_create_time_s: this.queryData.salesTime && this.queryData.createTime[0] && this.queryData.createTime[0] + ' 00:00:00',
                    po_create_time_e: this.queryData.salesTime && this.queryData.createTime[1] && this.queryData.createTime[1] + ' 23:59:59',
                    purchase_type_id: this.queryData.businessLine.join(','),
                    product_onelevel_id: this.queryData.productLine.join(','),
                    buyer_id: this.queryData.purchaser.join(','),
                    buyer_group: this.queryData.group.join(','),
                    warehouse_code: this.queryData.warehouse.join(','),
                    return_day: this.queryData.returnDays,
                    finish_day: this.queryData.orderDays,
                    ...params,
                };
                let fnName = this.queryData.query_type === '1' ? this.getPurchasingReducePriceInfo : this.getPurchasingCloseOrderInfo;

                fnName(obj).then(({data}) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData.cutPriceTime = [];
                this.queryData.salesTime = [];
                this.queryData.paymentTime = [];
                this.queryData.createTime = [];
                this.queryData.businessLine = [];
                this.queryData.group = [];
                this.queryData.purchaser = [];
                this.queryData.productLine = [];
                this.queryData.warehouse = [];
                this.queryData.returnDays = '';
                this.queryData.orderDays = '';
            },

            handleTabClick(tab) {
                this.queryData.query_type = tab.name;
                this.handleResetQueryInfo();
                this.handleOptionCallBack();
                this.handleQueryInfo();
                this.$refs.tableArea.handleRefreshTableHeight();
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

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    isExcel: 1,
                }, true)
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

            //默认时间
            handleGetDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.salesTime = [data.end, data.end];
                });
            },

            handleOptionCallBack() {
                getOptionList({
                    module: this.queryData.query_type === '1' ? 'decision' : 'finish'
                }).then(({ data }) => {
                    this.optionList.productLineList = data.categor_dict.line_list;
                    this.optionList.purchaserList = data.categor_dict.buyer_list;
                    this.optionList.groupList = data.categor_dict.group_list;
                    this.optionList.businessLineList = data.categor_dict.purchase_type_id;
                    this.optionList.warehouseList = data.categor_dict.warehouse_code;
                });
            },

            //查询回调
            handleQueryInfoCallBack (data) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'purchasing_decision',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = ['序号', ...data.title];
                if (this.queryData.query_type === '1') {
                    this.tableProps = ['index', 'statis_date', 'buyer_id', 'group_name', 'purchase_quantity', 'warehous_quantity', 'cut_pricetype_qty', 'y_cut_pricetype_qty', 'cut_price_rate', '6_price_change_date', 'sku_change_price', 'instock_change_price'];
                    this.tableWidth = ['60', '100', '120', '130', '', '', '', '', '', '200', '140', ''];
                }else {
                    this.tableProps = ['index', 'statis_date', 'bayer_name', 'group_name', 'avg_retrun_day', 'avg_finish_rate', 'delivery_rate', 'ordar_rate', 'avg_finish_day', 'avg_abnormal_day'];
                    this.saveSummaryData = data.data_table_2;
                }

                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data_table;
                });

                //分页
                this.pageData.currentList = data.page_data.limit * 1;
                this.pageData.currentPage = data.page_data.offset * 1;
                this.pageData.currentTotal = data.page_data.total * 1;
            },
        },
        created () {
            this.thisVm = this;
            try {
                this.handleOptionCallBack();
                this.handleQueryInfo();
            } catch (e) {
                console.log(e);
            }
        },
    };
</script>

<style lang="less" scoped>
    .ui-input__tree {
        .ui-base--area {
            max-height: 400px;
            overflow: auto;
        }

        .ui-tree__btn {
            padding-left: 20px;
            border-top: 1px solid #e6e6e6;
        }
    }

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0!important;
    }

    .ui-fn-module .ui-summary_area {
        float: right;
        font-size: 12px;
        color: #333333;
        margin-top: 10px;

        span:not(:last-child) {
            margin-right: 5px;
        }
    }

</style>
