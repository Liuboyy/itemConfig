<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                                label="统计日期"
                                template="splitDate"
                                v-model="queryData.createTime">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="质检人员">
                            <el-select v-filter filterable size="small" v-model="queryData.qualityMan">
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
        getPreDateRange,
        validTime
    } from '../../../../../api/common/date_format'

    export default {
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    createTime: [],
                    qualityMan: '',
                    countTarget: '',
                },
                optionList: {
                    qualityManList: [],
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //保存日期
                saveDefaultDate: [],
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'daySummaryInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetTqeDaySummaryInfo',
            ]),

            // 重置
            handleResetQueryInfo(){
                this.queryData.qualityMan = '';
                this.queryData.countTarget = '';
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['tqe_day_summary']);
                }

                if(!validTime(this.queryData.createTime[0], this.queryData.createTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.createTime && this.queryData.createTime[0],
                    end_date: this.queryData.createTime && this.queryData.createTime[1],
                    user_id: this.queryData.qualityMan,
                    query_type: 'd'
                };

                obj = Object.assign(obj || {}, params);

                this.GetTqeDaySummaryInfo(obj).then(({ data}) => {
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

            //默认时间
            handleGetDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.createTime = [data.start, data.end];
                });
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'tqe_day_summary',
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
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.daySummaryInfo) === '{}') {
                        this.queryData.createTime = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['tqe_day_summary']);
                        this.handleQueryInfoCallBack(this.daySummaryInfo);
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
