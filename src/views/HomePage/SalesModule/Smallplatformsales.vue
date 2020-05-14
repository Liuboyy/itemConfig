<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="数据类型">
                            <el-select size="small" v-model="queryData.data_type">
                                <el-option v-for="item in optionList.dateTypeList"
                                           :key="item.status_id"
                                           :value="item.status_id"
                                           :label="item.status_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="订单状态">
                            <el-select size="small" v-model="queryData.order_status" filterable v-filter clearable>
                                <el-option v-for="item in optionList.orderStatusList"
                                           :key="item.status_id"
                                           :value="item.status_id"
                                           :label="item.status_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="销售员">
                            <el-select size="small" v-model="queryData.sale_user" filterable v-filter collapseTags multiple>
                                <el-option v-for="item in optionList.salesPersonList"
                                           :key="item.user_id"
                                           :value="item.user_id"
                                           :label="item.user_full_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="创建月份">
                            <el-date-picker size="small" v-model="queryData.paymentTime" :clearable="false"
                                            type="month" format="yyyy-MM" value-format="yyyy-MM" placeholder="选择月">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                     <!-- <li>
                        <SearchRequirement label="日期">
                            <el-date-picker
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.paymentTime"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </SearchRequirement>
                    </li> -->
                </ul>
                <FilterBtn  :resetFn="handleResetQueryInfo" :queryFn="handleQueryInfo" refTable="tableArea"
                            :params="{}"></FilterBtn>
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
        </ComTableInfo>

        <!-- <div class="ui-main-module-page">
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
        </div> -->
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
        getSmallPlatformSalesInfo,
        getDropDownList
    } from '@/api/sales_module/small_platform_sales'

    import {
        getPreDateRange,
        getCurrentMonth
    } from '@/api/common/date_format'

    import * as importApi from '@/api/import_api/index';

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'small_platform_sales';

    export default {
        name: component_name,
        data() {
            return {
                pickerOptions: '',
                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    data_type:'1',
                    order_status:'1',
                    sale_user:[],
                    paymentTime: ''
                },

                optionList: {
                    dateTypeList: [],
                    orderStatusList: [],
                    salesPersonList:[]
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
                // isModifyShow: false,
                // saveRowData: {},
                // modifyObj: {
                //     dealCost: '',
                //     dealMonth: '',
                // },
                // modifyRules: {
                //     dealCost: [
                //         { required: true, message: '请输入成交费', trigger: 'blur'},
                //         { pattern: /^\d+(\.\d+)?$/, message: '请输入数字', trigger: 'blur'}
                //     ],
                //     dealMonth: [
                //         { required: true, message: '请选择成交费月份', trigger: 'change'}
                //     ]
                // },

                //导入
                isImportShow: false,
                isAuditResultShow: false,
                resultData: {},
                //提示语
                isPercentageShow: false,

                //默认月份
                saveDefaultMonth: '',
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
            getSmallPlatformSalesInfo,
        


            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['small_platform_sales']);
                }
        

                let obj = {
                    sale_user: this.queryData.sale_user.join(','),
                    order_status: this.queryData.order_status,
                    data_type: this.queryData.data_type,
                    date_start: this.queryData.paymentTime,
                };

                obj = Object.assign(params || {}, obj);

                this.getSmallPlatformSalesInfo(obj).then(({ data }) => {
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
                    data_type: '1',
                    order_status: '1',
                    sale_user: [],
                    paymentTime: this.saveDefaultMonth
                };
            },

        
            // //获取勾选数据
            // handleCheckInfo(row) {
            //     this.saveCheckInfo = row;
            // },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.handleQueryInfo();
                }else {
                    this.$message.error(data.errorMess || '操作失败');
                }
            },

            // // 分页条数切换
            // handleSizeChange(val) {
            //     this.handleQueryInfo({
            //         limit: val,
            //         offset: 1
            //     }, true)
            // },

            // // 跳转页数切换
            // handleCurrentChange(val) {
            //     this.handleQueryInfo({
            //         limit: this.pageData.currentList,
            //         offset: val
            //     }, true)
            // },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel:1
                 }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'small_platform_sales',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['销售员', '账号', ...Object.values(data.title)];
                this.tableProps = ['user_name','account_name', ...data.title];
                this.queryData.data_type === '1' ? this.$set(this.tableKey, 2, '销售额（单位:EUR）') : this.$set(this.tableKey, 2, '订单数');
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    let dataList = [];
                    data.data.forEach(item => {
                        item.forEach(_item => {
                            dataList.push(_item)
                        })
                    });
                    this.tableData = dataList;
                });
                this.tableMinWidth = this.tableProps.map(item => {
                    if (item === 'total'|| item === 'account_name') return '130';
                    return '90';
                })
                // this.pageData.currentTotal = data.page_data.total * 1 ;
                // this.pageData.currentList = data.page_data.limit * 1 ;
                // this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                getCurrentMonth().then(( data ) => {
                    this.saveDefaultMonth = data.month;
                    this.queryData.paymentTime = data.month;
                    this.handleQueryInfo();
                });
                getDropDownList().then(({ data }) => {
                    this.optionList.dateTypeList = data.date_type;
                    this.optionList.orderStatusList= data.order_status;
                    this.optionList.salesPersonList=data.user_data
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
