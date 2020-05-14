<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" :cell-style="cellStyle"
                  highlight-current-row  stripe border @sort-change="handleSortChange">
            <el-table-column
                    v-for="(item, index) in tableKey"
                    :key="index"
                    :label="item"
                    :prop="tableProps[index]"
                    :sortable="tableSort[index]">
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
            tableSort: {
                type: Array,
                default() {
                    return []
                }
            },
            showSearch: {
                type: Boolean,
                default: true
            },
//            defaultSort: {
//                type: Object,
//                default() {
//                    return {}
//                }
//            },
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

            // 排序
            handleSortChange(column){
                this.$emit('handleSort', column);
            },
        },
        created() {},
        mounted() {
            this.$nextTick().then(() => {
                this.tableHeight = config.setTableHeight('s-main',['el-tabs__header']);
                this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
            });
//            setTimeout(() => {
//                this.$refs['myTable'].sort(this.defaultSort.prop, this.defaultSort.order);
//            })
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