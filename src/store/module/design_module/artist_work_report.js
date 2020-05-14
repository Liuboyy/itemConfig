
/**********************************  --->>>>   |^ 美工工作报表 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getArtistGroupSummaryReportInfo,
    getArtistGroupDetailsReportInfo
} from '../../../api/design_module/artist_work_report';

const config = {
    state: {
        artistGroupSummaryReportInfo: {},
        artistGroupDetailsReportInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_ARTIST_GROUP_SUMMARY_INFO] (state, saveInfo) {
            state.artistGroupSummaryReportInfo = saveInfo
        },
        [types.SAVE_ARTIST_GROUP_DETAILS_INFO] (state, saveInfo) {
            state.artistGroupDetailsReportInfo = saveInfo
        }
    },
    actions: {
        // name
        GetArtistGroupSummaryReportInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getArtistGroupSummaryReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ARTIST_GROUP_SUMMARY_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetArtistGroupDetailsReportInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getArtistGroupDetailsReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ARTIST_GROUP_DETAILS_INFO'], response.data)
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
