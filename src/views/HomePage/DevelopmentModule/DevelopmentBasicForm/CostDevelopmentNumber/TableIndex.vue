<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" :cell-style="cellStyle" highlight-current-row stripe>
            <el-table-column
                    v-for="(item, index) in tableKey"
                    :key="index"
                    :label="item"
                    :prop="tableProps[index]">
            </el-table-column>
            <el-table-column label="价格区间/开发数量">
                <el-table-column label="≦5元" prop="area5"></el-table-column>
                <el-table-column label="5-10元" prop="area10"></el-table-column>
                <el-table-column label="10-20元" prop="area20"></el-table-column>
                <el-table-column label="20-50元" prop="area50"></el-table-column>
                <el-table-column label="50-100元" prop="area100"></el-table-column>
                <el-table-column label="100-200元" prop="area200"></el-table-column>
                <el-table-column label="200-350元" prop="area350"></el-table-column>
                <el-table-column label=">350元" prop="area351"></el-table-column>
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
            //指定行样式
//            cellStyle: {
//                type: Function,
//                default () {
//                    return () => {};
//                }
//            },
            showSearch: {
                type: Boolean,
                default: true
            },
        },
        data(){
            return {
                tableHeight: '100px'
            }
        },
        computed: {},
        methods: {
            //小计底纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.devp_type == '小计' || row.row.p_level_name == '小计'|| row.row.group_name1 == '小计'|| row.row.group_name2 == '小计'|| row.row.user_name == '小计') {
                    return 'background: #f3f6fa'
                }
            },
        },
        created() {},
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