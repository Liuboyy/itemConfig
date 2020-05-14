/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/3 9:38
 */

/**  --->>>>   |^ 订单执行时效^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getOrderExecutionAgingDayInfo,
    getOrderExecutionAgingWeekInfo,
    getOrderExecutionAgingMonthInfo,
} from '@/api/logistics_module/order_execution_aging';

const config = {
    state: {
        orderExecutionAgingDayInfo: {},
        orderExecutionAgingWeekInfo: {},
        orderExecutionAgingMonthInfo: {},
        activeShow: '',
    },
    mutations: {
        [types.SAVE_ORDER_EXECUTION_DAY_INFO] (state, saveInfo) {
            state.orderExecutionAgingDayInfo = saveInfo
        },
        [types.SAVE_ORDER_EXECUTION_WEEK_INFO] (state, saveInfo) {
            state.orderExecutionAgingWeekInfo = saveInfo
        },
        [types.SAVE_ORDER_EXECUTION_MONTH_INFO] (state, saveInfo) {
            state.orderExecutionAgingMonthInfo = saveInfo
        },
    },
    actions: {
        // name

        GetOrderExecutionAgingDayInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getOrderExecutionAgingDayInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ORDER_EXECUTION_DAY_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetOrderExecutionAgingWeekInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getOrderExecutionAgingWeekInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ORDER_EXECUTION_WEEK_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetOrderExecutionAgingMonthInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getOrderExecutionAgingMonthInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ORDER_EXECUTION_MONTH_INFO'], response.data)
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