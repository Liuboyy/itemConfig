
/**************************  --->>>>   |^ 供应商平均到样时效 ^|   <<<<---************************/

import {
    getSupplierArrivalCountInfo,
} from '../../../api/development_module/supplier_arrival_statistics';
import * as types from "../../mutation-type";

const config = {
    state: {
        supplierArrivalCountInfo: {},
    },
    mutations: {
        [types.SAVE_SUPPLIER_ARRIVAL_INFO] (state, saveInfo) {
            state.supplierArrivalCountInfo = saveInfo
        }
    },
    actions: {
        // name
        GetSupplierArrivalCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getSupplierArrivalCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_SUPPLIER_ARRIVAL_INFO'], response.data)
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