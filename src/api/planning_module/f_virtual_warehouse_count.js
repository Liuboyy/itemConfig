/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/15 15:20
 */

/**  --->>>>   |^ FBA虚拟仓库存统计表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//金额统计
export function getFVirtualAmountCountInfo(params = {}) {
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
        window.open('/monitor/Domestic_invented/getInventoryStatisticsList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Domestic_invented/getInventoryStatisticsList', data);
    }
}

//获取所有表头-金额统计
export function getAmountTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_invented/getAllTitleInventory', data);
}
//保存表头-金额统计
export function getConfirmAmountTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_invented/saveTitleInventory', data);
}

//计量统计
export function getFVirtualCalculateCountInfo(params = {}) {
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
        window.open('/monitor/Domestic_invented/getCalculateStatisticsList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Domestic_invented/getCalculateStatisticsList', data);
    }
}
//获取所有表头-计量统计
export function getCalculateTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_invented/getAllTitleCalculate', data);
}
//保存表头-计量统计
export function getConfirmCalculateTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_invented/saveTitleCalculate', data);
}


//种类数统计
export function getFVirtualSpeciesCountInfo(params = {}) {
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
        window.open('/monitor/Domestic_invented/getTypeNumberList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Domestic_invented/getTypeNumberList', data);
    }
}
//获取所有表头-种类数统计
export function getSpeciesTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_invented/getAllTitleTypeNumber', data);
}
//保存表头-种类数统计
export function getConfirmSpeciesTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_invented/saveTypeNumber', data);
}

//获取所有下拉
export function geOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_overseas/getStore', data);
}
