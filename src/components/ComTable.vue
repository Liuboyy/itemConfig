<template>
    <div class="ui-m_table">
        <table>
            <thead>
                <tr>
                    <th v-for="(item, index) in tableKey" :key="index">
                        <div class="cell">{{item}}</div>
                    </th>
                </tr>
            </thead>
        </table>
        <div class="ui-m_table--tbody" :style="{height: tableHeight}">
            <table>
                <tbody>
                <tr v-for="(item, index) in tableData" :key="index">
                    <td v-for="prop in tableProps" :key="prop">
                        <div class="cell">
                            <span v-if="prop === 'index'"></span>
                            <span v-else>{{item[prop]}}</span>
                        </div>
                    </td>
                </tr>
                <div class="ui_NotData">
                    <NotData v-show="!tableData.length"></NotData>
                </div>
                </tbody>
            </table>
        </div>
        <div class="ui-down_bar" :style="{height: tableHeight}">
            <div class="ui-down_bar--flag"></div>
        </div>
    </div>
</template>

<script>
    import CONFIG from '@/assets/js/config';
    export default {
        name: "ComTable",
        props: {
            tableKey: {
                type: Array,
                default() {
                    return []
                }
            },
            tableData: {
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
            // 设置表格高度
            height: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                tableHeight: '100px',
                scrollIng: '',
                scrollIngTime: ''
            }
        },
        methods: {

            // 刷新表格高度
            handleRefreshTableHeight () {
                this.$nextTick().then(() => {
                    let areaEl = document.querySelector('.ui-m_table').offsetWidth;
                    let bodyEl = document.querySelector('.ui-m_table--tbody').offsetWidth;
                    if (areaEl > bodyEl) {
                        document.querySelector('.ui-down_bar').style.display = 'none';
                    } else {
                        document.querySelector('.ui-down_bar').style.display = 'block';
                    }
                });
            },
            // 表格滚动
            handleTableScrollTbody() {
                if (this.scrollIng === 'tbody') return;
                this.handleTableScrollIng();
                this.scrollIng = 'bar';
                const areaEl = document.querySelector('.ui-down_bar');
                areaEl.scrollTop = document.querySelector('.ui-m_table--tbody').scrollTop;
            },
            handleTableScrollBar() {
                if (this.scrollIng === 'bar') return;
                this.handleTableScrollIng();
                this.scrollIng = 'tbody';
                document.querySelector('.ui-m_table--tbody').scrollTop = document.querySelector('.ui-down_bar').scrollTop;
            },
            handleTableScrollIng() {
                clearTimeout(this.scrollIngTime);
                this.scrollIngTime = setTimeout(() => {
                    this.scrollIng = '';
                }, 50)
            },

        },
        mounted () {
            this.$nextTick().then(() => {
                this.tableHeight = CONFIG.setTableHeight('ui-m_table', 120, true);
                const callBackFn = () => {
                    let tbodyEl = document.querySelector('.ui-m_table tbody');
                    if (!tbodyEl.offsetHeight) {
                        setTimeout(() => {
                            callBackFn()
                        }, 100)
                    } else {
                        let areaEl = document.querySelector('.ui-m_table').offsetWidth;
                        let bodyEl = document.querySelector('.ui-m_table--tbody').offsetWidth;
                        if (areaEl > bodyEl) {
                            document.querySelector('.ui-down_bar').style.display = 'none';
                        } else {
                            document.querySelector('.ui-down_bar').style.display = 'block';
                        }
                        document.querySelector('.ui-down_bar--flag').style.height = tbodyEl.offsetHeight + 'px';
                    }
                }
                callBackFn();

                const bodyEl = document.querySelector('.ui-m_table--tbody');
                bodyEl.addEventListener('scroll', this.handleTableScrollTbody);

                const barEl = document.querySelector('.ui-down_bar');
                barEl.addEventListener('scroll', this.handleTableScrollBar);
            });
        },
    }
</script>

<style scoped lang="less">
    .ui-m_table {
        position: relative;
        width: 100%;
        overflow-y: auto;
        background: #FFFFFF;

        table {
            border-collapse: collapse;
            background: #FFFFFF;
        }

        thead {
            padding-right: 17px;
            display: block;
        }

        th {
            text-align: left;
            font-size: 12px;
            font-weight: 700;
            color: #666;
            background: #fafafa;
        }

        .cell {
            position: relative;
            word-wrap: normal;
            text-overflow: ellipsis;
            vertical-align: middle;
            width: 100%;
            box-sizing: border-box;
            line-height: normal;
            padding: 8px!important;
        }

        tbody {
            display: block;
            overflow: auto;
        }

        tr:nth-child(2n) {
            background: #fafafa;
        }
    }
    .ui-m_table td, .ui-m_table th{
        border: 1px solid  #efefef;
        .cell {
            width: 100px;
        }
    }

    .ui-m_table td {
        text-align: left;
        font-size: 12px;
        color: #333;
        min-width: 0;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        box-sizing: border-box;

    }

    .ui-down_bar {
        width: 20px;
        overflow-y: auto;
        overflow-x: hidden;
        position: fixed;
        top: 182px;
        right: 0;

        .ui-down_bar--flag {
            width: 20px;
        }
    }

    .ui-m_table--tbody {
        width: fit-content;
        overflow: auto;
    }
    /deep/.ui_NotData {
        width: 100%;
        position: absolute;
        top: 35%;
        .ui-not_data-txt p {
            margin-top: 40px;
            margin-left: 10px;
            font-size: 14px;
            color: #909399;
        }
    }
</style>