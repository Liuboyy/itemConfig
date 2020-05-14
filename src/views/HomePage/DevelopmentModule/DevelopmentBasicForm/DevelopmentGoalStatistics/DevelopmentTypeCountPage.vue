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
                    <li v-if="queryData.dimension == 'month'">
                        <SearchRequirement label="创建月份">
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
                    <li v-if="queryData.dimension == 'year'">
                        <SearchRequirement label="创建年份">
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
                    <li v-if="queryData.dimension == 'month'">
                        <SearchRequirement label="质检月份">
                            <el-date-picker size="small" v-model="queryData.inspectDate"
                                            type="month" format="yyyy-MM"  value-format="yyyy-MM" placeholder="选择月">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.dimension == 'year'">
                        <SearchRequirement label="质检年份">
                            <el-date-picker size="small" v-model="queryData.inspectDate"
                                            type="year" format="yyyy" value-format="yyyy" placeholder="选择年">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="目标">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.targetValueMin"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.targetValueMax" ></el-input>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="已质检">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.inspectMin"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.inspectMax"></el-input>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发类型">
                            <el-select
                                    size="small"
                                    v-model="queryData.developmentType"
                                    filterable
                                    v-filter>
                                <el-option
                                        v-for="item in optionList.developmentTypeList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="创建数(有效)">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.createValidMin"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.createValidMax"></el-input>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="创建数(未提交)">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.createNoSubMin"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.createNoSubMax"></el-input>
                                </el-col>
                            </el-row>
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
        <div class="ui-main-module-table" v-if="saveDateType == 'month'">
            <el-table ref="myTable" :height="tableHeight" :data="tableData" :cellStyle="cellStyle" highlight-current-row
                     stripe border @sort-change="handleSortChange">
                <el-table-column
                        v-for="(item, index) in tableFrontKey"
                        :key="index + 'month'"
                        :label="item"
                        :prop="tableProps[index]"
                        :fixed="tableFixed[index]"
                        :minWidth="tableMinWidth[index]"
                        :sortable="tableSort[index]">
                    <template slot-scope="scope">
                        <slot :name="tableProps[index]" :row="scope.row" :$index="scope.$index">
                            {{scope.row[tableProps[index]]}}
                        </slot>
                    </template>
                </el-table-column>
                <el-table-column
                        v-for="(item, index) in tableBackKey"
                        :key="index"
                        :label="item + '日'">
                    <el-table-column
                            minWidth="60"
                            label="创建数">
                        <span slot slot-scope="scope">{{scope.row[item] && scope.row[item].create_qty}}</span>
                    </el-table-column>
                    <el-table-column
                            minWidth="60"
                            label="已质检">
                        <span slot slot-scope="scope">{{scope.row[item] && scope.row[item].total_qty}}</span>
                    </el-table-column>
                </el-table-column>
                <template slot="empty"><div><NotData v-show="!tableData.length"></NotData></div></template>
            </el-table>
        </div>
        <div class="ui-main-module-table" v-if="saveDateType == 'year'">
            <el-table ref="myTable" :height="tableHeight" :data="tableData" :cellStyle="cellStyle" highlight-current-row
                      stripe border @sort-change="handleSortChange">
                <el-table-column
                        v-for="(item, index) in tableFrontKey"
                        :key="index + 'month'"
                        :label="item"
                        :prop="tableProps[index]"
                        :fixed="tableFixed[index]"
                        :minWidth="tableMinWidth[index]"
                        :sortable="tableSort[index]">
                    <template slot-scope="scope">
                        <slot :name="tableProps[index]" :row="scope.row" :$index="scope.$index">
                            {{scope.row[tableProps[index]]}}
                        </slot>
                    </template>
                </el-table-column>
                <el-table-column
                        v-for="(item, index) in tableBackKey"
                        :key="index"
                        :label="item + '月'">
                    <el-table-column
                            minWidth="60"
                            label="月目标">
                        <span slot slot-scope="scope">{{scope.row[item] && scope.row[item].total_value}}</span>
                    </el-table-column>
                    <el-table-column
                            minWidth="60"
                            label="创建数">
                        <span slot slot-scope="scope">{{scope.row[item] && scope.row[item].create_qty}}</span>
                    </el-table-column>
                    <el-table-column
                            minWidth="60"
                            label="已质检">
                        <span slot slot-scope="scope">{{scope.row[item] && scope.row[item].total_qty}}</span>
                    </el-table-column>
                    <el-table-column
                            minWidth="60"
                            label="完成率">
                        <span slot slot-scope="scope">{{scope.row[item] && scope.row[item].quality_sale}}</span>
                    </el-table-column>
                </el-table-column>
                <template slot="empty"><div><NotData v-show="!tableData.length"></NotData></div></template>
            </el-table>
        </div>
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
        getCurrentMonth,
        getCurrentYear
    } from '../../../../../api/common/date_format'
    const component_name = 'development_goal_statistics';
    export default {
        name: component_name,
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    dimension: 'month',
                    date: '',
                    developmentType: '',
                    inspectDate: '',
                    targetValueMin: '',
                    targetValueMax: '',
                    inspectMin: '',
                    inspectMax: '',
                    createValidMin: '',
                    createValidMax: '',
                    createNoSubMin: '',
                    createNoSubMax: '',
                    sortField: '',
                    sortBy: '',
                    sortOrder: {
                        prop: 'total_value',
                        order: 'desc'
                    },
                },
                optionList: {
                    developmentTypeList: [],
                    dimensionList: {
                        'month': '月',
                        'year': '年'
                    }
                },
                tableHeight: '100px',
                tableKey: [],
                tableFrontKey: [],
                tableBackKey: [],
                tableProps: [],
                tableData: [],
                tableMinWidth: [],
                tableFixed: [],
                tableSort: [],

                //保存日期
                saveDefaultDate: '',
                //保存日期类型
                saveDateType: 'month'
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'developmentTypeCountInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetDevelopmentTypeCountInfo',
            ]),
            getPreMonth,
            getCurrentMonth,
            getCurrentYear,

            // 重置
            handleResetQueryInfo(){
                this.queryData = {
                    dimension: 'month',
                    date: this.saveDefaultDate,
                    developmentType: '',
                    inspectDate: '',
                    targetValueMin: '',
                    targetValueMax: '',
                    inspectMin: '',
                    inspectMax: '',
                    createValidMin: '',
                    createValidMax: '',
                    createNoSubMin: '',
                    createNoSubMax: '',
                    sortField: '',
                    sortBy: '',
                }
            },

            //监听维度
            handleChangeDimension(val) {
                if(val) this.queryData.date = '';
                if(val == 'month') {
                    this.getCurrentMonth().then((data) => {
                        this.queryData.date = data.month;
                    });
                }
                if(val == 'year') {
                    this.getCurrentYear().then((data) => {
                        this.queryData.date = data.year;
                    });
                }
            },

            //排序
            handleSortChange(column) {
                this.queryData.sortOrder = {
                    prop: column.prop,
                    order: column.order
                };
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'development_group',
                    value: JSON.stringify(this.queryData)
                });

                this.queryData.sortField = column.prop;

                if (column.prop === "total_value") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                if (column.prop === "create_qty") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                if (column.prop === "create_filed") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                if (column.prop === "total_qty") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                if (column.prop === "create_sale") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                if (column.prop === "quality_sale") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                this.handleQueryInfo();
            },

            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['development_type']);
                }

                let reg = /^\d+(\.\d+)?$/;

                if(this.queryData.targetValueMin) {
                    if(!reg.test(this.queryData.targetValueMin)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.targetValueMax) {
                    if(!reg.test(this.queryData.targetValueMax)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.inspectMin) {
                    if(!reg.test(this.queryData.inspectMin)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.inspectMax) {
                    if(!reg.test(this.queryData.inspectMax)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.createValidMin) {
                    if(!reg.test(this.queryData.createValidMin)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.createValidMax) {
                    if(!reg.test(this.queryData.createValidMax)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.createNoSubMin) {
                    if(!reg.test(this.queryData.createNoSubMin)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.createNoSubMax) {
                    if(!reg.test(this.queryData.createNoSubMax)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }

                if(this.queryData.targetValueMin || this.queryData.targetValueMax) {
                    if(!this.queryData.targetValueMin || !this.queryData.targetValueMax) {
                        this.$message.warning('请输入查询区间！');
                        return;
                    }
                }
                if(this.queryData.inspectMin || this.queryData.inspectMax) {
                    if(!this.queryData.inspectMin || !this.queryData.inspectMax) {
                        this.$message.warning('请输入查询区间！');
                        return;
                    }
                }
                if(this.queryData.createValidMin || this.queryData.createValidMax) {
                    if(!this.queryData.createValidMin || !this.queryData.createValidMax) {
                        this.$message.warning('请输入查询区间！');
                        return;
                    }
                }
                if(this.queryData.createNoSubMin || this.queryData.createNoSubMax) {
                    if(!this.queryData.createNoSubMin || !this.queryData.createNoSubMax) {
                        this.$message.warning('请输入查询区间！');
                        return;
                    }
                }

                let obj = {
                    statistical_type: this.queryData.dimension,
                    statistical_time: this.queryData.date,
                    develop_type: this.queryData.developmentType,
                    quality_time: this.queryData.inspectDate,
                    target_value: this.queryData.targetValueMin && this.queryData.targetValueMax ?  this.queryData.targetValueMin + ',' + this.queryData.targetValueMax : '',
                    quality_qty: this.queryData.inspectMin && this.queryData.inspectMax ? this.queryData.inspectMin + ',' + this.queryData.inspectMax : '',
                    create_qty : this.queryData.createValidMin && this.queryData.createValidMax ? this.queryData.createValidMin + ',' + this.queryData.createValidMax : '',
                    create_filed : this.queryData.createNoSubMin && this.queryData.createNoSubMax ? this.queryData.createNoSubMin + ',' + this.queryData.createNoSubMax : '',
                    sort_field: this.queryData.sortField,
                    sort_by: this.queryData.sortBy,
                };

                obj = Object.assign(obj || {}, params);

                this.GetDevelopmentTypeCountInfo(obj).then(({ data}) => {
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

            //小计底纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.devp_type_cn == '小计') {
                    return 'background: #f3f6fa'
                }
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

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'development_type',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染

                this.saveDateType = this.queryData.dimension;
                this.optionList.developmentTypeList = data.list.developType

                let fontKey = [...data.list.key];
                let backKey = [...data.list.key];

                fontKey.splice(data.list.key.indexOf('完成率(质检)') + 1 , fontKey.length);
                backKey.splice(0, data.list.key.indexOf('完成率(质检)') + 1);

                this.tableFrontKey = fontKey;
                this.tableBackKey = backKey;
                this.tableProps = ['devp_type_cn','total_value','create_qty', 'create_filed', 'total_qty', 'create_sale','quality_sale'];

                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.list.value;
                });

                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'total_value'|| item === 'total_qty') return '80';
                    if(item === 'user_name'|| item === 'devp_type_cn') return '100';
                    if(item === 'create_qty'|| item === 'create_sale'|| item === 'quality_sale') return '120';
                    if(item === 'create_filed') return '130';
                    return '70'
                });
                this.tableFixed = this.tableProps.map(item => {
                    if(item === 'devp_type_cn' || item === 'total_value') return true;
                    return false
                });
                this.tableSort = this.tableProps.map(item => {
                    if(item === 'total_value'|| item === 'create_qty'||item === 'create_filed'|| item === 'total_qty'|| item === 'create_sale'|| item === 'quality_sale') return 'custom';
                    return false;
                });
            }
        },
        created(){
            this.thisVm = this;
            try{
                this.getCurrentMonth().then((data) => {
                    this.saveDefaultDate = data.month;
                    if (JSON.stringify(this.developmentTypeCountInfo) === '{}') {
                        this.queryData.date = this.saveDefaultDate;
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['development_type']);
                        this.handleQueryInfoCallBack(this.developmentTypeCountInfo);
                    }
                })
            }catch (e) {
                console.log(e);
            }
        },
        mounted() {
            this.$nextTick().then(() => {
                this.tableHeight = config.setTableHeight('s-main',['el-tabs__header']);
                this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
            });
        },
        watch: {
            showSearch() {
                document.querySelector('body').style.overflow = 'hidden';
                setTimeout(() => {
                    this.tableHeight = config.setTableHeight('s-main',['el-tabs__header']);
                    this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400)
            }
        }
    }
</script>
<style lang="less" scoped>

</style>
