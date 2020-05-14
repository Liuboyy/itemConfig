<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计日期">
                            <el-date-picker
                                    size="small"
                                    :clearable="false"
                                    v-model="queryData.date"
                                    type="date"
                                    placeholder="选择日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="统计维度">
                            <el-select
                                    @change="handleChangeType"
                                    size="small"
                                    v-model="queryData.type">
                                <el-option
                                        v-for="(label, value) in optionList.typeList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.type === '1'">
                        <SearchRequirement label="小组">
                            <el-select
                                    size="small"
                                    v-model="queryData.group"
                                    filterable
                                    v-filter
                                    collapseTags
                                    multiple>
                                <el-option
                                        v-for="item in optionList.groupList"
                                        :key="item.group_id"
                                        :value="item.group_id"
                                        :label="item.group_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.type === '2'">
                        <SearchRequirement label="账号">
                            <el-popover
                                    ref="popover"
                                    width="400"
                                    placement="bottom-start"
                                    trigger="manual"
                                    :visible-arrow="false"
                                    v-model="popover.account"
                                    @show="handleInTreeData">
                                <div class="ui-input__tree">
                                    <div class="ui-base--area">
                                        <el-input
                                                size="small"
                                                placeholder="输入关键字进行搜索"
                                                v-model="accountFilter">
                                        </el-input>
                                        <el-tree
                                                ref="treeEditor"
                                                node-key="key_id"
                                                show-checkbox
                                                :data="optionList.accountList"
                                                :default-expanded-keys="defaultQueryKeys"
                                                :props="defaultProps"
                                                :filter-node-method="accountFilterNode">
                                        </el-tree>
                                    </div>
                                    <div class="ui-tree__btn">
                                        <el-button type="text" @click="popover.account = false">关闭</el-button>
                                        <el-button type="text" @click="handleTreeCheckInfo()">确定</el-button>
                                    </div>
                                </div>
                            </el-popover>
                            <el-input class="ui-popover__input" readonly size="small" v-popover:popover v-model="queryData.accountName"
                                      @focus="handleFoucsInput"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="渠道">
                            <el-select size="small" v-model="queryData.channel">
                                <el-option
                                        v-for="(label, value) in optionList.channelList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="动销范围">
                            <el-select size="small" v-model="queryData.range" filterable v-filter>
                                <el-option
                                        v-for="(label, value) in optionList.rangeList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <div class="ui-filter-btn">
                    <el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>
                    <el-button size="small" type="primary" @click="handleQueryInfo()" icon="icon-chaxun">查询</el-button>
                </div>
            </div>
        </transition>
        <div class="ui-fn-module">
            <!--<span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>-->
        </div>

        <TemplateDefault :staticNum="120" color="#FFFFFF">
            <div class="ui-not_data-txt" v-if="!chartData.length">
                <img src="../../../assets/image/empty.png" alt="">
                <p>空空如也</p>
            </div>
            <div v-if="chartData.length">
                <div class="ui-target_area">
                    <span>listing{{saveMoveRate + '率'}}</span>
                    <span class="ui-target_group">{{saveQueryType}}
                        <i :class="queryData.sort == '1' ? 'el-icon-top active': 'el-icon-top'" @click="handleClickSort('1')" title="升序"></i>
                        <i :class="queryData.sort === '2' ? 'el-icon-bottom active': 'el-icon-bottom'" @click="handleClickSort('2')" title="降序"></i>
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
                                <li v-for="item in saveGroupAndAccountAxis">
                                    <span>{{item}}<i></i></span>
                                </li>
                            </ul>
                        </div>
                        <div class="ui-progress_bar">
                            <li v-for="item in saveRate">
                                <el-progress :text-inside="true" :stroke-width="26" :percentage="item" color="#93c6ae" v-if="item <= 100"></el-progress>
                                <el-progress :show-text="false" :stroke-width="26" :percentage="item" color="#93c6ae" v-if="item > 100"></el-progress>
                                <div class="icon_progress" v-if="item > 100"><span class="ui_percent">{{item + '%'}}</span></div>
                            </li>
                        </div>
                    </div>
                    <div class="ui-bottom_area">
                        <ul class="clearFix">
                            <li></li>
                            <div class="ui-hover_box">
                                <p><i></i>{{saveQueryDate + (tipDataShow[1] === undefined ? '' : `（${tipDataShow[1]}）`)}}</p>
                                <p><i style="background: #a1e5b9"></i>
                                    <span>{{saveMoveRate + '率'}}</span>{{tipDataShow[0] === undefined ? '' : tipDataShow[0] + (tipDataShow[0] === '-' ? '-' : '%')}}</p>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </TemplateDefault>
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
        getListingMoveBarInfo,
        getGroupList,
        getAccountList
    } from '../../../api/am_order_count/listing_move_bar'
    import {
        getCurrentDate
    } from '../../../api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'listing_move_bar';

    export default {
        name: component_name,
        data() {
            return {

                showSearch: true,
                thisVm: {},

                ECharts: {},

                queryData: {
                    date: '',
                    type: '1',
                    sort: '1',
                    channel: '',
                    range: '3',
                    group: [],
                    accountName: '',
                    accountId: [],
                },
                optionList: {
                    typeList: {
                        '1': '小组',
                        '2': '账号'
                    },
                    channelList: {
                        '': '全部',
                        'FBA': 'FBA',
                        'FBM': 'FBM'
                    },
                    rangeList: {
//                        '1': '7日动销',
//                        '2': '15日动销',
                        '3': '30日动销',
                        '4': '60日动销',
                        '5': '90日动销',
                        '6': '180日动销',
                        '7': '总动销'
                    },
                    accountList: [],
                    groupList: [],
                },

                popover: {
                    account: false
                },
                defaultProps: {
                    children: 'child',
                    label: 'account_name'
                },
                defaultQueryKeys: [],
                accountFilter: '',

                chartData: [],

                //保存小组/账号
                saveGroupAndAccountAxis: [],
                //保存动销率
                saveRate: [],
                saveMoveRate: '',
                //保存查询日期
                saveQueryDate: '',
                //保存查询类型
                saveQueryType: '',
                saveDefaultTime: '',
                tipDataShow: [],
                saveTip: [],
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'comOptions',
                'listingMoveBarInfo',
                'loginInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetListingMoveBarInfo',
            ]),
            getListingMoveBarInfo,
            getCurrentDate,
            getGroupList,
            getAccountList,

            handleFoucsInput() {
                setTimeout(() => {
                    this.popover.account = true;
                }, 200)
            },

            // 重置
            handleResetQueryInfo(){
                this.queryData = {
                    date: this.saveDefaultTime,
                    type: '1',
                    channel: '',
                    range: '3',
                    group: [],
                    accountId: [],
                    accountName: '',
                    sort: '1',
                }
            },

            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['listing_move_bar']);
                }

                let group_account_id = '';
                if(this.queryData.type === '1') {
                    group_account_id = this.queryData.group.length && this.queryData.group.join(',')
                }
                if(this.queryData.type === '2') {
                    group_account_id = this.queryData.accountId.map(_v => {
                        return _v.replace(/^[0-9]+_/, '');
                    }).join(',')
                }

                let obj = {
                    user_number: this.loginInfo.staff_code,
                    date_time: this.queryData.date,
                    type: this.queryData.type,
                    group_account_id: group_account_id || '',
                    canal: this.queryData.channel,
                    range: this.queryData.range,
                    sort: this.queryData.sort,
                };

                obj = Object.assign(obj || {}, params);

                this.GetListingMoveBarInfo(obj).then(({ data}) => {
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

            //切换维度
            handleChangeType(val) {
                if(val) {
                    this.queryData.group = [];
                    this.queryData.accountId = [];
                    this.queryData.accountName = '';
                }
            },

            //升降序
            handleClickSort(val) {
                this.queryData.sort = val;
                this.handleQueryInfo();
            },

            //带入数据
            handleInTreeData() {
                this.$nextTick(() => {
                    const checkIds = this.queryData.accountId;
                    this.$refs.treeEditor.setCheckedKeys(checkIds);
                });
            },
            //关键字搜索
            accountFilterNode(value, data) {
                if (!value) return true;
                return data.account_name.indexOf(value) !== -1;
            },

            handleTreeCheckInfo() {
                const [labels, ids] = [[], []];
                this.$refs.treeEditor.getCheckedNodes().forEach(item => {
                    if (!item.leaf) return;
                    labels.push(item.account_name);
                    ids.push(item.key_id);
                });
                this.queryData.accountName = labels.join(',');
                this.queryData.accountId = ids;
                this.defaultQueryKeys = ids;
                this.popover.account = false;
            },

            // 关闭树形下拉
            handleCloseTreeOption(event) {
                try {
                    if (event.path.some(_e => _e.className && _e.className.indexOf && _e.className.indexOf('ui-popover__input') > -1)) return;
                } catch (e) {
                    console.log(event);
                }
                this.popover.account = false;
                this.accountFilter = '';
            },

            handleGetOptionList() {
                this.getGroupList({
                    user_number: this.loginInfo.staff_code
                }).then(({ data }) => {
                    this.optionList.groupList = data.data;
                });
                this.getAccountList({
                    user_number: this.loginInfo.staff_code,
                }).then(({ data }) => {
                    this.optionList.accountList = data.data;
                });
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
                    key: 'listing_move_bar',
                    value: JSON.stringify(this.queryData)
                });

                const leftAxisArr = [];
                const rateArr = [];
                const tipArr = [];

                this.chartData = data.data.data.list.chart.map(item => {
                    return {
                        ...item,
                        type: this.queryData.type,
                        date: this.queryData.date
                    }
                });
                this.chartData.forEach(item => {
                    if(item.type === '1') {
                        leftAxisArr.push(item.group_name);
                        tipArr.push([item.rate, item.group_name]);
                        this.saveQueryType = '小组';
                    }else {
                        leftAxisArr.push(item.account_name);
                        tipArr.push([item.rate, item.account_name]);
                        this.saveQueryType = '账号';
                    }
                    rateArr.push(item.rate);
                    this.saveQueryDate = item.date;
                });
                this.saveRate = rateArr;
                this.saveTip = tipArr;
                this.saveGroupAndAccountAxis = leftAxisArr;
                this.saveMoveRate = this.optionList.rangeList[this.queryData.range];

                this.$nextTick().then(() => {
                    const lisEle = document.querySelectorAll('.ui-progress_bar > li');
                    const tipModule = document.querySelector('.ui-hover_box');
                    lisEle.forEach((_e, _inx) => {
                        _e.addEventListener('mousemove', (e) => {
                            tipModule.style.top = e.clientY + 'px';
                            tipModule.style.left = e.clientX + 'px';
                            if (this.saveTip[_inx].every((val, i) => {
                                    return val === this.tipDataShow[i]
                                })) return;
                            this.tipDataShow = [...this.saveTip[_inx]];
                        });
                    });
                })
            }
        },
        created(){
            this.thisVm = this;
            this.handleGetOptionList();
            try{
                this.getCurrentDate().then((data) => {
                    this.saveDefaultTime = data.date;
                    this.queryData.date = this.saveDefaultTime;
                    this.handleQueryInfo();
//                    if (JSON.stringify(this.listingMoveBarInfo) === '{}') {
//                        this.queryData.date = this.saveDefaultTime;
//                        this.handleQueryInfo();
//                    } else {
//                        // 获取保存的查询参数
//                        this.queryData = JSON.parse(this.queryParamsInfo['listing_move_bar']);
//                        this.handleQueryInfoCallBack(this.listingMoveBarInfo);
//                    }
                });
            }catch (e) {
                console.log(e);
            }
        },
        mounted() {
            document.addEventListener('click', this.handleCloseTreeOption);
        },
        watch: {
            "accountFilter"(val) {
                this.$refs.treeEditor.filter(val);
            }
        }
    }
