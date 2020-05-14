<!--TQE工作报表-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="日统计" name="dayCount">
                <DailyCountPage v-if="activeName == 'dayCount'"></DailyCountPage>
            </el-tab-pane>
            <el-tab-pane label="周统计" name="weekCount">
                <WeeklyCountPage v-if="activeName == 'weekCount'"></WeeklyCountPage>
            </el-tab-pane>
            <el-tab-pane label="月统计" name="monthCount">
                <MonthlyCountPage v-if="activeName == 'monthCount'"></MonthlyCountPage>
            </el-tab-pane>
            <el-tab-pane label="季度统计" name="quarterCount">
                <QuarterlyCountPage v-if="activeName == 'quarterCount'"></QuarterlyCountPage>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import DailyCountPage from './DailyCountPage.vue'
    import WeeklyCountPage from './WeeklyCountPage.vue'
    import MonthlyCountPage from './MonthlyCountPage.vue'
    import QuarterlyCountPage from './QuarterlyCountPage.vue'

    import {mapGetters} from "vuex";

    export default {
        components: {
            DailyCountPage,
            WeeklyCountPage,
            MonthlyCountPage,
            QuarterlyCountPage
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'dayCount',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.product_line_trend.activeShow || 'dayCount';
        },
        watch: {
            activeName(val) {
                this.$store.state.product_line_trend.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>