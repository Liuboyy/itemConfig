import axios from 'axios';
import qs from 'qs';
import store from '@/store';
import { message } from '../utils/message-box';
import {
    clearSessionStorage,
    getSessionStorage
} from '@/utils/storage';
import CONFIG from '../assets/js/config';
import router from '../router';

const rootApi = CONFIG.PRODUCTION_PATH;

let http = axios.create({
    timeout: '20000',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        'Accept': 'application/json'
    }
});

let httpFile = axios.create({
    timeout: '20000',
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

http.interceptors.request.use(config => {
    store.commit('SAVE_LOADING_STATE', true);
    return config;
}, error => {
    console.log(error);
});

http.interceptors.response.use(response => {
    store.commit('SAVE_LOADING_STATE', false);
    return response;
}, error => {
    if (error.response.status === 401) {
        if (process.env.NODE_ENV == 'production') {
            window.parent.postMessage({
                isOut: 1
            }, CONFIG.IN_PRODUCTION_PATH);
        } else {
            window.parent.postMessage({
                isOut: 1
            }, CONFIG.IN_DEVELOPMENT_PATH);
        }
    } else if (error.response.status === 402) {
        if (process.env.NODE_ENV == 'production') {
            window.parent.postMessage({
                isOut: 2
            }, CONFIG.IN_PRODUCTION_PATH);
        } else {
            window.parent.postMessage({
                isOut: 2
            }, CONFIG.IN_DEVELOPMENT_PATH);
        }
    } else {
        store.commit('SAVE_LOADING_STATE', false);
        message({
            message: '接口异常！',
            type: 'error',
            customClass: '',
        });
    }
});

httpFile.interceptors.request.use(config => {
    store.commit('SAVE_LOADING_STATE', true);
    return config;
}, error => {
    console.log(error);
});

httpFile.interceptors.response.use(response => {
    store.commit('SAVE_LOADING_STATE', false);
    return response;
}, error => {
    if (error.response.status === 401) {
        if (process.env.NODE_ENV == 'production') {
            window.parent.postMessage({
                isOut: 1
            }, CONFIG.IN_PRODUCTION_PATH);
        } else {
            window.parent.postMessage({
                isOut: 1
            }, CONFIG.IN_DEVELOPMENT_PATH);
        }
    } else if (error.response.status === 402) {
        if (process.env.NODE_ENV == 'production') {
            window.parent.postMessage({
                isOut: 2
            }, CONFIG.IN_PRODUCTION_PATH);
        } else {
            window.parent.postMessage({
                isOut: 2
            }, CONFIG.IN_DEVELOPMENT_PATH);
        }
    } else {
        store.commit('SAVE_LOADING_STATE', false);
        message({
            message: '接口异常！',
            type: 'error',
            customClass: '',
        });
    }
});

http.getAjax = function (url, params = {}) {
    // params.user_id = store.getters.loginInfo.staff_code;
    // params.user_id = '12500';
    // url = url.toLowerCase()

    if (process.env.NODE_ENV == 'production') {
        return http.get(/^http/.exec(url) ? url : rootApi + url, {params: params});
    } else {
        return http.get(url, {params: params});
    }
};

http.postAjax = function (url, params, isJson = false, allPath, type) {
    params.user_id = store.getters.loginInfo.staff_code;
    // url = url.toLowerCase()

    let obj = qs.stringify(params);
    let headConfig = {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    };
    if (isJson) {
        obj = {...params};
    }

    if (type === 'java') {
        headConfig["Content-Type"] = "application/json;charset=UTF-8";
    }

    if (process.env.NODE_ENV == 'production') {
        return http.post(allPath ? url : rootApi + url, obj, {
            headers: headConfig
        });
    } else {
        return http.post(url, obj, {
            headers: headConfig
        });
    }
};

http.fileAjax = function (url, params) {
    params.append('user_id', store.getters.loginInfo.staff_code);
    // url = url.toLowerCase()
    if (process.env.NODE_ENV == 'production') {
        return httpFile.post(rootApi + url, params);
    } else {
        return httpFile.post(url, params);
    }
};

http.getAjax_BI = function (url, params = {}) {
    params.user_id = store.getters.loginInfo.staff_code;
    params.user_name = store.getters.loginInfo.user_name;
    return http.get(url, {params: params});
};

export default http;
