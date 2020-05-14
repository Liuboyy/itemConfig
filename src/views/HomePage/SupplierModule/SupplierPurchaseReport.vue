<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="创建时间" template="daterange" v-model="queryData.createTime" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="供应商代码">
                            <el-input size="small" placeholder="请输入" v-model="queryData.supplierCode"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="供应商名称">
                            <el-input size="small" placeholder="请输入" v-model="queryData.supplierName"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="供应商状态">
                            <el-select size="small" v-model="queryData.supplierStatus" filterable v-filter multiple collapseTags>
                                <el-option
                                        v-for="item in optionList.supplierStatusList"
                                        :key="item.id"
                                        :value="item.id"
                                        :label="item.trans_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="供应商属性">
                            <el-select size="small" v-model="queryData.supplierAttributes" filterable v-filter multiple collapseTags>
                                <el-option
                                        v-for="item in optionList.supplierAttributesList"
                                        :key="item.id"
                                        :value="item.id"
                                        :label="item.trans_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="一级产品线">
                            <el-select size="small" v-model="queryData.productLine" filterable v-filter multiple collapseTags>
                                <el-option
                                        v-for="item in optionList.productLineList"
                                        :key="item.category_id_level_1"
                                        :value="item.category_id_level_1"
                                        :label="item.category_name_level_1"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="供应商来源">
                            <el-select size="small" v-model="queryData.supplierSource" filterable v-filter multiple collapseTags>
                                <el-option
                                        v-for="item in optionList.supplierSourceList"
                                        :key="item.id"
                                        :value="item.id"
                                        :label="item.trans_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="结算方式">
                            <el-select size="small" v-model="queryData.settleWay" filterable v-filter multiple collapseTags>
                                <el-option
                                        v-for="item in optionList.settleWayList"
                                        :key="item.id"
                                        :value="item.id"
                                        :label="item.trans_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <div class="ui-filter-btn">
                    <el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>
                    <el-button size="small" type="primary" @click="handleQueryInfo({limit: pageData.currentList})" icon="icon-chaxun">查询</el-button>
                </div>
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
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableMinWidth="tableMinWidth"
                :showSearch="showSearch"
                :tableSort="tableSort"
                @handleSort="handleSortChange">
            <template slot="supplier_status_name" slot-scope="scope">
                <i class="ui-state_dot state_blue" v-if="scope.row.supplier_status_name === '已创建'|| scope.row.supplier_status_name === '已审核'|| scope.row.supplier_status_name === '启用审核'"></i>
                <i class="ui-state_dot state_orange" v-if="scope.row.supplier_status_name === '待审核'|| scope.row.supplier_status_name === '待取消'|| scope.row.supplier_status_name === '待启用'|| scope.row.supplier_status_name === '待经理审核'||scope.row.supplier_status_name === '待修改'"></i>
                <i class="ui-state_dot state_red" v-if="scope.row.supplier_status_name === '被驳回'|| scope.row.supplier_status_name === '已禁用'"></i>
                <i class="ui-state_dot state_gray" v-if="scope.row.supplier_status_name === '已取消'"></i>
                <span>{{scope.row.supplier_status_name}}</span>
            </template>
        </ComTableInfo>

        <div class="ui-main-module-page">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageData.currentPage"
                    :page-sizes="pageSizes"
                    size="small"
                    :page-size="pageData.currentList"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageData.currentTotal">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';

    import {
        getCurrentMonth,
    } from '@/api/common/date_format'

    import {
        getSupplierPurchaseInfo,
        getOptionList,
        getProductLineList
    } from '../../../api/supplier_module/supplier_purchase_report'


    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'supplier_purchase_report';

    export default {
        name: component_name,
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    createTime: [],
                    supplierCode: '',
                    supplierName: '',
                    supplierStatus: [],
                    supplierAttributes: [],
                    supplierSource: [],
                    settleWay: [],
                    productLine: [],
                    sort: '',
                },
                optionList: {
                    supplierStatusList: [],
                    supplierAttributesList: [],
                    supplierSourceList: [],
                    settleWayList: [],
                    productLineList: [],
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableMinWidth: [],
                tableSort: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                saveDefaultDate: '',
                saveRowData: {},

            }
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
            getSupplierPurchaseInfo,

            // 重置
            handleResetQueryInfo(){
                this.queryData.createTime = [];
                this.queryData.supplierStatus = [];
                this.queryData.supplierAttributes = [];
                this.queryData.supplierSource = [];
                this.queryData.settleWay = [];
                this.queryData.productLine = [];
                this.queryData.supplierCode = '';
                this.queryData.supplierName = '';
                this.queryData.sort = '';

            },

            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['supplier_purchase_report']);
                }
                let obj = {
                    supplier_code: this.queryData.supplierCode,
                    supplier_name: this.queryData.supplierName,
                    category: this.queryData.productLine.join(','),
                    supplier_status: this.queryData.supplierStatus.join(','),
                    supplier_type: this.queryData.supplierAttributes.join(','),
                    supplier_from: this.queryData.supplierSource.join(','),
                    settlement_type: this.queryData.settleWay.join(','),
                    date_start: this.queryData.createTime && this.queryData.createTime[0],
                    date_end: this.queryData.createTime && this.queryData.createTime[1],
                    sort: this.queryData.sort,
                    ...params,
                };

                obj = Object.assign(obj || {}, params);

                this.getSupplierPurchaseInfo(obj).then(({ data}) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }
                }).catch(err => {
                    console.log(err);
                })
            },

            // 排序
            handleSortChange(data) {
                this.queryData.sortOrder = {
                    prop: data.prop,
                    order: data.order
                };
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'supplier_purchase_report',
                    value: JSON.stringify(this.queryData)
                });
                if (data.prop === "create_time") {
                    this.queryData.sort = data.order === 'ascending' ? 1 : 2;

                    console.log(this.queryData.sort)
                }
                if (data.prop === "sku_cnt") {
                    this.queryData.sort = data.order === 'ascending' ? 3 : 4;
                }
                if (data.prop === "pur_frequency_one") {
                    this.queryData.sort = data.order === 'ascending' ? 5 : 6;
                }
                if (data.prop === "pur_qty_one") {
                    this.queryData.sort = data.order === 'ascending' ? 7 : 8;
                }
                if (data.prop === "pur_amt_one") {
                    this.queryData.sort = data.order === 'ascending' ? 9 : 10;
                }
                if (data.prop === "pur_frequency_three") {
                    this.queryData.sort = data.order === 'ascending' ? 11 : 12;
                }
                if (data.prop === "pur_qty_three") {
                    this.queryData.sort = data.order === 'ascending' ? 13 : 14;
                }
                if (data.prop === "pur_amt_three") {
                    this.queryData.sort = data.order === 'ascending' ? 15 : 16;
                }
                this.handleQueryInfo({limit: this.pageData.currentList});
            },


            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || '操作失败')
                }
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1
                }, true)
            },

            // 分页
            handleSizeChange(size) {
                this.handleQueryInfo({
                    limit: size,
                    offset: 1
                }, true);
            },
            handleCurrentChange(val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true)
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'supplier_purchase_report',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = ['序号', ...data.title];
                this.tableProps = ['index', 'supplier_code', 'supplier_name', 'category_name', 'supplier_status_name', 'category_type_name', 'is_complete', 'create_time', 'settle_method_name', 'sku_cnt', 'pur_frequency_one', 'pur_qty_one', 'pur_amt_one', 'pur_frequency_three', 'pur_qty_three', 'pur_amt_three'];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data;
                });
                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'index') return '60';
                    if(item === 'category_name'|| item === 'category_type_name'|| item === 'supplier_status_name'|| item === 'is_complete'|| item === 'settle_method_name'|| item === 'create_time'|| item === 'sku_cnt') return '100';
                    if(item === 'supplier_code') return '120';
                    if(item === 'supplier_name') return '250';
                    return '130';
                });
                this.tableSort = this.tableProps.map(item => {
                    if(item === 'create_time'|| item === 'sku_cnt'|| item === 'pur_frequency_one'|| item === 'pur_qty_one'|| item === 'pur_amt_one'|| item === 'pur_frequency_three'|| item === 'pur_qty_three'|| item === 'pur_amt_three') return 'custom';
                    return false;
                });

                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created(){
            this.thisVm = this;
            try{
                getOptionList().then(({ data }) => {
                    this.optionList.supplierStatusList = data.category_data;
                    this.optionList.supplierAttributesList = data.supplier_type;
                    this.optionList.supplierSourceList = data.supplier_from;
                    this.optionList.settleWayList = data.settlement_type;
                });
                getProductLineList().then(({ data }) => {
                    this.optionList.productLineList = data.category_data;
                });
                this.handleQueryInfo();
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>
<style lang="less" scoped>

</style>
