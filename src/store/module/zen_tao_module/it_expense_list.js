/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/18 22:15
 */

/**  --->>>>   |^ IT费用清单^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getServerCostsInfo,
    getOtherCostsInfo
} from '../../../api/zen_tao_module/it_expense_list';

const config = {
    state: {
        serverCostsInfo: {},
        otherCostsInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_SERVER_COST_INFO] (state, saveInfo) {
            state.serverCostsInfo = saveInfo
        },
        [types.SAVE_OTHER_COST_INFO] (state, saveInfo) {
            state.otherCostsInfo = saveInfo
        },
    },
    actions: {
        // name
        GetServerCostsInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getServerCostsInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_SERVER_COST_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetOtherCostsInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getOtherCostsInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_OTHER_COST_INFO'], response.data)
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