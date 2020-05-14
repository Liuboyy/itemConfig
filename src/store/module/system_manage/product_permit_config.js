/**
 * Creator: KarYanLam
 * Creation Date: 2019/6/5 22:11
 */

/**  --->>>>   |^ 产品权限配置^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getProductUserConfigInfo,
    getProductRoleConfigInfo
} from '@/api/system_manage/product_permit_config';

const config = {
    state: {
        productUserConfigInfo: {},
        productRoleConfigInfo: {},
        activeName: '',
    },
    mutations: {
        [types.SAVE_PRODUCT_USER_CONFIG_INFO] (state, saveInfo) {
            state.productUserConfigInfo = saveInfo
        },
        [types.SAVE_PRODUCT_ROLE_CONFIG_INFO] (state, saveInfo) {
            state.productRoleConfigInfo = saveInfo
        }
    },
    actions: {
        // name
        GetProductUserConfigInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getProductUserConfigInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_PRODUCT_USER_CONFIG_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetProductRoleConfigInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getProductRoleConfigInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_PRODUCT_ROLE_CONFIG_INFO'], response.data)
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