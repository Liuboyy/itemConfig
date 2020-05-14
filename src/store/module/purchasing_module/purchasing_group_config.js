/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/15 17:12
 */

/**  --->>>>   |^ 采购组别配置^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getUserConfigListInfo,
    getGroupConfigListInfo
} from '@/api/purchasing_module/purchasing_group_config';

const config = {
    state: {
        purchasingUserConfigInfo: {},
        purchasingGroupConfigInfo: {},
        activeName: '',
    },
    mutations: {
        [types.SAVE_PURCHASE_USER_CONFIG_INFO] (state, saveInfo) {
            state.purchasingUserConfigInfo = saveInfo
        },
        [types.SAVE_PURCHASE_GROUP_CONFIG_INFO] (state, saveInfo) {
            state.purchasingGroupConfigInfo = saveInfo
        }
    },
    actions: {
        // name
        GetUserConfigListInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getUserConfigListInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_PURCHASE_USER_CONFIG_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetGroupConfigListInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getGroupConfigListInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_PURCHASE_GROUP_CONFIG_INFO'], response.data)
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