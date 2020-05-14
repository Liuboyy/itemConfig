<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计日期">
                            <el-date-picker
                                    :clearable="false"
                                    v-model="queryData.summary_date"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    size="small">
                            </el-date-picker>
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
                :tableMinWidth="tableMinWidth"
                :showSearch="showSearch"
                :load="handleTableOpen">
            <template slot="healthy_sum" slot-scope="scope">
                <el-button size="small" type="text" v-if="scope.row.account_id && buttonList['details'].permit(thisVm)"
                           @click="handleClickDetailsInfo(scope.row)">{{scope.row.healthy_sum}}</el-button>
                <span v-else>{{scope.row.healthy_sum}}</span>
            </template>
        </ComTableInfo>

        <ComDialogPreview
                top="15vh"
                title="差评明细"
                width="700px"
                tableHeight="500px"
                :visible.sync="isShowDetails"
                :tableKey="detailsKey"
                :tableProps="detailsProps"
                :tableData="detailsData"
                :tableWidth="detailsWidth">
        </ComDialogPreview>

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
        getAccountHealthCountInfo,
        getAccountHealthDetailsInfo
    } from '@/api/am_order_count/account_health_count';

    import {
        getCurrentDateRange
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'account_health_count';

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
                    summary_date: '',
                    group_id: '',
                },

                //保存默认日期
                saveDefaultDate: [],
                //保存查询日期
                saveQueryDate: '',

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth: [],
                tableWidth: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                //查看详情
                isShowDetails: false,
                detailsKey: [],
                detailsProps: [],
                detailsData: [],
                detailsWidth: [],
            };
        },
        computed: {
            ...mapGetters([
                'queryParamsInfo',
                'accountHealthCountInfo'
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'GetAccountHealthCountInfo'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['account_health_count']);
                }

                let obj = {
                    ...this.queryData,
                    ...params
                };
                this.GetAccountHealthCountInfo(obj).then(({data}) => {
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
                this.queryData.group_id = '';
                this.queryData.summary_date = this.saveDefaultDate;
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

            // 展开表格
            handleTableOpen({group_id, id, group_name}, treeNode, resolve) {
                this.queryData = JSON.parse(this.queryParamsInfo['account_health_count']);
                this.queryData.group_id = group_id;
                let obj = {
                    ...this.queryData,
                };

                getAccountHealthCountInfo(obj).then(({data}) => {
                    resolve(data.data.value.map((_v, _i) => {
                        this.$nextTick().then(() => {
                            this.$refs.myTable.handleRefreshTableHeight();
                        });
                        return {
                            ..._v,
                            group_name: `${group_name}`,
                            id: `${id}_${_i}`
                        }
                    }))
                }).catch(err => {
                    console.log(err);
                });
            },

            //查看明细
            handleClickDetailsInfo(row, params={}){
                this.isShowDetails = true;
                this.saveRowData = row;
                this.handlePreviewPlatform(this.saveRowData, params);
            },

            handlePreviewPlatform(row, params) {
                let obj = {
                    summary_date: this.saveQueryDate,
                    account_id: row.account_id,
                    ...params,
                };
                getAccountHealthDetailsInfo(obj).then(({data}) => {
                    if(data.status) {
                        this.detailsData = data.data.value;
                        this.detailsKey = ['序号', ...data.data.key];
                        this.detailsProps = ['index','account_name','amazon_order_id','order_date','negative','a_to_z','charge_back'];
                        this.detailsWidth = ['70','','150','90','70','70','70']
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
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
                    key: 'account_health_count',
                    value: JSON.stringify(this.queryData)
                });

                this.saveQueryDate = this.queryData.summary_date;

                //数据渲染
                this.tableData = data.value.map((_v, index) => {
                    return {
                        ..._v,
                        id: index + 1,
                        hasChildren: !!index
                    }
                });

                this.tableKey = data.key;
                const props = [...data.key];
                props.splice(0, 3);
                this.tableProps = ['group_name','account_name','healthy_sum','negative','a_to_z','charge_back'];
                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'total_price') return '95';
                    if(item === 'group_name'|| item === 'account_name') return '120';
                    return '88';
                });
            }
        },
        created () {
            this.thisVm = this;
            try {
                getCurrentDateRange().then(( data ) => {
                    this.saveDefaultDate = data.end;
                    this.queryData.summary_date = this.saveDefaultDate;
                    this.handleQueryInfo();
//                    if (JSON.stringify(this.accountHealthCountInfo) === '{}') {
//                        this.queryData.summary_date = this.saveDefaultDate;
//                        this.handleQueryInfo();
//                    } else {
//                        // 获取保存的查询参数
//                        this.queryData = JSON.parse(this.queryParamsInfo['account_health_count']);
//                        this.handleQueryInfoCallBack(this.accountHealthCountInfo);
//                    }
                })
            } catch (e) {
                console.log(e);
            }
        },
    };
</script>

<style lang="less" scoped>
    /deep/.el-table__indent {
        padding-left: 10px!important;
    }

</style>
