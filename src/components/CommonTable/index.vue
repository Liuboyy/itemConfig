<template>
    <div class="ui-common_table">
        <div class="table_content" v-if="showTable">
            <TableHead :check="isCheck" ref="tableHead" :table-key="tableKey" @changeWidth="handleChangeHead" :table-width="tableWidth"
                       :indeterminate="isInCheck" @checkAll="handleCheckAll"></TableHead>
            <TableBody ref="tableBody" :check="isCheck" :width="tableHeadWidth" :height="tableHeight" :table-props="tableProps" :table-data="tableData" :table-key="tableKey" :table-width="tableThWidths" @checked="handleCheckRow">
                <template v-for="item in tableProps" :slot="item" slot-scope="scope">
                    <slot :name="item" :row="scope.row" :$index="scope.$index"></slot>
                </template>
                <template slot="empty">
                    <NotData></NotData>
                </template>
            </TableBody>
        </div>
        <div class="ui-scroll_box" :style="{height: tableHeight}">
            <div class="ui-scroll_box--content"></div>
        </div>
    </div>
</template>

<script>
    import TableBody from './TableBody'
    import TableHead from './TableHead'
    import CONFIG from '@/assets/js/config';
    export default {
        name: "CommonTable",
        components: {
            TableHead,
            TableBody
        },
        props: {
            height: {
                type: String,
                default: '100px'
            },
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
            isCheck: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // tableKey: ['序号', '姓名', '性别'],
                // tableProps: ['index', 'name', 'sex'],
                // tableData: [
                //     {
                //         index: '0',
                //         name: '小白',
                //         sex: '男'
                //     }
                // ],
                tableHeight: '100px',
                tableThWidths: [],
                tableHeadWidth: '',
                isInCheck: false,

                // 标记滚动区域
                flagScroll: '',

                // 通过V-IF重新渲染表格
                showTable: true
            }
        },
        methods: {

            // 表头修改
            handleChangeHead(widths) {
                this.tableThWidths = widths.thws;
                this.tableHeadWidth = widths.headws;
                this.doLayout();
            },

            // 重新渲染Table
            doLayout() {
                this.showTable = true;
                this.$nextTick().then(() => {
                    const tableMain = this.$refs.tableBody.$el.querySelector('table');
                    const tableContent = this.$el.querySelector('.table_content');
                    const scrollEle = this.$el.querySelector('.ui-scroll_box--content');

                    // 偏差值
                    const offsetVal = 3;
                    const tableHeight = CONFIG.setTableHeight('ui-main', 0);
                    if (tableContent.scrollWidth > tableContent.clientWidth) {
                        this.tableHeight = parseInt(tableHeight) - offsetVal - this.$refs.tableHead.$el.offsetHeight - 17 + 'px';
                        this.$el.querySelector('.ui-scroll_box').style.top = `${this.$refs.tableHead.$el.offsetHeight}px`;
                    } else {
                        this.tableHeight = parseInt(tableHeight) - offsetVal - this.$refs.tableHead.$el.offsetHeight + 'px';
                    }

                    const offsetHeight = tableMain.offsetHeight;
                    scrollEle.style.height = `${offsetHeight}px`;
                });
            },

            // 勾选列表
            handleCheckRow(vals) {
                this.isInCheck = !!vals.length && vals.length !== this.tableData.length;
                this.$refs.tableHead.allCheck = vals.length === this.tableData.length;
                this.$emit('checked', vals);
            },

            // 全选
            handleCheckAll(check) {
                if (check) {
                    this.isInCheck = false;
                }
                this.$refs.tableBody.handleCheckAll(check);
            },

            // scroll同步滚动
            handleSyncScroll() {
                const bodyScroll = this.$refs.tableBody.$el.querySelector('.ui-table__body--content');
                const scrollBox = this.$el.querySelector('.ui-scroll_box');
                if (this.flagScroll === 'body') {
                    scrollBox.scrollTop = bodyScroll.scrollTop;
                } else if (this.flagScroll === 'scrollbox') {
                    bodyScroll.scrollTop = scrollBox.scrollTop;
                }
            },

            // 控制滚动同步
            mouseoverScrollArea(e) {
                this.flagScroll = e.path.find(item => item.className && item.className.indexOf('ui-table__body') > -1) ? 'body' : 'scrollbox';
            },

            // 刷新表格
            handleRefresh() {
                this.showTable = false;
                this.doLayout();
            }
        },
        mounted() {
            this.doLayout();
            document.addEventListener('mouseover', this.mouseoverScrollArea);
            window.addEventListener('resize', this.handleRefresh);

            this.$nextTick().then(() => {
                const bodyScroll = this.$refs.tableBody.$el.querySelector('.ui-table__body--content');
                const scrollBox = this.$el.querySelector('.ui-scroll_box');
                bodyScroll.addEventListener('scroll', this.handleSyncScroll)
                scrollBox.addEventListener('scroll', this.handleSyncScroll)
            })
        },
        watch: {
            height(val) {
                // 偏差值
                const offsetVal = 3;
                this.tableHeight = parseInt(val) - offsetVal - this.$refs.tableHead.$el.offsetHeight + 'px';
            }
        },
        beforeDestroy() {
            document.removeEventListener('mouseover', this.mouseoverScrollArea);
            window.removeEventListener('resize', this.handleRefresh);
        }
    }
</script>

<style scoped>
    .ui-common_table {
        position: relative;
        box-sizing: border-box;
        border: 1px solid #ebeef5;
    }

    .table_content {
        overflow: auto;
    }

    .ui-scroll_box {
        position: absolute;
        right: 0;
        bottom: 0;
        overflow: auto;
    }

    .ui-scroll_box--content {
        width: 1px;
    }
</style>