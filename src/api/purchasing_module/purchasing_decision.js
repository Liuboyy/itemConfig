/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/19 22:25
 */

/**  --->>>>   |^ 采购决策报表^|   <<<<---**/
import CONFIG from '@/assets/js/config';
import http from '@/http';

//降价
export function getPurchasingReducePriceInfo(params = {}) {
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
        window.open(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report/pur_cut_price_dwon/list/down/` + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report/pur_cut_price/list/`, data);
    }
}

//完结
export function getPurchasingCloseOrderInfo(params = {}) {
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
        window.open(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report/pur_finish_dwon/list/down/` + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report/pur_finish/list/`, data);
    }
}

//下拉数据
// export function getOptionList(params = {}) {
//     const data = {
//         ...CONFIG.ajaxData,
//         ...params
//     };
//     return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report_query/`, data, true, true)
// }

//获取下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_query/`, data, true, true)
}
