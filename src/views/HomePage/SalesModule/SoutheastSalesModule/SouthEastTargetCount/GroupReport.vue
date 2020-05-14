<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="月份">
                            <el-date-picker
                                    v-model="queryData.month"
                                    type="month"
                                    size="small"
                                    placeholder="选择月"
                                    format="yyyy-MM"
                                    value-format="yyyy-MM"
                                    :clearable="false"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="平台">
                            <el-select size="small" v-model="queryData.platform" filterable v-filter>
                                <el-option
                                        v-for="(label, value) in optionList.platformList"
                                        :key="value"
                                        :value="value"
                                        :label="value"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <!--<li>-->
                        <!--<SearchRequirement label="小组">-->
                            <!--<el-select size="small" v-model="queryData.group" filterable v-filter multiple collapseTags>-->
                                <!--<el-option-->
                                        <!--v-for="(label, value) in optionList.groupList"-->
                                        <!--:key="value"-->
                                        <!--:value="value"-->
                                        <!--:label="value"></el-option>-->
                            <!--</el-select>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                </ul>
                <div class="ui-filter-btn">
                    <el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>
                    <el-button size="small" type="primary" @click="handleQueryInfo('query')" icon="icon-chaxun">查询</el-button>
                </div>
            </div>
        </transition>
        <div class="ui-fn-module">
            <!--<span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>-->
        </div>

        <div :style="{height: height, backgroundColor: color}">
            <div class="ui-not_authority-txt" v-if="!chartData.length">
                <img src="../../../../../assets/image/empty2.png" alt="">
                <p>无数据权限</p>
            </div>
            <div v-if="chartData.length">
                <div class="ui-target_area">
                    <span>{{saveQueryMonth}}月团队目标业绩完成率</span>
                    <span class="ui-target_group">小组
                        <i :class="queryData.sort == '1' ? 'el-icon-top active': 'el-icon-top'" @click="handleClickSort('1')" title="升序"></i>
                        <i :class="queryData.sort == '2' ? 'el-icon-bottom active': 'el-icon-bottom'" @click="handleClickSort('2')" title="降序"></i>
                    </span>
                    <span class="ui-target_ratio">百分比
                        <i :class="queryData.sort == '3' ? 'el-icon-top active': 'el-icon-top'" @click="handleClickSort('3')" title="升序"></i>
                        <i :class="queryData.sort == '4' ? 'el-icon-bottom active': 'el-icon-bottom'" @click="handleClickSort('4')" title="降序"></i>
                    </span>
                </div>
                <div class="ui-container_box">
                    <div class="ui-main_area">
                        <div class="ui-left_area">
                            <ul class="clearFix">
                                <li v-for="item in saveTeamAxis">
                                    <table cellpadding="0" cellspacing="0" border="1">
                                        <tr>
                                            <td>目标业绩</td><td>{{item.target}}</td>
                                            <td>销售业绩</td><td>{{item.achievement}}</td>
                                        </tr>
                                    </table>
                                    <span :style="item.name === '所有' ? '' : 'color: #3388ff'" @click="handleClickTeam(item.id, item.name)">
                                        {{item.name}}<i></i></span>
                                </li>
                            </ul>
                        </div>
                        <div class="ui-progress_bar">
                            <li v-for="item in savePercentageNum">
                                <el-progress :text-inside="true" :stroke-width="26" :percentage="item" color="#93c6ae" v-if="item <= 100"></el-progress>
                                <el-progress :show-text="false" :stroke-width="26" :percentage="item" color="#93c6ae" v-if="item > 100"></el-progress>
                                <div class="icon_progress" v-if="item > 100"><span class="ui_percent">{{item + '%'}}</span></div>
                            </li>
                        </div>
                    </div>
                    <div class="ui-bottom_area">
                        <ul class="clearFix">
                            <li v-for="(item, index) in saveDateAxis" :style="{width: dateWidth}" :class="saveDotDate === item ? 'ui-li_active': ''">
                                <i @click="handleClickDate(item)" :class="saveDotDate === item ? 'ui-dot_active': ''"></i>
                                <span>{{item}}</span>
                            </li>
                            <div class="ui-hover_box">
                                <div>
                                    <p><i></i>{{saveQueryDate + (tipDataShow[3] === undefined ? '' : `（${tipDataShow[3]}）`)}}</p>
                                    <p><i style="background: #fa91a7"></i>
                                        同期业绩环比增长率{{tipDataShow[0] === undefined ? '' : tipDataShow[0] + (tipDataShow[0] === '-' ? '-' : '%')}}</p>
                                    <p><i style="background: #ffe065"></i>
                                        目标业绩环比增长率{{tipDataShow[1] === undefined ? '' : tipDataShow[1] + (tipDataShow[1] === '-' ? '-' : '%')}}</p>
                                    <p><i style="background: #a1e5b9"></i>
                                        超额增长率{{tipDataShow[2] === undefined ? '' : tipDataShow[2] + (tipDataShow[2] === '-' ? '-' : '%')}}</p>
                                </div>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>


        <el-dialog
                top="5vh"
                class="ui-layout_edit-dialog"
                :title="title"
                width="1200px"
                :visible.sync="isGroupShow"
                @closed="dialogSort = '1'; chartDialogData = []">
            <div style="background: #FFFFFF; height: 700px;">
                <div class="ui-not_authority-txt" v-if="!chartDialogData.length">
                    <img src="../../../../../assets/image/empty2.png" alt="">
                    <p>无数据权限</p>
                </div>
                <div v-if="chartDialogData.length">
                    <div class="ui-target_area">
                        <span>{{saveQueryMonth}}月账号目标业绩完成率</span>
                        <span class="ui-target_group">账号
                        <i :class="dialogSort == '1' ? 'el-icon-top active': 'el-icon-top'" @click="handleClickDialogSort('1')" title="升序"></i>
                        <i :class="dialogSort == '2' ? 'el-icon-bottom active': 'el-icon-bottom'" @click="handleClickDialogSort('2')" title="降序"></i>
                    </span>
                        <span class="ui-target_ratio">百分比
                        <i :class="dialogSort == '3' ? 'el-icon-top active': 'el-icon-top'" @click="handleClickDialogSort('3')" title="升序"></i>
                        <i :class="dialogSort == '4' ? 'el-icon-bottom active': 'el-icon-bottom'" @click="handleClickDialogSort('4')" title="降序"></i>
                    </span>
                    </div>
                    <div class="ui-container_box">
                        <div class="ui-main_area ui-dialog_main">
                            <div class="ui-left_area ui-dialog_left">
                                <ul class="clearFix">
                                    <li v-for="item in saveGroupAndDepAxis">
                                        <span>{{item}}<i></i></span>
                                    </li>
                                </ul>
                            </div>
                            <div class="ui-progress_bar ui-dialog_bar">
                                <li v-for="item in saveDialogPercentageNum">
                                    <el-progress :text-inside="true" :stroke-width="26" :percentage="item" color="#93c6ae" v-if="item <= 100"></el-progress>
                                    <el-progress :show-text="false" :stroke-width="26" :percentage="item" color="#93c6ae" v-if="item > 100"></el-progress>
                                    <div class="icon_progress" v-if="item > 100"><span class="ui_percent">{{item + '%'}}</span></div>
                                </li>
                            </div>
                        </div>
                        <div class="ui-bottom_area ui-dialog_bottom">
                            <ul class="clearFix">
                                <li v-for="(item, index) in saveDialogDateAxis" :style="{width: dateDialogWidth}"
                                    :class="saveDotDate === item ? 'ui-li_active': ''">
                                    <i :class="saveDotDate === item ? 'ui-dot_active': ''"></i>
                                    <span v-if="saveDotDate === item" style="left: -100%; bottom: -30px; width: 100px">{{saveQueryDate}}</span>
                                </li>
                                <div class="ui-hover_box ui-hover_box_dialog">
                                    <div>
                                        <p><i></i>{{saveQueryDate + (tipDialogDataShow[3] === undefined ? '' : `（${tipDialogDataShow[3]}）`)}}</p>
                                        <p><i style="background: #fa91a7"></i>
                                            同期业绩环比增长率{{tipDialogDataShow[0] === undefined ? '': tipDialogDataShow[0] + (tipDialogDataShow[0] === '-' ? '-' : '%')}}</p>
                                        <p><i style="background: #ffe065"></i>
                                            目标业绩环比增长率{{tipDialogDataShow[1] === undefined ? '': tipDialogDataShow[1] + (tipDialogDataShow[1] === '-' ? '-' : '%')}}</p>
                                        <p><i style="background: #a1e5b9"></i>
                                            超额增长率{{tipDialogDataShow[2] === undefined ? '' : tipDialogDataShow[2] + (tipDialogDataShow[2] === '-' ? '-' : '%')}}</p>
                                    </div>
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>


    </div>
