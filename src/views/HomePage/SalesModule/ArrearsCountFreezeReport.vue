<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="付款时间">
                            <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.paymentTime"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
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
                <FilterBtn refTable="tableArea" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
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
        </div>
        <div class="ui-main-module-table">
            <div class="ui-main-tab">
                <el-badge v-for="(item, index) in optionList.moduleTypeList" :key="index">
                    <li class="ui-main-tab-box">
                        <span @click="handleToggleTableInfo(item.value)" :class="queryData.query_type === item.value && 'ui-active'">
                            {{item.label}}<i class="ui-tab_line"></i></span>
                    </li>
                </el-badge>
            </div>
            <!--<el-table ref="myTable" :row-key="testFn" :height="tableHeight" :data="tableData" v-loading="tableLoading">-->
                <!--<el-table-column label="日期" prop="date" minWidth="85" fixed></el-table-column>-->
                <!--<el-table-column  v-for="(item, key, index) in tableKey" :label="item" :key="index">-->
                    <!--<el-table-column label="国内仓">-->
                        <!--<el-table-column label="订单量" minWidth="45">-->
                            <!--<span slot-scope="scope">{{(scope.row[key] && scope.row[key].order_sum_1) || '&#45;&#45;'}}</span>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="欠货量" minWidth="45">-->
                            <!--<span slot-scope="scope">{{(scope.row[key] && scope.row[key].order_lack_1) || '&#45;&#45;'}}</span>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="欠货率" minWidth="50">-->
                            <!--<span slot-scope="scope">{{(scope.row[key] && scope.row[key].lack_rate_1) || '&#45;&#45;'}}</span>-->
                        <!--</el-table-column>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column label="国外仓">-->
                        <!--<el-table-column label="订单量" minWidth="45">-->
                            <!--<span slot-scope="scope">{{(scope.row[key] && scope.row[key].order_sum_2) || '&#45;&#45;'}}</span>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="欠货量" minWidth="45">-->
                            <!--<span slot-scope="scope">{{(scope.row[key] && scope.row[key].order_lack_2) || '&#45;&#45;'}}</span>-->
                        <!--</el-table-column>-->
                        <!--<el-table-column label="欠货率" minWidth="50">-->
                            <!--<span slot-scope="scope">{{(scope.row[key] && scope.row[key].lack_rate_2) || '&#45;&#45;'}}</span>-->
                        <!--</el-table-column>-->
                    <!--</el-table-column>-->
                <!--</el-table-column>-->
                <!--<template slot="empty">-->
                    <!--<div>-->
                        <!--<NotData v-show="!tableData.length"></NotData>-->
                    <!--</div>-->
                <!--</template>-->
            <!--</el-table>-->
            <ACRTable ref="acrtable" v-loading="tableLoading" :table-key="newTableKey" :table-data="tableData" :table-props="tableProps"></ACRTable>
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
        getLastMonthStartDate,
        getLastMonthEndDate,
        getCurrentDateRange
    } from '@/api/common/date_format'

    import {
        getPlatformList,
    } from '@/api/sales_module/arrears_count_report'

    import {
        getArrearsFreezeCountReportInfo
    } from '@/api/sales_module/arrears_freeze_report'

    import ACRTable from './ACRTable/index';

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'arrears_freeze_report';

    export default {
        name: component_name,
        components: {
            ACRTable
        },
        data () {
            return {

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    paymentTime: [],
                    platform: [],
                    query_type: '2'
                },
                saveDefaultTime: [],

                optionList: {
                    platformList: [],
                    moduleTypeList: [
                        {
                            label: '累计日欠货统计',
                            value: '2'
                        },
                        {
                            label: '平台日欠货统计',
                            value: '1',
                        },
                    ]
                },

                tableData: [],
                allTableKey: [],
                tableKey: [],
                newTableKey: [],
                tableProps: [],
                tableMinWidth: [],
                tableWidth: [],
                tableHeight: '100px',

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

                tableLoading: false,

                // 是否加载完成
                isComplate: false
            };
        },
        computed: {
            ...mapGetters([
                'queryParamsInfo',
                'arrearsCountReportsInfo'
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
            getDefaultTime,
            goToNewPage,
            getArrearsFreezeCountReportInfo,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['arrears_freeze_report']);
                }

                let obj = {
                    start_date: this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime[1],
                    platform_code: this.queryData.platform.join(','),
                    lack_type: this.queryData.query_type,
                    lack_status: '1',
                    ...params
                };
                this.tableLoading = true;
                this.isComplate = false;
                this.getArrearsFreezeCountReportInfo(obj).then(({data}) => {
                    if(data.status === 2) {
                        this.tableLoading = false;
                        this.isComplate = true;
                        return;
                    }
                    if(data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.tableLoading = false;
                        this.$message.error(data.errorMess || '查询失败！');
                        this.tableLoading = false;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData.platform = [];
                this.queryData.paymentTime = this.saveDefaultTime;
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
                    isExcel: 1
                }, true)
            },

            //切换tab
            handleToggleTableInfo(val) {
                this.queryData.query_type = val;
                this.handleQueryInfo();
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
                    key: 'arrears_freeze_report',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.allTableKey = {...data.title};
                this.newTableKey = Object.values(data.title);
                this.tableProps = Object.keys(data.title);
                this.tableKey = this.getKeyList(0);
                this.tableData = data.data;
                this.$nextTick().then(() => {
                    this.tableLoading = false;
                    setTimeout(() => {
                        this.tableKey = JSON.parse(JSON.stringify(this.allTableKey));
                        const tableData = JSON.parse(JSON.stringify(this.tableData));
                        this.tableData.splice(0);
                        this.tableData = tableData;
                        this.$nextTick().then(() => {
                            this.isComplate = true;
                        })
                    }, 100)
                })
            },

            testFn(row) {
                return row.date
            },

            getKeyList(index, maxLength = 7) {
                let keys = {};
                Object.entries(this.allTableKey).forEach((item, inx) => {
                    if (inx >= index && inx < index + maxLength) {
                        keys[item[0]] = item[1];
                    }
                })
                return keys;
            }
        },
        created () {
            this.thisVm = this;
            try {
                getPlatformList().then(({ data }) => {
                    this.optionList.platformList = data.data;
                });
                this.queryData.paymentTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
                this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
                this.handleQueryInfo();
            } catch (e) {
                console.log(e);
            }
        },
        mounted() {
            this.$nextTick().then(() => {
                this.tableHeight = config.setTableHeight('ui-main-module',['ui-main-tab']);
            });
        },
        watch: {
            showSearch() {
                let vm = this;
                document.querySelector('body').style.overflow = 'hidden';
                setTimeout(() => {
                    // vm.tableHeight = config.setTableHeight('ui-main-module',['ui-main-tab']);
                    vm.$refs['acrtable'].doLayout();
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
        .el-table tr th[colspan="6"],
        .el-table tr th[colspan="3"]:nth-child(2n),
        .el-table tr th[colspan="1"]:nth-child(6n),
        .el-table tr th[colspan="1"]:first-child:not([rowspan="1"]),
        .el-table tr td[colspan="1"]:nth-child(6n+1){
            border-right: 2px solid #d3e9fa;
        }
    }

    .ui-mock__table {
        width: 100%;
        position: absolute;
        bottom: 0;
        overflow: auto;
        z-index: 99;
    }

    .ui-mock__table--item {
        height: 1px;
        width: 8000px;
    }
</style>
