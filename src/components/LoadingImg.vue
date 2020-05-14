<template>
    <div>
        <div @click="handleClick" class="ui-table__img" ref="myImg">
            <div class="ui-image--static" v-show="src && !isComplete && !errorSrc" :style="{width, height}"></div>
            <div v-if="isComplete && src" :style="{width, height, background: `url(${src}) no-repeat center/contain`}"></div>

            <!--默认图-->
            <div v-if="(errorSrc || !src) && fileType === 'image'" :style="{width, height, lineHeight: height}">
                <img style="width: 100%;" src="../assets/image/default-img.png">
            </div>
            <div v-else-if="errorSrc">
                <img style="width: 100%;" src="../assets/image/wenjian.png">
            </div>

            <div class="ui-image--mask" :style="{lineHeight: height}"
                 v-if="isCanOperate">
                <span class="el-icon-download" @click.stop="handleDownFile(src)" v-if="operate.download"></span>
                <span class="el-icon-zoom-in" @click.stop="handleZoomImage(src)" v-if="operate.zoom && fileType === 'image'"></span>
            </div>
        </div>
        <LookImage :src="zoomUrl" :show.sync="isZoomShow"></LookImage>
    </div>
</template>

<script>

import CONFIG from '@/assets/js/config';

export default {
    name: 'LoadingImg',
    props: {
        src: {
            type: [String, Array],
            default: ''
        },
        width: {
            type: String,
            default: '60px'
        },
        height: {
            type: String,
            default: '60px'
        },
        row: {
            type: Object,
            default: null
        },
        operate: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data () {
        return {
            isComplete: false,
            errorSrc: false,

            isShowArtImg: false,
            previewArtInfo: {},

            isShowListImg: false,
            previewListImage: [],
            times: null,

            //
            isZoomShow: false,
            zoomUrl: ''
        };
    },
    computed: {
        fileType() {
            if (!this.src) return 'image';
            let imgType = ['.jpg', '.jpeg', '.gif', '.png'];
            return imgType.some(value => this.src.indexOf(value) > -1) ? 'image' : 'file'
        },
        isCanOperate() {
            if (this.fileType === 'image') {
                return JSON.stringify(this.operate) !== '{}' && this.isComplete
            } else {
                return JSON.stringify(this.operate) !== '{}' && this.src
            }
        }
    },
    methods: {
        handleClick (e) {
            if (!this.isComplete) return;
            this.$emit('click', e);
        },

        handleDownFile(src) {
            if (this.fileType === 'image') {
                let name = '图片';
                let image = new Image();
                // 解决跨域 Canvas 污染问题
                image.setAttribute("crossOrigin", "anonymous");
                image.onload = function() {
                    let canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    let context = canvas.getContext("2d");
                    context.drawImage(image, 0, 0, image.width, image.height);
                    let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
                    let a = document.createElement("a"); // 生成一个a元素
                    let event = new MouseEvent("click"); // 创建一个单击事件
                    a.download = name || "photo"; // 设置图片名称
                    a.href = url; // 将生成的URL设置为a.href属性
                    a.dispatchEvent(event); // 触发a的单击事件
                };
                image.src = src;
            } else {
                window.open(`${src}&access_token=${CONFIG.FILE_ACCESS_TOKEN}`, '_self');
            }
        },

        // 图片放大
        handleZoomImage(src) {
            this.zoomUrl = src;
            this.isZoomShow = true;
        },

        handleRefreshImage() {
            if (this.fileType === 'image') {
                let image = document.createElement('img');
                image.src = this.src;
                image.height = this.height;
                image.width = this.width;
                image.style.display = 'none';
                image.addEventListener('load', () => {
                    this.isComplete = true;
                });

                image.addEventListener('error', () => {
                    this.errorSrc = true;
                });
            } else {
                this.errorSrc = true;
            }
        }
    },
    mounted () {
        const vm = this;
        this.$nextTick(() => {
            if (this.src) {
                this.handleRefreshImage();
            }
        });
    },
    watch: {
        src(val) {
            if (val) {
                this.handleRefreshImage();
            }
        }
    }
};
</script>

<style scoped lang="less">
.ui-table__img {
    /*background: #eeeeee;*/
    border: 1px solid #e6e6e6;
    display: inline-block;
    text-align: center;
    position: relative;
}

.ui-table__img img {
    width: 100%;
    height: 100%;
}

.ui-image--static {
    padding: 10px;
    box-sizing: border-box;
    background: url("../assets/image/img_loading.gif") no-repeat center/50%;
}

.icon-tupianshangchuan {
    font-size: 34px;
    vertical-align: middle;
    margin: 0;
}

    .ui-table__img:hover .ui-image--mask {
        display: block!important;
    }

    .ui-image--mask {
        display: none;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, .3);
        text-align: center;

        span {
            margin: 0 5px;
            cursor: pointer;
            color: #cccccc;
            font-size: 20px;

            &:hover {
                color: #FFFFFF;
            }
        }
    }
</style>
