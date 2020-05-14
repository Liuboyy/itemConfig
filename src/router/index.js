import Vue from 'vue';
import Router from 'vue-router';
import Store from '@/store';
import Layout from '../views/HomePage/Layout';
import NotAuthority from '../views/NotAuthority';
import * as storage from '@/utils/storage';
import CONFIG from '../assets/js/config';
import { getUserInfo } from '@/api/login';
import { getAddressModelParams } from '../services/index';
import configFn from './routerConfig';

import HomePage from '../views/HomePage/HomePage';

import SalesVolumeForms from '../views/HomePage/AmOrderCount/SalesVolumeForms'
import FMSalesVolumeForms from '../views/HomePage/AmOrderCount/FMSalesVolumeForms'
import ListingCurve from '../views/HomePage/AmOrderCount/ListingCurve'
import CountriesAcCount from '../views/HomePage/AmOrderCount/CountriesAcCount'
import AccountSalesVolume from '../views/HomePage/AmOrderCount/AccountSalesVolume'
import SalesPerformanceCount from '../views/HomePage/AmOrderCount/SalesPerformanceCount'
import AccountMainParams from '../views/HomePage/AmOrderCount/AccountMainParams'
import PublishedSalesCount from '../views/HomePage/AmOrderCount/PublishedSalesCount'
import KevinAcCount from '../views/HomePage/AmOrderCount/KevinAcCount'
import TargetCompletionCount from '../views/HomePage/AmOrderCount/TargetCompletionCount'
import TobPerformanceCount from '../views/HomePage/AmOrderCount/TobPerformanceCount'
import ListingMoveBar from '../views/HomePage/AmOrderCount/ListingMoveBar'
import ListingMoveCount from '../views/HomePage/AmOrderCount/ListingMoveCount'
import ListingMoveCurve from '../views/HomePage/AmOrderCount/ListingMoveCurve'
import AccountHealthCount from '../views/HomePage/AmOrderCount/AccountHealthCount'
import ListingLinkCount from '../views/HomePage/AmOrderCount/ListingLinkCount'
import AmazonOperatingIndex from '../views/HomePage/AmOrderCount/AmazonOperatingIndex'
// import Demo from '../views/HomePage/Demo'

//开发模块
import DevelopmentGoalStatistics from '../views/HomePage/DevelopmentModule/DevelopmentBasicForm/DevelopmentGoalStatistics'
import CostDevelopmentNumber from '../views/HomePage/DevelopmentModule/DevelopmentBasicForm/CostDevelopmentNumber'
import OrderTimeStatistics from '../views/HomePage/DevelopmentModule/DevelopmentBasicForm/OrderTimeStatistics'
import SupplierArrivalStatistics from '../views/HomePage/DevelopmentModule/DevelopmentBasicForm/SupplierArrivalStatistics'
import DeveloperTimeStatistics from '../views/HomePage/DevelopmentModule/DevelopmentBasicForm/DeveloperTimeStatistics'
import DeveloperNumberStatistics from '../views/HomePage/DevelopmentModule/DevelopmentBasicForm/DeveloperNumberStatistics'
import CostDevelopmentNumberSku from '../views/HomePage/DevelopmentModule/DevelopmentBasicForm/CostDevelopmentNumberSku'

//产品模块
import ProductLineSalesTrend from '../views/HomePage/DevelopmentModule/ProductStatisticsForm/ProductLineSalesTrend'
import ProductSkuPublishCount from '../views/HomePage/DevelopmentModule/ProductStatisticsForm/ProductSkuPublishCount'
import SkuMovingPublishInternal from '../views/HomePage/DevelopmentModule/ProductStatisticsForm/SkuMovingPublishInternal'
import SkuMovingPublishOversea from '../views/HomePage/DevelopmentModule/ProductStatisticsForm/SkuMovingPublishOversea'
import PlatformProductLineCount from '../views/HomePage/DevelopmentModule/ProductStatisticsForm/PlatformProductLineCount'
import ProductLineAchievementCount from '../views/HomePage/DevelopmentModule/ProductStatisticsForm/ProductLineAchievementCount'
import DeveloperAchievementCount from '../views/HomePage/DevelopmentModule/ProductStatisticsForm/DeveloperAchievementCount'
import OverseaSkuCount from '../views/HomePage/ProductModule/OverseaSkuCount'
import OverseaSkuWeekCount from '../views/HomePage/ProductModule/OverseaSkuWeekCount'
import DomesticSkuCount from '../views/HomePage/ProductModule/DomesticSkuCount'
import DomesticSkuWeekCount from '../views/HomePage/ProductModule/DomesticSkuWeekCount'
import SkuSalesVolumeCount from '../views/HomePage/ProductModule/SkuSalesVolumeCount'
import SkuSalesStatistics from '../views/HomePage/ProductModule/SkuSalesStatistics'
import OverseaSkuBaseData from '../views/HomePage/ProductModule/OverseaModule/OverseaSkuBaseData'
import SkuProgressBaseForm from '../views/HomePage/ProductModule/OverseaModule/SkuProgressBaseForm'
import SkuProgressProductLine from '../views/HomePage/ProductModule/OverseaModule/SkuProgressProductLine'
import SkuProgressSkuDimension from '../views/HomePage/ProductModule/OverseaModule/SkuProgressSkuDimension'
import ProductLineProfitCount from '../views/HomePage/ProductModule/ProductLineProfitCount'
import SoutheastAsiaList from '../views/HomePage/SalesModule/SoutheastAsiaList'

//品控模块
import TQEWorkReport from '../views/HomePage/QualityControlModule/TQEBasicReportForm/TQEWorkReport'
import SampleAuditReport from '../views/HomePage/QualityControlModule/TQEBasicReportForm/SampleAuditReport'

//文案模块
import CopyWorkReport from '../views/HomePage/CopyModule/CopyBasicForm/CopyWorkReport'
import CopyEditingReport from '../views/HomePage/CopyModule/CopyBasicForm/CopyEditingReport'
import CopyTimeStatistics from '../views/HomePage/CopyModule/CopyBasicForm/CopyTimeStatistics'
import CopyGoalStatistics from '../views/HomePage/CopyModule/CopyBasicForm/CopyGoalStatistics'

//设计模块
import DesignDepartmentTaskCount from '../views/HomePage/DesignModule/DesignDepartmentTaskCount.vue'
import PhotographWorkReport from '../views/HomePage/DesignModule/PhotoGroupBasicForm/PhotographWorkReport'
import PhotographTimeStatistics from '../views/HomePage/DesignModule/PhotoGroupBasicForm/PhotographTimeStatistics'
import PhotographyDetailsPage from '../views/HomePage/DesignModule/PhotoGroupBasicForm/PhotographyDetailsPage'
import ArtistWorkReport from '../views/HomePage/DesignModule/ArtistBasicForm/ArtistWorkReport'
import ArtistTimeStatistics from '../views/HomePage/DesignModule/ArtistBasicForm/ArtistTimeStatistics'
import ArtworkRepairDetails from '../views/HomePage/DesignModule/ArtistBasicForm/ArtworkRepairDetails'
import DesignGroupWorkReport from '../views/HomePage/DesignModule/DesignGroupBasicForm/DesignGroupWorkReport'
import DesignGroupGoalStatistics from '../views/HomePage/DesignModule/DesignGroupBasicForm/DesignGroupGoalStatistics'
import BoutiqueWorkReport from '../views/HomePage/DesignModule/BoutiqueGroupBasicForm/BoutiqueWorkReport'
import BoutiqueRepairDetails from '../views/HomePage/DesignModule/BoutiqueGroupBasicForm/BoutiqueRepairDetails.vue'
import DesignProductLineCount from '../views/HomePage/DesignModule/DesignProductLineCount.vue'
import DesignRepairDetails from '../views/HomePage/DesignModule/DesignGroupBasicForm/DesignRepairDetails.vue'

