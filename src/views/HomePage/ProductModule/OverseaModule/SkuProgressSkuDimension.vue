<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="SKU创建时间" v-model="queryData.createTime" template="splitDate">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品线" >
                            <el-popover
                                    ref="popover"
                                    width="300"
                                    placement="bottom-start"
                                    trigger="manual"
                                    v-model="popover.productLine"
                                    :visible-arrow="false"
                                    @show="handleInTreeData">
                                <div class="ui-input__tree">
                                    <div class="ui-base--area">
                                        <el-input size="small" placeholder="输入关键字进行搜索" v-model="productLineFilter"></el-input>
                                        <el-tree
                                                ref="treeEditor"
                                                node-key="id"
                                                show-checkbox
                                                :data="optionList.productLineList"
                                                :props="defaultProps"
                                                :default-expanded-keys="defaultQueryKeys"
                                                :filter-node-method="productLineFilterNode">
                                        </el-tree>
                                    </div>
                                    <div class="ui-tree__btn">
                                        <el-button type="text" @click="popover.productLine = false">关闭</el-button>
                                        <el-button type="text" @click="handleTreeCheckInfo()">确定</el-button>
                                    </div>
                                </div>
                            </el-popover>
                            <el-input class="ui-popover__input" readonly size="small" v-popover:popover v-model="queryData.productLineName"
                                      @focus="popover.productLine = true"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品类型">
                            <el-select size="small" v-model="queryData.productType" filterable v-filter clearable>
                                <el-option v-for="item in optionList.productTypeList"
                                           :key="item.d_id"
                                           :value="item.d_id"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="采购来源">
                            <el-select size="small" v-model="queryData.purchaseSource" filterable v-filter clearable>
                                <el-option v-for="item in optionList.purchaseSourceList"
                                           :key="item.d_id"
                                           :value="item.d_id"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="结算方式">
                            <el-select size="small" v-model="queryData.settleWay" filterable collapseTags multiple v-filter>
                                <el-option v-for="item in optionList.settleWayList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="SKU">
                            <el-input size="small" placeholder="请输入" v-model="queryData.sku"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发员">
                            <el-select size="small" v-model="queryData.developer" filterable collapseTags multiple v-filter>
                                <el-option v-for="item in optionList.developerList"
                                           :key="item.d_id"
                                           :value="item.d_id"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="采购单状态">
                            <el-select size="small" v-model="queryData.purchaseStatus" filterable collapseTags multiple v-filter>
                                <el-option v-for="item in optionList.purchaseStatusList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="付款状态">
                            <el-select size="small" v-model="queryData.payStatus" filterable collapseTags multiple v-filter>
                                <el-option v-for="item in optionList.payStatusList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="采购仓库">
                            <el-select size="small" v-model="queryData.purchaseWarehouse" filterable collapseTags multiple v-filter>
                                <el-option v-for="item in optionList.purchaseWarehouseList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :params="{}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
                <!--<div class="ui-filter-btn">-->
                <!--<el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>-->
                <!--<el-button size="small" type="primary" @click="handleQueryInfo()" icon="icon-chaxun" >查询</el-button>-->
                <!--</div>-->
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

        <SkuDimension :tableData="tableData" :showSearch="showSearch"></SkuDimension>

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
    import config from '@/assets/js/config';
    import {
        autoAddTableInx
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";
    import {
        getSkuProgressSkuDimensionInfo,
        getOptionList,
        getProductLineList,
    } from '@/api/product_module/sku_progress_sku';

    import {
        getPreDateRange,
        getCurrentDateRange,
        validTime
    } from '@/api/common/date_format'

    import SkuDimension from './Components/SkuDimension.vue'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'sku_progress_sku';

    export default {
        name: component_name,
        components: {SkuDimension},
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    createTime: [],
                    sku: '',
                    productType: '',
                    purchaseSource: '',
                    productLineName: '',
                    productLineId: [],
                    developer: [],
                    settleWay: [],
                    purchaseStatus: [],
                    payStatus: [],
                    purchaseWarehouse: [],
                },

                optionList: {
                    productTypeList: [],
                    purchaseSourceList: [],
                    productLineList: [],
                    settleWayList: [],
                    purchaseStatusList: [],
                    purchaseWarehouseList: [],
                    payStatusList: [],
                    developerList: [],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableWidth:[],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                saveDefaultDate: [],

                //产品线弹框
                popover: {
                    productLine: false,
                },
                defaultProps: {
                    children: 'child',
                    label: 'name'
                },
                defaultQueryKeys: [],
                //tree搜索关键字
                productLineFilter: '',
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
            getSkuProgressSkuDimensionInfo,
            getOptionList,
            getProductLineList,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['sku_progress_sku']);
                }
                if(!validTime(this.queryData.createTime[0], this.queryData.createTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }
                let obj = {
                    create_date_start: this.queryData.createTime && this.queryData.createTime[0],
                    create_date_end: this.queryData.createTime && this.queryData.createTime[1],
                    sku: this.queryData.sku,
                    product_type: this.queryData.productType,
                    source_data: this.queryData.purchaseSource,
                    warehouse_code: this.queryData.purchaseWarehouse.join(','),
                    state_type_id: this.queryData.settleWay.join(','),
                    purchase_status: this.queryData.purchaseStatus.join(','),
                    develop_user: this.queryData.developer.join(','),
                    pay_status: this.queryData.payStatus.join(','),
                    product_line: this.queryData.productLineId.join(','),
                };

                obj = Object.assign(params || {}, obj);

                this.getSkuProgressSkuDimensionInfo(obj).then(({ data }) => {
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
                this.queryData.sku = '';
                this.queryData.productType = '';
                this.queryData.purchaseSource = '';
                this.queryData.productLineName = '';
                this.queryData.productLineId = [];
                this.queryData.developer = [];
                this.queryData.settleWay = [];
                this.queryData.payStatus = [];
                this.queryData.purchaseStatus = [];
                this.queryData.purchaseWarehouse = [];
                this.handleGetDateRange();
            },

            //带入tree数据
            handleInTreeData() {
                this.$nextTick(() => {
                    const checkIds = this.queryData.productLineId;
                    this.$refs.treeEditor.setCheckedKeys(checkIds);
                });
            },

            //树形保存
            handleTreeCheckInfo() {
                const [labels, ids] = [[], []];
                this.$refs.treeEditor.getCheckedNodes().forEach(item => {
                    if(!item.leaf) return;
                    labels.push(item.name);
                    ids.push(item.id);
                });
                this.queryData.productLineName = labels.join(',');
                this.queryData.productLineId = ids;
                this.defaultQueryKeys = ids;
                this.popover.productLine = false;
            },

            //小组关键字搜索
            productLineFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            // 关闭树形下拉
            handleCloseTreeOption(event) {
                try {
                    if (event.path.some(_e => _e.className && _e.className.indexOf && _e.className.indexOf('ui-popover__input') > -1)) return;
                } catch (e) {
                    console.log(e);
                }
                this.popover.productLine = false;
                this.productLineFilter = '';
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
//                    total: this.pageData.currentTotal
                }, true)
            },

            //默认时间
            handleGetDateRange() {
                getCurrentDateRange().then((data) => {
                    this.queryData.createTime = [data.start, data.end];
                });
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'sku_progress_sku',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...Object.values(data.title)];
                this.tableProps = ['index', ...Object.keys(data.title)];
                this.tableData = data.data;
                this.tableWidth = this.tableProps.map(item => {
                    if(item === 'index'|| item === 'product_type'|| item === 'pur_sum'|| item === 'pur_source') return '70';
                    if(item === 'buyer'|| item === 'js_rate'|| item === 'items_totalprice') return '80';
                    if(item === 'arrive_overseas_sum'|| item === 'transfer_sent_sum'|| item === 'arrive_transfer_sum'|| item === 'product_threelevel_id'|| item === 'product_linelist_id'|| item === 'account_type') return '110';
                    if(item === 'developer'|| item === 'pur_number'|| item === 'purchas_status') return '120';
                    if(item === 'sku'|| item === 'create_date'|| item === 'pur_create_time'|| item === 'application_time'|| item === 'processing_time'|| item === 'payer_time'|| item === 'arrive_transfer_time'|| item === 'transfer_sent_time'|| item === 'arrive_overseas_time'|| item === 'logistics_type'|| item === 'warehouse_id') return '140';
                    if(item === 'demand_number') return '160';
                    if(item === 'demand_create_time') return '170';
                    if(item === 'sku_name') return '300';
                    return '100';
                });

                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                this.getOptionList().then(({ data }) => {
                    this.optionList.productTypeList = data.data.product_type_data;
                    this.optionList.purchaseSourceList = data.data.source_data;
                    this.optionList.purchaseStatusList = data.data.purchase_status_data;
                    this.optionList.settleWayList = data.data.state_type_id;
                    this.optionList.purchaseWarehouseList = data.data.warehouse_code_data;
                    this.optionList.payStatusList = data.data.pay_status_data;
                    this.optionList.developerList = data.data.develop_id_data;
                });
                this.getProductLineList().then(({ data }) => {
                    this.optionList.productLineList = data.data.value;
                });
                getCurrentDateRange().then((data) => {
                    this.queryData.createTime = [data.start, data.end];
                    this.handleQueryInfo();
                });
            }catch (e) {
                console.log(e);
            }
        },
        mounted() {
            document.addEventListener('click', this.handleCloseTreeOption);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.handleCloseTreeOption);
        },
        watch: {
            "productLineFilter"(val) {
                this.$refs.treeEditor.filter(val);
            },
        }
    }
</script>

<style scoped lang="less">

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

</style>
