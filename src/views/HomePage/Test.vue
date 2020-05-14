<template>
    <div class="ui-main-module">
        <transition name="slide-fade" v-if="showSearch">
            <div class="ui-search-area">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement v-model="queryData.summary_type" label="统计类型" template="select" :options="optionList.countTypeList">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="统计时间" v-model="queryData.paymentTime" template="daterange"></SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo" :params="{}"></FilterBtn>
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
        <div class="ui-middle_wrap">
            <div class="ui-tabs_box ui-theme_tabs">
                <el-tabs v-model="queryData.query_type" type="card" @tab-click="handleTabClick">
                    <el-tab-pane v-for="(item, index) in optionList.tabList" :label="item.label" :name="item.name" :key="index"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="ui-middle_wrap__chart">
                1111111
            </div>
        </div>
        <div class="ui-tabs_box ui-theme_tabs">
            <el-tabs v-model="queryData.query_type" type="card" @tab-click="handleTabClick">
                <el-tab-pane v-for="(item, index) in optionList.tabList" :label="item.label" :name="item.name" :key="index"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="ui-bottom_wrap" ref="wrap">
            <div class="common">
                111111111111
            </div>
            <div class="common">
                22222222222
            </div>
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
        getLastMonthStartDate,
        getLastMonthEndDate,
        getCountDate,
    } from '@/api/common/date_format'

    import {
        getAmazonReturnOrderAccountInfo,
        getAmazonReturnOrderSiteInfo,
        getOptionList,
    } from '@/api/sales_module/amazon_return_order_count'

    import ReturnOrderSite from './SalesModule/AmazonReturnOrderCount/ReturnOrderSite.vue'

    export default {
        components: { ReturnOrderSite },
        data () {
            return {

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                children: [],

                queryData: {
                    countTime: [],
                    obj_type: 'group',
                    group_id: '',
                    summary_type: 'd',
                    fulfillment_type: '',
                    is_kevin: '',
                    query_type: '1'
                },

                //保存默认日期
                saveDefaultDate: '',

                optionList: {
                    countTypeList: {
                        'd': '日',
                        'm': '月'
                    },
                    fulfillmentList: [],
                    isKevinList: {
                        '': '全部',
                        'y': '是',
                        'n': '否'
                    },
                    tabList: [
                        {label: '仓储中心', name: '1'},
                        {label: '小包仓', name: '2'},
                        {label: '中转仓', name: '3'},
                        {label: '塘厦', name: '4'},
                        {label: '虎门', name: '5'},
                        {label: '慈溪', name: '6'},
                        {label: '虎门中转', name: '7'},
                        {label: '慈溪中转', name: '8'},
                    ]
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth: [],
                tableWidth: [],
                tableHeight: '800px',

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },
            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'returnOrderAccountInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetAmazonReturnOrderAccountInfo'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,
            getAmazonReturnOrderAccountInfo,
            getAmazonReturnOrderSiteInfo,

            // 列表信息查询
            handleQueryInfo (params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['return_order_account']);
                }


                let obj = {
                    start_date: this.queryData.countTime && this.queryData.countTime[0],
                    end_date: this.queryData.countTime && this.queryData.countTime[1],
                    summary_type: this.queryData.summary_type,
                    fulfillment_type: this.queryData.fulfillment_type,
                    is_kevin: this.queryData.is_kevin,
                    group_id: this.queryData.group_id,
                    obj_type: this.queryData.obj_type,
                    ...params,
                };

                let fnName = this.queryData.query_type === '1' ? this.getAmazonReturnOrderAccountInfo: this.getAmazonReturnOrderSiteInfo;

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
                this.queryData.obj_type = 'group';
                this.queryData.summary_type = 'd';
                this.queryData.group_id = '';
                this.queryData.fulfillment_type = '';
                this.queryData.is_kevin = '';
                this.queryData.countTime = this.saveDefaultDate;
            },

            handleTabClick(tab) {
                this.queryData.query_type = tab.name;
                this.handleQueryInfo();
            },

            // 表格展开
            handleTableOpen({ group_id, id}, treeNode, resolve) {
                this.queryData = JSON.parse(this.queryParamsInfo['return_order_account']);
                let obj = {
                    start_date: this.queryData.countTime && this.queryData.countTime[0],
                    end_date: this.queryData.countTime && this.queryData.countTime[1],
                    summary_type: this.queryData.summary_type,
                    fulfillment_type: this.queryData.fulfillment_type,
                    is_kevin: this.queryData.is_kevin,
                    group_id: group_id,
                    obj_type: 'account',
                };
                getAmazonReturnOrderAccountInfo(obj).then(({data}) => {
                    resolve(data.data.map((_v, _i) => {
                        this.$nextTick().then(() => {
                            this.$refs.myTable.doLayout();
                        });
                        return {
                            ..._v,
                            id: `${id}_${_i}`
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
                    is_excel: 1,
                    total_count: this.pageData.currentTotal
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
                    key: 'return_order_account',
                    value: JSON.stringify(this.queryData)
                });

            },

        },
        created () {
            this.thisVm = this;
            try {
                try {
                    this.handleQueryInfo()
                } catch (e) {
                    console.log(e);
                }
            } catch (e) {
                console.log(e);
            }
        },
//        mounted() {
//            this.$nextTick().then(() => {
//                this.tableHeight = config.setTableHeight('s-main',['el-tabs__header']);
//                this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
//            });
//        },
        watch: {
            showSearch(val) {

                if (val) {
                    this.$refs.wrap.style.top = '560px';
                }else {
                    this.$refs.wrap.style.top = '460px';
                }
//                document.querySelector('body').style.overflow = 'hidden';
//                setTimeout(() => {
//                    this.tableHeight = config.setTableHeight('s-main',['el-tabs__header']);
//                    this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
//                    document.querySelector('body').style.overflow = '';
//                }, 400)
            }
        }
    };
</script>

<style lang="less" scoped>

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0!important;
    }

    /deep/.el-table__indent {
        padding-left: 10px!important;
    }

    /deep/.ui-tabs_box .el-tabs--card > .el-tabs__header {
        background: none!important;
    }

    .ui-middle_wrap {
        margin-bottom: 10px;
        .ui-middle_wrap__chart {
            background: #ffffff;
            height: 340px;
        }
    }
    .ui-bottom_wrap {
        position: absolute;
        bottom: 10px;
        top: 560px;
        width: 88.5%;
        display: flex;
        .common {
            width: 49.5%;
            background: #ffffff;
        }
         & div:first-child {
             margin-right: 1%;
         }

    }

</style>
