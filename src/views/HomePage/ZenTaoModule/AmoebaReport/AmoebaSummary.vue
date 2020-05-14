<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计月份" v-model="queryData.countMonth" template="daterangeym" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="需求部门">
                            <el-input size="small" placeholder="请输入" v-model="queryData.department"></el-input>
                            <!--<el-select filterable v-filter collapseTags multiple size="small" v-model="queryData.department">-->
                                <!--<el-option-->
                                        <!--v-for="item in optionList.departmentList"-->
                                        <!--:key="item.id"-->
                                        <!--:value="item.id"-->
                                        <!--:label="item.name"></el-option>-->
                            <!--</el-select>-->
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="需求指派人">
                            <el-input size="small" placeholder="请输入" v-model="queryData.assignMember"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品经理">
                            <el-input size="small" placeholder="请输入" v-model="queryData.manager"></el-input>
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
                    v-if="item.method && item.permit(thisVm) && item.icon && item.value === 'export'"
                    v-for="item in buttonList"
                    size="small"
                    :type="item.type"
                    :key="item.value"
                    :icon="item.icon"
                    @click="item.action(thisVm, item.method)">{{item.name}}</el-button>
        </div>

        <SummaryTable ref="tableArea" :tableData="tableData" :showSearch="showSearch"></SummaryTable>

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
        autoAddTableInx
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";
    import {
        getDepartmentList,
    } from '@/api/zen_tao_module/amoeba_report';

    import {
        getMonthRange,
    } from '@/api/common/date_format'

    import SummaryTable from './SummaryTable.vue'

    export default {
        components: { SummaryTable },
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    countMonth: [],
                    department: '',
                    manager: '',
                    assignMember: ''
                },

                saveDefaultMonth: [],

                optionList: {
                    departmentList: []
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
            }

        },
        computed: {
            ...mapGetters([
                'buttonList',
                'loginInfo',
                'queryParamsInfo',
                'amoebaSummaryInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetAmoebaReportSummaryInfo'
            ]),
            autoAddTableInx,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['amoeba_summary']);
                }

                let obj = {
                    demand_dept: this.queryData.department,
                    demand_manager: this.queryData.manager,
                    assign_member: this.queryData.assignMember,
                    propose_time_start: this.queryData.countMonth && this.queryData.countMonth[0],
                    propose_time_end: this.queryData.countMonth && this.queryData.countMonth[1],
                };

                obj = Object.assign(params || {}, obj);

                this.GetAmoebaReportSummaryInfo(obj).then(({ data }) => {
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
                this.queryData.countMonth = this.saveDefaultMonth;
                this.queryData.department = '';
                this.queryData.manager = '';
                this.queryData.assignMember = '';
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
                    is_excel: 1,
                    total_count: this.pageData.currentTotal
                }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'amoeba_summary',
                    value: JSON.stringify(this.queryData)
                });


                //渲染数据
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data;
                });
//                this.pageData.currentTotal = data.page_data.total * 1 ;
//                this.pageData.currentList = data.page_data.limit * 1 ;
//                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
//                getDepartmentList().then(({ data }) => {
//                    this.optionList.departmentList = data.dept_data;
//                });
                getMonthRange().then(( data ) => {
                    this.saveDefaultMonth = [data.start, data.end];
                    if (JSON.stringify(this.amoebaSummaryInfo) === '{}') {
                        this.queryData.countMonth = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['amoeba_summary']);
                        this.handleQueryInfoCallBack(this.amoebaSummaryInfo);
                    }
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>

<style scoped lang="less">
    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0!important;;
    }

</style>