// 系统管理
import AmPermitConfig from '../views/HomePage/SysmentMange/AmPermitConfig'
import ProductPermitConfig from '../views/HomePage/SysmentMange/ProductPermitConfig'

//仓库模块
import WarehouseStatisticalReport from '../views/HomePage/WarehouseModule/WarehouseStatisticalReport'
import WarehouseProfitAndLossCount from '../views/HomePage/WarehouseModule/WarehouseProfitAndLossCount'
import StorageTypeCount from '../views/HomePage/WarehouseModule/ReceiptSectionCount/StorageTypeCount'
import PackingCountReport from '../views/HomePage/WarehouseModule/ReceiptSectionCount/PackingCountReport'
import ReceiptTimeCount from '../views/HomePage/WarehouseModule/ReceiptSectionCount/ReceiptTimeCount'
import AverageTimeCount from '../views/HomePage/WarehouseModule/ReceiptSectionCount/AverageTimeCount'
import StorageAbnormalCount from '../views/HomePage/WarehouseModule/ReceiptSectionCount/StorageAbnormalCount'
import InLibraryCount from '../views/HomePage/WarehouseModule/InReportFormsCensus/InLibraryCount'
import InLibraryCountType from '../views/HomePage/WarehouseModule/InReportFormsCensus/InLibraryCountType'
import ProfitLossType from '../views/HomePage/WarehouseModule/InReportFormsCensus/ProfitLossType'
import CargoLocationInfo from '../views/HomePage/WarehouseModule/InReportFormsCensus/CargoLocationInfo'
import IssueOrderStatistics from '../views/HomePage/WarehouseModule/OutReportFormsCensus/IssueOrderStatistics'
import StatisticsOfDeliveryTime from '../views/HomePage/WarehouseModule/OutReportFormsCensus/StatisticsOfDeliveryTime'
import IssueExceptionStatistics from '../views/HomePage/WarehouseModule/OutReportFormsCensus/IssueExceptionStatistics'
import OperationErrorListStatistics from '../views/HomePage/WarehouseModule/OutReportFormsCensus/OperationErrorListStatistics'
import OperationErrorStatistics from '../views/HomePage/WarehouseModule/OutReportFormsCensus/OperationErrorStatistics'
import FinancialInventoryMonitoring from '../views/HomePage/WarehouseModule/InventoryCenter/FinancialInventoryMonitoring'
import FinancialMonitoringRepor from '../views/HomePage/WarehouseModule/InventoryCenter/FinancialMonitoringRepor'


// import FbaOverrunInventory from '../views/HomePage/WarehouseModule/FbaInventoryModule/FbaOverrunInventory'
// import AmazonFbaReplenishment from '../views/HomePage/WarehouseModule/FbaInventoryModule/AmazonFbaReplenishment'
// 异常订单总量
import ExceptionOrder from '../views/HomePage/warehouseModule/ExceptionOrder'
// 超时订单率
import OvertimeOrder from '../views/HomePage/warehouseModule/OvertimeOrder'

//销售模块
import SalesCountCurveReport from '../views/HomePage/SalesModule/SalesCountCurveReport'
import SalesCountDataReport from '../views/HomePage/SalesModule/SalesCountDataReport'
import ArrearsCountReport from '../views/HomePage/SalesModule/ArrearsCountReport'
import ArrearsCountFreezeReport from '../views/HomePage/SalesModule/ArrearsCountFreezeReport'
import PlatformCurveCount from '../views/HomePage/SalesModule/SoutheastSalesModule/PlatformCurveCount'
import PublishTargetCount from '../views/HomePage/SalesModule/AmazonListingAnalysis/PublishTargetCount'
import PlatformAccountSalesCurve from '../views/HomePage/SalesModule/PlatformAccountSalesCurve'
import PlatformAccountSalesCount from '../views/HomePage/SalesModule/PlatformAccountSalesCount'
import PlatformProfitSalesCurve from '../views/HomePage/SalesModule/PlatformProfitSalesCurve'
import PlatformProfitSalesCount from '../views/HomePage/SalesModule/PlatformProfitSalesCount'
import NationalFbaRealTimeInventory from '../views/HomePage/SalesModule/NationalAnalysis/NationalFbaRealTimeInventory'
import NationalFbaInventoryAnalysis from '../views/HomePage/SalesModule/NationalAnalysis/NationalFbaInventoryAnalysis'
import AmazonFbaStockCurve from '../views/HomePage/SalesModule/AmazonFbaCount/AmazonFbaStockCurve'
import AmazonFbaCanSaleCurve from '../views/HomePage/SalesModule/AmazonFbaCount/AmazonFbaCanSaleCurve'
import AmazonFbaStockCount from '../views/HomePage/SalesModule/AmazonFbaCount/AmazonFbaStockCount'
import PlatformDeliveryCost from '../views/HomePage/SalesModule/ProfitCountAnalysis/PlatformDeliveryCost'
import Amazontransactiondata from '../views/HomePage/SalesModule/ProfitCountAnalysis/Amazontransactiondata'
import OverseaPlatformOrderProfit from '../views/HomePage/SalesModule/ProfitCountAnalysis/OverseaPlatformOrderProfit'
import DomesticPlatformOrderProfit from '../views/HomePage/SalesModule/ProfitCountAnalysis/DomesticPlatformOrderProfit'
import EbayListingLinkCount from '../views/HomePage/SalesModule/EbayListingAnalysis/EbayListingLinkCount'
import Abnormalorder from '../views/HomePage/SalesModule/EbayListingAnalysis/Abnormalorder'
import AllPlamListingManage from '../views/HomePage/SalesModule/AllPlamListingManage'
import NationalReturnOrderAnalysis from '../views/HomePage/SalesModule/NationalAnalysis/NationalReturnOrderAnalysis'
import AmazonReturnOrderAnalysis from '../views/HomePage/SalesModule/AmazonReturnOrderAnalysis'
import AmazonReturnOrderCount from '../views/HomePage/SalesModule/AmazonReturnOrderCount/index.vue'
import Smallplatformsales from '../views/HomePage/SalesModule/smallplatformsales'
import WarehouseSalesCurve from '../views/HomePage/SalesModule/WarehouseSalesCurve'
import WarehouseSalesReport from '../views/HomePage/SalesModule/WarehouseSalesReport'
import SiteSalesCurve from '../views/HomePage/SalesModule/SiteSalesCurve'
import SiteSalesReport from '../views/HomePage/SalesModule/SiteSalesReport'
import ProductCostAndRatioCurve from '../views/HomePage/SalesModule/FastSelling/ProductCostAndRatioCurve'
import ProductCostAndRatioCount from '../views/HomePage/SalesModule/FastSelling/ProductCostAndRatioCount'
import FreightRMBCurve from '../views/HomePage/SalesModule/FastSelling/FreightRMBCurve'
import FreightRMBCount from '../views/HomePage/SalesModule/FastSelling/FreightRMBCount'
import CdProductLineSalesReport from '../views/HomePage/SalesModule/SmallPlatformSales/CdProductLineSalesReport'
import CdProductCostCurve from '../views/HomePage/SalesModule/SmallPlatformSales/CdProductCostCurve'
import CdProductCostCount from '../views/HomePage/SalesModule/SmallPlatformSales/CdProductCostCount'
import CdFreightCurve from '../views/HomePage/SalesModule/SmallPlatformSales/CdFreightCurve'
import CdFreightCount from '../views/HomePage/SalesModule/SmallPlatformSales/CdFreightCount'
import CdChannelSpreadCurve from '../views/HomePage/SalesModule/SmallPlatformSales/CdChannelSpreadCurve'
import CdChannelSpreadCount from '../views/HomePage/SalesModule/SmallPlatformSales/CdChannelSpreadCount'
import WalMartProductCostCurve from '../views/HomePage/SalesModule/SmallPlatformSales/WalMartProductCostCurve'
import WalMartProductCostCount from '../views/HomePage/SalesModule/SmallPlatformSales/WalMartProductCostCount'
import WalMartChannelSpreadChart from '../views/HomePage/SalesModule/SmallPlatformSales/WalMartChannelSpreadChart'
import WalMartChannelSpreadCount from '../views/HomePage/SalesModule/SmallPlatformSales/WalMartChannelSpreadCount'
import PlatformsRefundCount from '../views/HomePage/SalesModule/PlatformsRefundCount'
import BrStatementCurve from '../views/HomePage/SalesModule/AmazonOrderCount/BrStatementCurve'
import BrStatementCount from '../views/HomePage/SalesModule/AmazonOrderCount/BrStatementCount'
import SouthEastTargetCount from '../views/HomePage/SalesModule/SoutheastSalesModule/SouthEastTargetCount'



