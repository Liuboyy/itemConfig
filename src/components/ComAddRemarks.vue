<template>
    <el-dialog
            title="添加备注"
            width="500px"
            class="ui-layout_edit-dialog"
            :visible="visible"
            :close-on-click-modal=false
            @close="handleCloseRemarkInfo">
        <el-form :model="remarkObj" :rules="remarkRules" ref="remarkObj">
            <el-form-item prop="remarks">
                <el-input
                    type="textarea"
                    :rows="8"
                    resize="none"
                    placeholder="请输入"
                    maxlength="200"
                    show-word-limit
                    v-model="remarkObj.remarks">
                </el-input>
            </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
            <el-button size="small" @click="handleCloseRemarkInfo">取消</el-button>
            <el-button size="small" @click="handleSaveRemarkInfo" type="primary">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "ComAddRemarks",
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                remarkObj: {
                    remarks: '',
                },
                remarkRules: {
                    remarks: [
                        {
                            required: true,
                            message: '请输入备注内容，再点击确定保存！',
                            trigger: 'blur'
                        },
                        {
                            max: 200,
                            min: 1,
                            message: '最多输入200个字符！',
                            trigger: 'blur'
                        },
                    ]
                },
                saveNumber: '',
            }
        },
        methods: {
            //关闭
            handleCloseRemarkInfo() {
                this.remarkObj.remarks = '';
                this.saveNumber = '';
                this.$emit('update:visible', false);
                this.$refs['remarkObj'].resetFields();
            },
            //确定
            handleSaveRemarkInfo() {
                this.$refs['remarkObj'].validate((res) => {
                    if(res) {
                        this.$emit('confirm', { ...this.remarkObj });
                        this.$emit('update:visible', false);
                    }
                })
            }
        },
        watch: {
            'remarkObj.remarks'(val){
                if(val && this.remarkObj.remarks) {
                    this.saveNumber = val.length;
                }
            }
        }
    }
</script>

<style scoped>

</style>