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
                :otherHeight="['el-tabs__header','ui-charts_bar']"
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
                name: '任务类型',
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
                ECharts: {},
                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
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
                'photographTaskTypeTimeCountInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetPhotoTaskTypeTimeCountInfo',
            ]),
            getComDeveloperBySecondGroup,

            // 重置
            handleResetQueryInfo(){
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['photo_task_statistics']);
                }

                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.date[0],
                    end_date: this.queryData.date[1],
                };

                obj = Object.assign(obj || {}, params);

                this.GetPhotoTaskTypeTimeCountInfo(obj).then(({ data}) => {
                    // 导出
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

            //默认时间
            handleGetDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.date = [data.start, data.end];
                });
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
                if(row.row.type_name == '小计') {
                    return 'background: #f3f6fa'
                }
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                }, true)
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'photo_task_statistics',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableData = data.data.value;
                this.tableKey = data.data.key;
                this.tableProps = ['type_name','avg_time'];
                this.tableWidth = [];
                let xAxisArr = [];
                let seriesArr = [];
                this.tableData.forEach(item => {
                    xAxisArr.push(item.type_name);
                    seriesArr.push(item.avg_time)
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
                    if (JSON.stringify(this.photographTaskTypeTimeCountInfo) === '{}') {
                        this.queryData.date = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['photo_task_statistics']);
                        this.handleQueryInfoCallBack(this.photographTaskTypeTimeCountInfo);
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
