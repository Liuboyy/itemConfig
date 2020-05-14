<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计日期">
                            <el-date-picker
                                    size="small"
                                    :clearable="false"
                                    v-model="queryData.select_date"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd">
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
                    <li>
                        <SearchRequirement label="动销范围">
                            <el-select size="small" v-model="queryData.range" filterable v-filter>
                                <el-option
                                        v-for="(label, value) in optionList.rangeList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :params="{group_id: ''}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
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
        <ComTableInfo
                ref="myTable"
                rowKey="id"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="['160','160']"
                :showSearch="showSearch"
                :otherHeight="['ui-main-tab']"
                :load="handleTableOpen">
            <template slot="rate_total" slot-scope="scope">
                <el-progress :percentage="scope.row.rate_total" :text-inside="true" :stroke-width="14"
                             :color="scope.row.account_id ? '#94c5ae' : '#62b0ff'"></el-progress>
            </template>
            <template slot="rate_30" slot-scope="scope">
                <el-progress :percentage="scope.row.rate_30" :text-inside="true" :stroke-width="14"
                             :color="scope.row.account_id ? '#94c5ae' : '#62b0ff'"></el-progress>
            </template>
            <template slot="rate_60" slot-scope="scope">
                <el-progress :percentage="scope.row.rate_60" :text-inside="true" :stroke-width="14"
                             :color="scope.row.account_id ? '#94c5ae' : '#62b0ff'"></el-progress>
            </template>
            <template slot="rate_90" slot-scope="scope">
                <el-progress :percentage="scope.row.rate_90" :text-inside="true" :stroke-width="14"
                             :color="scope.row.account_id ? '#94c5ae' : '#62b0ff'"></el-progress>
            </template>
            <template slot="rate_180" slot-scope="scope">
                <el-progress :percentage="scope.row.rate_180" :text-inside="true" :stroke-width="14"
                             :color="scope.row.account_id ? '#94c5ae' : '#62b0ff'"></el-progress>
            </template>
        </ComTableInfo>
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
        getListingMoveDataAccountReportInfo
    } from '@/api/am_order_count/listing_move_data';

    import {
        getCurrentDate
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'listing_move_data';

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
                    select_date: '',
                    canal: '',
                    range: '',
                },
                saveDefaultTime: [],

                optionList: {
                    countTypeList: {
                        'd': '日'
                    },
                    fulfillmentList: [],
                    channelList: {
                        '': '全部',
                        'FBA': 'FBA',
                        'FBM': 'FBM'
                    },
                    rangeList: {
                        3: '30日动销',
                        4: '60日动销',
                        5: '90日动销',
                        6: '180日动销',
                        7: '总动销',
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
                }
            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'listingMoveDataInfo',
                'loginInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetListingMoveDataGroupReportInfo'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,

            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    if (rowIndex === 0) {
                        return {
                            rowspan: 1,
                            colspan: 2
                        };
                    } else {
                        return {
                            rowspan: 1,
                            colspan: 1
                        };
                    }
                } else if (columnIndex === 1) {
                    if (rowIndex === 0) {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            },

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['listing_move_data']);
                }

                let obj = {
                    ...this.queryData,
                    user_number: this.loginInfo.staff_code,
                    range: this.queryData.range === ''? '3,4,5,6,7' : this.queryData.range,
                    ...params,
                };

                this.GetListingMoveDataGroupReportInfo(obj).then(({data}) => {

                    // 导出
                    if (!data.status) {
                        this.$message.error(data.errorMess || '查询失败！');
                        return;
                    }
                    this.handleQueryInfoCallBack(data);
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData = {
                    group_id: '',
                    canal: '',
                    range: '',
                    select_date: this.saveDefaultTime
                }
            },


            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1
                }, true)
            },

            // 表格展开
            handleTableOpen({ group_id, id, group_name }, treeNode, resolve) {
                this.queryData = JSON.parse(this.queryParamsInfo['listing_move_data']);
                this.queryData.group_id = group_id;
                let obj = {
                    ...this.queryData,
                    user_number: this.loginInfo.staff_code,
                    range: this.queryData.range === '7' ? '3,4,5,6,7' : this.queryData.range,
                };

                getListingMoveDataAccountReportInfo(obj).then(({data}) => {
                    resolve(data.data.value.map((_v, _i) => {
                        return {
                            ..._v,
                            group_name:`${group_name}`,
                            id: `${id}_${_i}`
                        }
                    }));
                }).catch(err => {
                    console.log(err);
                });
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
            handleQueryInfoCallBack ({data}) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'listing_move_data',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableData = data.value.map((_v, _i) => {
                    return {
                        ..._v,
                        id: _i + 1,
                        hasChildren: !!_i
                    }
                });
                this.tableKey = Object.values(data.key);
                const props = Object.keys(data.key);
                props.splice(0, 2);
                this.tableProps = ['group_name','account_name', ...props]
            }
        },
        created () {
            this.thisVm = this;
            try {
                getCurrentDate().then((data) => {
                    this.saveDefaultTime = data.date;
                    this.queryData.select_date = this.saveDefaultTime;
                    this.handleQueryInfo();
//                    if (JSON.stringify(this.listingMoveDataInfo) === '{}') {
//                        this.queryData.select_date = this.saveDefaultTime;
//                        this.handleQueryInfo();
//                    } else {
//                        // 获取保存的查询参数
//                        this.queryData = JSON.parse(this.queryParamsInfo['listing_move_data']);
//                        this.handleQueryInfoCallBack(this.listingMoveDataInfo);
//                    }
                });
            } catch (e) {
                console.log(e);
            }
        },
    };
</script>

<style lang="less" scoped>
    .ui-money {
        color: #ff9900;
    }
    /deep/.el-table__indent {
        padding-left: 10px!important;
    }
    /deep/.el-progress-bar__innerText {
        color: #333333;
    }
    /deep/.el-progress {
        width: 90%!important;
        .el-progress-bar__outer {
            background-color: #ebeef5!important;
        }
    }

</style>
