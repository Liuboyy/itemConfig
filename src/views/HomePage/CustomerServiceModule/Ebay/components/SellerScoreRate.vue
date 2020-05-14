<template>
    <el-dialog class="ui-layout_edit-dialog"
               top="20vh"
               width="900px"
               :title="title"
               :visible="visible"
               @close="handleCloseDialog">
        <div class="ui-dialog_area">
            <div v-if="dateType === '1'">
                <ComIcon name="yellow_bg" class="icon_bg"></ComIcon>
                <span class="ui-time">过去一年</span>
            </div>
            <div v-if="dateType === '3'">
                <ComIcon name="blue_bg" class="icon_bg"></ComIcon>
                <span class="ui-time">过去三个月</span>
            </div>
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
        </div>
    </el-dialog>
</template>
<script>

    import { autoAddTableInx } from '@/services';

    export default{
        name: 'SellerScoreRate',
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
                    return ['280px', '140px', 'total_count', 'count', 'rate', 'standard_rate'];
                }
            },
            detailsData: {
                type: Object,
                default () {
                    return {};
                }
            },
            dateType: {
                type: String,
                default: ''
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

        .icon_bg {
            position: absolute;
            left: 120px;
            top: -34px;
        }
        .ui-time {
            position: absolute;
            left: 136px;
            top: -32px;
            font-size: @fontSize;
            color: #fff;
        }
    }
</style>