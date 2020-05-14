<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计日期" template="daterange" v-model="queryData.date" :isOption="false">
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

        <TableIndex :tableData="tableData" :tableProps="tableProps" :tableKey="tableKey"
                    :tableWidth="tableWidth" :showSearch="showSearch"></TableIndex>
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
    } from '@/api/common/date_format'

    import TableIndex from './TableIndex.vue'

    export default {
        components: {TableIndex},
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
                },
                optionList: {},
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                saveDefaultDate: [],
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'infringeGroupSummaryInfo',
            ]),
        },
        methods: {
            ...mapActions([
                'GetInfringeGroupSummaryInfo',
            ]),
            getPreDateRange,

            // 重置
            handleResetQueryInfo(){
                this.queryData.date = this.saveDefaultDate;
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['infringe_group_summary']);
                }

                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    census_date_start: this.queryData.date && this.queryData.date[0],
                    census_date_end: this.queryData.date && this.queryData.date[1],
                };

                obj = Object.assign(obj || {}, params);

                this.GetInfringeGroupSummaryInfo(obj).then(({ data}) => {
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

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1
                }, true)
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
            handleGetPreDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.date = [data.start, data.end];
                });
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'infringe_group_summary',
                    value: JSON.stringify(this.queryData)
                });

                let keyList = [...data.title];
                keyList.splice(data.title.indexOf('总任务数') , keyList.length);
                this.tableKey = keyList;
                this.tableProps = ['type_name'];
                this.tableData = data.data;
            }
        },
        created(){
            this.thisVm = this;
            try{
                getPreDateRange().then((data) => {
                    this.saveDefaultDate = [data.start, data.end];
                    if (JSON.stringify(this.infringeGroupSummaryInfo) === '{}') {
                        this.queryData.date = this.saveDefaultDate;
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['infringe_group_summary']);
                        this.handleQueryInfoCallBack(this.infringeGroupSummaryInfo);
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
