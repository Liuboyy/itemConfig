<template>
    <div class="ui-table__head" ref="tableHead">
        <table>
            <tr>
                <th style="width: 50px;" v-if="check">
                    <div class="ui-table__ceil" style="width: 50px;">
                        <el-checkbox v-model="allCheck" :indeterminate="indeterminate" @change="handleAllCheck"></el-checkbox>
                    </div>
                </th>
                <th v-for="(item, index) in tableKey" :key="index" :style="{width: `${tableWidth[index]}px` || ''}">
                    <div class="ui-table__ceil" :style="{width: `${tableWidth[index]}px` || ''}">{{item}}</div>
                </th>
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
                    this.$refs.tableHead.querySelectorAll('th').forEach((el, index) => {
                        if (this.check) {
                            if (index) {
                                thWidths.push(el.offsetWidth - 1)
                            }
                        } else {
                            thWidths.push(index ? el.offsetWidth - 1 : el.offsetWidth);
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
                this.handleTableHeadChange();
            }
        }
    }
</script>

<style scoped lang="less">

    @border-color: #efefef;

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
            text-align: left;
            font-size: 12px;
            font-weight: bold;
            color: #666666;
            background: #fafafa;
            box-sizing: border-box;
            border-left: 1px solid @border-color;
            border-bottom: 1px solid @border-color;

            &:first-child {
                border-left: 0 none;
            }

            .ui-table__ceil {
                padding: 8px;
                box-sizing: border-box;
            }
        }
    }
</style>