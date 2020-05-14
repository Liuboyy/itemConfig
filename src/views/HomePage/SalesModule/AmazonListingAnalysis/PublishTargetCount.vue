<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li v-show="queryData.query_type === 'enter'">
                        <SearchRequirement label="年份">
                            <el-date-picker
                                    type="year"
                                    size="small"
                                    v-model="queryData.year"
                                    placeholder="选择年"
                                    :clearable="false"
                                    format="yyyy"
                                    value-format="yyyy">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.query_type === 'enter'">
                        <SearchRequirement label="小组名称">
                            <el-select size="small" v-model="queryData.groupName" filterable v-filter>
                                <el-option v-for="item in optionList.groupNameList"
                                           :key="item.group_id"
                                           :value="item.group_id"
                                           :label="item.group_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-show="queryData.query_type === 'count'">
                        <SearchRequirement label="付款时间" v-model="queryData.paymentTime" template="daterange" :isOption="false">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.query_type === 'count'">
                        <SearchRequirement label="渠道">
                            <el-select size="small" v-model="queryData.fulfillmentType">
                                <el-option v-for="item in optionList.fulfillmentTypeList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <!--<li v-if="queryData.query_type === 'count'">-->
                        <!--<SearchRequirement v-model="queryData.summaryType" label="统计类型" template="select" :options="optionList.countTypeList">-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                </ul>
                <FilterBtn refTable="tableArea" :params="{group_id: ''}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo" v-if="queryData.query_type !== '0'"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button
                    v-if="item.method && item.permit(thisVm) && item.icon && queryData.query_type === 'count'"
                    v-for="item in buttonList"
                    size="small"
                    :type="item.type"
                    :key="item.value"
                    :icon="item.icon"
                    @click="item.action(thisVm, item.method)">{{item.name}}</el-button>
        </div>
        <div class="ui-tabs_box">
            <el-tabs v-model="queryData.query_type" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="目标完成统计" name="count" v-if="buttonList['count'].permit(thisVm)"></el-tab-pane>
                <el-tab-pane label="目标录入" name="enter" v-if="buttonList['enter'].permit(thisVm)"></el-tab-pane>
            </el-tabs>
        </div>
        <ComTableInfo
                ref="myTable"
                rowKey="id"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableMinWidth="tableMinWidth"
                :showSearch="showSearch"
                :otherHeight="['el-tabs__header']"
                :load="handleTableOpen">
            <template slot="current_month" slot-scope="scope">
                <el-input-number v-if="scope.row.user_id !=='0'" v-model="scope.row.current_month" controls-position="right" @change="handleEnterTargetInfo(scope.row)" :min="0" size="small" :step="1" step-strictly></el-input-number>
                <span v-else>{{scope.row.current_month}}</span>
            </template>
            <template :slot="item" slot-scope="scope" v-for="(item, index) in tableDateProps">
                <span :style="scope.row.user_id !== '0' && scope.row[item] && scope.row[item].finish === 1 ? 'color: #6ac044' : ''">{{scope.row[item] && scope.row[item].num}}</span>
            </template>
        </ComTableInfo>
    </div>
</template>

