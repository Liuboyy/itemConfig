/**  --->>>>   |^ 仓库损益统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//在库段sku列表查询
export function getLableInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open(`${CONFIG.HZ_PATH}/ods_wms_stock_report/` + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax(`${CONFIG.HZ_PATH}/ods_wms_stock_report/`, data);
    }
}

//获取下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax(`${CONFIG.HZ_PATH}/ods_wms_stock_report_title/`, data);
}
