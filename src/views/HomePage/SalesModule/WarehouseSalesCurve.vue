<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement v-model="queryData.sales_type" label="统计类型" template="select"
                                           :options="optionList.countTypeList" @changes="handleChangeType">
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
                    <!--<li v-if="queryData.sales_type !== 'm'">-->
                        <!--<SearchRequirement label="付款时间" v-model="queryData.paymentTime" template="daterange" :isOption="false"-->
                                           <!--:pickerOptions="pickerOptions">-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <!--<li v-else>-->
                        <!--<SearchRequirement label="付款时间" v-model="queryData.paymentTime"  template="daterangeym" :isOption="false">-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <li>
                        <SearchRequirement label="平台">
                            <el-select size="small" v-model="queryData.platform" collapseTags multiple filterable v-filter>
                                <el-option v-for="item in optionList.platformList"
                                           :key="item.platform_code"
                                           :value="item.platform_code"
                                           :label="item.platform_name"></el-option>
                            </el-select>
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
                    <p class="ui-title">数据来源：来源ERP</p>
                    <p class="ui-title">付款时间维度:</p>
                    <p>1.有仓库且已付款</p>
                    <p>2.普通订单、合并后的订单、拆分后的子订单、被重寄的订单、客户补款的订单（排除被合并的订单、拆分的主订单、重寄后的订单）</p>
                    <p class="ui-title">发货时间维度:</p>
                    <p>1.有仓库且已付款且已发货</p>
                    <p>2.普通订单、合并后的订单、拆分后的子订单、被重寄的订单、客户补款的订单（排除被合并的订单、拆分的主订单、重寄后的订单）</p>
                </div>
                <el-button slot="reference" type="text" icon="el-icon-info">统计规则</el-button>
            </el-popover>
        </div>
        <TemplateDefault :staticNum="132" color="#FFFFFF">
            <div class="ui-content_area clearFix">
                <div class="ui-content_area--left">
                    <el-tree :data="groupTree" :props="groupTreeProps" ref="myTree" node-key="target"
                             :auto-expand-parent="false"
                             :expand-on-click-node="false"
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
        getThirtyDayDateRange
    } from '@/services/index';

    import {
        getMonthRange
    } from '../../../api/common/date_format'

    import {
        mapActions,
        mapGetters
    } from 'vuex';

    import {
        getWarehouseSalesCurve,
        getWarehouseTreeList,
        getPlatformList
    } from '@/api/sales_module/warehouse_sales_curve';

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'warehouse_sales_curve';
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
                    obj_type: 'all',
                    warehouse_type: '',
                    sales_type: 'd',
                    date_type: '1',
                    platform: [],
                    paymentTime: [],
                },

                optionList: {
                    countTypeList: {
                        'd': '日',
                        'm': '月'
                    },
                    platformList: [],
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

                saveDefaultTime: [],

                // 小组Tree
                groupTree: [],
                allGroupTree: [],
                groupTreeProps: {
                    label: 'value',
                    value: 'key',
                    isLeaf: true
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
            getWarehouseSalesCurve,

            // 列表信息查询
            handleQueryInfo (params, isFn, item, success) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['warehouse_sales_curve']);
                }


                let obj = {
                    start_date: this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime[1],
                    sales_type: this.queryData.sales_type,
                    date_type: this.queryData.date_type,
                    warehouse_type: this.queryData.warehouse_type,
                    platform_code: this.queryData.platform.join(","),
                    obj_type: this.queryData.obj_type
                };

                this.getWarehouseSalesCurve(obj).then(({data}) => {
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
                    date_type: '1',
                    obj_type: 'all',
                    warehouse_type: '',
                    platform: [],
                    paymentTime: this.saveDefaultTime,
                }
            },

            //监听日期类型
            handleChangeType(val) {
                if(val === 'd'){
                    this.queryData.paymentTime = this.saveDefaultTime
                }else {
                    this.queryData.paymentTime = this.handleFirst12Month();
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
                this.chartData.splice(0);
                this.$nextTick().then(() => {
                    this.chartData = data;
                })
            },

            // 树形节点被点击
            handleNodeClick(item, type = 'on') {
                // 点击查询按钮
                if (item && item.type === 'all') {
                    this.queryData.obj_type = 'all';
                    this.chartData.splice(0);
                    // 收起树形菜单
                    const treeData = JSON.parse(JSON.stringify(this.allGroupTree));
                    this.groupTree.splice(0);
                    this.$nextTick().then(() => {
                        this.groupTree = treeData;
                    });

                    this.handleQueryInfo();
                    return;
                }

                // 点击树形节点名称
                if (type === 'click') {
                    this.queryData = JSON.parse(this.queryParamsInfo['warehouse_sales_curve']);
                    const areaEl = document.querySelector('.ui-content_area--main');
                    if (item.key === '0') {
                        areaEl.scrollTop = 0;
                    } else {
                        this.$nextTick().then(() => {
                            const itemTop = this.$refs[`${item.target}`][0].$el.getBoundingClientRect().top;
                            const areaTop = areaEl.scrollTop;
                            areaEl.scrollTop = areaTop + itemTop - 178;
                        })
                    }
                    return;
                }

                // 展开一级节点
                if (item.key === '0' && type === 'on') {
                    this.queryData = JSON.parse(this.queryParamsInfo['warehouse_sales_curve']);
                    this.queryData.obj_type = 'type';

                    this.handleQueryInfo();

                } else if (item.children && item.children.length && type === 'on'){
                    this.queryData = JSON.parse(this.queryParamsInfo['warehouse_sales_curve']);
                    this.queryData.obj_type = 'alias';
                    this.queryData.warehouse_type = item.key;

                    this.handleQueryInfo({}, false, item);

                } else if (item.key === '0' && type === 'off'){

                    this.handleRefreshEChart([this.chartData[0]]);

                    // 刷新子节点
                    const children = [...item.children];
                    item.children.splice(0);
                    this.$nextTick().then(() => {
                        console.log(item.target)
                        this.$refs.myTree.updateKeyChildren(item.target, children);
                    })
                } else if (type === 'off' && this.queryChartData[item.target]) {

                    // 刷新子节点
                    const children = [...item.children];
                    item.children.splice(0);
                    this.$nextTick().then(() => {
                        this.$refs.myTree.updateKeyChildren(item.target, children);
                    })
                    let chartData = [...this.chartData];
                    for (let i = 0; i < this.chartData.length; i++) {
                        const _v = this.chartData[i];
                        if (_v.original_name === item.value) {
                            const delLength = this.handleGetOffCount(item.target);
                            chartData.splice(i + 1, delLength);
                            break;
                        }
                    }

                    this.chartData.splice(0);
                    this.$nextTick().then(() => {
                        this.chartData = [...chartData]
                    })
                }
            },

            // 获取收取图表数量
            handleGetOffCount(key) {
                let countLength = this.queryChartData[key].length;
                const children = this.queryChartData[key];

                const callBack = (arr) => {
                    for (let i = 0; i < arr.length; i++) {
                        if (this.queryChartData[arr[i].target]) {
                            countLength += this.queryChartData[arr[i].target].length;
                            callBack(this.queryChartData[arr[i].target]);
                            delete this.queryChartData[arr[i].target]
                        }
                    }
                }

                callBack(children);

                return countLength;
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
            handleQueryInfoCallBack ({ data }, item, success, params) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'warehouse_sales_curve',
                    value: JSON.stringify(this.queryData)
                });

                // this.queryChartData = Array.isArray(data) ? data : [data];
                if (item) {
                    let arr = [...this.chartData];
                    for(let i = 0; i < this.chartData.length; i++) {
                        const _v = this.chartData[i];
                        if (_v.original_name === item.value) {
                            arr.splice(i + 1, 0, ...data.data);
                            break;
                        }
                    }
                    this.queryChartData[item.target] = data.data;
                    this.chartData.splice(0);
                    this.$nextTick().then(() => {
                        this.chartData = [...arr]
                    })
                } else if (params && params.type === 'all') {
                    this.chartData.splice(0);
                    this.$nextTick().then(() => {
                        this.chartData = [data.data];
                    })
                } else {
                    let chartData = [...this.chartData];

                    if (this.chartData.length) {
                        chartData = [chartData[0], ...data.data]
                    } else {
                        chartData = [...data.data];
                    }
                    this.handleRefreshEChart(chartData)
                }

                success && success();
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

            getWarehouseTreeList().then(({ data }) => {

                getPlatformList().then(({ data }) => {
                    if (data.status) {
                        this.optionList.platformList = data.data
                    }
                });
                // 根据返回的树状数据判断是否需要显示
                if (!data.data || !data.data.length) return;

                // 移动Kevin团队跟所有同级
                const treeData = [
                    {
                        value: '所有',
                        key: '0',
                        type: 'group',
                        target: 'TOTAL',
                        children: data.data
                    }
                ];

                this.allGroupTree = JSON.parse(JSON.stringify(treeData));
                this.handleQueryInfo(false, false, false, () => {
                    this.groupTree = [...treeData];
                });
            })
        },
    };
</script>

<style lang="less" scoped>
    /deep/.el-tree-node>.el-tree-node__children {
        overflow: visible;
    }
    .ui-content_area {
        position: relative;
        height: 100%;
        .ui-content_area--left {
            /*float: left;*/
            width: 250px;
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
            padding-left: 260px;
            width: 100%;
            box-sizing: border-box;
        }
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
