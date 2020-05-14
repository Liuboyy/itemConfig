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
                    <li v-if="queryData.sales_type == 'd'">
                        <SearchRequirement label="付款时间" template="daterange" v-model="queryData.paymentTime"
                                           :pickerOptions="pickerOptions"></SearchRequirement>
                    </li>
                    <li v-if="queryData.sales_type == 'm'">
                        <SearchRequirement label="付款时间" template="daterangeym" v-model="queryData.paymentTime"></SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="平台">
                            <el-select size="small" v-model="queryData.platform" multiple collapseTags filterable v-filter>
                                <el-option v-for="item in optionList.platformList"
                                           :key="item.platform_code"
                                           :value="item.platform_code"
                                           :label="item.platform_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <!--<li class="ui-checkbox" v-if="buttonList['kevin'] && buttonList['kevin'].permit()">-->
                        <!--<SearchRequirement label="" width="0">-->
                            <!--<el-checkbox v-model="queryData.removeKevin">排除Kevin</el-checkbox>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                </ul>
                <FilterBtn refTable="tableArea" :params="{type: 'all'}" :query-fn="handleNodeClick" :reset-fn="handleResetQueryInfo"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <!--<span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon-->
            <!--:name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>-->
            <el-button
                    v-if="item.method && item.permit(thisVm) && item.icon"
                    v-for="item in buttonList"
                    size="small"
                    :type="item.type"
                    :key="item.value"
                    :icon="item.icon"
                    @click="item.action(thisVm, item.method)">{{item.name}}</el-button>
            <el-popover
                    placement="right-start"
                    width="400"
                    trigger="hover">
                <div class="ui-popover">
                    <p class="ui-title">数据来源：AMAZON来源电商浏览器、其他平台来源CRM客服系统</p>
                    <p class="ui-title">统计规则:</p>
                    <p>曲线：统计全部以及各平台每天以及每月的数据</p>
                    <p>表格：与曲线一致</p>
                    <p>饼图占比：各平台退款额/查询条件的全部退款额</p>
                </div>
                <el-button slot="reference" type="text" icon="el-icon-info">统计规则</el-button>
            </el-popover>
        </div>
        <TemplateDefault :staticNum="132" color="#f3f6fa">
            <div class="ui-content_area clearFix">
                <div class="ui-content_area--left">
                    <el-tree :data="groupTree" :props="groupTreeProps"
                             @node-click="(v) => { handleNodeClick(v, 'click') }"
                             @node-expand="(v) => { handleNodeClick(v, 'on') }"
                             @node-collapse="(v) => { handleNodeClick(v, 'off') }"></el-tree>
                </div>
                <div class="ui-content_area--main">
                    <ComEchart name="refund" :ref="item.target" v-for="(item, index) in chartData" width="100%" :key="index" :data="item"></ComEchart>
                </div>
                <div class="ui-mix_area--left">
                    <div class="ui-main-module-table">
                        <el-table ref="myTable" highlight-current-row  height="320px" :data="tableData">
                            <el-table-column label="平台" prop="name" minWidth="85"></el-table-column>
                            <el-table-column v-for="(item, key, index) in tableKey" :label="item === 'all' ? '汇总' : item" :key="index">
                                <el-table-column label="退款额($)" minWidth="85">
                                    <span slot-scope="scope" class="ui-table_sale">{{scope.row[item] && scope.row[item].refund_usd_total_price}}</span>
                                </el-table-column>
                                <el-table-column label="销售额($)" minWidth="85">
                                    <span slot-scope="scope" class="ui-table_sale">{{scope.row[item] && scope.row[item].usd_total_price}}</span>
                                </el-table-column>
                                <el-table-column label="退单量" minWidth="70">
                                    <span slot-scope="scope">{{scope.row[item] && scope.row[item].refund_sum}}</span>
                                </el-table-column>
                                <el-table-column label="退款率" minWidth="70">
                                    <span slot-scope="scope" class="ui-table_sale">{{scope.row[item] && scope.row[item].ratio}}</span>
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
                <div class="ui-mix_area--right">
                    <div ref="myMap" class="ui-echarts"></div>
                </div>
            </div>
        </TemplateDefault>
    </div>
</template>

