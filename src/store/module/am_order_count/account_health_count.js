/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/25 22:32
 */

/**  --->>>>   |^ 账号健康度统计^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getAccountHealthCountInfo,
} from '@/api/am_order_count/account_health_count';

const config = {
    state: {
        accountHealthCountInfo: {},
    },
    mutations: {
        [types.SAVE_ACCOUNT_HEALTH_COUNT_INFO] (state, saveInfo) {
            state.accountHealthCountInfo = saveInfo
        }
    },
    actions: {
        // name
        GetAccountHealthCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getAccountHealthCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ACCOUNT_HEALTH_COUNT_INFO'], response.data)
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
