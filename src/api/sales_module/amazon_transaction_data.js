/**  --->>>>   |^ 销售统计数据报表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getAmazontransactiondata(params = {}) {

    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/orderlack/Order_back/getList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/orderlack/Order_back/getList', data);
    }
}

//获取平台下拉数据
export function getDropDownList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/orderlack/Order_back/getSelectData', data);
}

//获取站点数据
export function getAccountList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/amazonreturn/query`, data, true, true);
    // return http.getAjax_BI('http://192.168.71.162:8802/yibai/zhiku/amazonreturn/query', data, true, true);
}
