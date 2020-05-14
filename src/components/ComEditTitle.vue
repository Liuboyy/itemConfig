<template>
    <el-dialog
            title="编辑显示数据"
            width="800px"
            class="ui-layout_edit-dialog"
            :visible="visible"
            @close="handleCloseInfo">
        <div class="ui-check_box">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="checkTitle" @change="handleCheckedTitleChange">
                <el-checkbox v-for="item in editTitleList"
                             :key="item.value"
                             :label="item.value">{{item.label}}</el-checkbox>
            </el-checkbox-group>
        </div>
        <div class="dialog-footer" slot="footer">
            <el-button size="small" @click="handleCloseInfo">取消</el-button>
            <el-button size="small" @click="handleConfirmInfo" type="primary">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>

    export default{
        name: 'ComEditTitle',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            isIndeterminate: {
                type: Boolean,
                default: true
            },
            checkAll: {
                type: Boolean,
                default: false
            },
            checkTitle: {
                type: Array,
                default() {
                    return []
                }
            },
            editTitleList: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data(){
            return {

            }
        },
        computed: {},
        methods: {

            //取消
            handleCloseInfo() {
                this.$emit('update:visible', false);
            },
            //确定
            handleConfirmInfo() {
                this.$emit('update:visible', false);
            },


            //全选
            handleCheckAllChange() {

            },

            //单选
            handleCheckedTitleChange() {

            }

        },
        created() {

        }
    }
</script>
<style scope lang="less">
    .ui-layout_edit-dialog {
        .ui-check_box {
            .el-checkbox+.el-checkbox {
                margin-left: 0;
            }
            .el-checkbox {
                width: 120px;
                margin: 5px 30px 5px 0;
            }
            .el-checkbox__label {
                font-size: 12px;
            }
        }
    }
</style>