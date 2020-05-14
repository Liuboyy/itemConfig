/**
 * Creator: KarYanLam
 * Creation Date: 2020/1/7 16:18
 */

/**  --->>>>   |^ 设计修图明细^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getDesignRepairDetailsInfo(params = {}) {
    const data = {
        limit: 20,
        offset: 1,
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Art_maprevision/getArtMapDatail2' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Art_maprevision/getArtMapDatail2', data);
    }
}