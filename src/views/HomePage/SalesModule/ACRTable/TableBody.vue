<template>
    <div class="ui-table__body" :style="{height}" ref="tableBody">
        <div class="ui-table__body--content" :style="{height, width: tableData.length ? '' : width, overflowY: tableData.length ? 'scroll' : ''}">
            <table ref="table">
                <tr v-for="(item, itemIndex) in tableData" :key="itemIndex">
                    <td>
                        <div class="ui-table_ceil" style="width: 100px;">
                            {{item.date}}
                        </div>
                    </td>
                    <template v-for="(key, index) in tableKey">
                        <td :style="{borderLeftColor: '#d3e9fa'}">
                            <div class="ui-table_ceil" :style="{width: `${tableWidth[handleGetIndex(index * 6)]}px`}">
                                {{item[tableProps[handleGetIndex(index)]].order_sum_1 || '--'}}
                            </div>
                        </td>
                        <td>
                            <div class="ui-table_ceil" :style="{width: `${tableWidth[handleGetIndex(index * 6 + 1)]}px`}">
                                <span class="ui-link" v-show="preview" @click="handlePreview(item[tableProps[handleGetIndex(index)]], 1)">{{item[tableProps[handleGetIndex(index)]].order_lack_1 || '--'}}</span>
                                <span v-show="!preview">{{item[tableProps[handleGetIndex(index)]].order_lack_1 || '--'}}</span>
                            </div>
                        </td>
                        <td>
                            <div class="ui-table_ceil" :style="{width: `${tableWidth[handleGetIndex(index * 6 + 2)]}px`}">
                                {{item[tableProps[handleGetIndex(index)]].lack_rate_1 || '--'}}
                            </div>
                        </td>
                        <td>
                            <div class="ui-table_ceil" :style="{width: `${tableWidth[handleGetIndex(index * 6 + 3)]}px`}">
                                {{item[tableProps[handleGetIndex(index)]].order_sum_2 || '--'}}
                            </div>
                        </td>
                        <td>
                            <div class="ui-table_ceil" :style="{width: `${tableWidth[handleGetIndex(index * 6 + 4)]}px`}">
                                <span class="ui-link" v-show="preview" @click="handlePreview(item[tableProps[handleGetIndex(index)]], 2)">{{item[tableProps[handleGetIndex(index)]].order_lack_2 || '--'}}</span>
                                <span v-show="!preview">{{item[tableProps[handleGetIndex(index)]].order_lack_2 || '--'}}</span>
                            </div>
                        </td>
                        <td>
                            <div class="ui-table_ceil" :style="{width: `${tableWidth[handleGetIndex(index * 6 + 5)]}px`}">
                                {{item[tableProps[handleGetIndex(index)]].lack_rate_2 || '--'}}
                            </div>
                        </td>
                        <!--<td >-->
                            <!---->
                            <!--<div class="ui-table_ceil" :style="{width: `${tableWidth[index]}px`}" v-else-if="tableProps[index] === 'img' && imageCanLoad(scrollTop, itemIndex)">-->
                                <!--<slot name="img" :row="item" :$index="itemIndex">{{item[tableProps[index]]}}</slot>-->
                            <!--</div>-->
                        <!--</td>-->
                    </template>
                </tr>
            </table>
        </div>
        <div class="ui-table__empty" v-show="!tableData.length">
            <slot name="empty">
                <div>
                    <span>暂无数据</span>
                </div>
            </slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TableBody",
        props: {
            tableKey: {
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
            tableData: {
                type: Array,
                default() {
                    return []
                }
            },
            tableWidth: {
                type: Array,
                default() {
                    return []
                }
            },
            height: {
                type: String,
                default: '100px'
            },
            width: {
                type: String,
                default: ''
            },
            check: {
                type: Boolean,
                default: false
            },
            preview: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                checkeds: [],
                checkList: [],

                // 处理图片懒加载
                scrollTop: 600,
                scrollTime: ''
            }
        },
        methods: {
            handleCheckRow(inx, check) {
                if (check) {
                    this.checkeds.push(inx);
                } else {
                    this.checkeds.splice(this.checkeds.findIndex(val => val === inx), 1);
                }
                this.$emit('checked', this.checkeds.map(item => this.tableData[item]));
            },
            handleCheckAll(check) {
                let checked = []
                if (check) {
                    this.tableData.forEach((item, index) => {
                        this.$set(this.checkList, index, true);
                    })
                } else {
                    this.tableData.forEach((item, index) => {
                        this.$set(this.checkList, index, false);
                    })
                }
                this.checkeds = checked;
                this.$emit('checked', this.checkeds.map(item => this.tableData[item]));
            },

            handleGetIndex(index) {
                let floorNum = Math.floor(index / 6);
                return index + (index >= 6 ? 0 : floorNum)
            },

            // 处理图片懒加载
            handleScroll(e) {
                clearTimeout(this.scrollTime);
                this.scrollTime = setTimeout(() => {
                    this.$forceUpdate();
                }, 300)
            },

            // 预览列表
            handlePreview(row, type) {
                this.$emit('preview', {
                    row, type
                })
            }
        },
        mounted() {
            // ui-table__body--content
            // this.$el.querySelector('.ui-table__body--content').addEventListener('scroll', this.handleScroll);
        }
    }
</script>

<style scoped lang="less">
    @border-color: #e6e6e6;
    .ui-table__body {
        /*overflow: hidden;*/
        background: #ffffff;
        position: relative;
        .ui-table__body--content {
            /*overflow-y: scroll;*/
            display: inline-block;
            vertical-align: middle;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            background: #ffffff;
        }

        table {
            width: 100%;
            border-collapse:collapse;
            border-spacing:0;
        }

        tr {
            background: #ffffff;
        }

        td {
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
            text-align: left;
            font-size: 12px;
            color: #333333;
            border-top: 1px solid @border-color;
            border-bottom: 1px solid @border-color;
            border-left: 1px solid @border-color;

            .ui-table_ceil {
                padding: 8px 0;
                text-align: center;
                box-sizing: border-box;
                word-break: break-all;
            }

            &:first-child {
                border-left: 0 none;
                /*border-left: 2px solid transparent;*/

                .ui-table_ceil {
                    margin-left: 0;
                }
            }
        }

        tr:first-child td{
            border-top: 0;
        }
    }

    .ui-table__empty {
        position: absolute;
        width: 200px;
        /*top: 40%;*/
        left: 50%;
        top: 100px;
        margin-left: -125px;
        font-size: 14px;
        color: #999999;
        text-align: center;
    }
</style>