/**  =========================> *|`| % name % |`|*<======================== **/

// import * as types from 'moduleType'

// import {
//     api,
// } from '@/api'

const config = {
    state: {
        key: {},
    },
    mutations: {
        [types.types] (state, saveInfo) {
            state.key = saveInfo
        }
    },
    actions: {
        // name
        Fn ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                fn(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['types'], response.data)
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

