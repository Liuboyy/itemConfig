/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/8 10:09
 */

/**  --->>>>   |^ 卖家成绩表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getSellerScoreFormInfo(params = {}) {
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
        // postExcelFile(data, `${CONFIG.BI_PATH}/yibai/zhiku/order/abnormal/count_statistics/down/`);
        window.open(`${CONFIG.BI_PATH2}/yibai/zhiku/ebay_customer_service/seller_grade_report/list/` + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.postAjax(`${CONFIG.BI_PATH2}/yibai/zhiku/ebay_customer_service/seller_grade_report/list/`, data, true, true);
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

//弹框接口
export function getDialogDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax_BI(`${CONFIG.BI_PATH2}/yibai/zhiku/ebay_customer_service/seller_grade_report/detail/`, data, true, true)
}