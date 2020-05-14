<template>
    <el-button v-if="buttonList[permit] && buttonList[permit].permit()"
               :type="type"
               :disabled="disabled"
               size="small"
               @click="handleClick">{{label}}</el-button>
    <el-button v-else :type="type" size="small" disabled>{{label}}</el-button>
</template>

<script>
    import CONFIG from '@/assets/js/config';
    import {
        mapGetters
    } from 'vuex';
    export default {
        name: "ComPermitButton",
        props: {
            label: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'text'
            },
            permit: {
                type: String,
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                buttonList: [],
            }
        },
        computed: {
        },
        methods: {
            handleClick(e) {
                this.$emit('click', e);
            }
        },
        created() {
            this.buttonList = CONFIG.AUTHORITY_BUTTON[this.$route.path.replace('/', '')].buttonList;
        }
    }

</script>

<style scoped>

</style>
