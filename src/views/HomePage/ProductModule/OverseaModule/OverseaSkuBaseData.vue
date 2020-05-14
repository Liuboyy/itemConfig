<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="采购时间" v-model="queryData.purchasingTime" template="splitDate">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="SKU创建时间" v-model="queryData.createTime" template="splitDate" clearable>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="采购单状态">
                            <el-select size="small" v-model="queryData.purchasingStatus" filterable collapseTags multiple v-filter>
                                <el-option v-for="item in optionList.purchasingStatusList"
                                           :key="item.d_id"
                                           :value="item.d_id"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品状态">
                            <el-select size="small" v-model="queryData.productStatus" filterable collapseTags multiple v-filter>
                                <el-option v-for="item in optionList.productStatusList"
                                           :key="item.d_id"
                                           :value="item.d_id"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="是否新品">
                            <el-select size="small" v-model="queryData.isNew" clearable>
                                <el-option v-for="item in optionList.isNewList"
                                           :key="item.d_id"
                                           :value="item.d_id"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发类型">
                            <el-select size="small" v-model="queryData.devType" collapseTags multiple filterable v-filter>
                                <el-option v-for="item in optionList.devTypeList"
                                           :key="item.d_id"
                                           :value="item.d_id"
                                           :label="item.d_name"></el-option>
                            </el-select>
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
                        <SearchRequirement label="SKU">
                            <el-input size="small" placeholder="请输入" v-model="queryData.sku"></el-input>
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
                        <SearchRequirement label="所属大仓">
                            <el-select size="small" v-model="queryData.warehouse" filterable collapseTags multiple v-filter>
                                <el-option v-for="item in optionList.warehouseList"
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
                        <SearchRequirement label="海外仓物流类型">
                            <el-select size="small" v-model="queryData.logisticsType" collapseTags multiple filterable v-filter>
                                <el-option v-for="item in optionList.logisticsTypeList"
                                           :key="item.d_id"
                                           :value="item.d_id"
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
        <ComTableInfo
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="tableWidth"
                :showSearch="showSearch">
            <template slot="is_new" slot-scope="scope">
                <i class="ui-state_dot state_blue" v-if="scope.row.is_new === '是'"></i>
                <i class="ui-state_dot state_gray" v-if="scope.row.is_new === '否'"></i>
                <span>{{scope.row.is_new}}</span>
            </template>
            <!--采购单价-->
            <template slot="pur_price" slot-scope="scope">
                <span class="ui-com_money">{{scope.row.pur_price}}</span>
            </template>
            <!--采购金额-->
            <template slot="items_totalprice" slot-scope="scope">
                <span class="ui-com_money">{{scope.row.items_totalprice}}</span>
            </template>
            <!--财务付款金额-->
            <template slot="pay_price" slot-scope="scope">
                <span class="ui-com_money">{{scope.row.pay_price}}</span>
            </template>
            <template slot="is_new" slot-scope="scope">
                <i class="ui-state_dot state_blue" v-if="scope.row.is_new === '是'"></i>
                <i class="ui-state_dot state_gray" v-if="scope.row.is_new === '否'"></i>
                <span>{{scope.row.is_new}}</span>
            </template>
            <template slot="purchas_status" slot-scope="scope">
                <i v-if="scope.row.purchas_status_id == '1'" class="ui-state_dot state_orange"></i>
                <i v-if="scope.row.purchas_status_id == '2'||scope.row.purchas_status_id == '3'||scope.row.purchas_status_id == '5'||scope.row.purchas_status_id == '6'|| scope.row.purchas_status_id == '7'|| scope.row.purchas_status_id == '8'|| scope.row.purchas_status_id == '9'|| scope.row.purchas_status_id == '99'" class="ui-state_dot state_blue"></i>
                <i v-if="scope.row.purchas_status_id == '4'||scope.row.purchas_status_id == '10'" class="ui-state_dot state_gray"></i>
                <span>{{scope.row.purchas_status}}</span>
            </template>

            <template slot="product_status" slot-scope="scope">
                <i v-if="scope.row.product_status_id == '6'|| scope.row.product_status_id == '9'" class="ui-state_dot state_orange"></i>
                <i v-if="scope.row.product_status_id == '2'||scope.row.product_status_id == '3'||scope.row.product_status_id == '5'||scope.row.product_status_id == '6'|| scope.row.product_status_id == '14'|| scope.row.product_status_id == '12'|| scope.row.product_status_id == '11'|| scope.row.product_status_id == '10'|| scope.row.product_status_id == '8'|| scope.row.product_status_id == '4'|| scope.row.product_status_id == '3'|| scope.row.product_status_id == '2'|| scope.row.product_status_id == '1'|| scope.row.product_status_id == '18'|| scope.row.product_status_id == '17'|| scope.row.product_status_id == '16'|| scope.row.product_status_id == '15'|| scope.row.product_status_id == '21'|| scope.row.product_status_id == '20'|| scope.row.product_status_id == '19'|| scope.row.product_status_id == '27'|| scope.row.product_status_id == '22'|| scope.row.product_status_id == '30'|| scope.row.product_status_id == '29'|| scope.row.product_status_id == '28'" class="ui-state_dot state_blue"></i>
                <i v-if="scope.row.product_status_id == '5'||scope.row.product_status_id == '7'||scope.row.product_status_id == '100'" class="ui-state_dot state_gray"></i>
                <i v-if="scope.row.product_status_id == '0'" class="ui-state_dot state_red"></i>
                <span>{{scope.row.product_status}}</span>
            </template>

            <template slot="demand_create_time" slot-scope="scope">
                <el-popover
                        v-if="scope.row.demand_create_time && scope.row.demand_create_time.length > 21"
                        placement="top-start"
                        width="300"
                        trigger="hover">
                    <span>{{scope.row.demand_create_time}}</span>
                    <span slot="reference" v-html="scope.row.demand_create_time.length > 21 ? scope.row.demand_create_time.substring(0,21) + '...':scope.row.demand_create_time">{{scope.row.demand_create_time}}</span>
                </el-popover>
                <span v-else>{{scope.row.demand_create_time}}</span>
            </template>

            <template slot="demand_number" slot-scope="scope">
                <el-popover
                        v-if="scope.row.demand_number && scope.row.demand_number.length > 17"
                        placement="top-start"
                        width="300"
                        trigger="hover">
                    <span>{{scope.row.demand_number}}</span>
                    <span slot="reference" v-html="scope.row.demand_number.length > 17 ? scope.row.demand_number.substring(0,17) + '...':scope.row.demand_number">{{scope.row.demand_number}}</span>
                </el-popover>
                <span v-else>{{scope.row.demand_number}}</span>
            </template>

            <template slot="account_type" slot-scope="scope">
                <el-popover
                        v-if="scope.row.account_type && scope.row.account_type.length > 8"
                        placement="top-start"
                        width="300"
                        trigger="hover">
                    <span>{{scope.row.account_type}}</span>
                    <span slot="reference" v-html="scope.row.account_type.length > 8 ? scope.row.account_type.substring(0,8) + '...':scope.row.account_type">{{scope.row.account_type}}</span>
                </el-popover>
                <span v-else>{{scope.row.account_type}}</span>
            </template>

            <template slot="sku_name" slot-scope="scope">
                <el-popover
                        v-if="scope.row.sku_name && scope.row.sku_name.length > 62"
                        placement="top-start"
                        width="300"
                        trigger="hover">
                    <span>{{scope.row.sku_name}}</span>
                    <span slot="reference" v-html="scope.row.sku_name.length > 62 ? scope.row.sku_name.substring(0, 62) + '...':scope.row.sku_name">{{scope.row.sku_name}}</span>
                </el-popover>
                <span v-else>{{scope.row.sku_name}}</span>
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
    import config from '@/assets/js/config';
    import {
        autoAddTableInx
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";
    import {
        getOverseaSkuBaseDataInfo,
        getOptionList,
        getProductLineList,
    } from '@/api/product_module/oversea_sku_data';

    import {
        getPreDateRange,
        validTime
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'oversea_sku_data';

    export default {
        name: component_name,
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    purchasingTime: [],
                    createTime: [],
                    purchasingStatus: [],
                    productStatus: [],
                    isNew: '',
                    devType: [],
                    warehouse: [],
                    logisticsType: [],
                    settleWay: [],
                    developer: [],
                    sku: '',
                    productLineName: '',
                    productLineId: [],
                    productLineLevel: '',
                    productLineLevelId: '',
                },

                optionList: {
                    purchasingStatusList: [],
                    productStatusList: [],
                    isNewList: [],
                    devTypeList: [],
                    warehouseList: [],
                    logisticsTypeList: [],
                    settleWayList: [],
                    developerList: [],
                    productLineList: [],
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
            getOverseaSkuBaseDataInfo,
            getOptionList,
            getProductLineList,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['oversea_sku_data']);
                }
                if(!validTime(this.queryData.purchasingTime[0], this.queryData.purchasingTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }
                if(!validTime(this.queryData.createTime[0], this.queryData.createTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }
                if(this.queryData.createTime[0] && !this.queryData.createTime[1] ||
                    this.queryData.createTime[1] && !this.queryData.createTime[0]) {
                    this.$message.warning('SKU创建时间请选择查询区间！');
                    return;
                }
                let obj = {
                    purchase_time_start: this.queryData.purchasingTime[0],
                    purchase_time_end: this.queryData.purchasingTime[1],
                    sku_create_time_start: this.queryData.createTime && this.queryData.createTime[0],
                    sku_create_time_end: this.queryData.createTime && this.queryData.createTime[1],
                    purchase_status: this.queryData.purchasingStatus.join(','),
                    product_status: this.queryData.productStatus.join(','),
                    is_new: this.queryData.isNew,
                    state_type: this.queryData.devType.join(','),
                    big_warehouse_id: this.queryData.warehouse.join(','),
                    logistics_type: this.queryData.logisticsType.join(','),
                    account_type: this.queryData.settleWay.join(','),
                    develop_id: this.queryData.developer.join(','),
                    sku: this.queryData.sku,
                    product_line: this.queryData.productLineId.join(','),
                };

                obj = Object.assign(params || {}, obj);

                this.getOverseaSkuBaseDataInfo(obj).then(({ data }) => {
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
                this.queryData.purchasingStatus = [];
                this.queryData.productStatus = [];
                this.queryData.devType = [];
                this.queryData.warehouse = [];
                this.queryData.logisticsType = [];
                this.queryData.settleWay = [];
                this.queryData.developer = [];
                this.queryData.productLineId = [];
                this.queryData.defaultQueryKeys = [];
                this.queryData.isNew = '';
                this.queryData.sku = '';
                this.queryData.productLineName = '';
                this.queryData.productLineLevel = '';
                this.queryData.productLineLevelId = '';
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
                getPreDateRange().then((data) => {
                    this.queryData.purchasingTime = [data.start, data.end];
                });
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'oversea_sku_data',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...data.title];
                this.tableData = data.data;
                this.tableProps = ['index','is_new','sku','sku_name','product_onelevel_id','product_twolevel_id','product_threelevel_id','state_type','user_full_name','create_date','product_status','product_linelist_id','pur_price','pur_sum','items_totalprice','big_warehouse_id','logistics_type','demand_create_time','demand_number','pur_create_time','pur_number','purchas_status','account_type','js_rate','application_time','processing_time','payer_time','pay_price','arrive_transfer_time','arrive_transfer_sum','transfer_sent_time','transfer_sent_sum','arrive_overseas_time','arrive_overseas_sum'];
                this.tableWidth = this.tableProps.map(item => {
                    if(item === 'index'|| item === 'is_new'|| item === 'js_rate') return '70';
                    if(item === 'pur_price'|| item === 'pur_sum') return '80';
                    if(item === 'arrive_overseas_sum'|| item === 'transfer_sent_sum'|| item === 'arrive_transfer_sum'|| item === 'product_linelist_id'|| item === 'account_type') return '110';
                    if(item === 'pur_number'|| item === 'purchas_status'|| item === 'product_threelevel_id'|| item === 'user_full_name') return '120';
                    if(item === 'sku'|| item === 'create_date'|| item === 'pur_create_time'|| item === 'application_time'|| item === 'processing_time'|| item === 'payer_time'|| item === 'arrive_transfer_time'|| item === 'transfer_sent_time'|| item === 'arrive_overseas_time'|| item === 'logistics_type') return '140';
                    if(item === 'demand_number') return '160';
                    if(item === 'demand_create_time'|| item === 'demand_number') return '170';
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
                    this.optionList.purchasingStatusList = data.data.purchase_status_data;
                    this.optionList.productStatusList = data.data.product_status_data;
                    this.optionList.isNewList = data.data.is_new_data;
                    this.optionList.devTypeList = data.data.state_type_data;
                    this.optionList.warehouseList = data.data.big_warehouse_id;
                    this.optionList.logisticsTypeList = data.data.logistics_type_data;
                    this.optionList.settleWayList = data.data.account_type_data;
                    this.optionList.developerList = data.data.develop_id_data;
                });
                this.getProductLineList().then(({ data }) => {
                    this.optionList.productLineList = data.data.value;
                });
                getPreDateRange().then((data) => {
                    this.queryData.purchasingTime = [data.start, data.end];
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
