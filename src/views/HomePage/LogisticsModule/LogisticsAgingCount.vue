<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                                label="日期"
                                template="date"
                                v-model="queryData.date">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="发货大仓">
                            <el-select size="small" v-model="queryData.big_store" multiple collapseTags filterable v-filter
                                       @change="(val) => { handleGetSecondList(val, 1) }">
                                <el-option v-for="item in optionList.bigStoreList"
                                           :key="item.d_id"
                                           :value="item.d_id"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="发货仓库">
                            <el-select size="small" v-model="queryData.small_store" multiple collapseTags filterable v-filter>
                                <el-option v-for="item in optionList.smallStoreList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="物流类型">
                            <el-select size="small" v-model="queryData.wuliu_type" multiple collapseTags filterable v-filter
                                       @change="(val) => { handleGetSecondList(val, 2) }">
                                <el-option v-for="item in optionList.logisticsTypeList"
                                           :key="item.d_id"
                                           :value="item.d_id"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="物流方式">
                            <el-select size="small" v-model="queryData.wuliu_mode" multiple collapseTags filterable v-filter>
                                <el-option v-for="item in optionList.logisticsModeList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="平台">
                            <el-select size="small" v-model="queryData.platform" multiple collapseTags filterable v-filter
                                       @change="(val) => { handleGetSecondList(val, 3) }">
                                <el-option v-for="item in optionList.platformList"
                                           :key="item.d_id"
                                           :value="item.d_id"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="账号">
                            <el-select size="small" v-model="queryData.account" multiple collapseTags filterable v-filter>
                                <el-option v-for="item in optionList.accountList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="收货国家">
                            <el-select size="small" v-model="queryData.country" multiple collapseTags filterable v-filter>
                                <el-option v-for="item in optionList.countryList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
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
            <!--<span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>-->
            <el-button
                    v-if="item.method && item.permit(thisVm) && item.icon"
                    v-for="item in buttonList"
                    size="small"
                    :type="item.type"
                    :key="item.value"
                    :icon="item.icon"
                    @click="item.action(thisVm, item.method)">{{item.name}}</el-button>
        </div>
        <!--<ComTableInfo-->
                <!--ref="tableArea"-->
                <!--:tableKey="tableKey"-->
                <!--:tableProps="tableProps"-->
                <!--:tableData="tableData"-->
                <!--:tableMinWidth="tableMinWidth"-->
                <!--:showSearch="showSearch">-->
        <!--</ComTableInfo>-->

        <!--<TemplateDefault color="#fff" :staticNum="190">-->
            <!---->
        <!--</TemplateDefault>-->
        <div style="position: absolute; left: 220px; top: 200px; background: #fff; overflow: auto; bottom: 10px; width: 88%">
            <div v-for="(item, value) in tableData" class="ui-table_wrap">
                <h5>| {{item[0].big_warehouse_name}}</h5>
                <div class="ui-main-module-table">
                    <common-table :tableData="item" :tableKey="tableKey" :tableProps="tableProps" :tableWidth="tableMinWidth">
                        <template v-for="(prop, index) in tableProps" slot-scope="scope" :slot="prop">
                            <span>{{scope.row[tableProps[index]]}}</span>
                        </template>
                    </common-table>
                    <!--<el-table :data="item" border stripe v-loading="tableLoading">-->
                        <!--<el-table-column-->
                                <!--v-for="(item, index) in tableKey"-->
                                <!--:key="index"-->
                                <!--:label="item"-->
                                <!--:width="tableMinWidth[index]"-->
                                <!--:prop="tableProps[index]">-->
                            <!--<template slot-scope="scope">-->
                                <!--<span>{{scope.row[tableProps[index]]}}</span>-->
                            <!--</template>-->
                        <!--</el-table-column>-->
                        <!--<slot name="operate"></slot>-->
                        <!--<template slot="empty">-->
                        <!--<div>-->
                        <!--<NotData v-show="!item.length"></NotData>-->
                        <!--</div>-->
                        <!--</template>-->
                    <!--</el-table>-->
                </div>
            </div>
        </div>


        <!--<div class="ui-main-module-page">-->
            <!--<el-pagination-->
                    <!--@size-change="handleSizeChange"-->
                    <!--@current-change="handleCurrentChange"-->
                    <!--:current-page="pageData.currentPage"-->
                    <!--:page-sizes="pageSizes"-->
                    <!--size="small"-->
                    <!--:page-size="pageData.currentList"-->
                    <!--layout="total, sizes, prev, pager, next, jumper"-->
                    <!--:total="pageData.currentTotal">-->
            <!--</el-pagination>-->
        <!--</div>-->


    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        autoAddTableInx,
        makeCopy
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";
    import {
        getLogisticsAgingCountInfo,
        getOneLevelList,
        getSecondLevelList
    } from '@/api/logistics_module/logistics_aging_count';

    import {
        getPreDateRange,
        validTime,
        isOverThreeDays,
        IntervalDays
    } from '@/api/common/date_format'

    import * as importApi from '@/api/import_api/index';

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'logistics_aging_count';

    export default {
        name: component_name,
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    date: '',
                    big_store: [],
                    small_store: [],
                    wuliu_type: [],
                    wuliu_mode: [],
                    platform: [],
                    account: [],
                    country: [],
                },

                optionList: {
                    bigStoreList: [],
                    smallStoreList: [],
                    logisticsTypeList: [],
                    logisticsModeList: [],
                    platformList: [],
                    accountList: [],
                    countryList: [],
                },

                tableData: [],
                tableMinWidth: [],
                tableProps: [],
                tableWidth:[],
                tableLoading: false,


                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                saveCheckSku: '',
                saveDefaultDate: ''
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
            getLogisticsAgingCountInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['logistics_aging_count']);
                }

                let obj = {
                    date: this.queryData.date,
                    big_store: this.queryData.big_store.join(','),
                    small_store: this.queryData.small_store.join(','),
                    wuliu_type: this.queryData.wuliu_type.join(','),
                    wuliu_mode: this.queryData.wuliu_mode.join(','),
                    platform: this.queryData.platform.join(','),
                    account: this.queryData.account.join(','),
                    country: this.queryData.country.join(','),
                    ...params
                };

                obj = Object.assign(params || {}, obj);

                this.tableLoading = true;
                this.getLogisticsAgingCountInfo(obj).then(({ data }) => {
                    if(data.status === 2) {
                        this.tableLoading = false;
                        return;
                    }
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.tableLoading = false;
                        this.$message.error(data.errorMess || data.error_Mess || '查询失败')
                    }
                })
            },

            // 查询重置
            handleResetQueryInfo() {
                this.queryData.date = this.saveDefaultDate;
                this.queryData.big_store = [];
                this.queryData.small_store = [];
                this.queryData.wuliu_type = [];
                this.queryData.wuliu_mode = [];
                this.queryData.platform = [];
                this.queryData.account = [];
                this.queryData.country = [];
            },

            //获取二级数据
            handleGetSecondList(val, type) {
                getSecondLevelList({
                    second_type: type,
                    select_code: val.join(',')
                }).then(({ data }) => {
                    if (data.status) {
                        if (type === 1) {
                            this.optionList.smallStoreList = data.data;
                        }else if (type === 2) {
                            this.optionList.logisticsModeList = data.data;
                        }else {
                            this.optionList.accountList = data.data;
                        }
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                });
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || data.error_Mess || '操作失败');
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
                }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'logistics_aging_count',
                    value: JSON.stringify(this.queryData)
                });

                //列表渲染数据
                this.tableKey = Object.values(data.title);
                this.tableProps = Object.keys(data.title);
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableLoading = false;
                    this.tableData = data.data;
                });
                this.tableMinWidth = this.tableProps.map(item => {
                    return '85'
                });
//                this.pageData.currentTotal = data.page.total_qty * 1 ;
//                this.pageData.currentList = data.page.limit * 1 ;
//                this.pageData.currentPage = data.page.offset * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                getOneLevelList().then(({ data }) => {
                    if (data.status) {
                        this.optionList.bigStoreList = data.big_store;
                        this.optionList.logisticsTypeList = data.logistics_type;
                        this.optionList.platformList = data.platform_data;
                        this.optionList.countryList = data.country_data;
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                });
                getPreDateRange().then(( data ) => {
                    this.saveDefaultDate = data.end;
                    this.queryData.date = this.saveDefaultDate;
                    this.handleQueryInfo();
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>

<style scoped lang="less">
    .ui-table_wrap {
        margin-bottom: 15px;
        h5 {
            text-align: left;
            margin: 5px;
        }

    }


</style>
