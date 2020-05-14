<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="付款时间" v-model="queryData.paymentTime" template="daterange" :isOption="false">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="是否发货">
                            <el-select size="small" v-model="queryData.shipStatus">
                                <el-option v-for="item in optionList.shipStatusList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"
                           :params="{obj_type: 'all'}" ></FilterBtn>
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
        getWalmartProductCostCountInfo,
    } from '@/api/sales_module/wm_product_cost_count'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'wm_product_cost_count';

    export default {
        name: component_name,
        data () {
            return {

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                children: [],

                queryData: {
                    paymentTime: [],
                    shipStatus: '',
                    group_id: '',
                    obj_type: 'all',
                },

                //保存默认日期
                saveDefaultTime: [],

                optionList: {
                    countTypeList: {
                        'd': '日',
                        'w': '周',
                        'm': '月',
                    },
                    shipStatusList: [
                        { value: '', label: '全部'},
                        { value: '1', label: '是'},
                        { value: '0', label: '否'},
                    ],
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
            getWalmartProductCostCountInfo,

            // 列表信息查询
            handleQueryInfo (params, isFn, item) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['wm_product_cost_count']);
                }

                let obj = {
                    report_type: 1,
                    time_start: this.queryData.paymentTime[0],
                    time_end: this.queryData.paymentTime[1],
                    ship_status: this.queryData.shipStatus,
                    group_id: this.queryData.group_id,
                    obj_type: 'all',
                    ...params,
                };

                this.getWalmartProductCostCountInfo(obj).then(({data}) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data, item);
                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData = {
                    shipStatus: '',
                    group_id: '',
                    obj_type: 'all',
                    paymentTime: this.saveDefaultTime,
                }
            },

            // 展开表格
            handleTableOpen({id}, treeNode, resolve) {
                this.queryData = JSON.parse(this.queryParamsInfo['wm_product_cost_count']);
                let obj = {
                    report_type: 1,
                    time_start: this.queryData.paymentTime[0],
                    time_end: this.queryData.paymentTime[1],
                    ship_status: this.queryData.shipStatus,
                    group_id: id,
                    obj_type: 'group'
                };

                getWalmartProductCostCountInfo(obj).then(({data}) => {
                    resolve(data.data.map((_v, _i) => {
                        this.$nextTick().then(() => {
                            this.$refs.myTable.handleRefreshTableHeight();
                        });
                        return {
                            ..._v,
                            id: `${id}_${_i}`
                        }
                    }));
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
            handleQueryInfoCallBack (data, item) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'wm_product_cost_count',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = ['', ...Object.values(data.key)];
                this.tableProps = ['name', ...Object.keys(data.key)];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data.map((item, index) => {
                        return {
                            ...item,
                            hasChildren: !!index,
                        }
                    });
                });
                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'total_date_value') return '120';
                    if(item === 'name') return '300';
                    return '90';
                });
            },
        },
        created () {
            this.thisVm = this;
            try {
                this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
                this.queryData.paymentTime = this.saveDefaultTime;
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

</style>
