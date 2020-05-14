<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement v-model="queryData.summary_type" label="统计类型" template="select" :options="optionList.countTypeList">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.summary_type !== 'm'">
                        <SearchRequirement label="付款时间" v-model="queryData.paymentTime" :isOption="false" template="daterange">
                        </SearchRequirement>
                    </li>
                    <li v-else>
                        <SearchRequirement label="付款时间" v-model="queryData.paymentTime" :isOption="false" template="daterangeym">
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
        <ComTableInfo
                ref="myTable"
                rowKey="id"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableMinWidth="tableMinWidth"
                :showSearch="showSearch"
                :otherHeight="['ui-main-tab']"
                :load="handleTableOpen">
            <div class="ui-main-tab">
                <el-badge
                        v-for="(item, index) in optionList.moduleTypeList"
                        :key="index">
                    <li class="ui-main-tab-box">
                        <span @click="handleToggleTableInfo(item.value)"
                              :class="queryData.query_type === item.value && 'ui-active'">{{item.label}}<i class="ui-tab_line"></i></span>
                    </li>
                </el-badge>
            </div>
        </ComTableInfo>
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
        getAccountSalesVolumeInfo,
    } from '@/api/am_order_count/account_sales_volume';

    import {
        getPreDateRange,
        getMonthRange
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'account_sales_volume';
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
                    group_id: '',
                    group_ids: '',
                    account_id: '',
                    account_ids: '',
                    fulfillment_type: '',
                    summary_type: 'd',
                    paymentTime: [],
                    query_type: 'sales'
                },
                saveDefaultTime: [],
                saveDefaultMonth: [],

                optionList: {
                    countTypeList: {
                        'd': '日'
                    },
                    fulfillmentList: [],
                    moduleTypeList: [
                        {
                            label: '销售额统计',
                            value: 'sales',
                        },
                        {
                            label: '订单量统计',
                            value: 'orders'
                        }
                    ]
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
                }
            };
        },
        computed: {
            ...mapGetters([
                'queryParamsInfo',
                'accountSalesVolumeInfo'
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'GetAccountSalesVolumeInfo'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['account_sales_volume']);
                }

                let obj = {
                    ...this.queryData,
                    start_date: this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime[1],
                    ...params
                };

                this.GetAccountSalesVolumeInfo(obj).then(({data}) => {

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
                this.queryData.group_id = '';
                this.queryData.group_ids = '';
                this.queryData.account_id = '';
                this.queryData.account_ids = '';
                this.queryData.fulfillment_type = '';
                this.queryData.summary_type = 'd';
                this.queryData.paymentTime = this.saveDefaultTime;
            },

            //高级筛选
            handleClickFilter () {
                this.FilterShow = !this.FilterShow;
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

            handleToggleTableInfo(val) {
                this.queryData.group_id = '';
                this.queryData.query_type = val;
                this.handleQueryInfo();
            },

            // 展开表格
            handleTableOpen({group_id, id, group_name}, treeNode, resolve) {
                this.queryData = JSON.parse(this.queryParamsInfo['account_sales_volume']);
                this.queryData.group_id = group_id;
                let obj = {
                    ...this.queryData,
                    start_date: this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime[1]
                };

                getAccountSalesVolumeInfo(obj).then(({data}) => {
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
            handleQueryInfoCallBack ({data}) {

                this.optionList.countTypeList = data.summary_type_list;
                this.optionList.fulfillmentList = data.fulfillment_list;

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'account_sales_volume',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = data.key;
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.value.map((_v, index) => {
                        return {
                            ..._v,
                            id: index + 1,
                            hasChildren: !!index
                        }
                    });

                    const props = [...data.key];
                    if(this.queryData.query_type === 'sales') {
                        props.splice(0, 3);
                        this.tableProps = ['group_name', 'account_name', 'total_price', ...props];
                    }else {
                        props.splice(0, 4);
                        this.tableProps = ['group_name', 'account_name', 'unit_price','total_order_sum', ...props];
                    }
                    this.tableMinWidth = this.tableProps.map(item => {
                        if(item === 'unit_price'|| item === 'total_order_sum') return '70';
                        if(item === 'total_price') return '95';
                        if(item === 'group_name'|| item === 'account_name') return '130';
                        return '88';
                    });
                })
            }
        },
        created () {
            this.thisVm = this;
//            this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
            try {
                getMonthRange().then(( data ) => {
                    this.saveDefaultMonth = [data.start, data.end];
                    getPreDateRange().then(( data ) => {
                        this.saveDefaultTime = [data.start, data.end];
                        if (JSON.stringify(this.accountSalesVolumeInfo) === '{}') {
                            this.queryData.paymentTime = this.saveDefaultTime;
                            this.handleQueryInfo();
                        } else {
                            // 获取保存的查询参数
                            this.queryData = JSON.parse(this.queryParamsInfo['account_sales_volume']);
                            this.handleQueryInfoCallBack(this.accountSalesVolumeInfo);
                        }
                    });
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

</style>