//物流模块
import OrderExecutionAging from '../views/HomePage/LogisticsModule/OrderExecutionAging'
import B2BOrderAging from '../views/HomePage/LogisticsModule/B2BOrderAging'
import B2COrderRate from '../views/HomePage/LogisticsModule/B2COrderRate'
import AfterSalesMonitoring from '../views/HomePage/LogisticsModule/AfterSalesMonitoring'
import LogisticsSkuSizeCheck from '../views/HomePage/LogisticsModule/LogisticsSkuSizeCheck'
import LogisticsAgingCount from '../views/HomePage/LogisticsModule/LogisticsAgingCount'

//计划模块
import DWarehouseStockList from '../views/HomePage/PlanningModule/Domestic/DWarehouseStockList'
import DWarehouseStockCount from '../views/HomePage/PlanningModule/Domestic/DWarehouseStockCount'
import FInventoryMonitoringList from '../views/HomePage/PlanningModule/FBA/FInventoryMonitoringList'
import FInventoryMonitoringCount from '../views/HomePage/PlanningModule/FBA/FInventoryMonitoringCount'
import FVirtualWarehouseList from '../views/HomePage/PlanningModule/FBA/FVirtualWarehouseList'
import FVirtualWarehouseCount from '../views/HomePage/PlanningModule/FBA/FVirtualWarehouseCount'
import FVirtualStockStatistics from '../views/HomePage/PlanningModule/FBA/FVirtualStockStatistics'
import FVirtualStockMonthly from '../views/HomePage/PlanningModule/FBA/FVirtualStockMonthly'
import OWarehouseStockList from '../views/HomePage/PlanningModule/Oversea/OWarehouseStockList'
import OWarehouseStockCount from '../views/HomePage/PlanningModule/Oversea/OWarehouseStockCount'
import Informationfreeze from '../views/HomePage/PlanningModule/Informationfreeze'
import Realtimeinformation from '../views/HomePage/PlanningModule/Realtimeinformation'
import DMrpPurchaseChart from '../views/HomePage/PlanningModule/Domestic/DMrpPurchaseChart'
import DOrderDueTrendCurve from '../views/HomePage/PlanningModule/Domestic/DOrderDueTrendCurve'
import OWarehouseInventoryChart from '../views/HomePage/PlanningModule/Oversea/OWarehouseInventoryChart'
import SalesMonthMark from '../views/HomePage/PlanningModule/SalesMonthlyAnalysis/SalesMonthMark'
import SalesMonthWeightSales from '../views/HomePage/PlanningModule/SalesMonthlyAnalysis/SalesMonthWeightSales'
import SalesMonthAmountSold from '../views/HomePage/PlanningModule/SalesMonthlyAnalysis/SalesMonthAmountSold'
import OWarehouseInventoryMoneyChart from '../views/HomePage/PlanningModule/Oversea/OWarehouseInventoryMoneyChart'
import FWarehouseInventoryChart from '../views/HomePage/PlanningModule/FBA/FWarehouseInventoryChart'
import DWarehouseAllChart from '../views/HomePage/PlanningModule/Domestic/DWarehouseAllChart'
import DWarehouseInventoryChart from '../views/HomePage/PlanningModule/Domestic/DWarehouseInventoryChart'
import DWarehouseSellChart from '../views/HomePage/PlanningModule/Domestic/DWarehouseSellChart'
import SalesMonthFAvailableStock from '../views/HomePage/PlanningModule/SalesMonthlyAnalysis/SalesMonthFAvailableStock'
import SalesMonthFInStockMoney from '../views/HomePage/PlanningModule/SalesMonthlyAnalysis/SalesMonthFInStockMoney'
import FListingBreakdownChart from '../views/HomePage/PlanningModule/FBA/FListingBreakdownChart'
import FListingBreakdownMoneyChart from '../views/HomePage/PlanningModule/FBA/FListingBreakdownMoneyChart'
import FSalesInventoryMoneyChart from '../views/HomePage/PlanningModule/FBA/FSalesInventoryMoneyChart'
import FSalesInventoryRatioChart from '../views/HomePage/PlanningModule/FBA/FSalesInventoryRatioChart'
import FSalesInventoryListingChart from '../views/HomePage/PlanningModule/FBA/FSalesInventoryListingChart'
import FListingBreakdownAffectChart from '../views/HomePage/PlanningModule/FBA/FListingBreakdownAffectChart'
import ProductIdentification from '../views/HomePage/PlanningModule/Productdata/ProductIdentification'
import ProductAvailableStock from '../views/HomePage/PlanningModule/Productdata/ProductAvailableStock'
import ProductWeightingVolume from '../views/HomePage/PlanningModule/Productdata/ProductWeightingVolume'
import ProductLibraryAmount from '../views/HomePage/PlanningModule/Productdata/ProductLibraryAmount'
import ProductIntheAmount from '../views/HomePage/PlanningModule/Productdata/ProductIntheAmount'

//采购模块
import PurchasingGroupConfig from '../views/HomePage/PurchasingModule/PurchasingGroupConfig'
import OrderToPlaceRatio from '../views/HomePage/PurchasingModule/OrderToPlaceRatio/OrderToPlaceRatio.vue'
import OrderFollowReport from '../views/HomePage/PurchasingModule/OrderFollowReport/OrderFollowReport.vue'
import ArrivalTimeDomesticAndFBA from '../views/HomePage/PurchasingModule/ArrivalTimeDomesticAndFBA/ArrivalTimeDomesticAndFBA.vue'
import ArrivalTimeOversea from '../views/HomePage/PurchasingModule/ArrivalTimeOversea/ArrivalTimeOversea.vue'
import VoidedDataAnalysis from '../views/HomePage/PurchasingModule/VoidedDataAnalysis/VoidedDataAnalysis.vue'
import PurchasingDecisionForm from '../views/HomePage/PurchasingModule/PurchasingDecisionForm'


