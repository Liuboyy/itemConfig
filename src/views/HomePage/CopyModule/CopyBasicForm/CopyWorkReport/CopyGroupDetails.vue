<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                                label="统计日期"
                                template="splitDate"
                                v-model="queryData.date">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="文案小组">
                            <el-select
                                    @change="handleChangeGetStaff"
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.copyTeam">
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
                                    filterable
                                    v-filter
                                    size="small"
                                    :disabled="queryData.copyTeam == ''"
                                    v-model="queryData.copyStaff">
                                <el-option
                                        v-for="item in optionList.copyStaffList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="任务类型">
                            <el-select
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.taskType">
                                <el-option
                                        v-for="item in optionList.taskTypeList"
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
                :otherHeight="['el-tabs__header']"
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="tableWidth"
                :cellStyle="cellStyle"
                :showSearch="showSearch"
                :tableRowClassName="tableRowClassName"
                :cellMouseLeave="cellMouseLeave"
                :cellMouseEnter="cellMouseEnter"
                :spanMethod="handleSpanMethod">
        </ComTableInfo>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';

    import {
        getPreDateRange,
        validTime
    } from '@/api/common/date_format'

    import {
        getComDeveloperBySecondGroup
    } from '../../../../../api/common/index'

    export default {
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
                    copyTeam: '',
                    copyStaff: '',
                    taskType: '',
                },
                optionList: {
                    copyTeamList: [],
                    copyStaffList: [],
                    taskTypeList: [],
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //保存日期
                saveDefaultDate: [],

                //判断是否查询
                isQueryType: false,
                isQueryTeam: false,

                rowIndex: -1

            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'comOptions',
                'copyGroupDetailsInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetCopyGroupDetailsInfo',
            ]),
            getComDeveloperBySecondGroup,

            // 重置
            handleResetQueryInfo(){
                this.queryData.copyTeam = '';
                this.queryData.copyStaff = '';
                this.queryData.taskType = '';
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['copy_group_details']);
                }

                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.date[0],
                    end_date: this.queryData.date[1],
                    group_level_two: this.queryData.copyTeam,
                    user_id: this.queryData.copyStaff,
                    devp_type: this.queryData.taskType,
                };

                obj = Object.assign(obj || {}, params);

                this.GetCopyGroupDetailsInfo(obj).then(({ data}) => {
                    // 导出
                    if (!data.status) {
                        this.$message.error(data.errorMess || '查询失败！');
                        return;
                    }
                    this.handleQueryInfoCallBack(data);
                }).catch(err => {
                    console.log(err);
                })
            },

            //通过小组获取文案人员
            handleChangeGetStaff(val) {
                if(!this.queryData.copyTeam || val) this.queryData.copyStaff = '';
                this.getComDeveloperBySecondGroup({
                    group_type: 3,
                    group_level: 2,
                    group_id: val
                }).then(({ data }) => {
                    this.optionList.copyStaffList = data.list;
                    this.handleSaveOptionList();
                })
            },

            //保存下拉
            handleSaveOptionList() {
                this.$store.commit('SAVE_OPTION_LIST_INFO', {
                    key: 'copy_group',
                    value: this.optionList
                })
            },

            // 表格合并
            handleSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (!columnIndex && !this.isQueryType) {
                    return {
                        rowspan: row.spanLength ? row.spanLength : 0,
                        colspan: 1
                    }
                }
            },

            //处理合并行悬浮问题
            cellMouseEnter(row) {
                this.rowIndex = row.rowIndex;
                this.$nextTick().then(() => {
                    if (document.querySelector('.el-table__body tr.cell-row td:not([rowspan="1"])')) {
                        document.querySelector('.el-table__body tr.cell-row td:not([rowspan="1"])').style.backgroundColor = '#fdfdfd';
                    }
                })
            },
            cellMouseLeave() {
                this.rowIndex = '';
                const rowLists = document.querySelectorAll('.el-table__body tr td:not([rowspan="1"])');
                rowLists.forEach(_e => {
                    _e.style.backgroundColor = '#FFF';
                });
            },
            tableRowClassName({row}) {
                return row.rowIndex === this.rowIndex && 'cell-row'
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1
                }, true)
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

            //小计底纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.name_level_two == '小计'|| row.row.user_name == '小计') {
                    return 'background: #f3f6fa'
                }
            },

            //默认时间
            handleGetDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.date = [data.start, data.end];
                });
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'copy_group_details',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染

                this.isQueryType = this.queryData.taskType;
                this.isQueryTeam = this.queryData.copyTeam;

                this.tableKey = data.data.key;

                if (!this.isQueryType) {
                    let arr = [];
                    if (data.data.value) {
                        data.data.value.forEach((item, index) => {
                            item.forEach((_v, _i) => {
                                if(!_i) {
                                    arr.push({  ..._v, spanLength: item.length, rowIndex: index});
                                }else {
                                    arr.push({..._v, rowIndex: index});
                                }
                            });
                        });
                    }
                    this.tableData = [...arr];
                    this.tableProps = [this.queryData.copyTeam ? 'user_name': 'name_level_two', 'devp_type','all_total','complete_total','complete_ratio','un_complete_num','un_complete_ratio','reject_total','reject_ratio','overtime_total','overtime_ratio','rejected_total','rejected_ratio'];

                } else {
                    this.tableData = data.data.value;
                    if(this.isQueryTeam) {
                        this.tableProps = ['name_level_two','user_name','all_total','complete_total','complete_ratio','un_complete_num','un_complete_ratio','reject_total','reject_ratio','overtime_total','overtime_ratio','rejected_total','rejected_ratio'];
                    }else {
                        this.tableProps = [this.queryData.copyTeam ? 'user_name': 'name_level_two','all_total','complete_total','complete_ratio','un_complete_num','un_complete_ratio','reject_total','reject_ratio','overtime_total','overtime_ratio','rejected_total','rejected_ratio'];
                    }
                }

                this.optionList.copyTeamList = data.data.group_list;
                this.optionList.taskTypeList = data.data.type_list;
            }
        },
        created(){
            this.thisVm = this;
            try{
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.copyGroupDetailsInfo) === '{}') {
                        this.queryData.date = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['copy_group_details']);
                        this.handleQueryInfoCallBack(this.copyGroupDetailsInfo);
                        this.handleChangeGetStaff(this.queryData.copyTeam);
                        if (this.comOptions['copy_group']) this.optionList = this.comOptions['copy_group'];
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
