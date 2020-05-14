
import Store from '@/store'

const config = {
    // supplier_create_list: {
    //     name: 'moduleName',
    //     buttonList: {
    //         create: {
    //             name: 'resourceName',
    //             value: 'create',
    //             method: 'resourceMethod',
    //             type: '',
    //             action: function (vm, fnName) {
    //                 console.log(this);
    //                 // 执行方法
    //                 vm[fnName]();
    //             },
    //             permit() {
    //                 // 权限拦截
    //                 const permitResource = [...Store.getters.permitResource];
    //                 return permitResource.supplier_create_list && permitResource.supplier_create_list[this.value];
    //             }
    //         },
    //     }
    // },
    supplier_arrival_statistics: {
        name: '供应商平均到样时效',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_arrival_statistics && permitResource.supplier_arrival_statistics[this.value];
                }
            },
            preview: {
                name: '查看',
                value: 'preview',
                method: 'handlePreviewInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_arrival_statistics && permitResource.supplier_arrival_statistics[this.value];
                }
            },
        }
    },
    copy_goal_statistics: {
        name: '文案目标达成统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.copy_goal_statistics && permitResource.copy_goal_statistics[this.value];
                }
            },
            preview: {
                name: '员工姓名',
                value: 'preview',
                method: 'handleUserName',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.copy_goal_statistics && permitResource.copy_goal_statistics[this.value];
                }
            },
        }
    },
    abnormal_order: {
        name: 'Ebay异常订单统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.copy_goal_statistics && permitResource.copy_goal_statistics[this.value];
                }
            },
        }
    },
    photograph_work_report: {
        name: '摄影工作报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.photograph_work_report && permitResource.photograph_work_report[this.value];
                }
            },
            overtime_num: {
                name: '超时数',
                value: 'overtime_num',
                method: 'handleSpuDetailsInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.photograph_work_report && permitResource.photograph_work_report[this.value];
                }
            },
            reject_num: {
                name: '返工数',
                value: 'reject_num',
                method: 'handleSpuDetailsInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.photograph_work_report && permitResource.photograph_work_report[this.value];
                }
            },
        },
    },
    artist_work_report: {
        name: '美工工作报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.artist_work_report && permitResource.artist_work_report[this.value];
                }
            },
            overtime_num: {
                name: '超时数',
                value: 'overtime_num',
                method: 'handleSpuDetailsInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.artist_work_report && permitResource.artist_work_report[this.value];
                }
            },
            reject_num: {
                name: '返工数',
                value: 'reject_num',
                method: 'handleSpuDetailsInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.artist_work_report && permitResource.artist_work_report[this.value];
                }
            },
        },
    },
    design_work_report: {
        name: '设计组工作报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.design_work_report && permitResource.design_work_report[this.value];
                }
            },
            pic_num: {
                name: '图片张数明细',
                value: 'pic_num',
                method: 'handlePictureNumberInfo',
                type: 'text',
                icon: 'icon-tupianzhangshumingxi icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.design_work_report && permitResource.design_work_report[this.value];
                }
            },
            overtime_num: {
                name: '超时数',
                value: 'overtime_num',
                method: 'handleSpuDetailsInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.design_work_report && permitResource.design_work_report[this.value];
                }
            },
            reject_num: {
                name: '返工数',
                    value: 'reject_num',
                method: 'handleSpuDetailsInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.design_work_report && permitResource.design_work_report[this.value];
                }
            },
            preview: {
                name: '员工姓名',
                value: 'preview',
                method: 'handleStaffDetailInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.design_work_report && permitResource.design_work_report[this.value];
                }
            },
        },
    },
    account_sales_volume: {
        name: '账号销量统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.account_sales_volume && permitResource.account_sales_volume[this.value];
                }
            },
        }
    },
    publish_sales_count: {
        name: '刊登业绩统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.publish_sales_count && permitResource.publish_sales_count[this.value];
                }
            },
        }
    },
    sales_performance_count: {
        name: '销售业绩统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sales_performance_count && permitResource.sales_performance_count[this.value];
                }
            },
            ranking: {
                name: '业绩排名统计',
                value: 'ranking',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sales_performance_count && permitResource.sales_performance_count[this.value];
                }
            },
            sales: {
                name: '销售额统计',
                value: 'sales',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sales_performance_count && permitResource.sales_performance_count[this.value];
                }
            },
            orders: {
                name: '订单量统计',
                value: 'orders',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sales_performance_count && permitResource.sales_performance_count[this.value];
                }
            },
        }
    },
    account_main_params: {
        name: '账户重点参数',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.account_main_params && permitResource.account_main_params[this.value];
                }
            },
        }
    },
    artwork_repair_details: {
        name: '美工修图明细',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.artwork_repair_details && permitResource.artwork_repair_details[this.value];
                }
            },
        }
    },
    statistical_report: {
        name: '仓库统计报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.statistical_report && permitResource.statistical_report[this.value];
                }
            },
            sku: {
                name: '全部sku',
                value: 'sku',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.statistical_report && permitResource.statistical_report[this.value];
                }
            },
        }
    },
    sales_data_report: {
        name: '销售统计数据报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sales_data_report && permitResource.sales_data_report[this.value];
                }
            },
            kevin: {
                name: '排除Kevin',
                value: 'kevin',
                method: '',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sales_data_report && permitResource.sales_data_report[this.value];
                }
            },
        }
    },
    target_complete: {
        name: '目标完成情况',
        buttonList: {
            team_report: {
                name: '团队报表',
                value: 'team_report',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.target_complete && permitResource.target_complete[this.value];
                }
            },
            group_report: {
                name: '小组报表',
                value: 'group_report',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.target_complete && permitResource.target_complete[this.value];
                }
            },
            entry_report: {
                name: '目标录入',
                value: 'entry_report',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.target_complete && permitResource.target_complete[this.value];
                }
            },
        }
    },
    order_execution_aging: {
        name: 'B2C订单时效',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.order_execution_aging && permitResource.order_execution_aging[this.value];
                }
            },
            details_export: {
                name: '明细导出',
                value: 'details_export',
                method: 'handleDetailsExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.order_execution_aging && permitResource.order_execution_aging[this.value];
                }
            },
        }
    },
    b2b_order_aging: {
        name: 'B2B订单时效',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.b2b_order_aging && permitResource.b2b_order_aging[this.value];
                }
            },
            details_export: {
                name: '明细导出',
                value: 'details_export',
                method: 'handleDetailsExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.b2b_order_aging && permitResource.b2b_order_aging[this.value];
                }
            },
        }
    },
    arrears_count_report: {
        name: '欠货统计报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.arrears_count_report && permitResource.arrears_count_report[this.value];
                }
            },
        }
    },
    account_health_count: {
        name: '账号健康度统计',
        buttonList: {
            details: {
                name: '查看明细',
                value: 'details',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.account_health_count && permitResource.account_health_count[this.value];
                }
            },
        }
    },
    oversea_sku_count: {
        name: '海外仓SKU统计',
        buttonList: {
            details: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.oversea_sku_count && permitResource.oversea_sku_count[this.value];
                }
            },
        }
    },
    arrears_freeze_report: {
        name: '欠货统计报表定格',
        buttonList: {
            details: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.arrears_freeze_report && permitResource.arrears_freeze_report[this.value];
                }
            },
        }
    },
    sku_sales_count: {
        name: 'SKU销量统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sku_sales_count && permitResource.sku_sales_count[this.value];
                }
            },
        }
    },
    in_library_count: {
        name: '在库段SKU统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.in_library_count && permitResource.in_library_count[this.value];
                }
            },
        }
    },
    publish_target_count: {
        name: 'listing目标完成统计',
        buttonList: {
            enter: {
                name: '目标录入',
                value: 'enter',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.publish_target_count && permitResource.publish_target_count[this.value];
                }
            },
            count: {
                name: '目标完成统计',
                value: 'count',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.publish_target_count && permitResource.publish_target_count[this.value];
                }
            },
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.publish_target_count && permitResource.publish_target_count[this.value];
                }
            },
        }
    },
    warehouse_profit_loss: {
        name: '仓库损益统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.warehouse_profit_loss && permitResource.warehouse_profit_loss[this.value];
                }
            },
            count: {
                name: '损益统计',
                value: 'count',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.warehouse_profit_loss && permitResource.warehouse_profit_loss[this.value];
                }
            },
            details: {
                name: '损益明细统计',
                value: 'details',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.warehouse_profit_loss && permitResource.warehouse_profit_loss[this.value];
                }
            },
        }
    },
    copy_work_report: {
        name: '文案工作报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.copy_work_report && permitResource.copy_work_report[this.value];
                }
            },
        }
    },
    copy_time_statistics: {
        name: '文案平均耗时统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.copy_time_statistics && permitResource.copy_time_statistics[this.value];
                }
            },
        }
    },
    sku_sales_statistics: {
        name: 'SKU销售统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sku_sales_statistics && permitResource.sku_sales_statistics[this.value];
                }
            },
            sku: {
                name: 'SKU维度',
                value: 'sku',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sku_sales_statistics && permitResource.sku_sales_statistics[this.value];
                }
            },
            product_line: {
                name: '产品线维度',
                value: 'product_line',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sku_sales_statistics && permitResource.sku_sales_statistics[this.value];
                }
            },
        }
    },
    oversea_sku_data: {
        name: '海外仓SKU基础数据',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.oversea_sku_data && permitResource.oversea_sku_data[this.value];
                }
            },
        }
    },
    artist_time_statistics: {
        name: '美工平均耗时统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.artist_time_statistics && permitResource.artist_time_statistics[this.value];
                }
            },
        }
    },
    platform_account_sale_count: {
        name: '平台账号销售统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.platform_account_sale_count && permitResource.platform_account_sale_count[this.value];
                }
            },
        }
    },
    platform_account_profit_count: {
        name: '平台账号利润统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.platform_account_profit_count && permitResource.platform_account_profit_count[this.value];
                }
            },
        }
    },
    d_warehouse_stock_list: {
        name: '国内仓库存列表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.d_warehouse_stock_list && permitResource.d_warehouse_stock_list[this.value];
                }
            },
            edit: {
                name: '编辑显示数据',
                value: 'edit',
                method: 'handleEditTitleInfo',
                type: 'text',
                icon: 'icon-bianjihexiugai icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.d_warehouse_stock_list && permitResource.d_warehouse_stock_list[this.value];
                }
            },
        }
    },
    d_warehouse_stock_count: {
        name: '国内仓库存统计表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.d_warehouse_stock_count && permitResource.d_warehouse_stock_count[this.value];
                }
            },
            edit: {
                name: '编辑显示数据',
                value: 'edit',
                method: 'handleEditTitleInfo',
                type: 'text',
                icon: 'icon-bianjihexiugai icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.d_warehouse_stock_count && permitResource.d_warehouse_stock_count[this.value];
                }
            },
        }
    },
    amazon_fba_stock_count: {
        name: 'FBA库存统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.amazon_fba_stock_count && permitResource.amazon_fba_stock_count[this.value];
                }
            },
        }
    },
    sku_progress_base: {
        name: 'SKU进度跟进-基础表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sku_progress_base && permitResource.sku_progress_base[this.value];
                }
            },
        }
    },
    sku_progress_line: {
        name: 'SKU进度跟进-产品线维度',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sku_progress_line && permitResource.sku_progress_line[this.value];
                }
            },
        }
    },
    sku_progress_sku: {
        name: 'SKU进度跟进-SKU维度',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sku_progress_sku && permitResource.sku_progress_sku[this.value];
                }
            },
        }
    },
    platform_delivery_cost: {
        name: '各平台成交费',
        buttonList: {
            import: {
                name: '导入',
                value: 'import',
                method: 'handleImportInfo',
                type: 'text',
                icon: 'icon-daoru icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.platform_delivery_cost && permitResource.platform_delivery_cost[this.value];
                }
            },
            export: {
                name: '导出失败数据',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.platform_delivery_cost && permitResource.platform_delivery_cost[this.value];
                }
            },
            delete: {
                name: '批量删除',
                value: 'delete',
                method: 'handleDeleteInfo',
                type: 'text',
                icon: 'icon-piliangshanchu icon_pink',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.platform_delivery_cost && permitResource.platform_delivery_cost[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.platform_delivery_cost && permitResource.platform_delivery_cost[this.value];
                }
            },
        }
    },
    oversea_platform_profit: {
        name: '海外仓各平台订单利润',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.oversea_platform_profit && permitResource.oversea_platform_profit[this.value];
                }
            },
            modify: {
                name: '修改结算月份',
                value: 'modify',
                method: 'handleModifySettleInfo',
                type: 'text',
                icon: 'icon-bianjihexiugai icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.oversea_platform_profit && permitResource.oversea_platform_profit[this.value];
                }
            },
            remarks: {
                name: '添加备注',
                value: 'remarks',
                method: 'handleRemarksInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.oversea_platform_profit && permitResource.oversea_platform_profit[this.value];
                }
            },
            batch_modify: {
                name: '修改结算月份和添加备注',
                value: 'batch_modify',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.oversea_platform_profit && permitResource.oversea_platform_profit[this.value];
                }
            },
        }
    },
    domestic_platform_profit: {
        name: '国内仓各平台订单利润',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.domestic_platform_profit && permitResource.domestic_platform_profit[this.value];
                }
            },
            modify: {
                name: '修改结算月份',
                value: 'modify',
                method: 'handleModifySettleInfo',
                type: 'text',
                icon: 'icon-bianjihexiugai icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.domestic_platform_profit && permitResource.domestic_platform_profit[this.value];
                }
            },
            remarks: {
                name: '添加备注',
                value: 'remarks',
                method: 'handleRemarksInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.domestic_platform_profit && permitResource.domestic_platform_profit[this.value];
                }
            },
            batch_modify: {
                name: '修改结算月份和添加备注',
                value: 'batch_modify',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.domestic_platform_profit && permitResource.domestic_platform_profit[this.value];
                }
            },
        }
    },
    b2c_order_rate: {
        name: 'B2C订单执行率',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.b2c_order_rate && permitResource.b2c_order_rate[this.value];
                }
            },
            details_export: {
                name: '明细导出',
                value: 'details_export',
                method: 'handleDetailsExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.b2c_order_rate && permitResource.b2c_order_rate[this.value];
                }
            },
        }
    },
    ebay_account_form: {
        name: 'Ebay账号表现',
        buttonList: {
            export_1: {
                name: '导出基本数据',
                value: 'export_1',
                method: 'handleExportBaseInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.ebay_account_form && permitResource.ebay_account_form[this.value];
                }
            },
            export_2: {
                name: '导出SpeedPAK物流管理方案数据',
                value: 'export_2',
                method: 'handleExportSpeedPakInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.ebay_account_form && permitResource.ebay_account_form[this.value];
                }
            },
            export_3: {
                name: '导出买家选择SpeedPAK物流选项数据',
                value: 'export_3',
                method: 'handleExportSelectSpeedPakInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.ebay_account_form && permitResource.ebay_account_form[this.value];
                }
            },
            export_4: {
                name: '导出海外仓服务标准表现',
                value: 'export_4',
                method: 'handleExportOverseaInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.ebay_account_form && permitResource.ebay_account_form[this.value];
                }
            },
            export_7: {
                name: '导出非货运表现问题刊登',
                value: 'export_7',
                method: 'handleExportUnFreightInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.ebay_account_form && permitResource.ebay_account_form[this.value];
                }
            },
            export_5: {
                name: '导出货运表现问题刊登',
                value: 'export_5',
                method: 'handleExportFreightInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.ebay_account_form && permitResource.ebay_account_form[this.value];
                }
            },
            export_6: {
                name: '导出待处理刊登',
                value: 'export_6',
                method: 'handleExportDealWithInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.ebay_account_form && permitResource.ebay_account_form[this.value];
                }
            },
        }
    },
    f_inventory_control_list: {
        name: 'FBA库存监控列表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.f_inventory_control_list && permitResource.f_inventory_control_list[this.value];
                }
            },
        }
    },
    f_inventory_control_count: {
        name: 'FBA库存监控统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.f_inventory_control_count && permitResource.f_inventory_control_count[this.value];
                }
            },
        }
    },
    purchasing_group_config: {
        name: '采购组别配置',
        buttonList: {
            add_group: {
                name: '新增小组',
                value: 'add_group',
                method: 'handleAddGroupInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.purchasing_group_config && permitResource.purchasing_group_config[this.value];
                }
            },
            preview: {
                name: '查看',
                value: 'preview',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.purchasing_group_config && permitResource.purchasing_group_config[this.value];
                }
            },
            add: {
                name: '新增用户',
                value: 'add',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.purchasing_group_config && permitResource.purchasing_group_config[this.value];
                }
            },
            modify: {
                name: '编辑用户',
                value: 'modify',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.purchasing_group_config && permitResource.purchasing_group_config[this.value];
                }
            },
            delete: {
                name: '删除用户',
                value: 'delete',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.purchasing_group_config && permitResource.purchasing_group_config[this.value];
                }
            },
        }
    },
    service_index_inr: {
        name: '服务指标INR',
        buttonList: {
            import: {
                name: '数据导入',
                value: 'import',
                method: 'handleImportInfo',
                type: 'text',
                icon: 'icon-daoru icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.service_index_inr && permitResource.service_index_inr[this.value];
                }
            },
            delete: {
                name: '清空数据',
                value: 'delete',
                method: 'handleDeleteInfo',
                type: 'text',
                icon: 'icon-piliangshanchu icon_pink',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.service_index_inr && permitResource.service_index_inr[this.value];
                }
            },
        }
    },
    service_index_snad: {
        name: '服务指标SNAD',
        buttonList: {
            import: {
                name: '数据导入',
                value: 'import',
                method: 'handleImportInfo',
                type: 'text',
                icon: 'icon-daoru icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.service_index_snad && permitResource.service_index_snad[this.value];
                }
            },
            delete: {
                name: '清空数据',
                value: 'delete',
                method: 'handleDeleteInfo',
                type: 'text',
                icon: 'icon-piliangshanchu icon_pink',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.service_index_snad && permitResource.service_index_snad[this.value];
                }
            },
        }
    },
    domestic_sku_count: {
        name: '海外仓SKU统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.domestic_sku_count && permitResource.domestic_sku_count[this.value];
                }
            },
        }
    },
    order_to_ratio: {
        name: '下单达成率',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.order_to_ratio && permitResource.order_to_ratio[this.value];
                }
            },
        }
    },
    boutique_work_report: {
        name: '精品工作报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.boutique_work_report && permitResource.boutique_work_report[this.value];
                }
            },
            pic_num: {
                name: '图片张数明细',
                value: 'pic_num',
                method: 'handlePictureNumberInfo',
                type: 'text',
                icon: 'icon-tupianzhangshumingxi icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.boutique_work_report && permitResource.boutique_work_report[this.value];
                }
            },
            overtime_num: {
                name: '超时数',
                value: 'overtime_num',
                method: 'handleSpuDetailsInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.boutique_work_report && permitResource.boutique_work_report[this.value];
                }
            },
            reject_num: {
                name: '返工数',
                value: 'reject_num',
                method: 'handleSpuDetailsInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.boutique_work_report && permitResource.boutique_work_report[this.value];
                }
            },
            preview: {
                name: '员工姓名',
                value: 'preview',
                method: 'handleStaffDetailInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.boutique_work_report && permitResource.boutique_work_report[this.value];
                }
            },
        },
    },
    order_follow_report: {
        name: '订单完结跟进报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.order_follow_report && permitResource.order_follow_report[this.value];
                }
            },
        }
    },
    ebay_listing_link: {
        name: 'Ebaylisting链接统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.ebay_listing_link && permitResource.ebay_listing_link[this.value];
                }
            },
            details: {
                name: '查看明细',
                value: 'details',
                method: 'handleDetailsInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.ebay_listing_link && permitResource.ebay_listing_link[this.value];
                }
            },
        }
    },
    arrival_domestic_fba: {
        name: '到货时间分布(国内&FBA)',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.arrival_domestic_fba && permitResource.arrival_domestic_fba[this.value];
                }
            },
        }
    },
    arrival_time_oversea: {
        name: '到货时间分布(海外)',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.arrival_time_oversea && permitResource.arrival_time_oversea[this.value];
                }
            },
        }
    },
    voided_data_analysis: {
        name: '作废数据分析',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.voided_data_analysis && permitResource.voided_data_analysis[this.value];
                }
            },
        }
    },
    design_task_count: {
        name: '设计部任务汇总统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.design_task_count && permitResource.design_task_count[this.value];
                }
            },
        }
    },
    photograph_time_statistics: {
        name: '摄影平均耗时统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.photograph_time_statistics && permitResource.photograph_time_statistics[this.value];
                }
            },
        }
    },
    photograph_details: {
        name: '摄影拍摄明细',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.photograph_details && permitResource.photograph_details[this.value];
                }
            },
        }
    },
    design_goal_statistics: {
        name: '设计组目标完成统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.design_goal_statistics && permitResource.design_goal_statistics[this.value];
                }
            },
        }
    },
    sales_count_report: {
        name: '销售统计曲线报表',
        buttonList: {
            kevin: {
                name: '排除Kevin',
                value: 'kevin',
                method: '',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sales_count_report && permitResource.sales_count_report[this.value];
                }
            },
        }
    },
    development_goal_statistics: {
        name: '开发目标完成统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.development_goal_statistics && permitResource.development_goal_statistics[this.value];
                }
            },
        }
    },
    order_time_statistics: {
        name: '跟单平均时效统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.order_time_statistics && permitResource.order_time_statistics[this.value];
                }
            },
        }
    },
    developer_time_statistics: {
        name: '开发平均时效统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.developer_time_statistics && permitResource.developer_time_statistics[this.value];
                }
            },
        }
    },
    developer_number_statistics: {
        name: '开发平均数量统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.developer_number_statistics && permitResource.developer_number_statistics[this.value];
                }
            },
        }
    },
    cost_development_number_sku: {
        name: '各成本区间SKU开发数',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.cost_development_number_sku && permitResource.cost_development_number_sku[this.value];
                }
            },
        }
    },
    cost_development_number: {
        name: '各成本区间SPU开发数',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.cost_development_number && permitResource.cost_development_number[this.value];
                }
            },
        }
    },
    after_sales_monitoring: {
        name: '售后渠道监控',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.after_sales_monitoring && permitResource.after_sales_monitoring[this.value];
                }
            },
        }
    },
    f_virtual_warehouse_list: {
        name: 'FBA虚拟仓库存列表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.f_virtual_warehouse_list && permitResource.f_virtual_warehouse_list[this.value];
                }
            },
            edit: {
                name: '编辑显示数据',
                value: 'edit',
                method: 'handleEditTitleInfo',
                type: 'text',
                icon: 'icon-bianjihexiugai icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.f_virtual_warehouse_list && permitResource.f_virtual_warehouse_list[this.value];
                }
            },
        }
    },
    f_virtual_warehouse_count: {
        name: 'FBA虚拟仓库存统计表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.f_virtual_warehouse_count && permitResource.f_virtual_warehouse_count[this.value];
                }
            },
            edit: {
                name: '编辑显示数据',
                value: 'edit',
                method: 'handleEditTitleInfo',
                type: 'text',
                icon: 'icon-bianjihexiugai icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.f_virtual_warehouse_count && permitResource.f_virtual_warehouse_count[this.value];
                }
            },
        }
    },
    o_warehouse_list: {
        name: '海外仓库存列表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.o_warehouse_list && permitResource.o_warehouse_list[this.value];
                }
            },
            edit: {
                name: '编辑显示数据',
                value: 'edit',
                method: 'handleEditTitleInfo',
                type: 'text',
                icon: 'icon-bianjihexiugai icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.o_warehouse_list && permitResource.o_warehouse_list[this.value];
                }
            },
        }
    },
    o_warehouse_count: {
        name: '海外仓库存统计表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.o_warehouse_count && permitResource.o_warehouse_count[this.value];
                }
            },
            edit: {
                name: '编辑显示数据',
                value: 'edit',
                method: 'handleEditTitleInfo',
                type: 'text',
                icon: 'icon-bianjihexiugai icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.o_warehouse_count && permitResource.o_warehouse_count[this.value];
                }
            },
        }
    },
    purchasing_decision: {
        name: '采购决策报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.purchasing_decision && permitResource.purchasing_decision[this.value];
                }
            },
        }
    },
    infringe_num_count: {
        name: '审核数量统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.infringe_num_count && permitResource.infringe_num_count[this.value];
                }
            },
        }
    },
    product_line_aging_count: {
        name: '产品线平均时效统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.product_line_aging_count && permitResource.product_line_aging_count[this.value];
                }
            },
        }
    },
    reject_num_count: {
        name: '驳回次数统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.reject_num_count && permitResource.reject_num_count[this.value];
                }
            },
        }
    },
    oversea_sku_week_count: {
        name: '海外核心SKU周统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.oversea_sku_week_count && permitResource.oversea_sku_week_count[this.value];
                }
            },
        }
    },
    domestic_sku_week_count: {
        name: '国内核心SKU周统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.domestic_sku_week_count && permitResource.domestic_sku_week_count[this.value];
                }
            },
        }
    },
    more_reject_num_count: {
        name: '二次以上驳回统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.more_reject_num_count && permitResource.more_reject_num_count[this.value];
                }
            },
        }
    },
    product_line_infringe_count: {
        name: '产品线侵权统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.product_line_infringe_count && permitResource.product_line_infringe_count[this.value];
                }
            },
        }
    },
    amazon_return_order_count: {
        name: '亚马逊退单统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.amazon_return_order_count && permitResource.amazon_return_order_count[this.value];
                }
            },
        }
    },
    amazon_transaction_data: {
        name: '亚马逊交易数据',
        buttonList: {
            import: {
                name: '导入',
                value: 'import',
                method: 'handleImportInfo',
                type: 'text',
                icon: 'icon-daoru icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.amazon_transaction_data && permitResource.amazon_transaction_data[this.value];
                }
            },
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.amazon_return_order_count && permitResource.amazon_return_order_count[this.value];
                }
            },
        }
    },
    amoeba_report: {
        name: '阿米巴报表统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.amoeba_report && permitResource.amoeba_report[this.value];
                }
            },
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddConfigInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.amoeba_report && permitResource.amoeba_report[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.amoeba_report && permitResource.amoeba_report[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.amoeba_report && permitResource.amoeba_report[this.value];
                }
            },
            demand: {
                name: '是否有效需求',
                value: 'demand',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.amoeba_report && permitResource.amoeba_report[this.value];
                }
            },
            summary: {
                name: '研发工时统计',
                value: 'summary',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.amoeba_report && permitResource.amoeba_report[this.value];
                }
            },
            detail: {
                name: '需求明细',
                value: 'detail',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.amoeba_report && permitResource.amoeba_report[this.value];
                }
            },
            config: {
                name: '配置',
                value: 'config',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.amoeba_report && permitResource.amoeba_report[this.value];
                }
            },
        }
    },
    dev_module_sql: {
        name: '开发模块_SQL',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddSqlInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.dev_module_sql && permitResource.dev_module_sql[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: 'handleDeleteSqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.dev_module_sql && permitResource.dev_module_sql[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                method: 'handleModifySqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.dev_module_sql && permitResource.dev_module_sql[this.value];
                }
            },
        }
    },
    product_module_sql: {
        name: '产品模块_SQL',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddSqlInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.product_module_sql && permitResource.product_module_sql[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: 'handleDeleteSqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.product_module_sql && permitResource.product_module_sql[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                method: 'handleModifySqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.product_module_sql && permitResource.product_module_sql[this.value];
                }
            },
        }
    },
    quality_control_module_sql: {
        name: '品控模块_SQL',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddSqlInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.quality_control_module_sql && permitResource.quality_control_module_sql[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: 'handleDeleteSqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.quality_control_module_sql && permitResource.quality_control_module_sql[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                method: 'handleModifySqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.quality_control_module_sql && permitResource.quality_control_module_sql[this.value];
                }
            },
        }
    },
    copy_module_sql: {
        name: '文案模块_SQL',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddSqlInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.copy_module_sql && permitResource.copy_module_sql[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: 'handleDeleteSqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.copy_module_sql && permitResource.copy_module_sql[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                method: 'handleModifySqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.copy_module_sql && permitResource.copy_module_sql[this.value];
                }
            },
        }
    },
    design_module_sql: {
        name: '设计模块_SQL',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddSqlInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.design_module_sql && permitResource.design_module_sql[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: 'handleDeleteSqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.design_module_sql && permitResource.design_module_sql[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                method: 'handleModifySqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.design_module_sql && permitResource.design_module_sql[this.value];
                }
            },
        }
    },
    tort_module_sql: {
        name: '侵权模块_SQL',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddSqlInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.tort_module_sql && permitResource.tort_module_sql[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: 'handleDeleteSqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.tort_module_sql && permitResource.tort_module_sql[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                method: 'handleModifySqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.tort_module_sql && permitResource.tort_module_sql[this.value];
                }
            },
        }
    },
    sale_module_sql: {
        name: '销售模块_SQL',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddSqlInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sale_module_sql && permitResource.sale_module_sql[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: 'handleDeleteSqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sale_module_sql && permitResource.sale_module_sql[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                method: 'handleModifySqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sale_module_sql && permitResource.sale_module_sql[this.value];
                }
            },
        }
    },
    warehouse_module_sql: {
        name: '仓库模块_SQL',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddSqlInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.warehouse_module_sql && permitResource.warehouse_module_sql[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: 'handleDeleteSqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.warehouse_module_sql && permitResource.warehouse_module_sql[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                method: 'handleModifySqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.warehouse_module_sql && permitResource.warehouse_module_sql[this.value];
                }
            },
        }
    },
    logistics_module_sql: {
        name: '物流模块_SQL',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddSqlInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.logistics_module_sql && permitResource.logistics_module_sql[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: 'handleDeleteSqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.logistics_module_sql && permitResource.logistics_module_sql[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                method: 'handleModifySqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.logistics_module_sql && permitResource.logistics_module_sql[this.value];
                }
            },
        }
    },
    plan_module_sql: {
        name: '计划模块_SQL',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddSqlInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.plan_module_sql && permitResource.plan_module_sql[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: 'handleDeleteSqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.plan_module_sql && permitResource.plan_module_sql[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                method: 'handleModifySqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.plan_module_sql && permitResource.plan_module_sql[this.value];
                }
            },
        }
    },
    customer_module_sql: {
        name: '客服模块_SQL',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddSqlInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.customer_module_sql && permitResource.customer_module_sql[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: 'handleDeleteSqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.customer_module_sql && permitResource.customer_module_sql[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                method: 'handleModifySqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.customer_module_sql && permitResource.customer_module_sql[this.value];
                }
            },
        }
    },
    purchase_module_sql: {
        name: '采购模块_SQL',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddSqlInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.purchase_module_sql && permitResource.purchase_module_sql[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: 'handleDeleteSqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.purchase_module_sql && permitResource.purchase_module_sql[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                method: 'handleModifySqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.purchase_module_sql && permitResource.purchase_module_sql[this.value];
                }
            },
        }
    },
    zentao_module_sql: {
        name: '禅道模块_SQL',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddSqlInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.zentao_module_sql && permitResource.zentao_module_sql[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: 'handleDeleteSqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.zentao_module_sql && permitResource.zentao_module_sql[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                method: 'handleModifySqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.zentao_module_sql && permitResource.zentao_module_sql[this.value];
                }
            },
        }
    },
    system_module_sql: {
        name: '系统管理_SQL',
        buttonList: {
            add: {
                name: '新增',
                value: 'add',
                method: 'handleAddSqlInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.system_module_sql && permitResource.system_module_sql[this.value];
                }
            },
            delete: {
                name: '删除',
                value: 'delete',
                method: 'handleDeleteSqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.system_module_sql && permitResource.system_module_sql[this.value];
                }
            },
            modify: {
                name: '编辑',
                value: 'modify',
                method: 'handleModifySqlInfo',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.system_module_sql && permitResource.system_module_sql[this.value];
                }
            },
        }
    },
    supplier_grade_report: {
        name: '供应商等级报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_grade_report && permitResource.supplier_grade_report[this.value];
                }
            },
            detail: {
                name: '明细',
                value: 'detail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_grade_report && permitResource.supplier_grade_report[this.value];
                }
            },
            link: {
                name: '供应商链接',
                value: 'link',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_grade_report && permitResource.supplier_grade_report[this.value];
                }
            },
        }
    },
    supplier_product_report: {
        name: '供应商产品报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_product_report && permitResource.supplier_product_report[this.value];
                }
            },
        }
    },
    supplier_loss_amount_report: {
        name: '供应商报损金额报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_loss_amount_report && permitResource.supplier_loss_amount_report[this.value];
                }
            },
            detail: {
                name: '明细',
                value: 'detail',
                method: '',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_loss_amount_report && permitResource.supplier_loss_amount_report[this.value];
                }
            },
        }
    },
    supplier_purchase_report: {
        name: '供应商采购报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_purchase_report && permitResource.supplier_purchase_report[this.value];
                }
            },
        }
    },
    supplier_sales_business_report: {
        name: '供应商销售业务报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_sales_business_report && permitResource.supplier_sales_business_report[this.value];
                }
            },
            edit: {
                name: '编辑显示数据',
                value: 'edit',
                method: 'handleEditTitleInfo',
                type: 'text',
                icon: 'icon-bianjihexiugai icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_sales_business_report && permitResource.supplier_sales_business_report[this.value];
                }
            },
        }
    },
    supplier_purchase_business_report: {
        name: '供应商采购业务报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_purchase_business_report && permitResource.supplier_purchase_business_report[this.value];
                }
            },
            edit: {
                name: '编辑显示数据',
                value: 'edit',
                method: 'handleEditTitleInfo',
                type: 'text',
                icon: 'icon-bianjihexiugai icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_purchase_business_report && permitResource.supplier_purchase_business_report[this.value];
                }
            },
        }
    },
    supplier_money_business_report: {
        name: '供应商款项业务报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_money_business_report && permitResource.supplier_money_business_report[this.value];
                }
            },
            edit: {
                name: '编辑显示数据',
                value: 'edit',
                method: 'handleEditTitleInfo',
                type: 'text',
                icon: 'icon-bianjihexiugai icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.supplier_money_business_report && permitResource.supplier_money_business_report[this.value];
                }
            },
        }
    },
    copy_editing_report: {
        name: '文案编辑报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.copy_editing_report && permitResource.copy_editing_report[this.value];
                }
            },
        }
    },
    product_line_profit: {
        name: '产品线毛利统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.product_line_profit && permitResource.product_line_profit[this.value];
                }
            },
        }
    },
    design_product_line_count: {
        name: '产品线汇总统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.design_product_line_count && permitResource.design_product_line_count[this.value];
                }
            },
        }
    },
    design_repair_details: {
        name: '设计修图明细',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.design_repair_details && permitResource.design_repair_details[this.value];
                }
            },
        }
    },
    boutique_repair_details: {
        name: '精品修图明细',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.boutique_repair_details && permitResource.boutique_repair_details[this.value];
                }
            },
        }
    },
    small_platform_sales: {
        name: '小平台销售报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.small_platform_sales && permitResource.small_platform_sales[this.value];
                }
            },
        }
    },
    warehouse_sales_report: {
        name: '仓库销售统计报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.warehouse_sales_report && permitResource.warehouse_sales_report[this.value];
                }
            },
        }
    },
    logistics_sku_check: {
        name: '物流SKU尺寸核对',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.logistics_sku_check && permitResource.logistics_sku_check[this.value];
                }
            },
            log: {
                name: '日志',
                value: 'log',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.logistics_sku_check && permitResource.logistics_sku_check[this.value];
                }
            },
        }
    },
    logistics_aging_count: {
        name: '物流时效统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.logistics_aging_count && permitResource.logistics_aging_count[this.value];
                }
            },
            // edit: {
            //     name: '编辑显示数据',
            //     value: 'edit',
            //     method: 'handleEditTitleInfo',
            //     type: 'text',
            //     icon: 'icon-bianjihexiugai icon_purple',
            //     action: function (vm, fnName) {
            //         // 执行方法
            //         vm[fnName]();
            //     },
            //     permit() {
            //         // 权限拦截
            //         const permitResource = Object.assign({}, Store.getters.permitResource);
            //         return permitResource.logistics_aging_count && permitResource.logistics_aging_count[this.value];
            //     }
            // },
        }
    },
    site_sales_report: {
        name: '站点销售统计报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.site_sales_report && permitResource.site_sales_report[this.value];
                }
            },
        }
    },
    product_cost_ratio_count: {
        name: '产品成本CNY及占比统计报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.product_cost_ratio_count && permitResource.product_cost_ratio_count[this.value];
                }
            },
        }
    },
    freight_rnb_count: {
        name: '运费RMB统计报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.freight_rnb_count && permitResource.freight_rnb_count[this.value];
                }
            },
        }
    },
    it_expense_list: {
        name: 'IT费用清单',
        buttonList: {
            import: {
                name: '导入',
                value: 'import',
                method: 'handleImportInfo',
                type: 'text',
                icon: 'icon-daoru icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.it_expense_list && permitResource.it_expense_list[this.value];
                }
            },
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.it_expense_list && permitResource.it_expense_list[this.value];
                }
            },
            add: {
                name: '批量新增',
                value: 'add',
                method: 'handleBatchAddInfo',
                type: 'text',
                icon: 'icon-xinzeng1 icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.it_expense_list && permitResource.it_expense_list[this.value];
                }
            },
            edit: {
                name: '批量编辑',
                value: 'edit',
                method: 'handleBatchEditInfo',
                type: 'text',
                // icon: 'icon-bianjihexiugai icon_purple',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.it_expense_list && permitResource.it_expense_list[this.value];
                }
            },
            delete: {
                name: '批量删除',
                value: 'delete',
                method: 'handleBatchDeleteInfo',
                type: 'text',
                icon: 'icon-piliangshanchu icon_pink',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.it_expense_list && permitResource.it_expense_list[this.value];
                }
            },
        }
    },
    information_freeze: {
        name: '库存综合信息定格',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.information_freeze && permitResource.information_freeze[this.value];
                }
            },
        }
    },

    real_time_information: {
        name: '库存综合信息实时',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.real_time_information && permitResource.real_time_information[this.value];
                }
            },
        }
    },
    cost_statistics_report: {
        name: '费用统计报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.cost_statistics_report && permitResource.cost_statistics_report[this.value];
                }
            },
        }
    },
    cd_product_line_report: {
        name: 'CD产品线销售报表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.cd_product_line_report && permitResource.cd_product_line_report[this.value];
                }
            },
        }
    },
    cd_product_cost_count: {
        name: 'CD产品成本占比统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.cd_product_cost_count && permitResource.cd_product_cost_count[this.value];
                }
            },
        }
    },
    cd_freight_count: {
        name: 'CD运费占比统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.cd_freight_count && permitResource.cd_freight_count[this.value];
                }
            },
        }
    },
    cd_channel_spread_count: {
        name: 'CD渠道发货分布统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.cd_channel_spread_count && permitResource.cd_channel_spread_count[this.value];
                }
            },
        }
    },
    sales_month_mark: {
        name: '销量标识',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sales_month_mark && permitResource.sales_month_mark[this.value];
                }
            },
        }
    },
    sales_month_weighted: {
        name: '加权销量',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sales_month_weighted && permitResource.sales_month_weighted[this.value];
                }
            },
        }
    },
    sales_month_amount_sold: {
        name: '30日销库金额',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sales_month_amount_sold && permitResource.sales_month_amount_sold[this.value];
                }
            },
        }
    },
    sales_month_f_stock: {
        name: 'FBA可用库存',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sales_month_f_stock && permitResource.sales_month_f_stock[this.value];
                }
            },
        }
    },
    sales_month_f_money: {
        name: 'FBA在库金额',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.sales_month_f_money && permitResource.sales_month_f_money[this.value];
                }
            },
        }
    },
    platforms_refund_count: {
        name: '各平台退款统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.platforms_refund_count && permitResource.platforms_refund_count[this.value];
                }
            },
        }
    },
    wm_product_cost_count: {
        name: 'w-m产品成本占比统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.wm_product_cost_count && permitResource.wm_product_cost_count[this.value];
                }
            },
        }
    },
    wm_channel_spread_count: {
        name: 'w-m渠道发货分布统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.wm_channel_spread_count && permitResource.wm_channel_spread_count[this.value];
                }
            },
        }
    },
    f_virtual_stock_statistics: {
        name: 'FBA断货日表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.f_virtual_stock_statistics && permitResource.f_virtual_stock_statistics[this.value];
                }
            },
        }
    },
    f_virtual_stock_monthly: {
        name: 'FBA断货月表',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.f_virtual_stock_monthly && permitResource.f_virtual_stock_monthly[this.value];
                }
            },
        }
    },
    product_identification: {
        name: '新品销量标识',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.product_identification && permitResource.product_identification[this.value];
                }
            },
        }
    },
    product_available_stock: {
        name: '新品FBA可用库存',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.product_available_stock && permitResource.product_available_stock[this.value];
                }
            },
        }
    },
    product_weighting_volume: {
        name: '新品加权销量',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.product_weighting_volume && permitResource.product_weighting_volume[this.value];
                }
            },
        }
    },
    product_library_amount: {
        name: '新品30日销库金额',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.product_library_amount && permitResource.product_library_amount[this.value];
                }
            },
        }
    },
    product_inthe_amount: {
        name: '新品在库金额',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.product_inthe_amount && permitResource.product_inthe_amount[this.value];
                }
            },
        }
    },
    br_count: {
        name: '报表BR统计',
        buttonList: {
            export: {
                name: '导出',
                value: 'export',
                method: 'handleExportInfo',
                type: 'text',
                icon: 'icon-daochu icon_blue',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.br_count && permitResource.br_count[this.value];
                }
            },
        }
    },
    south_ease_target: {
        name: '东南亚目标完成统计',
        buttonList: {
            target_entry: {
                name: '目标录入',
                value: 'target_entry',
                type: 'text',
                action: function (vm, fnName) {
                    // 执行方法
                    vm[fnName]();
                },
                permit() {
                    // 权限拦截
                    const permitResource = Object.assign({}, Store.getters.permitResource);
                    return permitResource.south_ease_target && permitResource.south_ease_target[this.value];
                }
            },
        }
    },
};
export default config;
