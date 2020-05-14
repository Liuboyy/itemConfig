/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/15 15:20
 */

/**  --->>>>   |^ FBA虚拟仓库存列表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//金额统计
export function getFVirtualAmountListInfo(params = {}) {
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
        window.open('/monitor/Domestic_invented/getStoreList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Domestic_invented/getStoreList', data);
    }
}

//获取所有表头
export function getAmountTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_invented/getAllTitle', data);
}

//保存编辑表头
export function getConfirmAmountTitleInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_invented/saveTitle', data);
}

//计量统计
export function getFVirtualCalculateListInfo(params = {}) {
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
        window.open('/monitor/Domestic_invented/getMeteringList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Domestic_invented/getMeteringList', data);
    }
}

//获取所有表头
export function getCalculateTitleList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_invented/getAllTitleMetering', data);
}

//保存编辑表头
export function getConfirmCalculateTitleInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_invented/saveTitleMetering', data);
}


//获取所有下拉
export function geOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Domestic_overseas/getStore', data);
}