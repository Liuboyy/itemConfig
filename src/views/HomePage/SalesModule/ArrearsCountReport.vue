<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="付款时间" v-model="queryData.paymentTime" template="daterange"
                                           :pickerOptions="pickerOptions"></SearchRequirement>
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
        <div class="ui-main-module-table ui-special_table">
            <!--<div class="ui-mock__table" v-show="!isComplate">-->
                <!--<div class="ui-mock__table&#45;&#45;item"></div>-->
            <!--</div>-->
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
                            <!--<span slot-scope="scope" @click="handlePreviewDetails(scope.row, 1)" size="small" type="text" class="ui-click_span">-->
                                <!--{{(scope.row[key] && scope.row[key].order_lack_1) || '&#45;&#45;'}}</span>-->
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
                            <!--<span slot-scope="scope" @click="handlePreviewDetails(scope.row, 2)" size="small" type="text" class="ui-click_span">-->
                                <!--{{(scope.row[key] && scope.row[key].order_lack_2) || '&#45;&#45;'}}</span>-->
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
            <ACRTable ref="acrtable" preview v-loading="tableLoading"
                      :table-key="newTableKey" :table-data="tableData"
                      :table-props="tableProps" @preview="(item) => { handlePreviewDetails(item.row, item.type) }"></ACRTable>
        </div>

        <ComDialogPreview width="1000px" title="查看明细"  :visible.sync="isShowPreview" :stripe="false"
                          :tableData="dialogData" :tableKey="dialogKey" :tableProps="dialogProps"
                          isPage :dialogPageData="dialogPageData" @dialogPageChange="handleDialogPageChange"
                          isButton  @export="handleExportDetailsInfo"></ComDialogPreview>
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
        getPreviewDetailsInfo
    } from '@/api/sales_module/arrears_count_report'

    import ACRTable from './ACRTable/index'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'arrears_count_report';

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
                        {
                            label: '累计停售SKU欠货统计',
                            value: '3',
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
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [
                        {
                            text: '过去7天',
                            onClick(picker) {
                                const start = new Date();
                                const end = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                end.setTime(end.getTime());
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '过去30天',
                            onClick(picker) {
                                const start = new Date();
                                const end = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                end.setTime(end.getTime());
                                picker.$emit('pick', [start, end]);
                            }
                        },
                        {
                            text: '过去60天',
                            onClick(picker) {
                                const start = new Date();
                                const end = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 60);
                                end.setTime(end.getTime());
                                picker.$emit('pick', [start, end]);
                            }
                        }
                    ]
                },

                tableLoading: false,

                // 是否加载完成
                isComplate: false,

                //查看明细
                isShowPreview: false,
                dialogData: [],
                dialogKey: [],
                dialogProps: [],
                dialogPageData: {
                    limit: 20,
                    offset: 1,
                    total: 0
                },

                //保存参数
                saveRowData: {},
                saveType: '',
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
                'GetArrearsCountReportInfo'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,
            getPreviewDetailsInfo,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['arrears_count_report']);
                }

                let obj = {
                    start_date: this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime[1],
                    platform_code: this.queryData.platform.join(','),
                    lack_type: this.queryData.query_type,
                    lack_status: '0',
                    ...params
                };
                this.tableLoading = true;
                this.isComplate = false;
                this.GetArrearsCountReportInfo(obj).then(({data}) => {
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

            //点击欠货量
            handlePreviewDetails(row, type, params = {}) {
                this.isShowPreview = true;
                this.saveRowData = row;
                this.saveType = type;
                this.getPreviewDetailsInfo({
                    detail_data: row.date,
                    platform_code: row.platform_code,
                    lack_type: this.queryData.query_type,
                    warehouse_type: type,
                    ...params
                }).then(({ data }) => {
                    if(data.status) {
                        this.dialogData = data.data;
                        this.dialogKey = Object.values(data.title);
                        this.dialogProps = Object.keys(data.title);
                        this.dialogPageData.limit = data.page_data.limit * 1;
                        this.dialogPageData.offset = data.page_data.offset * 1;
                        this.dialogPageData.total = data.page_data.total * 1;

                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                })
            },

            //弹框分页
            handleDialogPageChange({offset,limit}) {
                this.handlePreviewDetails(this.saveRowData, this.saveType, {offset, limit})
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

            //明细导出
            handleExportDetailsInfo() {
                this.getPreviewDetailsInfo({
                    detail_data: this.saveRowData.date,
                    platform_code: this.saveRowData.platform_code,
                    lack_type: this.queryData.query_type,
                    warehouse_type: this.saveType,
                    isExcel: 1,
                }).then(({ data }) => {
                    if(data.status === 2) return;
                })
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
                    key: 'arrears_count_report',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染

                this.allTableKey = {...data.title};
                this.newTableKey = Object.values(data.title);
                this.tableProps = Object.keys(data.title);
                this.tableKey = this.getKeyList(0);
                this.tableData.splice(0);
                this.$nextTick().then().then(() => {
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
                // this.$nextTick().then(() => {
                //     this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
                // })
                return keys;
            }
        },
        created () {
            this.thisVm = this;
            try {
                getPlatformList().then(({ data }) => {
                    this.optionList.platformList = data.data;
                });
                this.queryData.paymentTime = getThirtyDayDateRange(new Date(new Date().getTime()));
                this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime()));
                this.handleQueryInfo();
            } catch (e) {
                console.log(e);
            }
        },
        mounted() {
            this.$nextTick().then(() => {
                this.tableHeight = config.setTableHeight('ui-main-module',['ui-main-tab']);
                // this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
            });

            this.$nextTick().then(() => {
                const TableContent = this.$refs.myTable && this.$refs.myTable.bodyWrapper;
                const TableMockContent = document.querySelector('.ui-mock__table');
//                TableContent.addEventListener('scroll', () => {
//                    const AllTd = TableContent.querySelectorAll('td');
//                    AllTd.forEach(ele => {
//                        // if (ele.getBoundingClientRect().left > 1000) {
//                        //     ele.querySelectorAll('.cell').style.display = 'none'
//                        // } else {
//                        //     ele.querySelectorAll('.cell').style.display = 'none';
//                        // }
//                    })
//                });

//                TableMockContent.addEventListener('scroll', (e) => {
//                     const tableData = JSON.parse(JSON.stringify(this.tableData));
//                     this.tableData.splice(0);
//                     this.tableData = tableData;
//                     this.tableKey = this.getKeyList(Math.floor(TableMockContent.scrollLeft / 300));
//                })

                //
                // this.$refs.myTable.$el.querySelector('.el-table__body-wrapper').onscroll = (e) => {
                //     // console.log(e);
                //     AllTableTd.forEach(ele => {
                //         if (ele.getBoundingClientRect().left < 2000) {
                //             ele.style.display = 'block';
                //         } else {
                //             ele.style.display = 'none';
                //         }
                //     })
                // }
            })
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

    /deep/.ui-main-module-table{
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
    }
    /deep/.ui-special_table {
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

    .ui-click_span {
        cursor: pointer;
        color: #3388ff;
    }
</style>
