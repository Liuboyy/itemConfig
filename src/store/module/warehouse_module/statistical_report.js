
/**  =========================> *|`| % 结汇订单查询% |`|*<======================== **/

import * as types from '../../mutation-type'
import {
    getStatiscalReportInfo,
} from '@/api/warehouse_module/statistical_report';

const config = {
    state: {
        statisticalReport: {},
    },
    mutations: {
        [types.SAVE_STATISTICAL_REPORT_INFO](state, saveInfo) {
            state.statisticalReport = saveInfo;
        },
    },
    actions: {
        // 获取网采订单的查询信息
        GetStatiscalReportInfo({ commit }, queryData) {
            if (!queryData) {
                queryData = {};
            }
            return new Promise((resolve, reject) => {
                getStatiscalReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_STATISTICAL_REPORT_INFO'], response.data);
                    }
                    resolve(response);
                }).catch(error => {
                    reject(error);
                })
            })
        }
    }
};

export default config;

