<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <!--<li>-->
                        <!--<SearchRequirement label="大仓">-->
                            <!--<el-select-->
                                    <!--filterable-->
                                    <!--v-model="queryData.big_warehouse_code"-->
                                    <!--placeholder="请选择"-->
                                    <!--size="small">-->
                                <!--<el-option-->
                                        <!--v-for="item in optionList.BigWarehouseList"-->
                                        <!--:key="item.warehouse_code"-->
                                        <!--:label="item.warehouse_name"-->
                                        <!--:value="item.warehouse_code">-->
                                <!--</el-option>-->
                            <!--</el-select>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <li class="ui-multiple_select">
                        <SearchRequirement label="仓库">
                            <el-select v-filter  filterable multiple collapseTags v-model="queryData.warehouse_code" placeholder="请选择" size="small">
                                <el-option
                                        v-for="item in optionList.warehouseCodeList"
                                        :key="item.warehouse_code"
                                        :label="item.warehouse_name"
                                        :value="item.warehouse_code">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="SKU">
                            <el-input size="small" v-model="queryData.sku" placeholder="请输入"></el-input>
                        </SearchRequirement>
                    </li>
                </ul>
                <div class="ui-filter-btn">
                    <el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>
                    <el-button size="small" type="primary" @click="handleQueryInfo()" icon="icon-chaxun" >查询</el-button>
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
                :showSearch="showSearch">
            <template slot="sku" slot-scope="scope">
                <el-button @click="handlePreviewSkuInfo(scope.row)" type="text" size="small" v-if="scope.row.sku === '全部SKU'">{{scope.row.sku}}</el-button>
                <span v-if="scope.row.sku !== '全部SKU'">{{scope.row.sku}}</span>
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

        <div class="ui-dialog">
            <ComDialogPreview
                    title="sku详情"
                    :visible.sync="isShowDetails"
                    :tableKey="skuTableKey"
                    :tableProps="skuTableProps"
                    :tableData="skuTableData"
                    :isCloseModal="false"
                    :isCloseEscape="false"
                    isPage
                    @dialogPageChange="handleSkuPageChange"
                    :dialogPageData="skuPageData"
                    @close="skuQuery.sku = ''">
                <template>
                    <div class="ui-search-area ui-dialog_search">
                        <ul class="ui-main-module-search clearFix">
                            <li>
                                <SearchRequirement label="SKU">
                                    <el-input size="small" v-model="skuQuery.sku" placeholder="请输入"></el-input>
                                </SearchRequirement>
                            </li>
                            <li class="ui-filter-btn ui-dialog_btn">
                                <el-button size="small" icon="icon-zhongzhi" @click="skuQuery.sku = ''">重置</el-button>
                                <el-button size="small" type="primary" icon="icon-chaxun" @click="handleSkuQueryInfo">查询</el-button>
                            </li>
                        </ul>
                    </div>
                </template>
            </ComDialogPreview>

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
        getStatiscalReportInfo,
    } from '@/api/warehouse_module/statistical_report';

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'statistical_report';

    export default {
        name: component_name,
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    warehouse_code: [],
//                    big_warehouse_code: '',
                    sku: '',
                },
                queryDetailData: {
                    sku: '',
                },
                optionList: {
                    warehouseCodeList: [],
                    BigWarehouseList: [],
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

                //查看sku详情
                skuQuery: {
                    sku: '',
                },
                isShowDetails: false,
                skuTableData: [],
                skuTableKey: [],
                skuTableProps: [],
                skuPageData: {
                    limit: 20,
                    offset: 1,
                    total: 0
                },

                warehouseCode: '',
            }

        },
        computed: {
            ...mapGetters([
                'loginInfo',
                'queryParamsInfo',
                'statisticalReport'
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'GetStatiscalReportInfo'
            ]),
            autoAddTableInx,
            getStatiscalReportInfo,



            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['statistical_report']);
                }

                let obj = {
                    ...params,
                    sku: this.queryData.sku,
                    warehouse_code: this.queryData.warehouse_code.join(',')
                };

                obj = Object.assign(params || {}, obj);

                this.GetStatiscalReportInfo(obj).then(({ data }) => {
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
                this.queryData.warehouse_code = [];
                this.queryData.sku = '';
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
                    isExcel: 1
                }, true)
            },


            //点击sku详情
            handlePreviewSkuInfo(row){
                this.isShowDetails = true;
                this.warehouseCode = row.warehouse_code;
                this.getStatiscalReportInfo({
                    warehouse_code: row.warehouse_code,
                }).then(({data}) => {
                    this.handleSkuQueryCallBack(data);
                }).catch(err => {
                    console.log(err);
                });

            },

            //弹框sku查询
            handleSkuQueryInfo(params = {}) {
                let obj = {
                    sku: this.skuQuery.sku,
                    warehouse_code: this.warehouseCode,
                    ...params
                };
                this.getStatiscalReportInfo(obj).then(({ data }) => {
                    this.handleSkuQueryCallBack(data);
                })
            },
            handleSkuQueryCallBack(data) {
                this.skuTableData = data.list.value;
                this.skuTableKey = ['序号', ...data.list.key];
                this.skuTableProps = ['index','warehouse_code','sku','available_qty','on_way_stock','update_date'];
                this.skuPageData.limit = data.list.page.limit * 1;
                this.skuPageData.offset = data.list.page.offset * 1;
                this.skuPageData.total = data.list.page.total * 1;
            },

            //弹框分页
            handleSkuPageChange({offset,limit}) {
                this.handleSkuQueryInfo({offset, limit})
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'statistical_report',
                    value: JSON.stringify(this.queryData)
                });
                this.optionList.warehouseCodeList = data.list.warehouse_list;
                //渲染数据
                this.tableKey = data.list.key;
                this.tableData = data.list.value;
                this.tableProps = ['warehouse_code','sku','available_qty','on_way_stock','update_date'];

                this.pageData.currentTotal = data.list.page.total * 1 ;
                this.pageData.currentList = data.list.page.limit * 1 ;
                this.pageData.currentPage = data.list.page.page * 1 ;

            }

        },
        created() {
            this.thisVm = this;
            try{
                if (JSON.stringify(this.statisticalReport) === '{}') {
                    this.handleQueryInfo();
                } else {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['statistical_report']);
                    this.handleQueryInfoCallBack(this.statisticalReport);
                }
            }catch (e) {
                console.log(e);
            }
        },
        mounted() {
            document.addEventListener('click', this.handleCloseTreeOption);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.handleCloseTreeOption);
        }
    }
</script>

<style scoped lang="less">

    /deep/.ui-dialog_search {
        border: 0!important;
        padding: 0 0 10px 0;
        .ui-search_label {
            width: 45px!important;
        }
        .ui-search_input {
            margin-left: 45px!important;
        }
    }
    .ui-dialog_btn {
        margin: 0 20px!important;
    }

    .ui-input__tree {
        .ui-base--area {
            max-height: 400px;
            overflow: auto;
            padding-bottom: 5px;
        }

        .ui-tree__btn {
            padding-left: 20px;
            border-top: 1px solid #e6e6e6;
        }
    }

    .el-checkbox + .el-checkbox {
        margin-left: 0!important;
    }
    .el-checkbox {
        width: 160px;
        margin-right: 20px;
        margin-bottom: 2px;
    }

    .el-select-dropdown__item {
        float: left!important;
        width: 160px;
    }


</style>
