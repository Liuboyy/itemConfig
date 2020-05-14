<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="付款月份">
                            <el-date-picker
                                    :clearable="false"
                                    v-model="queryData.months"
                                    type="monthrange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy-MM"
                                    value-format="yyyy-MM"
                                    size="small"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="平台类型">
                            <el-popover
                                    ref="popover"
                                    width="400"
                                    placement="bottom-start"
                                    trigger="manual"
                                    :visible-arrow="false"
                                    v-model="popover.query">
                                <div class="ui-input__tree">
                                    <div class="ui-base--area">
                                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                                        <el-checkbox-group v-model="checkedPlatform" @change="handleCheckedPlatformChange">
                                            <el-checkbox v-for="item in optionList.platformList" :label="item.d_code" :key="item.d_code">
                                                {{item.d_name}}</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div class="ui-tree__btn">
                                        <el-button type="text" @click="handleCloseCheckInfo">关闭</el-button>
                                        <el-button type="text" @click="handleConfirmCheckInfo">确定</el-button>
                                    </div>
                                </div>
                            </el-popover>
                            <el-input class="ui-popover__input" readonly size="small" v-popover:popover v-model="queryData.platform"
                                      @focus="handleFocusPopover"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="账号名称">
                            <el-select
                                    collapseTags 
                                    multiple
                                    clearable
                                    filterable
                                    v-filter
                                    v-model="queryData.accountName"
                                    placeholder="请选择"
                                    size="small">
                                <el-option
                                        v-for="item in optionList.accountNameList"
                                        :key="item.d_id"
                                        :label="item.d_name"
                                        :value="item.d_id">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="订单状态">
                            <el-select
                                    collapseTags 
                                    multiple
                                    clearable
                                    filterable
                                    v-filter
                                    v-model="queryData.orderStatus"
                                    placeholder="请选择"
                                    size="small">
                                <el-option
                                        v-for="item in optionList.orderStatusList"
                                        :key="item.d_id"
                                        :label="item.d_name"
                                        :value="item.d_id">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="物流商">
                            <el-select
                                    collapseTags 
                                    multiple
                                    clearable
                                    filterable
                                    v-filter
                                    v-model="queryData.logisticsProvider"
                                    placeholder="请选择"
                                    size="small"
                                    @change="handleChangeLogisticsProvider"
                                    @clear="handleClearLogisticsProvider">
                                <el-option
                                        v-for="item in optionList.logisticsProviderList"
                                        :key="item.d_id"
                                        :label="item.d_name"
                                        :value="item.d_id">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="物流方式">
                            <el-select
                                    collapseTags 
                                    multiple
                                    clearable
                                    filterable
                                    v-filter
                                    v-model="queryData.logisticsWay"
                                    placeholder="请选择"
                                    size="small">
                                <el-option
                                        v-for="item in optionList.logisticsWayList"
                                        :key="item.d_code"
                                        :label="item.d_name"
                                        :value="item.d_code">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="发货大仓">
                            <el-select
                                    collapseTags 
                                    multiple
                                    clearable
                                    filterable
                                    v-filter
                                    v-model="queryData.shipOkura"
                                    placeholder="请选择"
                                    size="small"
                                    @change="handleChangeShipOkura"
                                    @clear="handleClearShipOkura">
                                <el-option
                                        v-for="item in optionList.shipOkuraList"
                                        :key="item.d_id"
                                        :label="item.d_name"
                                        :value="item.d_id">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="发货仓库">
                            <el-select
                                    collapseTags 
                                    multiple
                                    clearable
                                    filterable
                                    v-filter
                                    v-model="queryData.shipWarehouse"
                                    placeholder="请选择"
                                    size="small">
                                <el-option
                                        v-for="item in optionList.shipWarehouseList"
                                        :key="item.d_id"
                                        :label="item.d_name"
                                        :value="item.d_id">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="异常缺货状态">
                            <el-select clearable filterable v-filter v-model="queryData.stockStatus" placeholder="请选择" size="small" collapseTags multiple>
                                <el-option
                                        v-for="item in optionList.stockStatusList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
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
                :showSearch="showSearch"
                :otherHeight="['el-tabs__header']">
            <template slot="platform_type" slot-scope="scope">
                <el-button size="small" type="text" @click="handleClickPlatform(scope.row)">{{scope.row.platform_type}}</el-button>
            </template>
            <template slot="status_name" slot-scope="scope">
                <span class="ui-state_dot state_orange" v-if="scope.row.complete_status == '0'||scope.row.complete_status == '15'||scope.row.complete_status == '119'"></span>
                <span class="ui-state_dot state_blue" v-if="scope.row.complete_status == '1'||scope.row.complete_status == '13'||scope.row.complete_status == '30'||scope.row.complete_status == '19'||scope.row.complete_status == '20'||scope.row.complete_status == '45'||scope.row.complete_status == '99'||scope.row.complete_status == '90'||scope.row.complete_status == '91'||scope.row.complete_status == '92'"></span>
                <span class="ui-state_dot state_red" v-if="scope.row.complete_status == '5'||scope.row.complete_status == '17'"></span>
                <span class="ui-state_dot state_gray" v-if="scope.row.complete_status == '10'||scope.row.complete_status == '25'||scope.row.complete_status == '40' "></span>
                {{scope.row.status_name}}
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

        <ComDialogPreview
                isPage
                isButton
                title="查看明细"
                width="1400px"
                :visible.sync="isShowDetails"
                :tableKey="platformKey"
                :tableProps="platformProps"
                :tableData="platformData"
                :tableWidth="platformWidth"
                :dialogPageData="platformPageData"
                @dialogPageChange="handlePlatformPageChange"
                @export="handleDialogExportInfo">
        </ComDialogPreview>
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
        getComOptionList,
        getAccountListByPlatform,
        getLogisticsWayByCompany,
        getShipWarehouseByBigHouse,
    } from '@/api/logistics_module/order_execution_aging';

    import {
        getPlatformList,
        getPreviewDetailsInfo
    } from '@/api/logistics_module/b2b_order_aging'

    import {
        getMonthRange,
    } from '@/api/common/date_format'

    export default {
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    months: [],
                    platform: '',
                    accountName: [],
                    orderStatus: [],
                    logisticsProvider: [],
                    logisticsWay: [],
                    shipOkura: [],
                    shipWarehouse: [],
                    stockStatus: []
                },

                optionList: {
                    platformList: [],
                    accountNameList: [],
                    orderStatusList: [],
                    logisticsProviderList: [],
                    logisticsWayList: [],
                    shipOkuraList: [],
                    shipWarehouseList: [],
                    stockStatusList: [
                        {value: '1', label: '正常'},
                        {value: '2', label: '缺货'},
                        {value: '3', label: '异常'},
                    ]
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth:[],

                popover: {
                    query: false
                },
                isIndeterminate: true,
                checkAll: false,
                checkedPlatform: [],
                savePlatform: [],


                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                //查看详情
                isShowDetails: false,
                platformKey: [],
                platformProps: [],
                platformData: [],
                platformWidth: [],
                platformPageData: {
                    limit: 20,
                    offset: 1,
                    total: 0
                },

                saveDefaultTime: [],

                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < new Date('2017-12-31').getTime()
                    },
                }
            }

        },
        computed: {
            ...mapGetters([
                'buttonList',
                'loginInfo',
                'queryParamsInfo',
                'comOptions',
                'b2bOrderAgingMonthInfo'
            ])
        },
        methods: {
            ...mapActions([
                'GetB2BOrderAgingMonthInfo'
            ]),
            autoAddTableInx,



            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['b2b_month_aging']);
                }

                let obj = {
                    ...params,
                    month_start: this.queryData.months[0],
                    month_end: this.queryData.months[1],
                    platform_type: this.queryData.platform,
                    account_id: this.queryData.accountName.join(','),
                    complete_status: this.queryData.orderStatus.join(','),
                    ship_company_id: this.queryData.logisticsProvider.join(','),
                    real_ship_code: this.queryData.logisticsWay.join(','),
                    warehouse_code: this.queryData.shipOkura.join(','),
                    warehouse_id: this.queryData.shipWarehouse.join(','),
                    lack_status: this.queryData.stockStatus.join(','),
                };

                obj = Object.assign(params || {}, obj);

                this.GetB2BOrderAgingMonthInfo(obj).then(({ data }) => {
                    if(data.status === 2) return;
                    if(data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败')
                    }
                })
            },

            // 查询重置
            handleResetQueryInfo() {
                this.queryData = {
                    months: this.saveDefaultTime,
                    platform: '',
                    accountName: [],
                    orderStatus: [],
                    logisticsProvider: [],
                    logisticsWay: [],
                    shipOkura: [],
                    shipWarehouse: [],
                    stockStatus: []
                };
                this.checkedPlatform = [];
            },

            //根据物流商获取物流方式
            handleChangeLogisticsProvider(val) {
                if(val) {
                    this.queryData.logisticsWay = [];
                    getLogisticsWayByCompany({
                        ship_company_id: val.join(',')
                    }).then(({ data }) => {
                        this.optionList.logisticsWayList = data.data.value;
                        this.handleSaveOptionList();
                    })
                }
            },

            //根据发货大仓获取发货仓库
            handleChangeShipOkura(val) {
                if(val) {
                    this.queryData.shipWarehouse = [];
                    getShipWarehouseByBigHouse({
                        big_warehouse_id: val.join(',')
                    }).then(({ data }) => {
                        this.optionList.shipWarehouseList = data.data.value;
                        this.handleSaveOptionList();
                    })
                }
            },

            //清空
            handleClearLogisticsProvider() {
                this.queryData.logisticsWay = [];
                this.optionList.logisticsWayList = [];
            },
            handleClearShipOkura() {
                this.queryData.shipWarehouse = [];
                this.optionList.shipWarehouseList = [];
            },

            //获取下拉
            handleGetOptionList() {
                getPlatformList().then(({ data }) => {
                    if(data.status) {
                        this.optionList.platformList = data.data;
                        this.handleSaveOptionList();
                    }
                });
                getComOptionList().then(({ data }) => {
                    this.optionList.orderStatusList = data.data.status_value;
                    this.optionList.logisticsProviderList = data.data.ship_company_value;
                    this.optionList.shipOkuraList = data.data.big_warehouse_value;
                    this.optionList.accountNameList = data.data.account_value;
                    this.handleSaveOptionList();
                });

            },

            //保存下拉
            handleSaveOptionList() {
                this.$store.commit('SAVE_OPTION_LIST_INFO', {
                    key: 'month_aging',
                    value: this.optionList
                })
            },

            //点击弹框
            handleFocusPopover() {
                this.popover.query = true;
                this.isIndeterminate = this.checkedPlatform.length > 0 && this.checkedPlatform.length < this.optionList.platformList.length;
                this.checkAll = this.checkedPlatform.length === this.optionList.platformList.length;
                this.checkedPlatform = this.savePlatform;
            },
            //全选
            handleCheckAllChange(val) {
                let arr = [];
                this.optionList.platformList.forEach(item => {
                    arr.push(item.d_code);
                });
                this.checkedPlatform = val ? arr: [];
                this.isIndeterminate = false;
            },

            //单选
            handleCheckedPlatformChange(val) {
                let arr = [];
                this.optionList.platformList.forEach(item => {
                    arr.push(item.d_code);
                });
                this.checkAll = val.length === arr.length;
                this.isIndeterminate = val.length > 0 && val.length < arr.length;
            },
            //确定选中平台类型
            handleConfirmCheckInfo() {
                this.queryData.platform = this.checkedPlatform.join(',');
                this.popover.query = false;
            },
            //取消
            handleCloseCheckInfo() {
                this.isIndeterminate = true;
                this.checkAll = false;
                this.popover.query = false;
                this.checkedPlatform = this.savePlatform;
            },

            //点击平台明细
            handleClickPlatform(row, params={}){
                this.isShowDetails = true;
                this.saveRowData = row;
                this.handlePreviewPlatform(this.saveRowData, params);
            },

            handlePreviewPlatform(row, params) {
                let obj = {
                    detail_type: 3,
                    paytime_month: row.paytime_month,
                    platform_type: row.platform_type === '全部' ? 'all' : row.platform_type,
                    account_id: row.account_id.join(','),
                    ship_company_id: row.ship_company_id.join(','),
                    real_ship_code: row.real_ship_code.join(','),
                    warehouse_code: row.warehouse_code.join(','),
                    warehouse_id: row.warehouse_id.join(','),
                    complete_status: row.complete_status.join(','),
                    lack_status: row.lack_status.join(','),
                    ...params,
                };
                getPreviewDetailsInfo(obj).then(({data}) => {
                    if(data.status === 2) return;
                    if(data.status) {
                        this.handlePreviewPlatformCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            handlePreviewPlatformCallBack(data) {
                this.platformKey = data.data.title;
                this.platformData.splice(0);
                this.$nextTick().then(() => {
                    this.platformData = data.data.value;
                    this.platformProps = ['index','paytime','week_day','platform_type', 'order_state_name', 'account_name','order_id','ship_company_name','ship_name','warehouse_name','warehouse_code_name','status_name','pay_time','push_use_time','push_warehouse_time','logistics_audit_use_time','logistics_audi_time','dispatched_use_time','dispatched_time','draw_order_use_time','draw_time','scan_packag_use_time','scan_packag_time','scan_warehouse_use_time','scan_warehouse_time','freight_use_time','freight_time','total_use_time'];
                    this.platformWidth = this.platformProps.map(item => {
                        if(item === 'index'|| item === 'platform_type'|| item === 'week_day') return '70';
                        if(item === 'paytime'|| item === 'status_name'|| item === 'warehouse_code_name') return '90';
                        if(item === 'logistics_audit_use_time'|| item === 'order_state_name'|| item === 'total_use_time') return '100';
                        if(item === 'ship_company_name'|| item === 'push_use_time'|| item === 'dispatched_use_time'|| item === 'freight_use_time') return '110';
                        if(item === 'draw_order_use_time'|| item === 'scan_packag_use_time'|| item === 'scan_warehouse_use_time') return '120';
                        if(item === 'order_id') return '150';
                        if(item === 'account_name'||item === 'ship_name') return '200';
                        return '140'
                    });
                    this.platformPageData.limit = data.page_data.limit * 1;
                    this.platformPageData.offset = data.page_data.offset * 1;
                    this.platformPageData.total = data.page_data.total * 1;
                })
            },

            //弹框分页
            handlePlatformPageChange({offset,limit}) {
                this.handlePreviewPlatform(this.saveRowData,{offset, limit})
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
                    isExcel: 1,
                    total_count: this.pageData.currentTotal
                }, true)
            },

            //明细导出
            handleDetailsExportInfo() {
                this.handleQueryInfo({
                    isExcel: 1,
                    detail_type: 3,
                    total_count: this.pageData.currentTotal,
                }, true)
            },

            //弹框导出
            handleDialogExportInfo() {
                let params = {
                    isExcel: 1,
                    total_count: this.platformPageData.total
                };
                this.handlePreviewPlatform(this.saveRowData, params);
            },

            handleCloseTreeOption(event) {
                try {
                    if (event.path.some(_e => _e.className && _e.className.indexOf && _e.className.indexOf('ui-popover__input') > -1)) return;
                } catch (e) {
                    console.log(event);
                }
                this.popover.query = false;
                if(!this.queryData.platform) this.checkedPlatform = [];
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'b2b_month_aging',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = data.data.title;
                this.tableData = data.data.value.map(item => {
                    return {
                        ...item,
                        account_id: this.queryData.accountName,
                        complete_status: this.queryData.orderStatus,
                        ship_company_id: this.queryData.logisticsProvider,
                        real_ship_code: this.queryData.logisticsWay,
                        warehouse_code: this.queryData.shipOkura,
                        warehouse_id: this.queryData.shipWarehouse,
                        lack_status: this.queryData.stockStatus
                    }
                });
                this.tableProps = ['index','paytime_month','platform_type','order_sum','push_use_time','logistics_audit_use_time','dispatched_use_time','draw_order_use_time','scan_packag_use_time','scan_warehouse_use_time','freight_use_time','total_use_time'];

                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'index'|| item === 'week_day'|| item === 'platform_type') return '70';
                    if(item === 'paytime'|| item === 'status_name'|| item === 'warehouse_code_name'|| item === 'order_sum') return '90';
                    if(item === 'warehouse_name'|| item === 'order_id') return '150';
                    if(item === 'account_name') return '200';
                    if(item === 'ship_name') return '250';
                    return '115'
                });

                this.savePlatform = this.checkedPlatform;

                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            this.handleGetOptionList();
            try{
                getMonthRange().then((data) => {
                    this.saveDefaultTime = [data.start, data.end];
                    if (JSON.stringify(this.b2bOrderAgingMonthInfo) === '{}') {
                        this.queryData.months = this.saveDefaultTime;
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['b2b_month_aging']);
                        this.handleQueryInfoCallBack(this.b2bOrderAgingMonthInfo);
                        if(this.comOptions['month_aging']) {
                            this.optionList = this.comOptions['month_aging'];
                        }
                    }
                });
            }catch (e) {
                console.log(e);
            }
        },
        mounted() {
            document.addEventListener('click', this.handleCloseTreeOption);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.handleCloseTreeOption);
        }
    }
</script>

<style scoped lang="less">

    .ui-input__tree {
        .ui-base--area {
            max-height: 400px;
            overflow: auto;
            padding-bottom: 5px;
        }

        .ui-tree__btn {
            padding-left: 20px;
            border-top: 1px solid #e6e6e6;
        }
    }

    .el-checkbox + .el-checkbox {
        margin-left: 0!important;
    }
    .el-checkbox {
        width: 80px;
        margin-right: 20px;
        margin-bottom: 2px;
    }

    /deep/.ui-layout_edit-dialog .el-dialog__body {
        padding: 10px 20px;
    }

</style>
