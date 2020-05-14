<template>
    <div>
        <div class="ui-main-module-table">
            <el-table
                    border
                    :data="tableData"
                    :height="tableHeight">
                <el-table-column
                        v-for="(item, index) in tableKey"
                        :key="index"
                        :label="item"
                        :prop="tableProps[index]"
                        :width="tableWidth[index] || ''"
                        :minWidth="tableMinWidth[index] || ''">
                    <template slot-scope="scope">
                        <slot :name="tableProps[index]" :row="scope.row" :$index="scope.$index">{{tableProps[index] === 'index' ? autoAddTableInx(scope.$index) : scope.row[tableProps[index]]}}</slot>
                    </template>
                </el-table-column>
                <template slot="empty">
                    <div>
                        <NotData v-show="!tableData.length"></NotData>
                    </div>
                </template>
            </el-table>
        </div>
        <div class="ui-dialog_page" v-if="isPage">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="dialogPageData.offset"
                    :page-sizes="pageSizes"
                    :page-size="dialogPageData.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="dialogPageData.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import config from '@/assets/js/config'
    import { autoAddTableInx } from '../services'
    export default {
        name: "ComPreviewTable",
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
                    return ['操作时间','操作人','操作内容']
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
            tableMinWidth: {
                type: Array,
                default() {
                    return []
                }
            },
            tableHeight: {
                type: String,
                default: '500px',
            },
            isPage: {
                type: Boolean,
                default: false
            },
            dialogPageData: {
                offset: 1,
                limit: 20,
                total: 0
            }

        },
        data() {
            return {
//                tableHeight: '600px',
                pageSizes: config.pageData.pageSizes,
            }
        },
        methods: {
            autoAddTableInx,

            handleSizeChange(size){
                this.$emit('dialogPageChange', {
                    limit: size,
                    offset: 1
                })
            },
            handleCurrentChange(inx){
                this.$emit('dialogPageChange', {
                    limit: this.dialogPageData.limit,
                    offset: inx
                })
            },

        },
        mounted() {
            this.$nextTick(() => {
                // this.tableHeight = config.setTableHeight('ui-main-module');
            })
        },
    }
</script>

<style scoped lang="less">
    /deep/.ui-dialog_page {
        margin-top: 10px!important;
        .el-pagination  {
            padding: 4px!important;
        }
        .el-pagination span {
            font-size: 12px;
        }
        .el-input, .el-select{
            width: 100px!important;
        }
    }
</style>