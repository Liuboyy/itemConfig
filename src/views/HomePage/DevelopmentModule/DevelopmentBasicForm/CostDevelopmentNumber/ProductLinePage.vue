<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                                label="创建日期"
                                template="splitDate"
                                v-model="queryData.createTime">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="一级产品线">
                            <el-select
                                    size="small"
                                    v-model="queryData.productLine"
                                    filterable
                                    v-filter>
                                <el-option
                                        v-for="item in optionList.productLineList"
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
            <el-button
                    v-if="item.method && item.permit(thisVm) && item.icon"
                    v-for="item in buttonList"
                    size="small"
                    :type="item.type"
                    :key="item.value"
                    :icon="item.icon"
                    @click="item.action(thisVm, item.method)">{{item.name}}</el-button>
        </div>

        <TableIndex :tableData="tableData" :tableKey="tableKey" :tableProps="tableProps" :showSearch="showSearch"></TableIndex>
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


    import TableIndex from './TableIndex.vue'

    export default {
        components: {TableIndex},
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    createTime: [],
                    productLine: '',
                },
                optionList: {
                    productLineList: [],
                },
                tableData: [],
                tableKey: [],
                tableProps: [],
                tableHeight: '100px',

                saveDefaultDate: [],
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'costProductLineInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetCostProductLineInfoInfo',
            ]),
            getPreDateRange,

            // 重置
            handleResetQueryInfo(){
                this.queryData.productLine = '';
                this.handleGetDateRange();
            },

            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['cost_product_line']);
                }

                if(!validTime(this.queryData.createTime[0], this.queryData.createTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.createTime[0] || '',
                    end_date: this.queryData.createTime[1] || '',
                    p_line_id: this.queryData.productLine,
                };

                obj = Object.assign(obj || {}, params);

                this.GetCostProductLineInfoInfo(obj).then(({ data}) => {
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
                    is_excel: 1,
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
                    key: 'cost_product_line',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.optionList.productLineList = data.data.produce_line_list;

                let keyList = [...data.data.key];
                keyList.splice(data.data.key.indexOf('合计') + 1 , keyList.length);

                this.tableKey = keyList;
                this.tableData = data.data.value;
                this.tableProps = ['p_level_name','total'];
            }
        },
        created(){
            this.thisVm = this;
            try{
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.costProductLineInfo) === '{}') {
                        this.queryData.createTime = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['cost_product_line']);
                        this.handleQueryInfoCallBack(this.costProductLineInfo);
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
