<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="在售时间" v-model="queryData.salesTime" template="daterange" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="SKU">
                            <el-input size="small" placeholder="多个查询用英文逗号','隔开" v-model="queryData.sku"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="仓库">
                            <el-select size="small" v-model="queryData.store" filterable v-filter collapseTags multiple>
                                <el-option v-for="item in optionList.warehouseList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="是否断货">
                            <el-select size="small" v-model="queryData.sold_out">
                                <el-option v-for="item in optionList.isBrokenList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发类型">
                            <el-select size="small" v-model="queryData.develop_type" filterable v-filter collapseTags multiple>
                                <el-option v-for="item in optionList.devTypeList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发时间" v-model="queryData.devTime" template="daterange" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="采购成本">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.procurement_cost_min"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.procurement_cost_high" ></el-input>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品线">
                            <el-select size="small" v-model="queryData.product_line" filterable v-filter collapseTags multiple>
                                <el-option v-for="item in optionList.productLineList"
                                           :key="item.id"
                                           :value="item.id"
                                           :label="item.linelist_cn_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品状态">
                            <el-select size="small" v-model="queryData.product_status" filterable v-filter collapseTags multiple>
                                <el-option v-for="item in optionList.productStateList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>

                    <!--<li>-->
                        <!--<SearchRequirement label="在途库存">-->
                            <!--<el-row>-->
                                <!--<el-col :span="11">-->
                                    <!--<el-input size="small" placeholder="请输入" v-model="queryData.on_the_way_min"></el-input>-->
                                <!--</el-col>-->
                                <!--<el-col :span="2"> - </el-col>-->
                                <!--<el-col :span="11">-->
                                    <!--<el-input size="small" placeholder="请输入" v-model="queryData.on_the_way_high" ></el-input>-->
                                <!--</el-col>-->
                            <!--</el-row>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <!--<li>-->
                        <!--<SearchRequirement label="可用库存">-->
                            <!--<el-row>-->
                                <!--<el-col :span="11">-->
                                    <!--<el-input size="small" placeholder="请输入" v-model="queryData.can_stock_min"></el-input>-->
                                <!--</el-col>-->
                                <!--<el-col :span="2"> - </el-col>-->
                                <!--<el-col :span="11">-->
                                    <!--<el-input size="small" placeholder="请输入" v-model="queryData.can_stock_high" ></el-input>-->
                                <!--</el-col>-->
                            <!--</el-row>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <!--<li>-->
                        <!--<SearchRequirement label="总库存">-->
                            <!--<el-row>-->
                                <!--<el-col :span="11">-->
                                    <!--<el-input size="small" placeholder="请输入" v-model="queryData.total_stock_min"></el-input>-->
                                <!--</el-col>-->
                                <!--<el-col :span="2"> - </el-col>-->
                                <!--<el-col :span="11">-->
                                    <!--<el-input size="small" placeholder="请输入" v-model="queryData.total_stock_high" ></el-input>-->
                                <!--</el-col>-->
                            <!--</el-row>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <!--<li>-->
                        <!--<SearchRequirement label="30天销量">-->
                            <!--<el-row>-->
                                <!--<el-col :span="11">-->
                                    <!--<el-input size="small" placeholder="请输入" v-model="queryData.lately_sale_min"></el-input>-->
                                <!--</el-col>-->
                                <!--<el-col :span="2"> - </el-col>-->
                                    <!--<el-col :span="11">-->
                                <!--<el-input size="small" placeholder="请输入" v-model="queryData.lately_sale_high"></el-input>-->
                                <!--</el-col>-->
                            <!--</el-row>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <!--<li>-->
                        <!--<SearchRequirement label="断货天数">-->
                            <!--<el-row>-->
                                <!--<el-col :span="11">-->
                                    <!--<el-input size="small" placeholder="请输入" v-model="queryData.sold_out_day_min"></el-input>-->
                                <!--</el-col>-->
                                <!--<el-col :span="2"> - </el-col>-->
                                <!--<el-col :span="11">-->
                                    <!--<el-input size="small" placeholder="请输入" v-model="queryData.sold_out_day_high" ></el-input>-->
                                <!--</el-col>-->
                            <!--</el-row>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <!--<li>-->
                        <!--<SearchRequirement label="可用预售天数">-->
                            <!--<el-row>-->
                                <!--<el-col :span="11">-->
                                    <!--<el-input size="small" placeholder="请输入" v-model="queryData.use_sale_min"></el-input>-->
                                <!--</el-col>-->
                                <!--<el-col :span="2"> - </el-col>-->
                                <!--<el-col :span="11">-->
                                    <!--<el-input size="small" placeholder="请输入" v-model="queryData.use_sale_high" ></el-input>-->
                                <!--</el-col>-->
                            <!--</el-row>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <!--<li>-->
                        <!--<SearchRequirement label="总库存预售天数">-->
                            <!--<el-row>-->
                                <!--<el-col :span="11">-->
                                    <!--<el-input size="small" placeholder="请输入" v-model="queryData.total_stock_sale_min"></el-input>-->
                                <!--</el-col>-->
                                <!--<el-col :span="2"> - </el-col>-->
                                <!--<el-col :span="11">-->
                                    <!--<el-input size="small" placeholder="请输入" v-model="queryData.total_stock_sale_high" ></el-input>-->
                                <!--</el-col>-->
                            <!--</el-row>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <!--<li>-->
                        <!--<SearchRequirement label="创建时间" v-model="queryData.createTime" template="daterange" :isOption="false" clearable>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
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

        <div class="ui-tabs_box">
            <el-tabs v-model="queryData.query_type" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="金额统计" name="1"></el-tab-pane>
                <el-tab-pane label="计量统计" name="2"></el-tab-pane>
            </el-tabs>
        </div>
        <DListingAmountTable ref="tableArea" :tableData="tableData" :showSearch="showSearch" :otherHeight="['el-tabs__header']"
                      v-if="queryData.query_type === '1'" :isShow="isCheckTitle"></DListingAmountTable>
        <DListingCalculateTable ref="tableArea" :tableData="tableData" :showSearch="showSearch" :otherHeight="['el-tabs__header']"
                         v-if="queryData.query_type === '2'" :isShow="isCheckTitle"></DListingCalculateTable>

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
                width="400px"
                class="ui-layout_edit-dialog"
                :visible.sync="isEditTitleShow"
                @close="handleCloseEditTitleInfo">
            <div class="ui-check_box">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="checkTitle" @change="handleCheckedTitleChange">
                    <el-checkbox v-for="(item, value) in allTitleList"
                                 :key="value"
                                 :label="value"
                                 :disabled="value === 'current_inventory'|| value === 'influence'
                                 || value === 'sales_situation'|| value === 'turnover_rate'">{{item}}</el-checkbox>
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
    import config from '@/assets/js/config';
    import {
        autoAddTableInx
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";
    import {
        getDWarehouseAmountInfo,
        getDWarehouseCalculateInfo,
        geOptionList,
        getAmountTitleList,
        getConfirmAmountTitleInfo,
        getCalculateTitleList,
        getConfirmCalculateTitleInfo
    } from '@/api/planning_module/d_warehouse_stock_list';

    import {
        getPreDateRange,
    } from '@/api/common/date_format'

    import DListingAmountTable from '../components/DListingAmountTable.vue'
    import DListingCalculateTable from '../components/DListingCalculateTable.vue'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'd_warehouse_stock_list';

    export default {
        name: component_name,
        components: { DListingAmountTable, DListingCalculateTable },
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    query_type: '1',
                    createTime: [],
                    salesTime: [],
                    devTime: [],
                    store: [],
                    product_status: [],
                    develop_type: [],
                    product_line: [],
                    sold_out: '',
                    sku: '',
                    use_sale_min: '',
                    use_sale_high: '',
                    procurement_cost_min: '',
                    procurement_cost_high: '',
                    on_the_way_min: '',
                    on_the_way_high: '',
                    total_stock_sale_min: '',
                    total_stock_sale_high: '',
                    sold_out_day_min: '',
                    sold_out_day_high: '',
                    total_stock_min: '',
                    total_stock_high: '',
                    can_stock_min: '',
                    can_stock_high: '',
                    lately_sale_min: '',
                    lately_sale_high: '',
                },

                optionList: {
                    warehouseList: [],
                    productStateList: [],
                    devTypeList: [],
                    productLineList: [],
                    isBrokenList: [
                        {label: '所有', value: ''},
                        {label: '否' , value: '0'},
                        {label: '是' , value: '1'},
                    ],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth:[],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                //编辑显示数据
                isEditTitleShow: false,
                isIndeterminate: true,
                checkAll: false,
                checkTitle: ['current_inventory', 'influence', 'sales_situation', 'turnover_rate'],
                allTitleList: [],

                //判断勾选库龄字段
                isCheckTitle: false,
            }

        },
        computed: {
            ...mapGetters([
                'loginInfo',
                'queryParamsInfo',
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'Fn'
            ]),
            autoAddTableInx,
            getDWarehouseAmountInfo,
            getDWarehouseCalculateInfo,
            getAmountTitleList,
            getConfirmAmountTitleInfo,
            getCalculateTitleList,
            getConfirmCalculateTitleInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['d_warehouse_stock_list']);
                }

                let reg = /^\d+(\.\d+)?$/;
                if(this.queryData.use_sale_min) {
                    if(!reg.test(this.queryData.use_sale_min)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.use_sale_high) {
                    if(!reg.test(this.queryData.use_sale_high)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.procurement_cost_min) {
                    if(!reg.test(this.queryData.procurement_cost_min)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.procurement_cost_high) {
                    if(!reg.test(this.queryData.procurement_cost_high)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.on_the_way_min) {
                    if(!reg.test(this.queryData.on_the_way_min)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.on_the_way_high) {
                    if(!reg.test(this.queryData.on_the_way_high)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.total_stock_sale_min) {
                    if(!reg.test(this.queryData.total_stock_sale_min)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.total_stock_sale_high) {
                    if(!reg.test(this.queryData.total_stock_sale_high)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.sold_out_day_min) {
                    if(!reg.test(this.queryData.sold_out_day_min)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.sold_out_day_high) {
                    if(!reg.test(this.queryData.sold_out_day_high)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.total_stock_min) {
                    if(!reg.test(this.queryData.total_stock_min)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.total_stock_high) {
                    if(!reg.test(this.queryData.total_stock_high)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.can_stock_min) {
                    if(!reg.test(this.queryData.can_stock_min)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.can_stock_high) {
                    if(!reg.test(this.queryData.can_stock_high)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.lately_sale_min) {
                    if(!reg.test(this.queryData.lately_sale_min)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.lately_sale_high) {
                    if(!reg.test(this.queryData.lately_sale_high)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                let obj = {
                    sold_date_start: this.queryData.salesTime && this.queryData.salesTime[0],
                    sold_date_end: this.queryData.salesTime && this.queryData.salesTime[1],
                    develop_time_begin: this.queryData.devTime && this.queryData.devTime[1],
                    develop_time_end: this.queryData.devTime && this.queryData.devTime[1],
                    sku: this.queryData.sku,
                    sold_out: this.queryData.sold_out,
                    store: this.queryData.store.join(','),
                    product_status: this.queryData.product_status.join(','),
                    develop_type: this.queryData.develop_type.join(','),
                    product_line: this.queryData.product_line.join(','),
                    procurement_cost_min: this.queryData.procurement_cost_min,
                    procurement_cost_high: this.queryData.procurement_cost_high,
//                    create_date_start: this.queryData.createTime && this.queryData.createTime[0],
//                    create_date_end: this.queryData.createTime && this.queryData.createTime[1],
//                    lately_sale_min: this.queryData.lately_sale_min,
//                    lately_sale_high: this.queryData.lately_sale_high,
//                    total_stock_min: this.queryData.total_stock_min,
//                    total_stock_high: this.queryData.total_stock_high,
//                    total_stock_sale_min: this.queryData.total_stock_sale_min,
//                    total_stock_sale_high: this.queryData.total_stock_sale_high ,
//                    use_sale_min: this.queryData.use_sale_min,
//                    use_sale_high: this.queryData.use_sale_high,
//                    on_the_way_min: this.queryData.on_the_way_min,
//                    on_the_way_high: this.queryData.on_the_way_high,
//                    can_stock_min: this.queryData.can_stock_min,
//                    can_stock_high: this.queryData.can_stock_high,
//                    sold_out_day_min: this.queryData.sold_out_day_min,
//                    sold_out_day_high: this.queryData.sold_out_day_high,
                };

                obj = Object.assign(params || {}, obj);

                let fnName = this.queryData.query_type === '1' ? this.getDWarehouseAmountInfo : this.getDWarehouseCalculateInfo;

                fnName(obj).then(({ data }) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败')
                    }
                })
            },

            // 查询重置
            handleResetQueryInfo() {
                this.queryData.createTime = [];
                this.queryData.salesTime = [];
                this.queryData.devTime = [];
                this.queryData.store = [];
                this.queryData.product_status = [];
                this.queryData.develop_type = [];
                this.queryData.product_line = [];
                this.queryData.sold_out = '';
                this.queryData.sku = '';
                this.queryData.use_sale_min = '';
                this.queryData.use_sale_high = '';
                this.queryData.procurement_cost_min = '';
                this.queryData.procurement_cost_high = '';
                this.queryData.on_the_way_min = '';
                this.queryData.on_the_way_high = '';
                this.queryData.total_stock_sale_min = '';
                this.queryData.total_stock_sale_high = '';
                this.queryData.sold_out_day_min = '';
                this.queryData.sold_out_day_high = '';
                this.queryData.total_stock_min = '';
                this.queryData.total_stock_high = '';
                this.queryData.can_stock_min = '';
                this.queryData.can_stock_high = '';
                this.queryData.lately_sale_min = '';
                this.queryData.lately_sale_high = '';
            },

            handleTabClick(tab) {
                this.queryData.query_type = tab.name;
                this.handleQueryInfo({limit: this.pageData.currentList});
            },

            //编辑显示数据
            handleEditTitleInfo() {
                let fnName = this.queryData.query_type === '1' ? getAmountTitleList : getCalculateTitleList;
                fnName().then(({ data }) => {
                    if(data.status) {
                        this.allTitleList = data.data;
                        if(data.data_before.length) {
                            this.checkTitle = data.data_before;
                        }else {
                            this.checkTitle = Object.keys(this.allTitleList);
                        }
                        this.isIndeterminate = this.checkTitle.length > 0 && this.checkTitle.length < Object.keys(this.allTitleList).length;
                        this.checkAll = !(this.checkTitle.length > 0 && this.checkTitle.length < Object.keys(this.allTitleList).length);
                        this.isEditTitleShow = true;
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                });
            },

            //全选
            handleCheckAllChange(val) {
                this.isIndeterminate = false;
                let arr = Object.keys(this.allTitleList);
                this.checkTitle = val ? arr : ['current_inventory', 'influence', 'sales_situation', 'turnover_rate'];
            },

            //单选
            handleCheckedTitleChange(val) {
                this.checkAll = val.length === Object.keys(this.allTitleList).length;
                this.isIndeterminate = val.length > 0 && val.length < Object.keys(this.allTitleList).length;
            },
            //取消 编辑显示数据
            handleCloseEditTitleInfo() {
                this.checkTitle = ['current_inventory', 'influence', 'sales_situation', 'turnover_rate'];
                this.isEditTitleShow = false;
                this.checkAll = false;
                this.isIndeterminate = true;
            },
            //确定 编辑显示数据
            handleSaveEditTitleInfo() {
                if(!this.checkTitle.length) {
                    this.$message.warning('请勾选数据！');
                    return;
                }
                let fnName = this.queryData.query_type === '1' ? getConfirmAmountTitleInfo : getConfirmCalculateTitleInfo;
                fnName({ select: this.checkTitle.join(',') }).then(({ data }) => {
                    this.handleOperationCallBack(data);
                })
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.isEditTitleShow = false;
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || '操作失败');
                }

            },

            // 分页条数切换
            handleSizeChange(val) {
                this.handleQueryInfo({
                    limit: val,
                    offset: 1
                }, true)
            },

            // 跳转页数切换
            handleCurrentChange(val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true)
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                    total_count: this.pageData.currentTotal
                }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'd_warehouse_stock_list',
                    value: JSON.stringify(this.queryData)
                });

                //判断是否勾选库龄字段
                const keys = Object.keys(data.title);
                if (keys.indexOf('library_age') !== -1) {
                    this.isCheckTitle = true;
                }else {
                    this.isCheckTitle = false;
                }

                //渲染数据
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data;
                });
                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                geOptionList().then(({ data }) => {
                    this.optionList.warehouseList = data.store;
                    this.optionList.productStateList = data.product_status;
                    this.optionList.devTypeList = data.develop_type;
                    this.optionList.productLineList = data.line_first;
                });
                this.handleQueryInfo();
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>

<style scoped lang="less">

    @color: #ff9900;

    .text-color {
        color:  @color;
    }

    .ui-layout_edit-dialog {
        .ui-check_box {
            .el-checkbox+.el-checkbox {
                margin-left: 0;
            }
            .el-checkbox {
                width: 150px;
                margin: 5px 30px 5px 0;
            }
            .el-checkbox__label {
                font-size: 12px;
            }
        }
    }

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0!important;;
    }

</style>
