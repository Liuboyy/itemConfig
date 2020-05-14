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
                <FilterBtn refTable="tableArea" :params="{type: 'all'}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
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

        <BrCount
                ref="myTable"
                rowKey="id"
                :tableKey="tableKey"
                :tableData="tableData"
                :showSearch="showSearch"
                :load="handleTableOpen">
        </BrCount>


        <!--<ComTableInfo-->
                <!--ref="myTable"-->
                <!--rowKey="id"-->
                <!--:tableKey="tableKey"-->
                <!--:tableProps="tableProps"-->
                <!--:tableData="tableData"-->
                <!--:tableMinWidth="tableMinWidth"-->
                <!--:showSearch="showSearch"-->
                <!--:load="handleTableOpen">-->
        <!--</ComTableInfo>-->

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
        getBrStatementCountInfo
    } from '@/api/sales_module/br_count';

    import {
        getMonthRange,
        getTotalDays,
        getCurrentMonth,
        getCurrentDate
    } from '@/api/common/date_format'

    import BrCount from '../Components/BrCount.vue'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'br_count';
    export default {
        name: component_name,
        components: { BrCount },
        data () {
            return {

                // 时间搜索框宽度设置
                searchDateWidth: config.SEARCH_DATE_WIDTH,

                thisVm: {},

                // 搜索缩进
                showSearch: true,
                saveDefaultTime: [],

                queryData: {
                    group_id: '',
                    summary_type: 'd',
                    paymentTime: [],
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
                tableMinWidth: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

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
            getBrStatementCountInfo,

            // 列表信息查询
            handleQueryInfo (params, isFn,) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['br_count']);
                }

                let obj = {
                    summary_type: this.queryData.summary_type,
                    group_id: this.queryData.group_id,
                    start_date: this.queryData.paymentTime && this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime && this.queryData.paymentTime[1],
                    user_number: this.loginInfo.staff_code,
                    ...params
                };

                this.getBrStatementCountInfo(obj).then(({data}) => {
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败')
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData = {
                    group_id: '',
                    summary_type: 'd',
                    paymentTime: this.saveDefaultTime,
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

            handleTableOpen({group_id}, treeNode, resolve) {

                this.queryData = JSON.parse(this.queryParamsInfo['br_count']);

                let obj = {
                    summary_type: this.queryData.summary_type,
                    group_id: group_id,
                    start_date: this.queryData.paymentTime && this.queryData.paymentTime[0],
                    end_date: this.queryData.paymentTime && this.queryData.paymentTime[1],
                    user_number: this.loginInfo.staff_code,
                };

                getBrStatementCountInfo(obj).then(({data}) => {
                    resolve(data.data.value.map((_v, _i) => {
                        this.$nextTick().then(() => {
                            this.$refs.myTable.handleRefreshTableHeight();
                        });
                        return {
                            ..._v,
                            id: `${group_id}_${_i}`
                        }
                    }));
                }).catch(err => {
                    console.log(err);
                });

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
                    is_excel: 1,
                }, true)
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
                    key: 'br_count',
                    value: JSON.stringify(this.queryData)
                });

                this.tableKey = data.data.key.splice(2);
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data.value.map((item, index) => {
                        return {
                            ...item,
                            hasChildren: !!index,
                            id: index + 1
                        }
                    });
                });


            }
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

</style>
