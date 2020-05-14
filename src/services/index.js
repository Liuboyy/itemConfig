import * as Storage from '@/utils/storage';
import CONFIG from '@/assets/js/config';
import qs from 'qs';
import Store from '../store';

// 获取当前页面的多页签索引
export function getThisPageLabelIndex (path) {
    for (let i = 0; i < Store.state.tabLabel.length; i++) {
        if (Store.state.tabLabel[i].path === path) {
            return i;
        }
    }

    return -1;
}

// 表格INX
export function autoAddTableInx (inx) {
    let i = parseInt(inx) + 1 + '';
    let first = '0';
    return first.repeat(4 - i.length) + i;
}

/***
 * 获取默认时间
 */
export function getDefaultTime (value = 'Y-M-D') {
    return new Promise((resolve, reject) => {
        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let month = nowTime.getMonth() + 1;
        let nowDay = nowTime.getDate();
        let [isYear, isMonth, isDay] = [value.indexOf('Y') > -1, value.indexOf('M') > -1, value.indexOf('D') > -1];
        let date1 = `${isYear ? year : ' '}-${isMonth ? month : ' '}-${isDay ? '01' : ''}`.replace(/[-\s]{2}/, '').replace(/((^\s+-)|(\s+-$)|(-$))/, '');
        let date2 = `${isYear ? year : ' '}-${isMonth ? month : ' '}-${isDay ? nowDay : ''}`.replace(/[-\s]{2}/, '').replace(/((^\s+-)|(\s+-$)|(-$))/, '');

        let hour = nowTime.getHours();
        let minute = nowTime.getMinutes();
        let second = nowTime.getSeconds();

        let [isHour, isMinute, isSecond] = [value.indexOf('h') > -1, value.indexOf('m') > -1, value.indexOf('s') > -1];
        let dateTs = `${isHour ? '00' : ' '}:${isMinute ? '00' : ' '}:${isSecond ? '00' : ''}`.replace(/[:\s]{2}/, '').replace(/((^\s+:)|(\s+:$))/, '');
        let dateTe = `${isHour ? hour : ' '}:${isMinute ? minute : ' '}:${isSecond ? second : ''}`.replace(/[:\s]{2}/, '').replace(/((^\s+:)|(\s+:$))/, '');

        let dateS = date1 + (dateTs && date1 ? ' ' + dateTs : dateTs);
        let dateE = date2 + (dateTe && date2 ? ' ' + dateTe : dateTe);

        if (dateS && dateE) {
            resolve({
                start: dateS,
                end: dateE
            });
        } else {
            reject({
                start: '0000-10-17',
                end: '9999-10-17'
            });
        }
    });
}

/***
 * 获取当天日期
 * 格式：2019-01-01
 */
export function getSingleDate () {
    return new Promise((resolve, reject) => {
        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let month = nowTime.getMonth() + 1;
        let nowDay = nowTime.getDate();
        // let date1 = year + '-' + month + '-' + '01';
        let dates = year + '-' + month + '-' + nowDay;

        if (dates) {
            resolve({
                date: dates,
            });
        } else {
            reject({
                date: 9999 - 10 - 17,
            });
        }
    });
}

/***
 * 转换日期格式
 */
Date.prototype.format = function (format) {
    var o = {
        'M+': this.getMonth() + 1, //month
        'd+': this.getDate(),    //day
        'h+': this.getHours(),   //hour
        'm+': this.getMinutes(), //minute
        's+': this.getSeconds(), //second
        'q+': Math.floor((this.getMonth() + 3) / 3),  //quarter
        'S': this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp('(' + k + ')').test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ('00' + o[k]).substr(('' + o[k]).length));
    return format;
};
/***
 * 获取下个月份
 * 格式：2019-05-01 至 2019-06-01
 */
export function getNextTime () {
    return new Promise((resolve, reject) => {
        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let month = nowTime.getMonth() + 2 > 12 ? 1 : nowTime.getMonth() + 2;
        let date1 = new Date(year, month - 1, 1).format('yyyy-MM-dd');
        let date2 = new Date(year, month, 0).format('yyyy-MM-dd');

        if (date1 && date2) {
            resolve({
                start: date1,
                end: date2
            });
        } else {
            reject({
                start: '0000-10-17',
                end: '9999-10-17'
            });
        }
    });
}

