<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                                label="完成日期"
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
        <div class="ui-charts_box">
            <div ref="myMap" class="ui-charts_bar"></div>
        </div>
        <ComTableInfo
                :otherHeight="['el-tabs__header','ui-charts_box']"
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="tableWidth"
                :cellStyle="cellStyle"
                :showSearch="showSearch">
        </ComTableInfo>
    </div>
</template>
<script>
    import echarts from 'echarts'
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';

    import {
        getPreDateRange,
        validTime
    } from '../../../../../api/common/date_format'

    import {
        getComDeveloperBySecondGroup
    } from '../../../../../api/common/index'

    const option = {
            tooltip: {},
            textStyle: {//全局字体颜色
                color: "#333",
            },
            grid: {
                x: '16%', //相当于距离左边效果:padding-left
            },
            xAxis: [
                {
                    type : 'category',
                    name: '文案小组/人员',
                    axisLine:{//x坐标轴线
                        show:true,
                    },
                    axisTick:{//坐标刻度
                        boundaryGap:true,
                        alignWithLabel:true,//可使坐标刻度线居中，此时需要设置 boundaryGap:true,
                    },
                    data: [],
                },
            ],
            yAxis: {
                type: 'value',
                name: '平均处理工时（H）',
                axisLine:{//y坐标轴线
                    show:true,
                },
                axisTick:{//坐标刻度
                    boundaryGap:true,
                    alignWithLabel:true,//可使坐标刻度线居中，此时需要设置 boundaryGap:true,
                },
            },

            series: [{
                type: 'bar',
                barWidth: 30,   //粗细
                itemStyle: {
                    color: '#66a6ff'
                },
                data: [],
            }]
    }
    export default {
        data() {
            return {
                ECharts: {},

                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
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
                saveDefaultDate: [],

                xAxisName: ''
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'copyGroupCountInfo',
                'comOptions'
            ]),
        },
        methods: {
            ...mapActions([
                'GetCopyGroupCountInfo',
            ]),
            getComDeveloperBySecondGroup,

            // 重置
            handleResetQueryInfo(){
                this.queryData.copyTeam = '';
                this.queryData.copyStaff = '';
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['copy_group_statistics']);
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
                };

                obj = Object.assign(obj || {}, params);

                this.GetCopyGroupCountInfo(obj).then(({ data}) => {
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
                if(!this.queryData.copyTeam || val) this.queryData.copyStaff = '';
                if(val) {
                    this.getComDeveloperBySecondGroup({
                        group_level: 2,
                        group_type: 3,
                        group_id: val,
                    }).then(({ data }) => {
                        this.optionList.copyStaffList = data.list;
                        this.handleSaveOptionList();
                    })
                }
            },

            //保存下拉
            handleSaveOptionList() {
                this.$store.commit('SAVE_OPTION_LIST_INFO', {
                    key: 'copy_time',
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

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1
                }, true)
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

            //小计指纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.name_level_two == '小计'|| row.row.user_name == '小计') {
                    return 'background: #f3f6fa'
                }
            },

            init(option) {
                this.ECharts = echarts.init(this.$refs.myMap);
                this.ECharts.setOption(option);
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
                    key: 'copy_group_statistics',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.optionList.copyTeamList = data.data.group_list;
                this.tableData = data.data.value;
                this.tableKey = data.data.key;
                if(this.tableKey.indexOf('文案人员') > -1) {
                    this.tableProps = ['name_level_two','user_name','avg_task_time'];
                }else {
                    this.tableProps = ['name_level_two','avg_task_time'];
                }
                let xAxisArr = [];
                let seriesArr = [];

                this.tableData.forEach(item => {
                    if(item.user_name) {
                        xAxisArr.push(item.user_name);
                    }else {
                        xAxisArr.push(item.name_level_two);
                    }
                    seriesArr.push(item.avg_task_time)
                })
                option.xAxis[0].data = xAxisArr;
                option.series[0].data = seriesArr;

                this.init(option)

            }
        },
        created(){
            this.thisVm = this;
            try{
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.copyGroupCountInfo) === '{}') {
                        this.queryData.date = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['copy_group_statistics']);
                        this.handleChangeGetStaff(this.queryData.copyTeam);
                        this.handleQueryInfoCallBack(this.copyGroupCountInfo);
                        if (this.comOptions['copy_time']) this.optionList = this.comOptions['copy_time'];
                    }
                });
            }catch (e) {
                console.log(e);
            }
        },
        mounted() {
            this.init(option);
        },
    }
</script>
<style lang="less" scoped>


</style>
