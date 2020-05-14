<template>
    <div class="ui-main-module-table" v-if="initTable">
        <el-table ref="myTable" stripe border :data="tableData" :height="tableHeight" :rowKey="rowKey" highlight-current-row>
            <el-table-column label="" prop="site_name" minWidth="90"></el-table-column>
            <el-table-column label="合计">
                <el-table-column label="退单金额" prop="count_refund_money" minWidth="110"></el-table-column>
                <el-table-column label="退单量" prop="count_refund_sum" minWidth="70"></el-table-column>
            </el-table-column>
            <el-table-column v-for="(item, index) in tableKey" :key="index" :label="item">
                <el-table-column label="退单金额" minWidth="90">
                    <template slot-scope="scope">
                        <span>{{scope.row[item] && scope.row[item].refund_money}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="退单量" minWidth="70">
                    <template slot-scope="scope">
                        <span>{{scope.row[item] && scope.row[item].refund_sum}}</span>
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
    /**
     * name: 表格渲染信息
     *
     * params:
     *      tableKey: 表头信息  ['姓名', '性别']
     *      tableData:  表格数据  [{name: '小白'， sex: '男'}]
     *      tableProps:  表格props  ['name', 'sex']
     *      showSearch:  收缩搜索栏时切换表格高度
     *      isCheck:  是否可勾选
     *      otherHeight:  自适应表格高度
     *      border: 是否有边框
     *      className: 自定义类名
     * */
    import { autoAddTableInx } from '@/services';
    import config from '@/assets/js/config';

    export default {
        name: 'SiteTable',
        props: {
            tableKey: {
                type: Array,
                default () {
                    return [];
                }
            },
            tableData: {
                type: Array,
                default () {
                    return [];
                }
            },
            tableProps: {
                type: Array,
                default () {
                    return [];
                }
            },
            showSearch: {
                type: Boolean,
                default: true
            },
            tableWidth: {
                type: Array,
                default () {
                    return [];
                }
            },
            otherHeight: {
                type: Array,
                default () {
                    return [];
                }
            },
            isSetHeight: {
                type: Boolean,
                default: true
            },

            // 设置表格高度
            height: {
                type: String,
                default: ''
            },
            tableMinWidth: {
                type: Array,
                default () {
                    return [];
                }
            },
            rowKey: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                tableHeight: '100px',
                initTable: true
            };
        },
        methods: {
            autoAddTableInx,
            // 刷新表格高度
            handleRefreshTableHeight () {
                this.$nextTick().then(() => {
                    document.querySelector('body').style.overflow = 'hidden';
                    if (this.height) {
                        this.tableHeight = this.height;
                    } else {
                        this.tableHeight = config.setTableHeight('ui-main-module', this.otherHeight);
                    }

                    this.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                });
            },
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
    };
</script>

<style scoped lang="less">

</style>
