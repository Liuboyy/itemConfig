/**
 * Creator: KarYanLam
 * Creation Date: 2019/12/4 14:13
 */

/**  --->>>>   |^ 亚马逊退单统计^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getAmazonReturnOrderAccountInfo,
    getAmazonReturnOrderSiteInfo
} from '@/api/sales_module/amazon_return_order_count';

const config = {
    state: {
        returnOrderAccountInfo: {},
        returnOrderSiteInfo: {},
        activeShow: '',
    },
    mutations: {
        [types.SAVE_RETURN_ORDER_ACCOUNT_INFO] (state, saveInfo) {
            state.returnOrderAccountInfo = saveInfo
        },
        [types.SAVE_RETURN_ORDER_SITE_INFO] (state, saveInfo) {
            state.returnOrderSiteInfo = saveInfo
        }
    },
    actions: {
        // name
        GetAmazonReturnOrderAccountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getAmazonReturnOrderAccountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_RETURN_ORDER_ACCOUNT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetAmazonReturnOrderSiteInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getAmazonReturnOrderSiteInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_RETURN_ORDER_SITE_INFO'], response.data)
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