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
                let ctnValue = ctn.seriesName === '断货率'? (ctn.value || 0) + '%' : (ctn.value || 0)
                return `${rhtml}<br>${rflag(ctn.color)}${ctn.seriesName}: ${ctnValue}`;
            } else {
                return `${ctn.axisValue}`
            }
        }, '');
    };

    let option = {
        color: ['#78b3fc', '#ff7778', '#77d6c7', '#bbaff1', '#fd96c1','#fad44d', '#ff8e3f', '#5fc46f', '#ff7778',],
        title: {
            text: 'FBA四段库存和日销库存推移图（单位：万）',
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
        getFWarehouseInventoryChartInfo,
    } from '@/api/planning_module/f_warehouse_inventory_chart';

    const component_name = 'f_warehouse_inventory_chart';

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
            getFWarehouseInventoryChartInfo,

            // 列表信息查询
            handleQueryInfo (item, isFn, success) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['f_warehouse_inventory_chart']);
                }

                let obj = {
                    date_start: this.queryData.date && this.queryData.date[0],
                    date_end: this.queryData.date && this.queryData.date[1],
                };

                this.getFWarehouseInventoryChartInfo(obj).then(({data}) => {

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
                    key: 'f_warehouse_inventory_chart',
                    value: JSON.stringify(this.queryData)
                });

                if (data.data.chart.length) {
                    let item;
                    item = [[], [], [], [], [], [], [], [], [], [], []];

                    data.data.chart.forEach(_v => {
                        item[0].push(_v.fba_instock_money);
                        item[1].push(_v.fba_onway_stock_money);
                        item[2].push(_v.sz_aa_instock_money);
                        item[3].push(_v.hm_aa_instock_money);
                        item[4].push(_v.sz_aa_onway_money);
                        item[5].push(_v.hm_aa_onway_money);
                        item[6].push(_v.fba_total_money);
                        item[7].push(_v.sales_addvalues_money);
                        item[8].push(_v.fba_4_total_money);
                        item[9].push(_v.m_date);
                    });
                    option.xAxis[0].data = item[9];
                    option.yAxis[1].max = data.data.data_max.sales_addvalues_money;

                    option.legend.data = ['亚马逊FBA在库金额', '亚马逊FBA在途金额', 'FBA虚拟仓_塘厦在库库存金额', 'FBA虚拟仓_虎门在库库存金额', 'FBA虚拟仓_塘厦采购在途金额', 'FBA虚拟仓_虎门采购在途金额', '亚马逊FBA在库+在途+产品附加值', 'FBA日销库金额+产品附加值', '合计'];

                    option.series = [
                        {
                            name:'亚马逊FBA在库金额',
                            type:'bar',
                            stack: '金额',
                            smooth: true,
                            data:[],
                        },
                        {
                            name:'亚马逊FBA在途金额',
                            type:'bar',
                            stack: '金额',
                            smooth: true,
                            data:[],
                        },
                        {
                            name:'FBA虚拟仓_塘厦在库库存金额',
                            type:'bar',
                            stack: '金额',
                            smooth: true,
                            data:[],
                        },
                        {
                            name: 'FBA虚拟仓_虎门在库库存金额',
                            type: 'bar',
                            stack: '金额',
                            smooth: true,
                            data: [],
                        },
                        {
                            name: 'FBA虚拟仓_塘厦采购在途金额',
                            type: 'bar',
                            stack: '金额',
                            smooth: true,
                            data: [],
                        },
                        {
                            name: 'FBA虚拟仓_虎门采购在途金额',
                            type: 'bar',
                            stack: '金额',
                            smooth: true,
                            data: [],
                        },
                        {
                            name: '亚马逊FBA在库+在途+产品附加值',
                            type: 'line',
                            smooth: true,
                            data: [],
                        },
                        {
                            name: 'FBA日销库金额+产品附加值',
                            type: 'line',
                            smooth: true,
                            data: [],
                            yAxisIndex: 1,
                        },
                        {
                            name: '合计',
                            type: 'line',
                            smooth: true,
                            data: [],
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
        height: 550px;
    }

    /deep/ .ui-echart--tooltip__flag {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
    }
</style>
