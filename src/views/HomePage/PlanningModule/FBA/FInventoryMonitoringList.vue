<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="站点">
                            <el-select size="small" v-model="queryData.site" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.siteList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品状态">
                            <el-select size="small" v-model="queryData.productStatus" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.productStatusList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
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
                        <SearchRequirement label="开发类型">
                            <el-select size="small" v-model="queryData.developType" multiple collapseTags filterable v-filter>
                                <el-option v-for="item in optionList.devTypeList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发时间" v-model="queryData.createTime" template="daterange" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="SKU">
                            <el-input size="small" placeholder="请输入" v-model="queryData.sku"></el-input>
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
                        <SearchRequirement label="在途数量">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.on_the_way_min"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.on_the_way_high" ></el-input>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="可用库存">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.in_store_min"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.in_store_high" ></el-input>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="30天销量">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.lately_sale_min"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.lately_sale_high" ></el-input>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="在库预售天数">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.stock_sale_min"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.stock_sale_high" ></el-input>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="总库存预售天数">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.total_stock_sale_min"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.total_stock_sale_high" ></el-input>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="是否断货">
                            <el-select size="small" v-model="queryData.sold_out" clearable>
                                <el-option v-for="item in optionList.isBrokenList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="断货影响">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.outstock_yx_min"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.outstock_yx_high" ></el-input>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="断货天数">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.outstock_day_min"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.outstock_day_high" ></el-input>
                                </el-col>
                            </el-row>
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
        <div class="ui-tabs_box">
            <el-tabs v-model="queryData.query_type" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="金额统计" name="1"></el-tab-pane>
                <el-tab-pane label="计量统计" name="2"></el-tab-pane>
            </el-tabs>
        </div>
        <ComTableInfo
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableMinWidth="tableMinWidth"
                :showSearch="showSearch"
                :otherHeight="['el-tabs__header']">
            <template slot="is_outstock" slot-scope="scope">
                <i class="ui-state_dot state_blue" v-if="scope.row.is_outstock === '是'"></i>
                <i class="ui-state_dot state_gray" v-if="scope.row.is_outstock === '否'"></i>
                <span>{{scope.row.is_outstock}}</span>
            </template>
            <template slot="stockage90_price" slot-scope="scope">
                <div class="text-color">{{scope.row.stockage90_price}}</div>
                <div>{{scope.row.stockage90_price_rate + '%'}}</div>
            </template>
            <template slot="stockage180_price" slot-scope="scope">
                <div class="text-color">{{scope.row.stockage180_price}}</div>
                <div>{{scope.row.stockage180_price_rate + '%'}}</div>
            </template>
            <template slot="stockage270_price" slot-scope="scope">
                <div class="text-color">{{scope.row.stockage270_price}}</div>
                <div>{{scope.row.stockage270_price_rate + '%'}}</div>
            </template>
            <template slot="stockage365_price" slot-scope="scope">
                <div class="text-color">{{scope.row.stockage365_price}}</div>
                <div>{{scope.row.stockage365_price_rate + '%'}}</div>
            </template>
            <template slot="stockagedy365_price" slot-scope="scope">
                <div class="text-color">{{scope.row.stockagedy365_price}}</div>
                <div>{{scope.row.stockagedy365_price_rate + '%'}}</div>
            </template>

            <template slot="stockage90_stock" slot-scope="scope">
                <div class="text-color">{{scope.row.stockage90_stock}}</div>
                <div>{{scope.row.stockage90_stock_rate + '%'}}</div>
            </template>
            <template slot="stockage180_stock" slot-scope="scope">
                <div class="text-color">{{scope.row.stockage180_stock}}</div>
                <div>{{scope.row.stockage180_stock_rate + '%'}}</div>
            </template>
            <template slot="stockage270_stock" slot-scope="scope">
                <div class="text-color">{{scope.row.stockage270_stock}}</div>
                <div>{{scope.row.stockage270_stock_rate + '%'}}</div>
            </template>
            <template slot="stockage365_stock" slot-scope="scope">
                <div class="text-color">{{scope.row.stockage365_stock}}</div>
                <div>{{scope.row.stockage365_stock_rate + '%'}}</div>
            </template>
            <template slot="stockagedy365_stock" slot-scope="scope">
                <div class="text-color">{{scope.row.stockagedy365_stock}}</div>
                <div>{{scope.row.stockagedy365_stock_rate + '%'}}</div>
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
                width="800px"
                class="ui-layout_edit-dialog"
                :visible.sync="isEditTitleShow"
                @close="handleCloseEditTitleInfo">
            <div class="ui-check_box">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="checkTitle" @change="handleCheckedTitleChange">
                    <el-checkbox v-for="(item, value) in allTitleList"
                                 :key="value"
                                 :label="value"
                                 :disabled="value === 'sale_section'|| value === 'state_type'|| value === 'linelist_cn_name'
                                 || value === 'warehouse_name'|| value === 'on_way_stock' || value === 'on_way_money'
                                 || value === 'available_qty'|| value === 'available_money'||value === 'stock_qty'
                                 || value === 'stock_money'|| value === '30_sale_sum'|| value === '30_sale_money'">{{item}}</el-checkbox>
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
        getFbaInventoryControlMeterInfo,
        getFbaInventoryControlAmountInfo,
        getSiteList,
        getProductStatusList,
        getProductLineList,
        getDevTyoeList
    } from '@/api/planning_module/f_inventory_control_list';

    import {
        getPreDateRange,
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'f_inventory_control_list';

    export default {
        name: component_name,
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    query_type: '1',
                    productLineName: '',
                    productLineId: [],
                    productStatus: [],
                    developType: [],
                    createTime: [],
                    site: [],
                    sku: '',
                    procurement_cost_min: '',
                    procurement_cost_high: '',
                    on_the_way_min: '',
                    on_the_way_high: '',
                    in_store_min: '',
                    in_store_high: '',
                    outstock_day_min: '',
                    outstock_day_high: '',
                    lately_sale_min: '',
                    lately_sale_high: '',
                    stock_sale_min: '',
                    stock_sale_high: '',
                    total_stock_sale_min: '',
                    total_stock_sale_high: '',
                    sold_out: '',
                    outstock_yx_min: '',
                    outstock_yx_high: '',
                },

                optionList: {
                    siteList: [],
                    productStatusList: [],
                    productLineList: [],
                    devTypeList: [],
                    isBrokenList: [
                        {value: '0', label: '否'},
                        {value: '1', label: '是'},
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

                saveDefaultDate: [],

                //编辑显示数据
                isEditTitleShow: false,
                isIndeterminate: true,
                checkAll: false,
                checkTitle: ['sale_section','state_type','linelist_cn_name','warehouse_name','on_way_stock','stock_qty','on_way_money','available_qty','available_money','stock_money','30_sale_sum','30_sale_money'],
                allTitleList: [],
                saveTitleType: '',


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
            getFbaInventoryControlMeterInfo,
            getFbaInventoryControlAmountInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['f_inventory_control_list']);
                }

                let reg = /^\d+(\.\d+)?$/;
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
                if(this.queryData.in_store_min) {
                    if(!reg.test(this.queryData.in_store_min)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.in_store_high) {
                    if(!reg.test(this.queryData.in_store_high)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.outstock_day_min) {
                    if(!reg.test(this.queryData.outstock_day_min)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.outstock_day_high) {
                    if(!reg.test(this.queryData.outstock_day_high)) {
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
                if(this.queryData.stock_sale_min) {
                    if(!reg.test(this.queryData.stock_sale_min)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.stock_sale_high) {
                    if(!reg.test(this.queryData.stock_sale_high)) {
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
                if(this.queryData.outstock_yx_min) {
                    if(!reg.test(this.queryData.outstock_yx_min)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.outstock_yx_high) {
                    if(!reg.test(this.queryData.outstock_yx_high)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }

                let obj = {
                    ...params,
                    sku: this.queryData.sku,
                    sold_out: this.queryData.sold_out,
                    procurement_cost_min: this.queryData.procurement_cost_min,
                    procurement_cost_high: this.queryData.procurement_cost_high,
                    on_the_way_min: this.queryData.on_the_way_min,
                    on_the_way_high: this.queryData.on_the_way_high,
                    in_store_min: this.queryData.in_store_min,
                    in_store_high: this.queryData.in_store_high,
                    outstock_day_min: this.queryData.outstock_day_min,
                    outstock_day_high: this.queryData.outstock_day_high,
                    lately_sale_min: this.queryData.lately_sale_min,
                    lately_sale_high: this.queryData.lately_sale_high,
                    stock_sale_min: this.queryData.stock_sale_min,
                    stock_sale_high: this.queryData.stock_sale_high,
                    total_stock_sale_min: this.queryData.total_stock_sale_min,
                    total_stock_sale_high: this.queryData.total_stock_sale_high,
                    outstock_yx_min: this.queryData.outstock_yx_min,
                    outstock_yx_high: this.queryData.outstock_yx_high,
                    product_status: this.queryData.productStatus.join(','),
                    product_line: this.queryData.productLineId.join(','),
                    develop_type: this.queryData.developType.join(','),
                    site: this.queryData.site.join(','),
                    develop_time_start: this.queryData.createTime && this.queryData.createTime[0],
                    develop_time_end: this.queryData.createTime && this.queryData.createTime[1],
                };

                obj = Object.assign(params || {}, obj);

                let fnName = this.queryData.query_type === '1' ?  this.getFbaInventoryControlAmountInfo : this.getFbaInventoryControlMeterInfo;

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
                this.queryData = {
                    query_type: this.queryData.query_type,
                    productLineName: '',
                    productLineId: [],
                    productStatus: [],
                    developType: [],
                    createTime: [],
                    site: [],
                    sku: '',
                    procurement_cost_min: '',
                    procurement_cost_high: '',
                    on_the_way_min: '',
                    on_the_way_high: '',
                    in_store_min: '',
                    in_store_high: '',
                    outstock_day_min: '',
                    outstock_day_high: '',
                    lately_sale_min: '',
                    lately_sale_high: '',
                    stock_sale_min: '',
                    stock_sale_high: '',
                    total_stock_sale_min: '',
                    total_stock_sale_high: '',
                    sold_out: '',
                    outstock_yx_min: '',
                    outstock_yx_high: '',
                };
            },

            handleTabClick(tab) {
                this.queryData.query_type = tab.name;
                this.handleQueryInfo();
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

            //编辑显示数据
            handleEditTitleInfo() {
                let fnName = '';
                switch (this.queryData.query_type) {
                    case '1':
                        fnName = this.getAllTitleSalesList;
                        this.saveTitleType = '1';
                        break;
                    case '2':
                        fnName = this.getAllTitleDevList;
                        this.saveTitleType = '2';
                        break;
                    case '3':
                        fnName = this.getAllTitleProductLineList;
                        this.saveTitleType = '3';
                        break;

                }
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
                this.checkTitle = val ? arr : ['sale_section','state_type','linelist_cn_name','warehouse_name','on_way_stock','stock_qty','on_way_money','available_qty','available_money','stock_money','30_sale_sum','30_sale_money'];
            },

            //单选
            handleCheckedTitleChange(val) {
                this.checkAll = val.length === Object.keys(this.allTitleList).length;
                this.isIndeterminate = val.length > 0 && val.length < Object.keys(this.allTitleList).length;
            },
            //取消 编辑显示数据
            handleCloseEditTitleInfo() {
                this.checkTitle = ['sale_section','state_type','linelist_cn_name','warehouse_name','on_way_stock','stock_qty','on_way_money','available_qty','available_money','stock_money','30_sale_sum','30_sale_money'];
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
                this.getConfirmEditTitleInfo({
                    select: this.checkTitle.join(','),
                    type_title: this.saveTitleType,
                }).then(({ data }) => {
                    this.handleOperationCallBack(data);
                })
            },

            //获取所有下拉数据
            handleOptionList() {
                getSiteList().then(({ data }) => {
                    this.optionList.siteList = data.data;
                });
                getProductStatusList().then(({ data }) => {
                    this.optionList.productStatusList = data.data;
                });
                getProductLineList().then(({ data }) => {
                    this.optionList.productLineList = data.data.value;
                });
                getDevTyoeList().then(({ data }) => {
                    this.optionList.devTypeList = data.data;
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
                    key: 'f_inventory_control_list',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...Object.values(data.title)];
                this.tableProps = ['index', ...Object.keys(data.title)];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data;
                });
                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'index'|| item === 'is_outstock') return '70';
                    if(item === 'stockage90_price'|| item === 'stockage90_stock'|| item === 'stockagedy365_price'|| item === 'stockagedy365_stock') return '90';
                    if(item === '30_sale_money'|| item === '30_sale_sum') return '110';
                    if(item === 'sku'|| item === 'fnsku'|| item === 'asin'|| item === 'account_name'|| item === 'poweravg_cost'|| item === 'on_way_money'|| item === 'available_money'|| item === 'on_way_stock'|| item === 'available_qty') return '120';
                    if(item === 'available_sale_day'|| item === 'stock_sale_day'|| item === 'stockage180_price'|| item === 'stockage180_stock') return '130';
                    if(item === 'stockage270_price'|| item === 'stockage365_price'|| item === 'stockage270_stock'|| item === 'stockage365_stock') return '140';
                    if(item === 'seller_sku') return '200';
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
                this.handleOptionList();
                this.handleQueryInfo();
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

    @color: #ff9900;

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0!important;;
    }

    .text-color {
        color:  @color;
    }

    .ui-layout_edit-dialog {
        .ui-check_box {
            .el-checkbox+.el-checkbox {
                margin-left: 0;
            }
            .el-checkbox {
                width: 200px;
                margin: 5px 30px 5px 0;
            }
            .el-checkbox__label {
                font-size: 12px;
            }
        }
    }

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
