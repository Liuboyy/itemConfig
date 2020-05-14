<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计类型" >
                            <el-select size="small" v-model="queryData.sales_type">
                                <el-option
                                        v-for="(label, value) in optionList.countTypeList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement template="daterangeym" v-model="queryData.month" label="统计月份"></SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :params="{}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon
                    :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button
                    v-if="item.method && item.permit(thisVm) && item.icon"
                    v-for="item in buttonList"
                    size="small"
                    :type="item.type"
                    :key="item.value"
                    :icon="item.icon"
                    @click="item.action(thisVm, item.method)">{{item.name}}</el-button>
        </div>
        <div class="ui-main-module-table">
            <el-table ref="myTable" highlight-current-row :height="tableHeight" :data="tableData">
                <el-table-column :label="tableLabel" prop="name" minWidth="150" fixed></el-table-column>
                <el-table-column v-for="(item, index) in tableKey" :label="item === 'all' ? '全部' : item" :key="index">
                    <el-table-column label="应付金额" minWidth="120">
                        <span slot-scope="scope">{{scope.row[item] && scope.row[item].yf_price}}</span>
                    </el-table-column>
                    <el-table-column label="实付金额" minWidth="120">
                        <span slot-scope="scope">{{scope.row[item] && scope.row[item].xj_payment}}</span>
                    </el-table-column>
                    <el-table-column label="折扣" minWidth="120">
                        <span slot-scope="scope">{{scope.row[item] && scope.row[item].discount}}</span>
                    </el-table-column>
                </el-table-column>
                <template slot="empty">
                    <div>
                        <NotData v-show="!tableData.length"></NotData>
                    </div>
                </template>
            </el-table>
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
        getCostStatisticsReportInfo
    } from '@/api/zen_tao_module/cost_statistics_report';

    import {
        getMonthRange
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'cost_statistics_report';

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
                    sales_type: '1',
                    month: [],
                },
                saveDefaultTime: [],
                saveDefaultMonth: [],

                optionList: {
                    countTypeList: {
                        '1': '产品',
                        '2': '项目'
                    },
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableHeight: '100px',
                tableLabel: '',

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },
            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
            ])
        },
        methods: {
            ...mapActions([]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,
            getCostStatisticsReportInfo,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['cost_statistics_report']);
                }

                let obj = {
                    start_month: this.queryData.month[0],
                    end_month: this.queryData.month[1],
                    sales_type: this.queryData.sales_type,
                    ...params
                };

                this.getCostStatisticsReportInfo(obj).then(({data}) => {
                    if(data.status === 2)  return;
                    if(data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData.sales_type =  '1';
                this.queryData.month = this.saveDefaultTime;
            },


            handleFirst12Month() {
                let curDate = (new Date()).getTime();
                // 将半年的时间单位换算成毫秒
                let halfYear = 365  * 24 * 3600 * 1000;
                let pastResult = curDate - halfYear;  // 半年前的时间（毫秒单位）

                // 日期函数，定义起点为半年前
                let pastDate = new Date(pastResult),
                    pastYear = pastDate.getFullYear(),
                    pastMonth = pastDate.getMonth() + 2;

                let year = new Date().getFullYear();
                let currentMonth = new Date().getMonth() + 1;

                if (pastMonth < 10) { pastMonth = '0' + pastMonth } else { pastMonth = pastMonth}
                if (currentMonth < 10) { currentMonth = '0' + currentMonth } else { currentMonth = currentMonth}
                let dateStart = pastYear + '-' + pastMonth;
                let dateEnd = year + '-' + currentMonth;

                return [dateStart, dateEnd]
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1
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
                    key: 'cost_statistics_report',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableLabel = this.queryData.sales_type === '1' ? '产品' : '项目';
                this.tableKey = data.data.title;
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data.data;
                })
            },
        },
        created () {
            this.thisVm = this;
            try {
                this.queryData.month = this.handleFirst12Month();
                this.saveDefaultTime = this.handleFirst12Month();
                this.handleQueryInfo();

            } catch (e) {
                console.log(e);
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.tableHeight = config.setTableHeight('ui-main-module', this.otherHeight);
                this.$refs['myTable'].doLayout();
            });
        },
        watch: {
            showSearch() {
                let vm = this;
                document.querySelector('body').style.overflow = 'hidden';
                setTimeout(() => {
                    vm.tableHeight = config.setTableHeight('ui-main-module', this.otherHeight);
                    vm.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400)
            }
        }
    };
</script>

<style lang="less" scoped>

    @border: 1px solid #e6e6e6;
</style>
