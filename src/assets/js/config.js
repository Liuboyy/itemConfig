import {
    getQuickTime,
    getCurrentMonthStartDate,
    getCurrentMonthEndDate,
    getLastMonthStartDate,
    getLastMonthEndDate,
} from '../../api/common/date_format';

import AUTHORITY_BUTTON from '@/authority/button_config'

const HEIGHTINFO = {
    NAV: 0,
    WINDOW_HEIGHT: window.innerHeight,
    TAP_HEIGHT: 30,
    TABLE_MARGIN: 0
};

const RULE_CONFIG = {

    // 手机
    phone: {
        pattern: /^[0-9]{11}$/,
        trigger: 'blur',
        message: '输入有误！'
    },

    // 纯数字
    number: {
        pattern: /^[0-9]+$/,
        trigger: 'blur',
        message: '输入有误！'
    },

    // 身份证
    idNumber: {
        pattern: /^[0-9A-Za-z]+$/,
        trigger: 'blur',
        message: '输入有误！'
    },

    // 邮箱
    email: {
        pattern: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
        trigger: 'blur',
        message: '输入有误！'
    },

    // 必填
    requiredBlur: [
        {
            required: true,
            trigger: 'blur',
            message: '带*号不能为空！'
        },
        {
            pattern: /^[!@#$%^&*()_=\-+{}\[\]':;"“”，。,.\?\/A-Za-z0-9<>\u4e00-\u9fa5]+/,
            trigger: 'blur',
            message: '输入有误！'
        }
    ],

    // 必填
    requiredChange: {
        required: true,
        trigger: 'change',
        message: '带*号不能为空！'
    },

    image: ['.png', '.jpeg', '.gif', '.jpg']
};

/**
 * 日期快捷键
 */
const DATE_SHORTCUT = {

    lastDay: {
        text: '昨日',
        onClick(picker) {
            const start = new Date();
            const end = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
        }
    },
    currentDay: {
        text: '今日',
        onClick(picker) {
            const start = new Date();
            const end = new Date();
            start.setTime(start.getTime());
            end.setTime(end.getTime());
            picker.$emit('pick', [start, end]);
        }
    },
    lastWeek: {
        text: '上周',
        onClick(picker) {
            picker.$emit('pick', [getQuickTime(7), getQuickTime(1)]);
        }
    },
    currentWeek: {
        text: '本周',
        onClick(picker) {
            picker.$emit('pick', [getQuickTime(0), getQuickTime(-6)]);
        }
    },
    lastMonth: {
        text: '上月',
        onClick(picker) {
            picker.$emit('pick', [getLastMonthStartDate(),getLastMonthEndDate()]);
        }
    },
    currentMonth: {
        text: '本月',
        onClick(picker) {
            picker.$emit('pick', [getCurrentMonthStartDate(), getCurrentMonthEndDate()]);
        }
    },
    lastDay_7: {
        text: '过去7天',
        onClick(picker) {
            const start = new Date();
            const end = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
        }
    },
    lastDay_30: {
        text: '过去30天',
        onClick(picker) {
            const start = new Date();
            const end = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
        }
    },
    lastDay_60: {
        text: '过去60天',
        onClick(picker) {
            const start = new Date();
            const end = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 60);
            end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
        }
    },
};

const CONFIG = {
    ajaxData: {
        request_type: 1
    },
    pageData: {
        pageSize: 20,
        pageTotal: 0,
        pageSizes: [20, 50, 100, 200]
    },

    //部门对应
    departmentInfo: {
        '1': '开发',
        '2': '品控',
        '4': '摄影',
        '3': '文案',
        '5': '美工'
    },
    setTableHeight (_e, other, _d) {
        let extra = _d ? [] : ['ui-search-area', 'ui-fn-module', 'ui-main-module-page'];
        if (Array.isArray(other) && other.length) {
            extra = extra.concat(other);
        } else if (_d) {
            extra = other ? other : 0;
        }

        let mainView = window.getEleAttr(`.${_e}`);
        let tableHeight = HEIGHTINFO.NAV + HEIGHTINFO.TAP_HEIGHT + HEIGHTINFO.TABLE_MARGIN;
        let userAgent = navigator.userAgent;
        if (_d) {
            tableHeight += extra;
        } else {
            for (let i = 0; i < extra.length; i++) {

                // 获取容器元素
                let ele = window.getEleAttr(`.${extra[i]}`, mainView);
                if (!ele) continue;
                tableHeight += ele.offsetHeight;

                let eleMargin, eleTBMargin;
                let eleCss = document.defaultView.getComputedStyle(ele);
                if (userAgent.indexOf('Firefox') > -1) {
                    eleTBMargin = parseInt(eleCss['margin-top']) + parseInt(eleCss['margin-bottom']);
                } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !userAgent.indexOf('Opera') > -1) {
                    let ieCss = ele.currentStyle;
                    eleTBMargin = parseInt(ieCss['marginTop']) + parseInt(ieCss['marginBottom']);
                } else {
                    eleMargin = eleCss.margin.split(' ');
                    eleTBMargin = parseInt(eleMargin[2]) ? parseInt(eleMargin[0]) + parseInt(eleMargin[2]) : parseInt(eleMargin[0]);
                }
                tableHeight = eleTBMargin + tableHeight;
            }
        }

        tableHeight = window.innerHeight - tableHeight;
        return tableHeight + 'px';
    },
    HOME_PATH: 'http://192.168.9.126:8864',
    // IN_PRODUCTION_PATH: 'http://secapi.yibainetwork.com',
    IN_PRODUCTION_PATH: document.referrer,
    IN_DEVELOPMENT_PATH: 'http://192.168.9.126:8864',
    // PRODUCTION_PATH: 'http://sec.yibainetwork.com'
    PRODUCTION_PATH: window.location.origin,
    FIP_PATH: process.env.NODE_ENV == 'production' ? window.location.origin : 'http://192.168.9.126:8871',

    // 搜索框宽度
    SEARCH_DATE_WIDTH: '438',

    // 规则
    RULE_CONFIG,

    //日期快捷方式
    DATE_SHORTCUT,

    // 权限资源
    AUTHORITY_BUTTON,

    // 文件token
    FILE_ACCESS_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJyZWFkIl0sImV4cCI6MjU1NTkyMTc0OCwiYXV0aG9yaXRpZXMiOlsiMTAiXSwianRpIjoiMzU0NDFjZWUtMDJmNi00YzIzLTkyYTUtMzljMWJiZjVmOTQ1IiwiY2xpZW50X2lkIjoiZmlsZSJ9.uw1pWZHf2H9Zpi85vKL557F6wxrcuHp_18619HJyUrA',

    // BI path
    BI_PATH: '',
    BI_PATH2: '',
    BI_ON_LINE_PATH: 'http://47.106.223.247:8802',
    HZ_PATH:'http://120.76.117.210:8600',

    // JAVA接口地址
    JAVA_PATH: 'http://rest.dev.java.yibainetworklocal.com'
};

export default CONFIG;
