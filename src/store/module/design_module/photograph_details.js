
/**********************************  --->>>>   |^ 摄影拍摄明细 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getPhotographDetailsInfo,
} from '../../../api/design_module/photograph_details';

const config = {
    state: {
        getPhotographDetailsInfo: {},
    },
    mutations: {
        [types.SAVE_PHOTOGRAPH_DETAILS_INFO] (state, saveInfo) {
            state.getPhotographDetailsInfo = saveInfo
        },
    },
    actions: {
        // name
        GetPhotographDetailsInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getPhotographDetailsInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_PHOTOGRAPH_DETAILS_INFO'], response.data)
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
