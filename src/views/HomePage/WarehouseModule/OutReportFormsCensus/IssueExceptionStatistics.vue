<template>
    <TemplateDefault  color="#FFFFFF">
        <div class="ui-iframe-view">
            <iframe :src="src" frameborder="0" :height="iFrameHeight"></iframe>
        </div>
    </TemplateDefault>
</template>

<script>

    import {
        mapActions,
        mapGetters
    } from 'vuex';

    export default {
        data() {
            return {
                iFrameHeight: '840px',
                src: '',
            }
        },
        computed: {
            ...mapGetters([
                'loginInfo',
                'queryParamsInfo',
            ])
        },
        methods: {},
        created() {
            const url = 'http://39.108.177.51:8080/WebReport/ReportServer?reportlet=wms%2Fchuku_outstock_exception.cpt&op=view&user_number=';
            this.src = url + `${this.loginInfo.staff_code}`;

        }
    }

</script>

<style scoped lang="less">
    .ui-iframe-view {
        position: absolute;
        width: 88%;
        top: 40px;
        iframe {
            width: 100%;
        }
    }

</style>