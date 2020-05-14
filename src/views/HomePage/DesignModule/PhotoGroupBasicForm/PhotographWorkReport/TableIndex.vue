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
                <el-table-column prop="all_spu_cnt" label="SPU"></el-table-column>
                <el-table-column prop="all_sku_cnt" label="SKU"></el-table-column>
            </el-table-column>
            <el-table-column label="已分配任务数">
                <el-table-column prop="distribute_spu_cnt" label="SPU" width="70"></el-table-column>
                <el-table-column prop="distribute_sku_cnt" label="SKU" width="70"></el-table-column>
            </el-table-column>
            <el-table-column label="未分配任务数">
                <el-table-column prop="undistribute_spu_cnt" label="SPU" width="70"></el-table-column>
                <el-table-column prop="undistribute_sku_cnt" label="SKU" width="70"></el-table-column>
            </el-table-column>
            <el-table-column label="完成数">
                <el-table-column prop="finish_spu_cnt" label="SPU" width="70"></el-table-column>
                <el-table-column prop="finish_sku_cnt" label="SKU" width="70"></el-table-column>
            </el-table-column>
            <el-table-column prop="finish_spu_rate" label="完成占比(SPU)" width="100px"></el-table-column>
            <el-table-column label="未完成数">
                <el-table-column prop="unfinish_spu_cnt" label="SPU" width="70"></el-table-column>
                <el-table-column prop="unfinish_sku_cnt" label="SKU" width="70"></el-table-column>
            </el-table-column>
            <el-table-column prop="unfinish_spu_rate" label="未完成占比(SPU)" width="120px"></el-table-column>
            <el-table-column label="超时数">
                <el-table-column prop="overtime_spu_cnt" label="SPU" width="70">
                        <span slot slot-scope="scope"
                              :class="buttonList['overtime_num'].permit(thisVm) && scope.row.user_id && scope.row.overtime_spu_cnt > 0 ? 'ui-link' : ''"
                              @click="handleClick(scope.row, 1)">{{scope.row.overtime_spu_cnt}}</span>
                </el-table-column>
                <el-table-column prop="overtime_sku_cnt" label="SKU" width="70"></el-table-column>
            </el-table-column>
            <el-table-column prop="overtime_spu_rate" label="超时占比(SPU)" width="100px"></el-table-column>
            <el-table-column prop="total_sale" label="返工数">
                <el-table-column prop="reject_spu_cnt" label="SPU" width="70">
                        <span slot slot-scope="scope"
                              :class="buttonList['reject_num'].permit(thisVm) && scope.row.user_id && scope.row.reject_spu_cnt > 0 ? 'ui-link' : ''"
                              @click="handleClick(scope.row, 2)">{{scope.row.reject_spu_cnt}}</span>
                </el-table-column>
                <el-table-column prop="reject_sku_cnt" label="SKU" width="70"></el-table-column>
            </el-table-column>
            <el-table-column prop="reject_spu_rate" label="返工占比(SPU)" width="100px"></el-table-column>
            <el-table-column prop="finish_image_cnt" label="图片完成张数" width="100px"></el-table-column>
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
                if(row.row.group_name == '小计'|| row.row.user_name == '小计' || row.row.type_name == '小计') {
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