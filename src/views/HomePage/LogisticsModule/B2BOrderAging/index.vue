<!--B2B订单时效-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="日统计" name="day">
                <B2BDayCountPage v-if="activeName == 'day'"></B2BDayCountPage>
            </el-tab-pane>
            <el-tab-pane label="周统计" name="week">
                <B2BWeekCountPage v-if="activeName == 'week'"></B2BWeekCountPage>
            </el-tab-pane>
            <el-tab-pane label="月统计" name="month">
                <B2BMonthCountPage v-if="activeName == 'month'"></B2BMonthCountPage>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import B2BDayCountPage from './B2BDayCountPage'
    import B2BWeekCountPage from './B2BWeekCountPage'
    import B2BMonthCountPage from './B2BMonthCountPage'

    import {mapGetters} from "vuex";

    export default {
        components: {
            B2BDayCountPage,
            B2BWeekCountPage,
            B2BMonthCountPage
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'day',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.b2b_order_aging.activeShow || 'day';
        },
        watch: {
            activeName(val) {
                this.$store.state.b2b_order_aging.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>