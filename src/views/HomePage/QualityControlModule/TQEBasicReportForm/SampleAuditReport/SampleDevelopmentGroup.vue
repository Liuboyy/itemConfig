<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li v-if="queryData.tabType == '1'|| queryData.tabType == '2'">
                        <SearchRequirement
                                label="统计日期"
                                template="splitDate"
                                v-model="queryData.createTime">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.tabType == '3'">
                        <SearchRequirement label="统计年份">
                            <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.year"
                                    type="year"
                                    format="yyyy"
                                    value-format="yyyy"
                                    placeholder="选择年">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.tabType == '3'">
                        <SearchRequirement label="统计月份">
                            <el-select
                                    filterable
                                    v-filter
                                    collapseTags
                                    multiple
                                    size="small"
                                    placeholder="请至少选择一个月份"
                                    v-model="queryData.months">
                                <el-option
                                        v-for="(label, value) in optionList.monthsList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.tabType == '4'">
                        <SearchRequirement label="开始年份">
                            <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.startYear"
                                    type="year"
                                    format="yyyy"
                                    value-format="yyyy"
                                    placeholder="选择年">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.tabType == '4'">
                        <SearchRequirement label="结束年份">
                            <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.endYear"
                                    type="year"
                                    format="yyyy"
                                    value-format="yyyy"
                                    placeholder="选择年">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发一级小组">
                            <el-select @change="handleChangeGetStaff" filterable size="small" v-filter v-model="queryData.oneTeam">
                                <el-option
                                        v-for="item in optionList.oneTeamList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.tabType != '4'">
                        <SearchRequirement  label="开发人员">
                            <el-select filterable size="small" v-model="queryData.developer" :disabled="queryData.oneTeam == ''" v-filter>
                                <el-option
                                        v-for="item in optionList.developerList"
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
        </div>
        <el-tabs v-model="queryData.tabType" type="card" @tab-click="handleTabClick" class="ui-tabs">
            <el-tab-pane label="日明细" name="1"></el-tab-pane>
            <el-tab-pane label="日汇总" name="2"></el-tab-pane>
            <el-tab-pane label="月汇总" name="3"></el-tab-pane>
            <el-tab-pane label="年度报表" name="4"></el-tab-pane>
        </el-tabs>
        <ComTableInfo
                :stripe="false"
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableMinWidth="tableMinWidth"
                :tableFixed="tableFixed"
                :showSearch="showSearch"
                :spanMethod="handleSpanMethod"
                :tableRowClassName="tableRowClassName"
                :cellMouseLeave="cellMouseLeave"
                :cellMouseEnter="cellMouseEnter"
                :otherHeight="['el-tabs__header','ui-tabs']">
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
        getCurrentYear,
        getPreMonth,
        validTime
    } from '../../../../../api/common/date_format'

    import {
        getComDeveloperBySecondGroup
    } from '../../../../../api/common/index'

    export default {
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    createTime: [],
                    months: [],
                    startYear: '',
                    endYear: '',
                    year: '',
                    oneTeam: '',
                    developer: '',
                    tabType: '1'
                },
                optionList: {
                    oneTeamList: [],
                    developerList: [],
                    monthsList: {
                        1: '一月',
                        2: '二月',
                        3: '三月',
                        4: '四月',
                        5: '五月',
                        6: '六月',
                        7: '七月',
                        8: '八月',
                        9: '九月',
                        10: '十月',
                        11: '十一月',
                        12: '十二月',
                    }
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableMinWidth: [],
                tableFixed: [],


                //保存日期
                saveDefaultDate: [],
                saveStartYear: '',
                saveEndYear: '',
                saveDefaultMonth: '',
                saveGroup: '',

                rowIndex: '-1',
                //合并
                spanArr: [],
                position: 0,
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'comOptions',
                'sampleDevelopmentGroupInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetSampleAuditReportInfo',
            ]),
            getComDeveloperBySecondGroup,

            // 重置
            handleResetQueryInfo(){
                const tabType = this.queryData.tabType;
                this.queryData.tabType = tabType;
                this.handleReset();
                this.handleGetDateRange();
            },
            handleReset() {
                this.queryData.oneTeam = '';
                this.queryData.developer = '';
                this.queryData.year = this.saveEndYear;
                this.queryData.startYear = this.saveStartYear;
                this.queryData.endYear = this.saveEndYear;
                this.queryData.months = this.saveDefaultMonth;
            },

            //根据日期类型获取默认时间
            handleTabClick(tab) {
                const type = tab.name;
                if(type) {
                    this.queryData.tabType = type;
                    this.handleReset();
                }
                if(type == '1' || type == '2') {
                    this.handleQueryInfo({
                        start_date: this.queryData.createTime[0],
                        end_date: this.queryData.createTime[1],
                    })
                }
                if(type == '3') {
                    let monthArr = [];
                    this.queryData.months = [JSON.stringify(new Date().getMonth())];
                    this.queryData.months.forEach(item => {
                        if(item < 10) {
                            monthArr.push(this.queryData.year + '-0'+ item)
                        }else {
                            monthArr.push(this.queryData.year + '-' + item)
                        }
                        return monthArr;
                    });
                    this.handleQueryInfo({
                        months: monthArr.join(','),
                    })
                }
                if(type == '4') {
                    this.handleQueryInfo({
                        start_date: this.queryData.startYear,
                        end_date: this.queryData.endYear
                    })
                }
            },

            handleMonthsInfo() {
                let monthArr = [];
                this.queryData.months.forEach(item => {
                    if(item < 10) {
                        monthArr.push(this.queryData.year + '-0'+ item)
                    }else {
                        monthArr.push(this.queryData.year + '-' + item)
                    }
                });
                return monthArr;
            },

            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['sample_development_group']);
                }

                if(!validTime(this.queryData.createTime[0], this.queryData.createTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    module_type: 'dev',
                    group_id: this.queryData.oneTeam,
                    user_id: this.queryData.developer,
                    tab_type: this.queryData.tabType
                };
                if(this.queryData.tabType == '1' || this.queryData.tabType == '2') {
                    obj.start_date = this.queryData.createTime[0];
                    obj.end_date = this.queryData.createTime[1];
                }
                if(this.queryData.tabType == '2') { //日汇总
                    obj.query_type = 'd';
                }
                if(this.queryData.tabType == '3') {//月汇总
                    if(!this.queryData.months.length) {
                        this.$message.warning('请选择月份！');
                        return;
                    }
                    obj.months = this.handleMonthsInfo().join(',');
                    obj.query_type = 'm';
                }
                if(this.queryData.tabType == '4') {//年度报表
                    obj.start_date = this.queryData.startYear;
                    obj.end_date = this.queryData.endYear;

                    if(obj.start_date > obj.end_date) {
                        this.$message.error('结束年份不能小于开始年份！');
                        return;
                    }
                }
                obj = Object.assign(obj || {}, params);

                this.GetSampleAuditReportInfo(obj).then(({ data}) => {
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

            //获取开发人员
            handleChangeGetStaff(val) {
                if(!this.queryData.oneTeam || val) this.queryData.developer = '';
                this.getComDeveloperBySecondGroup({
                    group_level: 1,
                    group_type: 1,
                    group_id: val,
                    shift_flag: ''
                }).then(({ data }) => {
                    this.optionList.developerList = data.list;
                    this.handleSaveOptionList();
                })
            },

            //保存下拉
            handleSaveOptionList() {
                this.$store.commit('SAVE_OPTION_LIST_INFO', {
                    key: 'sample_group',
                    value: this.optionList
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

            handleRowSpan(data) {
                this.spanArr = [];
                this.position = 0;
                data.forEach((item, index) => {
                    if(index === 0) {
                        this.spanArr.push(1);
                        this.position = 0
                    }else {
                        const user_name = data[index].user_name === data[index-1].user_name;
                        if(user_name) {
                            this.spanArr[this.position] += 1;
                            this.spanArr.push(0);
                        }else {
                            this.spanArr.push(1);
                            this.position = index;
                        }
                    }
                });
            },

            // 表格合并
            handleSpanMethod({ row, column, rowIndex, columnIndex }) {
                if(this.queryData.tabType == '1') {
                    if (!columnIndex) {
                        return {
                            rowspan: row.rowsLength ? row.rowsLength : 0,
                            colspan: 1
                        }
                    }
                    if(this.saveGroup && columnIndex === 1) {
                        const _row = this.spanArr[rowIndex];
                        const _col = _row > 0 ? 1 : 0;
                        return {
                            rowspan: _row,
                            colspan: _col
                        }
                    }
                }
                if(this.queryData.tabType == '4' && !columnIndex) {
                    return {
                        rowspan: row.rowsLength ? row.rowsLength : 0,
                        colspan: 1
                    }
                }
            },

            //处理合并行悬浮问题
            cellMouseEnter(row) {
                this.rowIndex = row.rowIndex;
                if(this.queryData.tabType == '1'|| this.queryData.tabType == '4') {
                    this.$nextTick().then(() => {
                        if (document.querySelector('.el-table__body tr.cell-row td:not([rowspan="1"])')) {
                            document.querySelector('.el-table__body tr.cell-row td:not([rowspan="1"])').style.backgroundColor = '#fdfdfd';
                        }
                    })
                }
            },
            cellMouseLeave() {
                this.rowIndex = '-1';
                if(this.queryData.tabType == '1'|| this.queryData.tabType == '4') {
                    const rowLists = document.querySelectorAll('.el-table__body tr td:not([rowspan="1"])');
                    rowLists.forEach(_e => {
                        _e.style.backgroundColor = '#FFF';
                    });
                }
            },
            tableRowClassName({row}) {
                if(this.queryData.tabType == '1'|| this.queryData.tabType == '4') {
                    return row.rowIndex === this.rowIndex && 'cell-row'
                }
            },

            //默认时间
            handleGetDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.createTime = [data.start, data.end];
                });
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'sample_development_group',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = data.data.key;
                if(this.queryData.tabType == '1'|| this.queryData.tabType == '4') { //日明细
                    let arr = [];
                    if(data.data.value.length) {
                        data.data.value.forEach((item, index) => {
                            item.forEach((_item, _index) => {
                                if(!_index) {
                                    arr.push({ ..._item, rowsLength: item.length, rowIndex: index})
                                }else {
                                    arr.push({..._item, rowIndex: index})
                                }
                            })
                        })
                    }
                    let tableData = arr.map(item => {
                        return {
                            ...item,
                            group: this.queryData.oneTeam
                        }
                    });
                    tableData.forEach(item => {
                        this.saveGroup = item.group;
                    });
                    this.tableData = [...tableData];
                    this.handleRowSpan(this.tableData);
                    if(this.queryData.tabType == '1') {
                        let props = [...data.data.key];
                        props.splice(0,this.tableKey.indexOf('统计指标') +1);
                        if(this.tableKey.indexOf('开发人员') > -1) {
                            this.tableProps = ['group_name','user_name','type_name', ...props]
                        }else {
                            this.tableProps = ['group_name','type_name', ...props]
                        }
                        this.tableFixed = [true, true];
                    }
                    if(this.queryData.tabType == '4') {
                        let props = [];
                        if(this.tableKey.indexOf('开发人员') > -1) {
                            props = ['group_name','user_name','type_name','subtotal']
                        }else {
                            props = ['group_name','type_name','subtotal']
                        }
                        this.tableProps = [...props, 'january','february','march','april','may','june','july','august','september','october','november','december']
                    }
                }
                if(this.queryData.tabType == '2' || this.queryData.tabType == '3') {//日汇总
                    this.tableData = data.data.value;
                    if(this.tableKey.indexOf('开发人员') > -1) {
                        this.tableProps = ['group_name','user_name','review_num','reject_num','pass_rate']
                    }else {
                        this.tableProps = ['group_name','review_num','reject_num','pass_rate']
                    }
                }
                this.tableMinWidth = this.tableProps.map(item => {
                    if(item == 'type_name') return '110';
                    return '100';
                });

                this.optionList.oneTeamList = data.data.group_list;
            }
        },
        created(){
            this.thisVm = this;
            this.saveStartYear = JSON.stringify(new Date().getFullYear() - 1);
            this.saveDefaultMonth = [JSON.stringify(new Date().getMonth())];
            try{
                getCurrentYear().then((data) => {
                    this.saveEndYear = data.year;
                    getPreDateRange().then((data) => {
                        if (!this.sampleDevelopmentGroupInfo['dev'] || JSON.stringify(this.sampleDevelopmentGroupInfo['dev']) === '{}') {
                            this.queryData.startYear = this.saveStartYear;
                            this.queryData.endYear = this.saveEndYear;
                            this.queryData.year = this.saveEndYear;
                            this.queryData.months = this.saveDefaultMonth;
                            this.queryData.createTime = [data.start, data.end];
                            this.handleQueryInfo();
                        } else {
                            // 获取保存的查询参数
                            this.queryData = JSON.parse(this.queryParamsInfo['sample_development_group']);
                            this.handleQueryInfoCallBack(this.sampleDevelopmentGroupInfo['dev']);
                            if (this.comOptions['sample_group']) this.optionList = this.comOptions['sample_group'];
                        }
                    });
                })
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>
<style lang="less" scoped>
    /deep/.el-table--border {
        border-top: 0!important;
    }
    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
</style>
