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
    getAccountSalesVolumeInfo,
} from '@/api/am_order_count/account_sales_volume';

const config = {
    state: {
        accountSalesVolumeInfo: {},
    },
    mutations: {
        [types.SAVE_ACCOUNT_SALES_VOLUME_INFO] (state, saveInfo) {
            state.accountSalesVolumeInfo = saveInfo
        }
    },
    actions: {
        // name
        GetAccountSalesVolumeInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getAccountSalesVolumeInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ACCOUNT_SALES_VOLUME_INFO'], response.data)
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
