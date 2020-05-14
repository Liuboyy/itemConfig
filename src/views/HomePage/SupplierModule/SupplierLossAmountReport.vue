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
                        <SearchRequirement label="报损日期" template="daterange" v-model="queryData.lossTime" :isOption="false" clearable>
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
                    <el-button size="small" type="primary" @click="handleQueryInfo()" icon="icon-chaxun">查询</el-button>
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
                :tableWidth="tableWidth"
                :showSearch="showSearch"
                :tableSort="tableSort"
                @handleSort="handleSortChange">
            <template slot="loss_totalprice" slot-scope="scope">
                <el-button size="small" type="text" @click="handleLossAmountDetails(scope.row)"
                           v-if="buttonList['detail'] && buttonList['detail'].permit(thisVm)">{{scope.row.loss_totalprice}}</el-button>
                <span v-else>{{scope.row.loss_totalprice}}</span>
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

        <ComDialogPreview title="查看明细" width="800px" isPage
                          :visible.sync="isShowDetails"
                          :tableKey="dialogKey"
                          :tableProps="dialogProps"
                          :tableData="dialogData"
                          :tableWidth="dialogWidth"
                          :dialogPageData="dialogPageData"
                          @dialogPageChange="handleDialogPageChange">
            <template slot="web_link" slot-scope="scope">
                <el-button size="small" type="text" :label="scope.row.web_link" v-if="buttonList['link'] && buttonList['link'].permit(thisVm)"
                           @click="handleSupplierLink(scope.row)">{{scope.row.web_link}}</el-button>
            </template>
        </ComDialogPreview>

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
        getSupplierLossAmountInfo,
        getLossAmountDetailsInfo,
        getOptionList,
        getProductLineList
    } from '../../../api/supplier_module/supplier_loss_amount_report'


    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'supplier_loss_amount_report';

    export default {
        name: component_name,
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    createTime: [],
                    lossTime: [],
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
                tableWidth: [],
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

                //查看详情
                isShowDetails: false,
                dialogKey: [],
                dialogProps: [],
                dialogData: [],
                dialogWidth: [],
                dialogPageData: {
                    limit: 20,
                    offset: 1,
                    total: 0
                },
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
            getSupplierLossAmountInfo,

            // 重置
            handleResetQueryInfo(){
                this.queryData.createTime = [];
                this.queryData.lossTime = [];
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
                    this.queryData = JSON.parse(this.queryParamsInfo['supplier_loss_amount_report']);
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
                    loss_date_start: this.queryData.lossTime && this.queryData.lossTime[0],
                    loss_date_end: this.queryData.lossTime && this.queryData.lossTime[1],
                    sort: this.queryData.sort,
                    ...params,
                };

                obj = Object.assign(obj || {}, params);

                this.getSupplierLossAmountInfo(obj).then(({ data}) => {
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
                    key: 'supplier_loss_amount_report',
                    value: JSON.stringify(this.queryData)
                });
                if (data.prop === "create_time") {
                    this.queryData.sort = data.order === 'ascending' ? 1 : 2;
                }
                if (data.prop === "loss_totalprice") {
                    this.queryData.sort = data.order === 'ascending' ? 3 : 4;
                }
                this.handleQueryInfo({limit: this.pageData.currentList});
            },

            //查看明细
            handleLossAmountDetails(row, page) {
                this.saveRowData = row;
                let obj = {
                    supplier_code: row.supplier_code,
                    ...page
                };
                getLossAmountDetailsInfo(obj).then(({ data }) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.isShowDetails = true;
                        this.dialogKey = ['序号', ...data.title];
                        this.dialogProps = ['index', 'apply_time', 'loss_totalprice'];
                        this.dialogData = data.data;
                        this.dialogPageData.limit = data.page_data.limit;
                        this.dialogPageData.offset = data.page_data.offset;
                        this.dialogPageData.total = data.page_data.total;
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                })

            },
            //弹框分页
            handleDialogPageChange({offset,limit}) {
                this.handleLossAmountDetails(this.saveRowData, {offset, limit})
            },

            //供应商链接
            handleSupplierLink(row) {
                window.open(`${row.web_link}`, '_blank')
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
                    key: 'supplier_loss_amount_report',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = ['序号', ...data.title];
                this.tableProps = ['index', 'supplier_code', 'supplier_name', 'create_time','category_name', 'supplier_resource_name', 'settle_method_name', 'loss_totalprice'];
                this.tableWidth = ['60', '150', 'supplier_name', '','', '', '', ''];
                this.tableSort = [false, false, false,'custom', false, false, false, 'custom'];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data;
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
    /deep/.el-button {
        white-space: pre-line;
        text-align: left;
    }

</style>
