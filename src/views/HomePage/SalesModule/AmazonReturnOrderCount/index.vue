<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement v-model="queryData.summary_type" label="统计类型" template="select" :options="optionList.countTypeList">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.summary_type == 'd'">
                        <SearchRequirement label="统计日期" v-model="queryData.countTime" template="daterange" :isOption="false">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.summary_type == 'm'">
                        <SearchRequirement label="统计月份">
                            <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.countTime"
                                    type="monthrange"
                                    range-separator="至"
                                    start-placeholder="开始月份"
                                    end-placeholder="结束月份"
                                    format="yyyy-MM"
                                    value-format="yyyy-MM">
                            </el-date-picker>
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
                    <li>
                        <SearchRequirement v-model="queryData.is_kevin" label="是否Kevin" template="select" :options="optionList.isKevinList">
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="myTable" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"
                           :params="{group_id: ''}" ></FilterBtn>
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

        <div class="ui-tabs_box">
            <el-tabs v-model="queryData.query_type" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="账号统计" name="1"></el-tab-pane>
                <el-tab-pane label="站点统计" name="2"></el-tab-pane>
            </el-tabs>
        </div>

        <ReturnOrderAccount ref="myTable" :tableData="tableData" :showSearch="showSearch" :tableKey="tableKey"
                            v-if="queryData.query_type === '1'" rowKey="id" @handleTableOpen="handleTableOpen"></ReturnOrderAccount>

        <ReturnOrderSite ref="myTable" :tableData="tableData" :showSearch="showSearch" :tableKey="tableKey"
                         v-if="queryData.query_type === '2'" rowKey="id"></ReturnOrderSite>

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
        getMonthRange
    } from '@/api/common/date_format'

    import {
        getAmazonReturnOrderAccountInfo,
        getAmazonReturnOrderSiteInfo,
        getOptionList,
    } from '@/api/sales_module/amazon_return_order_count'

    import ReturnOrderAccount from './ReturnOrderAccount.vue'
    import ReturnOrderSite from './ReturnOrderSite.vue'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'amazon_return_order_count';

    export default {
        name: component_name,
        components: { ReturnOrderAccount, ReturnOrderSite },
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
                saveDefaultDate: [],
                saveDefaultMonth: [],

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
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth: [],
                tableWidth: [],

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
            getAmazonReturnOrderAccountInfo,
            getAmazonReturnOrderSiteInfo,

            // 列表信息查询
            handleQueryInfo (params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['amazon_return_order_count']);
                }


                let obj = {
                    start_date: this.queryData.countTime && this.queryData.countTime[0],
                    end_date: this.queryData.countTime && this.queryData.countTime[1],
                    summary_type: this.queryData.summary_type,
                    fulfillment_type: this.queryData.fulfillment_type,
                    is_kevin: this.queryData.is_kevin,
                    ...params,
                };

                if(this.queryData.query_type === '1') {
                    obj.group_id = this.queryData.group_id;
                    obj.obj_type = this.queryData.obj_type;
                }

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
                this.queryData = JSON.parse(this.queryParamsInfo['amazon_return_order_count']);
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
//                            this.$refs.myTable.doLayout();
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
                    key: 'amazon_return_order_count',
                    value: JSON.stringify(this.queryData)
                });

                if(this.queryData.query_type === '1') {
                    let keys = [...data.title];
                    keys.splice(0, 3);
                    this.tableKey = keys;
                    this.tableData.splice(0);
                    this.$nextTick().then(() => {
                        this.tableData = data.data.map((_v, _i) => {
                            this.$nextTick().then(() => {
//                                this.$refs.myTable.doLayout();
                            });
                            return {
                                ..._v,
                                id: _i + 1,
                                hasChildren: !!_i
                            }
                        });
                    });
                }else {
                    let keys = [...data.title];
                    keys.splice(0, 2);
                    this.tableKey = keys;
                    this.tableData.splice(0);
                    this.$nextTick().then(() => {
                        this.tableData = data.data.map((_v, _i) => {
                            return {
                                ..._v,
                                id: _i + 1,
                            }
                        });
                    });
                }
            },
        },
        created () {
            this.thisVm = this;
            try {
                getOptionList().then(({ data }) => {
                    this.optionList.fulfillmentList = data.data.fulfillment_list;
                });
                // 默认时间
                getMonthRange().then((data) => {
                    this.saveDefaultMonth =  [data.start, data.end];
                    this.saveDefaultDate = getThirtyDayDateRange(new Date(new Date().getTime()));
                    this.queryData.countTime = getThirtyDayDateRange(new Date(new Date().getTime()));
                    this.handleQueryInfo();
                });
            } catch (e) {
                console.log(e);
            }
        },
        watch: {
            'queryData.summary_type'(val) {
                if (val && val === 'm') {
                    this.queryData.countTime = this.saveDefaultMonth
                }else {
                    this.queryData.countTime = this.saveDefaultDate
                }
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

</style>
