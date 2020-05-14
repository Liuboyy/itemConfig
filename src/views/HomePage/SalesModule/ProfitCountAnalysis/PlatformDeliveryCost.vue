<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="平台">
                            <el-select size="small" v-model="queryData.platform" filterable v-filter collapseTags multiple>
                                <el-option v-for="item in optionList.platformList"
                                           :key="item.d_code"
                                           :value="item.d_code"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="成交费月份">
                            <el-date-picker
                                    clearable
                                    size="small"
                                    v-model="queryData.paymentMonth"
                                    type="month"
                                    placeholder="选择月"
                                    format="yyyyMM"
                                    value-format="yyyyMM">
                            </el-date-picker>
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
            <span class="ui-tip_box" v-if="isPercentageShow"><i class="icon-tishi1"></i>文件导入中，请耐心等候...</span>
        </div>
        <ComTableInfo
                ref="tableArea"
                isCheck
                @checked="handleCheckInfo"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableMinWidth="tableMinWidth"
                :showSearch="showSearch">
            <template slot="operation" slot-scope="scope">
                <ComPermitButton permit="modify" label="编辑" @click="handleModifyInfo(scope.row)"></ComPermitButton>
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

        <el-dialog class="ui-layout_edit-dialog" title="编辑" width="440px" :close-on-click-modal="false" :close-on-press-escape="false"
                   :visible.sync="isModifyShow"  @closed="handleCloseInfo">
            <el-form :model="modifyObj" :rules="modifyRules" ref="modifyObj" labelWidth="100px">
                <el-form-item label="成交费" prop="dealCost">
                    <el-input size="small" placeholder="请输入" v-model="modifyObj.dealCost"></el-input>
                </el-form-item>
                <el-form-item label="成交费月份" prop="dealMonth">
                    <el-date-picker
                            :clearable="false"
                            size="small"
                            v-model="modifyObj.dealMonth"
                            type="month"
                            placeholder="选择月"
                            format="yyyyMM"
                            value-format="yyyyMM">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handleCloseInfo">取消</el-button>
                <el-button size="small" @click="handleConfirmInfo" type="primary">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog
                title="导入"
                width="400px"
                class="ui-layout_edit-dialog"
                :visible.sync="isImportShow"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="isImportShow = false">
            <div>
                <ComUpload :url="uploadUrl" @success="handleSuccessCallBack" label="选择文件" success
                           @onUpload="handleOnUpload"></ComUpload>
                <el-button size="small" @click="handleDownLoad"  style="margin-left: 10px">下载模板</el-button>
            </div>
            <div class="ui-tip_area">
                <p>温馨提示：仅支持<strong> ".csv、.xls、.xlsx"</strong>文件</p>
            </div>
        </el-dialog>

        <ComResultShow
                title="上传结果"
                :visible.sync="isAuditResultShow"
                :processedNum="resultData.count_success"
                :unProcessedNum="resultData.count_fail"></ComResultShow>
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
        getPlatformDeliveryCostInfo,
        getPlatformList,
        getCostConfirmInfo,
        getBatchDeleteInfo,
        getDownLoadList,
        getImportProgressInfo
    } from '@/api/sales_module/platform_delivery_cost'

    import {
        getPreDateRange,
    } from '@/api/common/date_format'

    import * as importApi from '@/api/import_api/index';

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'platform_delivery_cost';

    export default {
        name: component_name,
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    paymentMonth: '',
                    platform: [],
                    orderNo: '',
                },

                optionList: {
                    platformList: [],
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

                saveDefaultDate: [],
                saveCheckInfo: [],

                //编辑
                isModifyShow: false,
                saveRowData: {},
                modifyObj: {
                    dealCost: '',
                    dealMonth: '',
                },
                modifyRules: {
                    dealCost: [
                        { required: true, message: '请输入成交费', trigger: 'blur'},
                        { pattern: /^\d+(\.\d+)?$/, message: '请输入数字', trigger: 'blur'}
                    ],
                    dealMonth: [
                        { required: true, message: '请选择成交费月份', trigger: 'change'}
                    ]
                },

                //导入
                isImportShow: false,
                isAuditResultShow: false,
                resultData: {},
                //提示语
                isPercentageShow: false,
            }

        },
        computed: {
            ...mapGetters([
                'loginInfo',
                'queryParamsInfo',
            ]),
            uploadUrl() {
                return importApi['IMPORT_PLATFORM_COST_INFO'];
            },
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'Fn'
            ]),
            autoAddTableInx,
            getPlatformDeliveryCostInfo,
            getCostConfirmInfo,
            getBatchDeleteInfo,
            getDownLoadList,


            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['platform_delivery_cost']);
                }

                let obj = {
                    platform_code: this.queryData.platform.join(','),
                    deal_month: this.queryData.paymentMonth || '',
                    order_id: this.queryData.orderNo,
                };

                obj = Object.assign(params || {}, obj);

                this.getPlatformDeliveryCostInfo(obj).then(({ data }) => {
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
                    paymentMonth: '',
                    platform: [],
                    orderNo: '',
                };
            },

            //点击编辑
            handleModifyInfo(row) {
                this.isModifyShow = true;
                this.saveRowData = row;
                this.modifyObj.dealMonth = row.statis_month;
                this.modifyObj.dealCost = row.platdeal_fee;
            },
            //取消
            handleCloseInfo() {
                this.isModifyShow = false;
                this.modifyObj.dealCost = '';
                this.modifyObj.dealMonth = '';
                this.$refs['modifyObj'].resetFields();
            },
            //确定
            handleConfirmInfo() {
                this.$refs['modifyObj'].validate((res) => {
                    if (res) {
                        let obj = {
                            order_id: this.saveRowData.order_id,
                            statis_month: this.modifyObj.dealMonth,
                            platdeal_fee: this.modifyObj.dealCost,
                        };
                        this.getCostConfirmInfo(obj).then(({ data }) => {
                            this.handleOperationCallBack(data);
                        })
                    }
                })
            },

            //获取勾选数据
            handleCheckInfo(row) {
                this.saveCheckInfo = row;
            },

            //批量删除
            handleDeleteInfo() {
                if(!this.saveCheckInfo.length) {
                    this.$message.warning('请先勾选数据！');
                    return;
                }
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.getBatchDeleteInfo({
                        order_id: this.saveCheckInfo.map(item => item.order_id).join(',')
                    }).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                }).catch(() => {
                    this.handleQueryInfo({limit: this.pageData.currentList});
                });
            },

            //导入
            handleImportInfo() {
                this.isImportShow = true;
            },
            //导入成功回调
            handleSuccessCallBack(data) {
                if(data.status) {
//                    this.isImportShow = false;
                    this.isPercentageShow = false;
                    this.isAuditResultShow = true;
                    this.resultData = data;
                }else {
                    this.$message.error(data.errorMess || '上传失败');
                    this.isPercentageShow = false;
                }
            },
            handleOnUpload() {
                this.isImportShow = false;
                this.isPercentageShow = true;
//                this.interval = setInterval(this.regenerate, 4000);
            },
            regenerate() {
                getImportProgressInfo({ start_time: '2019-10-18 16:09:00' }).then(({ data }) => {
                    if(data.status) {
                        this.percentage = data.percentage;
                        if(this.percentage == 100) {
                            clearInterval(this.interval);
                        }
                    }else{
                        clearInterval(this.interval);
                        this.$message.error(data.errorMess || '操作失败');
                        this.isPercentageShow = false;
                    }
                })
            },

            //下载模板
            handleDownLoad() {
                this.getDownLoadList().then(({ data }) => {
                    if(data.status) {
                        window.open(data.address, '_self')
                    }else {
                        this.$message.error(data.errorMess || '下载失败！')
                    }
                })
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    if(this.isModifyShow) this.isModifyShow = false;
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
                window.open('/financereport/Finance_report/exportFailData', '_self');
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'platform_delivery_cost',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...Object.values(data.title), '操作'];
                this.tableProps = ['index', ...Object.keys(data.title), 'operation'];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data;
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
                this.handleQueryInfo();
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

    /deep/ .ui-fn-module {
        margin: 0 15px 0 0;
        .el-button--small {
            padding-top: 15px;
        }

        .el-progress-bar__outer {
            background: #ffffff;
        }
        .el-progress-bar {
            width: 15%;
            float: right;
            margin-top: 10px;
        }

        .el-alert {
            float: right;
            height: 34px;
            line-height: 34px;
            width: 15%;
            margin-top: 1px;
        }
        .el-alert__title {
            color: #333333;
            font-weight: bold;
            font-size: 12px;
        }
        .el-alert--warning.is-light {
            background-color: #fffdf9;

            box-sizing: border-box;
        }

        .ui-tip_box {
            display: inline-block;
            width: 200px;
            height: 34px;
            line-height: 34px;
            float: right;
            font-size: 12px;
            font-weight: bold;
            background: #fffdf9;
            border: 1px solid #ffdda8;
            border-radius: 4px;
            padding-left: 5px;
            .icon-tishi1 {
                color: #f2ae3e;
                font-size: 16px;
            }
        }
    }


</style>
