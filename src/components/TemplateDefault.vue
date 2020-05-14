<template>
    <div class="ui-default_template" :style="{height: height, backgroundColor: color}" :class="className">
        <slot></slot>
    </div>
</template>

<script>
    import CONFIG from '@/assets/js/config'
    export default {
        name: "TemplateDefault",
        props: {
            className: {
                type: String,
                default: ''
            },
            color: {
                type: String,
                default: 'none'
            },
            static: {
                type: Array,
                default() {
                    return []
                }
            },
            staticNum: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                height: ''
            }
        },
        mounted() {
            this.$nextTick().then(() => {
                this.height = CONFIG.setTableHeight('ui-default_template', this.staticNum, true);
            })
        }
    }
</script>

<style scoped>
    .ui-default_template {
        overflow: auto;
    }
</style>