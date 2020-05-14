<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="付款时间" v-model="queryData.paymentTime" template="daterangeym">
                        </SearchRequirement>
                    </li>
                    <!--<li>-->
                        <!--<SearchRequirement label="渠道">-->
                            <!--<el-select size="small" v-model="queryData.fulfillment_type" filterable>-->
                                <!--<el-option v-for="item in optionList.fulfillmentList"-->
                                           <!--:key="item.value"-->
                                           <!--:value="item.value"-->
                                           <!--:label="item.label"></el-option>-->
                            <!--</el-select>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <!--<li>-->
                        <!--<SearchRequirement v-model="queryData.summary_type" label="统计类型" template="select" :options="optionList.countTypeList">-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                </ul>
                <FilterBtn refTable="tableArea" :params="{group_id: ''}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
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
            <el-table
                    ref="myTable"
                    highlight-current-row
                    stripe
                    :height="tableHeight"
                    :span-method="objectSpanMethod"
                    :data="tableData"
                    :load="handleTableOpen"
                    row-key="id"
                    lazy
                    style="width: 100%">
                <el-table-column
                        minWidth="100"
                        prop="group"
                        label="小组">
                    <el-table-column
                            prop="group"
                            label=""
                            minWidth="125">
                    </el-table-column>
                </el-table-column>
                <el-table-column
                        prop="short_name"
                        label="账号"
                        minWidth="150">
                    <el-table-column
                            prop="short_name"
                            label=""
                            minWidth="150">
                    </el-table-column>
                </el-table-column>
                <el-table-column :key="index" v-for="(item, index) in tableKey" :label="item">
                    <el-table-column
                            label="销售额(USD)"
                            width="120">
                        <div slot slot-scope="scope">
                            <ul>
                                <li class="ui-money">{{scope.row[item] && scope.row[item].total_price}}</li>
                            </ul>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="广告费(USD)/占比"
                            width="120">
                        <div slot slot-scope="scope">
                            <ul>
                                <li class="ui-money">{{scope.row[item] && scope.row[item].guanggao.total_guanggao_fee}}</li>
                                <li>{{scope.row[item] && scope.row[item].guanggao.percent + '%'}}</li>
                            </ul>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="送样费用(USD)/占比"
                            width="150">
                        <div slot slot-scope="scope">
                            <ul>
                                <li class="ui-money">{{scope.row[item] && scope.row[item].songyang.total_songyang_fee}}</li>
                                <li>{{scope.row[item] && scope.row[item].songyang.percent + '%'}}</li>
                            </ul>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="退款(USD)/占比"
                            width="120">
                        <div slot slot-scope="scope">
                            <ul>
                                <li class="ui-money">{{scope.row[item] && scope.row[item].refund.total_refund_fee}}</li>
                                <li>{{scope.row[item] && scope.row[item].refund.percent + '%'}}</li>
                            </ul>
                        </div>
                    </el-table-column>
                    <el-table-column
                            label="储藏费(USD)/占比"
                            width="134">
                        <div slot slot-scope="scope">
                            <ul>
                                <li class="ui-money">{{scope.row[item] && scope.row[item].storage.total_storage_fee}}</li>
                                <li>{{scope.row[item] && scope.row[item].storage.percent + '%'}}</li>
                            </ul>
                        </div>
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
        getAccountMainParamsInfo,
    } from '@/api/am_order_count/account_main_params';

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
                    paymentTime: []
                },
                saveDefaultTime: [],

                optionList: {
                    countTypeList: {
                        'd': '日'
                    },
                    fulfillmentList: []
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableHeight: '100px',

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                }
            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'accountMainParamsInfo'
            ])
        },
        methods: {
            ...mapActions([
                'GetAccountMainParamsInfo'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,

            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    if (rowIndex === 0) {
                        return {
                            rowspan: 1,
                            colspan: 2
                        };
                    } else {
                        return {
                            rowspan: 1,
                            colspan: 1
                        };
                    }
                } else if (columnIndex === 1) {
                    if (rowIndex === 0) {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            },

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['account_main_params']);
                }

                let obj = {
                    ...this.queryData,
                    start_date: this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime[1],
                    ...params
                };

                this.GetAccountMainParamsInfo(obj).then(({data}) => {

                    // 导出
                    if (!data.status) {
                        this.$message.error(data.errorMess || '查询失败！');
                        return;
                    }

                    this.handleQueryInfoCallBack(data);
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

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1
                }, true)
            },

            // 表格展开
            handleTableOpen({ group_id, id, group }, treeNode, resolve) {
                this.queryData = JSON.parse(this.queryParamsInfo['account_main_params']);
                this.queryData.group_id = group_id;
                let obj = {
                    ...this.queryData,
                    start_date: this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime[1]
                };

                getAccountMainParamsInfo(obj).then(({data}) => {
                    resolve(data.data.value.map((_v, _i) => {
                        this.$nextTick().then(() => {
                            this.$refs.myTable.doLayout();
                        })
                        return {
                            ..._v,
                            group: `${group}`,
                            id: `${id}_${_i}`
                        }
                    }))
                }).catch(err => {
                    console.log(err);
                });
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
            handleQueryInfoCallBack ({data}) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'account_main_params',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = data.key;
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.value.map((_v, _i) => {
                        this.$nextTick().then(() => {
                            this.$refs.myTable.doLayout();
                        });
                        return {
                            ..._v,
                            id: _i + 1,
                            hasChildren: !!_i
                        }
                    });
                });
                // this.tableData.splice(4, this.tableData.length)
                //
                // this.tableProps = ['index'];
            }
        },
        created () {

            this.thisVm = this;
            const [sT, eT] = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
            this.saveDefaultTime = [sT.replace(/-[0-9]+$/, ''), eT.replace(/-[0-9]+$/, '')];
            try {
                if (JSON.stringify(this.accountMainParamsInfo) === '{}') {
                    this.queryData.paymentTime = this.saveDefaultTime;
                    this.handleQueryInfo();
                } else {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['account_main_params']);
                    this.handleQueryInfoCallBack(this.accountMainParamsInfo);
                }
            } catch (e) {
                console.log(e);
            }
        },
        mounted() {
            this.$nextTick().then(() => {
                this.tableHeight = config.setTableHeight('s-main',['el-tabs__header']);
                this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
            });
        },
        watch: {
            showSearch() {
                document.querySelector('body').style.overflow = 'hidden';
                setTimeout(() => {
                    this.tableHeight = config.setTableHeight('s-main',['el-tabs__header']);
                    this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400)
            }
        }
    };
</script>

<style lang="less" scoped>
    .ui-money {
        color: #ff9900;
    }
    /deep/.el-table__indent {
        padding-left: 10px!important;
    }
</style>
