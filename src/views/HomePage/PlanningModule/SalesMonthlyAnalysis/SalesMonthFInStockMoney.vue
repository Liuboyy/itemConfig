<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="开始日期" v-model="queryData.dateStart" template="date" :isOption="false">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="结束日期" v-model="queryData.dateEnd" template="date" :isOption="false">
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
                <el-tab-pane label="销量统计" name="1"></el-tab-pane>
                <el-tab-pane label="占比统计" name="2"></el-tab-pane>
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
        </ComTableInfo>

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
        getSalesMonthFMoneyInfo,
    } from '@/api/planning_module/sales_month_f_money';

    import {
        getPreDateRange,
        validTime
    } from '@/api/common/date_format'

    import {
        getThirtyDayDateRange
    } from '@/services/index';

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'sales_month_f_money';

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
                    dateStart: '',
                    dateEnd: '',
                },

                optionList: {},

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
            getSalesMonthFMoneyInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['sales_month_f_money']);
                }

                if (!validTime(this.queryData.dateStart, this.queryData.dateEnd)) {
                    this.$message.warning('开始日期不能大于结束日期');
                    return;
                }

                let obj = {
                    report_type: this.queryData.query_type,
                    time_start: this.queryData.dateStart,
                    time_end: this.queryData.dateEnd,
                    ...params,
                };

                obj = Object.assign(params || {}, obj);

                this.getSalesMonthFMoneyInfo(obj).then(({ data }) => {
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
                    dateStart: this.saveDefaultDate[0],
                    dateEnd: this.saveDefaultDate[1],
                };
            },

            handleTabClick(tab) {
                this.queryData.query_type = tab.name;
                this.handleQueryInfo();
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
                    key: 'sales_month_f_money',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = data.key;

                if (this.queryData.query_type === '1') {
                    this.tableProps = ['flag_name', 'a_num', 'b_num', 'c_num', 'd_num', 'e_num', 'f_num', 'g_num', 'h_num', 'i_num', 'j_num', 'new_num', 'total_num', 'new_num_ratio'];
                }else {
                    this.tableProps = ['flag_name', 'a_ratio', 'b_ratio', 'c_ratio', 'd_ratio', 'e_ratio', 'f_ratio', 'g_ratio', 'h_ratio', 'i_ratio', 'j_ratio', 'new_ratio', 'total_ratio', 'new_num_ratio'];
                }

                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.value;
                });
                this.tableMinWidth = this.tableProps.map(item => {
                    if (item === 'flag_name') return '200';
//                    if (item === 'new_num' || item === 'total_num'|| item === 'new_num_ratio'|| item === 'j_num') return '100';
//                    if (item === 'b_num'|| item === 'f_num'|| item === 'g_num'|| item === 'h_num') return '180';
//                    return '165'
                });

//                this.pageData.currentTotal = data.page_data.total * 1 ;
//                this.pageData.currentList = data.page_data.limit * 1 ;
//                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                this.saveDefaultDate = getThirtyDayDateRange(new Date(new Date().getTime()));
                this.queryData.dateStart = getThirtyDayDateRange(new Date(new Date().getTime()))[0];
                this.queryData.dateEnd = getThirtyDayDateRange(new Date(new Date().getTime()))[1];
                this.handleQueryInfo();
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

</style>
