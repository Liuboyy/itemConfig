/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/4/27
 * Time: 16:26
 *
 */
/**  =========================> *|`| % name % |`|*<======================== **/

import * as types from '../../mutation-type'

import {
    getSalesPerformanceCountInfo,
} from '@/api/am_order_count/sales_performance_count';

const config = {
    state: {
        salesPerformanceCountInfo: {},
    },
    mutations: {
        [types.SAVE_SALES_PERFORMANCE_COUNT_INFO] (state, saveInfo) {
            state.salesPerformanceCountInfo = saveInfo
        }
    },
    actions: {
        // name
        GetSalesPerformanceCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getSalesPerformanceCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_SALES_PERFORMANCE_COUNT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}

export default config

