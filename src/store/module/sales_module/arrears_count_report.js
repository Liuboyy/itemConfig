/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/25 17:56
 */

/**  --->>>>   |^ 欠货统计报表^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getArrearsCountReportInfo,
} from '@/api/sales_module/arrears_count_report';

const config = {
    state: {
        arrearsCountReportsInfo: {},
    },
    mutations: {
        [types.SAVE_ARREARS_COUNT_REPORT_INFO] (state, saveInfo) {
            state.arrearsCountReportsInfo = saveInfo
        },
    },
    actions: {
        // name
        GetArrearsCountReportInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getArrearsCountReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ARREARS_COUNT_REPORT_INFO'], response.data)
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