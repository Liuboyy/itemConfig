<template>
    <div class="ui-main-module-table">
        <el-table
                stripe
                lazy
                ref="myTable"
                :load="load"
                :data="tableData"
                :height="tableHeight"
                :row-key="rowKey"
                highlight-current-row>
            <el-table-column label="" prop="name" width="200"></el-table-column>
            <el-table-column
                    v-for="(item, index) in tableKey"
                    :key="index"
                    :label="item == 'all' ? '汇总' : item"
                    :prop="tableProps[index]"
                    :width="tableWidth[index]">
                <el-table-column label="销售额" prop="total_price" minWidth="100">
                    <template slot-scope="scope">
                        <span>{{scope.row[tableProps[index]] && scope.row[tableProps[index]].total_price}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单量" prop="total_order_sum" minWidth="100">
                    <template slot-scope="scope">
                        <span>{{scope.row[tableProps[index]] && scope.row[tableProps[index]].total_order_sum}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <template slot="empty">
                <div>
                    <NotData v-show="!tableData.length"></NotData>
                </div>
            </template>
        </el-table>
    </div>
</template>
<script>
    import config from '@/assets/js/config';
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    export default{
        name: 'WarehouseSalesReportTable',
        props: {
            tableData: {
                type: Array,
                default() {
                    return []
                }
            },
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
            tableWidth: {
                type: Array,
                default() {
                    return []
                }
            },
            showSearch: {
                type: Boolean,
                default: true
            },
            load: {
                type: Function,
                default() {}
            },
            rowKey: {
                type: String,
                default: 'id'
            },
            // 设置表格高度
            height: {
                type: String,
                default: ''
            },
            otherHeight: {
                type: Array,
                default () {
                    return [];
                }
            },
        },
        data(){
            return {
                tableHeight: '100px',
                thisVm: {},
            }
        },
        computed: {},
        methods: {
            // 刷新表格高度
            handleRefreshTableHeight () {
                this.$nextTick().then(() => {
                    document.querySelector('body').style.overflow = 'hidden';
                    if (this.height) {
                        this.tableHeight = this.height;
                    } else {
                        this.tableHeight = config.setTableHeight('s-main', this.otherHeight);
                    }

                    this.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                });
            },
        },
        created() {
            this.thisVm = this;

        },
        mounted() {
            this.$nextTick().then(() => {
                this.tableHeight = config.setTableHeight('s-main',['el-tabs__header']);
                this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
            });
        },
        watch: {
            showSearch() {
                document.querySelector('body').style.overflow = 'hidden';
                setTimeout(() => {
                    this.tableHeight = config.setTableHeight('s-main',['el-tabs__header']);
                    this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400)
            }
        }
    }
</script>
<style scope lang="less">
</style>