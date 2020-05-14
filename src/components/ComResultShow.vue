<template>
    <el-dialog
            :title="title"
            width="440px"
            class="ui-layout_edit-dialog"
            :visible ="visible"
            @close="handleCloseInfo">
        <el-form>
            <ComIcon name="audit_result" class="ui_pic"></ComIcon>
            <p class="ui_text">已处理数量：{{processedNum}}</p>
            <p class="ui_text">未处理数量：{{unProcessedNum}}</p>
        </el-form>
        <div class="dialog-footer" slot="footer">
            <el-button size="small" @click="handleCloseInfo">关闭</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "ComResultShow",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default() {
                    return ''
                }
            },
            processedNum: {
                type: Number,
                default() {
                    return 0
                }
            },
            unProcessedNum: {
                type: Number,
                default() {
                    return 0
                }
            }
        },
        data() {
            return {}
        },
        methods: {
            handleCloseInfo() {
                this.$emit('update:visible', false);
            },
        }
    }
</script>

<style scoped lang="less">
    .ui-layout_edit-dialog {
        .ui_pic {
            position: relative;
            top: 0;
            left: 43%;
        }
        .ui_text {
            font-size: 12px;
            font-weight: bold;
            color: #333333;
            text-align: center;
            margin-top: 20px;
        }
    }
</style>