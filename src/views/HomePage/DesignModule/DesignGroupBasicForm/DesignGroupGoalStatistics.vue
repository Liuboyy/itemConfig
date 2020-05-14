<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计月份">
                            <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.month"
                                    type="month"
                                    format="yyyy-MM"
                                    value-format="yyyy-MM"
                                    placeholder="选择月">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="美工人员">
                            <el-select filterable v-filter size="small" v-model="queryData.artistStaff">
                                <el-option
                                        v-for="item in optionList.artistStaffList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
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
            <!--<el-button-->
                    <!--v-if="item.method && item.permit(thisVm) && item.icon"-->
                    <!--v-for="item in buttonList"-->
                    <!--size="small"-->
                    <!--:type="item.type"-->
                    <!--:key="item.value"-->
                    <!--:icon="item.icon"-->
                    <!--@click="item.action(thisVm, item.method)">{{item.name}}</el-button>-->
        </div>
        <div class="ui-main-module-table">
            <el-table :data="tableData" :height="tableHeight" ref="myTable" stripe :cellStyle="cellStyle" highlight-current-row>
                <el-table-column label="美工人员" prop="user_name"></el-table-column>
                <el-table-column label="完成率(SKU)" prop="total_reach_ratio"></el-table-column>
                <el-table-column label="返工数(SKU)" prop="reject_cnt"></el-table-column>
                <el-table-column label="返工率(SKU)" prop="reject_ratio"></el-table-column>
                <el-table-column label="超时数(SKU)" prop="overtime_cnt"></el-table-column>
                <el-table-column label="超时率(SKU)" prop="overtime_ratio"></el-table-column>
                <el-table-column label="试卖(SKU)">
                    <el-table-column :label="tableLabel.trial_sale || '0'" prop="trial_sale_cnt"></el-table-column>
                </el-table-column>
                <el-table-column label="去logo(SKU)">
                    <el-table-column :label="tableLabel.remove_logo || '0'" prop="remove_logo_cnt"></el-table-column>
                </el-table-column>
                <el-table-column label="代销(SKU)">
                    <el-table-column :label="tableLabel.agent_sale ||  '0'" prop="agent_sale_cnt"></el-table-column>
                </el-table-column>
                <template slot="empty">
                    <div> <NotData v-show="!tableData.length"></NotData> </div>
                </template>
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
        getPreMonth
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'design_goal_statistics';

    export default {
        name: component_name,
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    month: '',
                    artistStaff: ''
                },
                optionList: {
                    artistStaffList: [],
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],
                tableHeight: '100px',
                tableLabel: {
                    trial_sale: '',
                    remove_logo: '',
                    agent_sale: '',
                },

                //保存日期
                saveDefaultDate: []
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'designGroupGoalStatisticsInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetDesignGroupGoalStatisticsInfo',
            ]),
            getPreMonth,

            // 重置
            handleResetQueryInfo(){
                this.queryData.month = this.saveDefaultDate;
                this.queryData.artistStaff = '';
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['design_goal_statistics']);
                }
                let obj = {
                    user_id: this.queryData.artistStaff,
                    month: this.queryData.month
                };

                obj = Object.assign(obj || {}, params);

                this.GetDesignGroupGoalStatisticsInfo(obj).then(({ data}) => {
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

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                }, true)
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
                if(row.row.user_name == '小计') {
                    return 'background: #f3f6fa'
                }
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'design_goal_statistics',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.optionList.artistStaffList = data.data.stuff_list;
                this.tableData = data.data.value;
                this.tableKey = data.data.key;
                this.tableLabel.trial_sale = data.data.target_sku.trial_sale;
                this.tableLabel.remove_logo = data.data.target_sku.remove_logo;
                this.tableLabel.agent_sale = data.data.target_sku.agent_sale;
            }
        },
        created(){
            this.thisVm = this;
            try{
                this.getPreMonth().then((data) => {
                    this.saveDefaultDate = data.month;
                    this.queryData.month = this.saveDefaultDate;
                    this.handleQueryInfo();
//                    if (JSON.stringify(this.designGroupGoalStatisticsInfo) === '{}') {
//                        this.queryData.month = this.saveDefaultDate;
//                        this.handleQueryInfo();
//                    } else {
//                        // 获取保存的查询参数
//                        this.queryData = JSON.parse(this.queryParamsInfo['design_goal_statistics']);
//                        this.handleQueryInfoCallBack(this.designGroupGoalStatisticsInfo);
//                    }
                });
            }catch (e) {
                console.log(e);
            }
        },
        mounted() {
            this.$nextTick().then(() => {
                this.tableHeight = config.setTableHeight('ui-main-module',['el-tabs__header']);
                this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
            });
        },
        watch: {
            showSearch() {
                document.querySelector('body').style.overflow = 'hidden';
                setTimeout(() => {
                    this.tableHeight = config.setTableHeight('ui-main-module',['el-tabs__header']);
                    this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400)
            }
        }
    }
</script>
<style lang="less" scoped>

</style>
