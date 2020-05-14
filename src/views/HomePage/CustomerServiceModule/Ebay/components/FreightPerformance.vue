<template>
    <el-dialog class="ui-layout_edit-dialog"
               width="800px"
               :title="title"
               :visible="visible"
               @close="handleCloseDialog">
        <div class="ui-dialog_area">
            <p>您  {{detailsData.review_start_date}} - {{detailsData.review_end_date}}  期间综合表现为
                <span v-if="detailsData.c_result === '正常'" class="green">{{detailsData.c_result}}</span>
                <span v-if="detailsData.c_result === '超标'" class="red">{{detailsData.c_result}}</span>
                <span v-if="detailsData.c_result === '警告'" class="orange">{{detailsData.c_result}}</span>
                <span v-if="detailsData.c_result === '限制'" class="purple">{{detailsData.c_result}}</span>
                <span v-if="detailsData.c_result === '无'">{{detailsData.c_result}}</span>，
                上周状态
                <span v-if="detailsData.b_result === '正常'" class="green">{{detailsData.b_result}}</span>
                <span v-if="detailsData.b_result === '超标'" class="red">{{detailsData.b_result}}</span>
                <span v-if="detailsData.b_result === '警告'" class="orange">{{detailsData.b_result}}</span>
                <span v-if="detailsData.b_result === '限制'" class="purple">{{detailsData.b_result}}</span>
                <span v-if="detailsData.b_result === '无'">{{detailsData.b_result}}</span>
            </p>
            <p>数据更新时间：{{detailsData.refreshed_date}}</p>
            <p>超出标准<span>{{types === '1' ? '货运' : '非货运'}}</span>问题交易率：{{detailsData.glb_shtm_de_rate_pre}}</p>
            <div class="ui-main-module-table">
                <el-table border :data="dialogData">
                    <el-table-column label="指标名称" prop="metric_name"></el-table-column>
                    <el-table-column label="本周数据" prop="c_data">
                        <template slot-scope="scope">
                            <span>{{scope.row.c_data}}
                                <i class="icon-xiajiang1" v-if="scope.row.compare === 0"></i>
                                <i class="icon-shangsheng1" v-if="scope.row.compare === 1"></i>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="上周数据" prop="b_data"></el-table-column>
                </el-table>
            </div>
        </div>
    </el-dialog>
</template>
<script>

    export default{
        name: 'FreightPerformance',
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
            },
            types: {
                type: String,
                default: ''
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
    @marginBottom: 10px;
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

        .icon-xiajiang1 {
            font-size: 12px;
            color: #8dc644;
        }

        .icon-shangsheng1 {
            font-size: 12px;
            color: #fe3434;
        }

    }
</style>