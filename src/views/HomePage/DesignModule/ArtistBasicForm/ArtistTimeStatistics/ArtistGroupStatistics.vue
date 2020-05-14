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
                        <SearchRequirement label="美工小组">
                            <el-select
                                    @change="handleChangeGetStaff"
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.artistTeam">
                                <el-option
                                        v-for="item in optionList.artistTeamList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="美工人员">
                            <el-select
                                    filterable
                                    v-filter
                                    size="small"
                                    :disabled="queryData.artistTeam == ''"
                                    v-model="queryData.artistStaff">
                                <el-option
                                        v-for="item in optionList.artistStaffList"
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
            color: "#333"
        },
        grid: {
            x: '16%', //相当于距离左边效果:padding-left
        },
        xAxis: [
            {
                type : 'category',
                name: '美工小组/人员',
                nameTextStyle: {
//                        color: '#66a6ff',
                },
                axisLine:{//x坐标轴线
                    show:true,
                    lineStyle:{
//                            color: "#66a6ff"//x轴颜色，若不设置全局字体颜色，则可改变x轴颜色
                    },
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
            nameTextStyle: {
//                    color: '#66a6ff',
            },
            axisLine:{//y坐标轴线
                show:true,
                lineStyle:{
//                        color: "#66a6ff"//x轴颜色，若不设置全局字体颜色，则可改变x轴颜色
                }
            },
            axisTick:{//坐标刻度
                boundaryGap:true,
                alignWithLabel:true,//可使坐标刻度线居中，此时需要设置 boundaryGap:true,
            },
        },

        series: [{
            type: 'bar',
            barWidth: 30,   //粗细
//                barGap:'80%',
//                barCategoryGap:'50%',
            itemStyle: {
                color: '#66a6ff'
            },
            data: [],
        }]
    }

    export default {
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
                    artistTeam: '',
                    artistStaff: '',
                },
                optionList: {
                    artistTeamList: [],
                    artistStaffList: [],
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //保存日期
                saveDefaultDate: []
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'comOptions',
                'artistGroupTimeCountInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetArtistGroupTimeCountInfo',
            ]),
            getComDeveloperBySecondGroup,

            // 重置
            handleResetQueryInfo(){
                this.queryData.artistTeam = '';
                this.queryData.artistStaff = '';
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['artist_group_statistics']);
                }

                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.date[0],
                    end_date: this.queryData.date[1],
                    art_user_id: this.queryData.artistStaff,
                    art_group_id: this.queryData.artistTeam,
                };

                obj = Object.assign(obj || {}, params);

                this.GetArtistGroupTimeCountInfo(obj).then(({ data}) => {
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

            //获取美工人员
            handleChangeGetStaff(val) {
                if(!this.queryData.artistTeam || val) this.queryData.artistStaff = '';
                this.getComDeveloperBySecondGroup({
                    group_level: 2,
                    group_type: 5,
                    group_id: val,
                    shift_flag: '',
                }).then(({ data }) => {
                    this.optionList.artistStaffList = data.list;
                    this.handleSaveOptionList();
                });
            },

            //保存下拉
            handleSaveOptionList() {
                this.$store.commit('SAVE_OPTION_LIST_INFO', {
                    key: 'artist_time',
                    value: this.optionList
                })
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    isExcel: 1
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
                    key: 'artist_group_statistics',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.optionList.artistTeamList = data.list.group_list;
                this.tableData = data.list.value;
                this.tableKey = data.list.key;
                if(this.tableKey.indexOf('美工人员') > -1) {
                    this.tableProps = ['name_level_two','user_name','avg_date'];
                }else {
                    this.tableProps = ['name_level_two','avg_date'];
                }

                let xAxisArr = [];
                let seriesArr = [];
                this.tableData.forEach(item => {
                    if(item.user_name) {
                        xAxisArr.push(item.user_name);
                    }else {
                        xAxisArr.push(item.name_level_two);
                    }
                    seriesArr.push(item.avg_date)
                });
                option.xAxis[0].data = xAxisArr;
                option.series[0].data = seriesArr;
                this.ECharts = echarts.init(this.$refs.myMap);
                this.ECharts.setOption(option);
            }
        },
        created(){
            this.thisVm = this;
            try{
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.artistGroupTimeCountInfo) === '{}') {
                        this.queryData.date = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['artist_group_statistics']);
                        this.handleQueryInfoCallBack(this.artistGroupTimeCountInfo);
                        if(this.comOptions['artist_time']) this.optionList = this.comOptions['artist_time'];
                    }
                });
            }catch (e) {
                console.log(e);
            }
        },
        mounted() {
            this.ECharts = echarts.init(this.$refs.myMap);
            this.ECharts.setOption(option);
        },
    }
</script>
<style lang="less" scoped>

</style>