import Test from '../views/HomePage/Test.vue'

//客服模块
import EbayAccountForm from '../views/HomePage/CustomerServiceModule/Ebay/EbayAccountForm'
import BuyerExperienceReport from '../views/HomePage/CustomerServiceModule/Ebay/BuyerExperienceReport'
import SellerScoreForm from '../views/HomePage/CustomerServiceModule/Ebay/SellerScoreForm'
import ServiceIndexInr from '../views/HomePage/CustomerServiceModule/Ebay/ServiceIndexInr'
import ServiceIndexSnad from '../views/HomePage/CustomerServiceModule/Ebay/ServiceIndexSnad'
import NoDisputeCount from '../views/HomePage/CustomerServiceModule/Ebay/NoDisputeCount'

//侵权模块
import InfringeNumCount from '../views/HomePage/InfringementModule/InfringeNumCount'
import ProductLineAgingCount from '../views/HomePage/InfringementModule/ProductLineAgingCount'
import RejectNumCount from '../views/HomePage/InfringementModule/RejectNumCount'
import MoreRejectNumCount from '../views/HomePage/InfringementModule/MoreRejectNumCount'
import ProductLineInfringeCount from '../views/HomePage/InfringementModule/ProductLineInfringeCount'

//禅道模块
import AmoebaReport from '../views/HomePage/ZenTaoModule/AmoebaReport'
import ItExpenseList from '../views/HomePage/ZenTaoModule/ItExpenseList'
import CostStatisticsCurve from '../views/HomePage/ZenTaoModule/CostStatisticsCurve'
import CostStatisticsReport from '../views/HomePage/ZenTaoModule/CostStatisticsReport'

//SQL模块
import DevModuleSQL from '../views/HomePage/SQLModule/DevModuleSQL'
import ProductModuleSQL from '../views/HomePage/SQLModule/ProductModuleSQL'
import QualityControlModuleSQL from '../views/HomePage/SQLModule/QualityControlModuleSQL'
import CopyModuleSQL from '../views/HomePage/SQLModule/CopyModuleSQL'
import DesignModuleSQL from '../views/HomePage/SQLModule/DesignModuleSQL'
import TortModuleSQL from '../views/HomePage/SQLModule/TortModuleSQL'
import SaleModuleSQL from '../views/HomePage/SQLModule/SaleModuleSQL'
import WarehouseModuleSQL from '../views/HomePage/SQLModule/WarehouseModuleSQL'
import LogisticsModuleSQL from '../views/HomePage/SQLModule/LogisticsModuleSQL'
import PlanModuleSQL from '../views/HomePage/SQLModule/PlanModuleSQL'
import CustomerModuleSQL from '../views/HomePage/SQLModule/CustomerModuleSQL'
import PurchaseModuleSQL from '../views/HomePage/SQLModule/PurchaseModuleSQL'
import ZenTaoModuleSQL from '../views/HomePage/SQLModule/ZenTaoModuleSQL'
import SystemModuleSQL from '../views/HomePage/SQLModule/SystemModuleSQL'

//供应商模块
import SupplierGradeReport from '../views/HomePage/SupplierModule/SupplierGradeReport'
import SupplierProductReport from '../views/HomePage/SupplierModule/SupplierProductReport'
import SupplierLossAmountReport from '../views/HomePage/SupplierModule/SupplierLossAmountReport'
import SupplierPurchaseReport from '../views/HomePage/SupplierModule/SupplierPurchaseReport'
import SupplierSalesBusinessReport from '../views/HomePage/SupplierModule/SupplierSalesBusinessReport'
import SupplierPurchaseBusinessReport from '../views/HomePage/SupplierModule/SupplierPurchaseBusinessReport'
import SupplierMoneyBusinessReport from '../views/HomePage/SupplierModule/SupplierMoneyBusinessReport'

