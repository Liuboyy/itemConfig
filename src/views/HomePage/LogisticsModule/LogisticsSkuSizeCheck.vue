<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="SKU">
                            <el-input size="small" v-model="queryData.sku"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="差异状态">
                            <el-select size="small" v-model="queryData.diffStatus" clearable>
                                <el-option v-for="item in optionList.diffStatusList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <div class="ui-filter-btn">
                    <el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>
                    <el-button size="small" type="primary" @click="handleQueryInfo()" icon="icon-chaxun" >查询</el-button>
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
        <ComTableInfo
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableMinWidth="tableMinWidth"
                :showSearch="showSearch">
            <template slot="diff_status_cn" slot-scope="scope">
                <i class="ui-state_dot state_blue" v-if="scope.row.diff_status_cn === '是'"></i>
                <i class="ui-state_dot state_gray" v-else></i>
                <span>{{scope.row.diff_status_cn}}</span>
            </template>
            <template v-for="(item, index) in tableProps" :slot="item" slot-scope="scope" v-if="index >= 12 & index <= 27">
                <span :class="scope.row[item + '_flag'] == '1' ? 'icon_pink' : ''">{{scope.row[item]}}</span>
            </template>
        </ComTableInfo>

        <div class="ui-main-module-page">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageData.currentPage"
                    :page-sizes="pageSizes"
                    size="small"
                    :page-size="pageData.currentList"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageData.currentTotal">
            </el-pagination>
        </div>


    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        autoAddTableInx,
        makeCopy
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";
    import {
        getLogisticsSkuCheckInfo,
    } from '@/api/logistics_module/logistics_sku_check';

    import {
        getPreDateRange,
        validTime,
        isOverThreeDays,
        IntervalDays
    } from '@/api/common/date_format'

    import * as importApi from '@/api/import_api/index';

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'logistics_sku_check';

    export default {
        name: component_name,
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    sku: '',
                    diffStatus: '',
                },

                optionList: {
                    diffStatusList: [
                        {value: '1', label: '是'},
                        {value: '0', label: '否'},
                    ],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth:[],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },
            }

        },
        computed: {
            ...mapGetters([
                'loginInfo',
                'queryParamsInfo',
                'statisticalReport'
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'Fn'
            ]),
            autoAddTableInx,
            getLogisticsSkuCheckInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['logistics_sku_check']);
                }

                let obj = {
                    sku: this.queryData.sku,
                    diff_status: this.queryData.diffStatus,
                };

                obj = Object.assign(params || {}, obj);

                this.getLogisticsSkuCheckInfo(obj).then(({ data }) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || data.error_Mess || '查询失败')
                    }
                })
            },

            // 查询重置
            handleResetQueryInfo() {
                this.queryData.sku = '';
                this.queryData.diffStatus = '';
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || data.error_Mess || '操作失败');
                }
            },

            // 分页条数切换
            handleSizeChange(val) {
                this.handleQueryInfo({
                    limit: val,
                    offset: 1
                }, true)
            },

            // 跳转页数切换
            handleCurrentChange(val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true)
            },

            timeLimit(BeginDate,EndDate){
                let begin = new Date(BeginDate);
                let end = new Date(EndDate);
                let beginDate = begin.getTime(begin);
                let endDate = end.getTime(end);
                let days = Math.floor((endDate - beginDate) / (24 * 3600 * 1000))
                return days;
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    isExcel: 1,
                    count_qty: this.pageData.currentTotal
                }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'logistics_sku_check',
                    value: JSON.stringify(this.queryData)
                });

                //列表渲染数据
                this.tableKey = data.key;
                this.tableProps = ['index', 'sku', 'warehouse_name', 'logical_way_name', 'last_standard_wt', 'last_standard_length', 'last_standard_wide', 'last_standard_high', 'instock_avg_wt', 'instock_length', 'instock_wide', 'instock_high', 'gc_wt', 'gc_length', 'gc_wide', 'gc_high', 'wyt_wt', 'wyt_length', 'wyt_wide', 'wyt_higt', 'px_wt', 'px_length', 'px_wide', 'px_higt', 'aml_wt', 'aml_length', 'aml_wide', 'aml_higt', 'diff_status_cn', 'create_time'];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.value;
                });
                this.tableMinWidth = this.tableProps.map(item => {
                    if (item === 'index') return '60';
                    if (item === 'diff_status_cn') return '70';
                    if (item === 'last_standard_wt'|| item === 'last_standard_length'|| item === 'last_standard_wide'|| item === 'last_standard_high'|| item === 'instock_avg_wt') return '105';
                    if (item === 'create_time') return '140';
                    if (item === 'sku'|| item === 'warehouse_name'|| item === 'logical_way_name') return '160';
                    return '90'
                });
                this.pageData.currentTotal = data.page.total_qty * 1 ;
                this.pageData.currentList = data.page.limit * 1 ;
                this.pageData.currentPage = data.page.offset * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                this.handleQueryInfo();
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>

<style scoped lang="less">


</style>
