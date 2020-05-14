/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/13 16:52
 */

/**  --->>>>   |^ listing动销统计^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getListingMoveBarInfo,
} from '@/api/am_order_count/listing_move_bar';

const config = {
    state: {
        listingMoveBarInfo: {},
    },
    mutations: {
        [types.SAVE_LISTING_MOVE_BAR_INFO] (state, saveInfo) {
            state.listingMoveBarInfo = saveInfo
        }
    },
    actions: {
        // name
        GetListingMoveBarInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getListingMoveBarInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_LISTING_MOVE_BAR_INFO'], response.data)
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
