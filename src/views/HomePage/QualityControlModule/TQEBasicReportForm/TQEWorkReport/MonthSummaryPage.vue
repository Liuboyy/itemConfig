<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计年份">
                            <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.year"
                                    type="year"
                                    format="yyyy"
                                    value-format="yyyy"
                                    placeholder="选择年">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="统计月份">
                            <el-select
                                    filterable
                                    v-filter
                                    collapseTags
                                    multiple
                                    size="small"
                                    placeholder="请至少选择一个月份"
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
                        <SearchRequirement label="质检人员">
                            <el-select filterable v-filter size="small" v-model="queryData.qualityMan">
                                <el-option
                                        v-for="item in optionList.qualityManList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
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
                :otherHeight="['el-tabs__header']"
                ref="tableArea"
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
        getPreMonth,
        getCurrentYear
    } from '../../../../../api/common/date_format'

    export default {
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    year: '',
                    months: ['4'],
                    qualityMan: '',
                },
                optionList: {
                    qualityManList: [],
                    countTargetList: [],
                    monthsList: {
                        1: '一月',
                        2: '二月',
                        3: '三月',
                        4: '四月',
                        5: '五月',
                        6: '六月',
                        7: '七月',
                        8: '八月',
                        9: '九月',
                        10: '十月',
                        11: '十一月',
                        12: '十二月',
                    }
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                saveDefaultYear: '',
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'monthSummaryInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetTqeMonthSummaryInfo',
            ]),

            // 重置
            handleResetQueryInfo(){
                this.queryData.qualityMan = '';
                this.queryData.year = this.saveDefaultYear;
                this.queryData.months = [JSON.stringify(new Date().getMonth())];
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['tqe_month_summary']);
                }

                if(!this.queryData.months.length) {
                    this.$message.warning('请选择月份！');
                    return;
                }
                let monthArr = [];
                this.queryData.months.forEach(item => {
                    if(item < 10) {
                        monthArr.push(this.queryData.year + '-0'+ item)
                    }else {
                        monthArr.push(this.queryData.year + '-' + item)
                    }
                });
                let obj = {
                    months: monthArr.join(','),
                    user_id: this.queryData.qualityMan,
                    query_type: 'm',
                };

                obj = Object.assign(obj || {}, params);

                this.GetTqeMonthSummaryInfo(obj).then(({ data}) => {
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

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'tqe_month_summary',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableData = data.data.value;
                this.tableKey = data.data.key;
                this.tableProps = ['user_name','review_num','reject_num','rework_num','overtime_num','consuming_time','attendance_time','tqe_uph','efficiency_rate'];
                this.tableWidth = [];
                this.optionList.qualityManList = data.data.user_list;
            }
        },
        created(){
            this.thisVm = this;
            try{
                getCurrentYear().then((data) => {
                    this.saveDefaultYear = data.year;
                    if (JSON.stringify(this.monthSummaryInfo) === '{}') {
                        this.queryData.year = this.saveDefaultYear;
                        this.queryData.months = [JSON.stringify(new Date().getMonth())];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['tqe_month_summary']);
                        this.handleQueryInfoCallBack(this.monthSummaryInfo);
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
