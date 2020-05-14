<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="日期" v-model="queryData.date" template="daterange" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :params="{}" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module"></div>
        <TemplateDefault :staticNum="120" color="#FFFFFF">
            <div class="ui-charts_box">
                <div ref="myMap" class="ui-echarts"></div>
            </div>
            <ComTableInfo
                    :otherHeight="['el-tabs__header','ui-charts_box']"
                    ref="tableArea"
                    :tableKey="tableKey"
                    :tableProps="tableProps"
                    :tableData="tableData"
                    :tableMinWidth="tableMinWidth"
                    :showSearch="showSearch"
                    :tableFixed="['left']">
                <template v-for="(item, index) in tableProps" :slot="item" slot-scope="scope" v-if="index > 0">
                    <span>{{scope.row[item].count_rate + '%'}}</span>
                </template>
                <template slot="name" slot-scope="scope">
                    <span class="background bg_a" v-if="scope.row.name === 'A.0<日均销量<0.1'"></span>
                    <span class="background bg_b" v-if="scope.row.name === 'B.弱销(0.1<=日均销量<0.3)'"></span>
                    <span class="background bg_c" v-if="scope.row.name === 'C.低销(0.3<=日均销量<0.6)'"></span>
                    <span class="background bg_d" v-if="scope.row.name === 'D.平销(0.6<=日均销量<1)'"></span>
                    <span class="background bg_e" v-if="scope.row.name === 'E.中销(1<=日均销量<3)'"></span>
                    <span class="background bg_f" v-if="scope.row.name === 'F.高销(3<=日均销量<5)'"></span>
                    <span class="background bg_g" v-if="scope.row.name === 'G.畅销(5<=日均销量<10)'"></span>
                    <span class="background bg_h" v-if="scope.row.name === 'H.热销(10<=日均销量<20)'"></span>
                    <span class="background bg_i" v-if="scope.row.name === 'I.爆款(日均销量>=20)'"></span>
                    <span class="background bg_j" v-if="scope.row.name === '合计'"></span>
                    {{scope.row.name}}
                </template>
            </ComTableInfo>
        </TemplateDefault>
    </div>
</template>

<script>

    const toHtml = (contents) => {
        // 小圈圈
        let rflag = color => `<span class="ui-echart--tooltip__flag" style="background: ${color}"></span>`;
        return contents.reduce((rhtml, ctn) => {
            if (rhtml) {
//                let ctnValue = ctn.seriesName === '占比'? (ctn.value || 0) + '%' : (ctn.value || 0)
                return `${rhtml}<br>${rflag(ctn.color)}${ctn.seriesName}: ${(ctn.value || 0) + '%'}`;
            } else {
                return `${ctn.axisValue}`
            }
        }, '');
    };

    let option = {
        color: ['#fd96c1','#fad44d', '#77d6c7', '#bbaff1','#78b3fc', '#ff7778', '#ff8e3f', '#5fc46f','#FF9F7E','#FF1248'],
        title: {
            text: 'FBA按销量段断货listing占比数据推移图',
            textStyle: {
                fontSize: 16,
                color: '#333',
            }
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            extraCssText: 'text-align: left',
            formatter(params) {
                return toHtml([{axisValue: params[0].axisValue}, ...params]);
            }
        },
        legend: {
            data:[],
            x: 'center',
            y: 'bottom',
            width: 1200,
            itemGap: 20,
            show: false
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : [],
            }
        ],
        yAxis : [
            {
                type: 'value',
                axisLabel : {
                    show : true,
                },
                splitLine: {
                    show: false
                }
            },
            {
                type: 'value',
                min: 0,
                max: 0,
                axisLabel : {
                    show : true,
                },
                splitLine: {
                    show: false
                }
            }
        ],
