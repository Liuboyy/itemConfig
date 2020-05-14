<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement v-model="queryData.countType" label="统计类型" template="select" :options="optionList.countTypeList">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.countType !== 'm'">
                        <SearchRequirement label="付款时间" v-model="queryData.paymentTime" template="daterange" :isOption="false">
                        </SearchRequirement>
                    </li>
                    <li v-else>
                        <SearchRequirement label="付款时间" v-model="queryData.paymentTime" :isOption="false" template="daterangeym">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="是否发货">
                            <el-select size="small" v-model="queryData.status">
                                <el-option v-for="item in optionList.comList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
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
                    <ComListingEchart :ref="item.target" name="freightCost" v-for="(item, index) in chartData" width="100%" :key="index" :data="item"></ComListingEchart>
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
        getTreeDataList,
        getProductCostRatioCurveInfo
    } from '@/api/sales_module/product_cost_ratio_curve';

    import {
        getMonthRange
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'freight_rnb_curve';
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
                saveDefaultMonth: [],
                queryData: {
                    paymentTime: [],
                    countType: 'd',
                    status: '',
                    obj_type: 'all',
                    apart_id: '',
                    group_id: '',
                },

                optionList: {
                    countTypeList: {
                        'd': '日',
                        'w': '周',
                        'm': '月',
                    },
                    comList: [
                        { value: '', label: '全部'},
                        { value: '1', label: '是'},
                        { value: '0', label: '否'},
                    ],
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
                    label: 'name',
                    value: 'id',
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
            getTreeDataList,
            getProductCostRatioCurveInfo,

            // 列表信息查询
            handleQueryInfo (params, isFn, item, success) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['freight_rnb_curve']);
                }

                let obj = {
                    report_type: 2,
                    day_type: this.queryData.countType,
                    time_start: this.queryData.paymentTime[0],
                    time_end: this.queryData.paymentTime[1],
                    ship_status: this.queryData.status,
                    obj_type: this.queryData.obj_type,
                    apart_id: this.queryData.apart_id,
                    group_id: this.queryData.group_id,
                };

                this.getProductCostRatioCurveInfo(obj).then(({data}) => {
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
                    countType: 'd',
                    status: '',
                    obj_type: 'all',
                    apart_id: '',
                    group_id: '',
                    paymentTime: this.saveDefaultTime,
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
                    this.queryData.apart_id = '';
                    this.queryData.group_id = '';
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

                    this.queryData = JSON.parse(this.queryParamsInfo['freight_rnb_curve']);

                    const areaEl = document.querySelector('.ui-content_area--main');
                    if (item.id === '0') {
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

                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['freight_rnb_curve']);

                    this.queryData.obj_type = 'apart';
                    this.queryData.apart_id = '';
                    this.queryData.group_id = '';

                    this.handleQueryInfo();

                } else if (item.children && item.children.length && type === 'on'){


                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['freight_rnb_curve']);


                    if(item.flag === 'apart') {
                        this.queryData.obj_type = 'group';
                        this.queryData.apart_id = item.id;
                    }
                    if(item.flag === 'group') {
                        this.queryData.obj_type = 'account';
                        this.queryData.group_id = item.id;
                    }
//                    this.queryData[`${item.type}_id`] = item.key;

                    this.handleQueryInfo({}, false, item);

                } else if (item.key === '0' && type === 'off'){

                    //收起一级目录
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
                    });
                    let chartData = [...this.chartData];
                    for (let i = 0; i < this.chartData.length; i++) {
                        const _v = this.chartData[i];
                        if (_v.original_name === item.name) {
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
                    key: 'freight_rnb_curve',
                    value: JSON.stringify(this.queryData)
                });

                if (item) {
                    let arr = [...this.chartData];
                    for(let i = 0; i < this.chartData.length; i++) {
                        const _v = this.chartData[i];
                        if (_v.original_name === item.name) {
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
            getMonthRange().then(( data ) => {
                this.saveDefaultMonth = [data.start, data.end];
            });
            this.getTreeDataList().then(({ data }) => {

                if (!data.data.value || !data.data.value.length) return;

                const treeData = [
                    {
                        name: '所有',
                        key: '0',
                        type: 'platform',
                        target: 'all',
                        children: data.data.value
                    }
                ];
                this.allGroupTree = JSON.parse(JSON.stringify(treeData));
                // 默认时间
                this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
                this.queryData.paymentTime = this.saveDefaultTime;
                this.handleQueryInfo(false, false, false, () => {
                    this.groupTree = [...treeData];
                });
            })
        },
        watch: {
            'queryData.countType'(val) {
                if (val && val === 'm') {
                    this.queryData.paymentTime = this.saveDefaultMonth
                }else {
                    this.queryData.paymentTime = this.saveDefaultTime
                }
            }
        }
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
