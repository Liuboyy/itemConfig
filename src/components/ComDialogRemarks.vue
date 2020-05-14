<template>
    <el-dialog
        width="400px"
        class="ui-layout_edit-dialog"
        custom-class="ui-com_edit"
        :title="title"
        :validate-on-rule-change="false"
        :visible="visible"
        @close="handleClose">
        <el-form ref="submitData" :model="submitData" :rules="submitRule">
            <slot v-if="formLabel">
                <el-form-item prop="state" :label="formLabel" :label-width="labelWidth"
                              v-if="type === 'radio' || type === ''">
                    <el-radio-group v-model="submitData.state">
                        <el-radio :label="1">通过</el-radio>
                        <el-radio :label="2">失败</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="check" :label="formLabel" :label-width="labelWidth" v-if="type === 'select'">
                    <el-select size="small" v-model="submitData.check" filterable clearable>
                        <el-option v-for="(label, value) in option"
                                   :key="value"
                                   :label="label"
                                   :value="value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="check" :label="formLabel" :label-width="labelWidth" v-if="type === 'input'">
                    <el-input size="small" v-model="submitData.check"></el-input>
                </el-form-item>
                <el-form-item prop="check" :label="formLabel" :label-width="labelWidth" v-if="type === 'checkbox'">
                    <el-checkbox-group v-model="submitData.checkList">
                        <el-checkbox v-for="(label, value, index) in option"
                                     :key="value"
                                     :label="value"
                                     :disabled="checkList.indexOf(value) > -1"
                                     :value="value">{{label}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </slot>
            <el-form-item prop="remark" :label="remarksLabel" :label-width="labelWidth" v-if="showRemarks">
                <el-input type="textarea" size="small" v-model="submitData.remark" :rows="5" placeholder="请输入"
                          :maxlength="maxlen"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="ui-com_edit--btn">
            <el-button size="small" @click="handleClose">取消</el-button>
            <el-button size="small" type="primary" @click="handleSubmit">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'ComDialogRemarks',
    props: {
        title: {
            type: String,
            default: '请确认'
        },
        formLabel: {
            type: String,
            default: ''
        },
        remarksLabel: {
            type: String,
            default: '备注'
        },
        visible: {
            type: Boolean,
            default: false
        },
        isRemarks: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: ''
        },
        option: {
            type: Object,
            default () {
                return {};
            }
        },
        showRemarks: {
            type: Boolean,
            default: false
        },
        checkList: {
            type: Array,
            default () {
                return [];
            }
        },
        required: {
            type: String,
            default: ''
        },
        maxlen: {
            type: String,
            default: '50'
        }
    },
    data () {
        return {
            submitData: {
                state: '',
                remark: '',
                check: '',
                checkList: []
            },
            submitRule: {},
            labelWidth: '70px'
        };
    },
    methods: {

        // 关闭
        handleClose () {
            this.$refs.submitData.resetFields();
            this.$emit('update:visible', false);
        },

        // 保存
        handleSubmit () {
            this.$refs.submitData.validate(res => {
                if (res) {
                    this.$emit('confirm', {...this.submitData});
                    this.$emit('update:visible', false);
                }
            });
        }
    },
    created () {

        this.$set(this.submitRule, 'remark', [
            {
                required: this.isRemarks,
                message: '带*号不能为空！',
                trigger: 'blur'
            }
        ]);

        if (this.required) {
            this.$set(this.submitRule, this.required, [
                {
                    required: true,
                    message: '带*号不能为空！',
                    trigger: 'blur'
                }
            ]);
        }
    },
    watch: {
        checkList (val) {
            this.$set(this.submitData, 'checkList', val);
        },

        isRemarks (val) {
            this.$set(this.submitRule, 'remark', [
                {
                    required: val,
                    message: '带*号不能为空！',
                    trigger: 'blur'
                }
            ]);
        }
    }
};
</script>

<style scoped lang="less">
/deep/ .el-select {
    width: 100% !important;
}
</style>
