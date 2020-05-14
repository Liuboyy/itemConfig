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
            <div ref="myMap" class="ui-echarts"></div>
        </TemplateDefault>
    </div>
</template>

<script>

    const toHtml = (contents) => {
        // 小圈圈
        let rflag = color => `<span class="ui-echart--tooltip__flag" style="background: ${color}"></span>`;
        return contents.reduce((rhtml, ctn) => {
            if (rhtml) {
                let ctnValue = ctn.seriesName === '国内仓实际采购金额/(在库+在途)金额比例'
                || ctn.seriesName === '国内仓实际销售成本金额/(在库+在途)金额比例'
                || ctn.seriesName === '缺货率'? (ctn.value || 0) + '%' : (ctn.value || 0);
                return `${rhtml}<br>${rflag(ctn.color)}${ctn.seriesName}: ${ctnValue}`;
            } else {
                return `${ctn.axisValue}`
            }
        }, '');
    };

    let option = {
        color: ['#78b3fc', '#ff7778', '#77d6c7', '#bbaff1','#ff8e3f','#fad44d',],
        title: {
            text: '国内仓在途，在库，采购，缺货情况推移图（单位：万）',
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
            itemGap: 20
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '3%',
            bottom: '15%',
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
        getDWarehouseAllChartInfo,
    } from '@/api/planning_module/d_warehouse_all_chart';

    const component_name = 'd_warehouse_all_chart';

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
            getDWarehouseAllChartInfo,

            // 列表信息查询
            handleQueryInfo (item, isFn, success) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['d_warehouse_all_chart']);
                }

                let obj = {
                    date_start: this.queryData.date && this.queryData.date[0],
                    date_end: this.queryData.date && this.queryData.date[1],
                };

                this.getDWarehouseAllChartInfo(obj).then(({data}) => {

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
                    key: 'd_warehouse_all_chart',
                    value: JSON.stringify(this.queryData)
                });

                if (data.data.chart.length) {
                    let item;
                    item = [[], [], [], [], [], [], []];

                    data.data.chart.forEach(_v => {
                        item[0].push(_v.in_stock_money);
                        item[1].push(_v.onway_stock_money);
                        item[2].push(_v.total_money);
                        item[3].push(_v.pur_stcok_rate);
                        item[4].push(_v.sales_stcok_rate);
                        item[5].push(_v.outstock_rate);
                        item[6].push(_v.m_date);
                    });
                    option.xAxis[0].data = item[6];
                    option.yAxis[1].max = data.data.data_max.outstock_rate;

                    option.legend.data = ['国内仓在库库存(3个小包仓)', '国内仓采购在途(3个小包仓)', '国内仓在库+在途库存金额', '国内仓实际采购金额/(在库+在途)金额比例', '国内仓实际销售成本金额/(在库+在途)金额比例', '缺货率'];

                    option.series = [
                        {
                            name:'国内仓在库库存(3个小包仓)',
                            type:'bar',
                            smooth: true,
                            stack: '数量',
                            data:[],
                        },
                        {
                            name:'国内仓采购在途(3个小包仓)',
                            type:'bar',
                            stack: '数量',
                            smooth: true,
                            data:[],
                        },
                        {
                            name:'国内仓在库+在途库存金额',
                            type:'line',
                            smooth: true,
                            data:[],
                        },
                        {
                            name: '国内仓实际采购金额/(在库+在途)金额比例',
                            type: 'line',
                            smooth: true,
                            data: [],
                        },
                        {
                            name:'国内仓实际销售成本金额/(在库+在途)金额比例',
                            type:'line',
                            smooth: true,
                            data:[],
                        },
                        {
                            name:'缺货率',
                            type:'line',
                            smooth: true,
                            data:[],
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
        height: 450px;
    }

    /deep/ .ui-echart--tooltip__flag {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
    }
</style>
