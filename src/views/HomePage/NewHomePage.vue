<template>
    <div class="ui-home_wrap">
        <div class="ui-top_wrap common">
            <ul class="clearFix">
                <li v-for="item in dateList" class="ui-common__date">
                    <span @click="handleClickDate('top', item.value)" :class="activeIndex.top == item.value ? 'ui-link' : ''">{{item.label}}</span>
                    <span v-if="item.value != dateList.length">/</span>
                </li>
            </ul>
            <ul class="clearFix">
                <li v-for="item in titleList" class="ui-top_wrap__img">
                    <span>{{item.label}}</span>
                    <span class="ui_num">{{item.num}}</span>
                </li>
            </ul>
        </div>
        <div class="ui-middle_wrap common">
            <ul class="clearFix">
                <li v-for="item in dateList" class="ui-common__date">
                    <span @click="handleClickDate('middle', item.value)" :class="activeIndex.middle == item.value ? 'ui-link' : ''">{{item.label}}</span>
                    <span v-if="item.value != dateList.length">/</span>
                </li>
            </ul>
        </div>
        <div class="ui-bottom_wrap common">
            <ul class="clearFix">
                <li v-for="item in dateList" class="ui-common__date">
                    <span @click="handleClickDate('bottom', item.value)" :class="activeIndex.bottom == item.value ? 'ui-link' : ''">{{item.label}}</span>
                    <span v-if="item.value != dateList.length">/</span>
                </li>
            </ul>
            <div class="ui-bottom_wrap__table">
                <ComTableInfo
                        ref="tableArea"
                        :height="240"
                        :tableKey="tableKey"
                        :tableProps="tableProps"
                        :tableData="tableData"
                        :tableWidth="tableWidth"
                        :showSearch="showSearch">
                </ComTableInfo>
            </div>
        </div>
    </div>
</template>
<script>

    export default{
        data(){
            return {

                //搜索缩进
                showSearch: true,

                tableKey: ['平台', '订单总量', '销售额', '已付款订单', '已发货订单',],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                dateList: [
                    {value: '1', label: '今日数据'},
                    {value: '2', label: '近三天'},
                    {value: '3', label: '近七天'},
                ],

                titleList: [
                    {value: '1', label: '订单总量', num: 0},
                    {value: '2', label: '销售额', num: 0},
                    {value: '3', label: '已付款订单', num: 0},
                    {value: '4', label: '已发货订单', num: 0},
                ],

                activeIndex: {
                    top: '1',
                    middle: '1',
                    bottom: '1'
                },

            }
        },
        computed: {},
        methods: {

            handleClickDate(type, val) {
                this.activeIndex[type] = val
            }
        },
        created() {

        }
    }
</script>
<style scoped lang="less">

    /deep/.ui-not_data-txt {
        margin-top: 70px!important;
    }
    /deep/.el-table__empty-text {
        line-height: 20px!important;
    }
    .common {
        background: #ffffff;
        box-shadow:0 2px 10px 0 rgba(231,237,248,0.5);
        padding: 5px 10px;
    }
    .ui-common__date {
        float: left;
        & span {
            color: #333333;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            margin-right: 10px;
        }
        & span:nth-child(:first-child) {
            margin-left: 10px;
        }
        span.ui-link {
            color: #3E9EFC!important;
        }
    }

    .ui-home_wrap {
        width: 87%;
        position: absolute;
        left: 220px;
        top: 40px;
        bottom: 10px;
        text-align: left;
        box-sizing: border-box;
    }
    .ui-top_wrap {
        position: relative;
        height: 180px;
        .ui-top_wrap__img {
            width: 21%;
            height: 160px;
            text-align: center;
            margin: 0 2%;
            float: left;
            & span {
                display: block;
                color: #ffffff;
                font-size: 18px;
                font-weight: bold;
                margin-top: 35px;
            }
            & span.ui_num {
                font-size: 30px;
                margin-top: 10px;
            }
        }
        li.ui-top_wrap__img:nth-child(1) {
            background: url("../../assets/image/h_top.png") -10px -10px no-repeat;
        }
        li.ui-top_wrap__img:nth-child(2) {
            background: url("../../assets/image/h_top.png") -368px -184px no-repeat;
        }
        li.ui-top_wrap__img:nth-child(3) {
            background: url("../../assets/image/h_top.png") -10px -184px no-repeat;
        }
        li.ui-top_wrap__img:nth-child(4) {
            background: url("../../assets/image/h_top.png") -368px -10px no-repeat;
        }
    }
    .ui-middle_wrap {
        position: relative;
        top: 10px;
        height: 340px;
    }
    .ui-bottom_wrap {
        position: absolute;
        top: 560px;
        bottom: 0;
        width: 98.8%;
        overflow: hidden;
        /*position: relative;*/
        /*top: 20px;*/
        /*height: 270px;*/


        .ui-bottom_wrap__table {
            position: absolute;
            bottom: 10px;
            top: 30px;
            left: 60px;
            width: 90%;
        }
    }

</style>