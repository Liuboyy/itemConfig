<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix" v-if="queryData.query_type !== '0'">
                    <li v-show="queryData.query_type === 'ranking'">
                        <SearchRequirement label="年份">
                            <el-date-picker
                                    type="year"
                                    size="small"
                                    v-model="queryData.year"
                                    placeholder="选择年"
                                    :clearable="false"
                                    format="yyyy"
                                    value-format="yyyy">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li v-show="queryData.query_type !== 'ranking' && queryData.summary_type !== 'm'">
                        <SearchRequirement label="付款时间" v-model="queryData.paymentTime" template="daterange" :isOption="false">
                        </SearchRequirement>
                    </li>
                    <li v-show="queryData.query_type !== 'ranking' && queryData.summary_type === 'm'">
                        <SearchRequirement label="付款时间" v-model="queryData.paymentTime" template="daterangeym" :isOption="false">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="渠道">
                            <el-select size="small" v-model="queryData.fulfillment_type">
                                <el-option v-for="item in optionList.fulfillmentList"
                                           :key="item.value"
                                           :value=" item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="是否Kevin" v-if="queryData.query_type === 'ranking'">
                            <el-select size="small" v-model="queryData.isKevin">
                                <el-option v-for="item in optionList.isKevinList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.query_type !== 'ranking'">
                        <SearchRequirement v-model="queryData.summary_type" label="统计类型" template="select" :options="optionList.countTypeList">
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :params="{group_id: '',limit: pageData.currentList}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo" v-if="queryData.query_type !== '0'"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module"  v-if="queryData.query_type !== '0'">
            <!--<span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon-->
                    <!--:name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>-->
            <el-button
                    v-if="item.method && item.permit(thisVm) && item.icon"
                    v-for="item in buttonList"
                    size="small"
                    :type="item.type"
                    :key="item.value"
                    :icon="item.icon"
                    @click="item.action(thisVm, item.method)">{{item.name}}</el-button>
        </div>
        <div class="ui-tabs_box">
            <el-tabs v-model="queryData.query_type" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="业绩排名统计" name="ranking" v-if="buttonList['ranking'].permit(thisVm)"></el-tab-pane>
                <el-tab-pane label="销售额统计" name="sales" v-if="buttonList['sales'].permit(thisVm)"></el-tab-pane>
                <el-tab-pane label="订单量统计" name="orders" v-if="buttonList['orders'].permit(thisVm)"></el-tab-pane>
            </el-tabs>
        </div>
        <div v-if="saveQueryType === 'ranking'">
            <RankingTable :tableData="tableData" :tableProps="tableProps" :tableFirstKey="tableFirstKey" :tableAfterKey="tableAfterKey" :tableSecondKey="tableSecondKey"></RankingTable>
        </div>

        <div v-if="saveQueryType !== 'ranking'">
            <ComTableInfo
                    ref="myTable"
                    rowKey="id"
                    :tableKey="tableKey"
                    :tableProps="tableProps"
                    :tableData="tableData"
                    :tableMinWidth="tableMinWidth"
                    :showSearch="showSearch"
                    :otherHeight="['el-tabs__header']"
                    :load="handleTableOpen">
            </ComTableInfo>
        </div>

        <div class="ui-main-module-page" v-if="saveQueryType === 'ranking'">
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
        getSalesPerformanceCountInfo,
        getSalesPerformanceRankingInfo,
        getSalesPerformanceDetailsInfo
    } from '@/api/am_order_count/sales_performance_count';

    import {
        getCurrentYear,
        getMonthRange
    } from '@/api/common/date_format'

    import RankingTable from './RankingTable/index.vue'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'sales_performance_count';

    export default {
        name: component_name,

        components: {RankingTable},

        data () {
            return {

                // 时间搜索框宽度设置
                searchDateWidth: config.SEARCH_DATE_WIDTH,

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    group_id: '',
                    fulfillment_type: '',
                    summary_type: 'd',
                    paymentTime: [],
                    year: '',
                    query_type: '',
                    isKevin: '2',
                },
                saveDefaultTime: [],
                saveDefaultMonth: [],
                saveDefaultYear: '',

                //保存查询类型
                saveQueryType: '',
                saveChanelType: '',

                optionList: {
                    countTypeList: {
                        'd': '天'
                    },
                    fulfillmentList: [],
                    isKevinList: []
                },

                tableData: [],
                tableKey: [],
                tableFirstKey: {},
                tableAfterKey: {},
                tableSecondKey: [],
                tableProps: [],
                tableMinWidth: [],
                tableHeight: '100px',

                //分页
//                pageSizes: config.pageData.pageSizes,
                pageSizes: [200],
                pageData: {
                    currentPage: 1,
                    currentList: 200,
                    currentTotal: 0,
                },

                popoverData: [],
                popoverKey: [],
                currentMonthProps: [],
                lastMonthProps: [],
            };
        },
        computed: {
            ...mapGetters([
//                'buttonList',
                'queryParamsInfo',
                'salesPerformanceCountInfo'
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'GetSalesPerformanceCountInfo'
            ]),
            getSalesPerformanceCountInfo,
            getSalesPerformanceRankingInfo,
            getSalesPerformanceDetailsInfo,
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['sales_performance_count']);
                }

                if(this.queryData.query_type === '0') {
                    this.$message.warning('请联系管理员开通权限！');
                    return;
                }

                let obj = this.queryData.query_type === 'ranking' ? {
                    //业绩排名统计参数
                    year: this.queryData.year,
                    channel: this.queryData.fulfillment_type,
                    is_kevin: this.queryData.isKevin,
                    ...params

                } : {
                    start_date: this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime[1],
                    group_id: this.queryData.group_id,
                    fulfillment_type: this.queryData.fulfillment_type,
                    summary_type: this.queryData.summary_type,
                    query_type: this.queryData.query_type,
                    ...params
                };
                let fnName = this.queryData.query_type === 'ranking' ? this.getSalesPerformanceRankingInfo : this.getSalesPerformanceCountInfo;


                fnName(obj).then(({data}) => {

                    if(data.status === 2) return;

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
                this.queryData.group_id = '';
                this.queryData.fulfillment_type = '';
                this.queryData.summary_type = 'd';
                this.queryData.isKevin = '2';
                this.queryData.paymentTime = this.saveDefaultTime;
                this.queryData.year = this.saveDefaultYear;
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
                    is_excel: 1
                }, true)
            },

            //tab切换
            handleTabClick(tab) {
                this.queryData.query_type = tab.name;
                if(this.queryData.query_type !== 'ranking') this.queryData.group_id = '';
                this.handleQueryInfo({limit: this.pageData.currentList});
            },

            // 展开表格
            handleTableOpen({group_id, id, group_name}, treeNode, resolve) {
                this.queryData = JSON.parse(this.queryParamsInfo['sales_performance_count']);
                this.queryData.group_id = group_id;
                let obj = {
                    ...this.queryData,
                    start_date: this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime[1]
                };

                this.getSalesPerformanceCountInfo(obj).then(({data}) => {
                    resolve(data.data.value.map((_v, _i) => {
                        this.$nextTick().then(() => {
                            this.$refs.myTable.handleRefreshTableHeight();
                        });
                        return {
                            ..._v,
                            group_name: `${group_name}`,
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
            handleQueryInfoCallBack (data) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'sales_performance_count',
                    value: JSON.stringify(this.queryData)
                });

                this.saveQueryType = this.queryData.query_type;
                this.saveChanelType = this.queryData.fulfillment_type;

                if(this.saveQueryType === 'ranking') {

                    //业绩排名统计
                    this.optionList.fulfillmentList = data.data.channel;
                    this.optionList.isKevinList = data.data.is_kevin;


                    this.tableFirstKey = data.data.title_first;
                    this.tableAfterKey = data.data.title_after;
                    this.tableSecondKey = Object.values(data.data.title_after);
                    this.tableData = data.data.data;

                    this.pageData.currentPage = data.page_data.offset * 1;
                    this.pageData.currentLimit = data.page_data.limit * 1;
                    this.pageData.currentTotal = data.page_data.total * 1;

                }else {
                    this.optionList.countTypeList = data.data.summary_type_list;
                    this.optionList.fulfillmentList = data.data.fulfillment_list;

                    //数据渲染
                    this.tableKey = data.data.key;
                    this.tableData.splice(0);
                    this.$nextTick().then(() => {
                        this.tableData = data.data.value.map((_v, index) => {
                            return {
                                ..._v,
                                id: index + 1,
                                hasChildren: !!index
                            }
                        });

                        const props = [...data.data.key];
                        props.splice(0, 3);
                        this.tableProps = ['group_name', 'user_name', this.queryData.query_type === 'sales' ? 'total_price' : 'total_order_sum', ...props];
                        this.tableMinWidth = this.tableProps.map(item => {
                            if(item === 'total_price') return '95';
                            if(item === 'group_name') return '120';
                            return '88';
                        });
                    });
                }
            }
        },
        created () {
            this.thisVm = this;
            try {

                this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
                getCurrentYear().then(( data ) =>  {
                    this.saveDefaultYear = data.year;
                    getMonthRange().then(( data ) =>{
                        this.saveDefaultMonth = [data.start, data.end];
                        this.queryData.paymentTime = this.saveDefaultTime;
                        this.queryData.year = this.saveDefaultYear;

                        const queryModule = ['orders','sales','ranking',];
                        for (let i = 0; i < queryModule.length; i++) {
                            if (this.buttonList[queryModule[i]].permit()) {
                                this.queryData.query_type = queryModule[i];
                            }
                        }
                        this.handleQueryInfo();
                    })
                });
            } catch (e) {
                console.log(e);
            }
        },
        watch: {
            'queryData.summary_type'(val) {
                if (val && val === 'm') {
                    this.queryData.paymentTime = this.saveDefaultMonth
                }else {
                    this.queryData.paymentTime = this.saveDefaultTime
                }
            }
        }
    };
</script>

<style lang="less" scoped>
    /deep/.el-table__indent {
        padding-left: 10px!important;
    }

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0!important;
    }
</style>
