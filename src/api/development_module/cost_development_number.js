
/**********************************  --->>>>   |^ 各成本区间SPU开发数 ^|   <<<<---*****************************/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//开发小组
export function getCostDevelopmentGroupInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/development/Price_range_qty/getDataByGroup' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/development/Price_range_qty/getDataByGroup', data);
    }
}

//开发人员
export function getCostDeveloperInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/development/Price_range_qty/getDataByUser' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/development/Price_range_qty/getDataByUser', data);
    }
}

//开发类型
export function getCostDevelopmentTypeInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/development/Price_range_qty/getDataByDevType' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/development/Price_range_qty/getDataByDevType', data);
    }
}

//产品线
export function getCostProductLineInfoInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/development/Price_range_qty/getDataByLine' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/development/Price_range_qty/getDataByLine', data);
    }
}