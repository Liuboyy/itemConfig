/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/23 15:45
 */

/**  --->>>>   |^ B2B订单时效^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getB2BOrderAgingDayInfo,
    getB2BOrderAgingWeekInfo,
    getB2BOrderAgingMonthInfo,
} from '@/api/logistics_module/b2b_order_aging';

const config = {
    state: {
        b2bOrderAgingDayInfo: {},
        b2bOrderAgingWeekInfo: {},
        b2bOrderAgingMonthInfo: {},
        activeShow: '',
    },
    mutations: {
        [types.SAVE_B2B_ORDER_DAY_INFO] (state, saveInfo) {
            state.b2bOrderAgingDayInfo = saveInfo
        },
        [types.SAVE_B2B_ORDER_WEEK_INFO] (state, saveInfo) {
            state.b2bOrderAgingWeekInfo = saveInfo
        },
        [types.SAVE_B2B_ORDER_MONTH_INFO] (state, saveInfo) {
            state.b2bOrderAgingMonthInfo = saveInfo
        },
    },
    actions: {
        // name

        GetB2BOrderAgingDayInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getB2BOrderAgingDayInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_B2B_ORDER_DAY_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetB2BOrderAgingWeekInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getB2BOrderAgingWeekInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_B2B_ORDER_WEEK_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetB2BOrderAgingMonthInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getB2BOrderAgingMonthInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_B2B_ORDER_MONTH_INFO'], response.data)
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