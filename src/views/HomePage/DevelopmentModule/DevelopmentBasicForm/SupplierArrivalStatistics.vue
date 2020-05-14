<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计类型">
                            <el-select
                                    size="small"
                                    v-model="queryData.dimension"
                                    @change="handleChangeDimension">
                                <el-option
                                        v-for="(label, value) in optionList.dimensionList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.dimension === 'month'">
                        <SearchRequirement label="统计月份">
                            <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.date"
                                    type="month"
                                    format="yyyy-MM"
                                    value-format="yyyy-MM"
                                    placeholder="选择月">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.dimension === 'year'">
                        <SearchRequirement label="统计年份">
                            <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.date"
                                    type="year"
                                    format="yyyy"
                                    value-format="yyyy"
                                    placeholder="选择年">
                            </el-date-picker>
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
            <!--<span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>-->
            <el-button
                    v-if="item.method && item.permit(thisVm) && item.icon"
                    v-for="item in buttonList"
                    size="small"
                    :type="item.type"
                    :key="item.value"
                    :icon="item.icon"
                    @click="item.action(thisVm, item.method)">{{item.name}}</el-button>
        </div>

        <TemplateDefault :staticNum="140" color="#FFFFFF" style="position: relative; overflow: hidden">
            <div class="ui-echarts" ref="myMap"></div>
            <div>
                <span class="ui-echart-bar"></span><span class="ui-echart-txt">无数据</span>
            </div>
            <ComTableInfo
                    ref="tableArea"
                    :stripe="false"
                    :tableKey="tableKey"
                    :tableProps="tableProps"
                    :tableData="tableData"
                    :tableWidth="tableWidth"
                    :showSearch="showSearch"
                    :spanMethod="handleSpanMethod"
                    :cellStyle="cellStyle"
                    :tableRowClassName="tableRowClassName"
                    :cellMouseLeave="cellMouseLeave"
                    :cellMouseEnter="cellMouseEnter">
                <template slot="operation" slot-scope="scope">
                    <el-button size="small" type="text" @click="handlePreviewInfo(scope.row)"
                               v-if="buttonList['preview'] && buttonList['preview'].permit(thisVm) && scope.row.city_name != '小计'">查看</el-button>
                </template>
            </ComTableInfo>
        </TemplateDefault>


        <ComDialogPreview
                isButton
                @export="handleDialogExportInfo"
                width="1200px"
                title="供应商平均时效详情"
                :visible.sync="isPreviewShow"
                :tableKey="dialogKey"
                :tableProps="dialogProps"
                :cellStyle="cellStyle"
                :tableData="dialogData"></ComDialogPreview>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';
    import {
        getPreMonth,
        getCurrentYear
    } from '../../../../api/common/date_format'

    import {
        getSupplierArrivalCountInfo
    } from '../../../../api/development_module/supplier_arrival_statistics'

    import echarts from 'echarts'
    const option = {
        title: {
            text: '各省市供应商平均到样时效分布',
            top: '20px',
            left: '20px',
            textStyle: {
                fontSize: 16,
                color: '#333',
            }
        },
        series: [
            {
                name: '中国地图',
                type: 'map',
                mapType: 'china', // 自定义扩展图表类型
                data: [],
                nameMap: {
                    '新疆': '新疆维吾尔自治区', '西藏': '西藏自治区', '内蒙古': '内蒙古自治区', '青海': '青海省', '四川': '四川省', '黑龙江': '黑龙江省', '甘肃': '甘肃省', '云南': '云南省', '广西': '广西壮族自治区', '湖南': '湖南省', '陕西': '陕西省', '广东': '广东省', '吉林': '吉林省', '河北': '河北省', '湖北': '湖北省', '贵州': '贵州省',  '山东': '山东省', '江西': '江西省', '河南': '河南省', '辽宁': '辽宁省', '山西': '山西省', '安徽': '安徽省', '福建': '福建省', '浙江': '浙江省', '江苏': '江苏省',  '重庆': '重庆市', '宁夏': '宁夏回族自治区',  '海南': '海南省', '台湾': '台湾省', '北京': '北京市',  '天津': '天津市', '上海': '上海市', '澳门': '澳门特别行政区','香港': '香港特别行政区'}
            }
        ],
        visualMap: {
            left: 'left',
            min: 0,
            max: 30,
            inRange: {
                color: ['#126ce8','#89f7fe']
            },
            text:['平均到样时效(天)'],           // 文本，默认为数值文本
            calculable: true,
            x: 'left',
            y: 'bottom',
            orient: 'horizontal'
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                if(params.data.value == 0){
                    return '无数据';
                }else {
                    return '平均到样时效：' + params.data.value + '天';
                }
            },
        }
    };


    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'supplier_arrival_statistics';

    export default {
        name: component_name,
        data() {
            return {
                ECharts: {},

                showSearch: true,
                thisVm: {},

                queryData: {
                    dimension: 'month',
                    date: ''
                },
                optionList: {
                    dimensionList: {
                        'month':  '月',
                        'year':  '年'
                    }
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],
                mapData: [],

                //保存日期
                saveDefaultDate: '',
                saveDefaultYear: '',
                saveProvince: '',
                saveRowData: {},

                //查看详情
                isPreviewShow: false,
                title: '',
                dialogKey: [],
                dialogProps: [],
                dialogData: [],

                rowIndex: '-1'
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'supplierArrivalCountInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetSupplierArrivalCountInfo',
            ]),
            getPreMonth,
            getCurrentYear,
            getSupplierArrivalCountInfo,

            // 重置
            handleResetQueryInfo(){
                this.queryData = {
                    dimension: 'month',
                    date: this.saveDefaultDate,
                }
            },

            //监听维度
            handleChangeDimension(val) {
                if(val) this.queryData.date = '';
                switch (val) {
                    case 'month':
                        this.queryData.date = this.saveDefaultDate;
                    break;
                    case 'year':
                        this.queryData.date = this.saveDefaultYear;
                        break;
                }
            },

            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['supplier_arrival_statistics']);
                }

                let obj = {
                    statistical_type: this.queryData.dimension,
                    statistical_time: this.queryData.date,
                    shipping_province: this.saveProvince === '' ? '44' : this.saveProvince
                };

                obj = Object.assign(obj || {}, params);

                this.getSupplierArrivalCountInfo(obj).then(({ data}) => {
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

            //查看详情
            handlePreviewInfo(row) {
                this.isPreviewShow = true;
                this.saveRowData = row;
                this.getSupplierArrivalCountInfo({
                    statistical_type: row.type,
                    statistical_time: row.date,
                    suppliers: `${row.shipping_province},${row.shipping_city}`,
                }).then(({ data }) => {
                    if(data.status) {
                        this.dialogKey = data.list.key;
                        this.dialogData = data.list.value;
                        const props = [...data.list.key];
                        props.splice(0,1);
                        if(row.type == 'month') {
                            this.dialogProps = ['supplier_name', ...props];
                        }else {
                            this.dialogProps = ['supplier_name', 'avg_date'];
                        }
                    }
                })
            },
            //详情导出
            handleDialogExportInfo() {
                let obj = {
                    statistical_type: this.saveRowData.type,
                    statistical_time: this.saveRowData.date,
                    suppliers: `${this.saveRowData.shipping_province},${this.saveRowData.shipping_city}`,
                    isExcel: 1
                };
                let str = '?';
                for (let key in obj) {
                    str = `${str}&${key}=${obj[key] || ''}`;
                }
                window.open('/development/Develop_suppliers/getSupplierList' + str, '_self');
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

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    isExcel: 1,
                }, true)
            },

            // 表格合并
            handleSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex == 0) {
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

            //小计底纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.city_name == '小计'|| row.row.supplier_name == '小计') {
                    return 'background: #f3f6fa'
                }
            },

            //查询回调
            handleQueryInfoCallBack(data){
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'supplier_arrival_statistics',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                let arr = [];
                if(data.list.value) {
                    data.list.value.forEach((value, index) => {
                        value.forEach((_v, _i) => {
                            if (!_i) {
                                arr.push({
                                    ..._v,
                                    type: this.queryData.dimension,
                                    date: this.queryData.date,
                                    spanLength: value.length,
                                    rowIndex: index
                                });
                            } else {
                                arr.push({
                                    ..._v,
                                    type: this.queryData.dimension,
                                    date: this.queryData.date,
                                    rowIndex: index
                                });
                            }
                        })
                    });
                }
                this.tableData = [...arr];
                this.tableKey = data.list.key;
                this.tableProps = ['name','city_name','value','operation'];
                this.tableWidth = ['150']
                this.mapData = data.list.province_name.map(item => {
                    let itemData = {
                        ...item,
                        value: item.value * 1,
                        date: this.queryData.date,
                        type: this.queryData.dimension,
                    };
                    if (item.value == 0) {
                        itemData.itemStyle = {
                            opacity: 0.1
                        }
                    }
                    return itemData;
                });
                this.ECharts = echarts.init(this.$refs.myMap);
                option.series[0].data = this.mapData;
                let num = [];
                this.mapData.forEach(item => { num.push(item.value);});
                let min = Math.min.apply(null, num) * 1;
                let max = Math.max.apply(null, num) * 1;
                option.visualMap.min = min;
                option.visualMap.max = max;
                this.ECharts.setOption(option);
            }
        },
        created(){
            this.thisVm = this;
            try{
                this.getCurrentYear().then((data) => {
                    this.saveDefaultYear = data.year;
                    this.getPreMonth().then((data) => {
                        this.saveDefaultDate = data.month;
                        this.queryData.date = this.saveDefaultDate;
                        this.handleQueryInfo();
                    })
                })
            }catch (e) {
                console.log(e);
            }
        },

        mounted () {
            const vm = this;
            this.$nextTick().then(() => {
                echarts.registerMap('china', require('../../../../api/common/china_map.json'));
                this.ECharts = echarts.init(vm.$refs.myMap);
                this.ECharts.setOption(option);
                this.ECharts.on('click', function(e) {
//                    console.log(e)
                    vm.saveProvince = `${e.data.shipping_province}`;
                    vm.getSupplierArrivalCountInfo({
                        statistical_type: e.data.type,
                        statistical_time: e.data.date,
                        shipping_province: `${e.data.shipping_province}`
                    }).then(({ data }) => {
                        vm.handleQueryInfoCallBack(data);
                    })
                })
            })
        },
    }
</script>
<style lang="less" scoped>

    .ui-echarts {
        float: left;
        width: 60%;
        height: 700px;
        background: #FFFFFF;
    }

    .ui-echart-bar{
        background: #e6f0fd;
        display: inline-block;
        width: 140px;
        height: 20px;
        position: absolute;
        left: 300px;
        bottom: 32px;
    }
    .ui-echart-txt {
        position: absolute;
        left: 450px;
        bottom: 35px;
        font-size: 12px;
        color: #333333;
    }

</style>
