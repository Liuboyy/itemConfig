<template>
    <div class="ui-table__head" ref="tableHead">
        <table>
            <tr>
                <th rowspan="3" style="width: 100px">
                    <div class="ui-table__ceil" style="width: 100px">日期</div>
                </th>
                <th colspan="6" v-for="(item, index) in tableKey" :key="index"
                    :style="{width: `${tableWidth[index]}px` || '', borderLeftColor: '#d3e9fa'}">
                    <div class="ui-table__ceil" :style="{width: `${tableWidth[index]}px` || ''}">{{item}}</div>
                </th>
            </tr>
            <tr>
                <template v-for="(item, index) in tableKey">
                    <th colspan="3" style="border-left-color: #d3e9fa">
                        <div class="ui-table__ceil">国内仓</div>
                    </th>
                    <th colspan="3">
                        <div class="ui-table__ceil">国外仓</div>
                    </th>
                </template>
            </tr>
            <tr class="width-flag">
                <template v-for="(item, index) in tableKey">
                    <th style="border-left: 1px solid #d3e9fa">
                        <div class="ui-table__ceil" style="min-width: 50px;">订单量</div>
                    </th>
                    <th>
                        <div class="ui-table__ceil" style="min-width: 50px;">欠货量</div>
                    </th>
                    <th>
                        <div class="ui-table__ceil" style="min-width: 50px;">欠货率</div>
                    </th>
                    <th>
                        <div class="ui-table__ceil" style="min-width: 50px;">订单量</div>
                    </th>
                    <th>
                        <div class="ui-table__ceil" style="min-width: 50px;">欠货量</div>
                    </th>
                    <th>
                        <div class="ui-table__ceil" style="min-width: 50px;">欠货率</div>
                    </th>
                </template>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "TableHead",
        props: {
            tableKey: {
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
            check: {
                type: Boolean,
                default:false
            },
            indeterminate: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                allCheck: false
            }
        },
        methods: {
            // 表头切换
            handleTableHeadChange() {
                this.$nextTick().then(() => {
                    const thWidths = [];
                    this.$refs.tableHead.querySelectorAll('.width-flag th').forEach((el, index) => {
                        if (this.check) {
                            if (index) {
                                thWidths.push(el.clientWidth - 1)
                            }
                        } else {
                            thWidths.push(el.clientWidth);
                        }
                    });

                    this.$emit('changeWidth', {
                        thws: thWidths,
                        headws: this.$refs.tableHead.querySelector('table').offsetWidth + 'px'
                    })
                })
            },

            // 全选
            handleAllCheck(check) {
                this.$emit('checkAll', check);
            }
        },
        mounted() {
            this.handleTableHeadChange();
        },
        watch: {
            tableKey(val) {
                this.$nextTick().then(() => {
                    this.handleTableHeadChange();
                })
            }
        }
    }
</script>

<style scoped lang="less">

    @border-color: #e6e6e6;

    .ui-table__head {
        width: 100%;
        box-sizing: border-box;
        padding-right: 17px;
        table {
            width: 100%;
            /*display: block;*/

            border-collapse:collapse;
            border-spacing:0;
        }

        th {
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            color: #333333;
            background: #ffffff;
            box-sizing: border-box;
            border-left: 1px solid @border-color;
            border-bottom: 1px solid @border-color;

            &:first-child {
                border-left: 0 none;
            }

            .ui-table__ceil {
                padding: 8px 0;
                box-sizing: border-box;
            }
        }
    }
</style>