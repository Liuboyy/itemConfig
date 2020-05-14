<!--B2C订单耗时-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="日统计" name="day">
                <OrderDayCountPage v-if="activeName == 'day'"></OrderDayCountPage>
            </el-tab-pane>
            <el-tab-pane label="周统计" name="week">
                <OrderWeekCountPage v-if="activeName == 'week'"></OrderWeekCountPage>
            </el-tab-pane>
            <el-tab-pane label="月统计" name="month">
                <OrderMonthCountPage v-if="activeName == 'month'"></OrderMonthCountPage>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import OrderDayCountPage from './OrderDayCountPage'
    import OrderWeekCountPage from './OrderWeekCountPage'
    import OrderMonthCountPage from './OrderMonthCountPage'

    import {mapGetters} from "vuex";

    export default {
        components: {
            OrderDayCountPage,
            OrderWeekCountPage,
            OrderMonthCountPage
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'day',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.order_execution_aging.activeShow || 'day';
        },
        watch: {
            activeName(val) {
                this.$store.state.order_execution_aging.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>