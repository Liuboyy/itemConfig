<!--设计组工作报表-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="小组汇总" name="summary">
                <DesignGroupSummaryReport v-if="activeName == 'summary'"></DesignGroupSummaryReport>
            </el-tab-pane>
            <el-tab-pane label="小组详情" name="details">
                <DesignGroupDetailsReport v-if="activeName == 'details'"></DesignGroupDetailsReport>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import DesignGroupDetailsReport from './DesignGroupDetailsReport'
    import DesignGroupSummaryReport from './DesignGroupSummaryReport'

    import {mapGetters} from "vuex";

    export default {
        components: {
            DesignGroupDetailsReport,
            DesignGroupSummaryReport,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'summary',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.design_work_report.activeShow || 'summary';
        },
        watch: {
            activeName(val) {
                this.$store.state.design_work_report.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>