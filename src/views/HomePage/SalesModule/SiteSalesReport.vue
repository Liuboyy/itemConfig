<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
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
                    <li>
                        <SearchRequirement label="平台" >
                            <el-select size="small" v-model="queryData.platform" filterable collapseTags multiple v-filter>
                                <el-option
                                        v-for="item in optionList.platformList"
                                        :key="item.platform_code"
                                        :value="item.platform_code"
                                        :label="item.platform_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :params="{}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon
                    :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
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
        <div class="ui-main-module-table">
            <el-table ref="myTable" highlight-current-row :height="tableHeight" :data="tableData" v-loading="tableLoading" :row-key="testFn">
                <el-table-column label="日期" prop="date" minWidth="85"></el-table-column>
                <el-table-column v-for="(item, key, index) in tableKey" :label="item" :key="index">
                    <el-table-column label="订单量" minWidth="42">
                        <span slot-scope="scope">{{scope.row[key] && scope.row[key].total_order_sum}}</span>
                    </el-table-column>
                    <el-table-column label="销售额($)" minWidth="85">
                        <span slot-scope="scope" class="ui-table_sale">{{scope.row[key] && scope.row[key].total_price}}</span>
                    </el-table-column>
                </el-table-column>
                <template slot="empty">
                    <div>
                        <NotData v-show="!tableData.length"></NotData>
                    </div>
                </template>
            </el-table>
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
        getSiteSalesReportInfo,
        getPlatformList,
    } from '@/api/sales_module/site_sales_report';

    import {
        getCurrentDateRange,
        getPreDateRange,
        getLastMonthStartDate,
        getLastMonthEndDate,
        getSixMonthRange,
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'site_sales_report';

    export default {
        name: component_name,
        data () {
            return {

                // 时间搜索框宽度设置
                searchDateWidth: config.SEARCH_DATE_WIDTH,

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    sales_type: 'd',
                    paymentTime: [],
                    platform: [],
                    month: [],
                    date_type: '1'
                },
                saveDefaultTime: [],
                saveDefaultMonth: [],

                optionList: {
                    countTypeList: {
                        'd': '日',
                        'm': '月'
                    },
                    fulfillmentList: [],
                    platformList: [],
                    dateTypeList: {
                        1: '付款时间',
                        2: '发货时间'
                    }
                },

                tableData: [],
                tableKey: [],
                allTableKey: [],
                tableProps: [],
                tableHeight: '100px',

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                isDate: false,

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

                tableLoading: false
            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
            ])
        },
        methods: {
            ...mapActions([]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,
            getSiteSalesReportInfo,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['site_sales_report']);
                }

                let obj = {
                    start_date: this.queryData.sales_type === 'd' ? this.queryData.paymentTime[0] : this.queryData.month[0],
                    end_date: this.queryData.sales_type === 'd' ? this.queryData.paymentTime[1] : this.queryData.month[1],
                    sales_type: this.queryData.sales_type,
                    platform: this.queryData.platform.join(','),
                    date_type: this.queryData.date_type,
                    ...params
                };

                this.tableLoading = true;
                this.getSiteSalesReportInfo(obj).then(({data}) => {
                    if(data.status === 2) {
                        this.tableLoading = false;
                        return;
                    }
                    if(data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                        this.tableLoading = false;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData = {
                    sales_type: 'd',
                    date_type: '1',
                    platform: [],
                    paymentTime: this.saveDefaultTime,
                    month: this.saveDefaultMonth,
                }
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

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    isExcel: 1
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
            handleQueryInfoCallBack(data) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'site_sales_report',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.allTableKey = {...data.data.title};
                this.tableKey = this.getKeyList(0);
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data.data;
                    this.$nextTick().then(() => {
                        this.tableLoading = false;
                        setTimeout(() => {
                            this.tableKey = JSON.parse(JSON.stringify(this.allTableKey));
                            const tableData = JSON.parse(JSON.stringify(this.tableData));
                            this.tableData.splice(0);
                            this.tableData = tableData;
                        }, 100)
                    })
                })
            },

            testFn(row) {
                return row.date
            },

            getKeyList(index, maxLength = 13) {
                let keys = {};
                Object.entries(this.allTableKey).forEach((item, inx) => {
                    if (inx >= index && inx < index + maxLength) {
                        keys[item[0]] = item[1];
                    }
                })
                this.$nextTick().then(() => {
                    this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
                })
                return keys;
            }
        },
        created () {
            this.thisVm = this;
            getPlatformList().then(({ data }) => {
                if (data.status) {
                    this.optionList.platformList = data.data;
                }else {
                    this.$message.error(data.errorMess || '操作失败')
                }
            });
            try {
                this.queryData.paymentTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
                this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
                this.saveDefaultMonth = this.handleFirst12Month();
                this.handleQueryInfo();

            } catch (e) {
                console.log(e);
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.tableHeight = config.setTableHeight('ui-main-module', this.otherHeight);
                this.$refs['myTable'].doLayout();
            });
        },
        watch: {
            showSearch() {
                let vm = this;
                document.querySelector('body').style.overflow = 'hidden';
                setTimeout(() => {
                    vm.tableHeight = config.setTableHeight('ui-main-module', this.otherHeight);
                    vm.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400)
            }
        }
    };
</script>

<style lang="less" scoped>

    @border: 1px solid #e6e6e6;

    /deep/.ui-main-module-table {
        .el-table .cell {
            padding: 8px 2px!important;
        }
        .el-table {
            border-top: @border;
            border-left: @border;
            text-align: center;
        }
        .el-table tr td {
            text-align: center;
            border-bottom: @border;
            border-right: @border;
            color: #000;
        }
        .el-table tr th {
            text-align: center;
            border-bottom: @border;
            border-right: @border;
            background: #FFFFFF!important;
            color: #000;
        }

        //平台框线处理 #d4e5ff
        .el-table tr th[colspan="2"],
        .el-table tr th[rowspan="1"]:nth-child(2n),
        .el-table tr th[colspan="1"]:first-child:not([rowspan="1"]),
        .el-table tr td:nth-child(2n-1){
            border-right: 1px solid #d3e9fa;
        }
    }

    /deep/.ui-checkbox .ui-search_require {
        width: 100px!important;
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
