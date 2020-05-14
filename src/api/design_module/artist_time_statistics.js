
/**********************************  --->>>>   |^ 美工平均耗时统计 ^|   <<<<---*****************************/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//美工小组
export function getArtistGroupTimeCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Art_avgworkreport/getArtAvgTotal' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Art_avgworkreport/getArtAvgTotal', data);
    }
}

//产品线
export function getArtistProductLineTimeCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Art_avgworkreport/getArtProducts' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Art_avgworkreport/getArtProducts', data);
    }
}

