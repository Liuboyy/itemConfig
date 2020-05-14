<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="平台">
                            <el-select size="small" clearable v-model="queryData.platform" filterable v-filter>
                                <el-option
                                        v-for="item in optionList.platformList"
                                        :key="item.platformCode"
                                        :value="item.platformCode"
                                        :label="item.platformName"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="账号">
                            <el-select size="small" clearable v-model="queryData.account" filterable collapseTags multiple v-filter>
                                <el-option
                                        v-for="(item, index) in optionList.accountList"
                                        :key="index"
                                        :value="item.id"
                                        :label="item.shortName"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="平台SKU">
                            <el-input size="small" v-model.trim="queryData.plmaSku"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="英文标题">
                            <el-input size="small" v-model.trim="queryData.enTitle"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="上架时间">
                            <el-date-picker
                                    :clearable="true"
                                    size="small"
                                    v-model="queryData.pushDate"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <!--<li>-->
                        <!--<SearchRequirement label="站点">-->
                            <!--<el-select size="small" clearable v-model="queryData.site" filterable collapseTags multiple v-filter>-->
                                <!--<el-option-->
                                        <!--v-for="item in optionList.siteList"-->
                                        <!--:key="item.value"-->
                                        <!--:value="item.value"-->
                                        <!--:label="item.label"></el-option>-->
                            <!--</el-select>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <li>
                        <SearchRequirement label="listing状态">
                            <el-select size="small" clearable v-model="queryData.listingState">
                                <el-option
                                        v-for="item in optionList.listingStateList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="公司SKU">
                            <el-input v-model.trim="queryData.companySku" size="small"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="中文标题">
                            <el-input v-model.trim="queryData.cnTitle" size="small"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="最后更新">
                            <el-date-picker
                                    :clearable="true"
                                    size="small"
                                    v-model="queryData.lastUpdate"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
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
        <div class="ui-main-module-table">
            <ComTableInfo ref="myTable" :showSearch="showSearch"
                          :tableData="tableData" :tableKey="tableKey" :tableProps="tableProps" :tableWidth="tableWidth">
                <template slot="sku" slot-scope="scope">
                    <div>
                        <p>平台SKU：{{scope.row.sellerSku}}</p>
                        <p>公司SKU：{{scope.row.sku}}</p>
                    </div>
                </template>
                <template slot="shippingFee" slot-scope="scope">
                    <div>
                        <p>当前售价：{{scope.row.price}}</p>
                        <p>额外运费：{{scope.row.shippingFee}}</p>
                    </div>
                </template>
                <template slot="updateTime" slot-scope="scope">
                    <div>
                        <p>上架时间：{{new Date(scope.row.createTime * 1000).format('yyyy-MM-dd')}}</p>
                        <p>最后更新：{{new Date(scope.row.updateTime * 1000).format('yyyy-MM-dd')}}</p>
                    </div>
                </template>
                <template slot="img" slot-scope="scope">
                    <div>
                        <img width="80px" height="80px" :src="scope.row.img" alt="">
                    </div>
                </template>
                <template slot="title" slot-scope="scope">
                    <div>
                        <p>{{scope.row.cnTitle}}</p>
                        <p>{{scope.row.title}}</p>
                    </div>
                </template>
                <template slot="status" slot-scope="scope">
                    <div>
                        <i class="ui-state_dot state_blue" v-if="scope.row.status == 1"></i>
                        <i class="ui-state_dot state_gray" v-if="scope.row.status == 2"></i>
                        <span>{{scope.row.status == 1 ? '上架' : scope.row.status == 2 ? '下架' : ''}}</span>
                    </div>
                </template>
            </ComTableInfo>
        </div>
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
        getAllPlamListingListInfo,
        getAllPlamListingPlatformInfo,
        getAllPlamListingAccountInfo
    } from '@/api/sales_module/all_plam_listing';

    import {
        getCurrentDateRange,
        getPreDateRange,
        getLastMonthStartDate,
        getLastMonthEndDate,
        getSixMonthRange
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'all_plam_listing';

    export default {
        name: component_name,
        data () {
            return {

                // 时间搜索框宽度设置
                searchDateWidth: config.SEARCH_DATE_WIDTH,

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    platform: '',
                    account: [],
                    plmaSku: '',
                    listingTitle: '',
                    pushDate: [],
                    site: [],
                    listingState: '',
                    companySku: '',
                    cnTitle: '',
                    enTitle: '',
                    lastUpdate: [],
                },
                saveDefaultTime: [],
                saveDefaultMonth: [],

                optionList: {
                    platformList: [],
                    accountList: [],
                    siteList: [],
                    listingStateList: [
                        {
                            label: '上架',
                            value: 1
                        },
                        {
                            label: '下架',
                            value: 2
                        }
                    ]
                },

                tableData: [],
                tableKey: ['序号', '平台', '站点', '账号', 'SKU', 'listing ID', 'listing图片', '标题', '售价运费', '操作时间', 'listing状态'],
                allTableKey: [],
                tableProps: ['index', 'platformType', 'site', 'shortName', 'sku', 'listingId', 'img', 'title', 'shippingFee', 'updateTime', 'status'],
                tableWidth: ['60', '120', '80', '140', '180', '120', '100', '', '150', '150', '160', '80'],
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

                tableLoading: false
            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'saleDataReportInfo'
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
                    this.queryData = JSON.parse(this.queryParamsInfo['all_plam_listing']);
                }

                let obj = {
                    ...params,
                    platformType: this.queryData.platform ? this.queryData.platform : '',
                    site: this.queryData.site.join(','),
                    account: this.queryData.account.join(','),
                    sku: this.queryData.companySku.replace(/\s+/g, ','),
                    sellerSku: this.queryData.plmaSku.replace(/\s+/g, ','),
                    listingStatus: this.queryData.listingState,
                    title: this.queryData.enTitle,
                    cnTitle: this.queryData.cnTitle,
                    createTimeStart: this.queryData.pushDate && this.queryData.pushDate[0] ? new Date(this.queryData.pushDate[0]).getTime() / 1000 : '',
                    createTimeEnd: this.queryData.pushDate && this.queryData.pushDate[1] ? new Date(this.queryData.pushDate[1]).getTime() / 1000 + 86400 : '',
                    updateTimeStart: this.queryData.lastUpdate && this.queryData.lastUpdate[0] ? new Date(this.queryData.lastUpdate[0]).getTime() / 1000 : '',
                    updateTimeEnd: this.queryData.lastUpdate && this.queryData.lastUpdate[1] ? new Date(this.queryData.lastUpdate[1]).getTime() / 1000 + 86400 : '',
                    // sortId: this.tableData[this.tableData.length - 1] ? this.tableData[this.tableData.length - 1].gid : '',
                };

                this.tableLoading = true;
                getAllPlamListingListInfo(obj).then(({data}) => {
                    if(data.code === 200) {
                        this.handleQueryInfoCallBack(data.data);
                    }else {
                        this.$message.error(data.msg || '查询失败！');
                        this.tableLoading = false;
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData = {
                    platform: '',
                    account: [],
                    plmaSku: '',
                    listingTitle: '',
                    pushDate: [],
                    site: [],
                    listingState: '',
                    companySku: '',
                    cnTitle: '',
                    enTitle: '',
                    lastUpdate: [],
                }
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
                this.handleQueryInfo({
                    isExcel: 1
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

            //查询回调
            handleQueryInfoCallBack(data) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'all_plam_listing',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                // this.allTableKey = {...data.data.title};
                // this.tableKey = ;
                this.tableData = data.content;

                this.pageData.currentList = data.numberOfElements
                this.pageData.currentTotal = data.totalElements
                this.pageData.currentPage = data.totalPages
            }
        },
        created () {
            this.thisVm = this;
            try {
                getAllPlamListingPlatformInfo().then(({ data }) => {
                    this.optionList.platformList = data.data;
                    this.handleQueryInfo();
                })
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
</style>
