<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="发货时间" v-model="queryData.deliveryTime" template="daterange" :isOption="false" :clearable="true">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="结算月份">
                            <el-date-picker
                                    clearable
                                    type="month"
                                    size="small"
                                    v-model="queryData.settleMonth"
                                    placeholder="选择月"
                                    format="yyyy-MM"
                                    value-format="yyyy-MM">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="平台">
                            <el-select size="small" v-model="queryData.platform" filterable v-filter @change="handleChangePlatform" clearable>
                                <el-option v-for="item in optionList.platformList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="账号">
                            <el-select size="small" v-model="queryData.account" filterable v-filter clearable>
                                <el-option v-for="item in optionList.accountList"
                                           :key="item.d_id"
                                           :value="item.d_id"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="订单号">
                            <el-input size="small" placeholder="请输入" v-model="queryData.orderNo"></el-input>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn  :resetFn="handleResetQueryInfo" :queryFn="handleQueryInfo" refTable="tableArea"
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
                isCheck
                @checked="handleCheckInfo"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableFixed="tableFixed"
                :tableMinWidth="tableMinWidth"
                :showSearch="showSearch">
            <template slot="order_remark" slot-scope="scope">
                <el-popover
                        v-if="scope.row.order_remark && scope.row.order_remark.length > 10"
                        placement="top-start"
                        width="300"
                        trigger="hover">
                    <span>{{scope.row.order_remark}}</span>
                    <span slot="reference" v-html="scope.row.order_remark.length > 10 ? scope.row.order_remark.substring(0,10) + '...':scope.row.order_remark">{{scope.row.order_remark}}</span>
                </el-popover>
                <span v-else>{{scope.row.order_remark}}</span>
            </template>

            <template slot="remarks" slot-scope="scope">
                <el-popover
                        v-if="scope.row.remarks && scope.row.remarks.length > 10"
                        placement="top-start"
                        width="300"
                        trigger="hover">
                    <span>{{scope.row.remarks}}</span>
                    <span slot="reference" v-html="scope.row.remarks.length > 10 ? scope.row.remarks.substring(0,10) + '...':scope.row.remarks">{{scope.row.remarks}}</span>
                </el-popover>
                <span v-else>{{scope.row.remarks}}</span>
            </template>

            <template slot="sku_detail" slot-scope="scope">
                <el-popover
                        v-if="scope.row.sku_detail && scope.row.sku_detail.length > 12"
                        placement="top-start"
                        width="300"
                        trigger="hover">
                    <span>{{scope.row.sku_detail}}</span>
                    <span slot="reference" v-html="scope.row.sku_detail.length > 12 ? scope.row.sku_detail.substring(0,12) + '...':scope.row.sku_detail">{{scope.row.sku_detail}}</span>
                </el-popover>
                <span v-else>{{scope.row.sku_detail}}</span>
            </template>

            <template slot="operation" slot-scope="scope">
                <ComPermitButton permit="batch_modify" label="修改结算月份和备注" @click="handleModifyInfo(scope.row)"></ComPermitButton>
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

        <el-dialog class="ui-layout_edit-dialog" title="修改结算月份和备注" width="500px"
                   :visible.sync="isModifyShow":close-on-click-modal="false" :close-on-press-escape="false" @closed="handleCloseInfo">
            <el-form :model="modifyObj" :rules="modifyRules" ref="modifyObj" labelWidth="90px">
                <el-form-item label="结算月份" prop="settleMonth">
                    <el-date-picker
                            style="width:320px"
                            :clearable="false"
                            size="small"
                            v-model="modifyObj.settleMonth"
                            type="month"
                            placeholder="选择月"
                            format="yyyy-MM"
                            value-format="yyyy-MM">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input size="small" type="textarea" maxlength="200" :rows="8" resize="none" style="width:320px"
                              show-word-limit placeholder="请输入" v-model="modifyObj.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handleCloseInfo">取消</el-button>
                <el-button size="small" @click="handleConfirmInfo" type="primary">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog class="ui-layout_edit-dialog" width="440px" :title="modifyType === 'remarks' ? '添加备注': '修改结算月份'"
                   :visible.sync="isBatchModifyShow" :close-on-click-modal="false" :close-on-press-escape="false" @closed="handleCloseBatchInfo">
            <el-form :model="batchModifyObj" :rules="modifyRules" ref="batchModifyObj">
                <el-form-item label="结算月份" prop="settleMonth" v-if="modifyType === 'settleMonth'" labelWidth="100px">
                    <el-date-picker
                            :clearable="false"
                            size="small"
                            v-model="batchModifyObj.settleMonth"
                            type="month"
                            placeholder="选择月"
                            format="yyyy-MM"
                            value-format="yyyy-MM">
                    </el-date-picker>
                </el-form-item>
                <el-form-item prop="remarks" v-if="modifyType === 'remarks'">
                    <el-input size="small" type="textarea" maxlength="200" :rows="8" resize="none"
                              show-word-limit placeholder="请输入" v-model="batchModifyObj.remarks"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handleCloseBatchInfo">取消</el-button>
                <el-button size="small" @click="handleConfirmBatchInfo" type="primary">确定</el-button>
            </div>
        </el-dialog>

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
        getOverseaPlatformProfitInfo,
        getPlatformList,
        getAccountList,
        getConfirmModifyInfo
    } from '@/api/sales_module/oversea_platform_profit'

    import {
        getPreDateRange,
    } from '@/api/common/date_format'

    import * as importApi from '@/api/import_api/index';

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'oversea_platform_profit';

    export default {
        name: component_name,
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    deliveryTime: [],
                    platform: '',
                    account: '',
                    orderNo: '',
                    settleMonth: ''
                },

                optionList: {
                    platformList: [],
                    accountList: [],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth:[],
                tableFixed: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                saveDefaultDate: [],
                saveCheckInfo: [],

                //修改结算月份和备注
                isModifyShow: false,
                modifyObj: {
                    settleMonth: '',
                    remarks: '',
                },
                modifyRules: {
                    settleMonth: [
                        { required: true, message: '带*号为必填项', trigger: 'change'},
                    ],
                    remarks: [
                        { required: true, message: '带*号为必填项', trigger: 'blur'}
                    ]
                },

                //批量修改
                isBatchModifyShow: false,
                batchModifyObj: {
                    settleMonth: '',
                    remarks: '',
                },
                modifyType: '',
            }

        },
        computed: {
            ...mapGetters([
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
            getOverseaPlatformProfitInfo,


            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['oversea_platform_profit']);
                }

                let obj = {
                    platform_code: this.queryData.platform,
                    deal_month: this.queryData.paymentMonth || '',
                    order_id: this.queryData.orderNo,
                    account_id: this.queryData.account,
                    send_time_start: this.queryData.deliveryTime && this.queryData.deliveryTime[0],
                    send_time_end: this.queryData.deliveryTime && this.queryData.deliveryTime[1],
                    settlement_time: this.queryData.settleMonth
                };

                obj = Object.assign(params || {}, obj);

                this.getOverseaPlatformProfitInfo(obj).then(({ data }) => {
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
                    deliveryTime: this.saveDefaultDate,
                    platform: '',
                    account: '',
                    orderNo: '',
                    settleMonth: ''
                };
            },

            //平台带出账号
            handleChangePlatform(val) {
                if(val) {
                    getAccountList({ platform_code: val}).then(({ data }) => {
                        this.optionList.accountList = data.data
                    })
                }else {
                    this.optionList.accountList = [];
                }
            },

            //获取勾选数据
            handleCheckInfo(val) {
                this.saveCheckInfo = val;
            },

            //修改结算月份
            handleModifySettleInfo() {
                if(!this.saveCheckInfo.length) {
                    this.$message.warning('请先勾选数据！');
                    return;
                }
                this.isBatchModifyShow = true;
                this.modifyType = 'settleMonth';
            },

            //添加备注
            handleRemarksInfo() {
                if(!this.saveCheckInfo.length) {
                    this.$message.warning('请先勾选数据！');
                    return;
                }
                this.isBatchModifyShow = true;
                this.modifyType = 'remarks';
            },
            //取消
            handleCloseBatchInfo() {
                this.isBatchModifyShow = false;
                this.batchModifyObj.settleMonth = '';
                this.batchModifyObj.remarks = '';
                this.modifyType = '';
                this.$refs['batchModifyObj'].resetFields();
            },
            //确定
            handleConfirmBatchInfo() {
                this.$refs['batchModifyObj'].validate((res) => {
                    if (res) {
                        let obj = {
                            edit_type: 1,
                            user_number: this.loginInfo.staff_code,
                            order_id: this.saveCheckInfo.map(item => item.order_id).join(','),
                        };
                        if(this.modifyType === 'settleMonth') {
                            obj.settling_month = this.batchModifyObj.settleMonth;
                        }else {
                            obj.remarks = this.batchModifyObj.remarks;
                        }
                        getConfirmModifyInfo(obj).then(({ data }) => {
                            this.handleOperationCallBack(data);
                        })
                    }
                })
            },

            //编辑月份和备注
            handleModifyInfo(row) {
                this.isModifyShow = true;
                this.saveRowData = row;
                this.modifyObj.settleMonth = row.settling_month;
                this.modifyObj.remarks = row.remarks;
            },
            //取消
            handleCloseInfo() {
                this.isModifyShow = false;
                this.modifyObj.settleMonth = '';
                this.modifyObj.remarks = '';
                this.$refs['modifyObj'].resetFields();
            },
            //确定
            handleConfirmInfo() {
                this.$refs['modifyObj'].validate((res) => {
                    if (res) {
                        let obj = {
                            edit_type: 1,
                            user_number: this.loginInfo.staff_code,
                            order_id: this.saveRowData.order_id,
                            settling_month: this.modifyObj.settleMonth,
                            remarks: this.modifyObj.remarks,
                        };
                        getConfirmModifyInfo(obj).then(({ data }) => {
                            this.handleOperationCallBack(data);
                        })
                    }
                })
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    if(this.isModifyShow) this.isModifyShow = false;
                    if(this.isBatchModifyShow) this.isBatchModifyShow = false;
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || '操作失败');
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

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                    total_count: this.pageData.currentTotal
                }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'oversea_platform_profit',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...Object.values(data.title), '操作'];
                this.tableProps = ['index', ...Object.keys(data.title), 'operation'];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data;
                });
                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'index') return '60';
                    if(item === 'currency_code'|| item === 'ship_country'|| item === 'settling_month') return '70';
                    if(item === 'sku_price'|| item === 'ship_price'|| item === 'total_price'|| item === 'currency_rate') return '90';
                    if(item === 'platdeal_fee'|| item === 'sku_cost'|| item === 'tariff_cost'|| item === 'head_cost'|| item === 'handle_cost') return '110';
                    if(item === 'sku_detail') return '120';
                    if(item === 'account_name'|| item === 'shipped_date') return '140';
                    if(item === 'order_id'|| item === 'tracking_number_1'|| item === 'package_id'|| item === 'tail_cost'|| item === 'operation'|| item === 'remarks'|| item === 'order_remark') return '150';
                    if(item === 'platform_order_id'||item === 'warehouse_name'|| item === 'cargo_company') return '200';
                    if(item === 'company_ship_name') return '250';
                    return '100';
                });
                this.tableFixed = this.tableProps.map(item => {
                    if(item === 'operation') return 'right';
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
                getPlatformList().then(({ data }) => {
                    this.optionList.platformList = data.data;
                });
                getPreDateRange().then(( data ) => {
                    this.saveDefaultDate = [data.start, data.end];
                    this.queryData.deliveryTime = this.saveDefaultDate;
                    this.handleQueryInfo();
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>

<style scoped lang="less">

    @color: #ff9900;

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0;
    }

    .text-color {
        color:  @color;
    }

    .ui-layout_edit-dialog {
        .ui-check_box {
            .el-checkbox+.el-checkbox {
                margin-left: 0;
            }
            .el-checkbox {
                width: 200px;
                margin: 5px 30px 5px 0;
            }
            .el-checkbox__label {
                font-size: 12px;
            }
        }
    }


</style>
