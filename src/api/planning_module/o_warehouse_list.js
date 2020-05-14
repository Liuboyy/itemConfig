/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/11 21:34
 */

/**  --->>>>   |^ 海外仓库存列表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//金额统计
export function getOWarehouseListAmountInfo(params = {}) {
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
        window.open('/monitor/Domestic_overseas/getOverStoreList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Domestic_overseas/getOverStoreList', data);
    }
}

//获取所有表头
export function getAmountTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_overseas/getAllTitle', data);
}

//保存编辑表头
export function getConfirmAmountTitleInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_overseas/saveOverseasTitle', data);
}

//计量统计
export function getOWarehouseListCalculateInfo(params = {}) {
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
        window.open('/monitor/Domestic_overseas/getOverMeteringList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Domestic_overseas/getOverMeteringList', data);
    }
}

//获取所有表头
export function getCalculateTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_overseas/getOverseasMeteringTitle', data);
}

//保存编辑表头
export function getConfirmCalculateTitleInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_overseas/saveOverseasMeteringTitle', data);
}


//获取所有下拉
export function geOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_overseas/getStore', data);
}