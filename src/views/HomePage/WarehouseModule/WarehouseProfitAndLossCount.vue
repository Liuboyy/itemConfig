<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch && queryData.query_type !== '0'">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计月份">
                            <el-date-picker
                                    type="month"
                                    size="small"
                                    v-model="queryData.month"
                                    placeholder="选择年"
                                    :clearable="false"
                                    format="yyyy-MM"
                                    value-format="yyyy-MM">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="损益类型">
                            <el-select size="small" v-model="queryData.type" filterable clearable v-filter>
                                <el-option v-for="item in optionList.typeList"
                                           :key="item.d_id"
                                           :value="item.d_id"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="仓库">
                            <el-select size="small" v-model="queryData.warehouse" filterable clearable v-filter>
                                <el-option v-for="item in optionList.warehouseList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="批次">
                            <el-input size="small" placeholder="请输入" v-model="queryData.batchNo"></el-input>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :params="{limit: pageData.currentList}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo" v-if="queryData.query_type !== '0'"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module" >
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button
                    v-if="item.method && item.permit(thisVm) && item.icon && queryData.query_type !== '0'"
                    v-for="item in buttonList"
                    size="small"
                    :type="item.type"
                    :key="item.value"
                    :icon="item.icon"
                    @click="item.action(thisVm, item.method)">{{item.name}}</el-button>
        </div>
        <div class="ui-tabs_box">
            <el-tabs v-model="queryData.query_type" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="损益统计" name="count" v-if="buttonList['count'].permit()"></el-tab-pane>
                <el-tab-pane label="损益明细统计" name="details" v-if="buttonList['details'].permit()"></el-tab-pane>
            </el-tabs>
        </div>
        <ComTableInfo
                ref="myTable"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableMinWidth="tableMinWidth"
                :showSearch="showSearch"
                :cellStyle="cellStyle"
                :otherHeight="['el-tabs__header']">
        </ComTableInfo>
    </div>
</template>

<script>
    import config from '@/assets/js/config';

    import {
        mapActions,
        mapGetters
    } from 'vuex';

    import {
        getWarehouseProfitAndLossCountInfo,
        getWarehouseProfitAndLossDetailsInfo,
        getOptionList
    } from '../../../api/warehouse_module/warehouse_profit_loss'

    import {
        getPreMonth
    } from '@/api/common/date_format'

    import {
        getThirtyDayDateRange
    } from '@/services/index'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'warehouse_profit_loss';

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
                    month: '',
                    type: '',
                    warehouse: '',
                    batchNo: '',
                    query_type: ''
                },
                saveDefaultMonth: '',

                optionList: {
                    typeList: [],
                    warehouseList: [],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth: [],

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
                'publishSalesCountInfo'
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([]),
            getWarehouseProfitAndLossCountInfo,
            getWarehouseProfitAndLossDetailsInfo,
            getOptionList,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['warehouse_profit_loss']);
                }

                if(this.queryData.query_type === '0') {
                    this.$message.warning('请联系管理员开通权限！');
                    return;
                }

                let obj = {
                    select_date: this.queryData.month,
                    sy_type: this.queryData.type,
                    warehouse_code: this.queryData.warehouse,
                    batch: this.queryData.batchNo,
                };

                obj = Object.assign(params || {}, obj);

                let fnName = this.queryData.query_type === 'count' ?  this.getWarehouseProfitAndLossCountInfo:  this.getWarehouseProfitAndLossDetailsInfo;

                fnName(obj).then(({ data }) => {
                    if (data.status === 2) return ;
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
                this.queryData.type = '';
                this.queryData.warehouse = '';
                this.queryData.batchNo = '';
                this.queryData.month = this.saveDefaultMonth;
            },

            //合计底纹
            cellStyle(row) {
                if(row.row.sy_type == '合计') return 'background: #f3f6fa'
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

            handleTabClick(tab) {
                this.queryData.query_type = tab.name;
                this.handleQueryInfo();
            },

            // 操作回调
            handleOperationCallBack (data, successFn, errorFn) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    this.handleQueryInfo();
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
                    key: 'warehouse_profit_loss',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = Object.values(data.title);
                this.tableProps = Object.keys(data.title);
                this.tableData = data.data;
                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'py_money'|| item === 'pk_money'|| item === 'sl_abs'|| item === 'money_abs'|| item === 'sku_difference'|| item === 'sy_sum_rate'|| item === 'sy_money_rate'|| item === 'pc'|| item === 'new_price'|| item === 'sku'|| item === 'auditor_date') return '100';
                    if(item === 'warehouse_name') return '150';
                    if(item === 'sy_reason'|| item === 'sku_name') return '250';
                    return '70'
                })
            }
        },
        created () {
            this.thisVm = this;
            try {

                getOptionList().then(({ data }) => {
                    this.optionList.warehouseList = data.data.warehouse;
                    this.optionList.typeList = data.data.sy_type;
                });

                const queryModule = ['details','count'];
                for (let i = 0; i < queryModule.length; i++) {
                    if (this.buttonList[queryModule[i]].permit()) {
                        this.queryData.query_type = queryModule[i];
                    }
                }
                getPreMonth().then(( data ) => {
                    this.saveDefaultMonth = data.month;
                    this.queryData.month = this.saveDefaultMonth;
                    this.handleQueryInfo();
                });
            } catch (e) {
                console.log(e);
            }
        },
    };
</script>

<style lang="less" scoped>

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0!important;
    }

</style>
