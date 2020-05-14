<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="平台账号">
                            <el-select size="small" v-model="queryData.account_id" filterable v-filter multiple collapseTags>
                                <el-option v-for="item in optionList.account_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="客服人员">
                            <el-select size="small" v-model="queryData.user_name" filterable v-filter multiple collapseTags>
                                <el-option v-for="item in optionList.user_name_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="综合表现">
                            <el-select size="small" v-model="queryData.integrte_evaluation" filterable v-filter>
                                <el-option v-for="item in optionList.integrte_eval_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="不良交易率表现">
                            <el-select size="small" v-model="queryData.bad_trans_evaluation" filterable v-filter>
                                <el-option v-for="item in optionList.integrte_eval_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="纠纷表现">
                            <el-select size="small" v-model="queryData.dispute_evaluation" filterable v-filter>
                                <el-option v-for="item in optionList.integrte_eval_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="货运表现">
                            <el-select size="small" v-model="queryData.freight_evaluation" filterable v-filter>
                                <el-option v-for="item in optionList.freight_eval_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="非货运表现">
                            <el-select size="small" v-model="queryData.unfreight_evaluation" filterable v-filter>
                                <el-option v-for="item in optionList.freight_eval_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="大于5美金">
                            <el-select size="small" v-model="queryData.logistics_standard_m5" filterable v-filter>
                                <el-option v-for="item in optionList.logistics_std_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="小于5美金">
                            <el-select size="small" v-model="queryData.logistics_standard_l5" filterable v-filter>
                                <el-option v-for="item in optionList.logistics_std_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="Speed PAK">
                            <el-select size="small" v-model="queryData.logistics_standard_sp" filterable v-filter>
                                <el-option v-for="item in optionList.logistics_std_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="海外仓标准">
                            <el-select size="small" v-model="queryData.warehouse_standard" filterable v-filter>
                                <el-option v-for="item in optionList.warehouse_std_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="商业计划追踪">
                            <el-select size="small" v-model="queryData.business_plan_track" filterable v-filter>
                                <el-option v-for="item in optionList.business_plant_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="待处理刊登">
                            <el-select size="small" v-model="queryData.predeal_public" filterable v-filter>
                                <el-option v-for="item in optionList.predeal_public_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="拉取时间" v-model="queryData.pullTime" template="daterange" clearable></SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"
                           :params="{limit: pageData.currentList}"></FilterBtn>
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
            <template v-for="(item, index) in tableClickProps" :slot="item" slot-scope="scope">
                <el-button type="text" size="small" @click="handleClickDialog({
                    type: scope.row[item].type,
                    account_id: scope.row[item].account_id,
                    statis_date: scope.row.data_time,})">
                    <span class="orange" v-if="scope.row[item].value === '警告'">{{scope.row[item].value}}</span>
                    <span class="blue" v-if="scope.row[item].value === '不考核'|| scope.row[item].value === '有待处理刊登'">
                        {{scope.row[item].value}}</span>
                    <span class="green" v-if="scope.row[item].value === '正常'">{{scope.row[item].value}}</span>
                    <span class="red" v-if="scope.row[item].value === '超标'">{{scope.row[item].value}}</span>
                    <span class="purple" v-if="scope.row[item].value === '限制'">{{scope.row[item].value}}</span>
                    <!--<span v-if="scope.row[item].value === '无待处理刊登'">{{scope.row[item].value}}</span>-->
                </el-button>
                <span v-if="scope.row[item].value === '无'||scope.row[item].value === '无待处理刊登'">{{scope.row[item].value}}</span>
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

        <ComplexPerformance title="综合表现" :visible.sync="isComplexShow" :detailsData="dialogDetailsData"
                            :dialogData="dialogTableData" :dialogKey="dialogTableKey" :dialogProps="dialogTableProps">
            <template slot="status" slot-scope="scope">
                <i class="ui-state_dot state_green" v-if="scope.row.status === '正常'"></i>
                <i class="ui-state_dot state_red" v-if="scope.row.status === '超标'"></i>
                <i class="ui-state_dot state_orange" v-if="scope.row.status === '警告'|| scope.row.status === '有待处理刊登'"></i>
                <i class="ui-state_dot state_blue" v-if="scope.row.status === '限制'"></i>
                <i class="ui-state_dot state_gray" v-if="scope.row.status === '不考核'||scope.row.status === '无'
                    || scope.row.status === '无待处理刊登'"></i>
                <span>{{scope.row.status}}</span>
            </template>
        </ComplexPerformance>

        <FreightPerformance :title="freightTypes === '1' ? '货运表现' : '非货运表现'" :visible.sync="isFreightShow" :types="freightTypes"
                            :dialogData="dialogTableData" :detailsData="dialogDetailsData"></FreightPerformance>

        <LogisticsStandard  title="物流标准" :visible.sync="isLogisticsShow"
                            :dialogData1="dialogTableData1" :dialogData2="dialogTableData2" :detailsData="dialogDetailsData"></LogisticsStandard>

        <OverseaStandard title="海外仓标准" :visible.sync="isOverseaShow"
                         :dialogData="dialogTableData" :detailsData="dialogDetailsData"></OverseaStandard>

        <BusinessPlan title="商业计划追踪" :visible.sync="isBusinessShow"
                      :dialogData="dialogTableData" :detailsData="dialogDetailsData"></BusinessPlan>

        <PendingPublish title="待处理刊登" :visible.sync="isPendingShow"
                        :dialogData="dialogTableData" :detailsData="dialogDetailsData"></PendingPublish>
    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        autoAddTableInx
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";

    import {
        getBuyerExperienceReportInfo,
        getOptionList,
        getDialogDetailsInfo
    } from '@/api/customer_service_module/buyer_experience_report';

    import {
        getPreDateRange,
        getCurrentDateRange
    } from '@/api/common/date_format'

    import ComplexPerformance from './components/ComplexPerformance.vue'
    import FreightPerformance from './components/FreightPerformance.vue'
    import LogisticsStandard from './components/LogisticsStandard.vue'
    import OverseaStandard from './components/OverseaStandard.vue'
    import BusinessPlan from './components/BusinessPlan.vue'
    import PendingPublish from './components/PendingPublish.vue'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'buyer_experience_report';

    export default {
        name: component_name,
        components: {
            ComplexPerformance,
            FreightPerformance,
            LogisticsStandard,
            OverseaStandard,
            BusinessPlan,
            PendingPublish
        },
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    account_id: [],
                    user_name: [],
                    integrte_evaluation: 'all',
                    bad_trans_evaluation: 'all',
                    dispute_evaluation: 'all',
                    freight_evaluation: 'all',
                    unfreight_evaluation: 'all',
                    logistics_standard_m5: 'all',
                    logistics_standard_l5: 'all',
                    logistics_standard_sp: 'all',
                    warehouse_standard: 'all',
                    business_plan_track: 'all',
                    predeal_public: 'all',
                    pullTime: [],
                },

                optionList: {
                    account_list: [],
                    user_name_list: [],
                    integrte_eval_list: [],
                    freight_eval_list: [],
                    logistics_std_list: [],
                    business_plant_list: [],
                    predeal_public_list: [],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth:[],
                tableClickProps: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                //综合表现
                isComplexShow: false,
                //货运表现
                isFreightShow: false,
                freightTypes: '',
                //物流标准
                isLogisticsShow: false,
                //海外仓标准
                isOverseaShow: false,
                //商业计划
                isBusinessShow: false,
                //待处理刊登
                isPendingShow: false,
                //弹框数据
                dialogDetailsData: {},
                dialogTableData: [],
                dialogTableKey: [],
                dialogTableProps: [],
                dialogTableData1: [],
                dialogTableData2: [],

                saveDefaultDate: [],

                //产品线弹框
                popover: {
                    productLine: false,
                },
                defaultProps: {
                    children: 'child',
                    label: 'name'
                },
                defaultQueryKeys: [],
                //tree搜索关键字
                productLineFilter: '',

                row: '',
                type: ''
            }

        },
        computed: {
            ...mapGetters([
                'buttonList',
                'loginInfo',
                'queryParamsInfo',
            ]),
//            buttonList() {
//                return config.AUTHORITY_BUTTON[component_name].buttonList;
//            }
        },
        methods: {
            ...mapActions([
                'Fn'
            ]),
            autoAddTableInx,
            getBuyerExperienceReportInfo,
            getDialogDetailsInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['buyer_experience_report']);
                }

                let obj = {
                    ...this.queryData,
                    ...params,
                    account_id: this.queryData.account_id.join(','),
                    user_name: this.queryData.user_name.join(','),
                    start_date: this.queryData.pullTime && this.queryData.pullTime[0],
                    end_date: this.queryData.pullTime && this.queryData.pullTime[1],
                };

                obj = Object.assign(params || {}, obj);

                this.getBuyerExperienceReportInfo(obj).then(({ data }) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败')
                    }
                })
            },

            // 查询重置
            handleResetQueryInfo() {
                this.queryData = {
                    account_id: [],
                    user_name: [],
                    integrte_evaluation: 'all',
                    bad_trans_evaluation: 'all',
                    dispute_evaluation: 'all',
                    freight_evaluation: 'all',
                    unfreight_evaluation: 'all',
                    logistics_standard_m5: 'all',
                    logistics_standard_l5: 'all',
                    logistics_standard_sp: 'all',
                    warehouse_standard: 'all',
                    business_plan_track: 'all',
                    predeal_public: 'all',
                    pullTime: [],
                };
            },

            //点击弹框
            handleClickDialog(row) {
                if(row.value === '无') return;
                switch (row.type) {
                    case 'integrte':
                        this.isComplexShow = true;
                        break;
                    case 'freight':
                        this.isFreightShow = true;
                        this.freightTypes = '1';
                        break;
                    case 'unfreight':
                        this.isFreightShow = true;
                        this.freightTypes = '2';
                        break;
                    case 'logistics':
                        this.isLogisticsShow = true;
                        break;
                    case 'warehouse':
                        this.isOverseaShow = true;
                        break;
                    case 'business':
                        this.isBusinessShow = true;
                        break;
                    case 'predeal':
                        this.isPendingShow = true;
                        break;
                }

                let obj = {
                    account_id: row.account_id,
                    statis_date: row.statis_date,
                    type: row.type
                };
                this.getDialogDetailsInfo(obj).then(({ data }) => {
                    if(data.status) {
                        this.dialogDetailsData = data.data_dict;
                        this.dialogTableKey = data.data_dict.title;
                        this.dialogTableData = data.data_dict.data_table;
                        this.dialogTableData1 = data.data_dict.data_table1;
                        this.dialogTableData2 = data.data_dict.data_table2;
                        this.dialogTableProps = ['current_eval', 'standard', 'current', 'status'];
                    }else {
                        this.$message.error(data.error_Mess || '操作失败');
                    }
                })
            },

            //带入tree数据
            handleInTreeData() {
                this.$nextTick(() => {
                    const checkIds = this.queryData.productLineId;
                    this.$refs.treeEditor.setCheckedKeys(checkIds);
                });
            },

            //树形保存
            handleTreeCheckInfo() {
                const [labels, ids] = [[], []];
                this.$refs.treeEditor.getCheckedNodes().forEach(item => {
                    if(!item.leaf) return;
                    labels.push(item.name);
                    ids.push(item.id);
                });
                this.queryData.productLineName = labels.join(',');
                this.queryData.productLineId = ids;
                this.defaultQueryKeys = ids;
                this.popover.productLine = false;
            },

            //小组关键字搜索
            productLineFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            // 关闭树形下拉
            handleCloseTreeOption(event) {
                try {
                    if (event.path.some(_e => _e.className && _e.className.indexOf && _e.className.indexOf('ui-popover__input') > -1)) return;
                } catch (e) {
                    console.log(e);
                }
                this.popover.productLine = false;
                this.productLineFilter = '';
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

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
//                    total: this.pageData.currentTotal
                }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'buyer_experience_report',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...data.title];
                this.tableProps = ['index', 'account_name', 'short_name', 'user_name','integrte_evaluation', 'bad_trans_evaluation', 'dispute_evaluation', 'freight_evaluation', 'unfreight_evaluation', 'logistics_standard_m5', 'logistics_standard_l5', 'logistics_standard_sp', 'warehouse_standard', 'business_plan_track', 'predeal_public', 'data_time'];
                this.tableClickProps = ['integrte_evaluation', 'bad_trans_evaluation', 'dispute_evaluation', 'freight_evaluation', 'unfreight_evaluation', 'logistics_standard_m5', 'logistics_standard_l5', 'logistics_standard_sp', 'warehouse_standard', 'business_plan_track', 'predeal_public'];
                this.tableData = data.data;
                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'index') return '60';
                    if(item === 'account_name') return '140';
                    if(item === 'bad_trans_evaluation'|| item === 'data_time'|| item === 'user_name') return '120';
                    return '100';
                });

                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                getOptionList({ module: 'buyer_experience'}).then(({ data }) => {
                    if(data.status) {
                        this.optionList.account_list = data.categor_dict.account_list;
                        this.optionList.user_name_list = data.categor_dict.user_name_list;
                        this.optionList.integrte_eval_list = data.categor_dict.integrte_eval_list;
                        this.optionList.freight_eval_list = data.categor_dict.freight_eval_list;
                        this.optionList.logistics_std_list = data.categor_dict.logistics_std_list;
                        this.optionList.warehouse_std_list = data.categor_dict.warehouse_std_list;
                        this.optionList.business_plant_list = data.categor_dict.business_plant_list;
                        this.optionList.predeal_public_list = data.categor_dict.predeal_public_list;
                    }else {
                        console.log(data.errorMess || '下拉数据请求失败')
                    }
                });
                this.handleQueryInfo();
            }catch (e) {
                console.log(e);
            }
        },
        mounted() {
            document.addEventListener('click', this.handleCloseTreeOption);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.handleCloseTreeOption);
        },
        watch: {
            "productLineFilter"(val) {
                this.$refs.treeEditor.filter(val);
            },
        }
    }
</script>

<style scoped lang="less">

    .ui-input__tree {
        .ui-base--area {
            max-height: 400px;
            overflow: auto;
        }

        .ui-tree__btn {
            padding-left: 20px;
            border-top: 1px solid #e6e6e6;
        }
    }

</style>