</script>
<style lang="less" scoped>

    /deep/ .ui-echart--tooltip__flag {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 5px;
    }

    @textColor: #333333;
    @markColor: #cccccc;
    @bottomAxisColor: #f2832a;
    @height: 26px;
    @bottom: 20px;


    /deep/.ui-container_box {

        padding: 0;
        height: 100%;
        color: @textColor;
        font-size: 12px;
        position: relative;
        box-sizing: border-box;
        margin-left: 50px;
        margin-top: 20px;

        .ui-main_area {
            z-index: 2;
            width: 100%;
            height: 640px;
            overflow: auto;
            overflow-x: hidden;
            position: relative;

            &:hover +.ui-bottom_area .ui-hover_box {
                display: block!important;
            }

            //左边轴
            .ui-left_area {
                width: 120px;
                margin-left: 10px;
                margin-top: 5px;

                ul {
                    margin: 0;
                    padding: 0;
                    border-right: 1px @markColor solid;
                    min-height: 640px;
                    height: fit-content;

                    li {
                        height: @height;
                        margin-bottom: @bottom;
                        /*background: oldlace;*/
                        & > span {
                            display: inline-block;
                            width: 110px;
                            padding: 5px 10px 5px 0;
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

                    }
                }
            }


            //进度条
            .ui-progress_bar {
                position: absolute;
                left: 140px;
                top: 5px;
                width: 95%;

                li {
                    width: 82%;
                    height: @height;
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
                    width: 140px;
                    height: 26px;
                    background: #5d8d72;
                    position: absolute;
                    right: -115px;
                    top: 0;
                    border-radius: 100px;
                    z-index: -1;

                    .ui_percent {
                        position: relative;
                        right: -45px;
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
            left: 130px;
            bottom: -1px;
            width: 85%;

            ul {
                border-bottom: 1px @markColor solid;
                position: relative;
                padding-left: 12px;
                li {
                    float: left;
                    position: relative;
                    height: 600px;
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
                    left: -5px;
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
                    height: 60px;
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

    .ui-not_data-txt {
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
        margin-top: 5px;
        span:nth-child(1) {
            margin-left: 20px;
        }
        .ui-target_group {
            position: absolute;
            right: 20%;
            font-size: 12px;
        }
        .ui-target_ratio {
            position: absolute;
            right: 13%;
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
                li {
                    padding-top: 0!important;
                    span {
                        padding: 15px 10px 10px 0!important;
                    }
                }
            }
            .ui-dialog_bar {
                top: 20px!important;
                width: 92%;
                li {
                    height: 26px;
                }
            }
        }
    }

    .ui-input__tree {
        .ui-base--area {
            max-height: 400px;
            overflow: auto;
        }

        .ui-tree__btn {
            padding-left: 20px;
            border-top: 1px solid #e6e6e6;
        }
    }

</style>
