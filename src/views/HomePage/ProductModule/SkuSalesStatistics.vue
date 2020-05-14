<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch && queryData.query_type !== '0'">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="销售时间" v-model="queryData.salesTime" template="splitDate">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="SKU创建时间" v-model="queryData.createTime" template="splitDate" clearable>
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
                        <SearchRequirement label="国家" >
                            <el-select size="small" v-model="queryData.country" filterable clearable v-filter>
                                <el-option
                                        v-for="item in optionList.countryList"
                                        :key="item.d_code"
                                        :value="item.d_code"
                                        :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="销售平台" >
                            <el-select size="small" v-model="queryData.platform" filterable clearable v-filter>
                                <el-option
                                        v-for="item in optionList.platformList"
                                        :key="item.d_code"
                                        :value="item.d_code"
                                        :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="SKU" >
                            <el-input size="small" placeholder="请输入" v-model="queryData.sku" :disabled="dialog.sku !== ''"></el-input>
                        </SearchRequirement>
                    </li>
                    <!--<li class="ui-search_more" @click="dialog.isSkuShow = true">SKU批量查询>></li>-->
                </ul>
                <FilterBtn refTable="tableArea" :query-fn="handleToggleTree" :reset-fn="handleResetQueryInfo"
                           :params="{type: 'all'}" ></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module" v-if="queryData.query_type !== '0'">
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
                <el-tab-pane label="SKU维度" name="sku" v-if="buttonList['sku'].permit(thisVm)"></el-tab-pane>
                <el-tab-pane label="产品线维度" name="product_line" v-if="buttonList['product_line'].permit(thisVm)"></el-tab-pane>
            </el-tabs>
        </div>
        <ComTableInfo
                v-if="queryData.query_type === 'sku'"
                :tableWidth="tableWidth"
                :showSearch="showSearch"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :otherHeight="['el-tabs__header']">
            <!--销售额CNY-->
            <!--<template slot="cny_sku_price" slot-scope="scope">-->
                <!--<span class="ui-com_money">{{scope.row.cny_sku_price}}</span>-->
            <!--</template>-->
            <!--销售额USD-->
            <!--<template slot="usd_sku_price" slot-scope="scope">-->
                <!--<span class="ui-com_money">{{scope.row.usd_sku_price}}</span>-->
            <!--</template>-->
        </ComTableInfo>


        <ComTreeTable :tableData="tableData" :tableKey="tableKey" :tableProps="tableProps" :showSearch="showSearch"
                      :otherHeight="['el-tabs__header']" :treeNode="{title: '产品线', field: 'linelist_cn_name', width: '400px'}"
                      @toggleTree="(v) => { handleToggleTree(v, 'click') }"
                      v-if="queryData.query_type === 'product_line'">
        </ComTreeTable>

        <div class="ui-main-module-page" v-if="queryData.query_type === 'sku'">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageData.currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pageData.currentList"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageData.currentTotal">
            </el-pagination>
        </div>

        <el-dialog
                top="5vh"
                width="1000px"
                title="SKU批量查询"
                class="ui-layout_edit-dialog"
                :visible.sync="dialog.isSkuShow"
                :close-on-click-modal=false
                :close-on-press-escape=false
                @close="handleCloseSkuSearch">
            <el-input type="textarea" :rows="30" v-model="dialog.sku" placeholder="SKU请分行区分  例如：