<script>
    import config from '@/assets/js/config';

    import {
        mapActions,
        mapGetters
    } from 'vuex';
    import {
        getPublishTargetEnterInfo,
        getSetTargetNumInfo,
        getGroupList,
        getPublishTargetCountInfo
    } from '@/api/sales_module/publish_target_count';

    import {
        getCurrentYear,
        getCurrentMonth
    } from '@/api/common/date_format'

    import {
        getThirtyDayDateRange
    } from '@/services/index'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'publish_target_count';

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
                    group_id: '',
                    query_type: '',
                    year: '',
                    groupName: '',
                    targetNum: '',
                    paymentTime: [],
                    fulfillmentType: '',
                    summaryType: 'd',
                },
                saveDefaultYear: '',
                saveCurrentMonth: '',

                optionList: {
                    moduleTypeList: [
                        {
                            label: '目标完成统计',
                            value: 'count',
                        },
                        {
                            label: '目标录入',
                            value: 'enter',
                        },
                    ],
                    groupNameList: [],
                    fulfillmentTypeList: [],
                    countTypeList: [],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth: [],
                tableDateProps: [],

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
                'publishSalesCountInfo'
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'GetPublishSalesCountInfo'
            ]),
            getPublishTargetEnterInfo,
            getPublishTargetCountInfo,
            getSetTargetNumInfo,
            getThirtyDayDateRange,
            getGroupList,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['publish_sales_count']);
                }

                if(this.queryData.query_type === '0') {
                    this.$message.warning('请联系管理员开通权限！');
                    return;
                }

                let obj = this.queryData.query_type === 'enter' ? {
                    year: this.queryData.year,
                    group_id2: this.queryData.groupName,
                    ...params
                } : {
                    start_date: this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime[1],
                    summary_type: this.queryData.summaryType,
                    fulfillment_type: this.queryData.fulfillmentType,
                    ...params
                };
                let fnName = this.queryData.query_type === 'enter' ? this.getPublishTargetEnterInfo : this.getPublishTargetCountInfo;
                fnName(obj).then(({data}) => {
                    if(data.status === 2) return ;
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
                this.queryData.group_id = '';
                this.queryData.groupName = 0;
                this.queryData.year = this.saveDefaultYear;
                this.queryData.paymentTime = this.saveDefaultTime;
                this.queryData.fulfillmentType = '';
                this.queryData.summaryType = 'd';
            },


            //修改目标值
            handleEnterTargetInfo(row) {
                let reg = /^[0-9]+$/;
                if (!reg.test(row.current_month)) {
                    this.$message.warning('请输入正整数');
                    this.$nextTick(() => {
                        row.current_month = 0;
                    });
                    return;
                }

                clearTimeout(this.times);

                this.times = setTimeout(() => {
                    this.getSetTargetNumInfo({
                        target_month: this.saveCurrentMonth,
                        group_id: row.group_id,
                        user_id: row.user_id,
                        target_value: row.current_month,
                    }).then(({ data }) => {
                        if(data.status) {
                            this.$message.success('修改成功');
                        }else {
                            this.$message.error(data.erroeMess || '操作失败')
                        }
                        this.handleTableOpen(row);
                    });

                }, 800);
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

            handleTabClick(tab) {
                this.queryData.query_type = tab.name;
                this.queryData.group_id = '';
                this.handleQueryInfo();
            },

            // 展开表格
            handleTableOpen({group_id, id}, treeNode, resolve) {
                this.queryData = JSON.parse(this.queryParamsInfo['publish_sales_count']);
                this.queryData.group_id = group_id;

                let obj = {};
                let fnName = '';
                if(this.queryData.query_type === 'enter') {
                    fnName = this.getPublishTargetEnterInfo;
                    obj = {
                        year: this.queryData.year,
                        group_id: this.queryData.group_id,
                    };
                }else {
                    fnName = this.getPublishTargetCountInfo;
                    obj = {
                        start_date: this.queryData.paymentTime[0],
                        end_date: this.queryData.paymentTime[1],
                        summary_type: this.queryData.summaryType,
                        fulfillment_type: this.queryData.fulfillmentType,
                        group_id: this.queryData.group_id,
                    }
                }
                fnName(obj).then(({data}) => {
                    resolve(data.data.value.map((_v, _i) => {
                        this.$nextTick().then(() => {
                            this.$refs.myTable.handleRefreshTableHeight();
                        });
                        return {
                            ..._v,
                            id: `${id}_${_i}`,
                        };
                    }));
                }).catch(err => {
                    console.log(err);
                });
            },

            // 操作回调
            handleOperationCallBack (data, successFn, errorFn) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    if(this.isShowModify) this.isShowModify = false;
                    this.handleQueryInfo();
                    successFn && successFn();
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                    errorFn && errorFn();
                }
            },

            //查询回调
            handleQueryInfoCallBack ({data}) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'publish_sales_count',
                    value: JSON.stringify(this.queryData)
                });


                //数据渲染
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.value.map((_v, index) => {
                        return {
                            ..._v,
                            id: index + 1,
                            hasChildren: this.queryData.query_type === 'enter' ? true : !!index,
                        }
                    });
                });

                if(this.queryData.query_type === 'enter') {
                    this.tableKey = Object.values(data.key);
                    const props = Object.keys(data.key);
                    props.splice(0, 1);
                    this.tableProps = ['group_name', ...props];
                    this.tableMinWidth = this.tableProps.map(item => {
                        if(item === 'group_name') return '130';
                        return '70';
                    });
                }else {
                    this.tableKey = data.key;
                    const props = [...data.key];
                    props.splice(0, 2);
                    this.tableDateProps = [...props];
                    this.tableProps = ['group_name','total_kd_num', ...props];
                    this.tableMinWidth = this.tableProps.map(item => {
                        if(item === 'group_name') return '150';
                        return '90';
                    });

                    this.optionList.fulfillmentTypeList = data.fulfillment_list;
                    this.optionList.countTypeList = data.summary_type_list;
                }
            }
        },
        created () {
            this.thisVm = this;
            try {

                const queryModule = ['enter','count'];
                for (let i = 0; i < queryModule.length; i++) {
                    if (this.buttonList[queryModule[i]].permit()) {
                        this.queryData.query_type = queryModule[i];
                    }
                }

                this.getGroupList().then(({ data }) => {
                    this.optionList.groupNameList = data.data
                });

                this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
                this.queryData.paymentTime = this.saveDefaultTime;

                getCurrentMonth().then(( data ) => {
                    this.saveCurrentMonth = data.month;
                    getCurrentYear().then(( data ) => {
                        this.saveDefaultYear = data.year;
                        this.queryData.year = this.saveDefaultYear;
                        this.queryData.groupName = 0;
                        this.handleQueryInfo();
                    });
                });
            } catch (e) {
                console.log(e);
            }
        },
    };
</script>

<style lang="less" scoped>
    /deep/.ui-main-module-table {
        .el-input--small .el-input__inner {
            height: 32px!important;
            line-height: 32px!important;
        }
    }

    /deep/.el-table__indent {
        padding-left: 10px!important;
    }

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0!important;
    }

</style>
