<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="站点">
                            <el-select size="small" clearable v-model="queryData.site" filterable v-filter>
                                <el-option
                                        v-for="item in optionList.siteList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="账号">
                            <el-select size="small" clearable v-model="queryData.account" filterable collapseTags multiple v-filter>
                                <el-option
                                        v-for="item in optionList.accountList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="SKU">
                            <el-input size="small" v-model.trim="queryData.sku"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="Seller SKU">
                            <el-input size="small" v-model.trim="queryData.sellerSku"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="SKU类目">
                            <el-select v-filter size="small" clearable v-model="queryData.skuLine">
                                <el-option
                                        v-for="item in optionList.skuLineList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="myTable" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon
                    :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <!--<el-button-->
            <!--v-if="item.method && item.permit(thisVm) && item.icon"-->
            <!--v-for="item in buttonList"-->
            <!--size="small"-->
            <!--:type="item.type"-->
            <!--:key="item.value"-->
            <!--:icon="item.icon"-->
            <!--@click="item.action(thisVm, item.method)">{{item.name}}</el-button>-->
        </div>

        <div class="ui-tabs_box">
            <el-tabs v-model="queryData.moduleType" type="card" @tab-click="handleToggleTableInfo">
                <el-tab-pane label="lazada" name="lazada"></el-tab-pane>
                <el-tab-pane label="shopee" name="shopee"></el-tab-pane>
                <el-tab-pane label="jumia" name="jumia"></el-tab-pane>
            </el-tabs>
        </div>

        <SoutheastAsiaTable ref="myTable" :tableData="tableData" :showSearch="showSearch" :otherHeight="['el-tabs__header']"></SoutheastAsiaTable>
        <!--<div class="ui-main-module-table">-->
            <!--<ComTableInfo ref="myTable" :showSearch="showSearch" :otherHeight="['ui-main-tab-box']"-->
                          <!--:tableData="tableData" :tableKey="tableKey" :tableProps="tableProps" :tableWidth="tableWidth">-->
                <!--<div class="ui-main-tab">-->
                    <!--<el-badge-->
                            <!--v-for="(item, index) in optionList.moduleTypeList"-->
                            <!--:key="index">-->
                        <!--<li class="ui-main-tab-box">-->
                        <!--<span @click="handleToggleTableInfo(item.value)"-->
                              <!--:class="queryData.moduleType === item.value && 'ui-active'">{{item.label}}<i-->
                                <!--class="ui-tab_line"></i></span>-->
                        <!--</li>-->
                    <!--</el-badge>-->
                <!--</div>-->
                <!--<template slot="operation" slot-scope="scope">-->
                    <!--<el-button type="text" size="small" @click="handleLookDetail">查看</el-button>-->
                <!--</template>-->
            <!--</ComTableInfo>-->
        <!--</div>-->
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
        <!--<el-dialog-->
                <!--class="ui-layout_edit-dialog"-->
                <!--custom-class="ui-com_edit"-->
                <!--top="5vh"-->
                <!--:visible.sync="showDetail" title="销量/利润下滑预警"></el-dialog>-->
        <el-dialog
                class="ui-layout_edit-dialog"
                custom-class="ui-com_edit"
                top="5vh"
                width="500px"
                @close="handleCloseTip"
                :visible.sync="tipDialogShow" title="销量/利润下滑预警">
            <ComTableInfo :tableKey="['账号', 'Seller SKU', '比前三周最好下滑']"
                          :tableProps="['account_name', 'seller_sku', 'growth_rate']"
                          :tableData="tipDialogData"></ComTableInfo>
            <div class="ui-com_edit--btn" slot="footer">
                <el-button type="primary" size="small" @click="handleExportInfo">导出详情</el-button>
                <el-button size="small" @click="tipDialogShow = false">关闭</el-button>
                <el-checkbox v-model="isNotTip">今天不再提示</el-checkbox>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        getLocalStorage,
        setLocalStorage
    } from '@/utils/storage';
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
        getSoutheastAsiaList,
        getOptionInfo,
        getDetailInfo,
        getTipDialogInfo,
    } from '@/api/sales_module/southeast_asia_list';

    import {
        getCurrentDateRange,
        getPreDateRange,
        getLastMonthStartDate,
        getLastMonthEndDate,
        getSixMonthRange
    } from '@/api/common/date_format'

    import SoutheastAsiaTable from './ACRTable/SoutheastAsiaTable.vue'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'southeast_asia_list';

    export default {
        name: component_name,
        components: {SoutheastAsiaTable},
        data () {
            return {

                // 时间搜索框宽度设置
                searchDateWidth: config.SEARCH_DATE_WIDTH,

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    moduleType: 'lazada',
                    site: '',
                    account: [],
                    sku: '',
                    sellerSku: '',
                    skuLine: '',
                },
                saveDefaultTime: [],
                saveDefaultMonth: [],

                optionList: {
                    skuLineList: [],
                    accountList: [],
                    siteList: [],
                    moduleTypeList: [
                        {
                            label: 'lazada',
                            value: 'lazada'
                        },
                        {
                            label: 'shopee',
                            value: 'shopee',
                        },
                        {
                            label: 'jumia',
                            value: 'jumia',
                        }
                    ]
                },

                tableData: [],
                tableKey: ['序号', '账号', 'SKU', 'Seller SKU', '售价（当前/每周平均）', '利润率（当前/每周）', '销量（总/每周）', '销售额（总/每周）', '利润（总/每周）', 'SKU类目', '状态', '库存', '修改日志'],
                allTableKey: [],
                tableProps: ['index'],
                tableWidth: [],
                tableHeight: '100px',

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                },

                tableLoading: false,

                showDetail: false,

                tipDialogShow: false,
                tipDialogData: [],
                isNotTip: false,
            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'saleDataReportInfo',
                'loginInfo',
            ])
        },
        methods: {
            ...mapActions([
                'GetSalesDataReportInfo'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['southeast_asia_list']);
                }

                let obj = {
                    ...params,
                    type: this.queryData.moduleType,
                    site: this.queryData.site,
                    account_id: this.queryData.account.join(','),
                    sku: this.queryData.sku,
                    seller_sku: this.queryData.sellerSku,
                    one_linelist_id: this.queryData.skuLine,
                    // sortId: this.tableData[this.tableData.length - 1] ? this.tableData[this.tableData.length - 1].gid : '',
                };

                this.tableLoading = true;
                getSoutheastAsiaList(obj).then(({data}) => {
                    if(data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.error || '查询失败！');
                        this.tableLoading = false;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData = {
                    ...this.queryData,
                    site: '',
                    account: [],
                    sku: '',
                    sellerSku: '',
                    skuLine: '',
                }
            },

            // 表格切换
            handleToggleTableInfo(val) {
                this.queryData.moduleType = val.name;
                getOptionInfo({
                    type: val.name
                }).then(({ data }) => {
                    if (data.status) {
                        this.optionList.accountList = data.categor_dict.account_list;
                        this.optionList.skuLineList = data.categor_dict.line_list;
                        this.optionList.siteList = data.categor_dict.site_list;
                        this.handleQueryInfo();
                    }
                })
            },

            // 分页条数切换
            handleSizeChange(val) {
                this.handleQueryInfo({
                    page: 1,
                    size: val
                }, true)
            },

            // 跳转页数切换
            handleCurrentChange(val) {
                this.handleQueryInfo({
                    page: val,
                    size: this.pageData.currentList
                }, true)
            },

            //导出
            handleExportInfo() {
                let str = ''
                window.open(`${config.BI_PATH}/yibai/zhiku/listing/southeast_asia_4listing/list2/down/?type=${this.queryData.moduleType}`, '_self')
                // this.handleQueryInfo({
                //     isExcel: 1
                // }, true)
            },

            // 点击查看
            handleLookDetail(item) {
                // this.
                // getDetailInfo

                this.showDetail = true;
            },

            // 关闭提示弹框
            handleCloseTip() {
                if (this.isNotTip) {
                    let setDate = getLocalStorage('set_tip_date');
                    let _thisDate = new Date();
                    let _thisDay = `${this.loginInfo.uid}_${(_thisDate.getMonth()+1)}_${_thisDate.getDate()}`;
                    if (!setDate || setDate != _thisDay) {
                        setLocalStorage('set_tip_date', _thisDay);
                    }
                }
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

            //查询回调
            handleQueryInfoCallBack(data) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'southeast_asia_list',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                // this.allTableKey = {...data.data.title};
                this.tableKey = ['序号', ...data.title];
                this.tableProps = ['index', 'account_name', 'sku', 'seller_sku','current_price','avg_price', 'profit_rate','avg_profit_rate', 'total_sku_sale', 'week_sku_sale', 'total_cny_price', 'week_cny_price', 'total_profit', 'week_profit', 'product_onelevel_name', 'data_status', 'quantity','modify_log'];
                this.tableWidth = ['60', '100', '100', '140','current_price','avg_price', 'profit_rate','avg_profit_rate', 'total_sku_sale', 'week_sku_sale', 'total_cny_price', 'week_cny_price', 'total_profit', 'week_profit', 'product_onelevel_name', 'data_status', 'quantity','modify_log'];
                this.tableData = data.data_table;

                this.pageData.currentList = data.page_data.limit;
                this.pageData.currentTotal = data.page_data.total;
                this.pageData.currentPage = data.page_data.offset;
            }
        },
        created () {
            this.thisVm = this;
            try {
                getOptionInfo({
                    type: this.queryData.moduleType
                }).then(({ data }) => {
                    this.optionList.accountList = data.categor_dict.account_list;
                    this.optionList.skuLineList = data.categor_dict.line_list;
                    this.optionList.siteList = data.categor_dict.site_list;
                    this.handleQueryInfo();
                })

                let setDate = getLocalStorage('set_tip_date');
                let _thisDate = new Date();
                let _thisDay = `${this.loginInfo.uid}_${(_thisDate.getMonth()+1)}_${_thisDate.getDate()}`;
                if (setDate != _thisDay) {
                    getTipDialogInfo({
                        type: this.queryData.moduleType
                    }).then(({ data }) => {
                        this.tipDialogData = data.data_list;
                        this.tipDialogShow = true;
                    })
                }
            } catch (e) {
                console.log(e);
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.tableHeight = config.setTableHeight('ui-main-module', this.otherHeight);
                // this.$refs['myTable'].doLayout();
            });
        },
        watch: {
            "queryData.platform"(val) {
                this.queryData.account = [];
                this.optionList.accountList = [];
                // platformCode
                if (!val) return;
                getAllPlamListingAccountInfo({
                    platformCode: val
                }).then(({ data }) => {
                    this.optionList.accountList = data.data;
                })
            }
        }
    };
</script>

<style lang="less" scoped>

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0!important;;
    }
</style>
