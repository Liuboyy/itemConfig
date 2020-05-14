
/**********************************  --->>>>   |^ 摄影工作报表 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getPhotoGroupSummaryReportInfo,
    getPhotoGroupDetailsReportInfo
} from '../../../api/design_module/photograph_work_report';

const config = {
    state: {
        photoGroupSummaryReportInfo: {},
        photoGroupDetailsReportInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_PHOTO_GROUP_SUMMARY_INFO] (state, saveInfo) {
            state.photoGroupSummaryReportInfo = saveInfo
        },
        [types.SAVE_PHOTO_GROUP_DETAILS_INFO] (state, saveInfo) {
            state.photoGroupDetailsReportInfo = saveInfo
        }
    },
    actions: {
        // name
        GetPhotoGroupSummaryReportInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getPhotoGroupSummaryReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_PHOTO_GROUP_SUMMARY_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetPhotoGroupDetailsReportInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getPhotoGroupDetailsReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_PHOTO_GROUP_DETAILS_INFO'], response.data)
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