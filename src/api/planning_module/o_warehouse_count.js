/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/11 21:35
 */

/**  --->>>>   |^ 海外仓库存统计表^|   <<<<---**/
import CONFIG from '@/assets/js/config';
import http from '@/http';

//金额统计
export function getOWarehouseAmountCountInfo(params = {}) {
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
        window.open('/monitor/Domestic_overseas/getOverMoneyList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Domestic_overseas/getOverMoneyList', data);
    }
}

//获取所有表头-金额统计
export function getAmountTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_overseas/getOverseasMoneyTitle', data);
}
//保存表头-金额统计
export function getConfirmAmountTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_overseas/saveOverseasMoneyTitle', data);
}

//计量统计
export function getOWarehouseCalculateCountInfo(params = {}) {
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
        window.open('/monitor/Domestic_overseas/getStoreMeteringList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Domestic_overseas/getStoreMeteringList', data);
    }
}
//获取所有表头-计量统计
export function getCalculateTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_overseas/getStoreMeteringTitle', data);
}
//保存表头-计量统计
export function getConfirmCalculateTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_overseas/saveStoreMeteringTitle', data);
}


//种类数统计
export function getOWarehouseSpeciesCountInfo(params = {}) {
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
        window.open('/monitor/Domestic_overseas/getStoreTypeList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Domestic_overseas/getStoreTypeList', data);
    }
}
//获取所有表头-种类数统计
export function getSpeciesTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_overseas/getStoreTypeTitle', data);
}
//保存表头-种类数统计
export function getConfirmSpeciesTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_overseas/saveStoreTypeTitle', data);
}

//获取所有下拉
export function geOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_overseas/getStore', data);
}
