<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                            clearable
                            label="付款时间"
                            template="splitDate"
                            v-model="queryData.paymentTime"
                        ></SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="平台">
                            <el-select
                                size="small"
                                v-model="queryData.platform"
                                filterable
                                v-filter
                                clearable
                                collapseTags
                                multiple
                            >
                                <el-option
                                    v-for="item in optionList.platformList"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                ></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="物流公司">
                            <el-select
                                size="small"
                                v-model="queryData.logisticsCompany"
                                filterable
                                v-filter
                                clearable
                                collapseTags
                                multiple
                            >
                                <el-option
                                    v-for="item in optionList.logisticsCompanyList"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                ></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="物流方式">
                            <el-select
                                size="small"
                                v-model="queryData.logisticsWay"
                                filterable
                                v-filter
                                clearable
                                collapseTags
                                multiple
                            >
                                <el-option
                                    v-for="item in optionList.logisticsWayList"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                ></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="目的国">
                            <el-select
                                size="small"
                                v-model="queryData.country"
                                filterable
                                v-filter
                                clearable
                                collapseTags
                                multiple
                            >
                                <el-option
                                    v-for="item in optionList.countryList"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                ></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement
                            :clearable="false"
                            label="发货时间"
                            template="splitDate"
                            v-model="queryData.shippingTime"
                        ></SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="发货仓库">
                            <el-select
                                size="small"
                                v-model="queryData.shipWarehouse"
                                filterable
                                v-filter
                                clearable
                                collapseTags
                                multiple
                            >
                                <el-option
                                    v-for="item in optionList.shipWarehouseList"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                ></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="大仓">
                            <el-select
                                size="small"
                                v-model="queryData.bigWarehouse"
                                filterable
                                v-filter
                                clearable
                                collapseTags
                                multiple
                            >
                                <el-option
                                    v-for="item in optionList.bigWarehouseList"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                ></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="责任部门">
                            <el-select
                                size="small"
                                v-model="queryData.department"
                                filterable
                                v-filter
                                clearable
                                collapseTags
                                multiple
                            >
                                <el-option
                                    v-for="item in optionList.departmentList"
                                    :key="item.value"
                                    :value="item.value"
                                    :label="item.label"
                                ></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <div class="ui-filter-btn">
                    <el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>
                    <el-button
                        size="small"
                        type="primary"
                        @click="handleQueryInfo()"
                        icon="icon-chaxun"
                    >查询</el-button>
                </div>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch">
                <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
            </span>
            <el-button
                v-if="item.method && item.permit(thisVm) && item.icon"
                v-for="item in buttonList"
                size="small"
                :type="item.type"
                :key="item.value"
                :icon="item.icon"
                @click="item.action(thisVm, item.method)"
            >{{item.name}}</el-button>
            <!--:disabled="!savePlatform && item.value === 'export'"-->
        </div>
        <ComTableInfo
            ref="tableArea"
            v-loading="tableLoading"
            :tableKey="tableKey"
            :tableProps="tableProps"
            :tableData="tableData"
            :tableMinWidth="tableMinWidth"
            :showSearch="showSearch"
        >
            <template slot="platform_code" slot-scope="scope">
                <span>{{scope.row.platform_code.label}}</span>
            </template>
            <template slot="logistics_company_name" slot-scope="scope">
                <span>{{scope.row.logistics_company_name.label}}</span>
            </template>
            <template slot="logistics_way_name" slot-scope="scope">
                <span>{{scope.row.logistics_way_name.label}}</span>
            </template>
            <template slot="warehouse_name" slot-scope="scope">
                <span>{{scope.row.warehouse_name.label}}</span>
            </template>

            <template slot="ship_country" slot-scope="scope">
                <span
                    class="ui-link"
                    v-if="scope.row.ship_country === '所有国家'"
                    @click="handleAllCountryInfo(scope.row)"
                >{{scope.row.ship_country}}</span>
                <span v-else>{{scope.row.ship_country}}</span>
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
                :total="pageData.currentTotal"
            ></el-pagination>
        </div>

        <ComDialogPreview
            title="所有国家"
            width="1200px"
            :visible.sync="isCountryShow"
            top="10vh"
            :tableKey="dialogKey"
            :tableProps="dialogProps"
            :tableData="dialogData"
            :tableWidth="dialogWidth"
            isPage
            @dialogPageChange="handleDialogPageChange"
            :dialogPageData="dialogPageData"
        >
            <template slot="platform_code" slot-scope="scope">
                <span>{{scope.row.platform_code.label}}</span>
            </template>
            <template slot="logistics_company_name" slot-scope="scope">
                <span>{{scope.row.logistics_company_name.label}}</span>
            </template>
            <template slot="logistics_way_name" slot-scope="scope">
                <span>{{scope.row.logistics_way_name.label}}</span>
            </template>
            <template slot="warehouse_name" slot-scope="scope">
                <span>{{scope.row.warehouse_name.label}}</span>
            </template>
        </ComDialogPreview>
    </div>
