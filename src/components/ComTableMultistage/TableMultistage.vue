<template>
    <div class="ui-main-module-table" v-if="initTable">
        <slot></slot>
        <el-table
                ref="myTable"
                :stripe="stripe"
                :border="border"
                :highlight-current-row="highlightRow"
                :data="data"
                :height="tableHeight"
                @expand-change="handleOpenChange">
            <ColumnMultistage v-for="(item,index) in col" :key="index" :col="item"></ColumnMultistage>
        </el-table>
    </div>
</template>

<script>
    import ColumnMultistage from './ColumnMultistage'

    import { autoAddTableInx } from '../../services';
    import config from '@/assets/js/config';

    export default {
        components: {
            ColumnMultistage
        },
        props: {
            col: {
                type: Array,
                default() {
                    return []
                }
            },
            data: {
                type: Array,
                default() {
                    return []
                }
            },
            stripe: {
                type: Boolean,
                default: true
            },
            border: {
                type: Boolean,
                default: true
            },
            highlightRow: {
                type: Boolean,
                default: true
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
            otherHeight: {
                type: Array,
                default () {
                    return [];
                }
            },
            showSearch: {
                type: Boolean,
                default: true
            },
        },
        data() {
            return {
                initTable: true,
                tableHeight: '100px',
            }
        },
        methods: {
            autoAddTableInx,


            handleOpenChange() {
                this.handleRefreshTableHeight();
            },

            // 刷新表格高度
            handleRefreshTableHeight() {
                document.querySelector('body').style.overflow = 'hidden';

                if (this.height) {
                    this.tableHeight = this.height;
                } else {
                    this.tableHeight = config.setTableHeight('ui-main-module', this.otherHeight);
                }

                this.$refs['myTable'].doLayout();
                document.querySelector('body').style.overflow = '';
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
            });
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
            }
        }
    }
</script>
<style scoped>

</style>