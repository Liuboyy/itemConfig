<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计月份">
                            <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.month"
                                    type="month"
                                    format="yyyy-MM"
                                    value-format="yyyy-MM"
                                    placeholder="选择月">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="文案小组">
                            <el-select
                                    size="small"
                                    v-model="queryData.copyTeam"
                                    @change="handleChangeGetStaff"
                                    filterable
                                    v-filter>
                                <el-option
                                        v-for="item in optionList.copyTeamList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="文案人员">
                            <el-select
                                    size="small"
                                    v-model="queryData.copyStaff"
                                    :disabled="queryData.copyTeam == ''"
                                    filterable
                                    v-filter>
                                <el-option
                                        v-for="item in optionList.copyStaffList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <div class="ui-filter-btn">
                    <el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>
                    <el-button size="small" type="primary" @click="handleQueryInfo()" icon="icon-chaxun">查询</el-button>
                </div>
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
        <ComTableInfo
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="tableWidth"
                :cellStyle="cellStyle"
                :showSearch="showSearch"
                :otherHeight="['el-tabs__header']">
            <template slot="user_name" slot-scope="scope">
                <el-button size="small" type="text" @click="handleUserName(scope.row)"
                           v-if="buttonList['preview'].permit(thisVm) && scope.row.user_name != '小计'">{{scope.row.user_name}}</el-button>
                <span v-if="!buttonList['preview'].permit(thisVm)">{{scope.row.user_name}}</span>
            </template>
        </ComTableInfo>

        <ComDialogPreview
                :title="dialogTitle"
                :visible.sync="isShowDialog"
                :tableKey="dialogKey"
                :tableProps="dialogProps"
                :cellStyle="cellStyle"
                :tableData="dialogData"
                isButton
                @export="handleExportDetailsInfo"></ComDialogPreview>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';

    import {
        getCurrentMonth,
    } from '../../../../api/common/date_format'

    import {
        getComDeveloperBySecondGroup
    } from '../../../../api/common/index'

    import {
        getFinishDetailsInfo
    } from '../../../../api/copy_module/copy_goal_statistics'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
//    const component_name = 'copy_goal_statistics';

    export default {
//        name: component_name,
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    month: '',
                    copyTeam: '',
                    copyStaff: '',
                },
                optionList: {
                    copyTeamList: [],
                    copyStaffList: [],
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //保存日期
                saveDefaultDate: '',

                //显示明细弹框
                isShowDialog: false,
                dialogTitle: '',
                dialogData: [],
                dialogProps: [],
                dialogKey: [],
                saveRowData: {}
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'comOptions',
                'copyGoalStatistics'
            ]),
//            buttonList() {
//                return config.AUTHORITY_BUTTON[component_name].buttonList;
//            }
        },
        methods: {
            ...mapActions([
                'GetCopyGoalCountInfo',
            ]),
            getComDeveloperBySecondGroup,
            getFinishDetailsInfo,

            // 重置
            handleResetQueryInfo(){
                this.queryData.month = this.saveDefaultDate;
                this.queryData.copyTeam = '';
                this.queryData.copyStaff = '';
            },

            //获取文案人员
            handleChangeGetStaff(val) {
                if(!this.queryData.copyTeam || val) this.queryData.copyStaff = '';
                this.getComDeveloperBySecondGroup({
                    group_level: 2,
                    group_type: 3,
                    group_id: val,
                }).then(({ data }) => {
                    this.optionList.copyStaffList = data.list;
                    this.handleSaveOptionList();
                })
            },

            //保存下拉
            handleSaveOptionList() {
                this.$store.commit('SAVE_OPTION_LIST_INFO', {
                    key: 'copy_goal',
                    value: this.optionList
                })
            },

            //点击文案人员
            handleUserName(row, params) {
                this.saveRowData = row;
                this.dialogTitle = `${row.user_name || ''}` + '每日完成明细';
                this.getFinishDetailsInfo({
                    month: this.queryData.month,
                    group_level_two: row.group_level,
                    user_id: row.user,
                    ...params
                }).then(({ data }) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.isShowDialog = true;
                        this.dialogData = data.data.value;
                        this.dialogKey = data.data.key;
                        this.dialogProps = ['i','create_date','total_completed','regular_completion_number','sale_type_completions_number','consignment_completion_number'];
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }

                })
            },

            //小计底纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.name_level_two == '小计'|| row.row.user_name == '小计') {
                    return 'background: #f3f6fa'
                }
            },

            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['copy_goal_statistics']);
                }
                let obj = {
                    month: this.queryData.month,
                    group_level_two: this.queryData.copyTeam,
                    user_id: this.queryData.copyStaff,
                    ...params,
                };

                obj = Object.assign(obj || {}, params);

                this.GetCopyGoalCountInfo(obj).then(({ data}) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }
                }).catch(err => {
                    console.log(err);
                })
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || '操作失败')
                }
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1
                }, true)
            },

            //明细导出
            handleExportDetailsInfo() {
                this.handleUserName(this.saveRowData, {is_excel: 1});
            },

            // 分页
            handleSizeChange(size) {
                this.handleQueryInfo({
                    limit: size,
                    offset: 1
                }, true);
            },
            handleCurrentChange(val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true)
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'copy_goal_statistics',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableData = data.data.value;
                this.tableKey = data.data.key;
                let props = [];
                if(this.tableKey.indexOf('文案人员') > -1) {
                    props = ['name_level_two','user_name'];
                }else {
                    props = ['name_level_two'];
                }
                this.tableProps = [...props, 'value','total_completed','total_completed_ratio','regular_completion_number','sale_type_completions_number','consignment_completion_number'];
                this.optionList.copyTeamList = data.data.group_list;
            }
        },
        created(){
            this.thisVm = this;
            try{
                getCurrentMonth().then((data) => {
                    this.saveDefaultDate = data.month;
                    if (JSON.stringify(this.copyGoalStatistics) === '{}') {
                        this.queryData.month = this.saveDefaultDate;
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['copy_goal_statistics']);
                        this.handleChangeGetStaff(this.queryData.copyTeam);
                        this.handleQueryInfoCallBack(this.copyGoalStatistics);
                        if (this.comOptions['copy_goal']) this.optionList = this.comOptions['copy_goal'];
                    }
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>
<style lang="less" scoped>

</style>
