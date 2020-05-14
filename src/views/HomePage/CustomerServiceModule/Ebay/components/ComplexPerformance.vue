<template>
    <el-dialog class="ui-layout_edit-dialog"
               width="800px"
               :title="title"
               :visible="visible"
               @close="handleCloseDialog">
        <div class="ui-dialog_area">
            <p>您 {{detailsData.dft_wk_eval_beg_dt}} 至 {{detailsData.dft_lst_eval_end_dt}} 期间综合表现为
                <span v-if="detailsData.integrte_evaluation === '正常'" class="green">{{detailsData.integrte_evaluation}}</span>
                <span v-if="detailsData.integrte_evaluation === '超标'" class="red">{{detailsData.integrte_evaluation}}</span>
                <span v-if="detailsData.integrte_evaluation === '警告'" class="orange">{{detailsData.integrte_evaluation}}</span>
                <span v-if="detailsData.integrte_evaluation === '限制'" class="purple">{{detailsData.integrte_evaluation}}</span>
                <span v-if="detailsData.integrte_evaluation === '不考核'" class="blue">{{detailsData.integrte_evaluation}}</span>
                <span v-if="detailsData.integrte_evaluation === '无'">{{detailsData.integrte_evaluation}}</span>
            </p>
            <p>数据更新时间：{{detailsData.refreshed_date}}</p>
            <p>其中，不良交易率表现状态：
                <span v-if="detailsData.status_lst_eval === '正常'" class="green">{{detailsData.status_lst_eval}}</span>
                <span v-if="detailsData.status_lst_eval === '超标'" class="red">{{detailsData.status_lst_eval}}</span>
                <span v-if="detailsData.status_lst_eval === '警告'" class="orange">{{detailsData.status_lst_eval}}</span>
                <span v-if="detailsData.status_lst_eval === '限制'" class="purple">{{detailsData.status_lst_eval}}</span>
                <span v-if="detailsData.status_lst_eval === '不考核'" class="blue">{{detailsData.status_lst_eval}}</span>
                <span v-if="detailsData.status_lst_eval === '无'">{{detailsData.status_lst_eval}}</span>
            </p>
            <div class="ui-main-module-table">
                <el-table border :data="dialogData">
                    <el-table-column
                            v-for="(item, index) in dialogKey"
                            :key="index"
                            :label="item"
                            :prop="dialogProps[index]"
                            :type="dialogProps[index] === 'index' ? 'index' : ''"
                            :width="dialogWidth[index] || ''">
                        <template slot-scope="scope">
                            <slot :name="dialogProps[index]" :row="scope.row" :$index="scope.$index">
                                {{dialogProps[index] === 'index' ? autoAddTableInx(scope.$index) : scope.row[dialogProps[index]]}}
                            </slot>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <p>纠纷表现状态：
                <span v-if="detailsData.snad_status_lst_eval === '正常'" class="green">{{detailsData.snad_status_lst_eval}}</span>
                <span v-if="detailsData.snad_status_lst_eval === '超标'" class="red">{{detailsData.snad_status_lst_eval}}</span>
                <span v-if="detailsData.snad_status_lst_eval === '警告'" class="orange">{{detailsData.snad_status_lst_eval}}</span>
                <span v-if="detailsData.snad_status_lst_eval === '限制'" class="purple">{{detailsData.snad_status_lst_eval}}</span>
                <span v-if="detailsData.snad_status_lst_eval === '不考核'" class="blue">{{detailsData.snad_status_lst_eval}}</span>
                <span v-if="detailsData.snad_status_lst_eval === '无'">{{detailsData.snad_status_lst_eval}}</span>
            </p>
            <p>下次评估时间：{{detailsData.next_review_dt}}  当前表现({{detailsData.pre_datetime1}} 至 {{detailsData.pre_datetime2}})
                预期状态为：
                <span v-if="detailsData.status_wk_eval === '正常'" class="green">{{detailsData.status_wk_eval}}</span>
                <span v-if="detailsData.status_wk_eval === '超标'" class="red">{{detailsData.status_wk_eval}}</span>
                <span v-if="detailsData.status_wk_eval === '警告'" class="orange">{{detailsData.status_wk_eval}}</span>
                <span v-if="detailsData.status_wk_eval === '限制'" class="purple">{{detailsData.status_wk_eval}}</span>
                <span v-if="detailsData.status_wk_eval === '不考核'" class="blue">{{detailsData.status_wk_eval}}</span>
                <span v-if="detailsData.status_wk_eval === '无'">{{detailsData.status_wk_eval}}</span>
            </p>
        </div>
    </el-dialog>
</template>
<script>

    import { autoAddTableInx } from '@/services';

    export default{
        name: 'ComplexPerformance',
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
            dialogKey: {
                type: Array,
                default () {
                    return [];
                }
            },
            dialogProps: {
                type: Array,
                default () {
                    return [];
                }
            },
            dialogWidth: {
                type: Array,
                default () {
                    return ['250'];
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
            autoAddTableInx,

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

    }
</style>