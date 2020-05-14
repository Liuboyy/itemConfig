<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="采购单创建日期" v-model="queryData.createTime" template="daterange" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品线">
                            <el-select size="small" v-model="queryData.productLine" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.productLineList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="采购小组">
                            <el-select size="small" v-model="queryData.group" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.groupList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="采购员">
                            <el-select size="small" v-model="queryData.buyer" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.buyerList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发员">
                            <el-select size="small" v-model="queryData.developer" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.developerList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="统计截止日期">
                            <el-date-picker
                                    size="small"
                                    type="dates"
                                    v-model="queryData.countTime"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    placeholder="最多可选三个日期"
                                    @change="handleChangeTime">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="业务线">
                            <el-select size="small" v-model="queryData.businessLine" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.businessLineList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="作废原因">
                            <el-select size="small" v-model="queryData.reason" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.reasonList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
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
        <!--<div class="ui-tabs_box">-->
            <!--<el-tabs v-model="queryData.query_type" type="card" @tab-click="handleTabClick">-->
                <!--<el-tab-pane label="日期维度统计" name="1"></el-tab-pane>-->
                <!--<el-tab-pane label="采购员维度统计" name="2"></el-tab-pane>-->
            <!--</el-tabs>-->
        <!--</div>-->

        <TableIndex :tableData="tableData" :showSearch="showSearch" :otherHeight="['el-tabs__header']" :queryType="queryType"></TableIndex>

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
        getVoidedDataAnalysisInfo,
        getOptionList,
        getVoidedAnalysisSumInfo
    } from '@/api/purchasing_module/voided_data_analysis';

    import {
        getPreDateRange,
    } from '@/api/common/date_format'

    import TableIndex from './TableIndex.vue'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'voided_data_analysis';

    export default {
        name: component_name,
        components: {TableIndex},
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    query_type: '1',
                    createTime: [],
                    countTime: [],
                    businessLine: [],
                    productLine: [],
                    buyer: [],
                    group: [],
                    developer: [],
                    reason: [],
                },

                optionList: {
                    buyerList: [],
                    groupList: [],
                    businessLineList: [],
                    developerList: [],
                    productLineList: [],
                    reasonList: [],
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
                saveDefaultDay: [],

                queryType: '',

                //判断统计日期选择是否超过三个
                isGreater3: false,
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
            getVoidedDataAnalysisInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['voided_data_analysis']);
                }

                if(this.isGreater3) {
                    this.$message.warning('最多只能选三个日期！');
                    return;
                }

                let obj = {
//                    tj_type: this.queryData.query_type,
                    pr_create_time_s: this.queryData.createTime && this.queryData.createTime[0],
                    pr_create_time_e: this.queryData.createTime && this.queryData.createTime[1],
                    tj_sj: this.queryData.countTime && this.queryData.countTime.join(','),
                    buyer_id: this.queryData.buyer.join(','),
                    develo_id: this.queryData.developer.join(','),
                    buyer_group: this.queryData.group.join(','),
                    purchase_type_id: this.queryData.businessLine.join(','),
                    pr_cancel_reason: this.queryData.reason.join(','),
                    product_onelevel_id: this.queryData.productLine.join(','),
                };

                obj = Object.assign(params || {}, obj);

                this.getVoidedDataAnalysisInfo(obj).then(({ data }) => {
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
                    createTime: this.saveDefaultDate,
                    countTime: this.saveDefaultDay,
                    businessLine: [],
                    productLine: [],
                    buyer: [],
                    group: [],
                    developer: [],
                    reason: [],
                };
            },

            //监听统计日期
            handleChangeTime(val) {
                if (val && val.length > 3) {
                    this.isGreater3 = true;
                    this.$message.warning('最多只能选三个日期！');
                }else {
                    this.isGreater3 = false;
                }
            },

            handleTabClick(tab) {
                this.queryData.query_type = tab.name;
                this.handleQueryInfo({limit: this.pageData.currentList});
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
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
                    isExcel: 1,
                }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'voided_data_analysis',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.queryType = this.queryData.query_type;
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data_table;
                });

                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.offset * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                getOptionList({module: 'invalid'}).then(({ data }) => {
                    this.optionList.buyerList = data.categor_dict.buyer_list;
                    this.optionList.groupList = data.categor_dict.group_list;
                    this.optionList.businessLineList = data.categor_dict.purchase_type_id;
                    this.optionList.developerList = data.categor_dict.develo_id;
                    this.optionList.reasonList = data.categor_dict.pr_cancel_reason;
                    this.optionList.productLineList = data.categor_dict.line_list;
                });
                getPreDateRange().then(( data ) => {
                    this.saveDefaultDay = [data.end];
                    this.saveDefaultDate = [data.start, data.end];
                    this.queryData.countTime = this.saveDefaultDay;
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