/***
 * 获取下个月份
 * 格式：2019-05 至 2019-06
 */
export function getNextMonth () {
    return new Promise((resolve, reject) => {
        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let month = nowTime.getMonth() + 2 > 12 ? 1 : nowTime.getMonth() + 2;
        let date1 = new Date(year, month - 1, 1).format('MM-dd');
        let date2 = new Date(year, month, 0).format('MM-dd');

        if (date1 && date2) {
            resolve({
                start: date1,
                end: date2
            });
        } else {
            reject({
                start: '10-17',
                end: '10-17'
            });
        }
    });
}

/***
 * 获取当年份
 * 格式：2019
 */
export function getDefaultYear() {
    return new Promise((resolve, reject) => {
        let nowTime = new Date();
        let year = nowTime.getFullYear() + '';
        let currentYear = year;

        if(currentYear){
            resolve({
                year: currentYear
            })
        }else {
            reject({
                year: '0000'
            })
        }
    })
}

/***
 * 获取当月份
 * 格式：2019-05
 */
export function getDefaultMonth () {
    return new Promise((resolve, reject) => {
        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let month = nowTime.getMonth() + 1;
        let currentMonth = year + '-' + month;

        if (currentMonth) {
            resolve({
                month: currentMonth
            });
        } else {
            reject({
                month: '0000-10'
            });
        }
    });
}

/***
 * 计算天数
 */
export function getDays () {
    let s1 = '2016-05-12';
    let s2 = '2016-05-12';
    s1 = new Date(s1.replace(/-/g, '/'));
    s2 = new Date(s2.replace(/-/g, '/'));
    let days = s2.getTime() - s1.getTime();
    let time = parseInt(days / (1000 * 60 * 60 * 24));
}

/**
 * 获取指定时间
 *      params
 *          type: 类型 默认 aftertime ; val N个月后的日期
 * */
export function getAppointDate (val, num = 3, type = 'aftertime') {
    let backVal;
    switch (type) {
        case 'aftertime':
            let month = val.match(/-\d{1,2}/)[0];
            let inx = val.search(/-\d{1,2}/);
            month *= -1;
            let totalMonth = month + num;
            let addYear = Math.floor((month + num) / 12);
            let intCountDate = totalMonth % 12 || totalMonth;

            let countDate = totalMonth <= 12 ? `${val.substring(0, inx)}-${intCountDate}` : `${val.substring(0, inx) * 1 + addYear}-${intCountDate}`;
            let is31Day = [1, 3, 5, 7, 8, 10, 12];
            let is30Day = [4, 6, 9, 11];

            let day = val.match(/-\d{1,2}$/)[0] * -1;

            if (is31Day.indexOf(intCountDate) > -1) {
                day = day > 31 ? 31 : day;
            } else if (is30Day.indexOf(intCountDate) > -1) {
                day = day > 30 ? 30 : day;
            } else {
                if (val.substring(0, 3) % 4 === 0) {
                    day = day > 29 ? 29 : day;
                } else {
                    day = day > 28 ? 28 : day;
                }
            }
            backVal = countDate + '-' + day;
            break;
    }
    return backVal;
}

// 按钮权限控制
export function autoButtonAuthorityControl (name) {
    // console.log(this);
    console.log(name);
    return false;
}

// 获取地址栏参数
export function getAddressModelParams () {
    let path = window.location.href.replace('#/', '');
    let pathParams = path.substring(path.indexOf('?') + 1, path.length);
    return qs.parse(pathParams);
}

// 刷新内容高度
let timeout;

export function refreshContentHeight (vm) {
    document.querySelector('body').style.overflow = 'hidden';
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        vm.initTable = false;
        vm.tableHeight = CONFIG.setTableHeight('ui-main-module');
        vm.initTable = true;
        document.querySelector('body').style.overflow = '';
    }, 400);
}

