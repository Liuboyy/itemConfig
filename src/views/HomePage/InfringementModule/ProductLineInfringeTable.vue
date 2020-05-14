<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" :cell-style="cellStyle" highlight-current-row stripe>
            <el-table-column prop="category_name_level_1" label="产品线" minWidth="90"></el-table-column>
            <el-table-column prop="total_task" label="总任务数" minWidth="70"></el-table-column>
            <el-table-column label="总侵权数">
                <el-table-column label="spu" prop="sum_spu" minWidth="65"></el-table-column>
                <el-table-column label="sku" prop="sum_sku" minWidth="65"></el-table-column>
            </el-table-column>
            <el-table-column prop="rate_spu" label="侵权占比(spu)" minWidth="100"></el-table-column>
            <el-table-column prop="complete_formula" label="侵权占比公式" minWidth="100"></el-table-column>
            <el-table-column v-for="(item, index) in tableKey" :key="index" :label="type === 'w' ? `第${item}周` : item">
                <el-table-column label="spu" minWidth="60">
                    <template slot-scope="scope">
                        <span>{{scope.row[item] && scope.row[item].spu}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="sku" minWidth="60">
                    <template slot-scope="scope">
                        <span>{{scope.row[item] && scope.row[item].sku}}</span>
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
            type: {
                type: String,
                default: ''
            }
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