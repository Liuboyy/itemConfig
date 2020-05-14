<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="采购单创建时间" v-model="queryData.createTime" template="daterange" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="付款时间" v-model="queryData.paymentTime" template="daterange" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="采购员">
                            <el-select size="small" v-model="queryData.buyer" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.buyerList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="组别">
                            <el-select size="small" v-model="queryData.group" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.groupList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="业务线">
                            <el-select size="small" v-model="queryData.businessLine" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.businessLineList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="统计截止日期">
                            <el-date-picker
                                    size="small"
                                    type="dates"
                                    v-model="queryData.countTime"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    placeholder="最多可选三个日期"
                                    @change="handleChangeTime">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="未完结类型">
                            <el-select size="small" v-model="queryData.unfinishedType" filterable v-filter clearable>
                                <el-option v-for="item in optionList.unfinishedTypeList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="结算方式">
                            <el-select size="small" v-model="queryData.settleWay" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.settleWayList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn  :resetFn="handleResetQueryInfo" :queryFn="handleQueryInfo" refTable="tableArea"
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
        </div>

        <TableIndex :tableData="tableData" :showSearch="showSearch" v-loading="tableLoading" @click="handleClickInfo"></TableIndex>

        <div class="ui-main-module-page">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageData.currentPage"
                    :page-sizes="pageSizes"
                    size="small"
                    :page-size="pageData.currentList"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageData.currentTotal">
            </el-pagination>
        </div>

        <ComDialogPreview
                isPage
                isButton
                @export="handleDialogExport"
                :visible.sync="isDialogShow"
                :tableData="dialog.tableData"
                :tableKey="dialog.tableKey"
                :tableProps="dialog.tableProps"
                :dialogPageData="dialog.pageData"
                @dialogPageChange="dialogPageChange"></ComDialogPreview>
    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        autoAddTableInx
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";
    import {
        getOrderFollowReportInfo,
        getOptionList,
        getDialogDetailsInfo
    } from '@/api/purchasing_module/order_follow_report';

    import {
        getWarehouseList,
    } from '@/api/planning_module/d_warehouse_stock_list'

    import {
        getPreDateRange,
        getCurrentDateRange
    } from '@/api/common/date_format'

    import TableIndex from './TableIndex.vue'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'order_follow_report';

    export default {
        name: component_name,
        components: {TableIndex},
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    createTime: [],
                    paymentTime: [],
                    countTime: [],
                    buyer: [],
                    group: [],
                    businessLine: [],
                    settleWay: [],
                    unfinishedType: '',
                },

                optionList: {
                    buyerList: [],
                    groupList: [],
                    businessLineList: [],
                    unfinishedTypeList: [],
                    settleWayList: []
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth:[],
                tableLoading: false,

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                //弹框
                isDialogShow: false,
                dialog: {
                    tableData: [],
                    tableKey: [],
                    tableProps: [],
                    pageData: {
                        offset: 1,
                        limit: 20,
                        total: 0
                    },
                    params: {},
                    type: '',
                },

                saveDefaultDate: [],

                //判断统计日期选择是否超过三个
                isGreater3: false,
                queryType: '',
            }

        },
        computed: {
            ...mapGetters([
                'loginInfo',
                'queryParamsInfo',
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'Fn'
            ]),
            autoAddTableInx,
            getOrderFollowReportInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['order_follow_report']);
                }

                if(this.isGreater3) {
                    this.$message.warning('最多只能选三个日期！');
                    return;
                }

                let obj = {
                    po_create_time_s: this.queryData.createTime && this.queryData.createTime[0] && this.queryData.createTime[0] + ' 00:00:00',
                    po_create_time_e: this.queryData.createTime && this.queryData.createTime[1] && this.queryData.createTime[1] + ' 23:59:59',
                    pay_time_s: this.queryData.paymentTime && this.queryData.paymentTime[0] && this.queryData.paymentTime[0] + ' 00:00:00',
                    pay_time_e: this.queryData.paymentTime && this.queryData.paymentTime[1]&& this.queryData.paymentTime[1] + ' 23:59:59',
                    tj_sj: this.queryData.countTime && this.queryData.countTime.join(','),
                    buyer_id: this.queryData.buyer.join(','),
                    buyer_group: this.queryData.group.join(','),
                    purchase_type_id: this.queryData.businessLine.join(','),
                    account_type: this.queryData.settleWay.join(','),
                    filter_number: this.queryData.unfinishedType,
                };

                obj = Object.assign(params || {}, obj);

                this.getOrderFollowReportInfo(obj).then(({ data }) => {
                    if (data.status === 2) {
                        this.tableLoading = false;
                        return;
                    }
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.tableLoading = false;
                        this.$message.error(data.errorMess || '查询失败')
                    }
                })
            },

            // 查询重置
            handleResetQueryInfo() {
                this.queryData = {
                    countTime: this.saveDefaultDate,
                    createTime: [],
                    paymentTime: [],
                    buyer: [],
                    group: [],
                    businessLine: [],
                    settleWay: [],
                    unfinishedType: '',
                };
            },

            //监听统计日期
            handleChangeTime(val) {
                if (val && val.length > 3) {
                    this.isGreater3 = true;
                    this.$message.warning('最多只能选三个日期！');
                }else {
                    this.isGreater3 = false;
                }
            },

            handleClickInfo(row, type, params) {
                this.dialog.params = row;
                this.dialog.type = type;
                let obj = {
                    type: type,
                    po_create_time_s: row.po_create_time_s,
                    po_create_time_e: row.po_create_time_e,
                    pay_time_s: row.pay_time_s,
                    pay_time_e: row.pay_time_e,
                    buyer_id: row.buyer_id,
                    group_id: row.group_id,
                    purchase_type_id: row.purchase_type_id,
                    tj_sj: row.statis_date,
                    account_type: row.account_id,
                    ...params
                };
                getDialogDetailsInfo(obj).then(({ data }) => {
                    if(data.status === 2 ) return;
                    if (data.status) {
                        this.isDialogShow = true;
                        this.dialog.tableData = data.datalist;
                        this.dialog.tableKey = ['序号', 'PO单号', 'PO创建时间', 'SKU', '采购员', '付款时间', '采购数量'];
                        this.dialog.tableProps = ['index', 'purchase_number', 'create_time', 'sku', 'bayer_name', 'pay_time', 'qurchase_num'];
                        this.dialog.pageData.limit = data.page_data.limit;
                        this.dialog.pageData.offset = data.page_data.offset;
                        this.dialog.pageData.total = data.page_data.total;
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                })
            },
            //弹框分页
            dialogPageChange({limit, offset}) {
                this.handleClickInfo(this.dialog.params, this.dialog.type, {limit, offset});
            },
            //弹框导出
            handleDialogExport() {
                this.handleClickInfo(this.dialog.params, this.dialog.type, {isExcel: 1});
            },


            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || '操作失败');
                }

            },

            // 分页条数切换
            handleSizeChange(val) {
                this.handleQueryInfo({
                    limit: val,
                    offset: 1
                }, true)
            },

            // 跳转页数切换
            handleCurrentChange(val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true)
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    isExcel: 1,
                    total_count: this.pageData.currentTotal
                }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'order_follow_report',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableLoading = false;
                    this.tableData = data.data_table.map(item => {
                        return {
                            ...item,
                            po_create_time_s: this.queryData.createTime && this.queryData.createTime[0] && this.queryData.createTime[0] + ' 00:00:00',
                            po_create_time_e: this.queryData.createTime && this.queryData.createTime[1] && this.queryData.createTime[1] + ' 23:59:59',
                            pay_time_s: this.queryData.paymentTime && this.queryData.paymentTime[0] && this.queryData.paymentTime[0] + ' 00:00:00',
                            pay_time_e: this.queryData.paymentTime && this.queryData.paymentTime[1]&& this.queryData.paymentTime[1] + ' 23:59:59',
                        }
                    });
                });

                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.offset * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                this.tableLoading = true;
                getOptionList({module: 'order_follow'}).then(({ data }) => {
                    this.optionList.buyerList = data.categor_dict.buyer_list;
                    this.optionList.groupList = data.categor_dict.group_list;
                    this.optionList.businessLineList = data.categor_dict.line_list;
                    this.optionList.unfinishedTypeList = data.categor_dict.filter_list;
                    this.optionList.settleWayList = data.categor_dict.pay_list;
                });
                getCurrentDateRange().then(( data ) => {
                    this.saveDefaultDate = [data.end];
                    this.queryData.countTime = this.saveDefaultDate;
                    this.handleQueryInfo();
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>

<style scoped lang="less">

    @color: #ff9900;

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0!important;;
    }

    .text-color {
        color:  @color;
    }

    .ui-layout_edit-dialog {
        .ui-check_box {
            .el-checkbox+.el-checkbox {
                margin-left: 0;
            }
            .el-checkbox {
                width: 200px;
                margin: 5px 30px 5px 0;
            }
            .el-checkbox__label {
                font-size: 12px;
            }
        }
    }

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


</style>
