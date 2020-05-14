<template>
    <div class="ui-main-module-table">
        <el-table  ref="myTable" border stripe highlight-current-row
                   :height="tableHeight" :data="tableData" :cell-style="cellStyle">
            <el-table-column
                    v-for="(item, key, index) in tableFrontKey"
                    :key="index"
                    :label="item"
                    :prop="tableProps[index]"
                    :minWidth="tableMinWidth"
                    :fixed="tableFixed[index]">
            </el-table-column>
            <el-table-column
                    v-for="(item, index) in tableBackKey"
                    :key="index"
                    :label="item + ''">
                <el-table-column
                        minWidth="70"
                        label="完成数">
                    <span slot slot-scope="scope">{{scope.row[item] && scope.row[item].total_qty}}</span>
                </el-table-column>
                <el-table-column
                        minWidth="70"
                        label="创建数">
                    <span slot slot-scope="scope">{{scope.row[item] && scope.row[item].create_qty}}</span>
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

    export default{
        name: 'TableIndex',
        props: {
            tableData: {
                type: Array,
                default() {
                    return []
                }
            },
            tableFrontKey: {
                type: Array,
                default() {
                    return []
                }
            },
            tableBackKey: {
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
            tableMinWidth: {
                type: Array,
                default() {
                    return []
                }
            },
            tableFixed: {
                type: Array,
                default() {
                    return []
                }
            },
            showSearch: {
                type: Boolean,
                default: false
            },
            cellStyle: {
                type: Function,
                default () {
                    return () => {

                    };
                }
            },

        },
        data(){
            return {
                tableHeight: '100px'
            }
        },
        computed: {},
        methods: {

        },
        created() {

        },
        mounted() {
            this.$nextTick().then(() => {
                this.tableHeight = config.setTableHeight('ui-main-module',['el-tabs__header']);
                this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
            });
        },
        watch: {
            showSearch() {
                document.querySelector('body').style.overflow = 'hidden';
                setTimeout(() => {
                    this.tableHeight = config.setTableHeight('ui-main-module',['el-tabs__header']);
                    this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400)
            }
        }
    }
</script>
<style scope lang="less">
</style>