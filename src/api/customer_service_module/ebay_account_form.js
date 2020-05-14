/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/8 16:00
 */

/**  --->>>>   |^ Ebay账号表现^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getEbayAccountFormInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带is_excel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open(`${CONFIG.BI_PATH2}/yibai/zhiku/ebay_customer_service/csv/down/` + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.postAjax(`${CONFIG.BI_PATH2}/yibai/zhiku/ebay_customer_service/account_expression/list/`, data, true, true);
    }
}

//下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax_BI(`${CONFIG.BI_PATH2}/yibai/zhiku/ebay_customer_service/buyer_experience_report/query_dict/`, data, true, true)
}

//备注列表
export function getRemarksListInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax(`${CONFIG.BI_PATH2}/yibai/zhiku/ebay_customer_service/account_remark/list/`, data, true, true)
}

//添加备注
export function getAddRemarksInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax(`${CONFIG.BI_PATH2}/yibai/zhiku/ebay_customer_service/account_remark/add/`, data, true, true)
}

//基本信息列表
export function getBaseListInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax(`${CONFIG.BI_PATH2}/yibai/zhiku/ebay_customer_service/account_expression/detail/`, data, true, true)
}

//表现弹框接口
export function getExpressionDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax_BI(`${CONFIG.BI_PATH2}/yibai/zhiku/ebay_customer_service/buyer_experience_report/detail/`, data, true, true)
}

//率弹框接口
export function getRateDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax_BI(`${CONFIG.BI_PATH2}/yibai/zhiku/ebay_customer_service/seller_grade_report/detail/`, data, true, true)
}