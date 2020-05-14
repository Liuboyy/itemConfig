import getters from './getters';
import mutations from './mutation';
import state from './state';
import actions from './actions';

import Vue from 'vue';
import VueX from 'vuex';

//销售模块
import account_sales_volume from './module/am_order_count/account_sales_volume'
import sales_performance_count from './module/am_order_count/sales_performance_count'
import account_main_params from './module/am_order_count/account_main_params'
import publish_sales_count from './module/am_order_count/publish_sales_count'
import target_complete from './module/am_order_count/target_complete'
import sales_data_report from './module/sales_module/sales_data_report'
import listing_move_bar from './module/am_order_count/listing_move_bar'
import listing_move_data from './module/am_order_count/listing_move_data'
import arrears_count_report from './module/sales_module/arrears_count_report'
import account_health_count from './module/am_order_count/account_health_count'
import amazon_return_order_count from './module/sales_module/amazon_return_order_count'
import south_ease_target from './module/sales_module/south_ease_target'

//开发模块
import cost_development_number from './module/development_module/cost_development_number'
import development_goal_statistics from './module/development_module/development_goal_statistics'
import order_time_statistics from './module/development_module/order_time_statistics'
import supplier_arrival_statistics from './module/development_module/supplier_arrival_statistics'
import developer_time_statistics from './module/development_module/developer_time_statistics'
import product_line_trend from './module/development_module/product_line_trend'
import developer_number_statistics from './module/development_module/developer_number_statistics'
import cost_development_number_sku from './module/development_module/cost_development_number_sku'

//产品模块
import oversea_sku_count from './module/product_module/oversea_sku_count'
import domestic_sku_count from './module/product_module/domestic_sku_count'
import oversea_sku_week_count from './module/product_module/oversea_sku_week_count'
import domestic_sku_week_count from './module/product_module/domestic_sku_week_count'

//品控模块
import tqe_work_report from './module/quality_control_module/tqe_work_report'
import sample_audit_report from './module/quality_control_module/sample_audit_report'

//文案模块
import copy_goal_statistics from './module/copy_module/copy_goal_statistics'
import copy_work_report from './module/copy_module/copy_work_report'
import copy_editing_report from './module/copy_module/copy_editing_report'
import copy_time_statistics from './module/copy_module/copy_time_statistics'

//设计模块
import design_task_count from './module/design_module/design_task_count'
import photograph_work_report from './module/design_module/photograph_work_report'
import photograph_time_statistics from './module/design_module/photograph_time_statistics'
import photograph_details from './module/design_module/photograph_details'
import artist_work_report from './module/design_module/artist_work_report'
import artist_time_statistics from './module/design_module/artist_time_statistics'
import artwork_repair_details from './module/design_module/artwork_repair_details'
import design_work_report from './module/design_module/design_work_report'
import design_goal_statistics from './module/design_module/design_goal_statistics'
import boutique_work_report from './module/design_module/boutique_work_report'

// 系统管理模块
import am_permit_config from './module/system_manage/am_permit_config'
import product_permit_config from './module/system_manage/product_permit_config'

//仓库模块
import statistical_report from './module/warehouse_module/statistical_report'

//物流模块
import order_execution_aging from './module/logistics_module/order_execution_aging'
import b2b_order_aging from './module/logistics_module/b2b_order_aging'
import b2c_order_rate from './module/logistics_module/b2c_order_rate'

//采购模块
import purchasing_group_config from './module/purchasing_module/purchasing_group_config'

//侵权模块
import infringe_num_count from './module/infringement_module/infringe_num_count'
import reject_num_count from './module/infringement_module/reject_num_count'
import more_reject_num_count from './module/infringement_module/more_reject_num_count'

//禅道模块
import amoeba_report from './module/zen_tao_module/amoeba_report'
import it_expense_list from './module/zen_tao_module/it_expense_list'





Vue.use(VueX);

export default new VueX.Store({
    modules: {
        account_sales_volume,
        sales_performance_count,
        account_main_params,
        cost_development_number,
        development_goal_statistics,
        order_time_statistics,
        supplier_arrival_statistics,
        developer_time_statistics,
        tqe_work_report,
        sample_audit_report,
        copy_goal_statistics,
        copy_work_report,
        copy_editing_report,
        copy_time_statistics,
        design_task_count,
        photograph_work_report,
        photograph_time_statistics,
        photograph_details,
        artist_work_report,
        artist_time_statistics,
        artwork_repair_details,
        design_work_report,
        design_goal_statistics,
        am_permit_config,
        publish_sales_count,
        product_line_trend,
        product_permit_config,
        target_complete,
        statistical_report,
        order_execution_aging,
        sales_data_report,
        developer_number_statistics,
        listing_move_bar,
        listing_move_data,
        b2b_order_aging,
        arrears_count_report,
        account_health_count,
        oversea_sku_count,
        cost_development_number_sku,
        b2c_order_rate,
        purchasing_group_config,
        domestic_sku_count,
        boutique_work_report,
        oversea_sku_week_count,
        domestic_sku_week_count,
        infringe_num_count,
        reject_num_count,
        more_reject_num_count,
        amoeba_report,
        amazon_return_order_count,
        it_expense_list,
        south_ease_target
    },
    state,
    getters,
    mutations,
    actions
});
