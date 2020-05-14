import account_sales_volume from "./module/am_order_count/account_sales_volume"
import sales_performance_count from "./module/am_order_count/sales_performance_count"
import account_main_params from "./module/am_order_count/account_main_params"

const getters = {
    loginInfo: state => state.loginInfo,
    systemId: state => state.systemId,
    showLoading: state => state.showLoading,
    buttonList: state => state.buttonList,
    queryParamsInfo: state => state.queryParamsInfo,
    permitPath: state => state.permitPath,
    permitResource: state => state.permitResource,

    // 导航激活index
    navIndex: state => state.navIndex,

    // 多页签
    tabLabel: state => state.tabLabel,

    // 下拉数据
    comOptions: state => state.comOptions,

    // 保存页面编辑状态
    pageEditState: state => state.pageEditState,

    accountSalesVolumeInfo: state => state.account_sales_volume.accountSalesVolumeInfo,
    salesPerformanceCountInfo: state => state.sales_performance_count.salesPerformanceCountInfo,
    accountMainParamsInfo: state => state.account_main_params.accountMainParamsInfo,
    publishSalesCountInfo: state => state.publish_sales_count.publishSalesCountInfo,

    //开发目标完成统计
    developmentGroupCountInfo: state => state.development_goal_statistics.developmentGroupCountInfo,
    developerCountInfo: state => state.development_goal_statistics.developerCountInfo,
    developmentTypeCountInfo: state => state.development_goal_statistics.developmentTypeCountInfo,
    developmentProductLineInfo: state => state.development_goal_statistics.developmentProductLineInfo,

    //各成本区间商品开发数
    costDevelopmentGroupInfo: state => state.cost_development_number.costDevelopmentGroupInfo,
    costDeveloperInfo: state => state.cost_development_number.costDeveloperInfo,
    costDevelopmentTypeInfo: state => state.cost_development_number.costDevelopmentTypeInfo,
    costProductLineInfo: state => state.cost_development_number.costProductLineInfo,

    //跟单平均时效统计
    orderGroupTimeCountInfo: state => state.order_time_statistics.orderGroupTimeCountInfo,
    orderProductLineCountInfo: state => state.order_time_statistics.orderProductLineCountInfo,

    //供应商平均到样时效
    supplierArrivalCountInfo: state => state.supplier_arrival_statistics.supplierArrivalCountInfo,

    //开发平均时效统计
    developerGroupTimeCountInfo: state => state.developer_time_statistics.developerGroupTimeCountInfo,
    developerProductLineCountInfo: state => state.developer_time_statistics.developerProductLineCountInfo,

    //TQE工作报表
    dayDetailsInfo: state => state.tqe_work_report.dayDetailsInfo,
    daySummaryInfo: state => state.tqe_work_report.daySummaryInfo,
    monthSummaryInfo: state => state.tqe_work_report.monthSummaryInfo,
    annualReportInfo: state => state.tqe_work_report.annualReportInfo,

    //样品审核报表
    sampleDevelopmentGroupInfo: state => state.sample_audit_report.sampleDevelopmentGroupInfo,
    sampleProductLineInfo: state => state.sample_audit_report.sampleProductLineInfo,
    sampleTqeReportInfo: state => state.sample_audit_report.sampleTqeReportInfo,

    //文案工作报表
    copyGroupSummaryInfo: state => state.copy_work_report.copyGroupSummaryInfo,
    copyGroupDetailsInfo: state => state.copy_work_report.copyGroupDetailsInfo,

    //文案编辑报表
    copyGroupTeamInfo: state => state.copy_editing_report.copyGroupTeamInfo,
    copyGroupMemberInfo: state => state.copy_editing_report.copyGroupMemberInfo,
    copyGroupProductLineInfo: state => state.copy_editing_report.copyGroupProductLineInfo,
    copyGroupDeveTypeInfo: state => state.copy_editing_report.copyGroupDeveTypeInfo,

    //文案平均耗时统计
    copyGroupCountInfo: state => state.copy_time_statistics.copyGroupCountInfo,
    copyProductLineCountInfo: state => state.copy_time_statistics.copyProductLineCountInfo,

    //文案目标达成统计
    copyGoalStatistics: state => state.copy_goal_statistics.copyGoalStatistics,

    //设计部任务汇总统计
    designTaskCountInfo: state => state.design_task_count.designTaskCountInfo,

    //摄影工作报表
    photoGroupSummaryReportInfo: state => state.photograph_work_report.photoGroupSummaryReportInfo,
    photoGroupDetailsReportInfo: state => state.photograph_work_report.photoGroupDetailsReportInfo,

    //摄影平均耗时统计
    photographGroupTimeCountInfo: state => state.photograph_time_statistics.photographGroupTimeCountInfo,
    photographTaskTypeTimeCountInfo: state => state.photograph_time_statistics.photographTaskTypeTimeCountInfo,
    photographProductLineTimeCountInfo: state => state.photograph_time_statistics.photographProductLineTimeCountInfo,

    //摄影拍摄明细
    getPhotographDetailsInfo: state => state.photograph_details.getPhotographDetailsInfo,

    //美工工作报表
    artistGroupSummaryReportInfo: state => state.artist_work_report.artistGroupSummaryReportInfo,
    artistGroupDetailsReportInfo: state => state.artist_work_report.artistGroupDetailsReportInfo,

    //美工平均耗时统计
    artistGroupTimeCountInfo: state => state.artist_time_statistics.artistGroupTimeCountInfo,
    artistProductLineTimeCountInfo: state => state.artist_time_statistics.artistProductLineTimeCountInfo,

    //美工修图明细
    artworkRepairDetailsInfo: state => state.artwork_repair_details.artworkRepairDetailsInfo,

    //设计组工作报表
    designGroupSummaryReportInfo: state => state.design_work_report.designGroupSummaryReportInfo,
    designGroupDetailsReportInfo: state => state.design_work_report.designGroupDetailsReportInfo,

    //设计组目标完成统计
    designGroupGoalStatisticsInfo: state => state.design_goal_statistics.designGroupGoalStatisticsInfo,

    // 亚马逊权限配置
    amUserConfigInfo: state => state.am_permit_config.amUserConfigInfo,
    amRoleConfigInfo: state => state.am_permit_config.amRoleConfigInfo,

    // 仓库统计报表
    statisticalReport: state => state.statistical_report.statisticalReport,

    //产品权限配置
    productUserConfigInfo: state => state.product_permit_config.productUserConfigInfo,
    productRoleConfigInfo: state => state.product_permit_config.productRoleConfigInfo,

    //产品线销售趋势报表
    productLineSalesTrendInfo: state => state.product_line_trend.productLineSalesTrendInfo,

    //目标完成情况
    targetPerformanceInfo: state => state.target_complete.targetPerformanceInfo,
    targetEntryInfo: state => state.target_complete.targetEntryInfo,

    //订单执行时效
    orderExecutionAgingDayInfo: state => state.order_execution_aging.orderExecutionAgingDayInfo,
    orderExecutionAgingWeekInfo: state => state.order_execution_aging.orderExecutionAgingWeekInfo,
    orderExecutionAgingMonthInfo: state => state.order_execution_aging.orderExecutionAgingMonthInfo,

    //销售统计数据报表
    saleDataReportInfo: state => state.sales_data_report.saleDataReportInfo,

    //开发平均数量统计
    developerGroupNumberCountInfo: state => state.developer_number_statistics.developerGroupNumberCountInfo,
    developerLineNumberCountInfo: state => state.developer_number_statistics.developerLineNumberCountInfo,

    //listing动销柱状报表
    listingMoveBarInfo: state => state.listing_move_bar.listingMoveBarInfo,
    //listing动销数据报表
    listingMoveDataInfo: state => state.listing_move_data.listingMoveDataInfo,

    //B2B订单时效
    b2bOrderAgingDayInfo: state => state.b2b_order_aging.b2bOrderAgingDayInfo,
    b2bOrderAgingWeekInfo: state => state.b2b_order_aging.b2bOrderAgingWeekInfo,
    b2bOrderAgingMonthInfo: state => state.b2b_order_aging.b2bOrderAgingMonthInfo,

    //欠货统计报表
    arrearsCountReportsInfo: state => state.arrears_count_report.arrearsCountReportsInfo,

    //账号健康度统计
    accountHealthCountInfo: state => state.account_health_count.accountHealthCountInfo,

    //海外仓sku统计
    overseaSkuReportInfo: state => state.oversea_sku_count.overseaSkuReportInfo,
    overseaCoreSkuReportInfo: state => state.oversea_sku_count.overseaCoreSkuReportInfo,

    //各成本区间SPU开发数
    costSkuDevelopmentGroupInfo: state => state.cost_development_number_sku.costSkuDevelopmentGroupInfo,
    costSkuDeveloperInfo: state => state.cost_development_number_sku.costSkuDeveloperInfo,
    costSkuDevelopmentTypeInfo: state => state.cost_development_number_sku.costSkuDevelopmentTypeInfo,
    costSkuProductLineInfo: state => state.cost_development_number_sku.costSkuProductLineInfo,

    //B2C订单执行率
    orderRateDayCountInfo: state => state.b2c_order_rate.orderRateDayCountInfo,
    orderRateWeekCountInfo: state => state.b2c_order_rate.orderRateWeekCountInfo,
    orderRateMonthCountInfo: state => state.b2c_order_rate.orderRateMonthCountInfo,

    //采购组别配置
    purchasingUserConfigInfo: state => state.purchasing_group_config.purchasingUserConfigInfo,
    purchasingGroupConfigInfo: state => state.purchasing_group_config.purchasingGroupConfigInfo,

    //国内仓核心sku
    domesticSkuReportInfo: state => state.domestic_sku_count.domesticSkuReportInfo,
    domesticCoreSkuReportInfo: state => state.domestic_sku_count.domesticCoreSkuReportInfo,

    //精品工作报表
    boutiqueSummaryReportInfo: state => state.boutique_work_report.boutiqueSummaryReportInfo,
    boutiqueDetailsReportInfo: state => state.boutique_work_report.boutiqueDetailsReportInfo,

    //海外核心SKU周统计
    overseaSkuWeekReportInfo: state => state.oversea_sku_week_count.overseaSkuWeekReportInfo,
    overseaCoreSkuWeekReportInfo: state => state.oversea_sku_week_count.overseaCoreSkuWeekReportInfo,

    //国内核心SKU周统计
    domesticSkuWeekReportInfo: state => state.domestic_sku_week_count.domesticSkuWeekReportInfo,
    domesticCoreSkuWeekReportInfo: state => state.domestic_sku_week_count.domesticCoreSkuWeekReportInfo,

    //审核数量统计
    infringeGroupSummaryInfo: state => state.infringe_num_count.infringeGroupSummaryInfo,
    infringeGroupDetailsInfo: state => state.infringe_num_count.infringeGroupDetailsInfo,

    //驳回次数统计
    rejectSummaryInfo: state => state.reject_num_count.rejectSummaryInfo,
    rejectDetailsInfo: state => state.reject_num_count.rejectDetailsInfo,
    productLineRejectDetailsInfo: state => state.reject_num_count.productLineRejectDetailsInfo,

    //二次以上驳回统计
    moreRejectSummaryInfo: state => state.more_reject_num_count.moreRejectSummaryInfo,
    moreRejectDetailsInfo: state => state.more_reject_num_count.moreRejectDetailsInfo,

    //阿米巴报表
    amoebaSummaryInfo: state => state.amoeba_report.amoebaSummaryInfo,
    amoebaDetailInfo: state => state.amoeba_report.amoebaDetailInfo,
    amoebaConfigInfo: state => state.amoeba_report.amoebaConfigInfo,

    //亚马逊退单统计
    returnOrderAccountInfo: state => state.amazon_return_order_count.returnOrderAccountInfo,
    returnOrderSiteInfo: state => state.amazon_return_order_count.returnOrderSiteInfo,

    //it费用清单
    serverCostsInfo: state => state.it_expense_list.serverCostsInfo,
    otherCostsInfo: state => state.it_expense_list.otherCostsInfo,
};

export default getters;
