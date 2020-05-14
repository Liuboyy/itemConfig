/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/12 9:43
 */

/**  --->>>>   |^ 销售统计数据报表^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getSalesDataReportInfo,
} from '@/api/sales_module/sales_data_report';

const config = {
    state: {
        saleDataReportInfo: {},
    },
    mutations: {
        [types.SAVE_SALES_DATA_REPORT_INFO] (state, saveInfo) {
            state.saleDataReportInfo = saveInfo
        },
    },
    actions: {
        // name
        GetSalesDataReportInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getSalesDataReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_SALES_DATA_REPORT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
    }
}

export default config