<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计类型" >
                            <el-select size="small" v-model="queryData.sales_type" @change="handleChangeType">
                                <el-option
                                        v-for="(label, value) in optionList.countTypeList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement>
                            <el-select size="small" v-model="queryData.date_type">
                                <el-option
                                        v-for="(label, value) in optionList.dateTypeList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.sales_type == 'd'">
                        <SearchRequirement
                                width="0"
                                template="daterange"
                                v-model="queryData.paymentTime"
                                :pickerOptions="pickerOptions">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.sales_type == 'm'">
                        <SearchRequirement
                                width="0"
                                template="daterangeym"
                                v-model="queryData.month">
                        </SearchRequirement>
                    </li>
                    <!--<li v-if="queryData.sales_type == 'd'">-->
                        <!--<SearchRequirement label="付款时间" v-model="queryData.paymentTime" template="daterange"-->
                                           <!--:pickerOptions="pickerOptions"></SearchRequirement>-->
                    <!--</li>-->
                    <!--<li v-if="queryData.sales_type == 'm'">-->
                        <!--<SearchRequirement label="付款月份">-->
                            <!--<el-date-picker-->
                                    <!--:clearable="false"-->
                                    <!--size="small"-->
                                    <!--v-model="queryData.month"-->
                                    <!--type="monthrange"-->
                                    <!--range-separator="至"-->
                                    <!--start-placeholder="开始月份"-->
                                    <!--end-placeholder="结束月份"-->
                                    <!--format="yyyy-MM"-->
                                    <!--value-format="yyyy-MM">-->
                            <!--</el-date-picker>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <li>
                        <SearchRequirement label="平台">
                            <el-select size="small" v-model="queryData.platform" collapseTags multiple filterable v-filter>
                                <el-option v-for="item in optionList.platformList"
                                           :key="item.platform_code"
                                           :value="item.platform_code"
                                           :label="item.platform_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"
                           :params="{type: 'all'}" ></FilterBtn>
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
            <el-popover
                    placement="right-start"
                    width="720"
                    trigger="hover">
                <div class="ui-popover">
                    <p class="ui-title">数据来源：来源ERP</p>
                    <p class="ui-title">付款时间维度:</p>
                    <p>1.有收货国家且已付款</p>
                    <p>2.普通订单、合并后的订单、拆分后的子订单、被重寄的订单、客户补款的订单（排除被合并的订单、拆分的主订单、重寄后的订单）</p>
                    <p class="ui-title">发货时间维度:</p>
                    <p>1.有收货国家且已付款且已发货</p>
                    <p>2.普通订单、合并后的订单、拆分后的子订单、被重寄的订单、客户补款的订单（排除被合并的订单、拆分的主订单、重寄后的订单）</p>
                </div>
                <el-button slot="reference" type="text" icon="el-icon-info">统计规则</el-button>
            </el-popover>
        </div>

        <WarehouseSalesReportTable
                ref="myTable"
                rowKey="id"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="tableWidth"
                :showSearch="showSearch"
                :load="handleTableOpen">
        </WarehouseSalesReportTable>

        <!--<div class="ui-main-module-page">-->
        <!--<el-pagination-->
        <!--@size-change="handleSizeChange"-->
        <!--@current-change="handleCurrentChange"-->
        <!--:current-page="pageData.currentPage"-->
        <!--:page-sizes="pageSizes"-->
        <!--:page-size="pageData.currentList"-->
        <!--layout="total, sizes, prev, pager, next, jumper"-->
        <!--:total="pageData.currentTotal">-->
        <!--</el-pagination>-->
        <!--</div>-->

    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        getThirtyDayDateRange
    } from '@/services/index';
    import {
        mapActions,
        mapGetters
    } from 'vuex';

    import {
        getCurrentDateRange,
        getPreDateRange,
        getLastMonthStartDate,
        getLastMonthEndDate,
        getSixMonthRange
    } from '@/api/common/date_format'

    import {
        getWarehouseSalesReportInfo,
        getPlatformList
    } from '@/api/sales_module/warehouse_sales_report'

    import WarehouseSalesReportTable from '../SalesModule/Components/WarehouseSalesReportTable.vue'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'warehouse_sales_report';

    export default {
        name: component_name,
        components: { WarehouseSalesReportTable },
        data () {
            return {

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    obj_type: 'type',
                    sales_type: 'd',
                    date_type: '1',
                    warehouse_type: '',
                    paymentTime: [],
                    month: [],
                    platform: []
                },

                //保存默认日期
                saveDefaultTime: [],
                saveDefaultMonth: [],

                optionList: {
                    countTypeList: {
                        'd': '日',
                        'm': '月'
                    },
                    platformList: [],
                    dateTypeList: {
                        1: '付款时间',
                        2: '发货时间'
                    }
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth: [],
                tableWidth: [],
                tableHeight: '',

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                pickerOptions: {
                    disabledDate(time) {
                        return new Date(time).getTime() < 1514678400000
                    },
                    shortcuts: [
                        config.DATE_SHORTCUT.lastDay_7,
                        config.DATE_SHORTCUT.lastDay_30,
                        config.DATE_SHORTCUT.lastDay_60,
                    ]
                },
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
            getWarehouseSalesReportInfo,

            // 列表信息查询
            handleQueryInfo (params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['warehouse_sales_report']);
                }

                let obj = {
                    start_date: this.queryData.sales_type === 'd' ? this.queryData.paymentTime[0] : this.queryData.month[0],
                    end_date: this.queryData.sales_type === 'd' ? this.queryData.paymentTime[1] : this.queryData.month[1],
                    sales_type: this.queryData.sales_type,
                    date_type: this.queryData.date_type,
                    platform_code: this.queryData.platform.join(','),
                    obj_type: 'type',
                    ...params
                };

                this.getWarehouseSalesReportInfo(obj).then(({data}) => {
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
                this.queryData.obj_type = 'type';
                this.queryData.sales_type = 'd';
                this.queryData.date_type = '1';
                this.queryData.warehouse_type = '';
                this.queryData.platform = [];
                this.queryData.paymentTime = this.saveDefaultTime;
                this.queryData.month = this.saveDefaultMonth;
            },

            //监听日期类型
            handleChangeType(val) {
                if(val === 'd'){
                    this.queryData.paymentTime = this.saveDefaultTime
                }else {
                    this.queryData.month = this.saveDefaultMonth
                }
            },
            handleFirst12Month() {
                let curDate = (new Date()).getTime();
                // 将半年的时间单位换算成毫秒
                let halfYear = 365  * 24 * 3600 * 1000;
                let pastResult = curDate - halfYear;  // 半年前的时间（毫秒单位）

                // 日期函数，定义起点为半年前
                let pastDate = new Date(pastResult),
                    pastYear = pastDate.getFullYear(),
                    pastMonth = pastDate.getMonth() + 2;

                let year = new Date().getFullYear();
                let currentMonth = new Date().getMonth() + 1;

                if (pastMonth < 10) { pastMonth = '0' + pastMonth } else { pastMonth = pastMonth}
                if (currentMonth < 10) { currentMonth = '0' + currentMonth } else { currentMonth = currentMonth}
                let dateStart = pastYear + '-' + pastMonth;
                let dateEnd = year + '-' + currentMonth;

                return [dateStart, dateEnd]
            },

            // 展开表格
            handleTableOpen({ code }, treeNode, resolve) {


                this.queryData = JSON.parse(this.queryParamsInfo['warehouse_sales_report']);

                let obj = {
                    start_date: this.queryData.sales_type === 'd' ? this.queryData.paymentTime[0] : this.queryData.month[0],
                    end_date: this.queryData.sales_type === 'd' ? this.queryData.paymentTime[1] : this.queryData.month[1],
                    sales_type: this.queryData.sales_type,
                    date_type: this.queryData.date_type,
                    platform_code: this.queryData.platform.join(","),
                    obj_type: 'alias',
                    warehouse_type: code
                };

                this.getWarehouseSalesReportInfo(obj).then(({data}) => {
                    resolve(data.data.data.map((_v, _i) => {
                        this.$nextTick().then(() => {
                            this.$refs.myTable.handleRefreshTableHeight();
                        });
                        return {
                            ..._v,
                            id: `${code}_${_i}`
                        }
                    }))
                }).catch(err => {
                    console.log(err);
                });
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

            //查询回调
            handleQueryInfoCallBack (data) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'warehouse_sales_report',
                    value: JSON.stringify(this.queryData)
                });

                this.tableKey = data.data.title;
                this.tableProps = data.data.title;
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data.data.map((_v, index) => {
                        return {
                            ..._v,
                            id: index + 1,
                            hasChildren: !!index
                        }
                    });
                })
            },
        },
        created () {
            this.thisVm = this;
            try {
                getPlatformList().then(({ data }) => {
                    if (data.status) {
                        this.optionList.platformList = data.data
                    }
                });
                this.queryData.paymentTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
                this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
                this.saveDefaultMonth = this.handleFirst12Month();
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

    /deep/.el-table th {
        text-align: center!important;
    }

    .ui-main-module .ui-main-module-search li:nth-child(2) .ui-search_require {
        width: 220px!important;
    }
    .ui-main-module .ui-main-module-search li:nth-child(3) .ui-search_require {
        width: 250px!important;
    }

    /deep/.el-button [class*=el-icon-]+span {
        margin-left: 0!important;
    }

    .ui-popover {
        p {
            font-size: 12px;
        }
        .ui-title {
            font-weight: bold;
            color: #333333;
            margin: 5px 0;
        }
    }

    /deep/.ui-fn-module .el-button--text {
        padding: 9px 0;
    }

</style>