SKU001
SKU002"></el-input>
            <div slot="footer">
                <el-button size="small" @click="dialog.isSkuShow = false">取消</el-button>
                <el-button size="small" type="primary" @click="handleConfirmSkuSearch">确定</el-button>
            </div>
        </el-dialog>

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
        validTime
    } from '@/api/common/date_format'

    import {
        getProductLineCountInfo,
        getSkuSalesCountInfo,
        getOptionList,
        getProductLineList
    } from '@/api/product_module/sku_sales_statistics'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'sku_sales_statistics';

    export default {
        name: component_name,
        data () {
            return {

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                children: [],

                queryData: {
                    query_type: '',
                    salesTime: [],
                    createTime: [],
                    platform: '',
                    country: '',
                    sku: '',
                    productLineName: '',
                    productLineId: [],
                    productLineLevel: '',
                    productLineLevelId: '',
                },

                //保存默认日期
                saveDefaultDate: '',

                optionList: {
                    platformList: [],
                    productLineList: [],
                    countryList: [],
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

                //批量查询sku
                dialog: {
                    isSkuShow: false,
                    sku: ''
                }


            };
        },
        computed: {
            ...mapGetters([
                'queryParamsInfo',
                'arrearsCountReportsInfo'
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'GetArrearsCountReportInfo'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,
            getProductLineCountInfo,
            getSkuSalesCountInfo,
            getOptionList,
            getProductLineList,

            // 列表信息查询
            handleQueryInfo (params, isFn, item) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['sku_sales_statistics']);
                }

                if(this.queryData.query_type === '0') {
                    this.$message.warning('请联系管理员开通权限！');
                    return;
                }
                if(!validTime(this.queryData.salesTime[0], this.queryData.salesTime[1])) {
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
                    sale_time_start: this.queryData.salesTime[0] || '',
                    sale_time_end: this.queryData.salesTime[1] || '',
                    sku_create_time_start: this.queryData.createTime && this.queryData.createTime[0],
                    sku_create_time_end: this.queryData.createTime && this.queryData.createTime[1],
                    platform: this.queryData.platform,
                    country: this.queryData.country,
                    sku_code: this.queryData.sku,
                    product_line: this.queryData.productLineId.join(','),
                    product_level: this.queryData.productLineLevel,
                    product_level_id: this.queryData.productLineLevelId,
                    ...params,
                };
                let fnName = this.queryData.query_type === 'sku' ? this.getSkuSalesCountInfo : this.getProductLineCountInfo;

                fnName(obj).then(({data}) => {
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
                this.queryData.createTime = [];
                this.queryData.platform = '';
                this.queryData.country = '';
                this.queryData.sku = '';
                this.queryData.productLineName = '';
                this.queryData.productLineId = [];
                this.queryData.productLineLevel = '';
                this.queryData.productLineLevelId = '';
                this.defaultQueryKeys = [];
                this.dialog.sku = '';
                this.handleGetDateRange();
            },

            //展开树形表格
            handleToggleTree(row, type) {

                let productLevel = '';

                switch (row.level) {
                    case '1':
                        productLevel = 2;
                        break;
                    case '2':
                        productLevel = 3;
                        break;
                    case '3':
                        productLevel = 4;
                        break;
                    case '4':
                        productLevel = 5;
                        break;
                }

                if(row && type === 'click') {
                    this.queryData.productLineLevel = productLevel;
                    this.queryData.productLineLevelId = row.linelist_id;

                    this.handleQueryInfo({}, false, row);
                }else {

                    this.queryData.productLineLevel = 1;
                    this.queryData.productLineLevelId = '';

                    this.handleQueryInfo();
                }
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

            handleTabClick(tab) {
                this.queryData.query_type = tab.name;
                this.queryData.productLineLevel = '';
                this.queryData.productLineLevelId = '';
                this.tableKey = [];
                this.tableData = [];
                this.tableProps = [];
                this.handleQueryInfo();
            },


            //确定
            handleConfirmSkuSearch() {
                this.queryData.sku = this.handleReplace(this.dialog.sku);
                this.dialog.isSkuShow = false;
            },

            handleReplace(content) {
                let string = content;
                try{
                    string=string.replace(/\r\n/g," ");
                    string=string.replace(/\n/g," ");
                    string=string.replace(/\s/g," ");
                    string=string.replace(/，/g," ");
                }catch(e) {}

                return string;
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
                    is_excel: 1,
                    total_count: this.queryData.query_type === 'sku' ? this.pageData.currentTotal : ''
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

            //默认时间
            handleGetDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.salesTime = [data.end, data.end];
                });
            },

            //查询回调
            handleQueryInfoCallBack (data, item) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'sku_sales_statistics',
                    value: JSON.stringify(this.queryData)
                });

                if (this.queryData.query_type === 'sku') {

                    //数据渲染
                    const key = Object.values(data.title);
                    const props = Object.keys(data.title);
                    this.tableData.splice(0);
                    this.$nextTick().then(() => {
                        this.tableData = data.data;
                        this.tableKey = ['序号', ...key];
                        this.tableProps = ['index', ...props];
                        this.tableWidth = ['80', '180', '','180', '180', '180', '180', '180'];
                    });

                    //分页
                    this.pageData.currentList = data.page_data.limit * 1;
                    this.pageData.currentPage = data.page_data.offset * 1;
                    this.pageData.currentTotal = data.page_data.total * 1;

                }else {
                    if (item) {
                        if(item.end == 1) {
                            item.children.splice(0);
                            this.$nextTick().then(() => {
                                item.children = data.data;
                            });
                        }else {
                            item.children.splice(0);
                            this.$nextTick().then(() => {
                                item.children = data.data.map(item => {
                                    return {
                                        ...item,
                                        children: [{}],
                                    }
                                });
                            })
                        }
                    } else {

                        //数据渲染
                        this.tableKey = ['销量', '销售额USD', '销售额CNY'];
                        this.tableProps = ['sku_sale', 'usd_sku_price', 'cny_sku_price'];
                        this.tableData.splice(0);
                        this.$nextTick().then(() => {
                            this.tableData = data.data.map((item, index) => {
                                return {
                                    ...item,
                                    children: [{}],
                                }
                            });
                        })
                    }
                }
            },
        },
        created () {
            this.thisVm = this;
            try {

                this.getOptionList().then(({ data }) => {
                    this.optionList.platformList = data.platform_data;
                    this.optionList.countryList = data.country_data;
                });

                this.getProductLineList().then(({ data }) => {
                    this.optionList.productLineList = data.data.value;
                });

                const queryModule = ['product_line','sku'];
                for (let i = 0; i < queryModule.length; i++) {
                    if (this.buttonList[queryModule[i]].permit()) {
                        this.queryData.query_type = queryModule[i];
                    }
                }
                getPreDateRange().then((data) => {
                    this.queryData.salesTime = [data.end, data.end];
                    this.handleQueryInfo();
                });
            } catch (e) {
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

    .ui-search_more{
        font-size: 12px;
        color: #3388ff;
        margin-left: 15px;
        cursor: pointer;
    }

</style>
