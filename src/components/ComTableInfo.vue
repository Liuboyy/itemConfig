<template>
    <div :class="className" v-if="initTable">
        <slot></slot>
        <el-table
                ref="myTable"
                lazy
                :load="load"
                :stripe="stripe"
                :border="border"
                :data="tableData"
                :height="tableHeight"
                :span-method="spanMethod"
                :row-key="rowKey"
                :row-class-name="tableRowClassName"
                :cell-style="cellStyle"
                :cell-class-name="handleAddColClass"
                :highlight-current-row="highlightRow"
                @cell-mouse-leave="cellMouseLeave"
                @cell-mouse-enter="cellMouseEnter"
                @cell-click="handleCellClick"
                @row-click='handleRowClick'
                @expand-change="handleOpenChange"
                @sort-change="handleSortChange"
                @selection-change="handleSelectionChange">
            <el-table-column
                    v-if="isCheck"
                    type="selection"
                    width="35"
                    fixed="left"
                    :selectable="selectable">
            </el-table-column>
            <el-table-column
                    v-for="(item, index) in tableKey"
                    :key="index"
                    :label="item"
                    :fixed="tableFixed[index]"
                    :type="tableProps[index] === 'index' ? 'index' : ''"
                    :prop="tableProps[index]"
                    :width="tableWidth[index] || ''"
                    :minWidth="tableMinWidth[index] || ''"
                    :sortable="tableSort[index]">
                <template slot-scope="scope">
                    <slot :name="tableProps[index]" :row="scope.row" :$index="scope.$index">
                        {{tableProps[index] === 'index' ? autoAddTableInx(scope.$index) : scope.row[tableProps[index]]}}
                    </slot>
                </template>
            </el-table-column>
            <slot name="operate"></slot>
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
        name: 'ComTableInfo',
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
            tableSort: {
                type: Array,
                default() {
                    return [false]
                }
            },
            defaultSort: {
                type: Object,
                default() {
                    return {}
                }
            },
            isCheck: {
                type: Boolean,
                default: false
            },
            otherHeight: {
                type: Array,
                default () {
                    return [];
                }
            },
            selectable: {
                type: Function,
                default () {
                    return () => {};
                }
            },
            border: {
                type: Boolean,
                default: true
            },
            stripe: {
                type: Boolean,
                default: true
            },
            className: {
                type: String,
                default: 'ui-main-module-table'
            },
            spanMethod: {
                type: Function,
                default () {
                    return () => {};
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
            //点击勾选单元格取消当行选中
            isCellCancel: {
                type: Boolean,
                default: false
            },
            tableMinWidth: {
                type: Array,
                default () {
                    return [];
                }
            },
            tableRowClassName: {
                type: Function
            },
            rowKey: {
                type: String,
                default: 'id'
            },
            load: {
                type: Function,
                default() {}
            },
            //固定列
            tableFixed: {
                type: Array,
                default () {
                    return [];
                }
            },
            //指定行样式
            cellStyle: {
                type: Function,
                default () {
                    return () => {

                    };
                }
            },
            cellMouseEnter: {
                type: Function,
                default () {
                    return () => {};
                }
            },
            cellMouseLeave: {
                type: Function,
                default () {
                    return () => {};
                }
            },
            highlightRow: {
                type: Boolean,
                default: true
            },
            extraView: {
                type: String,
                default: ''
            },
            showAdvanceQuery: {
                type: Boolean,
                default: true
            },
        },
        data () {
            return {
                initTable: true,
                tableHeight: '100px',
                saveCheckInfo: []
            };
        },
        methods: {
            autoAddTableInx,

            // 勾选
            handleSelectionChange (val) {
                this.saveCheckInfo = [...val];
                this.$emit('checked', val);
            },

            // 排序
            handleSortChange(column){
                this.$emit('handleSort', column);
            },

            // 添加行列样式
            handleAddColClass (val) {
                if (val.column.property === 'sku') {
                    // console.log(val);
                    return 'ui-layout-ceil';
                }
            },

            //点击勾选的单元格
            handleCellClick (row, column) {
                if (!this.isCellCancel || column.type !== 'selection') {
                    return;
                }
                this.$refs.myTable.toggleRowSelection(row);
            },

            handleRowClick(row) {
                if (row) {
                    this.$refs.myTable.toggleRowSelection(row);
                }
            },

            handleOpenChange(row) {
                this.handleRefreshTableHeight();
            },

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
        mounted () {
            this.$nextTick().then(() => {
                if (this.height && this.isSetHeight) {
                    this.tableHeight = this.height;
                } else {
                    this.tableHeight = this.isSetHeight ? config.setTableHeight('ui-main', this.otherHeight) : '';
                }
                this.$refs['myTable'].doLayout();
                setTimeout(() => {
                    this.$refs['myTable'].sort(this.defaultSort.prop, this.defaultSort.order);
                })
            });
            const vm = this;
            window.onresize = function(){
                document.querySelector('body').style.overflow = 'hidden';
                vm.tableHeight = config.setTableHeight('s-main', vm.otherHeight, null, vm.extraView);
                vm.$refs['myTable'] && vm.$refs['myTable'].doLayout();
                document.querySelector('body').style.overflow = '';
            }
        },
        watch: {
            showSearch (val, old) {
                let vm = this;
                document.querySelector('body').style.overflow = 'hidden';
                setTimeout(() => {
                    if (vm.height && vm.isSetHeight) {
                        vm.tableHeight = vm.height;
                    } else {
                        vm.tableHeight = vm.isSetHeight ? config.setTableHeight('ui-main', vm.otherHeight) : '';
                    }
                    vm.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400);
            },
        }
    };
</script>

<style scoped lang="less">

</style>
