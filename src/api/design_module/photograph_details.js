
/**********************************  --->>>>   |^ 摄影拍摄明细 ^|   <<<<---*****************************/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getPhotographDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Photo_detail_report/getDetailData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Photo_detail_report/getDetailData', data);
    }
}

