<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计类型">
                            <el-select size="small" @change="handleChangeType" v-model="queryData.countType">
                                <el-option
                                        v-for="(label, value) in optionList.countTypeList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.countType === 'd'">
                        <SearchRequirement label="统计日期" v-model="queryData.paymentTime" template="daterange" :isOption="false">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.countType === 'm'">
                        <SearchRequirement label="统计日期">
                            <el-date-picker
                                    size="small"
                                    :clearable="false"
                                    v-model="queryData.monthTime"
                                    type="monthrange"
                                    range-separator="至"
                                    start-placeholder="开始月份"
                                    end-placeholder="结束月份"
                                    format="yyyy-MM"
                                    value-format="yyyy-MM">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="渠道">
                            <el-select size="small" v-model="queryData.canal">
                                <el-option
                                        v-for="(label, value) in optionList.channelList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.countType === 'd'">
                        <SearchRequirement label="动销范围">
                            <el-select
                                    multiple
                                    collapseTags
                                    size="small"
                                    v-model="queryData.showLine"
                                    filterable
                                    v-filter>
                                <el-option
                                        v-for="(label, value) in optionList.showLineList"
                                        :key="value"
                                        :value="value"
                                        :label="value"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="是否kevin">
                            <el-select size="small" v-model="queryData.isKevin">
                                <el-option
                                        v-for="item in optionList.isKevinList"
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
                             :expand-on-click-node="false" :node-key="idKey"
                             @node-click="(v) => { handleNodeClick(v, 'click') }"
                             @node-expand="(v) => { handleNodeClick(v, 'on') }"
                             @node-collapse="(v) => { handleNodeClick(v, 'off') }"></el-tree>
                </div>
                <div class="ui-content_area--main">
                    <MoveCurve name="move_curve" :show-line-list="optionList.showLineList" :show-line="queryData.showLine" :ref="item.target" v-for="(item, index) in chartData" width="100%" :key="index" :data="item"></MoveCurve>
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
        getThirtyDayDateRange
    } from '@/services/index';
    import {
        mapActions,
        mapGetters
    } from 'vuex';
    import {
        getListingMoveCurveInfo,
        getTreeMenuListInfo,
        getAllInfo,
        getAllTeamInfo,
        getAllGroupInfo,
        getAllAccountInfo,
        getMonthCurveInfo
    } from '@/api/am_order_count/listing_move_curve';
    import {
        getFirstToCurrentMonthRange
    } from '@/api/common/date_format';
    import MoveCurve from './ECharts/MoveCurve';

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'listing_move_curve';

    export default {
        name: component_name,
        components: {MoveCurve},
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
                    group_id: '',
                    team_id: '',
                    paymentTime: [],
                    monthTime: [],
                    canal: '',
                    range: ['7'],
                    isKevin: '2',
                    is_kevin: '2',
                    showLine: ['30日动销', '60日动销', '90日动销', '180日动销', '总动销'],
                    countType: 'd',
                    dataType: 1
                },
                kevinId: '',

                optionList: {
                    countTypeList: {
                        'd': '日',
                        'm': "月"
                    },
                    channelList: {
                        '': '全部',
                        'FBA': 'FBA',
                        'FBM': 'FBM'
                    },
                    isKevinList: [
                        {
                            label: '全部',
                            value: '3'
                        },
                        {
                            label: '是',
                            value: '1'
                        },
                        {
                            label: '否',
                            value: '2'
                        }
                    ],
                    showLineList: {
                        '30日动销': 'rate_30',
                        '60日动销': 'rate_60',
                        '90日动销': 'rate_90',
                        '180日动销': 'rate_180',
                        '总动销': 'rate_total'
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
                allGroupTree: [],
                groupTreeProps: {
                    label: 'value',
                    value: 'key',
                    isLeaf: true,
                    children: 'children'
                },

                chartData: [],
                queryChartData: {},

                pickerOptions: {
                    disabledDate(time) {
                        return new Date(time).getTime() < 1514678400000
                    }
                },
                updateTree: {
                    key: '',
                    data: []
                },

                // 保存kevin item
                kevinItem: {
                    index: -1,
                    item: {},
                },

                // 唯一键
                idKey: 'target'
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
            getAllInfo,
            getAllTeamInfo,
            getAllGroupInfo,
            getAllAccountInfo,
            getMonthCurveInfo,
            getListingMoveCurveInfo,
            getFirstToCurrentMonthRange,

            // 列表信息查询
            handleQueryInfo (params, isFn, item, success, api = 'getAllInfo') {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['listing_move_curve']);
                }

                if(this.queryData.countType === 'd') {

                    // 映射接口所需参数
                    let list_params = {
                        'getAllGroupInfo': 'team_id',
                        'getAllAccountInfo': 'group_id',
                    }

                    let obj = {
                        start_date: this.queryData.paymentTime[0],
                        end_date: this.queryData.paymentTime[1],
                        user_number: this.loginInfo.staff_code,
                        canal: this.queryData.canal,
                        is_kevin: this.queryData.is_kevin,
                        type: 1
                    };

                    if (list_params[api]) {
                        obj[list_params[api]] = params.value;
                    }

                    this[api](obj).then(({data}) => {
                        if (!data.status) {
                            this.$message.error(data.errorMess || '查询失败！');
                            return;
                        }

                        this.handleQueryInfoCallBack(data, item, success, params);
                    }).catch(err => {
                        console.log(err);
                    });
                }else {
                    let obj = {
                        start_date: this.queryData.monthTime[0],
                        end_date: this.queryData.monthTime[1],
                        user_number: this.loginInfo.staff_code,
                        canal: this.queryData.canal,
                        is_kevin: this.queryData.is_kevin,
                        data_type: this.queryData.dataType,
                        team_id: this.queryData.team_id,
                        group_id: this.queryData.group_id,
                    };
                    this.getMonthCurveInfo(obj).then(({ data }) => {
                        if (!data.status) {
                            this.$message.error(data.errorMess || '查询失败！');
                            return;
                        }
                        this.handleQueryInfoCallBack(data, item, success, params);
                    })
                }
            },

            // 查询重置
            handleResetQueryInfo () {

                this.queryData = {
                    ...this.queryData,
                    group_id: '',
                    team_id: '',
                    is_kevin: '2',
                    isKevin: '2',
                    canal: '',
                    range: ['7'],
                    countType: 'd',
                    dataType: 1,
                    paymentTime: this.saveDefaultTime,
                    monthTime: this.saveDefaultMonth,
                    showLine: ['30日动销', '60日动销', '90日动销', '180日动销', '总动销'],
                };
                this.optionList.showLineList = {
                    '30日动销': 'rate_30',
                    '60日动销': 'rate_60',
                    '90日动销': 'rate_90',
                    '180日动销': 'rate_180',
                    '总动销': 'rate_total'
                };
            },

            //切换统计类型
            handleChangeType(val) {
                switch (val) {
                    case 'd':
                        this.queryData.paymentTime = this.saveDefaultTime;
                        this.queryData.showLine = ['30日动销', '60日动销', '90日动销', '180日动销', '总动销'];
                        this.optionList.showLineList = {
                            '30日动销': 'rate_30',
                            '60日动销': 'rate_60',
                            '90日动销': 'rate_90',
                            '180日动销': 'rate_180',
                            '总动销': 'rate_total'
                        };
                        break;
                    case 'm':
                        this.queryData.monthTime = this.saveDefaultMonth;
                        this.queryData.showLine = ['30日动销'];
                        this.optionList.showLineList = {
                            '30日动销': 'rate_30',
                        };
                        break;
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

                // 获取树props
                let {children, value, label} = this.groupTreeProps;
                let levelName = {
                    '1': 'team',
                    '2': 'group',
                    '3': 'account'
                }

                let apiList = {
                    '0': 'getAllTeamInfo',
                    '1': 'getAllGroupInfo',
                    '2': 'getAllAccountInfo',
                }

                // 点击查询按钮
                if (item && item.type === 'all') {

                    this.chartData.splice(0);

                    // 收起树形菜单
                    const treeData = JSON.parse(JSON.stringify(this.allGroupTree));
                    this.groupTree.splice(0);

                    // 判断是否显示kevin
                    this.queryData.is_kevin = this.queryData.isKevin;
                    if (this.queryData.is_kevin === '1') {
                        treeData[0][children] = [this.kevinItem.item]
                    } else if (this.queryData.is_kevin === '2') {
                        treeData[0][children].splice(this.kevinItem.index, 1);
                    }

                    this.queryData.dataType = 1;

                    this.$nextTick().then(() => {
                        this.groupTree = treeData;
                    });

                    this.handleQueryInfo(null, null, null, null, 'getAllInfo');
                    return;
                }

                // 点击树形节点名称
                if (type === 'click') {

                    this.queryData = JSON.parse(this.queryParamsInfo['listing_move_curve']);

                    const areaEl = document.querySelector('.ui-content_area--main');
                    if (item.key === '0') {
                        areaEl.scrollTop = 0;
                    } else {
                        this.$nextTick().then(() => {
                            let ref = '';
                            if(item.level === '0') {
                                ref = this.$refs[`${item.target}`][0]
                            }else {
                                ref = this.$refs[`${levelName[item.level]}_${item[value]}`][0]
                            }
                            const itemTop = ref.$el.getBoundingClientRect().top;
                            const areaTop = areaEl.scrollTop;
                            areaEl.scrollTop = areaTop + itemTop - 178;
                        })
                    }

                    return;
                }

                // 展开一级节点
                if (item.key === '0' && type === 'on') {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['listing_move_curve']);
                    this.handleQueryInfo();

                } else if (item[children] && item[children].length && type === 'on'){
                    this.queryData = JSON.parse(this.queryParamsInfo['listing_move_curve']);
                    if(this.queryData.countType === 'm') {//月度曲线
                        switch (item.obj_type) {
                            case"team":
                                this.queryData.dataType = 2;
                                break;
                            case"group":
                                this.queryData.dataType = 3;
                                this.queryData.team_id = item.target.replace(/^[a-zA-Z]+_/, '');
                                break;
                            case"account":
                                this.queryData.dataType = 4;
                                this.queryData.group_id = item.target.replace(/^[a-zA-Z]+_/, '');
                                break;
                        }
                    }
                    this.handleQueryInfo({value: item[value]}, false, item, null, apiList[item.level]);

                } else if (item.level === '0' && type === 'off'){
                    this.handleRefreshEChart([this.chartData[0]]);

                    // 刷新子节点
                    const childrens = [...item[children]];
                    item[children].splice(0);
                    this.$nextTick().then(() => {
                        this.$refs.myTree.updateKeyChildren(item[this.idKey], childrens);
                    })
                } else if (type === 'off' && this.queryChartData[item[this.idKey]]) {

                    // 刷新子节点
                    const childrens = [...item[children]];
                    item[children].splice(0);

                    this.$nextTick().then(() => {
                        this.$refs.myTree.updateKeyChildren(item[this.idKey], childrens);
                    });
                    let chartData = [...this.chartData];
                    for (let i = 0; i < this.chartData.length; i++) {
                        const _v = this.chartData[i];
                        if (_v.original_name === (this.queryData.countType === 'd' ? item[label] : item.value)) {
                            const delLength = this.handleGetOffCount(item[this.idKey]);
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
                        if (this.queryChartData[arr[i][this.idKey]]) {
                            countLength += this.queryChartData[arr[i][this.idKey]].length;
                            callBack(this.queryChartData[arr[i][this.idKey]]);
                            delete this.queryChartData[arr[i][this.idKey]]
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
                    key: 'listing_move_curve',
                    value: JSON.stringify(this.queryData)
                });

                let {label} = this.groupTreeProps;
                if (item) {
                    let arr = [...this.chartData];
                    for(let i = 0; i < this.chartData.length; i++) {
                        const _v = this.chartData[i];
                        if (_v.original_name === (this.queryData.countType === 'd' ? item[label] : item.value)) {
                            arr.splice(i + 1, 0, ...data);
                            break;
                        }
                    }
                    this.queryChartData[item[this.idKey]] = data;

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

            this.getFirstToCurrentMonthRange().then(( data ) => {
                this.saveDefaultMonth = [data.start, data.end];
                this.queryData.monthTime = this.saveDefaultMonth;
            });

            getTreeMenuListInfo({
                user_number: this.loginInfo.staff_code
            }).then(({ data }) => {

                // 根据返回的树状数据判断是否需要显示
                if (!data.data.category_list || !data.data.category_list.length) return;

                // 保存kevin信息后续对kevin 做对应的操作
                this.kevinItem.index = data.data.category_list.findIndex(item => {
                    if (item.value === 'Kevin团队') {
                        this.kevinItem.item = item;
                        return true;
                    }
                });

                // 移除Kevin团队
                // kevinIndex > -1 && data.data.category_list.splice(kevinIndex, 1);

                // 移动Kevin团队跟所有同级
                const treeData = [
                    {
                        value: '所有',
                        y_id: '0',
                        key: '-1',
                        type: 'group',
                        target: 'group_0',
                        obj_type: 'team',
                        level: '0',
                        children: data.data.category_list
                    }
                ];
                this.allGroupTree = JSON.parse(JSON.stringify(treeData));

                // 判断是否显示kevin
                if (this.queryData.is_kevin === '1') {
                    if (this.kevinItem.index === -1) {
                        delete treeData[0].children;
                    } else {
                        treeData[0].children = [this.kevinItem.item]
                    }
                } else if (this.queryData.is_kevin === '2') {
                    if (this.kevinItem.index > -1) {
                        treeData[0].children.splice(this.kevinItem.index, 1);
                    }
                }

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
