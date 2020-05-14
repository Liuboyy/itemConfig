<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计类型" >
                            <el-select size="small" v-model="queryData.sales_type" @change="handleChangeType">
                                <el-option
                                        v-for="(label, value) in optionList.countTypeList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement>
                            <el-select size="small" v-model="queryData.date_type">
                                <el-option
                                        v-for="(label, value) in optionList.dateTypeList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.sales_type == 'd'">
                        <SearchRequirement
                                width="0"
                                template="daterange"
                                v-model="queryData.paymentTime"
                                :pickerOptions="pickerOptions">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.sales_type == 'm'">
                        <SearchRequirement
                                width="0"
                                template="daterangeym"
                                v-model="queryData.paymentTime">
                        </SearchRequirement>
                    </li>
                    <!--<li v-if="queryData.sales_type == 'd'">-->
                        <!--<SearchRequirement label="付款时间" v-model="queryData.paymentTime" template="daterange"-->
                                           <!--:pickerOptions="pickerOptions"></SearchRequirement>-->
                    <!--</li>-->
                    <!--<li v-if="queryData.sales_type == 'm'">-->
                        <!--<SearchRequirement label="付款月份">-->
                            <!--<el-date-picker-->
                                    <!--:clearable="false"-->
                                    <!--size="small"-->
                                    <!--v-model="queryData.paymentTime"-->
                                    <!--type="monthrange"-->
                                    <!--range-separator="至"-->
                                    <!--start-placeholder="开始月份"-->
                                    <!--end-placeholder="结束月份"-->
                                    <!--format="yyyy-MM"-->
                                    <!--value-format="yyyy-MM">-->
                            <!--</el-date-picker>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <li class="ui-checkbox" v-if="buttonList['kevin'] && buttonList['kevin'].permit()">
                        <SearchRequirement label="" width="0">
                            <el-checkbox v-model="queryData.removeKevin">排除Kevin</el-checkbox>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :params="{type: 'all'}" :query-fn="handleNodeClick" :reset-fn="handleResetQueryInfo"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <!--<span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon-->
            <!--:name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>-->
            <el-popover
                    placement="right-start"
                    width="720"
                    trigger="hover">
                <div class="ui-popover">
                    <p class="ui-title">数据来源：AMAZON来源平台接口、其他平台来源ERP</p>
                    <p class="ui-title">付款时间维度:</p>
                    <p>1.已付款</p>
                    <p>2.普通订单、合并后的订单、拆分后的子订单、被重寄的订单、客户补款的订单（排除被合并的订单、拆分的主订单、重寄后的订单）</p>
                    <p class="ui-title">发货时间维度:</p>
                    <p>1.已付款且已发货</p>
                    <p>2.普通订单、合并后的订单、拆分后的子订单、被重寄的订单、客户补款的订单（排除被合并的订单、拆分的主订单、重寄后的订单）</p>
                    <p>3.亚马逊接口数据无发货时间,统计发货时间与付款时间一致</p>
                </div>
                <el-button slot="reference" type="text" icon="el-icon-info">统计规则</el-button>
            </el-popover>
        </div>
        <TemplateDefault :staticNum="132" color="#FFFFFF">
            <div class="ui-content_area clearFix">
                <div class="ui-content_area--left">
                    <el-tree :data="groupTree" :props="groupTreeProps"
                             @node-click="(v) => { handleNodeClick(v, 'click') }"
                             @node-expand="(v) => { handleNodeClick(v, 'on') }"
                             @node-collapse="(v) => { handleNodeClick(v, 'off') }"></el-tree>
                </div>
                <div class="ui-content_area--main">
                    <ComEchart name="sccrcl" :ref="item.target" v-for="(item, index) in chartData" width="100%" :key="index" :data="item"></ComEchart>
                </div>
            </div>
        </TemplateDefault>
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
        getSalesCountReportInfo
    } from '@/api/sales_module/sales_count_report';
    import {
        getGroupOptionList
    } from '@/api/common';

    import {
        getMonthRange,
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'sales_count_report';
    export default {
        name: component_name,
        data () {
            return {

                // 时间搜索框宽度设置
                searchDateWidth: config.SEARCH_DATE_WIDTH,

                thisVm: {},

                // 搜索缩进
                showSearch: true,
                saveDefaultTime: [],

                queryData: {
                    sales_type: 'd',
                    paymentTime: [],
                    removeKevin: false,
                    date_type: '1',
                },

                optionList: {
                    countTypeList: {
                        'd': '日',
                        'm': '月'
                    },
                    dateTypeList: {
                        1: '付款时间',
                        2: '发货时间'
                    }
                },

                tableData: [],
                tableKey: [],
                tableProps: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                // 小组Tree
                groupTree: [],
                groupTreeProps: {
                    label: 'platform_name',
                    value: 'platform_code'
                },

                chartData: [],
                queryChartData: {},

                pickerOptions: {
                    disabledDate(time) {
                        return new Date(time).getTime() < 1514678400000
                    },
                    shortcuts: [
                        config.DATE_SHORTCUT.lastDay_7,
                        config.DATE_SHORTCUT.lastDay_30,
                        config.DATE_SHORTCUT.lastDay_60,
                    ]
                },
            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'storeKey'
            ])
        },
        methods: {
            ...mapActions([
                'Fn'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,
            getSalesCountReportInfo,
            getGroupOptionList,

            // 列表信息查询
            handleQueryInfo (params, isFn, item, success) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['sales_count_report']);
                }

                let obj = {
                    start_date: this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime[1],
                    sales_type: this.queryData.sales_type,
                    is_kevin: this.queryData.removeKevin ? 1 : 0,
                    date_type: this.queryData.date_type
                };

                this.getSalesCountReportInfo(obj).then(({data}) => {
                    if (!data.status) {
                        this.$message.error(data.errorMess || '查询失败！');
                        return;
                    }
                    this.handleQueryInfoCallBack(data, item, success, params);
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData = {
                    sales_type: 'd',
                    paymentTime: this.saveDefaultTime,
                    removeKevin: false,
                    date_type: '1'
                }
            },

            //监听日期类型
            handleChangeType(val) {
                if(val === 'd'){
                    this.queryData.paymentTime = this.saveDefaultTime
                }else {
                    this.queryData.paymentTime = this.handleFirst12Month()
                }
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

            // 分页条数切换
            handleSizeChange (val) {
                this.handleQueryInfo({
                    limit: val,
                    offset: 1
                }, true);
            },

            // 跳转页数切换
            handleCurrentChange (val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true);
            },

            // 刷新图表
            handleRefreshEChart(data) {
                this.chartData = [];
                this.$nextTick().then(() => {
                    this.chartData = data;
                });
            },

            // 树形节点被点击
            handleNodeClick(item, type = 'on') {

                //点击查询按钮
                if (item && item.type === 'all') {
                    this.chartData = [];
                    const treeData = [...this.groupTree];
                    this.groupTree.splice(0);
                    this.$nextTick().then(() => {
                        this.groupTree = treeData;
                    });
                    this.handleQueryInfo();
                    return;
                }

                // 点击树形节点名称
                if (type === 'click') {

                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['sales_count_report']);

                    const areaEl = document.querySelector('.ui-content_area--main');
                    this.$nextTick().then(() => {
                        const itemTop = this.$refs[`${item.platform_code}`][0].$el.getBoundingClientRect().top;
                        const areaTop = areaEl.scrollTop;
                        areaEl.scrollTop = areaTop + itemTop - 150;
                    });

                    return;
                }
            },

            // 操作回调
            handleOperationCallBack (data, successFn, errorFn) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    this.handleQueryInfo();
                    successFn && successFn();
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                    errorFn && errorFn();
                }
            },

            //查询回调
            handleQueryInfoCallBack (data) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'sales_count_report',
                    value: JSON.stringify(this.queryData)
                });

                this.groupTree = data.data.platform_data;
                this.chartData = data.data.data;
                this.handleRefreshEChart(this.chartData);
            }
        },
        activated() {
            this.chartData.forEach(item => {
                this.$refs[item.target][0].scroll && this.$refs[item.target][0].scroll();
            })
        },
        created () {

            this.thisVm = this;

            // 默认时间
            this.queryData.paymentTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
            this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
            this.handleQueryInfo();
        },
    };
</script>

<style lang="less" scoped>
    .ui-content_area {
        position: relative;
        height: 100%;
        .ui-content_area--left {
            /*float: left;*/
            width: 200px;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            overflow: auto;
            z-index: 1;
            border-right: 1px solid #e6e6e6;
        }
        .ui-content_area--main {
            position: relative;
            height: 100%;
            overflow: auto;
            padding-left: 210px;
            width: 100%;
            box-sizing: border-box;
        }
    }

    /deep/.ui-checkbox .ui-search_require {
        width: 100px!important;
    }
    .ui-main-module .ui-main-module-search li:nth-child(2) .ui-search_require {
        width: 220px!important;
    }
    .ui-main-module .ui-main-module-search li:nth-child(3) .ui-search_require {
        width: 250px!important;
    }

    /deep/.el-button [class*=el-icon-]+span {
        margin-left: 0!important;
    }

    .ui-popover {
        p {
            font-size: 12px;
        }
        .ui-title {
            font-weight: bold;
            color: #333333;
            margin: 5px 0;
        }
    }

    /deep/.ui-fn-module .el-button--text {
        padding: 9px 0;
    }
</style>
