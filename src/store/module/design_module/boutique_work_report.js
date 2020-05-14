/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/22 17:18
 */

/**  --->>>>   |^ 精品工作报表^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getBoutiqueSummaryReportInfo,
    getBoutiqueDetailsReportInfo
} from '../../../api/design_module/boutique_work_report';

const config = {
    state: {
        boutiqueSummaryReportInfo: {},
        boutiqueDetailsReportInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_BOUTIQUE_SUMMARY_INFO] (state, saveInfo) {
            state.boutiqueSummaryReportInfo = saveInfo
        },
        [types.SAVE_BOUTIQUE_DETAILS_INFO] (state, saveInfo) {
            state.boutiqueDetailsReportInfo = saveInfo
        }
    },
    actions: {
        // name
        GetBoutiqueSummaryReportInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getBoutiqueSummaryReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_BOUTIQUE_SUMMARY_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetBoutiqueDetailsReportInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getBoutiqueDetailsReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_BOUTIQUE_DETAILS_INFO'], response.data)
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