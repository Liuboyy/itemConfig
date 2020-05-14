<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="付款年份">
                            <el-date-picker
                                    type="year"
                                    size="small"
                                    placeholder="选择年"
                                    format="yyyy"
                                    value-format="yyyy"
                                    :clearable="false"
                                    v-model="queryData.year"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="周数">
                            <el-row>
                                <el-col :span="11">
                                    <el-select  filterable v-filter v-model="queryData.weekStart" placeholder="请选择" size="small">
                                        <el-option
                                                v-for="item in optionList.weekList"
                                                :key="item.week_id"
                                                :label="item.week_value"
                                                :value="item.week_value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span="2"> - </el-col>
                                <el-col :span="11">
                                    <el-select filterable v-filter v-model="queryData.weekEnd" placeholder="请选择" size="small">
                                        <el-option
                                                v-for="item in optionList.weekList"
                                                :key="item.week_id"
                                                :label="item.week_value"
                                                :value="item.week_value">
                                        </el-option>
                                    </el-select>
                                </el-col>
                            </el-row>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="平台">
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
                                            <el-checkbox v-for="item in optionList.platformList" :label="item.platform_code" :key="item.platform_code">
                                                {{item.platform_name}}</el-checkbox>
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
                        <SearchRequirement label="站点">
                            <el-select clearable filterable v-filter v-model="queryData.site" placeholder="请选择" size="small" collapseTags multiple>
                                <el-option
                                        v-for="item in optionList.siteList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="是否缺货订单">
                            <el-select v-model="queryData.isStock" placeholder="请选择" size="small">
                                <el-option
                                        v-for="item in optionList.isStockList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
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
            <el-popover
                    placement="right-start"
                    width="350"
                    trigger="hover">
                <div style="font-size: 12px">1.取值时间段：周一至周六晚 8点到早8点，周日整天不计算时长</div>
                <div style="font-size: 12px">2.订单执行率：规定时间内完成的订单数/所有订单数</div>
                <div style="font-size: 12px">3.检查操作：付款时间-订单检查时间节点间隔时长</div>
                <div style="font-size: 12px">4.异常处理：订单进入异常时间-推送到仓库时间节点间隔时长</div>
                <div style="font-size: 12px">5.推送仓库：订单检查-推送到仓库节点间隔时长</div>
                <div style="font-size: 12px">6.已配货：推送到仓库，订单已配货节点间隔时长</div>
                <div style="font-size: 12px">7.上传到物流商：订单已配货-上传到物流商节点间隔时长</div>
                <div style="font-size: 12px">8.仓库拉取订单：上传到物流商-仓库拉取订单节点间隔时长</div>
                <div style="font-size: 12px">9.仓库扫描打包：仓库拉取订单-仓库扫描打包节点间隔时长</div>
                <div style="font-size: 12px">10.仓库扫描出库：仓库扫描打包-仓库扫描出库间隔时长</div>
                <div style="font-size: 12px">11.出库至交运：仓库扫描出库-物流商交运间隔时长</div>
                <el-button slot="reference" type="text" icon="el-icon-info">名词解释</el-button>
            </el-popover>
        </div>
        <ComTableInfo
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableMinWidth="tableMinWidth"
                :showSearch="showSearch"
                :otherHeight="['el-tabs__header']">
            <template slot="platform_name" slot-scope="scope">
                <el-button size="small" type="text" @click="handleClickPlatform(scope.row)">{{scope.row.platform_name}}</el-button>
            </template>
            <template slot="status_name" slot-scope="scope">
                <span class="ui-state_dot state_orange" v-if="scope.row.complete_status == '0'||scope.row.complete_status == '15'||scope.row.complete_status == '119'"></span>
                <span class="ui-state_dot state_blue" v-if="scope.row.complete_status == '1'||scope.row.complete_status == '13'||scope.row.complete_status == '30'||scope.row.complete_status == '19'||scope.row.complete_status == '20'||scope.row.complete_status == '45'||scope.row.complete_status == '99'||scope.row.complete_status == '90'||scope.row.complete_status == '91'||scope.row.complete_status == '92'"></span>
                <span class="ui-state_dot state_red" v-if="scope.row.complete_status == '5'||scope.row.complete_status == '17'"></span>
                <span class="ui-state_dot state_gray" v-if="scope.row.complete_status == '10'||scope.row.complete_status == '25'||scope.row.complete_status == '40' "></span>
                {{scope.row.status_name}}
            </template>
        </ComTableInfo>

        <!--<div class="ui-main-module-page">-->
            <!--<el-pagination-->
                    <!--@size-change="handleSizeChange"-->
                    <!--@current-change="handleCurrentChange"-->
                    <!--:current-page="pageData.currentPage"-->
                    <!--:page-sizes="pageSizes"-->
                    <!--size="small"-->
                    <!--:page-size="pageData.currentList"-->
                    <!--layout="total, sizes, prev, pager, next, jumper"-->
                    <!--:total="pageData.currentTotal">-->
            <!--</el-pagination>-->
        <!--</div>-->

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
        getPlatformList,
        getComOptionList,
        getAccountListByPlatform,
        getLogisticsWayByCompany,
        getShipWarehouseByBigHouse,
        getPreviewDetailsInfo,
        getOrderRateWeekCountInfo,
        getOtherOptionList
    } from '@/api/logistics_module/b2c_order_rate';

    import {
        getCurrentYear,
    } from '@/api/common/date_format'

    export default {
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    year: '',
                    weekStart: '1',
                    weekEnd: '4',
                    platform: '',
                    accountName: [],
                    orderStatus: ['20'],
                    logisticsProvider: [],
                    logisticsWay: [],
                    shipOkura: ['1'],
                    shipWarehouse: [],
                    site: [],
                    isStock: '0'
                },

                optionList: {
                    platformList: [],
                    accountNameList: [],
                    orderStatusList: [],
                    logisticsProviderList: [],
                    logisticsWayList: [],
                    shipOkuraList: [],
                    shipWarehouseList: [],
                    weekList: [],
                    siteList: [],
                    isStockList: []
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableWidth:[],
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

                saveDefaultTime: '',

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
                'orderRateWeekCountInfo'
            ])
        },
        methods: {
            ...mapActions([
                'GetOrderRateWeekCountInfo'
            ]),
            autoAddTableInx,
            getOrderRateWeekCountInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['order_rate_week']);
                }

                if(this.queryData.weekStart == this.queryData.weekEnd) {
                    this.queryData.weekStart = '1';
                    this.$message.warning('开始周数不能等于结束周数');
                    return
                }else if(this.queryData.weekStart > this.queryData.weekEnd) {
                    this.queryData.weekStart = '1';
                    this.$message.warning('开始周数不能大于结束周数');
                    return;
                }

                let obj = {
                    ...params,
                    year: this.queryData.year,
                    week_start: this.queryData.weekStart,
                    week_end: this.queryData.weekEnd,
                    platform_code: this.queryData.platform,
                    account_id: this.queryData.accountName.join(','),
                    complete_status: this.queryData.orderStatus.join(','),
                    ship_company_id: this.queryData.logisticsProvider.join(','),
                    real_ship_code: this.queryData.logisticsWay.join(','),
                    warehouse_code: this.queryData.shipOkura.join(','),
                    warehouse_id: this.queryData.shipWarehouse.join(','),
                    is_lack_stock: this.queryData.isStock,
                    site: this.queryData.site.join(','),
                };

                obj = Object.assign(params || {}, obj);

                this.GetOrderRateWeekCountInfo(obj).then(({ data }) => {
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
                    year: this.saveDefaultTime,
                    weekStart: '1',
                    weekEnd: '4',
                    platform: '',
                    accountName: [],
                    orderStatus: ['20'],
                    logisticsProvider: [],
                    logisticsWay: [],
                    shipOkura: ['1'],
                    shipWarehouse: [],
                    site: [],
                    isStock: '0'
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
                        this.optionList.platformList = data.data.value;
                        this.handleSaveOptionList();
                    }
                });
                getComOptionList().then(({ data }) => {
                    this.optionList.orderStatusList = data.data.status_value;
                    this.optionList.logisticsProviderList = data.data.ship_company_value;
                    this.optionList.shipOkuraList = data.data.big_warehouse_value;
                    this.optionList.accountNameList = data.data.account_value;
                    this.optionList.weekList = data.data.week;
                    this.handleSaveOptionList();
                });
                getOtherOptionList().then(({ data }) => {
                    this.optionList.siteList = data.data.site_list;
                    this.optionList.isStockList = data.data.is_lack_stock;
                })
            },

            //保存下拉
            handleSaveOptionList() {
                this.$store.commit('SAVE_OPTION_LIST_INFO', {
                    key: 'week_count',
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
                    arr.push(item.platform_code);
                });
                this.checkedPlatform = val ? arr: [];
                this.isIndeterminate = false;
            },

            //单选
            handleCheckedPlatformChange(val) {
                let arr = [];
                this.optionList.platformList.forEach(item => {
                    arr.push(item.platform_code);
                });
                this.checkAll = val.length === arr.length;
                this.isIndeterminate = val.length > 0 && val.length < arr.length;
            },
            //确定选中平台
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

            handleCloseTreeOption(event) {
                try {
                    if (event.path.some(_e => _e.className && _e.className.indexOf && _e.className.indexOf('ui-popover__input') > -1)) return;
                } catch (e) {
                    console.log(event);
                }
                this.popover.query = false;
                if(!this.queryData.platform) this.checkedPlatform = [];
            },

            //点击平台明细
            handleClickPlatform(row, params={}){
                this.isShowDetails = true;
                this.saveRowData = row;
                this.handlePreviewPlatform(this.saveRowData, params);
            },

            handlePreviewPlatform(row, params) {
                let obj = {
                    detail_type: 2,
                    paytime_year: row.year,
                    natural_num: row.week_num,
                    platform_code: row.platform_code,
                    account_id: row.account_id.join(','),
                    ship_company_id: row.ship_company_id.join(','),
                    real_ship_code: row.real_ship_code.join(','),
                    warehouse_code: row.warehouse_code.join(','),
                    warehouse_id: row.warehouse_id.join(','),
                    complete_status: row.complete_status.join(','),
                    is_lack_stock: row.is_lack_stock,
                    site: row.site.join(','),
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
                this.platformKey = ['序号', ...data.data.key];
                this.platformData.splice(0);
                this.$nextTick().then(() => {
                    this.platformData = data.data.value;
                    this.platformProps = ['index','order_id','paytime','platform_name','account_name','ship_company_name','ship_name','warehouse_name','warehouse_code_name','status_name','is_lack_stock_cn','ship_country','generation_time','pay_time','check_time','push_warehouse_time','dispatched_time','upload_time','draw_time','scan_packag_time','scan_warehouse_time','freight_time','deliver_time','abnormal_time','delivery_time','stock_up_time','shortage_time','normal_time','onnet_time'];
                    this.platformWidth = this.platformProps.map(item => {
                        if(item === 'index') return '70';
                        if(item === 'paytime'|| item === 'status_name'||item === 'warehouse_code_name'|| item === 'ship_country') return '90';
                        if(item === 'is_lack_stock_cn') return '100';
                        if(item === 'platform_name'|| item === 'account_name') return '110';
                        if(item === 'warehouse_name') return '150';
                        if(item === 'ship_name') return '250';
                        return '140'
                    });
                    this.platformPageData.limit = data.page_data.limit * 1;
                    this.platformPageData.offset = data.page_data.offset * 1;
                    this.platformPageData.total = data.page_data.total * 1;
                });
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
                    is_excel: 1,
                }, true)
            },

            //明细导出
            handleDetailsExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                    detail_type: 2,
                    total_count: this.pageData.currentTotal,
                }, true)
            },

            //弹框导出
            handleDialogExportInfo() {
                let params = {
                    is_excel: 1,
                    total_count: this.platformPageData.total
                };
                this.handlePreviewPlatform(this.saveRowData, params);
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'order_rate_week',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...data.data.key];
                this.tableProps = ['index','year','week_num','platform_name','finish_rate','check_rate','abnormal_rate','push_rate','dispatched_rate','upload_rate','draw_rate','packag_rate','warehouse_rate','freight_rate'];
                this.tableData = data.data.value.map(item => {
                    return {
                        ...item,
                        account_id: this.queryData.accountName,
                        complete_status: this.queryData.orderStatus,
                        ship_company_id: this.queryData.logisticsProvider,
                        real_ship_code: this.queryData.logisticsWay,
                        warehouse_code: this.queryData.shipOkura,
                        warehouse_id: this.queryData.shipWarehouse,
                        is_lack_stock: this.queryData.isStock,
                        site: this.queryData.site,
                    }
                });

                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'index') return '60';
                    if(item === 'year'|| item === 'week_num') return '70';
                    if(item === 'dispatched_rate') return '110';
                    if(item === 'abnormal_rate') return '120';
                    if(item === 'check_rate'|| item === 'push_rate'|| item === 'platform_name') return '130';
                    if(item === 'upload_rate'|| item === 'draw_rate'|| item === 'packag_rate'|| item === 'warehouse_rate') return '145';
                    return '140';
                });

                this.savePlatform = this.checkedPlatform;

//                this.pageData.currentTotal = data.page_data.total * 1 ;
//                this.pageData.currentList = data.page_data.limit * 1 ;
//                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            this.handleGetOptionList();
            try{
                getCurrentYear().then((data) => {
                    this.saveDefaultTime = data.year;
                    if (JSON.stringify(this.orderRateWeekCountInfo) === '{}') {
                        this.queryData.year = this.saveDefaultTime;
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['order_rate_week']);
                        this.handleQueryInfoCallBack(this.orderRateWeekCountInfo);
                        if(this.comOptions['week_count']) {
                            this.optionList = this.comOptions['week_count'];
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
        width: 100px;
        margin-right: 20px;
        margin-bottom: 2px;
    }

    /deep/.ui-layout_edit-dialog .el-dialog__body {
        padding: 10px 20px;
    }
    /deep/.el-button [class*=el-icon-]+span {
        margin-left: 0!important;
    }
    /deep/.el-popover--plain {
        padding: 10px 20px!important;
    }
</style>
