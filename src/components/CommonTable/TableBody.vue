<template>
    <div class="ui-table__body" :style="{height}" ref="tableBody">
        <div class="ui-table__body--content" :style="{height, width: tableData.length ? '' : width, overflowY: tableData.length ? 'scroll' : ''}">
            <table ref="table">
                <tr v-for="(item, itemIndex) in tableData" :key="itemIndex">
                    <td style="width: 50px;" v-if="check">
                        <div class="ui-table_ceil" style="width: 50px;">
                            <el-checkbox v-model="checkList[itemIndex]" @change="val => {handleCheckRow(itemIndex, val)}"></el-checkbox>
                        </div>
                    </td>
                    <td v-for="(key, index) in tableKey" :key="index"
                        :style="{width: `${tableWidth[index]}px`}">
                        <div class="ui-table_ceil" :style="{width: `${tableWidth[index]}px`}" v-if="tableProps[index] !== 'img'">
                            <slot :name="tableProps[index]" :row="item" :$index="itemIndex">{{item[tableProps[index]]}}</slot>
                        </div>
                        <div class="ui-table_ceil" :style="{width: `${tableWidth[index]}px`}" v-else-if="tableProps[index] === 'img' && imageCanLoad(scrollTop, itemIndex)">
                            <slot name="img" :row="item" :$index="itemIndex">{{item[tableProps[index]]}}</slot>
                        </div>
                    </td>
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
                        checked.push(index);
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
            handleResetBody() {
                this.$nextTick().then(() => {
                    const tableWidth = document.querySelector('.ui-common_table').offsetWidth;
                    let offsetLeft = tableWidth + 200;
                    const scrollEle = this.$refs.tableBody.querySelector('.ui-scroll_box--content');
                    scrollEle.style.height = this.$refs.table.offsetHeight + 'px';
                    scrollEle.style.left = offsetLeft + 'px';
                })
            },

            // 处理图片懒加载
            handleScroll(e) {
                clearTimeout(this.scrollTime);
                this.scrollTime = setTimeout(() => {
                    this.$forceUpdate();
                }, 300)
            },

            // 是否可以加载
            imageCanLoad(scrollTop, eleInx) {
                try {
                    const itemEle = this.$refs.table.querySelector(`tr:nth-child(${eleInx + 1})`);
                    const areaOffsetTop = this.$refs.tableBody.getBoundingClientRect().top;
                    const areaOffsetBottom = this.$refs.tableBody.getBoundingClientRect().bottom;
                    const itemTopVal = itemEle.getBoundingClientRect().top;
                    const itemBottomVal = itemEle.getBoundingClientRect().bottom;

                    const isTopTrue = areaOffsetTop < itemTopVal || areaOffsetTop < itemBottomVal;
                    const isBottomTrue = areaOffsetBottom > itemTopVal || areaOffsetBottom > itemBottomVal;
                    if (isTopTrue && isBottomTrue || itemEle.querySelector('.ui-table__img')) {
                        return true;
                    }
                } catch (e) {
                    return false;
                }
            }
        },
        mounted() {
            // ui-table__body--content
            window.addEventListener('reset', this.handleResetBody);
            this.$el.querySelector('.ui-table__body--content').addEventListener('scroll', this.handleScroll);
        },
        watch: {
            tableData() {
                this.handleResetBody();
            }
        },
        beforeDestroy() {
            window.removeEventListener('reset', this.handleResetBody);
        }
    }
</script>

<style scoped lang="less">
    @border-color: #efefef;
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
                padding: 8px;
                box-sizing: border-box;
            }

            &:first-child {
                border-left: 0 none;

                .ui-table_ceil {
                    margin-left: 0;
                }
            }
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