/**
 * Creator: KarYanLam
 * Creation Date: 2019/9/26 17:31
 */

/**  --->>>>   |^ B2C订单执行率^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getOrderRateDayCountInfo,
    getOrderRateWeekCountInfo,
    getOrderRateMonthCountInfo,
} from '@/api/logistics_module/b2c_order_rate';

const config = {
    state: {
        orderRateDayCountInfo: {},
        orderRateWeekCountInfo: {},
        orderRateMonthCountInfo: {},
        activeShow: '',
    },
    mutations: {
        [types.SAVE_ORDER_RARE_DAY_INFO] (state, saveInfo) {
            state.orderRateDayCountInfo = saveInfo
        },
        [types.SAVE_ORDER_RARE_WEEK_INFO] (state, saveInfo) {
            state.orderRateWeekCountInfo = saveInfo
        },
        [types.SAVE_ORDER_RARE_MONTH_INFO] (state, saveInfo) {
            state.orderRateMonthCountInfo = saveInfo
        },
    },
    actions: {
        // name

        GetOrderRateDayCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getOrderRateDayCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ORDER_RARE_DAY_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetOrderRateWeekCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getOrderRateWeekCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ORDER_RARE_WEEK_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetOrderRateMonthCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getOrderRateMonthCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ORDER_RARE_MONTH_INFO'], response.data)
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