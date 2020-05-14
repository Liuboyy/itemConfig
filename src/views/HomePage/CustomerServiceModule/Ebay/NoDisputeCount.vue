<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="平台账号">
                            <el-select size="small" v-model="queryData.platformAccount" filterable v-filter>
                                <el-option v-for="item in optionList.platformAccountList"
                                           :key="item.platform_code"
                                           :value="item.platform_code"
                                           :label="item.platform_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="账号简称">
                            <el-select size="small" v-model="queryData.sortName" filterable v-filter>
                                <el-option v-for="item in optionList.sortNameList"
                                           :key="item.country_code"
                                           :value="item.country_code"
                                           :label="item.country_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="刊登网站">
                            <el-select size="small" v-model="queryData.website" filterable v-filter>
                                <el-option v-for="item in optionList.websiteList"
                                           :key="item.p_line_id"
                                           :value="item.p_line_id"
                                           :label="item.p_line_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="INR类别">
                            <el-select size="small" v-model="queryData.inrType" filterable v-filter>
                                <el-option v-for="item in optionList.inrTypeList"
                                           :key="item.p_line_id"
                                           :value="item.p_line_id"
                                           :label="item.p_line_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="店铺指数">
                            <el-select size="small" v-model="queryData.shopIndex" filterable v-filter>
                                <el-option v-for="item in optionList.shopIndexList"
                                           :key="item.p_line_id"
                                           :value="item.p_line_id"
                                           :label="item.p_line_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="更新时间" v-model="queryData.updateTime" template="daterange">
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
            <!--<el-button-->
            <!--v-if="item.method && item.permit(thisVm) && item.icon"-->
            <!--v-for="item in buttonList"-->
            <!--size="small"-->
            <!--:type="item.type"-->
            <!--:key="item.value"-->
            <!--:icon="item.icon"-->
            <!--@click="item.action(thisVm, item.method)">{{item.name}}</el-button>-->
        </div>
        <ComTableInfo
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="['80']"
                :showSearch="showSearch">
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
        getSkuSalesCountInfo,
        getOptionList,
    } from '@/api/product_module/sku_sales_count';

    import {
        getPreDateRange,
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'no_dispute_count';

    export default {
        name: component_name,
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    platformAccount: '',
                    sortName: '',
                    website: '',
                    inrType: '',
                    shopIndex: '',
                    updateTime: [],
                },

                optionList: {
                    platformAccountList: [],
                    sortNameList: [],
                    websiteList: [],
                    inrTypeList: [],
                    shopIndexList: [],
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

                saveDefaultDate: []
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
                    this.queryData = JSON.parse(this.queryParamsInfo['no_dispute_count']);
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
                this.queryData = {
                    platformAccount: '',
                    sortName: '',
                    website: '',
                    inrType: '',
                    shopIndex: '',
                    updateTime: [],
                };
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

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'no_dispute_count',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...data.data.key];
                this.tableData = data.data.value;
                this.tableProps = ['index','sku','sku_sale90','sku_sale60','sku_sale30','sku_sale15','sku_sale7','sku_sale3','create_date','statis_date'];

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
                getPreDateRange().then(( data ) => {
                    this.saveDefaultDate = [data.start, data.end];
                    this.queryData.createTime = this.saveDefaultDate;
                    this.handleQueryInfo();
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>

<style scoped lang="less">


</style>
