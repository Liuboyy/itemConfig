/**
 * Creator: KarYanLam
 * Creation Date: 2019/6/3 15:20
 */

/**  --->>>>   |^ 产品线销售趋势报表^|   <<<<---**/

import {
    getProductLineSalesTrendInfo,
} from '../../../api/development_module/product_line_trend';
import * as types from "../../mutation-type";

const config = {
    state: {
        productLineSalesTrendInfo: {
            '1': {},
            '2': {},
            '3': {},
            '4': {},
        },
        activeShow: '',
    },
    mutations: {
        [types.SAVE_PRODUCT_LINE_TREND_INFO] (state, saveInfo) {
            state.productLineSalesTrendInfo[saveInfo.type] = saveInfo;
        }
    },
    actions: {
        // name
        GetProductLineSalesTrendInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getProductLineSalesTrendInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_PRODUCT_LINE_TREND_INFO'], {
                            ...response.data,
                            type: queryData.type
                        })
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