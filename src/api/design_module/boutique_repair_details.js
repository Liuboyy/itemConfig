/**
 * Creator: KarYanLam
 * Creation Date: 2020/1/7 15:57
 */

/**  --->>>>   |^ 精品修图明细^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getBoutiqueRepairDetailsInfo(params = {}) {
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
        window.open('/design/Art_maprevision/getArtMapDatail3' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Art_maprevision/getArtMapDatail3', data);
    }
}