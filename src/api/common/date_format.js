/**
 * 当前日期前一天
 * 格式：2019-05-01 至 2019-05-04（当前日期5号）
 * **/
export function getPreDateRange () {
    return new Promise((resolve, reject) => {
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let nowDate = new Date(new Date().getTime()).format('d');
        let lastDate = new Date(new Date().getTime() - 24*60*60*1000).format('d');
        if(month < 10) { month = '0' + month } else { month = month}
        if(lastDate < 10) { lastDate = '0' + lastDate } else { lastDate = lastDate }

        let dateStart = '';
        let dateEnd = '';

        if(nowDate == '1') {//如果是一号 则默认上月1号到上月最后一天
            dateStart = getLastMonthStartDate();
            dateEnd = getLastMonthEndDate();
        }else {
            dateStart = year + '-' + month + '-' + '01';
            dateEnd = year + '-' + month + '-' + lastDate;
        }

        if (dateStart && dateEnd) {
            resolve({
                start: dateStart,
                end: dateEnd
            });
        } else {
            reject({
                start: '0000-10-17',
                end: '9999-10-17'
            });
        }
    });
}

/**
 * 当前月1号至当前时间
 * 格式：2019-05-01 至 2019-05-15（当前日期15号）
 * **/
export function getCurrentDateRange () {
    return new Promise((resolve, reject) => {
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let date = new Date(new Date().getTime()).format('d');
        if(month < 10) { month = '0' + month } else { month = month}
        if(date < 10) { date = '0' + date } else { date = date }
        let dateStart = year + '-' + month + '-' + '01';
        let dateEnd = year + '-' + month + '-' + date;

        if (dateStart && dateEnd) {
            resolve({
                start: dateStart,
                end: dateEnd
            });
        } else {
            reject({
                start: '0000-10-17',
                end: '9999-10-17'
            });
        }
    });
}
//上一年到当前年
export function getYearRange() {
    return new Promise((resolve, reject) => {
        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let lastYear =nowTime.getFullYear()-1;
        if(year && lastYear){
            resolve({
                start: lastYear,
                end: year
            })
        }else {
            reject({
                start: '2015',
                end: '2019'
            })
        }
    })
}

/**
 * 上月份 到 当前月份
 * 格式：2019-05 至 2019-06（当前月份6月份）
 * **/
export function getMonthRange () {
    return new Promise((resolve, reject) => {
        let year = new Date().getFullYear();
        let preMonth = new Date().getMonth();
        let currentMonth = new Date().getMonth() + 1;
        if(currentMonth < 10) { currentMonth = '0' + currentMonth } else { currentMonth = currentMonth}
        let dateEnd = year + '-' + currentMonth;
        if(preMonth==0){
            preMonth=12;
            year=year-1
        }else{
            if(preMonth < 10) { preMonth = '0' + preMonth } else { preMonth = preMonth}
        }
        let dateStart = year + '-' + preMonth;
        if (dateStart && dateEnd) {
            resolve({
                start: dateStart,
                end: dateEnd
            });
        } else {
            reject({
                start: '0000-10',
                end: '9999-10'
            });
        }
    });
}

/**
 * 当前月往前推6个月份
 * 格式：2019-02 至 2019-07（包含当前月）
 * **/
export function getSixMonthRange () {
    return new Promise((resolve, reject) => {

        // 先获取当前时间
        let curDate = (new Date()).getTime();
        // 将半年的时间单位换算成毫秒
        let halfYear = 365 / 2 * 24 * 3600 * 1000;
        let pastResult = curDate - halfYear;  // 半年前的时间（毫秒单位）

        // 日期函数，定义起点为半年前
        let pastDate = new Date(pastResult),
            pastYear = pastDate.getFullYear(),
            pastMonth = pastDate.getMonth() + 1;

        let year = new Date().getFullYear();
        let currentMonth = new Date().getMonth() + 1;

        if (pastMonth < 10) { pastMonth = '0' + pastMonth } else { pastMonth = pastMonth}
        if (currentMonth < 10) { currentMonth = '0' + currentMonth } else { currentMonth = currentMonth}
        let dateStart = pastYear + '-' + pastMonth;
        let dateEnd = year + '-' + currentMonth;

        if (dateStart && dateEnd) {
            resolve({
                start: dateStart,
                end: dateEnd
            });
        } else {
            reject({
                start: '0000-10',
                end: '9999-10'
            });
        }
    });
}


/**
 * 当前月前一月份
 * 格式：2019-04（当前5月份）
 * **/
export function getPreMonth () {
    return new Promise((resolve, reject) => {
        let year = new Date().getFullYear();
        let months = new Date().getMonth();
        if (months == 0 ) {
            months = 12;
            year = year - 1
        }else {
            if(months < 10) { months = '0' + months } else { months = months }
        }

        let month = year + '-' + months;

        if (month) {
            resolve({
                month: month,
            });
        } else {
            reject({
                month: '0000-10',
            });
        }
    });
}

/**
 * 当前月份
 * 格式：2019-06（当前月份6月）
 * **/
export function getCurrentMonth () {
    return new Promise((resolve, reject) => {
        let year = new Date().getFullYear();
        let months = new Date().getMonth() + 1;
        if(months < 10) { months = '0' + months } else { months = months }
        let month = year + '-' + months;
        if (month) {
            resolve({
                month: month,
            });
        } else {
            reject({
                month: '0000-10',
            });
        }
    });
}


/**
 * 一月份到当前月份
 * 格式：2019-01 至 2019-08（当前月份8月）
 * **/