<script>

    const toHtml = (contents, top) => {

        // 小圈圈
        let rflag = color => `<span class="ui-echart--tooltip__flag" style="background: ${color}"></span>`;
        return contents.reduce((rhtml, ctn) => {
            return `${ctn.marker}平台：${ctn.name}<br/> 退款额：${ctn.value}<br/> 占比：${ctn.percent + '%'}`;
        }, `${top}`);
    };
    let option = {
        color: ['#78b3fc', '#ff7778', '#77d6c7', '#bbaff1', '#fd96c1','#fad44d'],
        title: {
            text: '各平台退款金额占比',
            left: 'text',
            textStyle: {
                fontSize: 16,
            }
        },
        tooltip: {
            trigger: 'item',
//            formatter: '{a} <br/>{b} : {c} ({d}%)'
            formatter: function(params) {
                return toHtml([params]);
            }
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            top: 20,
            bottom: 10,
            left: '70%',
            data: [],
        },
        series: [
            {
                name: '渠道分布',
                type: 'pie',
                radius: '60%',
                center: ['30%', '50%'],
                data: [],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    show: false
                },
//                roseType: 'radius',
            }
        ]
    };

    import echarts from 'echarts';
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
        getPlatformsRefundFormInfo,
        getPlatformsRefundCurveInfo,
        getPlatformsRefundPieInfo,
        getOptionList
    } from '@/api/sales_module/platforms_refund_count';

    import {
        getMonthRange,
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'platforms_refund_count';
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
                    platform: [],
//                    removeKevin: false,
                },

                optionList: {
                    countTypeList: {
                        'd': '日',
                        'm': '月'
                    },
                    platformList: []
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                allTableKey: [],
                tableHeight: '320px',

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
            getPlatformsRefundFormInfo,
            getPlatformsRefundCurveInfo,
            getPlatformsRefundPieInfo,

            // 列表信息查询
            handleQueryInfo (params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['platforms_refund_count']);
                }

                let obj = {
                    start_date: this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime[1],
                    sales_type: this.queryData.sales_type,
                    platform: this.queryData.platform.join(','),
//                    is_kevin: this.queryData.removeKevin ? 1 : 0,
                    ...params,
                };

                this.handleQueryInfoCallBackForm(obj);
                this.handleQueryInfoCallBackCurve(obj);
                this.handleQueryInfoCallBackPie(obj);
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData = {
                    sales_type: 'd',
                    paymentTime: this.saveDefaultTime,
                    platform: []
//                    removeKevin: false,
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

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1
                }, true)
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
                    this.queryData = JSON.parse(this.queryParamsInfo['platforms_refund_count']);

                    const areaEl = document.querySelector('.ui-content_area--main');
                    this.$nextTick().then(() => {
                        const itemTop = this.$refs[`${item.platform_code}`][0].$el.getBoundingClientRect().top;
                        const areaTop = areaEl.scrollTop;
                        areaEl.scrollTop = areaTop + itemTop - 160;
                    });

                    return;
                }
            },

