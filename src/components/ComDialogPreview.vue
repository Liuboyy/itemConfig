<template>
    <div>
        <el-dialog
                :top="top"
                class="ui-layout_edit-dialog"
                :title="title"
                :width="width"
                :visible="visible"
                :close-on-click-modal="isCloseModal"
                :close-on-press-escape="isCloseEscape"
                @close="handleClose">
            <slot></slot>
            <el-button size="small" type="primary" style="margin-bottom: 10px" v-if="isButton" @click="handleExportInfo">导出</el-button>
            <div class="ui-main-module-table">
                <el-table
                        border
                        :stripe="stripe"
                        :data="tableData"
                        :cell-style="cellStyle"
                        :highlight-current-row="highlightRow"
                        :height="tableHeight">
                    <el-table-column
                            v-for="(item, index) in tableKey"
                            :key="index"
                            :label="item"
                            :prop="tableProps[index]"
                            :type="tableProps[index] === 'index' ? 'index' : ''"
                            :width="tableWidth[index] || ''">
                        <template slot-scope="scope">
                            <slot :name="tableProps[index]" :row="scope.row" :$index="scope.$index">{{tableProps[index] ===
                            'index' ? autoAddTableInx(scope.$index) : scope.row[tableProps[index]]}}
                            </slot>
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
        </el-dialog>
    </div>
</template>

<script>
    import config from '@/assets/js/config'
    import { autoAddTableInx } from '../services';
    export default {
        name: "ComDialogPreview",
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
            isPage: {
                type: Boolean,
                default: false
            },
            dialogPageData: {
                offset: 1,
                limit: 20,
                total: 0
            },
            top: {
                type: String,
                default: '5vh'
            },
            title: {
                type: String,
                default: '查看详情'
            },
            visible: {
                type: Boolean,
                default: false
            },
            isCloseModal: {
                type: Boolean,
                default: true
            },
            isCloseEscape: {
                type: Boolean,
                default: true
            },
            width: {
                type: String,
                default: '1000px'
            },
            //指定行样式
            cellStyle: {
                type: Function,
                default () {
                    return () => {};
                }
            },
            highlightRow: {
                type: Boolean,
                default: true
            },
            isButton: {
                type: Boolean,
                default: false
            },
            tableHeight: {
                type: String,
                default: '600px'
            },
            stripe: {
                type: Boolean,
                default: true
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
            // 关闭
            handleClose () {
                this.$emit('update:visible', false);
                this.$emit('close')
            },

            //导出
            handleExportInfo() {
                this.$emit('export',{});
            }

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
        margin-top: 5px!important;
        .el-pagination  {
            padding: 2px!important;
        }
        .el-pagination span {
            font-size: 12px;
        }
        .el-input, .el-select{
            width: 100px!important;
        }
    }
</style>