//        dataZoom: {
////            show: this.dataShow,
//            x: 170,
//            y: 320,
//            height: 10,
//            start: 0,
//            end: 70,
//            showDataShadow: false,
//            showDetail: false,
//        },
        series: [],
        animation: false,
    };

    import echarts from 'echarts'
    import config from '@/assets/js/config';
    import {
        autoAddTableInx,
        getDefaultTime,
        changeTableInfoProps,
        getThirtyDayDateRange
    } from '@/services/index';

    import {
        getCountDate,
    } from '@/api/common/date_format'

    import {
        mapActions,
        mapGetters
    } from 'vuex';
    import {
        getSalesInventoryListingChart,
    } from '@/api/planning_module/f_sales_inventory_listing_chart';

    const component_name = 'f_sales_inventory_listing_chart';

    export default {
        name: component_name,
        data () {
            return {

                ECharts: {},

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    date: [],
                },

                optionList: {},

                chartData: [],

                saveDefaultTime: [],

                tableKey: [],
                tableProps: [],
                tableData: [],
                tableMinWidth: [],

            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'storeKey'
            ])
        },
        methods: {
            ...mapActions([
                'Fn'
            ]),
            autoAddTableInx,
            getDefaultTime,
            getSalesInventoryListingChart,

            // 列表信息查询
            handleQueryInfo (item, isFn, success) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['f_sales_inventory_listing_chart']);
                }

                let obj = {
                    date_start: this.queryData.date && this.queryData.date[0],
                    date_end: this.queryData.date && this.queryData.date[1],
                };

                this.getSalesInventoryListingChart(obj).then(({data}) => {

                    if (!data.status) {
                        this.$message.error(data.errorMess || '查询失败！');
                        return;
                    }

                    this.handleQueryInfoCallBack(data, item, success);
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData.date = this.saveDefaultTime;
                this.queryData.date[0] = getCountDate(-60);
            },

            // 操作回调
            handleOperationCallBack (data, successFn, errorFn) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    this.handleQueryInfo();
                    successFn && successFn();
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                    errorFn && errorFn();
                }
            },

            init(option) {
                this.ECharts = echarts.init(this.$refs.myMap);
                this.ECharts.setOption(option);
            },

            //查询回调
            handleQueryInfoCallBack (data, item, success) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'f_sales_inventory_listing_chart',
                    value: JSON.stringify(this.queryData)
                });


                if (data.data.curve_data.chart.length) {
                    let item;
                    item = [[], [], [], [], [], [], [], [], [], [], []];

                    data.data.curve_data.chart.forEach(_v => {
                        item[0].push(_v.a);
                        item[1].push(_v.b);
                        item[2].push(_v.c);
                        item[3].push(_v.d);
                        item[4].push(_v.e);
                        item[5].push(_v.f);
                        item[6].push(_v.g);
                        item[7].push(_v.h);
                        item[8].push(_v.i);
                        item[9].push(_v.count);
                        item[10].push(_v.m_date);
                    });
                    option.xAxis[0].data = item[10];
                    option.yAxis[1].max = data.data.curve_data.data_max.count;

                    option.legend.data = ['A.微销(0<日均销量<0.1)', 'B.弱销(0.1<=日均销量<0.3)','C.低销(0.3<=日均销量<0.6)', 'D.平销(0.6<=日均销量<1)','E.中销(1<=日均销量<3)', 'F.高销(3<=日均销量<5)','G.畅销(5<=日均销量<10)', 'H.热销(10<=日均销量<20)','I.爆款(日均销量>=20)', '合计'];

                    option.series = [
                        {
                            name:'A.微销(0<日均销量<0.1)',
                            type:'line',
                            smooth: true,
                            data:[],
                        },
                        {
                            name:'B.弱销(0.1<=日均销量<0.3)',
                            type:'line',
                            smooth: true,
                            data:[],
                        },
                        {
                            name:'C.低销(0.3<=日均销量<0.6)',
                            type:'line',
                            smooth: true,
                            data:[],
                        },
                        {
                            name:'D.平销(0.6<=日均销量<1)',
                            type:'line',
                            smooth: true,
                            data:[],
                        },
                        {
                            name:'E.中销(1<=日均销量<3)',
                            type:'line',
                            smooth: true,
                            data:[],
                        },
                        {
                            name:'F.高销(3<=日均销量<5)',
                            type:'line',
                            smooth: true,
                            data:[],
                        },
                        {
                            name:'G.畅销(5<=日均销量<10)',
                            type:'line',
                            smooth: true,
                            data:[],
                        },
                        {
                            name:'H.热销(10<=日均销量<20)',
                            type:'line',
                            smooth: true,
                            data:[],
                        },
                        {
                            name:'I.爆款(日均销量>=20)',
                            type:'line',
                            smooth: true,
                            data:[],
                        },
                        {
                            name: '合计',
                            type: 'line',
                            smooth: true,
                            data: [],
                            yAxisIndex: 1,
                        },
                    ];

                    option.series = option.series.map((_v, _i) => {
                        return {
                            ..._v,
                            data: item[_i],
                        }
                    });
                }

                this.init(option);


                this.tableKey = ['销量段', ...data.title];
                this.tableProps = ['name', ...data.title];
                this.tableData = data.data.excel_data;
                this.tableMinWidth = this.tableProps.map(item => {
                    if (item === 'name') return '210';
                    return '88';
                });

                success && success();
            }
        },
        created () {
            this.thisVm = this;
            try {
                this.queryData.date = getThirtyDayDateRange(new Date(new Date().getTime()));
                this.queryData.date[0] = getCountDate(-60);
                this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime()));
                this.handleQueryInfo();
            }catch(e){
                console.log(e)
            }
        },
        mounted() {
            this.init(option);
        },
    };
</script>

<style lang="less" scoped>

    .ui-echarts {
        width: 100%;
        height: 400px;
    }

    /deep/ .ui-echart--tooltip__flag {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
    }

    .background {
        display: inline-block;
        width: 20px;
        height: 10px;
    }
    .bg_a {
        background: #fd96c1;
    }
    .bg_b {
        background: #fad44d;
    }
    .bg_c {
        background: #77d6c7;
    }
    .bg_d {
        background: #bbaff1;
    }
    .bg_e {
        background: #78b3fc;
    }
    .bg_f {
        background: #ff7778;
    }
    .bg_g {
        background: #ff8e3f;
    }
    .bg_h {
        background: #5fc46f;
    }
    .bg_i {
        background: #FF9F7E;
    }
    .bg_j {
        background: #FF1248;
    }
</style>
