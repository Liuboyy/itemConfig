<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="SKU销售年份">
                            <el-date-picker
                                    @change="handleChange"
                                    :clearable="false"
                                    type="year"
                                    size="small"
                                    v-model="queryData.salesYear"
                                    format="yyyy"
                                    value-format="yyyy"
                                    placeholder="选择年"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="SKU销售月份">
                            <el-select
                                    filterable
                                    collapseTags
                                    multiple
                                    size="small"
                                    placeholder="选择月"
                                    v-model="queryData.months">
                                <el-option
                                        v-for="(label, value) in optionList.monthsList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement
                                label="SKU创建时间"
                                template="splitDate"
                                v-model="queryData.createTime"
                                :pickerOptions="pickerOptions">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement
                                label="SKU在售时间"
                                template="splitDate"
                                v-model="queryData.inSalesTime"
                                :pickerOptions="pickerOptions">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="平台">
                            <el-select
                                    size="small"
                                    v-model="queryData.platform"
                                    filterable
                                    v-filter
                                    multiple
                                    collapseTags>
                                <el-option
                                        v-for="item in optionList.platformList"
                                        :key="item.platform_code"
                                        :value="item.platform_code"
                                        :label="item.platform_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发类型">
                            <el-select
                                    size="small"
                                    v-model="queryData.developType"
                                    filterable
                                    v-filter
                                    multiple
                                    collapseTags>
                                <el-option
                                        v-for="item in optionList.developTypeList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品线">
                            <el-popover
                                    ref="popover"
                                    width="400"
                                    placement="bottom-start"
                                    trigger="manual"
                                    :visible-arrow="false"
                                    v-model="popover.line"
                                    @show="handleInTreeData">
                                <div class="ui-input__tree">
                                    <div class="ui-base--area">
                                        <el-tree
                                                ref="treeEditor"
                                                node-key="id"
                                                show-checkbox
                                                :data="optionList.productLineList"
                                                :default-expanded-keys="defaultQueryKeys"
                                                :props="defaultProps">
                                        </el-tree>
                                    </div>
                                    <div class="ui-tree__btn">
                                        <el-button type="text" @click="popover.line = false">关闭</el-button>
                                        <el-button type="text" @click="handleTreeCheckInfo">确定</el-button>
                                    </div>
                                </div>
                            </el-popover>
                            <el-input class="ui-popover__input" readonly size="small" v-popover:popover v-model="queryData.productLineName"
                                      @focus="popover.line = true"></el-input>
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
        <div class="ui-tabs_box">
            <el-tabs v-model="queryData.queryType" type="card" @tab-click="handleToggleTableInfo">
                <el-tab-pane label="销售额统计" name="1"></el-tab-pane>
                <el-tab-pane label="销量统计" name="2"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="ui-main-module-table">
            <div class="ui-charts_area">
                <div ref="myMap" class="ui-charts_bar"></div>
                <div class="ui-change_icon" v-if="tableData.length">
                    <ComIcon name="zzt" @click="handleChangeIcon('1')" title="柱状图"></ComIcon>
                    <ComIcon name="zxt" @click="handleChangeIcon('2')" title="折线图"></ComIcon>
                </div>
            </div>
            <TableIndex ref="myTable" :tableData="tableData" :tableKey="tableKey" :tableHeight="tableHeight"
                        :showSearch="showSearch"></TableIndex>
            <!--<el-table  border  stripe highlight-current-row ref="myTable"-->
                       <!--:data="tableData"  :cell-style="cellStyle" :height="tableHeight">-->
                <!--<el-table-column label="产品线" prop="linelist_cn_name" fixed width="100"></el-table-column>-->
                <!--<el-table-column label="总计">-->
                    <!--<el-table-column label="总计">-->
                        <!--<span slot slot-scope="scope">{{scope.row.total.day || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column label="国内+FBA">-->
                        <!--<span slot slot-scope="scope">{{scope.row.total.site || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column label="海外">-->
                        <!--<span slot slot-scope="scope">{{scope.row.total.oversea || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column label="代销">-->
                        <!--<span slot slot-scope="scope">{{scope.row.total.sale || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>-->
                    <!--</el-table-column>-->
                <!--</el-table-column>-->
                <!--<el-table-column-->
                        <!--v-for="(item, key, index) in tableKey"-->
                        <!--:key="index"-->
                        <!--:label="item">-->
                    <!--<el-table-column label="小计">-->
                        <!--<span slot slot-scope="scope">{{(scope.row[key] && scope.row[key].day) || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column label="国内+FBA">-->
                        <!--<span slot slot-scope="scope">{{(scope.row[key] && scope.row[key].site) || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column label="海外">-->
                        <!--<span slot slot-scope="scope">{{(scope.row[key] && scope.row[key].oversea) || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>-->
                    <!--</el-table-column>-->
                    <!--<el-table-column label="代销">-->
                        <!--<span slot slot-scope="scope">{{(scope.row[key] && scope.row[key].sale) || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>-->
                    <!--</el-table-column>-->
                <!--</el-table-column>-->
                <!--<template slot="empty">-->
                    <!--<div><NotData v-show="!tableData.length"></NotData></div>-->
                <!--</template>-->
            <!--</el-table>-->
        </div>
    </div>
</template>

<script>

    const toHtml = (contents, vm) => {
        // 小圈圈
        let rflag = color => `<span class="ui-echart--tooltip__flag" style="background: ${color}"></span>`;
        return contents.reduce((rhtml, ctn) => {
            if (ctn.seriesName) {
                return (rhtml ? `${rhtml}<br>` : '') + `${rflag(ctn.color)}${vm.tableKey[ctn.seriesName]}: ${ctn.data}`;
            } else {
                return `${ctn.axisValue}`
            }
        }, '');
    };
    const option = {
        color: ['#77d6c7','#83aafc','#bbaff1','#feca87','#fa91a7', '#ffe065','#c1cbd6'],
        tooltip: {
            trigger: 'axis'
        },
        textStyle: {//全局字体颜色
            color: "#333"
        },
        legend: {
            data: []
        },
        xAxis: [
            {
                type : 'category',
                name: '产品线',
                axisLabel: {
                    interval:0
                },
                data: [],
            },
        ],
        yAxis: {
            type: 'value',
            name: '销售额',
            axisTick:{//坐标刻度
                boundaryGap:true,
                alignWithLabel:true,//可使坐标刻度线居中，此时需要设置 boundaryGap:true,
            },
        },
        dataZoom: {
            show: true,
            x: 170,
            y: 280,
            height: 10,
            start: 0,
            end: 90,
            showDataShadow: false,
            showDetail: false,
        },
        series: []
    };

    import echarts from 'echarts'
    import config from '@/assets/js/config';
    import {
        autoAddTableInx,
        getDefaultTime,
        changeTableInfoProps,
        goToNewPage,
        getThirtyDayDateRange
    } from '@/services/index';
    import {
        mapActions,
        mapGetters
    } from 'vuex';

    import {
        getDateOptionListInfo
    } from '../../../../../api/development_module/product_line_trend'

    import {
        getCurrentYear,
        getCurrentDateRange,
        validTime
    } from '../../../../../api/common/date_format'

    import TableIndex from './TableIndex.vue'

    export default {
        components: {TableIndex},
        data () {
            return {

                ECharts: {},

                // 时间搜索框宽度设置
                searchDateWidth: config.SEARCH_DATE_WIDTH,

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    type: '3',
                    createTime: [],
                    inSalesTime: [],
                    salesYear: '',
                    months: [],
                    platform: [],
                    developType: [],
                    productLineName: '',
                    productLineId: [],
                    queryType: '1',
                },
                saveDefaultDate: [],
                saveDefaultYear: '',

                optionList: {
                    moduleTypeList: [
                        {
                            label: '销售额统计',
                            value: '1',
                        },
                        {
                            label: '销量统计',
                            value: '2'
                        }
                    ],
                    platformList: [],
                    developTypeList: [],
                    productLineList: [],
                    monthsList: {},
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                secondKey: [],
                tableHeight: '100px',

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                popover: {
                    line: false,
                },
                defaultProps: {
                    children: 'child',
                    label: 'name'
                },
                defaultQueryKeys: [],

                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                },

                saveIconType: '1',
            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'comOptions',
                'productLineSalesTrendInfo'
            ])
        },
        methods: {
            ...mapActions([
                'GetProductLineSalesTrendInfo'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,
            getDateOptionListInfo,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['product_line_month']);
                }

                if(!validTime(this.queryData.createTime[0], this.queryData.createTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }
                if(!validTime(this.queryData.inSalesTime[0], this.queryData.inSalesTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    type: this.queryData.type,
                    sele: this.queryData.queryType,
                    sale_time: this.queryData.months.length ? this.queryData.months.join(',') : this.queryData.salesYear,
                    create_time : this.queryData.createTime[0] + ',' + this.queryData.createTime[1],
                    also_time : this.queryData.inSalesTime[0] + ',' + this.queryData.inSalesTime[1],
                    platform: this.queryData.platform.join(','),
                    develop_type: this.queryData.developType.join(','),
                    product_line: this.queryData.productLineId.join(','),
                    ...params
                };

                this.GetProductLineSalesTrendInfo(obj).then(({data}) => {
                    // 导出
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData.type = '3';
                this.queryData.salesYear = this.saveDefaultYear;
                this.queryData.months = [];
                this.queryData.platform = [];
                this.queryData.developType = [];
                this.queryData.productLineId = [];
                this.queryData.productLineName = '';
                this.handleGetDateRange();
                this.handleChangeQueryInfo(this.queryData.salesYear);
            },

            //时间监听
            handleChange(val) {
                this.queryData.months = [];
                this.handleChangeQueryInfo(val);
            },
            handleChangeQueryInfo(date) {
                this.getDateOptionListInfo({
                    date: date,
                    type: 3
                }).then(({ data }) => {
                    this.optionList.monthsList = data.dates;
                    this.$store.commit('SAVE_OPTION_LIST_INFO', {
                        key: 'month_list',
                        value: this.optionList
                    })
                })
            },

            // 带入tree数据
            handleInTreeData() {
                this.$nextTick(() => {
                    const checkIds = this.queryData.productLineId;
                    this.$refs.treeEditor.setCheckedKeys(checkIds);
                });
            },

            //保存产品线
            handleTreeCheckInfo() {
                const [labels, ids] = [[], []];
                this.$refs.treeEditor.getCheckedNodes().forEach(item => {
                    labels.push(item.name);
                    ids.push(item.id);
                });
                this.queryData.productLineName = labels.join(',');
                this.queryData.productLineId = ids;
                this.defaultQueryKeys = ids;
                this.popover.line = false;
            },

            // 关闭树形下拉
            handleCloseTreeOption(event) {
                try {
                    if (event.path.some(_e => _e.className && _e.className.indexOf && _e.className.indexOf('ui-popover__input') > -1)) return;
                } catch (e) {
                    console.log(event);
                }
                this.popover.line = false;
            },

            //小计底纹
//            cellStyle(row, column, rowIndex, columnIndex) {
//                if(row.row.linelist_cn_name == '总计') {
//                    return 'background: #f3f6fa'
//                }
//            },

            init(option) {
                this.ECharts = echarts.init(this.$refs.myMap);
                this.ECharts.setOption(option);
            },

            // 分页条数切换
            handleSizeChange (val) {
                this.handleQueryInfo({
                    limit: val,
                    offset: 1
                }, true);
            },

            // 跳转页数切换
            handleCurrentChange (val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true);
            },

            handleToggleTableInfo(tab) {
                this.queryData.queryType = tab.name;
                this.handleQueryInfo();
            },

            //icon切换
            handleChangeIcon(val) {
                this.saveIconType = val;
                option.series = option.series.map(item => {
                    return {
                        ...item,
                        type: val === '1' ? 'bar' : 'line'
                    }
                });
                this.ECharts.setOption(option);
            },

            // 操作回调
            handleOperationCallBack (data, successFn, errorFn) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                    successFn && successFn();
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                    errorFn && errorFn();
                }
            },

            //默认时间
            handleGetDateRange() {
                getCurrentDateRange().then((data) => {
                    this.queryData.createTime = [data.start, data.end];
                    this.queryData.inSalesTime = [data.start, data.end];
                });
            },

            //查询回调
            handleQueryInfoCallBack (data) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'product_line_month',
                    value: JSON.stringify(this.queryData)
                });

                this.optionList.developTypeList = data.list.develop_list;
                this.optionList.platformList = data.list.platform_list;
                this.optionList.productLineList = data.list.product_list;

                //数据渲染

                this.tableKey = data.list.key;
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.list.value;

                    //图表渲染
                    let xArr = [];
                    let keys = [];
                    let lengend = [];

                    Object.keys(data.list.key).forEach(item => {
                        if(this.tableData.length) {
                            lengend.push(item);
                        }else {
                            lengend.push()
                        }
                        keys.push(item);
                    });

                    this.tableData.forEach((item) => {
                        xArr.push(item.linelist_cn_name);
                    });
                    if(xArr.length > 2) xArr.pop();

                    const echartData = keys.map(item => {
                        return {
                            type: this.saveIconType === '1' ? 'bar' : 'line',
                            name: item,
                            data: data.list.value.map(_v => {
                                return _v[item + ''] ? _v[item + ''].day : this.queryData.queryType === '1' ? '0.00' : '0.0'
                            })
                        }
                    });
                    option.xAxis[0].data = xArr;
                    option.yAxis.name = this.queryData.queryType === '1' ? '销售额' : '销量';
                    option.legend.data = lengend;

                    option.legend.formatter = (name) => {
                        return this.tableKey[name]
                    };
                    option.tooltip.formatter = (params) => {
                        let top = {
                            axisValue: params[0].name,
                        };
                        return toHtml([top, ...params], this);
                    };
                    option.series = [...echartData];

                    if (echartData.length) {
                        this.ECharts.dispose && this.ECharts.dispose();
                        this.$nextTick().then(() => {
                            this.init(option);
                        })
                    } else {
                        this.ECharts.dispose && this.ECharts.dispose();
                    }
                });
            }
        },
        created () {

            this.thisVm = this;
            try {
                getCurrentYear().then((data) => {
                    this.saveDefaultYear = data.year;
                    getCurrentDateRange().then((data) => {
                        if (!this.productLineSalesTrendInfo['3'] || JSON.stringify(this.productLineSalesTrendInfo['3']) === '{}') {
                            this.queryData.createTime = [data.start, data.end];
                            this.queryData.inSalesTime = [data.start, data.end];
                            this.queryData.salesYear = this.saveDefaultYear;
                            this.handleChangeQueryInfo(this.queryData.salesYear);
                            this.handleQueryInfo();
                        } else {
                            // 获取保存的查询参数
                            this.queryData = JSON.parse(this.queryParamsInfo['product_line_month']);
                            this.handleChangeQueryInfo(this.queryData.salesYear);
                            this.handleQueryInfoCallBack(this.productLineSalesTrendInfo['3']);
                            if (this.comOptions['month_list']) this.optionList = this.comOptions['month_list'];
                        }
                    });
                });
            } catch (e) {
                console.log(e);
            }
        },
        watch: {
            showSearch() {
                document.querySelector('body').style.overflow = 'hidden';
                setTimeout(() => {
                    this.tableHeight = config.setTableHeight('ui-main-module',['ui-charts_area', 'el-table__header-wrapper']);
                    this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400)
            }
        },
        mounted() {
            document.addEventListener('click', this.handleCloseTreeOption);
            this.init(option);
            this.$nextTick().then(() => {
                this.tableHeight = config.setTableHeight('ui-main-module',['ui-charts_area', 'el-table__header-wrapper']);
                this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
            });
        },
        beforeDestroy() {
            document.removeEventListener('click', this.handleCloseTreeOption);
        }
    };
</script>

<style lang="less" scoped>
    /deep/.el-table--border {
        border-top: 0!important;
    }

    .ui-charts_area {
        width: 100%;
        background: #FFFFFF;
        height: 300px;
        position: relative;
        .ui-charts_bar {
            width: 100%;
            height: 100%;
        }
        .ui-change_icon {
            position: absolute;
            right: 100px;
            top: 0;
            i {
                cursor: pointer;
            }
            span {
                font-size: 12px;
            }
        }
    }

    .ui-input__tree {
        .ui-base--area {
            max-height: 400px;
            overflow: auto;
        }

        .ui-tree__btn {
            padding-left: 20px;
            border-top: 1px solid #e6e6e6;
        }
    }
    /deep/ .ui-echart--tooltip__flag {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
    }

    /deep/.el-table__empty-text {
        top: 70%;
    }

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0;
    }
</style>
