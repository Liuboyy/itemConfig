<!--摄影工作报表-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="小组汇总" name="summary">
                <PhotoGroupSummaryReport v-if="activeName == 'summary'"></PhotoGroupSummaryReport>
            </el-tab-pane>
            <el-tab-pane label="小组详情" name="details">
                <PhotoGroupDetailsReport v-if="activeName == 'details'"></PhotoGroupDetailsReport>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import PhotoGroupSummaryReport from './PhotoGroupSummaryReport'
    import PhotoGroupDetailsReport from './PhotoGroupDetailsReport'

    import {mapGetters} from "vuex";

    export default {
        components: {
            PhotoGroupSummaryReport,
            PhotoGroupDetailsReport,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'summary',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.photograph_work_report.activeShow || 'summary';
        },
        watch: {
            activeName(val) {
                this.$store.state.photograph_work_report.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>