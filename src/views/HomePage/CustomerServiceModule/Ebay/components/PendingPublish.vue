<template>
    <el-dialog class="ui-layout_edit-dialog"
               width="1000px"
               :title="title"
               :visible="visible"
               @close="handleCloseDialog">
        <div class="ui-dialog_area">
            <p>数据更新时间：{{detailsData.refreshed_date}}</p>
            <div class="ui-main-module-table">
                <el-table border :data="dialogData">
                    <el-table-column label="itemId" prop="item_id" width="120">
                        <template slot-scope="scope">
                            <a href="https://www.ebay.com/itm/372655400727" class="ui-link" target="_blank">{{scope.row.item_id}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column label="到期时间" prop="rm_dead_dt"></el-table-column>
                    <el-table-column label="下线时间" prop="auct_end_dt"></el-table-column>
                    <el-table-column label="刊登状态" prop="listing_status"></el-table-column>
                    <el-table-column label="交易额" prop="gmv_usd"></el-table-column>
                    <el-table-column label="交易量" prop="total_trans"></el-table-column>
                    <el-table-column label="问题交易量" prop="bbe_trans"></el-table-column>
                    <el-table-column label="比率(问题交易量/总交易量)" prop="problem_rate" width="170"></el-table-column>
                </el-table>
            </div>
        </div>
    </el-dialog>
</template>
<script>

    export default{
        name: 'PendingPublish',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            dialogData: {
                type: Array,
                default () {
                    return [];
                }
            },
            detailsData: {
                type: Object,
                default () {
                    return {};
                }
            }

        },
        data(){
            return {}
        },
        computed: {},
        methods: {
            //取消
            handleCloseDialog() {
                this.$emit('update:visible', false);
            },
        },
        created() {

        }
    }
</script>
<style scoped lang="less">

    @borderColor: #e6e6e6;
    @textColor: #333333;
    @marginBottom: 6px;
    @fontSize: 12px;

    .ui-dialog_area {
        p {
            color: @textColor;
            margin-bottom: @marginBottom;
            font-size: @fontSize;
        }

        .ui-main-module-table {
            margin-bottom: @marginBottom;
        }

    }
</style>