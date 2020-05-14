/**
 * Creator: KarYanLam
 * Creation Date: 2019/9/16 15:10
 */

/**  --->>>>   |^ 国内仓库存统计表^|   <<<<---**/
import CONFIG from '@/assets/js/config';
import http from '@/http';

//金额统计
export function getWarehouseAmountCountInfo(params = {}) {
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
        window.open('/monitor/Domestic_house/getInventoryStatisticsList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Domestic_house/getInventoryStatisticsList', data);
    }
}

//获取所有表头-金额统计
export function getAmountTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_house/getAllTitleInventory', data);
}
//保存表头-金额统计
export function getConfirmAmountTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_house/saveTitleInventory', data);
}

//计量统计
export function getWarehouseCalculateCountInfo(params = {}) {
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
        window.open('/monitor/Domestic_house/getCalculateStatisticsList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Domestic_house/getCalculateStatisticsList', data);
    }
}
//获取所有表头-计量统计
export function getCalculateTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_house/getAllTitleCalculate', data);
}
//保存表头-计量统计
export function getConfirmCalculateTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_house/saveTitleCalculate', data);
}


//种类数统计
export function getWarehouseSpeciesCountInfo(params = {}) {
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
        window.open('/monitor/Domestic_house/getTypeNumberList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Domestic_house/getTypeNumberList', data);
    }
}
//获取所有表头-种类数统计
export function getSpeciesTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_house/getAllTitleTypeNumber', data);
}
//保存表头-种类数统计
export function getConfirmSpeciesTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_house/saveTypeNumber', data);
}

//获取所有下拉
export function geOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_house/getStore', data);
}