//首页
import NewHomePage from '../views/HomePage/NewHomePage.vue'


Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/home',
            name: 'home',
            component: Layout,
            redirect: '/hello',
            children: [
                {
                    path: '/hello',
                    name: 'hello',
                    component: HomePage,
                },
                {
                    path: '/notAuthority',
                    name: '无权限界面',
                    component: NotAuthority
                },
                {
                    path: '/sales_volume_forms',
                    name: '拉单销量曲线',
                    component: SalesVolumeForms
                },
                {
                    path: '/fm_sales_volume_forms',
                    name: '报表销量曲线',
                    component: FMSalesVolumeForms
                },
                {
                    path: '/listing_curve',
                    name: 'listing业绩曲线',
                    component: ListingCurve
                },
                {
                    path: '/countries_ac_count',
                    name: '各国业绩统计',
                    component: CountriesAcCount
                },
                {
                    path: '/account_sales_volume',
                    name: '账号销量统计',
                    component: AccountSalesVolume
                },
                {
                    path: '/publish_sales_count',
                    name: '刊登业绩统计',
                    component: PublishedSalesCount
                },
                {
                    path: '/sales_performance_count',
                    name: '销售业绩统计',
                    component: SalesPerformanceCount
                },
                {
                    path: '/account_main_params',
                    name: '账户重点参数',
                    component: AccountMainParams
                },
                {
                    path: '/development_goal_statistics',
                    name: '开发目标完成统计',
                    component: DevelopmentGoalStatistics
                },
                {
                    path: '/cost_development_number',
                    name: '各成本区间SPU开发数',
                    component: CostDevelopmentNumber
                },
                {
                    path: '/order_time_statistics',
                    name: '跟单平均时效统计',
                    component: OrderTimeStatistics
                },
                {
                    path: '/supplier_arrival_statistics',
                    name: '供应商平均到样时效',
                    component: SupplierArrivalStatistics
                },
                {
                    path: '/developer_time_statistics',
                    name: '开发平均时效统计',
                    component: DeveloperTimeStatistics
                },
                {
                    path: '/tqe_work_report',
                    name: 'TQE工作报表',
                    component: TQEWorkReport
                },
                {
                    path: '/sample_audit_report',
                    name: '样品审核报表',
                    component: SampleAuditReport
                },
                {
                    path: '/copy_work_report',
                    name: '文案工作报表',
                    component: CopyWorkReport
                },
                {
                    path: '/copy_editing_report',
                    name: '文案编辑报表',
                    component: CopyEditingReport
                },
                {
                    path: '/copy_time_statistics',
                    name: '文案平均耗时统计',
                    component: CopyTimeStatistics
                },
                {
                    path: '/copy_goal_statistics',
                    name: '文案目标完成统计',
                    component: CopyGoalStatistics
                },
                {
                    path: '/design_task_count',
                    name: '设计部任务汇总统计',
                    component: DesignDepartmentTaskCount
                },
                {
                    path: '/photograph_work_report',
                    name: '摄影工作报表',
                    component: PhotographWorkReport
                },
                {
                    path: '/photograph_time_statistics',
                    name: '摄影平均耗时统计',
                    component: PhotographTimeStatistics
                },
                {
                    path: '/photograph_details',
                    name: '摄影拍摄明细',
                    component: PhotographyDetailsPage
                },
                {
                    path: '/artist_work_report',
                    name: '美工工作报表',
                    component: ArtistWorkReport
                },
                {
                    path: '/artist_time_statistics',
                    name: '美工平均耗时统计',
                    component: ArtistTimeStatistics
                },
                {
                    path: '/artwork_repair_details',
                    name: '美工修图明细',
                    component: ArtworkRepairDetails
                },
                {
                    path: '/design_work_report',
                    name: '设计工作报表',
                    component: DesignGroupWorkReport
                },
                {
                    path: '/design_goal_statistics',
                    name: '设计目标完成统计',
                    component: DesignGroupGoalStatistics
                },
                {
                    path: '/am_permit_config',
                    name: '亚马逊权限配置',
                    component: AmPermitConfig
                },
                {
                    path: '/sales_count_report',
                    name: '平台销售统计曲线',
                    component: SalesCountCurveReport
                },
                {
                    path: '/kevin_ac_count',
                    name: 'Kevin各国业绩',
                    component: KevinAcCount
                },
               {
                    path: '/product_line_trend',
                    name: '产品线销售趋势报表',
                    component: ProductLineSalesTrend
               },
                {
                    path: '/statistical_report',
                    name: '仓库统计报表',
                    component: WarehouseStatisticalReport
                },
                {
                    path: '/product_permit_config',
                    name: '产品权限配置',
                    component: ProductPermitConfig
                },
                {
                    name: '产品线SKU刊登统计',
                    path: '/product_sku_publish',
                    component: ProductSkuPublishCount
                },
                {
                    name: 'SKU动销刊登(国内)',
                    path: '/sku_publish_internal',
                    component: SkuMovingPublishInternal
                },
                {
                    name: 'SKU动销刊登(海外)',
                    path: '/sku_publish_oversea',
                    component: SkuMovingPublishOversea
                },
                {
                    name: '平台产品线业绩统计',
                    path: '/platform_product_count',
                    component: PlatformProductLineCount
                },
                {
                    name: '产品线业绩统计',
                    path: '/product_achievement_count',
                    component: ProductLineAchievementCount
                },
                {
                    name: '开发员业绩统计',
                    path: '/dev_achievement_count',
                    component: DeveloperAchievementCount
                },
                {
                    name: '目标完成情况',
                    path: '/target_complete',
                    component: TargetCompletionCount
                },
                {
                    name: 'B2B各国业绩',
                    path: '/tob_performance_count',
                    component: TobPerformanceCount
                },
                {
                    name: 'B2C订单时效',
                    path: '/order_execution_aging',
                    component: OrderExecutionAging
                },
                {
                    name: '平台销售统计报表',
                    path: '/sales_data_report',
                    component: SalesCountDataReport
                },
                {
                    path: '/developer_number_statistics',
                    name: '开发平均数量统计',
                    component: DeveloperNumberStatistics
                },
                {
                    name: 'listing动销柱状',
                    path: '/listing_move_bar',
                    component: ListingMoveBar
                },
                {
                    name: 'listing动销统计',
                    path: '/listing_move_data',
                    component: ListingMoveCount
                },
                {
                    name: 'listing动销曲线',
                    path: '/listing_move_curve',
                    component: ListingMoveCurve
                },
                {
                    path: '/b2b_order_aging',
                    name: 'B2B订单时效',
                    component: B2BOrderAging
                },
                {
                    path: '/arrears_count_report',
                    name: '欠货统计报表实时',
                    component: ArrearsCountReport
                },
                {
                    path: '/account_health_count',
                    name: '账号健康度统计',
                    component: AccountHealthCount
                },
                {
                    path: '/platform_curve_count',
                    name: '东南亚平台销售曲线',
                    component: PlatformCurveCount
                },
                {
                    path: '/listing_link_count',
                    name: 'listing链接统计',
                    component: ListingLinkCount
                },
                {
                    path: '/oversea_sku_count',
                    name: '海外核心SKU月统计',
                    component: OverseaSkuCount
                },
                {
                    path: '/arrears_freeze_report',
                    name: '欠货统计报表定格',
                    component: ArrearsCountFreezeReport
                },
                {
                    path: '/sku_sales_count',
                    name: 'SKU销量统计',
                    component: SkuSalesVolumeCount
                },
                {
                    path: '/publish_target_count',
                    name: '刊登目标完成统计',
                    component: PublishTargetCount
                },
                {
                    path: '/amazon_operating_index',
                    name: '亚马逊运营指标',
                    component: AmazonOperatingIndex
                },
                {
                    path: '/warehouse_profit_loss',
                    name: '仓库损益统计',
                    component: WarehouseProfitAndLossCount
                },
                // {
                //     path: '/fba_overrun_inventory',
                //     name: 'FBA超期库存',
                //     component: FbaOverrunInventory
                // },
                // {
                //     path: '/amazon_fba_replenishment',
                //     name: '亚马逊FBA补货',
                //     component: AmazonFbaReplenishment
                // },
                {
                    path: '/sku_sales_statistics',
                    name: 'SKU销售统计',
                    component: SkuSalesStatistics
                },
                {
                    path: '/overtime_order',
                    name: '超时订单率',
                    component: OvertimeOrder
                },
                {
                    path: '/exception_order',
                    name: '异常订单总量',
                    component: ExceptionOrder
                },
                {
                    path: '/oversea_sku_data',
                    name: 'SKU基础数据表',
                    component: OverseaSkuBaseData
                },
                {
                    path: '/platform_account_sale_curve',
                    name: '速卖通账号销售曲线',
                    component: PlatformAccountSalesCurve
                },
                {
                    path: '/platform_account_sale_count',
                    name: '速卖通账号销售统计',
                    component: PlatformAccountSalesCount
                },
                {
                    path: '/platform_account_profit_curve',
                    name: '速卖通账号利润曲线',
                    component: PlatformProfitSalesCurve
                },
                {
                    path: '/platform_account_profit_count',
                    name: '速卖通账号利润统计',
                    component: PlatformProfitSalesCount
                },
            
                {
                    path: '/national_time_inventory',
                    name: '各国FBA实时库存',
                    component: NationalFbaRealTimeInventory
                },
                {
                    path: '/national_inventory_analysis',
                    name: '各国FBA库存分析',
                    component: NationalFbaInventoryAnalysis
                },
                {
                    path: '/amazon_fba_stock_curve',
                    name: 'FBA库存曲线',
                    component: AmazonFbaStockCurve
                },
                {
                    path: '/amazon_fba_sale_curve',
                    name: 'FBA可售曲线',
                    component: AmazonFbaCanSaleCurve
                },
                {
                    path: '/amazon_fba_stock_count',
                    name: 'FBA库存统计',
                    component: AmazonFbaStockCount
                },
                {
                    path: '/d_warehouse_stock_list',
                    name: '国内仓库存列表',
                    component: DWarehouseStockList
                },
                {
                    path: '/d_warehouse_stock_count',
                    name: '国内仓库存统计表',
                    component: DWarehouseStockCount
                },
                {
                    path: '/sku_progress_base',
                    name: 'SKU进度跟进-基础表',
                    component: SkuProgressBaseForm
                },
                {
                    path: '/sku_progress_line',
                    name: 'SKU进度跟进-产品线维度',
                    component: SkuProgressProductLine
                },
                {
                    path: '/sku_progress_sku',
                    name: 'SKU进度跟进-SKU维度',
                    component: SkuProgressSkuDimension
                },
                {
                    path: '/cost_development_number_sku',
                    name: '各成本区间SKU开发数',
                    component: CostDevelopmentNumberSku
                },
                {
                    path: '/platform_delivery_cost',
                    name: '各平台成交费',
                    component: PlatformDeliveryCost
                },
                {
                    path: '/oversea_platform_profit',
                    name: '海外仓各平台订单利润',
                    component: OverseaPlatformOrderProfit
                },
                {
                    path: '/domestic_platform_profit',
                    name: '国内仓各平台订单利润',
                    component: DomesticPlatformOrderProfit
                },
                {
                    path: '/b2c_order_rate',
                    name: 'B2C订单执行率',
                    component: B2COrderRate
                },
                {
                    path: '/ebay_account_form',
                    name: 'Ebay账号表现',
                    component: EbayAccountForm
                },
                {
                    path: '/buyer_experience_report',
                    name: '买家体验报告',
                    component: BuyerExperienceReport
                },
                {
                    path: '/seller_score_form',
                    name: '卖家成绩表',
                    component: SellerScoreForm
                },
                {
                    path: '/service_index_inr',
                    name: '服务指标INR',
                    component: ServiceIndexInr
                },
                {
                    path: '/service_index_snad',
                    name: '服务指标SNAD',
                    component: ServiceIndexSnad
                },
                {
                    path: '/no_dispute_count',
                    name: '未收到纠纷统计',
                    component: NoDisputeCount
                },
                {
                    path: '/f_inventory_control_list',
                    name: 'FBA库存监控列表',
                    component: FInventoryMonitoringList,
                },
                {
                    path: '/f_inventory_control_count',
                    name: 'FBA库存监控统计',
                    component: FInventoryMonitoringCount,
                },
                {
                    path: '/purchasing_group_config',
                    name: '采购组别配置',
                    component: PurchasingGroupConfig,
                },
                {
                    name: '国内核心SKU月统计',
                    path: '/domestic_sku_count',
                    component: DomesticSkuCount,
                },
                {
                    name: '下单达成率',
                    path: '/order_to_ratio',
                    component: OrderToPlaceRatio,
                },
                {
                    name: '精品工作报表',
                    path: '/boutique_work_report',
                    component: BoutiqueWorkReport,
                },
                {
                    name: '订单完结跟进报表',
                    path: '/order_follow_report',
                    component: OrderFollowReport,
                },
                {
                    name: 'Ebaylisting链接统计',
                    path: '/ebay_listing_link',
                    component: EbayListingLinkCount,
                },
                {
                    name: '到货时间分布(国内&FBA)',
                    path: '/arrival_domestic_fba',
                    component: ArrivalTimeDomesticAndFBA,
                },
                {
                    name: '到货时间分布(海外)',
                    path: '/arrival_time_oversea',
                    component: ArrivalTimeOversea,
                },
                {
                    path: '/voided_data_analysis',
                    name: '作废数据分析',
                    component: VoidedDataAnalysis,
                },
                {
                    path: '/after_sales_monitoring',
                    name: '售后渠道监控',
                    component: AfterSalesMonitoring,
                },
                {
                    path: '/all_plam_listing',
                    name: '全平台listing管理',
                    component: AllPlamListingManage,
                },
                {
                    path: '/f_virtual_warehouse_list',
                    name: 'FBA虚拟仓库存列表',
                    component: FVirtualWarehouseList,
                },
                {
                    path: '/f_virtual_warehouse_count',
                    name: 'FBA虚拟仓库存统计表',
                    component:FVirtualWarehouseCount
                },
                {
                    path: '/o_warehouse_list',
                    name: '海外仓库存列表',
                    component: OWarehouseStockList,
                },
                {
                    path: '/o_warehouse_count',
                    name: '海外仓库存统计表',
                    component: OWarehouseStockCount,
                },
                {
                    path: '/infringe_num_count',
                    name: '审核数量统计',
                    component: InfringeNumCount,
                },
                {
                    path: '/reject_num_count',
                    name: '驳回次数统计',
                    component: RejectNumCount,
                },
                {
                    path: '/more_reject_num_count',
                    name: '二次以上驳回统计',
                    component: MoreRejectNumCount,
                },
                {
                    path: '/product_line_infringe_count',
                    name: '产品线侵权统计',
                    component: ProductLineInfringeCount,
                },
                {
                    path: '/product_line_aging_count',
                    name: '产品线平均时效统计',
                    component: ProductLineAgingCount,
                },
                {
                    path: '/purchasing_decision',
                    name: '采购决策报表',
                    component: PurchasingDecisionForm,
                },
                {
                    name: '海外核心SKU周统计',
                    path: '/oversea_sku_week_count',
                    component: OverseaSkuWeekCount,
                },
                {
                    name: '国内核心SKU周统计',
                    path: '/domestic_sku_week_count',
                    component: DomesticSkuWeekCount,
                },
                {
                    name: '亚马逊退单分析',
                    path: '/amazon_return_order_analysis',
                    component: AmazonReturnOrderAnalysis,
                },
                {
                    name: '亚马逊退单统计',
                    path: '/amazon_return_order_count',
                    component: AmazonReturnOrderCount,
                },
                {
                    name: '各国退单分析',
                    path: '/national_return_order_analysis',
                    component: NationalReturnOrderAnalysis,
                },
                {
                    name: '东南亚四平台列表',
                    path: '/southeast_asia_list',
                    component: SoutheastAsiaList,
                },
                {
                    path: '/amoeba_report',
                    name: '阿米巴报表统计',
                    component: AmoebaReport,
                },
                {
                    path: '/dev_module_sql',
                    name: '开发模块_SQL',
                    component: DevModuleSQL,
                },
                {
                    path: '/product_module_sql',
                    name: '产品模块_SQL',
                    component: ProductModuleSQL,
                },
                {
                    path: '/quality_control_module_sql',
                    name: '品控模块_SQL',
                    component: QualityControlModuleSQL,
                },
                {
                    path: '/copy_module_sql',
                    name: '文案模块_SQL',
                    component: CopyModuleSQL,
                },
                {
                    path: '/design_module_sql',
                    name: '设计模块_SQL',
                    component: DesignModuleSQL,
                },
                {
                    path: '/tort_module_sql',
                    name: '侵权模块_SQL',
                    component: TortModuleSQL,
                },
                {
                    path: '/sale_module_sql',
                    name: '销售模块_SQL',
                    component: SaleModuleSQL,
                },
                {
                    path: '/warehouse_module_sql',
                    name: '仓库模块_SQL',
                    component: WarehouseModuleSQL,
                },
                {
                    path: '/logistics_module_sql',
                    name: '物流模块_SQL',
                    component: LogisticsModuleSQL,
                },
                {
                    path: '/plan_module_sql',
                    name: '计划模块_SQL',
                    component: PlanModuleSQL,
                },
                {
                    path: '/customer_module_sql',
                    name: '客服模块_SQL',
                    component: CustomerModuleSQL,
                },
                {
                    path: '/purchase_module_sql',
                    name: '采购模块_SQL',
                    component: PurchaseModuleSQL,
                },
                {
                    path: '/zentao_module_sql',
                    name: '禅道模块_SQL',
                    component: ZenTaoModuleSQL,
                },
                {
                    path: '/system_module_sql',
                    name: '系统管理_SQL',
                    component: SystemModuleSQL,
                },
                {
                    name: '供应商等级报表',
                    path: '/supplier_grade_report',
                    component: SupplierGradeReport,
                },
                {
                    name: '供应商产品报表',
                    path: '/supplier_product_report',
                    component: SupplierProductReport,
                },
                {
                    name: '供应商报损金额报表',
                    path: '/supplier_loss_amount_report',
                    component: SupplierLossAmountReport,
                },
                {
                    name: '供应商采购报表',
                    path: '/supplier_purchase_report',
                    component: SupplierPurchaseReport,
                },
                {
                    name: '供应商销售业务报表',
                    path: '/supplier_sales_business_report',
                    component: SupplierSalesBusinessReport,
                },
                {
                    name: '供应商采购业务报表',
                    path: '/supplier_purchase_business_report',
                    component: SupplierPurchaseBusinessReport,
                },
                {
                    name: '供应商款项业务报表',
                    path: '/supplier_money_business_report',
                    component: SupplierMoneyBusinessReport,
                },
                {
                    path: '/storage_type_count',
                    name: '入库类型统计',
                    component: StorageTypeCount,
                },
                {
                    path: '/packing_count_report',
                    name: '包装统计报表',
                    component: PackingCountReport,
                },
                {
                    path: '/receipt_time_count',
                    name: '收货时效统计',
                    component: ReceiptTimeCount,
                },
                {
                    path: '/average_time_count',
                    name: '平均时效统计',
                    component: AverageTimeCount,
                },
                {
                    path: '/storage_abnormal_count',
                    name: '入库异常统计',
                    component: StorageAbnormalCount,
                },
                {
                    path: '/in_library_count',
                    name: '在库段SKU统计',
                    component: InLibraryCount,
                },
                {
                    path: '/in_library_count_type',
                    name: '库存类型',
                    component: InLibraryCountType,
                },
                {
                    path: '/profit_loss_type',
                    name: '损益类型',
                    component: ProfitLossType,
                },
                {
                    path: '/cargo_location_info',
                    name: '货位信息',
                    component: CargoLocationInfo,
                },
                
                {
                    path: '/issue_order_statistics',
                    name: '出库订单统计',
                    component: IssueOrderStatistics,
                },
                {
                    path: '/statistics_of_delivery_time',
                    name: '出库时效统计',
                    component: StatisticsOfDeliveryTime,
                },
                {
                    path: '/issue_exception_statistics',
                    name: '出库异常统计',
                    component: IssueExceptionStatistics,
                },
                {
                    path: '/operation_error_list_statistics',
                    name: '操作错误列表统计',
                    component: OperationErrorListStatistics,
                },
                {
                    path: '/operation_error_statistics',
                    name: '操作错误统计',
                    component: OperationErrorStatistics,
                },

                {
                    path: '/product_line_profit',
                    name: '产品线毛利统计',
                    component: ProductLineProfitCount,
                },
                {
                    name: '设计部产品线汇总统计',
                    path: '/design_product_line_count',
                    component: DesignProductLineCount,
                },
                {
                    name: '设计修图明细',
                    path: '/design_repair_details',
                    component: DesignRepairDetails,
                },
                {
                    name: '精品修图明细',
                    path: '/boutique_repair_details',
                    component: BoutiqueRepairDetails,
                },
                {
                    path: '/small_platform_sales',
                    name: '小平台销售报表',
                    component: Smallplatformsales
                },
                {

                    name: '仓库销售统计曲线',
                    path: '/warehouse_sales_curve',
                    component: WarehouseSalesCurve,
                },
                {
                    name: '仓库销售统计报表',
                    path: '/warehouse_sales_report',
                    component: WarehouseSalesReport,
                },
                {
                    name: '物流SKU尺寸核对',
                    path: '/logistics_sku_check',
                    component: LogisticsSkuSizeCheck,
                },
                {
                    name: '物流时效统计',
                    path: '/logistics_aging_count',
                    component: LogisticsAgingCount,
                },
                {
                    name: '站点销售统计曲线',
                    path: '/site_sales_curve',
                    component: SiteSalesCurve,
                },
                {
                    name: '站点销售统计报表',
                    path: '/site_sales_report',
                    component: SiteSalesReport,
                },
                {
                    name: '首页',
                    path: '/new_home_page',
                    component: NewHomePage,
                },
                {
                    path: '/financial_inventory_monitoring',
                    name: '库存监控配置',
                    component: FinancialInventoryMonitoring,
                },
                {
                    path: '/test',
                    name: '测试',
                    component: Test
                },
                {
                    path: '/information_freeze',
                    name: '库存综合信息定格',
                    component: Informationfreeze
                },
                {
                    path: '/real_time_information',
                    name: '库存综合信息实时',
                    component: Realtimeinformation
                },
                {
                    path: '/abnormal_order',
                    name: 'Ebay异常订单统计',
                    component: Abnormalorder
                },
                {
                    path: '/amazon_transaction_data',
                    name: '亚马逊交易数据',
                    component: Amazontransactiondata
                },
                {
                    path: '/product_cost_ratio_curve',
                    name: '产品成本CNY及占比曲线',
                    component: ProductCostAndRatioCurve
                },
                {
                    path: '/product_cost_ratio_count',
                    name: '产品成本CNY及占比统计报表',
                    component: ProductCostAndRatioCount
                },
                {
                    path: '/freight_rnb_curve',
                    name: '运费RMB曲线',
                    component: FreightRMBCurve
                },
                {
                    path: '/freight_rnb_count',
                    name: '运费RMB统计报表',
                    component: FreightRMBCount
                },
                {
                    path: '/it_expense_list',
                    name: 'IT费用清单',
                    component: ItExpenseList
                },
                {
                    path: '/financial_monitoring_report',
                    name: '库存监控报表',
                    component: FinancialMonitoringRepor
                },
                {
                    path: '/d_mrp_purchase_chart',
                    name: '国内MRP采购推移图',
                    component: DMrpPurchaseChart
                },
                {
                    path: '/cost_statistics_curve',
                    name: '费用统计曲线',
                    component: CostStatisticsCurve
                },
                {
                    path: '/cost_statistics_report',
                    name: '费用统计报表',
                    component: CostStatisticsReport
                },
                {
                    path: '/d_order_due_trend',
                    name: '国内日订单及欠货趋势',
                    component: DOrderDueTrendCurve
                },
                {
                    path: '/o_warehouse_inventory_chart',
                    name: '海外仓库存数量推移图',
                    component: OWarehouseInventoryChart
                },
                {
                    path: '/cd_product_line_report',
                    name: 'CD产品线销售统计',
                    component: CdProductLineSalesReport
                },
                {
                    path: '/cd_product_cost_curve',
                    name: 'CD产品成本占比曲线',
                    component: CdProductCostCurve
                },
                {
                    path: '/cd_product_cost_count',
                    name: 'CD产品成本占比统计',
                    component: CdProductCostCount
                },
                {
                    path: '/cd_freight_curve',
                    name: 'CD运费占比曲线',
                    component: CdFreightCurve
                },
                {
                    path: '/cd_freight_count',
                    name: 'CD运费占比统计',
                    component: CdFreightCount
                },
                {
                    path: '/cd_channel_spread_curve',
                    name: 'CD渠道发货分布图',
                    component: CdChannelSpreadCurve
                },
                {
                    path: '/cd_channel_spread_count',
                    name: 'CD渠道发货分布统计',
                    component: CdChannelSpreadCount
                },
                {
                    path: '/sales_month_mark',
                    name: '销量标识',
                    component: SalesMonthMark
                },
                {
                    path: '/sales_month_weighted',
                    name: '加权销量',
                    component: SalesMonthWeightSales
                },
                {
                    path: '/sales_month_amount_sold',
                    name: '30日销库金额',
                    component: SalesMonthAmountSold
                },
                {
                    path: '/o_warehouse_inventory_money',
                    name: '海外仓库存金额推移图',
                    component: OWarehouseInventoryMoneyChart
                },
                {
                    path: '/f_warehouse_inventory_chart',
                    name: 'FBA库存推移图',
                    component: FWarehouseInventoryChart
                },
                {
                    path: '/d_warehouse_all_chart',
                    name: '国内仓各项推移图',
                    component: DWarehouseAllChart
                },
                {
                    path: '/d_warehouse_inventory_chart',
                    name: '国内仓库存推移图',
                    component: DWarehouseInventoryChart
                },
                {
                    path: '/d_warehouse_sell_chart',
                    name: '国内仓预计可售卖天数',
                    component: DWarehouseSellChart
                },
                {
                    path: '/sales_month_f_stock',
                    name: 'FBA可用库存',
                    component: SalesMonthFAvailableStock
                },
                {
                    path: '/sales_month_f_money',
                    name: 'FBA在库金额',
                    component: SalesMonthFInStockMoney
                },
                {
                    name: '各平台退款统计',
                    path: '/platforms_refund_count',
                    component: PlatformsRefundCount
                },
                {
                    name: 'w-m产品成本占比曲线',
                    path: '/wm_product_cost_curve',
                    component: WalMartProductCostCurve
                },
                {
                    name: 'w-m产品成本占比统计',
                    path: '/wm_product_cost_count',
                    component: WalMartProductCostCount
                },
                {
                    name: 'w-m渠道发货分布图',
                    path: '/wm_channel_spread_chart',
                    component: WalMartChannelSpreadChart
                },
                {
                    path: '/wm_channel_spread_count',
                    name: 'w-m渠道发货分布统计',
                    component: WalMartChannelSpreadCount
                },
                {
                    path: '/f_virtual_stock_statistics',
                    name: 'FBA断货统计日表',
                    component: FVirtualStockStatistics
                },
                {
                    path: '/f_virtual_stock_monthly',
                    name: 'FBA断货统计月表',
                    component: FVirtualStockMonthly
                },
                {
                    path: '/f_listing_breakdown_chart',
                    name: 'FBA断货计数推移图',
                    component: FListingBreakdownChart
                },
                {
                    path: '/f_listing_breakdown_money_chart',
                    name: 'FBA断货金额推移图',
                    component: FListingBreakdownMoneyChart
                },
                {
                    path: '/f_sales_inventory_money_chart',
                    name: 'FBA模拟销库金额图',
                    component: FSalesInventoryMoneyChart
                },
                {
                    path: '/f_sales_inventory_ratio_chart',
                    name: 'FBA模拟销量占比图',
                    component: FSalesInventoryRatioChart
                },
                {
                    path: '/f_sales_inventory_listing_chart',
                    name: 'FBA模拟listing占比图',
                    component: FSalesInventoryListingChart
                },
                {
                    path: '/f_listing_breakdown_affect_chart',
                    name: 'FBA断货影响推移图',
                    component: FListingBreakdownAffectChart
                },
                {
                    path: '/product_identification',
                    name: '新品销量标识',
                    component: ProductIdentification
                },
                {
                    path: '/product_available_stock',
                    name: '新品FBA可用库存',
                    component: ProductAvailableStock
                },
                {
                    path: '/product_weighting_volume',
                    name: '新品加权销量',
                    component: ProductWeightingVolume
                },
                {
                    path: '/product_library_amount',
                    name: '新品30日销库金额',
                    component: ProductLibraryAmount
                },
                {
                    path: '/product_inthe_amount',
                    name: '新品在库金额',
                    component: ProductIntheAmount
                },
                {
                    name: '报表BR曲线',
                    path: '/br_curve',
                    component: BrStatementCurve
                },
                {
                    name: '报表BR统计',
                    path: '/br_count',
                    component: BrStatementCount
                },
                {
                    name: '东南亚目标完成统计',
                    path: '/south_ease_target',
                    component: SouthEastTargetCount
                },
            ]
        },
        {
            path: '*',
            redirect: '/home'
        }
    ]
});