export function getFirstToCurrentMonthRange () {
    return new Promise((resolve, reject) => {
        let year = new Date().getFullYear();
        let months = new Date().getMonth() + 1;
        if(months < 10) { months = '0' + months } else { months = months }

        let startMonth = year + '-' + '01';
        let endMonth = year + '-' + months;

        if (startMonth && endMonth) {
            resolve({
                start: startMonth,
                end: endMonth,
            });
        } else {
            reject({
                start: '0000-00',
                end: '0000-12',
            });
        }
    });
}

/**
 * 现年份
 * 格式：2019
 * **/
export function getCurrentYear() {
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

/**
 * 当天
 * 格式：2019-07-12
 * **/
export function getCurrentDate() {
    return new Promise((resolve, reject) => {
        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let month = nowTime.getMonth() + 1;
        let date = nowTime.getDate();

        if(month < 10) month = '0'+ month;
        if(date < 10) date = '0'+ date;

        let currentDate = year + '-' + month + '-' + date;

        if(currentDate){
            resolve({
                date: currentDate
            })
        }else {
            reject({
                year: '0000-00-00'
            })
        }
    })
}

/**
 * 快捷方式计算：上周、本周
 * 格式：星期一 到 星期天
 *  参数都是以周一为基准的
 * 上周的开始时间 console.log(getQuickTime(7));
 * 上周的结束时间 console.log(getQuickTime(1));
 * 本周的开始时间 console.log(getQuickTime(0));
 * 本周的结束时间 console.log(getQuickTime(-6));
 **/
export function getQuickTime(n){
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth()+1;
    let date = now.getDate();
    let day = now.getDay();

    if(day !== 0){//判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
        n = n + (day - 1);
    }
    else{
        n = n + day;
    }
    if(day){//这个判断是为了解决跨年的问题
        if(month > 1){
            month = month;
        }
        else{//这个判断是为了解决跨年的问题,月份是从0开始的
            year = year - 1;
            month = 12;
        }
    }
    now.setDate(now.getDate() - n);
    year = now.getFullYear();
    month = now.getMonth()+1;
    date = now.getDate();

    const time = year + "-" + (month < 10 ? ('0'+ month) : month) + "-" + (date < 10 ? ('0'+ date) : date);
    return time;
}
/**
 * 格式化日期：yyyy-MM-dd
 * **/
export function formatDate (date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1));
    const day = date.getDate() >= 10 ? (date.getDate()) : ('0' + date.getDate());
    return year + '-' + month + '-' + day;
}

/**
 * 获得某月的天数
 * @param myMonth
 * @returns {number}
 */
export function getMonthDays(myMonth){
    let monthStartDate = new Date(nowYear, myMonth, 1);
    let monthEndDate = new Date(nowYear, myMonth + 1, 1);
    let days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
    return days;
}

let now = new Date(); //当前日期
let nowDayOfWeek = now.getDay(); //今天本周的第几天
let nowDay = now.getDate(); //当前日
let nowMonth = now.getMonth(); //当前月
let nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0;
let lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth()-1);
let lastYear = lastMonthDate.getYear();
let lastMonth = lastMonthDate.getMonth();

/**
 * 获得本月的开始日期
 * @returns {*}
 */
export function getCurrentMonthStartDate(){
    var monthStartDate = new Date(nowYear,nowMonth, 1);
    return formatDate(monthStartDate);
}
/**
 * 获得本月的结束日期
 * @returns {*}
 */
export function getCurrentMonthEndDate(){
    var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
    return formatDate(monthEndDate);
}

/**
 * 获得上月开始日期
 * @returns {*}
 */
export function getLastMonthStartDate(){
    var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
    return formatDate(lastMonthStartDate);
}

/**
 * 获得上月结束日期
 * @returns {*}
 */
export function getLastMonthEndDate(){
    var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
    return formatDate(lastMonthEndDate);
}

/**
 * 获取当前一天前后N天日期
 * @param AddDayCount
 * @returns {string}
 * console.log("一月前："+GetDateStr(-30));
 * console.log("昨天："+GetDateStr(-1));
 * console.log("今天："+GetDateStr(0));
 * console.log("明天："+GetDateStr(1));
 * console.log("一月后："+GetDateStr(30));
 */
export function getCountDate(AddDayCount) {
    let dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天前/后的日期
    let y = dd.getFullYear();
    let m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
    let d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
    return y+"-"+m+"-"+d;
}

/***
 * 获取一个月的总天数
 */
export function getTotalDays(year,month){
    let dayCount;
    let now = new Date(year,month, 0);
    dayCount = now.getDate();
    return dayCount;
}

/***
 * 验证开始时间小于结束时间
 * @param startTime
 * @param endTime
 * @returns {boolean}
 */

export function validTime(startTime, endTime){
    let arr1 = startTime && startTime.split("-");
    let arr2 = endTime && endTime.split("-");
    let date1 = new Date(parseInt(arr1 && arr1[0]), parseInt(arr1 && arr1[1])-1, parseInt(arr1 && arr1[2]),0,0,0);
    let date2 = new Date(parseInt(arr2 && arr2[0]), parseInt(arr2 && arr2[1])-1, parseInt(arr2 && arr2[2]),0,0,0);
    if (date1.getTime() > date2.getTime()) {
        return false;
    } else {
        return true;
    }
    return false;
}

//验证时间
export function validTime1(startTime, endTime){
    let date1=new Date(startTime)
    let date2=new Date(endTime)
    if (date1.getTime() > date2.getTime()) {
        return false;
    } else {
        return true;
    }
    return false;
}


export function IntervalDays(BeginDate,EndDate) {
    let begin = new Date(BeginDate);
    let end = new Date(EndDate);
    let beginDate = begin.getTime(begin);
    let endDate = end.getTime(end);
    let days = Math.floor((endDate - beginDate) / (24 * 3600 * 1000));
    return days;

}