</template>
<script>
    import echarts from 'echarts'
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';

    import {
        getCurrentMonth,
        getCurrentDateRange,
        getMonthDays,
        getTotalDays
    } from '@/api/common/date_format'

    import {
        getSouthGroupReportInfo,
        getSouthAccountReportInfo,

        getPlatformList,
        getAccountAndGroupList
    } from '@/api/sales_module/south_ease_target'



    export default {
        data() {
            return {

                showSearch: true,
                thisVm: {},

                ECharts: {},

                queryData: {
                    month: '',
                    platform: 'SHOPEE',
                    group: [],
                    date: '',
                    sort: '1',
                },
                optionList: {
                    platformList: [],
                    groupList: []
                },

                chartData: [],

                //保存默认日期
                saveDefaultMonth: '',
                saveDefaultDate: '',

                //保存日期轴
                saveDateAxis: [],
                //保存团队
                saveTeamAxis: [],
                //保存进度占比
                savePercentageNum: [],
                //保存百分比
                saveRatio: [],
                tipDataShow: [],

                //保存点击日期数
                saveDotDate: '',

                //保存查询日期
                saveQueryDate: '',
                //保存查询月份
                saveQueryMonth: '',

                //单个日期宽度
                dateWidth: 3,

                //限制2018年之前的时间查询
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < new Date('2018-01-01').getTime()
                    },
                },

                //显示小组
                isGroupShow: false,
                title: '',
                dialogSort: '1',
                chartDialogData: [],
                saveGroupAndDepAxis: [],
                saveDialogPercentageNum: [],
                saveDialogDateAxis: [],
                saveDialogRatio: [],
                tipDialogDataShow: [],
                dateDialogWidth: 3,
                saveTeamId: '',
                saveTeamName: '',

                height: '',
                color: '#fff'
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'comOptions',
                'loginInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'Fn',
            ]),
            getCurrentMonth,
            getCurrentDateRange,
            getMonthDays,
            getTotalDays,
            getSouthGroupReportInfo,
            getSouthAccountReportInfo,

            // 重置
            handleResetQueryInfo(){
                this.queryData = {
                    sort: '1',
                    platform: 'SHOPEE',
                    group: [],
                    month: this.saveDefaultMonth,
                };
                this.saveDotDate = this.saveDefaultDate.substring(this.saveDefaultDate.indexOf('-')+4);
            },

            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['target_performance']);
                }

                //判断是否大于10月
                let flag = this.queryData.month.substring(this.queryData.month.indexOf('-') + 1) < '10';

                if(params === 'query') {//点击查询
                    let currentNum = '';    //当前月
                    let clickNum = '';      //查询月
                    if(flag) {
                        clickNum = this.queryData.month.substring(this.queryData.month.indexOf('-') + 2);
                        currentNum = this.saveDefaultDate.substr(6,1)
                    }else {
                        clickNum = this.queryData.month.substring(this.queryData.month.indexOf('-') + 1);
                        currentNum = this.saveDefaultDate.substr(5,2)
                    }

                    //判断是否是当月，当月默认展示当天日期数据，否则默认查询月最后一天
                    if(currentNum === clickNum) {
                        params = this.queryData.month + '-' + this.saveDotDate;

                    }else {

                        let date = '';
                        const year = this.queryData.month.substring(0,4);

                        if(flag) {
                            date = this.queryData.month.substring(6,7)
                        }else {
                            date = this.queryData.month.substring(5,7)
                        }

                        let days = this.getTotalDays(year,date);

                        this.saveDotDate = String(days);
                        params = this.queryData.month + '-' + String(days);
                    }
                }else {//点击下方日期
                    params = this.queryData.month + '-' + this.saveDotDate;
                }

                let obj = {
                    platform: this.queryData.platform,
//                    group_id: this.queryData.group.join(','),
                    date_select: params,
                    sort: this.queryData.sort
                };

                this.saveQueryDate = obj.date_select;
                this.saveQueryMonth = obj.date_select.substring(0,obj.date_select.indexOf('-') + 3);

                this.getSouthGroupReportInfo(obj).then(({ data}) => {
                    // 导出
                    if (!data.status) {
                        this.$message.error(data.errorMess || '查询失败！');
                        return;
                    }
                    this.handleQueryInfoCallBack(data);
                }).catch(err => {
                    console.log(err);
                })
            },

            //切换类型
            handleChangeType(val) {
                if(val) {
                    this.queryData.groupName = '';
                    this.queryData.dataType = val;
                }
            },

            //点击日期
            handleClickDate(val) {
                if(val) {
                    this.saveDotDate = val;
                    this.handleQueryInfo(this.queryData.month + '-' + val);
                }
            },

            //升降序
            handleClickSort(val) {
                this.queryData.sort = val;
                this.handleQueryInfo();
            },

            //弹框升降序
            handleClickDialogSort(val) {
                this.dialogSort = val;
                this.handleClickGroupInfo(this.saveTeamId, this.saveTeamName);
            },

            //点击团队
            handleClickTeam(id, name) {
                if(id === 'total') return;
                this.saveTeamName = name;
                this.saveTeamId = id;
                this.handleClickGroupInfo(this.saveTeamId, this.saveTeamName);

            },
            handleClickGroupInfo(id, name) {

                // 获取保存的查询参数
                this.queryData = JSON.parse(this.queryParamsInfo['target_performance']);

                let obj = {
                    platform: this.queryData.platform,
                    group_id: id,
                    date_select: this.saveQueryDate,
                    sort: this.dialogSort,
                };
                this.getSouthAccountReportInfo(obj).then(({ data }) => {
                    if(data.status) {
                        this.title = `${name}`;
                        this.handleQueryGroupInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '操作失败');
                    }
                })
            },

            //小组查询回调
            handleQueryGroupInfoCallBack(data){

                this.chartDialogData = data.data.value;
                this.saveDialogDateAxis = data.data.date_report;

                const leftAxisArr = [];
                const percentageArr = [];
                const tipModuleData = [];

                this.chartDialogData.forEach(item => {
                    leftAxisArr.push(item.account_name);
                    percentageArr.push(item.ratio_4);
                    tipModuleData.push([item.ratio_1, item.ratio_2, item.ratio_3, item.group_name])
                });

                this.saveGroupAndDepAxis = leftAxisArr;
                this.saveDialogPercentageNum = percentageArr;
                this.saveDialogRatio = tipModuleData;

                this.$nextTick().then(() => {
                    const lisEle = document.querySelectorAll('.ui-dialog_bar > li');
                    const tipModule = document.querySelector('.ui-hover_box_dialog');
                    lisEle.forEach((_e, _inx) => {
                        _e.addEventListener('mousemove', (e) => {
                            tipModule.style.top = e.clientY + 'px';
                            tipModule.style.left = e.clientX + 'px';
                            if (this.saveDialogRatio[_inx].every((val, i) => {
                                    return val === this.tipDialogDataShow[i]
                                })) return;
                            this.tipDialogDataShow = [...this.saveDialogRatio[_inx]];
                        });
                    });

                    switch (this.saveDialogDateAxis.length) {

                        case 28:
                            this.dateDialogWidth = 3.24 + '%';
                            break;
                        case 29:
                            this.dateDialogWidth = 3.12 + '%';
                            break;
                        case 30:
                            this.dateDialogWidth = 3.01 + '%';
                            break;
                        case 31:
                            this.dateDialogWidth = 2.91 + '%';
                            break;
                    }
                });

                this.isGroupShow = true;
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || '操作失败')
                }
            },

            // 分页
            handleSizeChange(size) {
                this.handleQueryInfo({
                    limit: size,
                    offset: 1
                }, true);
            },
            handleCurrentChange(val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true)
            },


            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'target_performance',
                    value: JSON.stringify(this.queryData)
                });

                this.chartData = data.data.value;
                this.saveDateAxis = data.data.date_report;

                const leftAxisArr = [];
                const percentageArr = [];
                const tipModuleData = [];

                this.chartData.forEach(item => {
                    leftAxisArr.push({
                        name: item.group_name,
                        id: item.group_id,
                        target: item.target,
                        achievement: item.achievement,
                    });
                    percentageArr.push(item.ratio_4);
                    tipModuleData.push([item.ratio_1, item.ratio_2, item.ratio_3, item.group_name])
                });

                this.saveTeamAxis = leftAxisArr;
                this.savePercentageNum = percentageArr;
                this.saveRatio = tipModuleData;

                this.$nextTick().then(() => {
                    const lisEle = document.querySelectorAll('.ui-progress_bar > li');
                    const tipModule = document.querySelector('.ui-hover_box');
                    lisEle.forEach((_e, _inx) => {
                        _e.addEventListener('mousemove', (e) => {
                            tipModule.style.top = e.clientY + 'px';
                            tipModule.style.left = e.clientX + 'px';
                            if (this.saveRatio[_inx].every((val, i) => {
                                    return val === this.tipDataShow[i]
                                })) return;
                            this.tipDataShow = [...this.saveRatio[_inx]];
                        });
                    });

                    switch (this.saveDateAxis.length) {

                        case 28:
                            this.dateWidth = 3.38 + '%';
                            break;
                        case 29:
                            this.dateWidth = 3.26 + '%';
                            break;
                        case 30:
                            this.dateWidth = 3.15 + '%';
                            break;
                        case 31:
                            this.dateWidth = 3.04 + '%';
                            break;
                    }
                })
            },


        },
        created(){

            this.thisVm = this;
            try{
                getPlatformList().then(({ data }) => {
                    this.optionList.platformList = data.data;
                });
                this.getCurrentMonth().then((data) => {
                    this.saveDefaultMonth = data.month;
                    this.getCurrentDateRange().then((data) => {
                        this.saveDefaultDate = data.end;
                        this.queryData.date = this.saveDefaultDate.substring(data.end.indexOf('-') + 4);
                        this.queryData.month = this.saveDefaultMonth;
                        this.handleClickDate(this.queryData.date);
                    });
                });
            }catch (e) {
                console.log(e);
            }
        },
        mounted() {
            this.$nextTick().then(() => {
                this.height = config.setTableHeight('ui-main', ['el-tabs__header']);
            });
        },
        watch: {
            'queryData.platform'(val) {
                if (val) {
                    getAccountAndGroupList({ platform: val }).then(({ data }) => {
                        this.optionList.groupList = data.group_data;
                    })
                }
            },
        }
    }