let isFirstRequset = false;

router.beforeEach((to, from, next) => {
    const path = to.path.replace(/\/$/, '');
    const isLogin = JSON.stringify(Store.getters.loginInfo) !== '{}';

    // 获取当前地址参数
    const queryParams = getAddressModelParams();

    // 判断是否第一次进入
    if (!isLogin && !isFirstRequset) {

        // 如果没有登录信息的话在这里调下初始化接口，查询登录信息后保存
        return new Promise(resolve => {
            getUserInfo({
                access_token: queryParams['access_token']
            }).then(({data}) => {
                if (process.env.NODE_ENV == 'production') {
                    CONFIG.HOME_PATH = data.data.path;
                    CONFIG.BI_PATH = data.data.bi_server_host;
                    CONFIG.BI_PATH2 = data.data.bi_server_host2;
                    CONFIG.JAVA_PATH = data.data.java_server_rest_host;
                }
                Store.commit('SAVE_LOGIN_INFO', data.data);
                Store.commit('SAVE_PERMIT_PATH_INFO', data.data.permissions);
                Store.commit('SAVE_PERMIT_RESOURCE_INFO', data.data.permissions);
                resolve(1);
            });
            // resolve(1);
        }).then((data) => {
            isFirstRequset = true;
            if (data) {

                // 判断是否无资源
                if (Store.getters.permitPath.length < 2) {
                    return next({
                        path: '/notAuthority'
                    })
                }

                // 获取默认菜单索引
                let firstInx = Store.getters.permitPath.indexOf('/development_goal_statistics') > -1 ? configFn.getRouteIndex('/development_goal_statistics') : configFn.getRouteIndex(Store.getters.permitPath[1]);
                //
                // 获取默认菜单信息
                let firstNav = configFn.navJumpFn(firstInx);

                // 跳转
                next({
                    path: firstNav.path
                });

                // 保存到多页签
                Store.commit('SAVE_TAB_LABELS', {
                    path: firstNav.path,
                    name: firstNav.name,
                    index: firstInx
                });

                // 激活菜单
                Store.commit('SAVE_NAV_INDEX', firstInx);
            }
        });
    } else if (isLogin || isFirstRequset) {

        // 权限拦截
        let isAuthority = Store.getters.permitPath;
        if (isAuthority.indexOf(path) === -1 && path !== '/notAuthority') {
            return next({
                path: '/notAuthority'
            })
        }
        // 控制编辑页面跳转
        if (Store.getters.pageEditState[path] && Store.getters.pageEditState[path].path) {
            return next({
                path: Store.getters.pageEditState[path].path
            });
        }

        next();
    } else {
        next();
    }
});

router.afterEach((to, from) => {
    Store.commit('SAVE_BUTTON_CONFIG', to.path.replace(/\/$/, ''));
});

export default router;