/**
 * 遍历表格数据
 * params:
 *          data  表格列表数据
 *          prop1 需要的key
 *          prop2 转后的value
 *           list  optionList
 * */

export function changeTableInfoProps (data, prop1, prop2, list, key = 'key', value = 'value') {
    if (Array.isArray(list)) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < list.length; j++) {
                if (list[j][key] === (data[i][prop1] + '')) {
                    data[i][prop2] = list[j][value];
                    break;
                }
            }
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            data[i][prop2] = list[data[i][prop1]];
        }
    }
}

/**
 * 距离当天30天日期
 *
 * */

export function getThirtyDayDateRange (end = new Date()) {
    const endDate = formatDate(end);
    const thirtyDay = 1000 * 60 * 60 * 24 * 29;
    const start = end.getTime() - thirtyDay;
    const startDate = formatDate(new Date(start));
    return [startDate, endDate];
}

function formatDate (date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
    const day = date.getDate() < 10 ? ('0' + date.getDate()) : (date.getDate()) ;
    return year + '-' + month + '-' + day;
}

/**
 * 跳转页面
 * @_vm vue实例
 * @_option 跳转配置 Object
 *      pageParams => 页面参数
 *      pageUrl => 页面地址
 *      pageName => 页签名称
 *      pageMain => 模块主页
 * @_type 类型: _this在当前页打开， _new在新页面打开
 * */
