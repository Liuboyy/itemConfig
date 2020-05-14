/**
 * Creator: KarYanLam
 * Creation Date: 2019/12/17 21:36
 */

/**  --->>>>   |^ 供应商销售业务报表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//报表
export function getSupplierSalesBusinessInfo(params = {}) {
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
        window.open('/supplier/Supplier_business/getSupplierProduct' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/supplier/Supplier_business/getSupplierProduct', data);
    }
}

//获取下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/supplier/Supplier_level/getSelectData', data);
}

//获取产品线下拉数据
export function getProductLineList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/supplier/Supplier_level/getLevelData', data);
}

//选择变量、选择使用时间
export function getVariableAndTimeList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/supplier/Supplier_business/getLevelData', data);
}

//获取编辑显示数据
export function getAllEditTitleInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/supplier/Supplier_business/getAllTitle', data);
}

//保存编辑显示数据
export function getSaveEditTitleInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/supplier/Supplier_business/saveTitle', data);
}