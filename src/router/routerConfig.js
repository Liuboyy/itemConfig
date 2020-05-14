import Store from '@/store'

const config = {
    navList: [
        // {
        //     name: '首页',
        //     path: '/new_home_page',
        //     icon: 'icon-shouye',
        // },
        {
            name: '开发模块',
            path: '',
            icon: 'icon-kaifabu',
            children: [
                {
                    name: '开发基础报表',
                    path: '',
                    children: [
                        {
                            name: '开发目标完成统计',
                            path: '/development_goal_statistics'
                        },
                        {
                            name: '各成本区间SPU开发数',
                            path: '/cost_development_number'
                        },
                        {
                            name: '各成本区间SKU开发数',
                            path: '/cost_development_number_sku'
                        },
                        {
                            name: '跟单平均时效统计',
                            path: '/order_time_statistics'
                        },
                        {
                            name: '供应商平均到样时效',
                            path: '/supplier_arrival_statistics'
                        },
                        {
                            name: '开发平均时效统计',
                            path: '/developer_time_statistics'
                        },
                        {
                            name: '开发平均数量统计',
                            path: '/developer_number_statistics'
                        },
                    ]
                },
            ]
        },
        {
            name: '产品模块',
            path: '',
            icon: 'icon-chanpin',
            children: [
                {
                    name: '产品统计报表',
                    path: '',
                    children: [
                        {
                            name: '产品线销售趋势报表',
                            path: '/product_line_trend'
                        },
                        {
                            name: '产品线SKU刊登统计',
                            path: '/product_sku_publish'
                        },
                        {
                            name: 'SKU动销刊登(国内)',
                            path: '/sku_publish_internal'
                        },
                        {
                            name: 'SKU动销刊登(海外)',
                            path: '/sku_publish_oversea'
                        },
                        {
                            name: '平台产品线业绩统计',
                            path: '/platform_product_count'
                        },
                        {
                            name: '产品线业绩统计',
                            path: '/product_achievement_count'
                        },
                        {
                            name: '开发员业绩统计',
                            path: '/dev_achievement_count'
                        },

                    ]
                },
                {
                    name: '海外仓统计报表',
                    path: '',
                    children: [
                        {
                            path: '/oversea_sku_data',
                            name: 'SKU基础数据表',
                        },
                        {
                            path: '/sku_progress_base',
                            name: 'SKU进度跟进-基础表',
                        },
                        {
                            path: '/sku_progress_sku',
                            name: 'SKU进度跟进-SKU维度',
                        },
                        {
                            path: '/sku_progress_line',
                            name: 'SKU进度跟进-产品线维度',
                        },
                        {
                            name: '海外核心SKU月统计',
                            path: '/oversea_sku_count',
                        },
                        {
                            name: '海外核心SKU周统计',
                            path: '/oversea_sku_week_count',
                        },
                    ]
                },
                {
                    name: '国内仓统计报表',
                    path: '',
                    children: [
                        {
                            name: '国内核心SKU月统计',
                            path: '/domestic_sku_count',
                        },
                        {
                            name: '国内核心SKU周统计',
                            path: '/domestic_sku_week_count',
                        },
                    ]
                },
                {
                    name: 'SKU销量统计',
                    path: '/sku_sales_count',
                },
                {
                    name: 'SKU销售统计',
                    path: '/sku_sales_statistics',
                },
                {
                    path: '/product_line_profit',
                    name: '产品线毛利统计',
                },
            ]
        },
        // {
        //     name: '品控模块',
        //     path: '',
        //     icon: 'icon-pinkong',
        //     children: [
        //         {
        //             name: 'TQE基础报表',
        //             path: '',
        //             children: [
        //                 {
        //                     name: 'TQE工作报表',
        //                     path: '/tqe_work_report'
        //                 },
        //                 {
        //                     name: '样品审核报表',
        //                     path: '/sample_audit_report'
        //                 },
        //             ]
        //         }
        //     ]
        // },
        {
            name: '文案模块',
            path: '',
            icon: 'icon-wenan',
            children: [
                {
                    name: '文案基础报表',
                    path: '',
                    children: [
                        {
                            name: '文案工作报表',
                            path: '/copy_work_report'
                        },
                        {   
                            name: '文案编辑报表',
                            path: '/copy_editing_report'
                        },
                        {
                            name: '文案平均耗时统计',
                            path: '/copy_time_statistics'
                        },
                        {
                            name: '文案目标达成统计',
                            path: '/copy_goal_statistics'
                        },
                    ]
                }
            ]
        },
        {
            name: '设计模块',
            path: '',
            icon: 'icon-sheji',
            children: [
                {
                    name: '设计部任务汇总统计',
                    path: '/design_task_count'
                },
                {
                    name: '设计部产品线汇总统计',
                    path: '/design_product_line_count'
                },
                {
                    name: '摄影组基础报表',
                    path: '',
                    children: [
                        {
                            name: '摄影工作报表',
                            path: '/photograph_work_report'
                        },
                        {
                            name: '摄影平均耗时统计',
                            path: '/photograph_time_statistics'
                        },
                        {
                            name: '摄影拍摄明细',
                            path: '/photograph_details'
                        },
                    ]
                },
                {
                    name: '美工组基础报表',
                    path: '',
                    children: [
                        {
                            name: '美工工作报表',
                            path: '/artist_work_report'
                        },
                        {
                            name: '美工平均耗时统计',
                            path: '/artist_time_statistics'
                        },
                        {
                            name: '美工修图明细',
                            path: '/artwork_repair_details'
                        },
                    ]
                },
                {
                    name: '设计组基础报表',
                    path: '',
                    children: [
                        {
                            name: '设计工作报表',
                            path: '/design_work_report'
                        },
                        {
                            name: '设计目标完成统计',
                            path: '/design_goal_statistics'
                        },
                        {
                            name: '设计修图明细',
                            path: '/design_repair_details'
                        },
                    ]
                },
                {
                    name: '精品组基础报表',
                    path: '',
                    children: [
                        {
                            name: '精品工作报表',
                            path: '/boutique_work_report',
                        },
                        {
                            name: '精品修图明细',
                            path: '/boutique_repair_details'
                        },
                    ]
                },
                // {
                //     name: '亚马逊组基础报表',
                //     path: '',
                //     children: [
                //         {
                //             name: '亚马逊组工作报表',
                //             path: '/home'
                //         },
                //         {
                //             name: '亚马逊组目标达成统计',
                //             path: '/home'
                //         },
                //     ]
                // },
            ]
        },
        {
            name: '侵权模块',
            path: '',
            icon: 'icon-qinquanzhongxin',
            children: [
                {
                    name: '审核数量统计',
                    path: '/infringe_num_count',
                },
                {
                    name: '驳回次数统计',
                    path: '/reject_num_count',
                },
                {
                    name: '二次以上驳回统计',
                    path: '/more_reject_num_count',
                },
                {
                    name: '产品线侵权统计',
                    path: '/product_line_infringe_count',
                },
                {
                    name: '产品线平均时效统计',
                    path: '/product_line_aging_count',
                },
            ]
        },
        {
            name: '供应商模块',
            path: '',
            icon: 'icon-gongyingshangguanli',
            children: [
                {
                    name: '供应商等级报表',
                    path: '/supplier_grade_report',
                },
                {
                    name: '供应商产品报表',
                    path: '/supplier_product_report',
                },
                {
                    name: '供应商采购报表',
                    path: '/supplier_purchase_report',
                },
                {
                    name: '供应商报损金额报表',
                    path: '/supplier_loss_amount_report',
                },
                {
                    name: '供应商销售业务报表',
                    path: '/supplier_sales_business_report',
                },
                {
                    name: '供应商采购业务报表',
                    path: '/supplier_purchase_business_report',
                },
                {
                    name: '供应商款项业务报表',
                    path: '/supplier_money_business_report',
                },
            ]
        },
        {
            name: '销售模块',
            path: '',
            icon: 'icon-xiaoshoumokuai',
            children: [
                {
                    name: '各平台退款统计',
                    path: '/platforms_refund_count',
                },
                {
                    name: '平台销售统计曲线',
                    path: '/sales_count_report',
                },
                {
                    name: '平台销售统计报表',
                    path: '/sales_data_report',
                },
                {
                    name: '仓库销售统计曲线',
                    path: '/warehouse_sales_curve',
                },
                {
                    name: '仓库销售统计报表',
                    path: '/warehouse_sales_report',
                },
                {
                    name: '站点销售统计曲线',
                    path: '/site_sales_curve',
                },
                {
                    name: '站点销售统计报表',
                    path: '/site_sales_report',
                },
                {
                    name: '欠货统计报表实时',
                    path: '/arrears_count_report',
                },
                {
                    name: '欠货统计报表定格',
                    path: '/arrears_freeze_report',
                },
                {
                    name: '全平台listing管理',
                    path: '/all_plam_listing',
                },
                {
                    name: '东南亚四平台列表',
                    path: '/southeast_asia_list',
                },
                {
                    name: '亚马逊订单统计',
                    path: '',
                    children: [
                        {
                            name: '报表销量曲线',
                            path: '/fm_sales_volume_forms'
                        },
                        {
                            name: '报表BR曲线',
                            path: '/br_curve'
                        },
                        {
                            name: '报表BR统计',
                            path: '/br_count'
                        },
                        {
                            name: '拉单销量曲线',
                            path: '/sales_volume_forms'
                        },
                        {
                            path: '/account_health_count',
                            name: '账号健康度统计',
                        },
                        // {
                        //     path: '/kevin_ac_count',
                        //     name: 'Kevin各国业绩',
                        // },
                        {
                            path: '/account_sales_volume',
                            name: '账号销量统计',
                        },
                        {
                            path: '/publish_sales_count',
                            name: '刊登业绩统计',
                        },
                        {
                            path: '/sales_performance_count',
                            name: '销售业绩统计',
                        },
                        {
                            path: '/target_complete',
                            name: '目标完成情况',
                        },
                        {
                            path: '/account_main_params',
                            name: '账户重点参数'
                        },
                        // {
                        //     path: '/amazon_operating_index',
                        //     name: '亚马逊运营指标'
                        // },
                        {
                            path: '/amazon_return_order_analysis',
                            name: '亚马逊退单分析'
                        },
                        {
                            path: '/amazon_return_order_count',
                            name: '亚马逊退单统计'
                        },
                    ]
                },
                {
                    name: '亚马逊FBA统计',
                    path: '',
                    children: [
                        {
                            path: '/amazon_fba_stock_curve',
                            name: 'FBA库存曲线',
                        },
                        {
                            path: '/amazon_fba_sale_curve',
                            name: 'FBA可售曲线',
                        },
                        {
                            path: '/amazon_fba_stock_count',
                            name: 'FBA库存统计',
                        },
                    ]
                },
                {
                    name: '亚马逊各国分析',
                    path: '',
                    icon: '',
                    children: [
                        {
                            name: '各国FBA实时库存',
                            path: '/national_time_inventory'
                        },
                        {
                            name: '各国FBA库存分析',
                            path: '/national_inventory_analysis'
                        },
                        {
                            name: '各国退单分析',
                            path: '/national_return_order_analysis'
                        },
                        {
                            name: '各国业绩统计',
                            path: '/countries_ac_count'
                        },
                        {
                            name: 'B2B各国业绩',
                            path: '/tob_performance_count',
                        },
                    ]
                },
                {
                    name: '亚马逊listing分析',
                    path: '',
                    children: [
                        {
                            name: 'listing业绩曲线',
                            path: '/listing_curve'
                        },
                        {
                            name: 'listing动销曲线',
                            path: '/listing_move_curve',
                        },
                        {
                            name: 'listing动销柱状',
                            path: '/listing_move_bar'
                        },
                        {
                            name: 'listing动销统计',
                            path: '/listing_move_data',
                        },
                        {
                            name: 'listing链接统计',
                            path: '/listing_link_count',
                        },
                        {
                            name: '刊登目标完成统计',
                            path: '/publish_target_count',
                        },
                    ]
                },
                {
                    name: 'Ebay平台销售',
                    path: '',
                    children: [
                        {
                            name: 'Ebaylisting链接统计',
                            path: '/ebay_listing_link',
                        },
                        {
                            name: 'Ebay异常订单统计',
                            path: '/abnormal_order',
                        },
                    ]
                },
                {
                    name: '利润统计分析',
                    path: '',
                    children: [
                        {
                            path: '/oversea_platform_profit',
                            name: '海外仓各平台订单利润',
                        },
                        {
                            path: '/domestic_platform_profit',
                            name: '国内仓各平台订单利润',
                        },
                        {
                            path: '/platform_delivery_cost',
                            name: '各平台成交费',
                        },
                        {
                            path: '/amazon_transaction_data',
                            name: '亚马逊销售明细',
                        },
                    ]
                },
                {
                    name: '东南亚销售',
                    path: '',
                    children: [
                        {
                            path: '/platform_curve_count',
                            name: '东南亚平台销售曲线',
                        },
                        {
                            name: '东南亚目标完成统计',
                            path: '/south_ease_target',
                        },
                    ]
                },
                {
                    name: '速卖通销售',
                    path: '',
                    children: [
                        {
                            path: '/platform_account_sale_curve',
                            name: '速卖通账号销售曲线',
                        },
                        {
                            path: '/platform_account_sale_count',
                            name: '速卖通账号销售统计',
                        },
                        {
                            path: '/platform_account_profit_curve',
                            name: '速卖通账号利润曲线',
                        },
                        {
                            path: '/platform_account_profit_count',
                            name: '速卖通账号利润统计',
                        },
                        {
                            path: '/product_cost_ratio_curve',
                            name: '产品成本及占比曲线',
                        },
                        {
                            path: '/product_cost_ratio_count',
                            name: '产品成本及占比统计',
                        },
                        {
                            path: '/freight_rnb_curve',
                            name: '运费RMB曲线',
                        },
                        {
                            path: '/freight_rnb_count',
                            name: '运费RMB统计',
                        },
                    ]
                },
                {
                    name: '小平台销售',
                    path: '',
                    children: [
                        {
                            path: '/small_platform_sales',
                            name: '小平台销售报表',
                        },
                        {
                            path: '/cd_product_cost_curve',
                            name: 'CD产品成本占比曲线',
                        },
                        {
                            path: '/cd_product_cost_count',
                            name: 'CD产品成本占比统计',
                        },
                        {
                            path: '/cd_freight_curve',
                            name: 'CD运费占比曲线',
                        },
                        {
                            path: '/cd_freight_count',
                            name: 'CD运费占比统计',
                        },
                        {
                            path: '/cd_product_line_report',
                            name: 'CD产品线销售统计',
                        },
                        {
                            path: '/cd_channel_spread_curve',
                            name: 'CD渠道发货分布图',
                        },
                        {
                            path: '/cd_channel_spread_count',
                            name: 'CD渠道发货分布统计',
                        },
                        {
                            path: '/wm_product_cost_curve',
                            name: 'w-m产品成本占比曲线',
                        },
                        {
                            path: '/wm_product_cost_count',
                            name: 'w-m产品成本占比统计',
                        },
                        {
                            path: '/wm_channel_spread_chart',
                            name: 'w-m渠道发货分布图',
                        },
                        {
                            path: '/wm_channel_spread_count',
                            name: 'w-m渠道发货分布统计',
                        }
                    ]
                },
            ]
        },
        {
            name: '仓库模块',
            path: '',
            icon: 'icon-cangkumokuai',
            children: [
                {
                    path: '/statistical_report',
                    name: '仓库统计报表'
                },
                {
                    path: '/warehouse_profit_loss',
                    name: '仓库损益统计',
                },
                {
                    path: '',
                    name: '库存中心',
                    children: [
                        {
                            path: '/financial_inventory_monitoring',
                            name: '库存监控配置'
                        },
                        // {
                        //     path: '/financial_monitoring_report',
                        //     name: '库存监控报表'
                        // },
                    ]
                },
                {
                    path: '',
                    name: '入库段报表统计',
                    children: [
                        {
                            path: '/storage_type_count',
                            name: '入库类型统计'
                        },
                        {
                            path: '/packing_count_report',
                            name: '包装统计报表',
                        },
                        {
                            path: '/receipt_time_count',
                            name: '收货时效统计',
                        },
                        {
                            path: '/average_time_count',
                            name: '平均时效统计',
                        },
                        {
                            path: '/storage_abnormal_count',
                            name: '入库异常统计',
                        },
                    ]
                },
                {
                    path: '',
                    name: '在库段报表统计',
                    children: [
                        {
                            path: '/in_library_count',
                            name: '在库段SKU统计',
                        },
                        {
                            path: '/in_library_count_type',
                            name: '库存类型',
                        },
                        {
                            path: '/profit_loss_type',
                            name: '损益类型',
                        },
                        {
                            path: '/cargo_location_info',
                            name: '货位信息',
                        },

                    ]
                },
                {
                    path: '',
                    name: '出库段报表统计',
                    children: [
                        {
                            path: '/issue_order_statistics',
                            name: '出库订单统计',
                        },
                        {
                            path: '/statistics_of_delivery_time',
                            name: '出库时效统计',
                        },
                        {
                            path: '/issue_exception_statistics',
                            name: '出库异常统计',
                        },
                        {
                            path: '/operation_error_list_statistics',
                            name: '操作错误列表统计',
                        },
                        {
                            path: '/operation_error_statistics',
                            name: '操作错误统计',
                        },
                    ]
                }
                // {
                //     name: 'FBA库存模块',
                //     path: '',
                //     children: [
                //         {
                //             path: '/fba_overrun_inventory',
                //             name: 'FBA超期库存',
                //         },
                //         {
                //             path: '/amazon_fba_replenishment',
                //             name: '亚马逊FBA补货',
                //         },
                //     ]
                // }
            ]
        },
        {
            name: '物流模块',
            path: '',
            icon: 'icon-wuliuguanli',
            children: [
                {
                    path: '/order_execution_aging',
                    name: 'B2C订单时效'
                },
                {
                    path: '/b2b_order_aging',
                    name: 'B2B订单时效'
                },
                {
                    path: '/b2c_order_rate',
                    name: 'B2C订单执行率',
                },
                {
                    path: '/overtime_order',
                    name: '超时订单率',
                },
                {
                    path: '/exception_order',
                    name: '异常订单总量',
                },
                {
                    path: '/after_sales_monitoring',
                    name: '售后渠道监控',
                },
                {
                    name: '物流时效统计',
                    path: '/logistics_aging_count',
                },
                {
                    name: '物流SKU尺寸核对',
                    path: '/logistics_sku_check',
                },
            ]
        },
        {
            name: '计划模块',
            path: '',
            icon: 'icon-jihuamokuai',
            children: [
                {
                    path: '',
                    name: 'FBA',
                    children: [
                        {
                            path: '/f_warehouse_inventory_chart',
                            name: 'FBA库存推移图'
                        },
                        {
                            path: '/f_listing_breakdown_chart',
                            name: 'FBA断货计数推移图'
                        },
                        {
                            path: '/f_listing_breakdown_money_chart',
                            name: 'FBA断货金额推移图'
                        },
                        {
                            path: '/f_listing_breakdown_affect_chart',
                            name: 'FBA断货影响推移图'
                        },
                        {
                            path: '/f_sales_inventory_money_chart',
                            name: 'FBA模拟销库金额图'
                        },
                        {
                            path: '/f_sales_inventory_ratio_chart',
                            name: 'FBA模拟销量占比图'
                        },
                        {
                            path: '/f_sales_inventory_listing_chart',
                            name: 'FBA模拟listing占比图'
                        },
                        {
                            path: '/f_inventory_control_list',
                            name: 'FBA库存监控列表',
                        },
                        {
                            path: '/f_inventory_control_count',
                            name: 'FBA库存监控统计',
                        },
                        {
                            path: '/f_virtual_warehouse_list',
                            name: 'FBA虚拟仓库存列表',
                        },
                        {
                            path: '/f_virtual_warehouse_count',
                            name: 'FBA虚拟仓库存统计表',
                        },
                        {
                            path: '/f_virtual_stock_statistics',
                            name: 'FBA断货统计日表',
                        },
                        {
                            path: '/f_virtual_stock_monthly',
                            name: 'FBA断货统计月表',
                        },
                    ]
                },
                {
                    path: '',
                    name: '海外仓',
                    children: [
                        {
                            path: '/o_warehouse_list',
                            name: '海外仓库存列表',
                        },
                        {
                            path: '/o_warehouse_count',
                            name: '海外仓库存统计表',
                        },
                        {
                            path: '/o_warehouse_inventory_chart',
                            name: '海外仓库存数量推移图'
                        },
                        {
                            path: '/o_warehouse_inventory_money',
                            name: '海外仓库存金额推移图'
                        },
                    ]
                },
                {
                    path: '',
                    name: '国内仓',
                    children: [
                        {
                            path: '/d_warehouse_stock_list',
                            name: '国内仓库存列表',
                        },
                        {
                            path: '/d_warehouse_stock_count',
                            name: '国内仓库存统计表',
                        },
                        {
                            path: '/d_warehouse_all_chart',
                            name: '国内仓各项推移图'
                        },
                        {
                            path: '/d_warehouse_inventory_chart',
                            name: '国内仓库存推移图'
                        },
                        {
                            path: '/d_warehouse_sell_chart',
                            name: '国内仓预计可售卖天数'
                        },
                        {
                            path: '/d_mrp_purchase_chart',
                            name: '国内MRP采购推移图'
                        },
                        {
                            path: '/d_order_due_trend',
                            name: '国内日订单及欠货趋势'
                        },
                    ]
                },
                {
                    name: '销量库存月循分析',
                    path: '',
                    children: [
                        {
                            path: '/sales_month_mark',
                            name: '销量标识',
                        },
                        {
                            path: '/sales_month_weighted',
                            name: '加权销量',
                        },
                        {
                            path: '/sales_month_amount_sold',
                            name: '30日销库金额',
                        },
                        {
                            path: '/sales_month_f_stock',
                            name: 'FBA可用库存',
                        },
                        {
                            path: '/sales_month_f_money',
                            name: 'FBA在库金额',
                        }
                    ]
                },
                {
                    name: 'FBA新品数据分析',
                    path: '',
                    children: [
                        {
                            path: '/product_identification',
                            name: '销量标识',
                        },
                        {
                            path: '/product_available_stock',
                            name: 'FBA可用库存',
                        },
                        {
                            path: '/product_weighting_volume',
                            name: '加权销量',
                        },
                        {
                            path: '/product_library_amount',
                            name: '30日销库金额',
                        },
                        {
                            path: '/product_inthe_amount',
                            name: '在库金额',
                        },
                    ]
                },
                {
                    path: '/information_freeze',
                    name: '库存综合信息定格',
                },
                {
                    path: '/real_time_information',
                    name: '库存综合信息实时',
                },
            ]
        },
        {
            name: '客服模块',
            path: '',
            icon: 'icon-kefumokuai1',
            children: [
                {
                    path: '',
                    name: 'Ebay',
                    children: [
                        {
                            path: '/ebay_account_form',
                            name: 'Ebay账号表现',
                        },
                        {
                            path: '/buyer_experience_report',
                            name: '买家体验报告',
                        },
                        {
                            path: '/seller_score_form',
                            name: '卖家成绩表',
                        },
                        {
                            path: '/service_index_inr',
                            name: '服务指标INR',
                        },
                        {
                            path: '/service_index_snad',
                            name: '服务指标SNAD',
                        },
                        // {
                        //     path: '/no_dispute_count',
                        //     name: '未收到纠纷统计',
                        // },
                    ]
                },
            ]
        },
        {
            name: '采购模块',
            path: '',
            icon: 'icon-caigouguanli',
            children: [
                {
                    path: '/purchasing_decision',
                    name: '采购决策报表',
                },
                {
                    path: '/purchasing_group_config',
                    name: '采购组别配置',
                },
                {
                    path: '/order_to_ratio',
                    name: '下单达成率',
                },
                {
                    path: '/voided_data_analysis',
                    name: '作废数据分析',
                },
                {
                    path: '/order_follow_report',
                    name: '订单完结跟进报表',
                },
                {
                    path: '/arrival_time_oversea',
                    name: '到货时间分布(海外)',
                },
                {
                    path: '/arrival_domestic_fba',
                    name: '到货时间分布(国内&FBA)',
                },
            ]
        },
        {
            name: 'IT模块',
            path: '',
            icon: 'icon-ITmokuai',
            children: [
                {
                    path: '/amoeba_report',
                    name: '阿米巴报表统计'
                },
                {
                    path: '/it_expense_list',
                    name: 'IT费用清单',
                },
                {
                    path: '/cost_statistics_curve',
                    name: '费用统计曲线',
                },
                {
                    path: '/cost_statistics_report',
                    name: '费用统计报表',
                },
            ]
        },
        {
            name: '系统管理',
            path: '',
            icon: 'icon-xitongpeizhi',
            children: [
                {
                    path: '/am_permit_config',
                    name: '亚马逊权限配置'
                },
                {
                    path: '/product_permit_config',
                    name: '产品权限配置',
                },
            ]
        },
        {
            name: 'SQL模块',
            path: '',
            icon: 'icon-caozuoguanli',
            children: [
                {
                    path: '/dev_module_sql',
                    name: '开发模块_SQL'
                },
                {
                    path: '/product_module_sql',
                    name: '产品模块_SQL'
                },
                {
                    path: '/quality_control_module_sql',
                    name: '品控模块_SQL'
                },
                {
                    path: '/copy_module_sql',
                    name: '文案模块_SQL'
                },
                {
                    path: '/design_module_sql',
                    name: '设计模块_SQL'
                },
                {
                    path: '/tort_module_sql',
                    name: '侵权模块_SQL'
                },
                {
                    path: '/sale_module_sql',
                    name: '销售模块_SQL'
                },
                {
                    path: '/warehouse_module_sql',
                    name: '仓库模块_SQL'
                },
                {
                    path: '/logistics_module_sql',
                    name: '物流模块_SQL'
                },
                {
                    path: '/plan_module_sql',
                    name: '计划模块_SQL'
                },
                {
                    path: '/customer_module_sql',
                    name: '客服模块_SQL'
                },
                {
                    path: '/purchase_module_sql',
                    name: '采购模块_SQL'
                },
                {
                    path: '/zentao_module_sql',
                    name: '禅道模块_SQL'
                },
                {
                    path: '/system_module_sql',
                    name: '系统管理_SQL'
                },
            ]
        },
        // {
        //     name: '测试菜单',
        //     path: '',
        //     icon: 'icon-xitongpeizhi',
        //     children: [
        //         {
        //             path: '/test',
        //             name: '测试'
        //         },
        //     ]
        // }
    ]
};

