<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="账号名称">
                            <el-select size="small" v-model="queryData.accountName" filterable v-filter multiple collapseTags>
                                <el-option v-for="item in optionList.accountNameList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="账号简称">
                            <el-select size="small" v-model="queryData.sortName" filterable v-filter multiple collapseTags>
                                <el-option v-for="item in optionList.sortNameList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="客服人员">
                            <el-select size="small" v-model="queryData.userName" filterable v-filter multiple collapseTags>
                                <el-option v-for="item in optionList.userNameList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="好评率" template="inputInterval" v-model="queryData.praise"></SearchRequirement>
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
                        <SearchRequirement label="当前账户等级">
                            <el-select size="small" v-model="queryData.cur_standards_level" filterable v-filter clearable>
                                <el-option v-for="item in optionList.account_grade_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="预测账户等级">
                            <el-select size="small" v-model="queryData.pre_standards_level" filterable v-filter clearable>
                                <el-option v-for="item in optionList.account_grade_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="INR指数">
                            <el-select size="small" v-model="queryData.store_metric_inr" filterable v-filter clearable>
                                <el-option v-for="item in optionList.store_metric_list_inr_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="SNAD指数">
                            <el-select size="small" v-model="queryData.store_metric_snad" filterable v-filter clearable>
                                <el-option v-for="item in optionList.store_metric_snad_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="不良交易率" template="inputInterval" v-model="queryData.defective_trans_rate"></SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="未解决纠纷率" template="inputInterval" v-model="queryData.claims_saf_rate"></SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="运送延迟率" template="inputInterval" v-model="queryData.shipping_miss_rate"></SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="上传跟踪号率" template="inputInterval" v-model="queryData.ontime_upload_rate"></SearchRequirement>
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
                :showSearch="showSearch"
                :tableSort="tableSort"
                :tableFixed="tableFixed"
                :defaultSort="queryData.sortOrder"
                @handleSort="handleSortChange">
            <template slot="program" slot-scope="scope">
                <ul>
                    <li>全球</li>
                    <li>美国</li>
                    <li>英国</li>
                    <li>德国</li>
                </ul>
            </template>
            <template slot="cur_standards_level" slot-scope="scope">
                <ul>
                    <li>{{scope.row.go_cur_level}}</li>
                    <li>{{scope.row.us_cur_level}}</li>
                    <li>{{scope.row.uk_cur_level}}</li>
                    <li>{{scope.row.de_cur_level}}</li>
                </ul>
            </template>
            <template slot="pre_standards_level" slot-scope="scope">
                <ul>
                    <li>{{scope.row.go_pre_level}}</li>
                    <li>{{scope.row.us_pre_level}}</li>
                    <li>{{scope.row.uk_pre_level}}</li>
                    <li>{{scope.row.de_pre_level}}</li>
                </ul>
            </template>
            <template slot="snad_metric" slot-scope="scope">
                <i class="ui-state_dot state_green" v-if="scope.row.snad_metric === '正常'"></i>
                <i class="ui-state_dot state_orange" v-if="scope.row.snad_metric === '过高'|| scope.row.snad_metric === '過高'"></i>
                <i class="ui-state_dot state_red" v-if="scope.row.snad_metric === '非常高'"></i>
                <span>{{scope.row.snad_metric}}</span>
            </template>
            <template slot="inr_metric" slot-scope="scope">
                <i class="ui-state_dot state_green" v-if="scope.row.inr_metric === '正常'"></i>
                <i class="ui-state_dot state_orange" v-if="scope.row.inr_metric === '过高'|| scope.row.inr_metric === '過高'"></i>
                <i class="ui-state_dot state_red" v-if="scope.row.inr_metric === '非常高'"></i>
                <span>{{scope.row.inr_metric}}</span>
            </template>
            <template slot="defective_trans_rate" slot-scope="scope">
                <ul>
                    <li @click="handleClickRate(scope.row.go_defective_trans,scope.row.account_id)"
                        :class="scope.row.go_defective_trans.value === '无'|| scope.row.go_defective_trans.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.go_defective_trans.value}}</li>
                    <li @click="handleClickRate(scope.row.us_defective_trans,scope.row.account_id)"
                        :class="scope.row.us_defective_trans.value === '无'|| scope.row.us_defective_trans.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.us_defective_trans.value}}</li>
                    <li @click="handleClickRate(scope.row.uk_defective_trans,scope.row.account_id)"
                        :class="scope.row.uk_defective_trans.value === '无'|| scope.row.uk_defective_trans.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.uk_defective_trans.value}}</li>
                    <li @click="handleClickRate(scope.row.de_defective_trans,scope.row.account_id)"
                        :class="scope.row.de_defective_trans.value === '无'|| scope.row.de_defective_trans.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.de_defective_trans.value}}</li>
                </ul>
            </template>
            <template slot="claims_saf_rate" slot-scope="scope">
                <ul>
                    <li @click="handleClickRate(scope.row.go_claims_saf,scope.row.account_id)"
                        :class="scope.row.go_claims_saf.value === '无'|| scope.row.go_claims_saf.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.go_claims_saf.value}}</li>
                    <li @click="handleClickRate(scope.row.us_claims_saf,scope.row.account_id)"
                        :class="scope.row.us_claims_saf.value === '无'|| scope.row.us_claims_saf.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.us_claims_saf.value}}</li>
                    <li @click="handleClickRate(scope.row.uk_claims_saf,scope.row.account_id)"
                        :class="scope.row.uk_claims_saf.value === '无'|| scope.row.uk_claims_saf.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.uk_claims_saf.value}}</li>
                    <li @click="handleClickRate(scope.row.de_claims_saf,scope.row.account_id)"
                        :class="scope.row.de_claims_saf.value === '无'|| scope.row.de_claims_saf.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.de_claims_saf.value}}</li>
                </ul>
            </template>
            <template slot="shipping_miss_rate" slot-scope="scope">
                <ul>
                    <li @click="handleClickRate(scope.row.go_shipping_miss,scope.row.account_id)"
                        :class="scope.row.go_shipping_miss.value === '无'|| scope.row.go_shipping_miss.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.go_shipping_miss.value}}</li>
                    <li @click="handleClickRate(scope.row.us_shipping_miss,scope.row.account_id)"
                        :class="scope.row.us_shipping_miss.value === '无'|| scope.row.us_shipping_miss.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.us_shipping_miss.value}}</li>
                    <li @click="handleClickRate(scope.row.uk_shipping_miss,scope.row.account_id)"
                        :class="scope.row.uk_shipping_miss.value === '无'|| scope.row.uk_shipping_miss.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.uk_shipping_miss.value}}</li>
                    <li @click="handleClickRate(scope.row.de_shipping_miss,scope.row.account_id)"
                        :class="scope.row.de_shipping_miss.value === '无'|| scope.row.de_shipping_miss.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.de_shipping_miss.value}}</li>
                </ul>
            </template>
            <template slot="ontime_upload_rate" slot-scope="scope">
                <ul>
                    <li @click="handleClickRate(scope.row.go_ontime_upload,scope.row.account_id)"
                        :class="scope.row.go_ontime_upload.value === '无'|| scope.row.go_ontime_upload.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.go_ontime_upload.value}}</li>
                    <li @click="handleClickRate(scope.row.de_ontime_upload,scope.row.account_id)"
                        :class="scope.row.de_ontime_upload.value === '无'|| scope.row.de_ontime_upload.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.de_ontime_upload.value}}</li>
                    <li @click="handleClickRate(scope.row.uk_ontime_upload,scope.row.account_id)"
                        :class="scope.row.uk_ontime_upload.value === '无'|| scope.row.uk_ontime_upload.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.uk_ontime_upload.value}}</li>
                    <li @click="handleClickRate(scope.row.us_ontime_upload,scope.row.account_id)"
                        :class="scope.row.us_ontime_upload.value === '无'|| scope.row.us_ontime_upload.value === '0.00%' ? '' : 'ui-link'">
                        {{scope.row.us_ontime_upload.value}}</li>
                </ul>
            </template>
            <template v-for="(item, index) in tableClickProps" :slot="item" slot-scope="scope">
                <el-button size="small" type="text" @click="handleClickExpression(scope.row[item], scope.row.account_id)">
                    <span class="orange" v-if="scope.row[item].value === '警告'">{{scope.row[item].value}}</span>
                    <span class="blue" v-if="scope.row[item].value === '不考核'|| scope.row[item].value === '有待处理刊登'">
                        {{scope.row[item].value}}</span>
                    <span class="green" v-if="scope.row[item].value === '正常'">{{scope.row[item].value}}</span>
                    <span class="red" v-if="scope.row[item].value === '超标'">{{scope.row[item].value}}</span>
                    <span class="purple" v-if="scope.row[item].value === '限制'">{{scope.row[item].value}}</span>
                </el-button>
                <span v-if="scope.row[item].value === '无'||scope.row[item].value === '无待处理刊登'">{{scope.row[item].value}}</span>
            </template>
            <template slot="operation" slot-scope="scope">
                <el-button size="small" type="text" @click="handlePreviewInfo(scope.row)">查看</el-button>
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

        <SellerScoreRate :title="dialogTitle"
                         :visible.sync="isRateShow"
                         :detailsData="dialogDetailsData"
                         :dialogData="dialogTableData"
                         :dialogKey="dialogTableKey"
                         :dialogProps="dialogTableProps"
                         :dateType="dialogDateType">
            <template slot="date_range" slot-scope="scope">
                <span>{{scope.row.start_time}} - {{scope.row.end_time}}</span>
            </template>
        </SellerScoreRate>

        <el-dialog
                top="10vh"
                title="查看"
                width="1000px"
                class="ui-layout_edit-dialog"
                :visible.sync="isPreviewShow"
                @close="isPreviewShow = false">
            <div class="ui-top_text">
                <span>平台账号：</span><span>{{basicTitleData.account_name}}</span>
                <span>销售人员：</span><span>{{basicTitleData.seller}}</span>
                <span>客服人员：</span><span>{{basicTitleData.server}}</span>
            </div>
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="1">
                    <ComPreviewTable :tableData="basicData" :tableProps="basicProps" :tableKey="basicKey" :tableWidth="basicWidth"></ComPreviewTable>
                </el-tab-pane>
                <el-tab-pane label="备注" name="2">
                    <el-button size="mini" type="primary" style="margin-bottom: 8px" @click="handleAddRemarks">添加备注</el-button>
                    <ComPreviewTable
                            isPage
                            @dialogPageChange="handleDialogPageChange"
                            :dialogPageData="dialogPageData"
                            :tableData="remarkData"
                            :tableProps="remarkProps"
                            :tableKey="remarkKey"
                            :tableWidth="remarkWidth"></ComPreviewTable>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

        <ComAddRemarks :visible.sync="isRemarkShow" @confirm="handleSaveRemarkInfo"></ComAddRemarks>

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
        getEbayAccountFormInfo,
        getOptionList,
        getRemarksListInfo,
        getAddRemarksInfo,
        getBaseListInfo,
        getExpressionDetailsInfo,
        getRateDetailsInfo
    } from '@/api/customer_service_module/ebay_account_form';

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
    import SellerScoreRate from './components/SellerScoreRate.vue'


    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'ebay_account_form';

    export default {
        name: component_name,
        components: {
            ComplexPerformance,
            FreightPerformance,
            LogisticsStandard,
            OverseaStandard,
            BusinessPlan,
            PendingPublish,
            SellerScoreRate
        },
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    accountName: [],
                    sortName: [],
                    userName: [],
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
                    cur_standards_level: '',
                    pre_standards_level: '',
                    store_metric_inr: '',
                    store_metric_snad: '',
                    praise: [],
                    defective_trans_rate: [],
                    claims_saf_rate: [],
                    shipping_miss_rate: [],
                    ontime_upload_rate: [],
                    order_sc: '',
                    sortOrder: {
                        prop: '',
                        order: 'descending'
                    },
                },

                optionList: {
                    accountNameList: [],
                    sortNameList: [],
                    userNameList: [],
                    integrte_eval_list: [],
                    freight_eval_list: [],
                    logistics_std_list: [],
                    business_plant_list: [],
                    predeal_public_list: [],
                    account_grade_list: [],
                    store_metric_inr_list: [],
                    store_metric_snad_list: []
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth:[],
                tableClickProps: [],
                tableSort: [],
                tableFixed: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

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

                //查看详情
                isPreviewShow: false,
                activeName: '1',
                saveRowData: {},
                remarkData: [],
                remarkProps: [],
                remarkKey: [],
                remarkWidth: [],
                basicData: [],
                basicProps: [],
                basicKey: [],
                basicWidth: [],
                basicTitleData: {},
                dialogPageData: {
                    limit: 20,
                    offset: 1,
                    total: 0
                },
                //添加备注
                isRemarkShow: false,


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

                //率弹框
                isRateShow: false,
                dialogTitle: '',
                dialogDateType: '',
            }

        },
        computed: {
            ...mapGetters([
                'buttonList',
                'loginInfo',
                'queryParamsInfo',
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
            getEbayAccountFormInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['ebay_account_form']);
                }

                let reg = /^\d+(\.\d+)?$/;
                if(this.queryData.praise[0]) {
                    if(!reg.test(this.queryData.praise[0])) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.praise[1]) {
                    if(!reg.test(this.queryData.praise[1])) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.defective_trans_rate[0]) {
                    if(!reg.test(this.queryData.defective_trans_rate[0])) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.defective_trans_rate[1]) {
                    if(!reg.test(this.queryData.defective_trans_rate[1])) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.claims_saf_rate[0]) {
                    if(!reg.test(this.queryData.claims_saf_rate[0])) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.claims_saf_rate[1]) {
                    if(!reg.test(this.queryData.claims_saf_rate[1])) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.shipping_miss_rate[0]) {
                    if(!reg.test(this.queryData.shipping_miss_rate[0])) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.shipping_miss_rate[1]) {
                    if(!reg.test(this.queryData.shipping_miss_rate[1])) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.ontime_upload_rate[0]) {
                    if(!reg.test(this.queryData.ontime_upload_rate[0])) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.ontime_upload_rate[1]) {
                    if(!reg.test(this.queryData.ontime_upload_rate[1])) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }

                let obj = {
                    account_id1: this.queryData.accountName.join(','),
                    account_id2: this.queryData.sortName.join(','),
                    user_name: this.queryData.userName.join(','),
                    order_sc: this.queryData.order_sc,
                    integrte_evaluation: this.queryData.integrte_evaluation,
                    bad_trans_evaluation: this.queryData.bad_trans_evaluation,
                    dispute_evaluation: this.queryData.dispute_evaluation,
                    freight_evaluation: this.queryData.freight_evaluation,
                    unfreight_evaluation: this.queryData.unfreight_evaluation,
                    logistics_standard_m5: this.queryData.logistics_standard_m5,
                    logistics_standard_l5: this.queryData.logistics_standard_l5,
                    logistics_standard_sp: this.queryData.logistics_standard_sp,
                    warehouse_standard: this.queryData.warehouse_standard,
                    business_plan_track: this.queryData.business_plan_track,
                    predeal_public: this.queryData.predeal_public,
                    cur_standards_level: this.queryData.cur_standards_level,
                    pre_standards_level: this.queryData.pre_standards_level,
                    store_metric_inr: this.queryData.store_metric_inr,
                    store_metric_snad: this.queryData.store_metric_snad,
                    praise_l: this.queryData.praise[0],
                    praise_m: this.queryData.praise[1],
                    s_defective_trans_rate: this.queryData.defective_trans_rate[0],
                    e_defective_trans_rate: this.queryData.defective_trans_rate[1],
                    s_claims_saf_rate: this.queryData.claims_saf_rate[0],
                    e_claims_saf_rate: this.queryData.claims_saf_rate[1],
                    s_shipping_miss_rate: this.queryData.shipping_miss_rate[0],
                    e_shipping_miss_rate: this.queryData.shipping_miss_rate[1],
                    s_ontime_upload_rate: this.queryData.ontime_upload_rate[0],
                    e_ontime_upload_rate: this.queryData.ontime_upload_rate[1],
                };

                obj = Object.assign(params || {}, obj);

                this.getEbayAccountFormInfo(obj).then(({ data }) => {
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
                this.queryData.accountName = [];
                this.queryData.sortName = [];
                this.queryData.userName = [];
                this.queryData.integrte_evaluation = 'all';
                this.queryData.bad_trans_evaluation = 'all';
                this.queryData.dispute_evaluation = 'all';
                this.queryData.freight_evaluation = 'all';
                this.queryData.unfreight_evaluation = 'all';
                this.queryData.logistics_standard_m5 = 'all';
                this.queryData.logistics_standard_l5 = 'all';
                this.queryData.logistics_standard_sp = 'all';
                this.queryData.warehouse_standard = 'all';
                this.queryData.business_plan_track = 'all';
                this.queryData.predeal_public = 'all';
                this.queryData.cur_standards_level = '';
                this.queryData.pre_standards_level = '';
                this.queryData.store_metric_inr = '';
                this.queryData.store_metric_snad = '';
                this.queryData.order_sc = '';
                this.queryData.praise = [];
                this.queryData.defective_trans_rate = [];
                this.queryData.claims_saf_rate = [];
                this.queryData.shipping_miss_rate = [];
                this.queryData.ontime_upload_rate = [];
            },

            //点击弹框—表现
            handleClickExpression(row, account_id) {
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
                    account_id: account_id,
                    statis_date: row.statis_date,
                    type: row.type
                };
                getExpressionDetailsInfo(obj).then(({ data }) => {
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

            //点击弹框-率
            handleClickRate(row, account_id) {
                if(row.value === '0.00%' || row.value === '无') return;
                let obj = {
                    account_id: account_id,
                    program: row.program,
                    statis_date: row.statis_date,
                    type: row.type
                };
                switch (row.type) {
                    case 'defective_trans':
                        this.dialogTitle = '不良交易率';
                        break;
                    case 'claims_saf':
                        this.dialogTitle = '未解决纠纷率';
                        break;
                    case 'shipping_miss':
                        this.dialogTitle = '运送延迟率';
                        break;
                    case 'ontime_upload':
                        this.dialogTitle = '上传跟踪号率';
                        break;
                }
                getRateDetailsInfo(obj).then(({ data }) => {
                    if(data.status) {
                        this.dialogDetailsData = data.data_dict;
                        this.dialogTableKey = data.data_dict.title;
                        this.dialogTableData = data.data_dict.data_table;
                        this.dialogTableProps = ['date_range', 'evaluation_date', 'total_count', 'count', 'rate', 'standard_rate'];
                        this.dialogDateType = data.data_dict.past_time === '过去三个月' ? '3' : '1';
                        this.isRateShow = true;
                    }else {
                        this.$message.error(data.error_Mess || '操作失败');
                    }
                })
            },

            //查看
            handlePreviewInfo(row) {
                this.isPreviewShow = true;
                this.activeName = '1';
                this.saveRowData = row;
                //基本信息
                getBaseListInfo({ account_id: row.account_id }).then(({ data }) => {
                    if (data.status) {
                        this.basicTitleData = data.data;
                        this.basicKey = ['考核项', '本次', '上次', '分析'];
                        this.basicProps = ['name', 'current_value', 'before_value', 'analyse'];
                        this.basicWidth = ['200', '150', '150', 'analyse'];
                        this.basicData = data.data.data_table;
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                });
                //备注内容
                this.handleQueryRemarksInfo();
            },

            // 查看备注内容
            handleQueryRemarksInfo(params = {}) {
                getRemarksListInfo({
                    account_id: this.saveRowData.account_id,
                    ...params
                }).then(({ data }) => {
                    if(data.status) {
                        this.handleTableInfo(data);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            handleTableInfo(data) {
                this.remarkKey = data.title;
                this.remarkProps = ['remark', 'users', 'statis_date'];
                this.remarkWidth = ['','120','150'];
                this.remarkData = data.data;
                this.dialogPageData.offset = data.page_data.offset * 1;
                this.dialogPageData.limit = data.page_data.limit * 1;
                this.dialogPageData.total = data.page_data.total * 1;
            },

            //点击添加备注
            handleAddRemarks() {
                this.isRemarkShow = true;
            },

            //确定 添加备注
            handleSaveRemarkInfo({ remarks }) {
                let obj = {
                    account_id: this.saveRowData.account_id,
                    current_user: this.loginInfo.user_name,
                    remark: remarks,
                };
                getAddRemarksInfo(obj).then(({ data }) => {
                    if (data.status) {
                        this.handleQueryRemarksInfo();
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                })
            },

            //弹框表格分页
            handleDialogPageChange({offset,limit}) {
                this.handleQueryRemarksInfo({offset, limit})
            },

            // 排序
            handleSortChange(data) {
                this.queryData.sortOrder = {
                    prop: data.prop,
                    order: data.order
                };
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'ebay_account_form',
                    value: JSON.stringify(this.queryData)
                });
                if (data.prop === "praise") {
                    this.queryData.order_sc = data.order === 'ascending' ? 0 : 1;
                }
                this.handleQueryInfo({limit: this.pageData.currentList});
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

            //导出基本信息
            handleExportBaseInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                    type: 'base',
                    user_id: this.loginInfo.staff_code
                }, true)
            },

            //导出SpeedPAK物流管理方案数据
            handleExportSpeedPakInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                    type: 'spk_logistics',
                    user_id: this.loginInfo.staff_code
                }, true)
            },

            //导出买家选择SpeedPAK物流选项数据
            handleExportSelectSpeedPakInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                    type: 'seller_select_spk',
                    user_id: this.loginInfo.staff_code
                }, true)
            },

            //导出海外仓服务标准表现
            handleExportOverseaInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                    type: 'warehouse',
                    user_id: this.loginInfo.staff_code
                }, true)
            },

            //导出非货运表现问题刊登
            handleExportUnFreightInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                    type: 'unfreight',
                    user_id: this.loginInfo.staff_code
                }, true)
            },

            //导出货运表现问题刊登
            handleExportFreightInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                    type: 'freight',
                    user_id: this.loginInfo.staff_code
                }, true)
            },

            //导出待处理刊登
            handleExportDealWithInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                    type: 'predeal',
                    user_id: this.loginInfo.staff_code
                }, true)
            },


            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'ebay_account_form',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...data.title];
                this.tableProps = ['index', 'statis_date', 'account_name', 'account_short_name','user_name', 'praise', 'program_status_lst_eval','status_lst_eval', 'snad_status_lst_eval','shipping_status', 'non_shipping_status', 'e_packet_status', 'eds_status', 'edshipping_status', 'ware_house_status', 'pgc_tracking_status', 'qc_listing_status', 'inr_metric', 'snad_metric', 'program', 'cur_standards_level', 'pre_standards_level', 'defective_trans_rate', 'claims_saf_rate', 'shipping_miss_rate','ontime_upload_rate','operation'];
                this.tableClickProps = ['program_status_lst_eval','status_lst_eval', 'snad_status_lst_eval','shipping_status', 'non_shipping_status', 'e_packet_status', 'eds_status', 'edshipping_status', 'ware_house_status', 'pgc_tracking_status', 'qc_listing_status'];
                this.tableData = data.data;
                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'index') return '60';
                    if(item === 'account_short_name'|| item === 'program_status_lst_eval'|| item === 'snad_status_lst_eval'|| item === 'shipping_status') return '70';
                    if(item === 'pgc_tracking_status'|| item === 'cur_standards_level'|| item === 'pre_standards_level'|| item === 'claims_saf_rate'|| item === 'ontime_upload_rate'|| item === 'statis_date') return '100';
                    if(item === 'status_lst_eval'|| item === 'user_name') return '110';
                    if(item === 'account_name') return '130';
                    return '80';
                });
                this.tableFixed = this.tableProps.map(item => {
                    if(item === 'index'|| item === 'statis_date'|| item === 'account_name'|| item === 'account_short_name'|| item === 'user_name') return 'left';
                    if(item === 'operation') return 'right';
                    return false;
                });
                this.tableSort = this.tableProps.map(item => {
                    if(item === 'praise') return 'custom';
                    return false;
                });

                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                getOptionList({ module: 'behavior'}).then(({ data }) => {
                    if(data.status) {
                        this.optionList.accountNameList = data.categor_dict.account_list;
                        this.optionList.sortNameList = data.categor_dict.account_short_list;
                        this.optionList.userNameList = data.categor_dict.user_name_list;
                        this.optionList.integrte_eval_list = data.categor_dict.integrte_eval_list;
                        this.optionList.freight_eval_list = data.categor_dict.freight_eval_list;
                        this.optionList.logistics_std_list = data.categor_dict.logistics_std_list;
                        this.optionList.warehouse_std_list = data.categor_dict.warehouse_std_list;
                        this.optionList.business_plant_list = data.categor_dict.business_plant_list;
                        this.optionList.predeal_public_list = data.categor_dict.predeal_public_list;
                        this.optionList.account_grade_list = data.categor_dict.account_grade;
                        this.optionList.store_metric_inr_list = data.categor_dict.store_metric_list_inr;
                        this.optionList.store_metric_snad_list = data.categor_dict.store_metric_list_snad;
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

    @base-link-color: #3388ff;

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

    .ui-main-module .ui-fn-module {
        padding-top: 5px;
    }

    .ui-top_text {
        font-size: 12px;
        margin-bottom: 10px;
        span:nth-child(2n) {
            margin-right: 20px;
        }
    }

    .ui-main-module-table ul li {
        text-align: left;
    }
</style>
