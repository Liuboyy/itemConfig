<template>
    <div class="ui-upload">
        <el-upload
            ref="myUpload"
            :multiple="multiple"
            :name="name"
            :auto-upload="autoUpload"
            :show-file-list="false"
            :action="url"
            :on-change="handleChange"
            :on-success="autoUploadSuccess"
            :on-error="autoUploadError"
            :before-upload="beforeAvatarUpload"
            :disabled="isDisabled"
            :data="upData">
            <slot name="icon"></slot>
            <el-button :type="btnType"
                       :size="btnSize"
                       :disabled="isDisabled">{{ label }}
            </el-button>
        </el-upload>
    </div>
</template>

<script>
export default {
    name: 'ComUpload',
    props: {
        file: {},
        multiple: {
            type: Boolean,
            default: false
        },
        autoUpload: {
            type: Boolean,
            default: true
        },
        btnType: {
            type: String,
            default: 'primary'
        },
        btnSize: {
            type: String,
            default: 'small'
        },
        url: {
            type: String,
            default: '/'
        },
        label: {
            type: String,
            default: '上传'
        },
        name: {
            type: String,
            default: 'file'
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        fileSize: {
            type: Number,
            default: 2
        },
        upData: {
            type: Object,
            default () {
                return {};
            }
        },
        checkFile: {
            type: Array,
            default() {
                return ['csv', 'xls', 'xlsx']
            }
        },
        success: {
            type: Boolean,
            default: false
        },
        errorFn: {
            type: Function,
            default: function (res) {
                let str = '';
                if (res.errorMess_data) {
                    for (let i = 0; i < res.errorMess_data.length; i++) {
                        str += `<div>${res.errorMess_data[i]}</div>`;
                        this.$alert(str, '错误原因', {
                            customClass: 'ui-error-list',
                            dangerouslyUseHTMLString: true
                        });
                    }
                }
                if (res.errorMess || res.error_Mess) {
                    str = `<div>${res.errorMess || res.error_Mess}</div>`;
                    this.$alert(str, '错误原因', {
                        customClass: 'ui-error-list',
                        dangerouslyUseHTMLString: true
                    });
                }
                this.$message({
                    type: 'error',
                    message: '上传失败'
                });
            }
        }
    },
    data () {
        return {
            tipLabel: ''
        };
    },
    methods: {
        handleChange (file, fileList) {
            // console.log(file, fileList)
            this.$emit('update:file', file);
            if (!this.autoUpload) {
                this.$refs.myUpload.clearFiles();
            }
        },

        // 上传成功
        autoUploadSuccess (res) {
            if (res.status) {
                if(this.success) {
                    this.$emit('success', res);
                }else {
                    this.$message({
                        type: 'success',
                        message: '上传成功'
                    });
                    this.$emit('success', res);
                }
            } else {
                this.errorFn && this.errorFn(res);
            }

            this.$refs.myUpload.clearFiles();
        },

        // 文件校验
        beforeAvatarUpload (file) {
            this.$emit('onUpload', file);
            const isType = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
            const isTrueType = this.checkFile.indexOf(isType) > -1;
            if (!isTrueType) {
                this.$message.error(`仅支持“${this.checkFile.join('，')}”文件`);
                return;
            }
            return isTrueType;
        },

        // 上传失败
        autoUploadError (err) {
            this.$message({
                type: 'error',
                message: err || '上传失败'
            });
        },
    }
};
</script>

<style scoped>
.ui-upload {
    display: inline-block;
    /*margin-right: 10px;*/
}

/*/deep/.el-button {*/
/*padding: 9px;*/
/*}*/
</style>
