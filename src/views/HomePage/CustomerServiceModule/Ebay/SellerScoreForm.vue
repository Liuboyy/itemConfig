<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <!--<li>-->
                    <!--<SearchRequirement label="产品线" >-->
                    <!--<el-popover-->
                    <!--ref="popover"-->
                    <!--width="300"-->
                    <!--placement="bottom-start"-->
                    <!--trigger="manual"-->
                    <!--v-model="popover.productLine"-->
                    <!--:visible-arrow="false"-->
                    <!--@show="handleInTreeData">-->
                    <!--<div class="ui-input__tree">-->
                    <!--<div class="ui-base&#45;&#45;area">-->
                    <!--<el-input size="small" placeholder="输入关键字进行搜索" v-model="productLineFilter"></el-input>-->
                    <!--<el-tree-->
                    <!--ref="treeEditor"-->
                    <!--node-key="id"-->
                    <!--show-checkbox-->
                    <!--:data="optionList.productLineList"-->
                    <!--:props="defaultProps"-->
                    <!--:default-expanded-keys="defaultQueryKeys"-->
                    <!--:filter-node-method="productLineFilterNode">-->
                    <!--</el-tree>-->
                    <!--</div>-->
                    <!--<div class="ui-tree__btn">-->
                    <!--<el-button type="text" @click="popover.productLine = false">关闭</el-button>-->
                    <!--<el-button type="text" @click="handleTreeCheckInfo()">确定</el-button>-->
                    <!--</div>-->
                    <!--</div>-->
                    <!--</el-popover>-->
                    <!--<el-input class="ui-popover__input" readonly size="small" v-popover:popover v-model="queryData.productLineName"-->
                    <!--@focus="popover.productLine = true"></el-input>-->
                    <!--</SearchRequirement>-->
                    <!--</li>-->
                    <li>
                        <SearchRequirement label="平台账号" clearable>
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
                        <SearchRequirement label="站点">
                            <el-select size="small" v-model="queryData.program" filterable v-filter clearable>
                                <el-option v-for="item in optionList.site_list"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="当前账户等级">
                            <el-select size="small" v-model="queryData.cur_standards_level" filterable v-filter clearable>
                                <el-option v-for="item in optionList.account_grade"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="预测账户等级">
                            <el-select size="small" v-model="queryData.pre_standards_level" filterable v-filter clearable>
                                <el-option v-for="item in optionList.account_grade"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="拉取时间" v-model="queryData.pullTime" template="daterange" clearable></SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="不良交易率%">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.s_defective_trans_rate"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.e_defective_trans_rate"></el-input>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="未解决纠纷率%">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.s_claims_saf_rate"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.e_claims_saf_rate"></el-input>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="运送延迟率%">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.s_shipping_miss_rate"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.e_shipping_miss_rate"></el-input>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="上传跟踪号率%">
                            <el-row>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.s_ontime_upload_rate"></el-input>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-input size="small" placeholder="请输入" v-model="queryData.e_ontime_upload_rate"></el-input>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
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
                :defaultSort="queryData.sortOrder"
                @handleSort="handleSortChange">
            <template v-for="(item, index) in tableClickProps" :slot="item" slot-scope="scope">
                <el-button type="text" size="small" @click="handleClickDialog({
                    type: scope.row[item].type,
                    account_id: scope.row.account_id,
                    program: scope.row.program_id,
                    statis_date: scope.row.statis_date,})" v-if="scope.row[item].value !== '0.00%'">
                    {{scope.row[item].value}}
                </el-button>
                <span v-if="scope.row[item].value === '0.00%'">{{scope.row[item].value}}</span>
            </template>

            <template slot="cur_standards_level" slot-scope="scope">
                <i class="ui-state_dot state_green" v-if="scope.row.cur_standards_level === '最高评级'"></i>
                <i class="ui-state_dot state_red" v-if="scope.row.cur_standards_level === '低于标准'"></i>
                <i class="ui-state_dot state_black" v-if="scope.row.cur_standards_level === '高于标准'"></i>
                <i class="ui-state_dot state_gray" v-if="scope.row.cur_standards_level === '无'"></i>
                <span>{{scope.row.cur_standards_level}}</span>
            </template>

            <template slot="pre_standards_level" slot-scope="scope">
                <i class="ui-state_dot state_green" v-if="scope.row.pre_standards_level === '最高评级'"></i>
                <i class="ui-state_dot state_red" v-if="scope.row.pre_standards_level === '低于标准'"></i>
                <i class="ui-state_dot state_black" v-if="scope.row.pre_standards_level === '高于标准'"></i>
                <i class="ui-state_dot state_gray" v-if="scope.row.pre_standards_level === '无'"></i>
                <span>{{scope.row.pre_standards_level}}</span>
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
        getSellerScoreFormInfo,
        getOptionList,
        getDialogDetailsInfo
    } from '@/api/customer_service_module/seller_score_form';

    import {
        getPreDateRange,
        getCurrentDateRange
    } from '@/api/common/date_format'

    import SellerScoreRate from './components/SellerScoreRate.vue'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'seller_score_form';

    export default {
        name: component_name,
        components: {
            SellerScoreRate
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
                    program: '',
                    cur_standards_level: '',
                    pre_standards_level: '',
                    s_defective_trans_rate: '',
                    e_defective_trans_rate: '',
                    s_claims_saf_rate: '',
                    e_claims_saf_rate: '',
                    s_shipping_miss_rate: '',
                    e_shipping_miss_rate: '',
                    s_ontime_upload_rate: '',
                    e_ontime_upload_rate: '',
                    pullTime: [],
                    order_by: '',
                    order_sc: '',
                    sortOrder: {
                        prop: '',
                        order: 'descending'
                    },
                },

                optionList: {
                    account_list: [],
                    user_name_list: [],
                    account_grade: [],
                    site_list: [],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth:[],
                tableClickProps: [],
                tableSort: [false,false, false, false, false, false, 'custom', 'custom', 'custom', 'custom', false],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                //率弹框
                isRateShow: false,
                dialogTitle: '',

                //弹框数据
                dialogDetailsData: {},
                dialogTableData: [],
                dialogTableKey: [],
                dialogTableProps: [],
                dialogDateType: '',

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
            getSellerScoreFormInfo,
            getDialogDetailsInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['seller_score_form']);
                }

                let reg = /^\d+(\.\d+)?$/;
                if(this.queryData.s_defective_trans_rate) {
                    if(!reg.test(this.queryData.s_defective_trans_rate)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.e_defective_trans_rate) {
                    if(!reg.test(this.queryData.e_defective_trans_rate)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.s_claims_saf_rate) {
                    if(!reg.test(this.queryData.s_claims_saf_rate)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.e_claims_saf_rate) {
                    if(!reg.test(this.queryData.e_claims_saf_rate)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.s_shipping_miss_rate) {
                    if(!reg.test(this.queryData.s_shipping_miss_rate)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.e_shipping_miss_rate) {
                    if(!reg.test(this.queryData.e_shipping_miss_rate)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.s_ontime_upload_rate) {
                    if(!reg.test(this.queryData.s_ontime_upload_rate)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }
                if(this.queryData.e_ontime_upload_rate) {
                    if(!reg.test(this.queryData.e_ontime_upload_rate)) {
                        this.$message.warning('请输入数字！');
                        return;
                    }
                }

                let obj = {
                    ...params,
                    account_id: this.queryData.account_id.join(','),
                    user_name: this.queryData.user_name.join(','),
                    program: this.queryData.program,
                    cur_standards_level: this.queryData.cur_standards_level,
                    pre_standards_level: this.queryData.pre_standards_level,
                    s_defective_trans_rate: this.queryData.s_defective_trans_rate,
                    e_defective_trans_rate: this.queryData.e_defective_trans_rate,
                    s_claims_saf_rate: this.queryData.s_claims_saf_rate,
                    e_claims_saf_rate: this.queryData.e_claims_saf_rate,
                    s_shipping_miss_rate: this.queryData.s_shipping_miss_rate,
                    e_shipping_miss_rate: this.queryData.e_shipping_miss_rate,
                    s_ontime_upload_rate: this.queryData.s_ontime_upload_rate,
                    e_ontime_upload_rate: this.queryData.e_ontime_upload_rate,
                    start_date: this.queryData.pullTime && this.queryData.pullTime[0],
                    end_date: this.queryData.pullTime && this.queryData.pullTime[1],
                    order_by: this.queryData.order_by,
                    order_sc: this.queryData.order_sc,
                };

                obj = Object.assign(params || {}, obj);

                this.getSellerScoreFormInfo(obj).then(({ data }) => {
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
                    program: '',
                    cur_standards_level: '',
                    pre_standards_level: '',
                    s_defective_trans_rate: '',
                    e_defective_trans_rate: '',
                    s_claims_saf_rate: '',
                    e_claims_saf_rate: '',
                    s_shipping_miss_rate: '',
                    e_shipping_miss_rate: '',
                    s_ontime_upload_rate: '',
                    e_ontime_upload_rate: '',
                    pullTime: [],
                    order_by: '',
                    order_sc: '',
                };
            },

            // 排序
            handleSortChange(data) {
                this.queryData.sortOrder = {
                    prop: data.prop,
                    order: data.order
                };
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'seller_score_form',
                    value: JSON.stringify(this.queryData)
                });
                this.queryData.order_by = data.prop;

                if (data.prop === "defective_trans_rate") {
                    this.queryData.order_sc = data.order === 'ascending' ? 0 : 1;
                }
                if (data.prop === "claims_saf_rate") {
                    this.queryData.order_sc = data.order === 'ascending' ? 0 : 1;
                }
                if (data.prop === "shipping_miss_rate") {
                    this.queryData.order_sc = data.order === 'ascending' ? 0 : 1;
                }
                if (data.prop === "ontime_upload_rate") {
                    this.queryData.order_sc = data.order === 'ascending' ? 0 : 1;
                }
                this.handleQueryInfo();
            },

            //点击弹框
            handleClickDialog(row) {
                if(row.value === '0.00%') return;
                let obj = {
                    account_id: row.account_id,
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
                this.getDialogDetailsInfo(obj).then(({ data }) => {
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
                    key: 'seller_score_form',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...data.title];
                this.tableProps = ['index', 'account_name', 'account_short_name','user_name', 'program_cn', 'cur_standards_level', 'pre_standards_level', 'defective_trans_rate', 'claims_saf_rate', 'shipping_miss_rate', 'ontime_upload_rate', 'statis_date'];
                this.tableClickProps = ['defective_trans_rate', 'claims_saf_rate', 'shipping_miss_rate', 'ontime_upload_rate'];
                this.tableData = data.data;
                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'index') return '80';
                    if(item === 'account_name') return '200';
                    if(item === 'statis_date'|| item === 'user_name') return '120';
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
                getOptionList({ module: 'seller_evaluation'}).then(({ data }) => {
                    if(data.status) {
                        this.optionList.account_list = data.categor_dict.account_list;
                        this.optionList.user_name_list = data.categor_dict.user_name_list;
                        this.optionList.account_grade = data.categor_dict.account_grade;
                        this.optionList.site_list = data.categor_dict.site_list;
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
