<!--B2C订单执行率-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="日统计" name="day">
                <OrderRateDayCount v-if="activeName == 'day'"></OrderRateDayCount>
            </el-tab-pane>
            <el-tab-pane label="周统计" name="week">
                <OrderRateWeekCount v-if="activeName == 'week'"></OrderRateWeekCount>
            </el-tab-pane>
            <el-tab-pane label="月统计" name="month">
                <OrderRateMonthCount v-if="activeName == 'month'"></OrderRateMonthCount>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import OrderRateDayCount from './OrderRateDayCount'
    import OrderRateWeekCount from './OrderRateWeekCount'
    import OrderRateMonthCount from './OrderRateMonthCount'

    import {mapGetters} from "vuex";

    export default {
        components: {
            OrderRateDayCount,
            OrderRateWeekCount,
            OrderRateMonthCount
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'day',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.b2c_order_rate.activeShow || 'day';
        },
        watch: {
            activeName(val) {
                this.$store.state.b2c_order_rate.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>