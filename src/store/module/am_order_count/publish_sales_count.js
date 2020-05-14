/**
 * Created by Administrator on 2019/5/28.
 */
/**
 * 刊登销售统计
 */

import * as types from '../../mutation-type'

import {
    getPublishSalesCountInfo,
} from '@/api/am_order_count/publish_sales_count';

const config = {
    state: {
        publishSalesCountInfo: {},
    },
    mutations: {
        [types.SAVE_PUBLISH_SALE_COUNT_INFO] (state, saveInfo) {
            state.publishSalesCountInfo = saveInfo
        }
    },
    actions: {
        // name
        GetPublishSalesCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getPublishSalesCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_PUBLISH_SALE_COUNT_INFO'], response.data)
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
