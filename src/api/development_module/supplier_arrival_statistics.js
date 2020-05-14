
/**************************  --->>>>   |^ 供应商平均到样时效 ^|   <<<<---************************/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getSupplierArrivalCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/development/Develop_suppliers/getSupplierList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/development/Develop_suppliers/getSupplierList', data);
    }
}