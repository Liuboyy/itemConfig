<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="付款时间">
                            <el-date-picker
                                    size="small"
                                    type="date"
                                    :clearable="false"
                                    v-model="queryData.paymentTime"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
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
                :load="handleTableOpen">
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
        getAmazonFbaStockCountInfo,
    } from '@/api/sales_module/amazon_fba_stock_count';

    import {
        getPreDateRange,
        getCurrentDateRange
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'amazon_fba_stock_count';
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
                    paymentTime: '',
                },
                saveDefaultTime: '',

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

                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
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
                ''
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,
            getAmazonFbaStockCountInfo,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['amazon_fba_stock_count']);
                }

                let obj = {
                    date: this.queryData.paymentTime,
                    ...params
                };

                this.getAmazonFbaStockCountInfo(obj).then(({data}) => {

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
                    is_excel: 1
                }, true)
            },

            // 展开表格
            handleTableOpen({group_id, id}, treeNode, resolve) {
                this.queryData = JSON.parse(this.queryParamsInfo['amazon_fba_stock_count']);
                this.queryData.group_id = group_id;
                let obj = {
                    group_id: this.queryData.group_id,
                    date: this.queryData.paymentTime,
                };

                this.getAmazonFbaStockCountInfo(obj).then(({data}) => {
                    resolve(data.data.value.map((_v, _i) => {
                        this.$nextTick().then(() => {
                            this.$refs.myTable.handleRefreshTableHeight();
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
                    key: 'amazon_fba_stock_count',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = ['组别', '当前库存金额(CNY)', '在途库存金额(CNY)', '超90天库存金额(动销口径)', '超180天库存金额(库龄口径)', '90天以上库存占比', '180天以上库存占比', '过去30天FBA业绩(USD)', '预计可售卖月数'];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.value.map((_v, index) => {
                        return {
                            ..._v,
                            id: index + 1,
                            hasChildren: !!index
                        }
                    });

                    this.tableProps = ['group_name', 'warehouse_money', 'onway_money', 'over90_warehouse_money','over180_warehouse_money','over90_warehouse_percent','over180_warehouse_percent','fba_past30','on_sell_months'];
                })
            }
        },
        created () {
            this.thisVm = this;
            try {
                getCurrentDateRange().then(( data ) => {
                    this.saveDefaultTime = data.end;
                    this.queryData.paymentTime = this.saveDefaultTime;
                    this.handleQueryInfo();
                });

            } catch (e) {
                console.log(e);
            }
        },
    };
</script>

<style lang="less" scoped>
    /deep/.el-table__indent {
        padding-left: 10px!important;
    }

</style>
