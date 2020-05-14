
/**********************************  --->>>>   |^ 美工平均耗时统计 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getArtistGroupTimeCountInfo,
    getArtistProductLineTimeCountInfo,
} from '../../../api/design_module/artist_time_statistics';

const config = {
    state: {
        artistGroupTimeCountInfo: {},
        artistProductLineTimeCountInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_ARTIST_GROUP_TIME_COUNT_INFO] (state, saveInfo) {
            state.artistGroupTimeCountInfo = saveInfo
        },
        [types.SAVE_ARTIST_PRODUCT_LINE_COUNT_INFO] (state, saveInfo) {
            state.artistProductLineTimeCountInfo = saveInfo
        },
    },
    actions: {
        // name
        GetArtistGroupTimeCountInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getArtistGroupTimeCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ARTIST_GROUP_TIME_COUNT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetArtistProductLineTimeCountInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getArtistProductLineTimeCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ARTIST_PRODUCT_LINE_COUNT_INFO'], response.data)
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