</template>

<script>
import config from "@/assets/js/config";
import { autoAddTableInx, makeCopy, getThirtyDayDateRange } from "@/services";
import { mapActions, mapGetters } from "vuex";
import {
    getOptionList,
    getAfterSalesMonitoringInfo
} from "@/api/logistics_module/after_sales_monitoring";

import {
    getPreDateRange,
    validTime,
    isOverThreeDays,
    IntervalDays
} from "@/api/common/date_format";

import * as importApi from "@/api/import_api/index";

// 组件名称，用于keep-alive和权限（要跟路由保持一致）
const component_name = "after_sales_monitoring";

export default {
    name: component_name,
    data() {
        return {
            // 初始化实例对象
            thisVm: {},

            //搜索缩进
            showSearch: true,

            queryData: {
                paymentTime: [],
                shippingTime: [],
                platform: [],
                logisticsCompany: [],
                logisticsWay: [],
                shipWarehouse: [],
                bigWarehouse: [],
                country: [],
                department: []
            },

            optionList: {
                platformList: [],
                logisticsCompanyList: [],
                logisticsWayList: [],
                shipWarehouseList: [],
                bigWarehouseList: [],
                countryList: [],
                departmentList: []
            },

            tableData: [],
            tableKey: [],
            tableProps: [],
            tableMinWidth: [],
            tableLoading: false,

            //分页
            pageSizes: config.pageData.pageSizes,
            pageData: {
                currentPage: 1,
                currentList: 20,
                currentTotal: 0
            },

            //所有国家
            isCountryShow: false,
            dialogKey: [],
            dialogProps: [],
            dialogData: [],
            dialogWidth: [],
            dialogPageData: {
                offset: 1,
                limit: 20,
                total: 0
            },
            saveRowData: {},
            saveShipSDate: "",
            saveShipEDate: "",
            saveDefaultTime: [],
        };
    },
    computed: {
        ...mapGetters(["loginInfo", "queryParamsInfo", "statisticalReport"]),
        buttonList() {
            return config.AUTHORITY_BUTTON[component_name].buttonList;
        }
    },
    methods: {
        ...mapActions(["Fn"]),
        autoAddTableInx,
        getAfterSalesMonitoringInfo,

        // 列表信息查询
        handleQueryInfo(params, isFn) {
            // 判断是否为功能参数
            if (isFn) {
                // 获取保存的查询参数
                this.queryData = JSON.parse(
                    this.queryParamsInfo["after_sales_monitoring"]
                );
            }

            if (
                !validTime(
                    this.queryData.paymentTime[0],
                    this.queryData.paymentTime[1]
                )
            ) {
                this.$message.warning("结束时间不能小于开始时间，请重新选择");
                return;
            }
            if (
                !validTime(
                    this.queryData.shippingTime[0],
                    this.queryData.shippingTime[1]
                )
            ) {
                this.$message.warning("结束时间不能小于开始时间，请重新选择");
                return;
            }
            if (
                (this.queryData.paymentTime[0] &&
                    !this.queryData.paymentTime[1]) ||
                (this.queryData.paymentTime[1] &&
                    !this.queryData.paymentTime[0])
            ) {
                this.$message.warning("付款时间请选择查询区间！");
                return;
            }
            if (
                (this.queryData.shippingTime[0] &&
                    !this.queryData.shippingTime[1]) ||
                (this.queryData.shippingTime[1] &&
                    !this.queryData.shippingTime[0])
            ) {
                this.$message.warning("发货时间请选择查询区间！");
                return;
            }

            let obj = {
                paytime_s: this.queryData.paymentTime && this.queryData.paymentTime[0],
                paytime_e: this.queryData.paymentTime && this.queryData.paymentTime[1],
                shipped_date_s: this.queryData.shippingTime && this.queryData.shippingTime[0],
                shipped_date_e: this.queryData.shippingTime && this.queryData.shippingTime[1],
                platform_code: this.queryData.platform.join(","),
                logistics_company_name: this.queryData.logisticsCompany.join(","),
                real_ship_code: this.queryData.logisticsWay.join(","),
                warehouse_code: this.queryData.shipWarehouse.join(","),
                big_warehouse_id: this.queryData.bigWarehouse.join(","),
                ship_country: this.queryData.country.join(","),
                department_id: this.queryData.department.join(","),
                type: this.queryData.country ? "popup" : "list"
            };

            obj = Object.assign(params || {}, obj);

            this.saveShipSDate = obj.shipped_date_s;
            this.saveShipEDate = obj.shipped_date_e;

            this.getAfterSalesMonitoringInfo(obj).then(({ data }) => {
                if (data.status === 2) {
                    this.tableLoading = false;
                    return;
                }
                if (data.status) {
                    this.handleQueryInfoCallBack(data);
                } else {
                    this.tableLoading = false;
                    this.$message.error(
                        data.errorMess || data.error_Mess || "查询失败"
                    );
                }
            });
        },

        // 查询重置
        handleResetQueryInfo() {
            this.queryData.paymentTime = [];
            this.queryData.shippingTime = this.saveDefaultTime;
            this.queryData.platform = [];
            this.queryData.logisticsCompany = [];
            this.queryData.logisticsWay = [];
            this.queryData.shipWarehouse = [];
            this.queryData.bigWarehouse = [];
            this.queryData.country = [];
            this.queryData.department = [];
        },

        //点击所有国家
        handleAllCountryInfo(row, params) {
            let obj = {
                paytime_s: row.paytime_s,
                paytime_e: row.paytime_e,
                shipped_date_s: row.shipped_date_s,
                shipped_date_e: row.shipped_date_s,
                platform_code: row.platform_code.value,
                logistics_company_name: row.logistics_company_name.value,
                real_ship_code: row.logistics_way_name.value,
                warehouse_code: row.warehouse_name.value,
                big_warehouse_id: row.big_warehouse_id,
                department_id: row.department_id,
                type: "popup",
                ...params
            };
            this.getAfterSalesMonitoringInfo(obj).then(({ data }) => {
                if (data.status) {
                    this.dialogKey = ["序号", ...data.title];
                    this.dialogProps = [
                        "index",
                        "platform_code",
                        "logistics_company_name",
                        "logistics_way_name",
                        "warehouse_name",
                        "ship_country",
                        "all_order_cnt",
                        "refund_order_cnt",
                        "refund_rate",
                        "resend_order_cnt",
                        "resend_rate",
                        "total_amt",
                        "refund_amt",
                        "resend_amt",
                        "total_rate_order",
                        "total_rate_amt"
                    ];
                    this.dialogData.splice(0);
                    this.$nextTick().then(() => {
                        this.dialogData = data.data_table;
                    });
                    this.dialogWidth = this.tableProps.map(item => {
                        if (item === "index") return "60";
                        if (item === "ship_country") return "120";
                        if (
                            item === "logistics_company_name" ||
                            item === "logistics_way_name" ||
                            item === "warehouse_name"
                        )
                            return "150";
                        return "100";
                    });
                    this.dialogPageData.total = data.page_data.total * 1;
                    this.dialogPageData.limit = data.page_data.limit * 1;
                    this.dialogPageData.offset = data.page_data.offset * 1;
                    this.isCountryShow = true;
                } else {
                    this.$message.error(
                        data.errorMess || data.error_Mess || "操作失败"
                    );
                }
            });
            this.saveRowData = row;
        },
        //弹框分页
        handleDialogPageChange({ limit, offset }) {
            this.handleQueryInfo(this.saveRowData, { limit, offset });
        },

        //操作回调
        handleOperationCallBack(data) {
            if (data.status) {
                this.$message.success("操作成功");
                this.handleQueryInfo({ limit: this.pageData.currentList });
            } else {
                this.$message.error(
                    data.errorMess || data.error_Mess || "操作失败"
                );
            }
        },

        // 分页条数切换
        handleSizeChange(val) {
            this.handleQueryInfo(
                {
                    limit: val,
                    offset: 1
                },
                true
            );
        },

        // 跳转页数切换
        handleCurrentChange(val) {
            this.handleQueryInfo(
                {
                    limit: this.pageData.currentList,
                    offset: val
                },
                true
            );
        },

        timeLimit(BeginDate, EndDate) {
            let begin = new Date(BeginDate);
            let end = new Date(EndDate);
            let beginDate = begin.getTime(begin);
            let endDate = end.getTime(end);
            let days = Math.floor((endDate - beginDate) / (24 * 3600 * 1000));
            return days;
        },

        //导出
        handleExportInfo() {
            if(!this.saveShipSDate || !this.saveShipEDate) {
                this.$message.warning('请筛选发货时间后导出！');
            } else if(IntervalDays(this.saveShipSDate, this.saveShipEDate) > 30) {
                this.$message.warning('导出时发货时间查询不能大于30天！')
            }else {
                this.handleQueryInfo({
                    is_excel: 1,
                }, true)
            }
        },

        // 查询回调
        handleQueryInfoCallBack(data) {
            // 保存查询参数
            this.$store.commit("SAVE_QUERY_PARAMS_INFO", {
                key: "after_sales_monitoring",
                value: JSON.stringify(this.queryData)
            });

            //列表渲染数据
            this.tableKey = ["序号", ...data.title];
            this.tableProps = [
                "index",
                "platform_code",
                "logistics_company_name",
                "logistics_way_name",
                "warehouse_name",
                "ship_country",
                "all_order_cnt",
                "refund_order_cnt",
                "refund_rate",
                "resend_order_cnt",
                "resend_rate",
                "total_amt",
                "refund_amt",
                "resend_amt",
                "total_rate_order",
                "total_rate_amt"
            ];
            this.tableData.splice(0);
            this.$nextTick().then(() => {
                this.tableLoading = false;
                this.tableData = data.data_table.map(item => {
                    return {
                        ...item,
                        paytime_s: this.queryData.paymentTime && this.queryData.paymentTime[0],
                        paytime_e: this.queryData.paymentTime && this.queryData.paymentTime[1],
                        shipped_date_s: this.queryData.shippingTime && this.queryData.shippingTime[0],
                        shipped_date_e: this.queryData.shippingTime && this.queryData.shippingTime[1],
                        big_warehouse_id: this.queryData.bigWarehouse.join(','),
                        department_id: this.queryData.department.join(',')
                    };
                });
            });
            this.tableMinWidth = this.tableProps.map(item => {
                if (item === "index") return "60";
                if (item === "ship_country") return "120";
                if (item === "logistics_company_name") return "150";
                if (item === "logistics_way_name" || item === "warehouse_name")
                    return "200";
                return "100";
            });
            this.pageData.currentTotal = data.page_data.total * 1;
            this.pageData.currentList = data.page_data.limit * 1;
            this.pageData.currentPage = data.page_data.offset * 1;
        }
    },
    created() {
        this.thisVm = this;
        try {
            getOptionList({ module: "after_sale" }).then(({ data }) => {
                this.optionList.platformList = data.categor_dict.platform_list;
                this.optionList.logisticsCompanyList = data.categor_dict.logistics_company_list;
                this.optionList.logisticsWayList = data.categor_dict.ship_country_list;
                this.optionList.shipWarehouseList = data.categor_dict.warehouse_list;
                this.optionList.bigWarehouseList = data.categor_dict.big_warehouse_list;
                this.optionList.countryList = data.categor_dict.real_ship_list;
                this.optionList.departmentList = data.categor_dict.department_list;
            });
            this.tableLoading = true;
            // 默认时间
            this.queryData.shippingTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
            this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
            this.handleQueryInfo();
        } catch (e) {
            console.log(e);
        }
    }
};
</script>

<style scoped lang="less">
</style>
