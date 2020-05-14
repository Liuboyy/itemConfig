<template>
    <div :class="className" v-if="initTable">
        <slot></slot>
        <vxe-table ref="myTable" border stripe size="mini" resizable
                   :data.sync="tableData" :height="tableHeight" :tree-config="{children: 'children'}"
                   @toggle-tree-change="handleToggleTree">
            <vxe-table-column
                    :title="treeNode.title"
                    :field="treeNode.field"
                    :width="treeNode.width"
                    tree-node>
            </vxe-table-column>
            <vxe-table-column
                    v-for="(item, index) in tableKey"
                    :key="index"
                    :title="item"
                    :field="tableProps[index]"
                    :width="tableWidth[index] || ''"
                    :min-width="tableMinWidth[index] || ''">
                <template slot-scope="scope">
                    <slot :name="tableProps[index]" :row="scope.row" :$index="scope.$index">
                        {{tableProps[index] === 'index' ? autoAddTableInx(scope.$index) : scope.row[tableProps[index]]}}
                    </slot>
                </template>
            </vxe-table-column>
            <template slot="empty">
                <div>
                    <NotData v-show="!tableData.length"></NotData>
                </div>
            </template>
        </vxe-table>
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
        name: 'ComTreeTable',
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
            tableWidth: {
                type: Array,
                default () {
                    return [];
                }
            },
            tableMinWidth: {
                type: Array,
                default () {
                    return [];
                }
            },
            treeNode: {
                type: Object,
                default: {
                    title: '',
                    field: '',
                    width: ''
                }
            },
            showSearch: {
                type: Boolean,
                default: true
            },
            border: {
                type: Boolean,
                default: true
            },
            stripe: {
                type: Boolean,
                default: true
            },
            highlightRow: {
                type: Boolean,
                default: true
            },
            className: {
                type: String,
                default: 'ui-main-module-table'
            },
            // 设置表格高度
            height: {
                type: String,
                default: ''
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
                children: []
            };
        },
        methods: {
            autoAddTableInx,

            //展开行
            handleToggleTree({row}) {
                this.$emit('toggleTree', row);
            },

            // 排序
            handleSortChange(column){
                this.$emit('handleSort', column);
            },

            // 刷新表格高度
            handleRefreshTableHeight () {
                this.$nextTick().then(() => {
                    document.querySelector('body').style.overflow = 'hidden';
                    if (this.height) {
                        this.tableHeight = this.height;
                    } else {
                        this.tableHeight = config.setTableHeight('ui-main-module', this.otherHeight);
                    }
                    this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
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
                this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
            });
            const vm = this;
            window.onresize = function(){
                document.querySelector('body').style.overflow = 'hidden';
                vm.tableHeight = config.setTableHeight('s-main', vm.otherHeight, null, vm.extraView);
                vm.$refs['myTable'].doLayout && vm.$refs['myTable'].doLayout();
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
                    vm.$refs['myTable'].doLayout && vm.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400);
            },
        }
    };
</script>

<style scoped lang="less">
    @borderColor: #efefef;

    /deep/.vxe-table {
        border-left: 1px solid @borderColor;
        border-right: 1px solid @borderColor;
        .vxe-table--header-wrapper {
            border-top: 1px solid @borderColor;
        }
        th {
            color: #666666;
            background: #f5f8fa!important;
        }
        td {
            color: #333333;
        }
    }

    /deep/.vxe-table .vxe-cell {
        padding: 0 8px;
    }

    /deep/.vxe-table.t--border .vxe-body--column {
        border-right: 1px solid @borderColor;
        border-bottom: 1px solid @borderColor;
    }

    /deep/.vxe-table .vxe-tree-wrapper {
        width: 20px;
        .vxe-tree--node-btn {
            font-size: 14px;
        }
    }

    /deep/.vxe-icon--caret-right:before {
        content: "";
        position: absolute;
        top: .38em;
        left: .12em;
        width: .5em;
        height: .5em;
        border-width: .1em;
        border-style: solid;
        border-top-color: inherit;
        border-right-color: inherit;
        border-bottom-color: transparent;
        border-left-color: transparent;
        transform: rotate(315deg);
    }

</style>
