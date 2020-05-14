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
                        <SearchRequirement label="变量维度">
                            <el-select size="small" v-model="queryData.variableType" filterable v-filter>
                                <el-option
                                        v-for="item in optionList.variableTypeList"
                                        :key="item.code"
                                        :value="item.code"
                                        :label="item.name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="时间维度">
                            <el-select size="small" v-model="queryData.timeType" filterable v-filter>
                                <el-option
                                        v-for="item in optionList.timeTypeList"
                                        :key="item.code"
                                        :value="item.code"
                                        :label="item.name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="数值" template="inputInterval" v-model="queryData.number"></SearchRequirement>
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
                <FilterBtn  :resetFn="handleResetQueryInfo" :queryFn="handleQueryInfo" refTable="tableArea"
                            :params="{limit: pageData.currentList}"></FilterBtn>
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
            <template slot="status_name" slot-scope="scope">
                <i class="ui-state_dot state_blue" v-if="scope.row.status_name === '已创建'|| scope.row.status_name === '已审核'|| scope.row.status_name === '启用审核'"></i>
                <i class="ui-state_dot state_orange" v-if="scope.row.status_name === '待审核'|| scope.row.status_name === '待取消'|| scope.row.status_name === '待启用'|| scope.row.status_name === '待经理审核'||scope.row.status_name === '待修改'"></i>
                <i class="ui-state_dot state_red" v-if="scope.row.status_name === '被驳回'|| scope.row.status_name === '已禁用'"></i>
                <i class="ui-state_dot state_gray" v-if="scope.row.status_name === '已取消'"></i>
                <span>{{scope.row.status_name}}</span>
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

        <el-dialog
                title="编辑显示数据"
                width="480px"
                class="ui-layout_edit-dialog"
                :visible.sync="isEditTitleShow"
                @close="handleCloseEditTitleInfo">
            <div class="ui-check_box">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="checkTitle" @change="handleCheckedTitleChange">
                    <div style="display: flex">
                        <el-checkbox v-for="(label, value) in variableTitleList"
                                     :key="value"
                                     :label="value">{{label}}</el-checkbox>
                    </div>
                    <div style="flex: 1">
                        <el-checkbox v-for="(label, value) in dateTitleList"
                                     :key="value"
                                     :label="value">{{label}}</el-checkbox>
                    </div>
                </el-checkbox-group>
            </div>
            <div class="dialog-footer" slot="footer">
                <el-button size="small" @click="handleCloseEditTitleInfo">取消</el-button>
                <el-button size="small" @click="handleSaveEditTitleInfo" type="primary">确定</el-button>
            </div>
        </el-dialog>

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
        getSupplierPurchaseBusinessInfo,
        getOptionList,
        getProductLineList,
        getVariableAndTimeList,
        getAllEditTitleInfo,
        getSaveEditTitleInfo
    } from '../../../api/supplier_module/supplier_purchase_business_report'


    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'supplier_purchase_business_report';

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
                    number: ['0', '0'],
                    variableType: 'pur_cnt',
                    timeType: '3',
                    sortName: '',
                    sortType: '',
                },
                optionList: {
                    supplierStatusList: [],
                    supplierAttributesList: [],
                    supplierSourceList: [],
                    settleWayList: [],
                    productLineList: [],
                    variableTypeList: [],
                    timeTypeList: [],
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

                //编辑显示数据
                isEditTitleShow: false,
                isIndeterminate: true,
                checkAll: false,
                checkTitle: [],
                variableTitleList: [],
                dateTitleList: [],
                saveTitleType: '',
                //判断是否勾选字段
                isCheckAge: false,
                isCheckSale: false,

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
            getSupplierPurchaseBusinessInfo,

            // 重置
            handleResetQueryInfo(){
                this.queryData.createTime = [];
                this.queryData.supplierStatus = [];
                this.queryData.supplierAttributes = [];
                this.queryData.supplierSource = [];
                this.queryData.settleWay = [];
                this.queryData.productLine = [];
                this.queryData.number = ['0', '0'];
                this.queryData.variableType = 'pur_cnt';
                this.queryData.timeType = '3';
                this.queryData.supplierCode = '';
                this.queryData.supplierName = '';
                this.queryData.sortName = '';
                this.queryData.sortType = '';
            },


            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['supplier_purchase_business_report']);
                }
                let reg = /^\d+(\.\d+)?$/;
                if(this.queryData.number[0] && !reg.test(this.queryData.number[0])) {
                    this.$message.warning('请输入数字！');
                    return;
                }
                if(this.queryData.number[1] && !reg.test(this.queryData.number[1])) {
                    this.$message.warning('请输入数字！');
                    return;
                }
                if(!(this.queryData.number[0] || this.queryData.number[1])) {
                    this.$message.warning('请输入数值查询');
                    return;
                }
                if(this.queryData.number[0] && this.queryData.number[1]) {
                    if(this.queryData.number[0] > this.queryData.number[1]) {
                        this.$message.warning('开始数值不能大于结束数值');
                        return;
                    }
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
                    sort_name: this.queryData.sortName,
                    sort_type: this.queryData.sortType,
                    statis_type: this.queryData.variableType,
                    date_select: this.queryData.timeType,
                    value_start: this.queryData.number[0],
                    value_end: this.queryData.number[1],
                    ...params,
                };

                obj = Object.assign(obj || {}, params);

                this.getSupplierPurchaseBusinessInfo(obj).then(({ data}) => {
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
                    key: 'supplier_purchase_business_report',
                    value: JSON.stringify(this.queryData)
                });

                const prop = this.tableProps.splice(8);
                prop.forEach(item => {
                    if(data.prop === item ) {
                        this.queryData.sortName = item;
                        this.queryData.sortType = data.order === 'ascending' ? 'asc' : 'desc';
                    }
                });
                this.handleQueryInfo({limit: this.pageData.currentList});
            },

            //编辑显示数据
            handleEditTitleInfo() {
                getAllEditTitleInfo().then(({ data }) => {
                    if(data.status) {
                        this.variableTitleList = data.data.title_dispose;
                        this.dateTitleList = data.data.title_date;
                        const concatArr = Object.keys(this.variableTitleList).concat(Object.keys(this.dateTitleList));
                        if(data.data_before.title_dispose.length|| data.data_before.title_date.length) {
                            this.checkTitle = data.data_before.title_dispose.concat(data.data_before.title_date);
                        }else {
                            this.checkTitle = concatArr;
                        }
                        this.isIndeterminate = this.checkTitle.length > 0 && this.checkTitle.length < concatArr.length;
                        this.checkAll = !(this.checkTitle.length > 0 && this.checkTitle.length < concatArr.length);
                        this.isEditTitleShow = true;
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                });
            },

            //全选
            handleCheckAllChange(val) {
                this.isIndeterminate = false;
                let arr = Object.keys(this.variableTitleList).concat(Object.keys(this.dateTitleList));
                this.checkTitle = val ? arr : [];
            },

            //单选
            handleCheckedTitleChange(val) {
                this.checkAll = val.length === Object.keys(this.variableTitleList).concat(Object.keys(this.dateTitleList)).length;
                this.isIndeterminate = val.length > 0 && val.length < Object.keys(this.variableTitleList).concat(Object.keys(this.dateTitleList)).length;
            },
            //取消 编辑显示数据
            handleCloseEditTitleInfo() {
                this.checkTitle = [];
                this.isEditTitleShow = false;
                this.checkAll = false;
                this.isIndeterminate = true;
            },
            //确定 编辑显示数据
            handleSaveEditTitleInfo() {
                let select_dispose = [];
                let select_date = [];

                this.checkTitle.forEach(item => {
                    if(/^[0-9]/.test(item)) {
                        select_date.push(item);
                    }else {
                        select_dispose.push(item)
                    }
                });
                if(!(select_date.length && select_dispose.length)) {
                    this.$message.warning('请至少选择一个变量和一个时间');
                    return;
                }
                getSaveEditTitleInfo({
                    select_dispose: select_dispose.join(','),
                    select_date: select_date.join(','),
                }).then(({ data }) => {
                    this.handleOperationCallBack(data);
                })
            },


            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.isEditTitleShow = false;
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
                    key: 'supplier_purchase_business_report',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = ['序号', ...Object.values(data.title)];
                this.tableProps = ['index', ...Object.keys(data.title)];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data;
                });
                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'index') return '60';
                    if(item === 'category_type_name') return '80';
                    if(item === 'category_name'|| item === 'status_name'|| item === 'supplier_resource_name'|| item === 'settle_method_name'|| item === 'create_time') return '100';
                    if(item === 'loss_amt_3'|| item === 'loss_amt_7') return '130';
                    if(item === 'loss_amt_15'||item === 'loss_amt_30'|| item === 'loss_amt_60'|| item === 'loss_amt_90'|| item === 'loss_amt_180'|| item === 'loss_amt_360'|| item === 'loss_amt_total') return '140';
                    if(item === 'pur_cnt_180'|| item === 'pur_cnt_360'|| item === 'pur_amt_180'|| item === 'pur_amt_360') return '180';
                    if(item === 'supplier_name') return '240';
                    return '170';
                });
                this.tableSort = this.tableProps.map(item => {
                    if(item === 'supplier_code'|| item === 'supplier_name'|| item === 'category_name'|| item === 'status_name'|| item === 'category_type_name'|| item === 'supplier_resource_name') return false;
                    return 'custom';
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
                getVariableAndTimeList({ type: 2 }).then(({ data }) => {
                    this.optionList.variableTypeList = data.choice_data;
                    this.optionList.timeTypeList = data.supplier_level;
                });
                this.handleQueryInfo();
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>
<style lang="less" scoped>

    .ui-layout_edit-dialog {
        .ui-check_box {
            .el-checkbox+.el-checkbox {
                margin-left: 0;
            }
            .el-checkbox {
                width: 80px;
                margin: 5px 30px 5px 0;
            }
            .el-checkbox__label {
                font-size: 12px;
            }
        }
    }


</style>