const configFn = {
    navJumpFn (inx) {
        const configNav = this.getRouteConfig()
        let inxArr = inx.split('-')
        let to = {}

        // 处理子页面多页签
        if (inx.indexOf('/') > -1) {
            return {path: inx, name: ''}
        }

        switch (inxArr.length) {
            case 1:
                to = configNav[inxArr[0] - 1]
                break
            case 2:
                to = configNav[inxArr[0] - 1].children[inxArr[1] - 1]
                break
            case 3:
                to = configNav[inxArr[0] - 1].children[inxArr[1] - 1].children[inxArr[2] - 1]
                break
            default:
                return {path: inx}
        }
        return to
    },
    getRouteIndex (path) {
        const configNav = this.getRouteConfig()
        let callBack = function (arr) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].path === path) {
                    return {
                        isTrue: 1,
                        index: i + 1
                    }
                }

                if (arr[i].children && arr[i].children.length) {
                    let backInfo = callBack(arr[i].children)
                    if (backInfo && backInfo.isTrue) {
                        return {
                            isTrue: 1,
                            index: `${i + 1}-${backInfo.index}`
                        }
                    }
                }
            }
        }

        let backInfo = callBack(configNav)
        return backInfo && backInfo.isTrue && backInfo.index
    },
    getRouteConfig () {
        try {

            // 禁用权限
            const configNav = [...config.navList]
            const permit = Store.getters.permitPath
            let navList = []

            // 递归函数
            let callBack = function (children) {

                let itemList = []
                for (let i = 0; i < children.length; i++) {
                    const item = children[i]
                    let itemArea = {...item}

                    if (!item.path && item.children && item.children.length) {
                        const backArr = callBack(item.children)
                        if (backArr.length) {
                            itemArea.children = backArr
                            itemList.push(itemArea)
                        }
                    } else if (permit.indexOf(item.path) > -1) {
                        itemList.push(itemArea)
                    }
                }
                return [...itemList]
            }

            for (let i = 0; i < configNav.length; i++) {
                const item = configNav[i]
                let itemArea = {...item}

                if (item.children && item.children.length) {
                    const backArr = callBack(item.children)
                    if (backArr.length) {
                        itemArea.children = backArr
                        navList.push(itemArea)
                    }
                } else if (permit.indexOf(item.path) > -1) {
                    navList.push(itemArea)
                }
            }
            return [...navList]
        } catch (e) {
            console.log(e)
        }
        return config.navList
    }

}

export default configFn
