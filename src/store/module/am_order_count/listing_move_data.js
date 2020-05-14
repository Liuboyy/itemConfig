/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/17 21:45
 */

/**  --->>>>   |^ listing动销数据报表^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getListingMoveDataGroupReportInfo,
} from '@/api/am_order_count/listing_move_data';

const config = {
    state: {
        listingMoveDataInfo: {},
    },
    mutations: {
        [types.SAVE_LISTING_MOVE_DATA_INFO] (state, saveInfo) {
            state.listingMoveDataInfo = saveInfo
        }
    },
    actions: {
        // name
        GetListingMoveDataGroupReportInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getListingMoveDataGroupReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_LISTING_MOVE_DATA_INFO'], response.data)
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
