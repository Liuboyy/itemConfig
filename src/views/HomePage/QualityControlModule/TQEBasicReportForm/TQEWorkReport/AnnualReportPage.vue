<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="开始年份">
                            <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.startYear"
                                    type="year"
                                    format="yyyy"
                                    value-format="yyyy"
                                    placeholder="选择年">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="结束年份">
                            <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.endYear"
                                    type="year"
                                    format="yyyy"
                                    value-format="yyyy"
                                    placeholder="选择年">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea"  :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
        </div>
        <ComTableInfo
                :stripe="false"
                :otherHeight="['el-tabs__header']"
                ref="tableArea"
                :spanMethod="handleSpanMethod"
                :tableRowClassName="tableRowClassName"
                :cellMouseLeave="cellMouseLeave"
                :cellMouseEnter="cellMouseEnter"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="tableWidth"
                :showSearch="showSearch">
        </ComTableInfo>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';

    import {
        getCurrentYear
    } from '../../../../../api/common/date_format'

    export default {
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    year: '',
                    startYear: '',
                    endYear: ''
                },

                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //保存年份
                saveStartYear: '',
                saveEndYear: '',

                rowIndex: '-1'
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'annualReportInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetTqeAnnualReportInfo',
            ]),
            getCurrentYear,

            // 重置
            handleResetQueryInfo(){
                this.queryData.startYear = this.saveStartYear;
                this.queryData.endYear = this.saveEndYear;
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['tqe_annual_report']);
                }
                let obj = {
                    start_date: this.queryData.startYear,
                    end_date: this.queryData.endYear,
                };

                obj = Object.assign(obj || {}, params);

                if(obj.start_date > obj.end_date) {
                    this.$message.error('开始年份不能大于结束年份！');
                    return;
                }

                this.GetTqeAnnualReportInfo(obj).then(({ data}) => {
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

            // 表格合并
            handleSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (!columnIndex) {
                    return {
                        rowspan: row.spanLength ? row.spanLength : 0,
                        colspan: 1
                    }
                }
            },

            //处理合并行悬浮问题
            cellMouseEnter(row,cell) {
                this.rowIndex = row.rowIndex;
                this.$nextTick().then(() => {
                    if (document.querySelector('.el-table__body tr.cell-row td.is-hidden:not([rowspan="1"])')) {
                        document.querySelector('.el-table__body tr.cell-row td.is-hidden:not([rowspan="1"])').style.backgroundColor = '#fdfdfd';
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

            //默认时间
            handleGetPreDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.createTime = [data.start, data.end];
                });
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'tqe_annual_report',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                let arr = [];
                data.data.value.forEach((value, index) => {
                    value.forEach((_v, _i) => {
                        if (!_i) {
                            arr.push({
                                ..._v,
                                spanLength: value.length,
                                rowIndex: index
                            });
                        } else {
                            arr.push({
                                ..._v,
                                rowIndex: index
                            });
                        }
                    })
                });

                this.tableProps = ['type_name','date','subtotal','january','february','march','april','may','june','july','august','september','october','november','december'];
                this.tableKey = data.data.key;
                this.tableData = [...arr];
                this.tableWidth = ['140','80',''];
            }
        },
        created(){
            this.thisVm = this;
            this.saveStartYear = JSON.stringify(new Date().getFullYear() - 1);
            try{
                this.getCurrentYear().then((data) => {
                    this.saveEndYear = data.year;
                    if (JSON.stringify(this.annualReportInfo) === '{}') {
                        this.queryData.startYear = this.saveStartYear;
                        this.queryData.endYear = this.saveEndYear;
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['tqe_annual_report']);
                        this.handleQueryInfoCallBack(this.annualReportInfo);
                    }
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>
<style lang="less" scoped>

</style>
