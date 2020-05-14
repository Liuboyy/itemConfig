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
                        <SearchRequirement label="平台">
                            <el-select size="small" v-model="queryData.platform" filterable v-filter>
                                <el-option v-for="item in optionList.platformList"
                                           :key="item.platform_code"
                                           :value="item.platform_code"
                                           :label="item.platform_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="国家">
                            <el-select size="small" v-model="queryData.country" filterable v-filter>
                                <el-option v-for="item in optionList.countryList"
                                           :key="item.country_code"
                                           :value="item.country_code"
                                           :label="item.country_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品线">
                            <el-select size="small" v-model="queryData.productLine" filterable v-filter>
                                <el-option v-for="item in optionList.productLineList"
                                           :key="item.p_line_id"
                                           :value="item.p_line_id"
                                           :label="item.p_line_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li >
                        <SearchRequirement label=""></SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="SKU编码">
                            <el-input size="small" placeholder="请输入" v-model="queryData.skuCode" :disabled="dialog.skuCode !== ''"></el-input>
                        </SearchRequirement>
                    </li>
                    <!--<li class="ui-search_more" @click="dialog.isSkuShow = true">SKU批量查询>></li>-->
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
                :tableWidth="['80']"
                :showSearch="showSearch"
                :tableSort="tableSort"
                :defaultSort="queryData.sortOrder"
                @handleSort="handleSortChange">
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
                top="5vh"
                width="1000px"
                title="SKU批量查询"
                class="ui-layout_edit-dialog"
                :visible.sync="dialog.isSkuShow"
                :close-on-click-modal=false
                :close-on-press-escape=false
                @close="handleCloseSkuSearch">
            <el-input type="textarea" :rows="30" v-model="dialog.skuCode" placeholder="SKU请分行区分  例如：
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
        autoAddTableInx
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";
    import {
        getSkuSalesCountInfo,
        getOptionList,
    } from '@/api/product_module/sku_sales_count';

    import {
        getPreDateRange,
        validTime
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'sku_sales_count';

    export default {
        name: component_name,
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    skuCode: '',
                    createTime: [],
                    platform: '',
                    country: '',
                    productLine: '',
                    sortField: '',
                    sortBy: '',
                    sortOrder: {
                        prop: 'sku_sale90',
                        order: 'desc'
                    }
                },

                optionList: {
                    platformList: [],
                    countryList: [],
                    productLineList: []
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableWidth:[],
                tableSort:[],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                saveDefaultDate: [],

                //批量查询sku
                dialog: {
                    isSkuShow: false,
                    skuCode: ''
                }
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
                'Fn'
            ]),
            autoAddTableInx,
            getSkuSalesCountInfo,
            getOptionList,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['sku_sales_count']);
                }
                if(!validTime(this.queryData.createTime[0], this.queryData.createTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }
                let obj = {
                    sku_code: this.queryData.skuCode,
                    start_date: this.queryData.createTime[0],
                    end_date: this.queryData.createTime[1],
                    platform_code: this.queryData.platform,
                    country_code: this.queryData.country,
                    p_line_id: this.queryData.productLine,
                    sort_field: this.queryData.sortField,
                    sort_by: this.queryData.sortBy,
                };

                obj = Object.assign(params || {}, obj);

                this.getSkuSalesCountInfo(obj).then(({ data }) => {
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
                this.queryData.skuCode = '';
                this.queryData.platform = '';
                this.queryData.country = '';
                this.queryData.productLine = '';
                this.queryData.sortField = '';
                this.queryData.sortBy = '';
                this.dialog.skuCode = '';
                this.handleGetDateRange();
            },

            // 排序
            handleSortChange(data) {
                this.queryData.sortOrder = {
                    prop: data.prop,
                    order: data.order
                };
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'sku_sales_count',
                    value: JSON.stringify(this.queryData)
                });

                this.queryData.sortField = data.prop;

                if (data.prop === "sku_sale90") {
                    this.queryData.sortBy = data.order === 'ascending' ? 'asc' : 'desc';
                }
                if (data.prop === "sku_sale60") {
                    this.queryData.sortBy = data.order === 'ascending' ? 'asc' : 'desc';
                }
                if (data.prop === "sku_sale30") {
                    this.queryData.sortBy = data.order === 'ascending' ? 'asc' : 'desc';
                }
                if (data.prop === "sku_sale15") {
                    this.queryData.sortBy = data.order === 'ascending' ? 'asc' : 'desc';
                }
                if (data.prop === "sku_sale7") {
                    this.queryData.sortBy = data.order === 'ascending' ? 'asc' : 'desc';
                }
                if (data.prop === "sku_sale3") {
                    this.queryData.sortBy = data.order === 'ascending' ? 'asc' : 'desc';
                }
                this.handleQueryInfo({limit: this.pageData.currentList});
            },

            //确定
            handleConfirmSkuSearch() {
                this.queryData.skuCode = this.handleReplace(this.dialog.skuCode);
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
                    total: this.pageData.currentTotal
                }, true)
            },

            //默认时间
            handleGetDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.createTime = [data.start, data.end];
                });
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'sku_sales_count',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...data.data.key];
                this.tableData = data.data.value;
                this.tableProps = ['index','sku','sku_sale90','sku_sale60','sku_sale30','sku_sale15','sku_sale7','sku_sale3','create_date','statis_date'];
                this.tableSort = [false,false,'custom','custom','custom','custom','custom','custom',false,false];

                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                this.getOptionList().then(({ data }) => {
                    this.optionList.platformList = data.data.platform_list;
                    this.optionList.countryList = data.data.country_list;
                    this.optionList.productLineList = data.data.product_line_list;
                });
                getPreDateRange().then((data) => {
                    this.queryData.createTime = [data.start, data.end];
                    this.handleQueryInfo();
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>

<style scoped lang="less">
    .ui-search_more{
        font-size: 12px;
        color: #3388ff;
        margin-left: 15px;
        cursor: pointer;
    }
</style>
