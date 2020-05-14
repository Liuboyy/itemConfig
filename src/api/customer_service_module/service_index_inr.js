/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/10 20:13
 */

/**  --->>>>   |^ 服务指标INR^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getServiceIndexInrInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open(`${CONFIG.BI_PATH2}/yibai/zhiku/ebay_customer_service/upload_store_file_inr/list/` + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.postAjax(`${CONFIG.BI_PATH2}/yibai/zhiku/ebay_customer_service/upload_store_file_inr/list/`, data, true, true);
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

//批量删除
export function getBatchDeleteInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax(`${CONFIG.BI_PATH2}/yibai/zhiku/ebay_customer_service/upload_store_file_inr/delete/`, data, true, true)
}
