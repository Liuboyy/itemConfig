
/**********************************  --->>>>   |^ 美工修图明细 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getArtworkRepairDetailsInfo
} from '../../../api/design_module/artwork_repair_details';

const config = {
    state: {
        artworkRepairDetailsInfo: {},
    },
    mutations: {
        [types.SAVE_ARTWORK_REPAIR_DETAILS_INFO] (state, saveInfo) {
            state.artworkRepairDetailsInfo = saveInfo
        }
    },
    actions: {
        // name
        GetArtworkRepairDetailsInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getArtworkRepairDetailsInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ARTWORK_REPAIR_DETAILS_INFO'], response.data)
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
