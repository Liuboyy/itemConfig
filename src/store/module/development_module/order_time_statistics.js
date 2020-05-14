
/**********************************  --->>>>   |^ 跟单平均时效统计 ^|   <<<<---*****************************/

import * as types from "../../mutation-type";
import {
    getOrderGroupTimeCountInfo,
    getOrderProductLineCountInfo
} from '../../../api/development_module/order_time_statistics';

const config = {
    state: {
        orderGroupTimeCountInfo: {},
        orderProductLineCountInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_ORDER_GROUP_COUNT_INFO] (state, saveInfo) {
            state.orderGroupTimeCountInfo = saveInfo
        },
        [types.SAVE_ORDER_PRODUCT_LINE_INFO] (state, saveInfo) {
            state.orderProductLineCountInfo = saveInfo
        }
    },
    actions: {
        // name
        GetOrderGroupTimeCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getOrderGroupTimeCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ORDER_GROUP_COUNT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetOrderProductLineCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getOrderProductLineCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ORDER_PRODUCT_LINE_INFO'], response.data)
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