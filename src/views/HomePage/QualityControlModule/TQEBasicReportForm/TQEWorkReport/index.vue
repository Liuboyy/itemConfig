<!--TQE工作报表-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="日明细" name="dayDetail">
                <DayDetailsPage v-if="activeName == 'dayDetail'"></DayDetailsPage>
            </el-tab-pane>
            <el-tab-pane label="日汇总" name="daySummary">
                <DaySummaryPage v-if="activeName == 'daySummary'"></DaySummaryPage>
            </el-tab-pane>
            <el-tab-pane label="月汇总" name="monthSummary">
                <MonthSummaryPage v-if="activeName == 'monthSummary'"></MonthSummaryPage>
            </el-tab-pane>
            <el-tab-pane label="年度报表" name="annualReport">
                <AnnualReportPage v-if="activeName == 'annualReport'"></AnnualReportPage>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import DayDetailsPage from './DayDetailsPage.vue'
    import DaySummaryPage from './DaySummaryPage.vue'
    import MonthSummaryPage from './MonthSummaryPage.vue'
    import AnnualReportPage from './AnnualReportPage.vue'

    import {mapGetters} from "vuex";

    export default {
        components: {
            DayDetailsPage,
            DaySummaryPage,
            MonthSummaryPage,
            AnnualReportPage
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'dayDetail',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.tqe_work_report.activeShow || 'dayDetail';
        },
        watch: {
            activeName(val) {
                this.$store.state.tqe_work_report.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>