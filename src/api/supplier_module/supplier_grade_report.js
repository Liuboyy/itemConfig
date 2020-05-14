/**
 * Creator: KarYanLam
 * Creation Date: 2019/12/13 20:55
 */

/**  --->>>>   |^ 供应商等级报表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//报表
export function getSupplierGradeInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带is_excel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/supplier/Supplier_level/getLevelList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/supplier/Supplier_level/getLevelList', data);
    }
}

//明细
export function getSupplierDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带is_excel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/supplier/Supplier_level/getLevelDetail' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.postAjax('/supplier/Supplier_level/getLevelDetail', data);
    }
}

//获取下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/supplier/Supplier_level/getLevelData', data);
}