//            testFn(row) {
//                return row.date
//            },

            getKeyList(index, maxLength = 3) {
                let keys = {};
                Object.entries(this.allTableKey).forEach((item, inx) => {
                    if (inx >= index && inx < index + maxLength) {
                        keys[item[0]] = item[1];
                    }
                })
                this.$nextTick().then(() => {
                    this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
                })
                return keys;
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

            init(option) {
                this.ECharts = echarts.init(this.$refs.myMap);
                this.ECharts.setOption(option);
            },

            handleQueryInfoCallBackCurve(obj) {
                this.getPlatformsRefundCurveInfo(obj).then(({data}) => {
                    if (!data.status) {
                        this.$message.error(data.errorMess || '查询失败！');
                        return;
                    }
                    // 保存查询参数
                    this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                        key: 'platforms_refund_count',
                        value: JSON.stringify(this.queryData)
                    });

                    this.groupTree = data.data.platform_data;
                    this.chartData = data.data.data;
                    this.handleRefreshEChart(this.chartData);
                }).catch(err => {
                    console.log(err);
                });
            },

            handleQueryInfoCallBackForm(obj) {
                this.getPlatformsRefundFormInfo(obj).then(({data}) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        // 保存查询参数
                        this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                            key: 'platforms_refund_count',
                            value: JSON.stringify(this.queryData)
                        });

                        //数据渲染
                        this.allTableKey = {...data.data.title};
                        this.tableKey = this.getKeyList(0);
                        this.tableData.splice(0);
                        this.$nextTick().then(() => {
                            this.tableData = data.data.data;
                            this.$nextTick().then(() => {
//                        this.tableLoading = false;
                                setTimeout(() => {
                                    this.tableKey = JSON.parse(JSON.stringify(this.allTableKey));
                                    const tableData = JSON.parse(JSON.stringify(this.tableData));
                                    this.tableData.splice(0);
                                    this.tableData = tableData;
                                }, 100)
                            })
                        });
                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            handleQueryInfoCallBackPie(obj) {
                this.getPlatformsRefundPieInfo(obj).then(({ data }) => {
                    if (data.status) {
                        // 保存查询参数
                        this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                            key: 'platforms_refund_count',
                            value: JSON.stringify(this.queryData)
                        });

                        let item = [[], []];
                        let seriesData = [];

                        if (data.data.data.length) {
                            data.data.data.forEach(_v => {
                                item[0].push(_v.refund_usd_total_price);
                                item[1].push(_v.name);
                            });

                            option.legend.data = item[1];

                            option.legend.data.forEach((_item, index) => {
                                seriesData.push({
                                    value: item[0][index] * 1,
                                    name: item[1][index]
                                })
                            });
                        }

                        option.series = option.series.map(_v => {
                            return {
                                ..._v,
                                data: seriesData
                            }
                        });
                        this.init(option)

                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }

                }).catch(err => {
                    console.log(err);
                });
            },
        },
        activated() {
            this.chartData.forEach(item => {
                this.$refs[item.target][0].scroll && this.$refs[item.target][0].scroll();
            })
        },
        created () {

            this.thisVm = this;

            getOptionList().then(({ data }) => {
                this.optionList.platformList = data.data;
            });

            // 默认时间
            this.queryData.paymentTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
            this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
            this.handleQueryInfo();
        },
        mounted() {
            this.init(option);
        },
    };
</script>

<style lang="less" scoped>
    .ui-content_area {
        position: relative;
        height: 100%;
        .ui-content_area--left {
            width: 200px;
            position: absolute;
            top: 0;
            left: 0;
            /*height: 100%;*/
            height: 390px;
            overflow: auto;
            z-index: 1;
            border-right: 1px solid #e6e6e6;
            border-bottom: 1px #e6e6e6 solid;
        }
        .ui-content_area--main {
            position: relative;
            /*height: 100%;*/
            height: 390px;
            overflow: auto;
            padding-left: 210px;
            width: 100%;
            box-sizing: border-box;
            background: #ffffff;
            border-bottom: 1px #e6e6e6 solid;
        }

        .ui-mix_area--left {
            position: absolute;
            top: 400px;
            width: 65%;
            height: 320px;
            background: #ffffff;
            float: left;
        }

        .ui-mix_area--right {
            position: absolute;
            left: 66%;
            top: 400px;
            width: 34%;
            height: 320px;
            background: #ffffff;
            /*float: right;*/
        }
    }

    /deep/.ui-checkbox .ui-search_require {
        width: 100px!important;
    }
    .ui-main-module .ui-main-module-search li:nth-child(2) .ui-search_require {
        /*width: 220px!important;*/
    }
    .ui-main-module .ui-main-module-search li:nth-child(3) .ui-search_require {
        /*width: 250px!important;*/
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

    @border: 1px solid #e6e6e6;

    /deep/.ui-main-module-table {
        .el-table .cell {
            padding: 8px 2px!important;
        }
        .el-table {
            border-top: @border;
            border-left: @border;
            text-align: center;
        }
        .el-table tr td {
            text-align: center;
            border-bottom: @border;
            border-right: @border;
            color: #000;
        }
        .el-table tr th {
            text-align: center;
            border-bottom: @border;
            border-right: @border;
            background: #FFFFFF!important;
            color: #000;
        }

        //平台框线处理 #d4e5ff
        .el-table tr th[colspan="2"],
        .el-table tr th[rowspan="1"]:nth-child(2n),
        .el-table tr th[colspan="1"]:first-child:not([rowspan="1"]),
        .el-table tr td:nth-child(2n-1){
            border-right: 1px solid #d3e9fa;
        }
    }

    .ui-echarts {
        width: 100%;
        height: 100%;
    }

</style>
