<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement v-model="queryData.summary_type" label="统计类型" template="select"
                                           :options="optionList.countTypeList" @changes="handleChangeType">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.summary_type !== 'm'">
                        <SearchRequirement label="统计日期" v-model="queryData.paymentTime" template="daterange" :isOption="false">
                        </SearchRequirement>
                    </li>
                    <li v-else>
                        <SearchRequirement label="统计月份" v-model="queryData.paymentTime" template="daterangeym">
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :params="{type: 'all'}" :query-fn="handleNodeClick" :reset-fn="handleResetQueryInfo"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <!--<span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon-->
            <!--:name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>-->
        </div>
        <TemplateDefault :staticNum="120" color="#FFFFFF">
            <div class="ui-content_area clearFix">
                <div class="ui-content_area--left">
                    <el-tree ref="myTree" :data="groupTree" :props="groupTreeProps" :auto-expand-parent="false"
                             :expand-on-click-node="false" node-key="target"
                             @node-click="(v) => { handleNodeClick(v, 'click') }"
                             @node-expand="(v) => { handleNodeClick(v, 'on') }"
                             @node-collapse="(v) => { handleNodeClick(v, 'off') }"></el-tree>
                </div>
                <div class="ui-content_area--main">
                    <ComEchart name="brCurve" :ref="item.target" v-for="(item, index) in chartData" width="100%" :key="index" :data="item"
                               :show-line="queryData.showLine"></ComEchart>
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
        getBrStatementCurveInfo,
        getTreeList
    } from '@/api/sales_module/br_curve';

    import {
        getMonthRange,
        getTotalDays,
        getCurrentMonth,
        getCurrentDate
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'br_curve';
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
                    obj_type: 'all',
                    group_id: '',
                    team_id: '',
                    summary_type: 'd',
                    paymentTime: [],
                    showLine: ['sessions', 'pv']
                },

                optionList: {
                    countTypeList: {
                        'd': '日',
                        'm': '月'
                    },
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
                    }
                },
            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'storeKey',
                'loginInfo'
            ])
        },
        methods: {
            ...mapActions([
                'Fn'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,
            getBrStatementCurveInfo,

            // 列表信息查询
            handleQueryInfo (params, isFn, item, success) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['br_curve']);
                }

                let obj = {
                    summary_type: this.queryData.summary_type,
                    obj_type: this.queryData.obj_type,
                    group_id: this.queryData.group_id,
                    team_id: this.queryData.team_id,
                    start_date: this.queryData.paymentTime && this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime && this.queryData.paymentTime[1],
                    user_number: this.loginInfo.staff_code,
                };

                this.getBrStatementCurveInfo(obj).then(({data}) => {
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
                    obj_type: 'all',
                    group_id: '',
                    team_id: '',
                    summary_type: 'd',
                    paymentTime: this.saveDefaultTime,
                    showLine: ['sessions', 'pv']
                }
            },


            //监听日期类型
            handleChangeType(val) {
                if(val){
                    this.queryData.paymentTime = [];
                    if(val === 'm') {
                        getMonthRange().then((data) => {
                            this.queryData.paymentTime = [data.start, data.end];
                        });
                    }else {
                        this.queryData.paymentTime = this.saveDefaultTime
                    }
                }
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
                    this.queryData.group_id = '';
                    this.queryData.team_id = '';
                    this.chartData.splice(0);

                    // 收起树形菜单
                    const treeData = JSON.parse(JSON.stringify(this.allGroupTree));
                    this.groupTree.splice(0);

                    this.$nextTick().then(() => {
                        this.groupTree = treeData;
                    })

                    this.handleQueryInfo();
                    return;
                }

                // 点击树形节点名称
                if (type === 'click') {
                    this.queryData = JSON.parse(this.queryParamsInfo['br_curve']);
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
                    this.queryData = JSON.parse(this.queryParamsInfo['br_curve']);
                    this.queryData.obj_type = item.children[0].type;
                    this.queryData.group_id = '';
                    this.queryData.team_id = '';

                    this.handleQueryInfo();

                } else if (item.children && item.children.length && type === 'on'){

                    this.queryData = JSON.parse(this.queryParamsInfo['br_curve']);
                    this.queryData.obj_type = item.children[0].type;

                    if (item.type === 'team') {
                        this.queryData.group_id = '';
                    }

                    if (item.team_id) {
                        this.queryData.team_id = item.team_id;
                    }
                    this.queryData[`${item.type}_id`] = item.key;

                    this.handleQueryInfo({}, false, item);

                } else if (item.key === '0' && type === 'off'){

                    this.handleRefreshEChart([this.chartData[0]]);

                    // 刷新子节点
                    const children = [...item.children];
                    item.children.splice(0);
                    this.$nextTick().then(() => {
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

            // 限制时间
            handleDisTime(date) {
                return false
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
                    key: 'br_curve',
                    value: JSON.stringify(this.queryData)
                });

                // this.queryChartData = Array.isArray(data) ? data : [data];
                if (item) {
                    let arr = [...this.chartData];
                    for(let i = 0; i < this.chartData.length; i++) {
                        const _v = this.chartData[i];
                        if (_v.original_name === item.value) {
                            arr.splice(i + 1, 0, ...data);
                            break;
                        }
                    }
                    this.queryChartData[item.target] = data;
                    this.chartData.splice(0);
                    this.$nextTick().then(() => {
                        this.chartData = [...arr]
                    })
                } else if (params && params.type === 'all') {
                    this.chartData.splice(0);
                    this.$nextTick().then(() => {
                        this.chartData = [data];
                    })
                } else {

                    let chartData = [...this.chartData];

                    if (this.chartData.length) {
                        chartData = [chartData[0], ...data]
                    } else {
                        chartData = [...data];
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

            getTreeList({ user_number: this.loginInfo.staff_code }).then(({ data }) => {

                // 根据返回的树状数据判断是否需要显示
                if (!data.data.category_list || !data.data.category_list.length) return;

                // 移动Kevin团队跟所有同级
                const treeData = [
                    {
                        value: '所有',
                        key: '0',
                        type: 'group',
                        target: 'group_0',
                        children: data.data.category_list
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
</style>
