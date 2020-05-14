<!--精品组工作报表-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="小组汇总" name="summary">
                <BoutiqueSummaryReport v-if="activeName == 'summary'"></BoutiqueSummaryReport>
            </el-tab-pane>
            <el-tab-pane label="小组详情" name="details">
                <BoutiqueDetailsReport v-if="activeName == 'details'"></BoutiqueDetailsReport>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import BoutiqueDetailsReport from './BoutiqueDetailsReport'
    import BoutiqueSummaryReport from './BoutiqueSummaryReport'

    import {mapGetters} from "vuex";

    export default {
        components: {
            BoutiqueDetailsReport,
            BoutiqueSummaryReport,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'summary',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.boutique_work_report.activeShow || 'summary';
        },
        watch: {
            activeName(val) {
                this.$store.state.boutique_work_report.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>