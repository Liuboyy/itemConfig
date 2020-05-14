<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" :cell-style="cellStyle" highlight-current-row stripe>
            <el-table-column
                    v-for="(item, index) in tableKey"
                    :key="index"
                    :label="item"
                    :prop="tableProps[index]"
                    :width="tableWidth[index] || ''">
            </el-table-column>
            <el-table-column label="总任务数">
                <el-table-column prop="total_spu_cnt" label="SPU"></el-table-column>
                <el-table-column prop="total_sku_cnt" label="SKU"></el-table-column>
            </el-table-column>
            <el-table-column label="完成数">
                <el-table-column prop="complete_spu_cnt" label="SPU"></el-table-column>
                <el-table-column prop="complete_sku_cnt" label="SKU"></el-table-column>
            </el-table-column>
            <el-table-column prop="complete_rate" label="完成占比(SPU)"></el-table-column>
            <el-table-column label="未完成数">
                <el-table-column prop="no_complete_spu" label="SPU"></el-table-column>
                <el-table-column prop="no_complete_sku" label="SKU"></el-table-column>
            </el-table-column>
            <el-table-column prop="no_complete_rate" label="未完成占比(SPU)" width="120"></el-table-column>
            <el-table-column label="超时数">
                <el-table-column prop="overtime_spu" label="SPU"></el-table-column>
                <el-table-column prop="overtime_sku" label="SKU"></el-table-column>
            </el-table-column>
            <el-table-column prop="overtime_rate" label="超时占比(SPU)"></el-table-column>
            <el-table-column prop="total_sale" label="返工数">
                <el-table-column prop="reject_spu_cnt" label="SPU"></el-table-column>
                <el-table-column prop="reject_sku_cnt" label="SKU"></el-table-column>
            </el-table-column>
            <el-table-column prop="rework_rate" label="返工占比(SPU)"></el-table-column>
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
        },
        data(){
            return {
                tableHeight: '100px',
                thisVm: {},
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
            ]),
        },
        methods: {
            //小计底纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.category_name_level_1 == '总计'|| row.row.type_name == '总计') {
                    return 'background: #f3f6fa'
                }
            },
            handleClick(row, type) {
                this.$emit('click', row, type)
            }
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