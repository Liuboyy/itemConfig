/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/8/22
 * Time: 17:27
 *
 */

import CONFIG from '@/assets/js/config';
import http from '@/http';
import qs from 'qs';
import { postExcelFile } from '@/services';

export function getOvertimeOrderInfo(params = {}) {
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
        window.open(`${CONFIG.BI_PATH2}/yibai/zhiku/order/timeout/count_statistics/down/` + str, '_self');
        // postExcelFile(data, `${CONFIG.BI_PATH2}/yibai/zhiku/order/timeout/count_statistics/down/`);
        return new Promise((resolve => {
            resolve({

                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.postAjax(`${CONFIG.BI_PATH2}/yibai/zhiku/order/timeout/count_statistics`, data, true, true);
        // return http.postAjax('http://39.108.55.184:8802/yibai/zhiku/order/timeout/count_statistics', data, true, true);
    }
}

//获取平台下拉数据
export function getOvertimeList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax(`${CONFIG.BI_PATH2}/yibai/zhiku/order/timeout/query/`, data, true, true);
    // return http.getAjax('http://39.108.55.184:8802/yibai/zhiku/order/timeout/query/', data, true, true);
}


//获取超时订单总数和异常订单量总数
export function getExceptionDetails(params = {}) {
    const data = {
        offset: 1,
        limit: 20,
        ...CONFIG.ajaxData,
        ...params,
    };
        // return http.postAjax('http://39.108.55.184:8802/yibai/zhiku/order/timeout/detail1/list/', data, true, true);
        return http.postAjax(`${CONFIG.BI_PATH2}/yibai/zhiku/order/timeout/detail1/list/`, data, true, true);
}
