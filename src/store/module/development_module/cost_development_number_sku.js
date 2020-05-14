
/**********************************  --->>>>   |^ 各成本区间商品SPU开发数 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getCostNumberSkuDevGroupInfo,
    getCostNumberSkuDeveloperInfo,
    getCostNumberSkuDevTypeInfo,
    getCostNumberSkuProductLineInfo
} from '../../../api/development_module/cost_development_number_sku';

const config = {
    state: {
        costSkuDevelopmentGroupInfo: {},
        costSkuDeveloperInfo: {},
        costSkuDevelopmentTypeInfo: {},
        costSkuProductLineInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_COST_SKU_DEV_GROUP_INFO] (state, saveInfo) {
            state.costSkuDevelopmentGroupInfo = saveInfo
        },
        [types.SAVE_COST_SKU_DEVELOPER_INFO] (state, saveInfo) {
            state.costSkuDeveloperInfo = saveInfo
        },
        [types.SAVE_COST_SKU_DEV_TYPE_INFO] (state, saveInfo) {
            state.costSkuDevelopmentTypeInfo = saveInfo
        },
        [types.SAVE_COST_SKU_DEV_LINE_INFO] (state, saveInfo) {
            state.costSkuProductLineInfo = saveInfo
        }

    },
    actions: {
        //开发小组
        GetCostNumberSkuDevGroupInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCostNumberSkuDevGroupInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_COST_SKU_DEV_GROUP_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //开发人员
        GetCostNumberSkuDeveloperInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCostNumberSkuDeveloperInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_COST_SKU_DEVELOPER_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //开发类型
        GetCostNumberSkuDevTypeInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCostNumberSkuDevTypeInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_COST_SKU_DEV_TYPE_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //产品线
        GetCostNumberSkuProductLineInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCostNumberSkuProductLineInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_COST_SKU_DEV_LINE_INFO'], response.data)
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
