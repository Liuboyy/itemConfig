<template>
    <div class="ui-m_table">
        <table>
            <thead>
                <tr>
                    <th rowspan="2"><div class="cell" style="width: 50px">排名</div></th>
                    <th colspan="2" v-for="(item, key, index) in tableFirstKey">
                        <div class="cell">{{item}}</div>
                    </th>
                    <th v-for="(item, key, index) in tableAfterKey">
                        <div class="cell">{{item}}</div>
                    </th>
                </tr>
                <tr>
                    <th><div class="cell">总业绩排行榜</div></th><th><div class="cell">增长排行榜</div></th>
                    <th v-for="item in tableSecondKey">
                        <table class="ui-column_table">
                            <tr>
                                <th><div class="cell">总业绩排行榜</div></th>
                                <th><div class="cell">增长排行榜</div></th>
                            </tr>
                        </table>
                    </th>
                </tr>
            </thead>
        </table>

        <div class="ui-m_table--tbody" :style="{height: tableHeight}">
            <table>
                <tbody>
                    <tr v-for="(item, index) in tableData" :key="index">
                        <td>
                            <div class="cell" style="width: 50px">
                                <span>{{item.ranking}}</span>
                            </div>
                        </td>
                        <td v-for="(prop, key, index) in tableFirstKey">
                            <div class="cell" style="background: #e6fadd">
                                <span @mouseenter="(e) => {mouseenter(item[key].usd_total_price, 'all', e)}" class="ui-span_module" @mouseleave="mouseleave">
                                    {{item[key].usd_total_price.username}}</span>
                            </div>
                        </td>
                        <td v-for="(prop, key, index) in tableFirstKey">
                            <div class="cell" style="background: #e6fadd">
                                <span @mouseenter="(e) => {mouseenter(item[key].up_usd_total_price, 'add', e)}" class="ui-span_module" @mouseleave="mouseleave">
                                    {{item[key].up_usd_total_price.username}}</span>
                            </div>
                        </td>
                        <td v-for="(prop, key, index) in tableAfterKey">
                            <table class="ui-column_table">
                                <tr>
                                    <td>
                                        <div class="cell" :style="item[key].usd_total_price.color === 'r' ? 'background: #f9b5b6' : item[key].usd_total_price.color === 'y' ? 'background: #fcf2d3' : item[key].usd_total_price.color === 'b' ? 'background: #d3e9fa': 'background: #ffffff'">
                                            <span @mouseover="(e) => {mouseenter(item[key].usd_total_price, 'all', e)}" class="ui-span_module" @mouseleave="mouseleave">
                                                {{item[key].usd_total_price.username}}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="cell">
                                            <span @mouseover="(e) => {mouseenter(item[key].up_usd_total_price, 'add', e)}" class="ui-span_module" @mouseleave="mouseleave">
                                                {{item[key].up_usd_total_price.username}}</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <div class="ui_NotData">
                        <NotData v-show="!tableData.length"></NotData>
                    </div>
                </tbody>
            </table>
        </div>
        <div class="ui-down_bar" :style="{height: tableHeight}">
            <div class="ui-down_bar--flag"></div>
        </div>

        <div class="ui-popover">
            <div v-if="isAddShow">
                <p><span class="ui_leftLine"></span>增长额</p>
                <table>
                    <tr>
                        <td>{{isYear ? '本年' : '本月'}}增长额</td><td>{{addAmount}}</td>
                    </tr>
                </table>
            </div>
            <div v-if="isAddShow">
                <p style="margin-top: 10px" v-if="!isYear"><span class="ui_leftLine"></span>上月</p>
                <p style="margin-top: 10px" v-else><span class="ui_leftLine"></span>{{lastYear + '年'}}</p>
                <div class="ui-main-module-table">
                    <el-table :data="popoverData" border>
                        <el-table-column v-for="(item, index) in popoverKey" :key="index" :label="item"
                                         :prop="lastMonthProps[index]" :width="popoverWidth"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div>
                <p style="margin-top: 10px" v-if="!isYear"><span class="ui_leftLine"></span>本月</p>
                <p style="margin-top: 10px" v-else><span class="ui_leftLine"></span>{{nowYear + '年'}}</p>
                <div class="ui-main-module-table">
                    <el-table :data="popoverData" border>
                        <el-table-column v-for="(item, index) in popoverKey" :key="index" :label="item"
                                         :prop="currentMonthProps[index]" :width="popoverWidth"></el-table-column>
                    </el-table>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import CONFIG from '@/assets/js/config';
    export default {
        name: "RankingTable",
        props: {
            tableFirstKey: {
                type: Object,
                default() {
                    return {}
                }
            },
            tableAfterKey: {
                type: Object,
                default() {
                    return {}
                }
            },
            tableSecondKey: {
                type: Array,
                default() {
                    return []
                }
            },
            tableData: {
                type: Array,
                default() {
                    return []
                }
            },
            tableProps: {
                type: Array,
                default() {
                    return []
                }
            },
            // 设置表格高度
            height: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                tableHeight: '100px',
                scrollIng: '',
                scrollIngTime: '',

                popoverData: [],
                popoverKey: [],
                popoverWidth: [],
                currentMonthProps: [],
                lastMonthProps: [],

                isAddShow: false,
                isYear: false,
                nowYear: '',
                lastYear: '',
                addAmount: ''

            }
        },
        methods: {

            // 刷新表格高度
            handleRefreshTableHeight () {
                this.$nextTick().then(() => {
                    let areaEl = document.querySelector('.ui-m_table').offsetWidth;
                    let bodyEl = document.querySelector('.ui-m_table--tbody').offsetWidth;
                    if (areaEl > bodyEl) {
                        document.querySelector('.ui-down_bar').style.display = 'none';
                    } else {
                        document.querySelector('.ui-down_bar').style.display = 'block';
                    }
                });
            },
            // 表格滚动
            handleTableScrollTbody() {
                if (this.scrollIng === 'tbody') return;
                this.handleTableScrollIng();
                this.scrollIng = 'bar';
                const areaEl = document.querySelector('.ui-down_bar');
                areaEl.scrollTop = document.querySelector('.ui-m_table--tbody').scrollTop;
            },
            handleTableScrollBar() {
                if (this.scrollIng === 'bar') return;
                this.handleTableScrollIng();
                this.scrollIng = 'tbody';
                document.querySelector('.ui-m_table--tbody').scrollTop = document.querySelector('.ui-down_bar').scrollTop;
            },
            handleTableScrollIng() {
                clearTimeout(this.scrollIngTime);
                this.scrollIngTime = setTimeout(() => {
                    this.scrollIng = '';
                }, 50)
            },

            mouseenter(row, type, e) {

                this.isYear = row.detail.is_year === 1 ? true : false;
                this.nowYear = row.detail.title_now;
                this.lastYear = row.detail.title_before;
                this.addAmount = row.detail.detail_growth;

                let dataArr = [];
                dataArr.push(row.detail);
                this.popoverData = dataArr;
                this.popoverKey = ['小组','姓名', this.isYear ? '年份' : '月份','销售额','订单量','客单价'];


                switch (type) {
                    case 'all':
                        this.currentMonthProps = ['group_name','username','title_now','detail_usd_total_price','detail_order_sum','detail_unit_price'];
                        this.isAddShow = false;
                        break;
                    case 'add':
                        this.currentMonthProps = ['group_name','username','title_now','detail_usd_total_price','detail_order_sum','detail_unit_price'];
                        this.lastMonthProps = ['group_name','username','title_before','detail_up_usd_total_price','detail_up_order_sum','detail_up_unit_price'];
                        this.isAddShow = true;
                        break;
                }

                const tipModule = document.querySelector('.ui-popover');
                const maxOffset = window.innerWidth - 550;
                const maxHeight = this.isAddShow ? window.innerHeight - 290 : window.innerHeight - 150;
                if (e.clientX > maxOffset) {
                    tipModule.style.left = e.clientX - 540 + 'px';
                } else {
                    tipModule.style.left = e.clientX + 5 + 'px';
                }
                if (e.clientY > maxHeight) {
                    tipModule.style.top = this.isAddShow ? e.clientY - 290 + 'px' : e.clientY - 150 + 'px';
                } else {
                    tipModule.style.top = e.clientY +'px';
                }

                tipModule.style.display = 'block';

            },

            mouseleave() {
                const tipModule = document.querySelector('.ui-popover');
                tipModule.style.display = 'none';
            }
        },
        created() {},
        mounted () {
            this.$nextTick().then(() => {
                this.tableHeight = CONFIG.setTableHeight('ui-main-module', 290, true);
                const callBackFn = () => {
                    let tbodyEl = document.querySelector('.ui-m_table tbody');
                    if (!tbodyEl.offsetHeight) {
                        setTimeout(() => {
                            callBackFn()
                        }, 100)
                    } else {
                        let areaEl = document.querySelector('.ui-m_table').offsetWidth;
                        let bodyEl = document.querySelector('.ui-m_table--tbody').offsetWidth;
                        if (areaEl > bodyEl) {
                            document.querySelector('.ui-down_bar').style.display = 'none';
                        } else {
                            document.querySelector('.ui-down_bar').style.display = 'block';
                        }
                        document.querySelector('.ui-down_bar--flag').style.height = tbodyEl.offsetHeight + 'px';
                    }
                };
                callBackFn();

                const bodyEl = document.querySelector('.ui-m_table--tbody');
                bodyEl.addEventListener('scroll', this.handleTableScrollTbody);

                const barEl = document.querySelector('.ui-down_bar');
                barEl.addEventListener('scroll', this.handleTableScrollBar);
            });
        },
    }
