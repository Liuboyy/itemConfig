<template>
    <el-dialog
            class="ui-layout_edit-dialog ui-look_image--dialog"
            top="8vh"
            title="预览图片"
            width="1000px"
            append-to-body
            :visible.sync="isShow"
            @close="handleClosePreview">
        <div class="ui-look_image" ref="lookImage">
            <div class="ui-look_image--area">
                <img v-for="url in srcList"
                     :src="url"
                     alt=""
                     style="display: none">
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import Viewer from 'viewerjs';
    export default {
        name: "LookImage",
        props: {
            // 多个图片时，数组的最后一个就是显示图片的索引 必须是Number类型，空则会默认第一张
            src: {
                type: [Array, String],
                default() {
                    return [];
                }
            },
            show: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                areaObj: {},
                isShow: false
            }
        },
        computed: {
            srcList() {
                if (Array.isArray(this.src)) {
                    if (Number.isInteger(this.src[this.src.length - 1])) {
                        return this.src.filter((value, index) => {
                            return index !== this.src.length - 1;
                        })
                    } else {
                        return this.src;
                    }
                } else {
                    return [this.src];
                }
            },
            showIndex() {
                if (!Array.isArray(this.src)) return '';
                let inx = this.src[this.src.length - 1];
                return inx
            }
        },
        mounted() {

        },
        methods: {
            handleClosePreview() {
                this.$emit('update:show', false);
            },

            // 加载
            handleLoadImage(type) {
                this.$nextTick().then(() => {
                    let lookImageArea;
                    if (type === 'change') {
                        lookImageArea = this.$refs['lookImage'].querySelectorAll('.ui-look_image--area img');
                        this.areaObj.view(this.showIndex);
                        this.areaObj.update(lookImageArea, {
                            inline: true,
                            viewed() {
                                document.querySelector('.viewer-play').style.display = 'none';
                                document.querySelector('.viewer-prev').style.display = 'block';
                                document.querySelector('.viewer-next').style.display = 'block';
                            }
                        });
                        this.areaObj.reset();
                        this.areaObj.view(this.showIndex);
                        this.areaObj.zoomTo(1);
                    } else {
                        lookImageArea = this.$refs['lookImage'].querySelector('.ui-look_image--area');
                        this.areaObj = new Viewer(lookImageArea, {
                            inline: true,
                            viewed() {
                                document.querySelector('.viewer-play').style.display = 'none';
                                document.querySelector('.viewer-prev').style.display = 'block';
                                document.querySelector('.viewer-next').style.display = 'block';
                            }
                        });
                        this.areaObj.zoomTo(1);
                        this.areaObj.view(this.showIndex);
                    }
                })
            }
        },
        watch: {
            show(val) {
                if (!val) {
                    // this.areaObj && this.areaObj.reset();
                    return;
                };
                this.isShow = this.show;
                this.$nextTick(() => {
                    if (this.areaObj.update) {
                        this.handleLoadImage('change');
                    } else {
                        this.handleLoadImage('init');
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .ui-look_image {
        width: 100%;
        overflow: hidden;
        height: 600px;
        .ui-look_image--area {
            /*overflow: hidden;*/
            height: 600px;
            transition: all linear .1s;
            img {
                /*width: 100%;*/
                /*height: 100%;*/
            }
        }
    }

    .ui-look_image--oper {
        height: 50px;
        line-height: 50px;
        text-align: center;

        span {
            cursor: pointer;

            &:hover {
                color: #5980FC;
            }
        }
    }

    .ui-look_image--dialog {
        /deep/ .el-dialog__body {
            padding: 0!important;
        }
    }
</style>