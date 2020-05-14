<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计日期" template="daterange" v-model="queryData.date" :isOption="false">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="一级产品线">
                            <el-select filterable v-filter size="small" v-model="queryData.productLine" multiple collapseTags>
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

    import {
        getProductLineList
    } from '@/api/infringement_module/infringe_num_count'

    import TableIndex from './TableIndex.vue'

    export default {
        components: {TableIndex},
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
                    productLine: [],
                },
                optionList: {
                    productLineList: [],
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                saveDefaultDate: []

            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'comOptions',
                'infringeGroupDetailsInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetInfringeGroupDetailsInfo',
            ]),
            getPreDateRange,

            // 重置
            handleResetQueryInfo(){
                this.queryData.productLine = [];
                this.queryData.date = this.saveDefaultDate;
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['infringe_group_details']);
                }

                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    census_date_start: this.queryData.date[0],
                    census_date_end: this.queryData.date[1],
                    product_line: this.queryData.productLine.join(','),
                };

                obj = Object.assign(obj || {}, params);

                this.GetInfringeGroupDetailsInfo(obj).then(({ data}) => {
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
                    key: 'infringe_group_details',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                let keyList = [...data.title];
                keyList.splice(data.title.indexOf('总任务数') , keyList.length);
                this.tableKey = keyList;
                this.tableProps = ['category_name_level_1'];
                this.tableData = data.data;
            }
        },
        created(){
            this.thisVm = this;
            try{
                getProductLineList().then(({ data }) => {
                    this.optionList.productLineList = data.data;
                });
                getPreDateRange().then((data) => {
                    this.saveDefaultDate= [data.start, data.end];
                    if (JSON.stringify(this.infringeGroupDetailsInfo) === '{}') {
                        this.queryData.date = this.saveDefaultDate;
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['infringe_group_details']);
                        this.handleQueryInfoCallBack(this.infringeGroupDetailsInfo);
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
