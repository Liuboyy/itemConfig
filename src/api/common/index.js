import http from '@/http';
import CONFIG from '@/assets/js/config';

/**
 * 打印接口
 * @html (string) 打印模板字符串
 * */
export function printHtml (params = {}) {
    const data = {
        // ...CONFIG.ajaxData,
        ...params
    };
    return new Promise(resolve => {
        fetch('http://192.168.31.6:9130/print/printHtml', {
            method: 'POST',
            mode: 'no-cors',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded' // 指定提交方式为表单提交
            }),
            body: new URLSearchParams(Object.entries(data)).toString()
        }).then((res) => {
            resolve(1);
        }).catch((e) => {
        });
    });
}

/**
 * 获取小组下拉接口
 * */
export function getGroupOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    }
    return http.getAjax('/amazon/Sale_summary/getSelectList', data);
}

/**
 * 根据一级小组获取二级小组
 */
export function getComSecondGroupByOneGroup(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/common/Common_function/getGroupListById', data);
}


/**
 * 根据一级/二级小组获取人员
 * 1-开发, 2-品控, 3-文案, 4-摄影,5-美工1, 6-样品跟单, 7-美工2, 8-美工3
 */
export function getComDeveloperBySecondGroup(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/common/Common_function/getUserListById', data);
}

//文案编辑根据小组获取小组组员
export function getGroupMember(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/copywriter/Copywrite_group/getGroupMember', data);
}

//根据上级产品线id获取下级产品线
export function getProductLineList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/development/Spu_link_pending/getProductGroups', data);
}

/**
 * 获取java token
 * @type get post
 * @url api
 * @params data
 * */
export function getJavaToken(type, url, params = {}) {
    const data = {
        ...CONFIG.ajaxData
    };
    return new Promise((resolve, reject) => {
        http.getAjax('/login/Java_server_oauth2/getAccessToken', data).then(({ data }) => {
            if (url) {
                if (type === 'GET') {
                    http.getAjax(url, {...params, access_token: data.access_token}).then(data => {
                        resolve(data);
                    })
                } else if (type === 'POST'){
                    http.postAjax(`${url}?access_token=${data.access_token}`, {...params}, true, true, 'java').then(data => {
                        resolve(data);
                    })
                }
                // access_token
                // fn().then(data => {
                //     resolve(data);
                // })
            } else {
                resolve(data);
            }
        }).catch(e => {
            reject(e);
        })
    });
}