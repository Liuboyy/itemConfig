/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/4/27
 * Time: 15:13
 *
 */
/**  =========================> *|`| % name % |`|*<======================== **/

import * as types from '../../mutation-type'

import {
    getAccountMainParamsInfo,
} from '@/api/am_order_count/account_main_params';

const config = {
    state: {
        accountMainParamsInfo: {},
    },
    mutations: {
        [types.SAVE_ACCOUNT_MAIN_PARAMS_INFO] (state, saveInfo) {
            state.accountMainParamsInfo = saveInfo
        }
    },
    actions: {
        // name
        GetAccountMainParamsInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getAccountMainParamsInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ACCOUNT_MAIN_PARAMS_INFO'], response.data)
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