</script>

<style scoped lang="less">
    .ui-m_table {
        position: relative;
        width: 100%;
        overflow-y: auto;
        background: #FFFFFF;

        table {
            border-collapse: collapse;
            background: #FFFFFF;
        }

        thead {
            padding-right: 17px;
            display: block;
        }

        th {
            text-align: left;
            font-size: 12px;
            font-weight: 700;
            color: #666;
            background: #fafafa;
        }

        .cell {
            position: relative;
            word-wrap: normal;
            text-overflow: ellipsis;
            vertical-align: middle;
            width: 100%;
            box-sizing: border-box;
            line-height: normal;
            padding: 8px!important;
            .ui-span_module {
                cursor: pointer;
            }
        }


        tbody {
            display: block;
            overflow: auto;
        }

        tr:nth-child(2n) {
            /*background: #fafafa;*/
        }

        tr:hover td {
            background: transparent!important;
        }
    }
    .ui-m_table td, .ui-m_table th{
        border: 1px solid  #efefef;
        .cell {
            width: 100px;
        }
        .first_cell {
            width: 60px;
        }
    }

    .ui-m_table td {
        text-align: left;
        font-size: 12px;
        color: #333;
        min-width: 0;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        box-sizing: border-box;

    }

    .ui-m_table tr:first-child td{
        border-top: 0;
    }

    .ui-column_table th, .ui-column_table td {
        border-top: 0;
        border-left: 0;
        border-bottom: 0;
    }
    .ui-column_table td:nth-child(2n), .ui-column_table th:nth-child(2n) {
        border-right: 0;
    }

    .ui-down_bar {
        width: 20px;
        overflow-y: auto;
        overflow-x: hidden;
        position: fixed;
        top: 190px;
        right: 0;

        .ui-down_bar--flag {
            width: 20px;
        }
    }

    .ui-m_table--tbody {
        width: fit-content;
        overflow: auto;
    }
    /deep/.ui_NotData {
        width: 100%;
        position: absolute;
        top: 35%;
        .ui-not_data-txt p {
            margin-top: 40px;
            margin-left: 10px;
            font-size: 14px;
            color: #909399;
        }
    }

    .ui-popover {

        &:hover {
            display: block!important;
        }
        display: none;
        padding: 15px;
        z-index: 111;
        width: 540px;
        background: #ffffff;
        border: 1px #efefef solid;
        position: fixed;
        top: 0;
        left: 0;
        transition: all 0.3s ease;
        p {
            font-size: 12px;
            color: #333333;
            font-weight: bold;
            margin: 0 0 5px 8px;
            text-align: left;
            position: relative;
            .ui_leftLine {
                display: inline-block;
                width: 2px;
                height: 12px;
                background: #333333;
                position: absolute;
                left: -8px;
                top: 2px;
            }
        }

        table {
            border: 1px #efefef solid;
            td {
                padding: 8px;
            }
            td:nth-child(2n-1) {
                background: #f5f8fa;
                width: 90px;
                font-weight: bold;
            }
            td:nth-child(2n) {
                width: 450px;
            }
        }
    }

</style>