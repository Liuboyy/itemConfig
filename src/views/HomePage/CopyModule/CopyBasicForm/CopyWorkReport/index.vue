<!--文案工作报表-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="小组汇总" name="summary">
                <CopyGroupSummary v-if="activeName == 'summary'"></CopyGroupSummary>
            </el-tab-pane>
            <el-tab-pane label="小组详情" name="details">
                <CopyGroupDetails v-if="activeName == 'details'"></CopyGroupDetails>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import CopyGroupSummary from './CopyGroupSummary'
    import CopyGroupDetails from './CopyGroupDetails'

    import {mapGetters} from "vuex";

    export default {
        components: {
            CopyGroupSummary,
            CopyGroupDetails,

        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'summary',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.copy_work_report.activeShow || 'summary';
        },
        watch: {
            activeName(val) {
                this.$store.state.copy_work_report.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>