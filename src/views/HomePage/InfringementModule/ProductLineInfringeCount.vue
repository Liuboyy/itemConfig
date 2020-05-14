<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计类型">
                            <el-select size="small" v-model="queryData.countType" @change="handleChangeType">
                                <el-option
                                        v-for="(label, value) in optionList.countTypeList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.countType === 'd'">
                        <SearchRequirement label="统计日期" template="daterange" v-model="queryData.date" :isOption="false">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.countType === 'm'">
                        <SearchRequirement label="统计月份" template="daterangeym" v-model="queryData.date">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.countType === 'w'">
                        <SearchRequirement label="开始周数">
                            <el-row>
                                <el-col :span="11">
                                    <el-date-picker size="small" type="year" format="yyyy" value-format="yyyy" placeholder="选择年"
                                                    :clearable="false" v-model="queryData.year">
                                    </el-date-picker>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-select size="small" v-model="queryData.startWeek" filterable v-filter>
                                        <el-option
                                                v-for="item in optionList.weekList"
                                                :key="item.value"
                                                :value="item.value"
                                                :label="item.label"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.countType === 'w'">
                        <SearchRequirement label="结束周数">
                            <el-row>
                                <el-col :span="11">
                                    <el-date-picker size="small" type="year" format="yyyy" value-format="yyyy" placeholder="选择年"
                                                    :clearable="false" v-model="queryData.year">
                                    </el-date-picker>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-select size="small" v-model="queryData.endWeek" filterable v-filter>
                                        <el-option
                                                v-for="item in optionList.weekList"
                                                :key="item.value"
                                                :value="item.value"
                                                :label="item.label"></el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="一级产品线">
                            <el-select multiple collapseTags filterable v-filter size="small" v-model="queryData.productLine">
                                <el-option
                                    v-for="item in optionList.productLineList"
                                    :key="item.category_id_level_1"
                                    :value="item.category_id_level_1"
                                    :label="item.category_name_level_1"></el-option>
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
        <ProductLineInfringeTable ref="myTable" :tableKey="tableKey" :tableData="tableData"
                                  :showSearch="showSearch" :type="saveType"></ProductLineInfringeTable>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';

    import {
        getPreDateRange,
        getMonthRange,
        getCurrentYear,
        validTime
    } from '@/api/common/date_format'

    import {
        getProductLineList,
        getProductLineInfringeCountInfo,
    } from '@/api/infringement_module/product_line_infringe_count'

    import ProductLineInfringeTable from './ProductLineInfringeTable'

    export default {
        components: {ProductLineInfringeTable},
        data() {
            return {
                ECharts: {},
                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
                    month: [],
                    year: '',
                    startWeek: '1',
                    endWeek: '2',
                    productLine: [],
                    countType: 'd',
                },
                optionList: {
                    productLineList: [],
                    countTypeList: {
                        'd': '日',
                        'w': '周',
                        'm': '月'
                    },
                    weekList: []
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //保存日期
                saveDefaultDate: [],
                saveDefaultMonth: [],
                saveDefaultYear: '',

                saveType: ''
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
            getProductLineInfringeCountInfo,

            // 重置
            handleResetQueryInfo(){
                this.queryData.productLine = [];
                this.queryData.countType = 'd';
                this.queryData.startWeek = '1';
                this.queryData.endWeek = '2';
                this.queryData.year = this.saveDefaultYear;
                this.queryData.date = this.saveDefaultDate;
                this.queryData.month = this.saveDefaultMonth;
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['product_line_infringe_count']);
                }

                if(this.queryData.startWeek > this.queryData.endWeek) {
                    this.$message.warning('开始周数不能大于结束周数！');
                    return;
                }

                let obj = {
                    type: this.queryData.countType,
                    product_line: this.queryData.productLine.join(',')
                };

                if (this.queryData.countType !== 'w') {
                    obj.census_date_start = this.queryData.date && this.queryData.date[0];
                    obj.census_date_end = this.queryData.date && this.queryData.date[1];
                } else {
                    obj.week_start = this.queryData.year + '-' + this.queryData.startWeek;
                    obj.week_end = this.queryData.year + '-' + this.queryData.endWeek;
                }

                obj = Object.assign(obj || {}, params);

                this.getProductLineInfringeCountInfo(obj).then(({data}) => {
                    // 导出
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    } else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }
                }).catch(err => {
                    console.log(err);
                })
            },

            //切换类型
            handleChangeType(val) {
                switch (val) {
                    case 'd':
                        this.queryData.date = this.saveDefaultDate;
                        break;
                    case 'm':
                        this.queryData.date = this.saveDefaultMonth;
                        break;
                    case 'w':
                        this.queryData.year = this.saveDefaultYear;
                        break;
                }
            },

            //操作回调
            handleOperationCallBack(data) {
                if (data.status) {
                    this.$message.success('操作成功');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                } else {
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
                if (row.row.category_name_level_1 == '小计') {
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

            //获取周
            handleWeekList() {
                let arr = [];
                for(let i = 1; i < 54; i++) {
                    arr.push({
                        value: `${i}`,
                        label: `第${i}周`
                    });
                }
                return arr;
            },

            //获取本年度第几周
            getWeek(dt){
                let d1 = new Date(dt);
                let d2 = new Date(dt);
                d2.setMonth(0);
                d2.setDate(1);
                let rq = d1-d2;
                let days = Math.ceil(rq/(24*60*60*1000));
                let num = Math.ceil(days/7);
                return num;
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'product_line_infringe_count',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                let keyList = [...data.title];
                keyList.splice(0, 5);
                this.tableKey = keyList;
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data;
                });

                this.saveType = this.queryData.countType;
            }
        },
        created(){
            this.thisVm = this;
            try{
                getProductLineList().then(({ data }) => {
                    this.optionList.productLineList = data.data;
                });
                this.optionList.weekList = this.handleWeekList();
                getCurrentYear().then(( data ) => {
                    this.saveDefaultYear = data.year;
                    getMonthRange().then(( data ) => {
                        this.saveDefaultMonth = [data.start, data.end];
                        getPreDateRange().then((data) => {
//                            this.queryData.startWeek = String(this.getWeek(data.start));
//                            this.queryData.endWeek = String(this.getWeek(data.start) + 1);
                            this.saveDefaultDate = [data.start, data.end];
                            this.queryData.date = this.saveDefaultDate;
                            this.handleQueryInfo();
                        });
                    })
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>
<style lang="less" scoped>

</style>
