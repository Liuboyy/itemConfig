<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="完成日期" template="daterange" v-model="queryData.date" :isOption="false">
                        </SearchRequirement>
                    </li>
                    <!--<li>-->
                        <!--<SearchRequirement label="一级产品线">-->
                            <!--<el-select multiple collapseTags filterable v-filter size="small" v-model="queryData.productLine">-->
                                <!--<el-option-->
                                        <!--v-for="item in optionList.productLineList"-->
                                        <!--:key="item.category_id_level_1"-->
                                        <!--:value="item.category_id_level_1"-->
                                        <!--:label="item.category_name_level_1"></el-option>-->
                            <!--</el-select>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <li>
                        <SearchRequirement label="侵权类型">
                            <el-select filterable v-filter size="small" v-model="queryData.infringeType">
                                <el-option
                                        v-for="item in optionList.infringeTypeList"
                                        :key="item.tort_type"
                                        :value="item.tort_type"
                                        :label="item.type_name"></el-option>
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
    } from '@/api/common/date_format'

    import {
        getProductLineList,
        getInfringementTypeList,
        getProductLineAgingInfo
    } from '@/api/infringement_module/product_line_aging_count'

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
                name: '产品线',
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
                    productLine: [],
                    infringeType: '',
                },
                optionList: {
                    productLineList: [],
                    infringeTypeList: [],
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
            ]),
        },
        methods: {
            ...mapActions([]),
            getProductLineAgingInfo,

            // 重置
            handleResetQueryInfo(){
                this.queryData.productLine = [];
                this.queryData.infringeType = '';
                this.queryData.date = this.saveDefaultDate;
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['product_line_aging_count']);
                }

                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    census_date_start: this.queryData.date[0],
                    census_date_end: this.queryData.date[1],
//                    product_line: this.queryData.productLine.join(','),
                    tort_type: this.queryData.infringeType
                };

                obj = Object.assign(obj || {}, params);

                this.getProductLineAgingInfo(obj).then(({ data}) => {
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
                if(row.row.category_name_level_1 == '小计') {
                    return 'background: #f3f6fa'
                }
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                }, true)
            },

            //默认时间
            handleGetPreDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.date = [data.start, data.end];
                });
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'product_line_aging_count',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableData = data.data;
                this.tableKey = data.title;
                this.tableProps = ['category_name_level_1','avg_time'];
                this.tableWidth = [];
                let xAxisArr = [];
                let seriesArr = [];
                this.tableData.forEach(item => {
                    xAxisArr.push(item.category_name_level_1);
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
                getProductLineList().then(({ data }) => {
                    this.optionList.productLineList = data.data;
                });
                getInfringementTypeList().then(({ data }) => {
                    this.optionList.infringeTypeList = data.data;
                });
                getPreDateRange().then((data) => {
                    this.saveDefaultDate = [data.start, data.end];
                    this.queryData.date = [data.start, data.end];
                    this.handleQueryInfo();
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
