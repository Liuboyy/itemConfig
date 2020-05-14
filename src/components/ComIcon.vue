<template>
    <i :class="'bg-' + name" @click="handleClick"></i>
</template>

<script>
    export default {
        name: "ComIcon",
        props: {
            name: {
                type: String,
                default() {
                    return ''
                }
            }
        },
        methods: {
            handleClick() {
                this.$emit('click');
            }
        }
    }
</script>

<style scoped lang="less">

    .bg-shrink_down {
        width: 78px; height: 10px;
        background: url('../assets/image/shrink.png') -10px -10px;
    }

    .bg-shrink_up {
        width: 78px; height: 10px;
        background: url('../assets/image/shrink.png') -10px -40px;
    }

    .bg-zzt {
        width: 21px; height: 17px;
        background: url('../assets/image/chart_icon.png') -10px -10px;
    }

    .bg-zxt {
        width: 21px; height: 17px;
        background: url('../assets/image/chart_icon.png') -51px -10px;
    }

    .bg-icon_progress {
        width: 161px; height: 26px;
        background: url('../assets/image/icon_baise.png') -10px -10px;
    }

    .bg-audit_result {
        width: 57px; height: 70px;
        background: url('../assets/image/batch.png') -87px -10px;
    }

    .bg-yellow_bg {
        width: 78px; height: 24px;
        background: url('../assets/image/title_bg.png') -10px -54px;
    }

    .bg-blue_bg {
        width: 89px; height: 24px;
        background: url('../assets/image/title_bg.png') -10px -10px;
    }

    i {
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
    }
</style>