export function goToNewPage (vm, option = {}, type = '_this') {
    console.log(this);

    if (!vm) {
        console.error('vm is required!');
        return;
    }

    // 必传配置
    const optionRule = ['pageUrl', 'pageMain'];

    try {

        const optionConfig = {};

        // 校验是否正确调用
        for (let key of optionRule) {
            if (!option[key]) {
                console.error(`option => ${key} is required!`);
                return;
            }
        }

        let {pageParams, pageUrl, pageName, pageMain} = option;

        // 参数处理
        if (pageParams) {
            if (typeof pageParams === 'object') {
                pageParams = JSON.stringify(pageParams);
            }
        } else {
            pageParams = '';
        }

        const toPath = pageParams ? `${pageUrl}?queryParams=${pageParams}` : pageUrl;

        // 新开页面
        if (type === '_new' && option.pageMain) {
            optionConfig.pageMain = option.pageMain;
            vm.$router.push(toPath);
            vm.$store.commit('SAVE_TAB_LABELS', {
                path: pageUrl,
                name: pageName,
                index: pageUrl,
                main: pageMain,
                labelIndex: getThisPageLabelIndex(pageMain) + 1
            });
            vm.$store.commit('SAVE_NAV_INDEX', pageUrl);
        } else {  // 当前页打开
            vm.$store.commit('SAVE_PAGE_EDIT_STATE', {
                key: pageMain,
                path: toPath,
            });
            vm.$router.push(toPath);
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * @_this 实例
 * @removeObj 移除对象  => path 页签标识
 *                       => refresh 是否刷新主页面
 *                       => main 关闭后跳转页面
 * */
export function removeLabel (_this = {}, removeObj = {}) {
    const state = Store.getters;
    if (state.tabLabel.length === 1) return;
    for (let i = 0; i < state.tabLabel.length; i++) {
        if (state.tabLabel[i].path === removeObj.path) {
            if (state.tabLabel[i].index === state.navIndex) {
                if (i > 0) {
                    let path = state.tabLabel[i - 1].path;
                    if (removeObj.refresh) {
                        path += '?queryParams=1';
                    }
                    _this.$router.push(path);
                    _this.$store.commit('SAVE_NAV_INDEX', state.tabLabel[i - 1].index);
                } else {
                    let path = state.tabLabel[i + 1].path;
                    if (removeObj.refresh) {
                        path += '?queryParams=1';
                    }
                    _this.$router.push(path);
                    _this.$store.commit('SAVE_NAV_INDEX', state.tabLabel[i + 1].index);
                }
            }
            _this.$store.commit('SAVE_TAB_LABELS', {
                path: removeObj.path,
                isRemove: 1,
                isRemoveInx: i,
                main: removeObj.main
            });
            Store.commit('SAVE_PAGE_EDIT_STATE', {
                key: removeObj.main,
                path: removeObj.path,
                value: false
            })
            break;
        }
    }
}

/**
 * 修改供应商状态
 * @state 修改后状态
 * @remark 备注
 * @rows 选中数据
 * */

export function comChangeSupplierState (state, remark, rows) {
    let ids = [], states = [];
    rows.forEach(value => {
        ids.push({
            current_status: value.status_code,
            supplier_ids: value.supplier_id
        });
    });

    return {
        // 5为待禁用
        sup_status: state,
        handle_reason: remark,
        handle_sup_status: JSON.stringify(ids)
    };
}

/**
 * 重量单位换算
 * @param num 数量
 * @param unitname 原单位
 * @param outunitname 目标单位
 * @returns {number}
 *
 *  g:克
 *  kg:千克
 *  mg:毫克
 *  lb：磅
 *  oz:盎司
 *
 */
export function getNumByUnit (num, unitname, outunitname) {
    let fRate = {//换算率
        g: {
            kg: 0.001,
            mg: 1000,
            lb: 0.0022046,
            oz: 0.035274
        },
        kg: {
            g: 1000,
            mg: 1000 * 1000,
            lb: 2.2046226,
            oz: 35.2739619
        },
        mg: {

            g: 0.001,
            kg: 0.001 * 0.001,
            lb: 0.001 * 0.001 * 2.2,
            oz: 0.001 * 0.0353
        },
        lb: {
            g: 453.59237,
            kg: 0.4535924,
            mg: 453592.37,
            oz: 16
        },
        oz: {
            g: 28.3495231,
            kg: 0.0283495,
            mg: 28349.523125,
            lb: 0.0625
        }
    };
    let tnum = Math.ceil(num * fRate[unitname][outunitname] * 1000000) / 1000000;
    return tnum;
}

/**
 * 尺寸单位换算
 * @param num 数量
 * @param unitname 原单位
 * @param outunitname 目标单位
 * @returns {number}
 *
 * cm:厘米
 * mm:毫米
 * m:米
 * km：千米
 * in:英寸
 * ft:英尺
 * yd:码
 */
export function getNumByMeasure (num, unitname, outunitname) {
    let fRate = {//换算率
        cm: {
            mm: 10,
            m: 0.01,
            km: 0.00001,
            in: 0.3937008,
            ft: 0.0328084,
            yd: 0.0109361
        },
        mm: {
            cm: 0.1,
            m: 0.001,
            km: 0.00001 * 0.1,
            in: 0.0393701,
            ft: 0.0032808,
            yd: 0.0010936
        },
        m: {
            cm: 100,
            mm: 1000,
            km: 0.001,
            in: 39.3700787,
            ft: 3.2808399,
            yd: 1.0936133
        },
        km: {
            cm: 100000,
            mm: 1000 * 1000,
            m: 1000,
            in: 39.3700787 * 1000,
            ft: 3.2808399 * 1000,
            yd: 1.0936133 * 1000
        },
        in: {
            cm: 2.54,
            mm: 25.4,
            m: 0.0254,
            km: 0.0000254,
            ft: 0.0833333,
            yd: 0.0277778
        },
        ft: {
            cm: 30.48,
            mm: 304.8,
            m: 0.3048,
            km: 0.0003048,
            in: 12,
            yd: 0.3333333
        },
        yd: {
            cm: 91.44,
            mm: 914.4,
            m: 0.9144,
            km: 0.0009144,
            in: 36,
            ft: 3
        }
    };
    let tnum = Math.ceil(num * fRate[unitname][outunitname] * 1000000) / 1000000;
    return tnum;
}

/**
 * @url { string } 图片地址
 * @fileName { string } 图片名称
 * @fn { Function } 回调函数
 * @quality { number } 图片质量
 * */
export function imageUrlChangeFile (url, fileName, fn, quality = 1) {
    let image = new Image();
    image.src = url;
    image.onload = function () {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(function (blob) {
            let reader = new FileReader();
            reader.onloadend = function (e) {
                let dataurl = e.target.result;
                let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                fn(new File([u8arr], fileName, {type: mime}));
            };
            reader.readAsDataURL(blob);
        }, 'image/jpeg', quality);
    };
}

/**
 * 天->时->分->秒 转换(不可逆转)
 */
export function getNumByTime (num, unitname, outunitname) {
    if (!unitname) return '';
    let rate = {
        day: {
            hours: 24,
            minutes: 24 * 60,
            seconds: 24 * 60 * 60
        },
        hours: {
            minutes: 60,
            seconds: 60 * 60
        },

        minutes: {
            seconds: 60
        }
    };

    return num * rate[unitname][outunitname];
}

/**
 * william
 * 热调试工具，可以自由自在地在vue文件任意位置中打印，建议只在开发调试阶段使用
 * @val     variable    调试的变量
 * @method  :string     console对象中的方法名
 * @desc    :string     打印前缀
 * @fn      :function   回调函数
 */
export function makeLog (val, method = 'log', desc = '主观打印：', fn) {

    window.console[method](desc, val);

    if (typeof fn === 'function') {
        fn();
    }
    return null;
}

/**
 * william
 * 用来校验目标对象中某层数据的值是否有效（非空数组和非空对象） **只能校验目标数据是否是 非空数组或者非空对象**
 * @data    :Object             目标对象
 * @keys    :Array | String     对象的属性“路径”: 数组或者逗号分割的字符串
 * # returns Boolean
 */
export function isValidData (data, keys = []) {
    if (!Array.isArray(keys) && typeof keys !== 'string') throw new Error('isValidData方法的第二个参数需为数组或字符串！');
    const path = Array.isArray(keys) ? keys : keys.split(/,|，/g);
    if (path.length === 0) {
        return typeof data === 'object' && Object.entries(data).length > 0;
    } else {
        let flag = true;
        const result = path.reduce((pre, cur) => {
            if (!(cur in pre)) {
                flag = false;
                return pre;
            }
            return pre[cur];
        }, data);

        if (typeof result !== 'object') return false;

        return flag && result ? Object.entries(result).length > 0 : false;
    }
}

/***
 * 对象转换成相应的数组，用于筛选的用户列表
 * @obj    :Object    用户对象列表
 * # returns Array
 */
export function getArrListByObj (obj, flag = false) {
    let arr = [];
    if (obj) {
        for (let i in obj) {
            if (flag) {
                arr.push({value: obj[i], label: i});
            } else {
                arr.push({value: i, label: obj[i]});
            }
        }
    }
    return arr;
}

/***
 * 列表产品审核状态 得到圆点颜色
 * @text    :String    状态文字
 * # returns String
 */
export function getIconColor (text) {
    const obj = [
        {
            'txt': '已创建',
            'color': 'state_gray'
        },
        {
            'txt': '已',
            'color': 'state_blue'
        },
        {
            'txt': '待',
            'color': 'state_orange'
        },
        {
            'txt': '被',
            'color': 'state_red'
        },
    ];
    let color = null;
    for (let item of obj) {
        if (text.indexOf(item.txt) > -1) {
            color = item.color;
            break;
        }
    }
    return color && color;
}

/****  POST方式导出文件  ****/
export function postExcelFile(params, url) { //params是post请求需要的参数，url是请求url地址
    let form = document.createElement("form");
    form.style.display = 'none';
    form.action = url;
    form.method = "post";
    document.body.appendChild(form);

    for(let key in params){
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
    }
    form.submit();
    form.remove();

}

/**
 * 原生js实现复制指定内容的方法
 * @str 复制的字符串
 * @fn  复制成功的回调函数，也可以.then调用
 */
export function makeCopy(str, fn = null){
    // if(typeof str !== 'string') throw new Error('makeCopy方法只接受字符串参数！');
    return new Promise(resolve => {
        const input = document.createElement('input');
        input.type = 'hide';
        input.value = str;
        document.body.appendChild(input);
        input.select();
        document.execCommand('Copy');
        document.body.removeChild(input);
        // 拓展支持promise调用
        typeof fn === 'function' ? fn(str) : resolve(str);
    })
}