</script>
<style lang="less" scoped>

    @textColor: #333333;
    @markColor: #cccccc;
    @bottomAxisColor: #f2832a;
    @height: 26px;
    @bottom: 19px;
    @tableBgColor: #f5f8fa;
    @tableBdColor: #e6e6e6;


    /deep/.ui-container_box {

        padding: 0;
        height: 100%;
        color: @textColor;
        font-size: 12px;
        position: relative;
        box-sizing: border-box;
        margin-top: 20px;

        .ui-main_area {
            z-index: 2;
            width: 100%;
            height: 600px;
            overflow: auto;
            overflow-x: hidden;
            /*background: yellowgreen;*/
            position: relative;

            &:hover +.ui-bottom_area .ui-hover_box {
                display: block!important;
            }

            //左边轴
            .ui-left_area {
                width: 430px;
                margin-left: 10px;
                margin-top: 5px;
                /*background: #feca87;*/

                ul {
                    margin: 0;
                    padding: 0;
                    border-right: 1px @markColor solid;
                    min-height: 600px;
                    height: fit-content;

                    li {
                        height: @height;
                        padding-bottom: @bottom;
                        padding-top: 25px;
                        /*background: red;*/
                        & > span {
                            display: inline-block;
                            width: 90px;
                            padding: 5px 13px 0 0;
                            text-align: right;
                            position: relative;
                            cursor: pointer;
                            i {
                                position: absolute;
                                right: 0;
                                top: 50%;
                                display: inline-block;
                                width: 5px;
                                height: 1px;
                                background: @markColor;
                            }
                        }

                        table {
                            margin-top: 5px;
                            border: 1px @tableBdColor solid;
                            float: left;
                            td {
                                border-right: 1px @tableBdColor solid;
                            }
                            td:last-child {
                                border-right: 0;
                            }
                            td:nth-child(2n-1) {
                                width: 60px;
                                background: @tableBgColor;
                            }
                            td:nth-child(2n) {
                                width: 100px;
                            }
                        }

                    }
                }
            }


            //进度条
            .ui-progress_bar {
                position: absolute;
                left: 450px;
                top: 36px;
                width: 80%;

                li {
                    width: 80%;
                    height: 51px;
                    margin-bottom: @bottom;
                    position: relative;
                    /*background: darkgray;*/
                }

                .el-progress-bar__innerText {
                    font-weight: bold;
                    color: #333333;
                }

                .el-progress-bar__inner {
                    width: 110%;
                }

                .icon_progress {
                    width: 100px;
                    height: 26px;
                    background: #5d8d72;
                    position: absolute;
                    right: -80px;
                    top: 0;
                    border-radius: 100px;
                    z-index: -1;

                    .ui_percent {
                        position: relative;
                        right: -20px;
                        bottom: 2px;
                        color: #FFFFFF;
                        font-size: 12px;
                        font-weight: bold
                    }
                }

            }

        }


        //日期轴
        .ui-bottom_area {
            position: absolute;
            left: 439px;
            bottom: -2px;
            width: 70%;

            ul {
                border-bottom: 2px @bottomAxisColor solid;
                position: relative;
                padding-left: 12px;
                li {
                    float: left;
                    position: relative;
                    height: 600px;

                    /*&:hover {*/
                    /*border-left: 1px #cccccc dashed;*/
                    /*}*/
                }

                li span {
                    display: inline-block;
                    position: absolute;
                    left: -50%;
                    bottom: -25px;
                    width: 100%;
                    font-weight: bold;
                    z-index: 1;
                    height: 16px;
                    line-height: 16px
                }

                li i {
                    z-index: 2;
                    position: absolute;
                    left: -3px;
                    bottom: -4px;
                    width: 5px;
                    height: 5px;
                    cursor: pointer;
                    border-radius: 50%;
                    background: #FFFFFF;
                    border: 1px solid @bottomAxisColor;


                    &:active {
                        background: @bottomAxisColor;
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                    }

                }

                .ui-dot_active {
                    background: @bottomAxisColor;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    left: -4px;
                    bottom: -6px;
                }

                .ui-li_active::after {
                    content: '';
                    display: block;
                    position: relative;
                    z-index: 3;
                    height: 100%;
                    border-left: 1px #999999 solid;
                }

                .ui-hover_box {
                    transition: .4s all linear;
                    display: none;
                    margin-left: 20px;
                    z-index: 999;
                    width: 250px;
                    height: 90px;
                    color: #fff;
                    font-size: 14px;
                    background: rgba(50,50,50,0.7);
                    border-radius: 4px;
                    text-align: left;
                    padding: 10px 0 0 10px;
                    position: fixed;
                    margin-top: 20px;

                    p {
                        height: 20px;
                        line-height: 20px;
                    }

                    i {
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background: transparent;
                        margin-right: 5px;
                    }
                }
            }
        }
    }

    .ui-not_authority-txt {
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -80px;
        margin-top: -80px;

        color: #999999;
        p {
            margin-top: 10px;
            font-size: 14px;
        }
    }

    .ui-target_area {
        text-align: left;
        font-weight: bold;
        span:nth-child(1) {
            margin-left: 20px;
        }
        .ui-target_group {
            position: absolute;
            right: 25%;
            font-size: 12px;
        }
        .ui-target_ratio {
            position: absolute;
            right: 15%;
            font-size: 12px;
        }

        .el-icon-top, .el-icon-bottom {
            color: #FFFFFF;
            background: #cccccc;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            font-size: 14px;
            cursor: pointer;
            margin: 0 3px;
        }
    }

    .ui-layout_edit-dialog {
        .ui-dialog_main {
            .ui-dialog_left {
                width: 110px;
                li {
                    height: @height!important;
                    padding-top: 0!important;
                    span {
                        width: 100px!important;
                        padding: 15px 10px 10px 0!important;
                    }
                }
            }
            .ui-dialog_bar {
                top: 20px!important;
                width: 90%;
                left: 135px;
                li {
                    height: 26px;
                }
                .ui_percent {
                    right: -50px!important;
                }
            }
        }
        .ui-dialog_bottom {
            left: 120px;
            width: 82.5%;
        }
    }

</style>
