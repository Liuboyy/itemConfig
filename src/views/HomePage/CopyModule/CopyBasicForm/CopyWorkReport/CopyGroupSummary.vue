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
                        <SearchRequirement label="一级产品线">
                            <el-select
                                    filterable
                                    v-filter
                                    collapseTags
                                    multiple
                                    size="small"
                                    v-model="queryData.productLine">
                                <el-option
                                        v-for="item in optionList.productLineList"
                                        :key="item.category_id_level_1"
                                        :value="item.category_id_level_1"
                                        :label="item.category_name_level_1"></el-option>
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
        getProductLineList
    } from '@/api/copy_module/copy_work_report'

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
                    productLine: [],
                },
                optionList: {
                    copyTeamList: {},
                    copyStaffList: [],
                    taskTypeList: [],
                    productLineList: []
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //保存日期
                saveDefaultDate: [],

                rowIndex: '-1',

                //判断是否查询产品线
                isQueryLine: false,
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'copyGroupSummaryInfo',
            ]),
        },
        methods: {
            ...mapActions([
                'GetCopyGroupSummaryInfo',
            ]),

            // 重置
            handleResetQueryInfo(){
                this.queryData.copyTeam = '';
                this.queryData.copyStaff = '';
                this.queryData.taskType = '';
                this.queryData.productLine = [];
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['copy_group_summary']);
                }

                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.date[0],
                    end_date: this.queryData.date[1],
                    line_code: this.queryData.productLine.join(','),
                };

                obj = Object.assign(obj || {}, params);

                this.GetCopyGroupSummaryInfo(obj).then(({ data}) => {
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

            // 表格合并
            handleSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (!columnIndex && this.isQueryLine) {
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
                    key: 'copy_group_summary',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = data.data.key;

                const flag = this.tableKey.indexOf('产品线') > -1;
                if (flag) {
                    let arr = [];
                    if(data.data.value) {
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
                }else {
                    this.tableData = data.data.value;
                }

                const props= ['devp_type','total_num','complete_num','complete_ratio','un_complete_num','un_complete_ratio','reject_num','reject_ratio','overtime_num','overtime_ratio','rejected_num','rejected_ratio'];
                this.tableProps = flag ? ['category_name_level_1', ...props] : [...props];
                this.isQueryLine = flag;
            }
        },
        created(){
            this.thisVm = this;
            try{
                getProductLineList().then(({ data }) => {
                    this.optionList.productLineList = data.data.value;
                });
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.copyGroupSummaryInfo) === '{}') {
                        this.queryData.date = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['copy_group_summary']);
                        this.handleQueryInfoCallBack(this.copyGroupSummaryInfo);
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
