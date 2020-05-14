<!--跟单平均时效统计-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="开发小组" name="group">
                <OrderGroupTimeStatistics v-if="activeName == 'group'"></OrderGroupTimeStatistics>
            </el-tab-pane>
            <el-tab-pane label="产品线" name="product">
                <OrderProductLineStatistics v-if="activeName == 'product'"></OrderProductLineStatistics>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import OrderGroupTimeStatistics from './OrderGroupTimeStatistics'
    import OrderProductLineStatistics from './OrderProductLineStatistics'

    import {mapGetters} from "vuex";

    export default {
        components: {
            OrderGroupTimeStatistics,
            OrderProductLineStatistics,

        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'group',
            }
        },

        methods: {

        },
        created () {
            this.activeName = this.$store.state.order_time_statistics.activeShow || 'group';
        },


        watch: {
            activeName(val) {
                this.$store.state.order_time_statistics.activeShow = val;
            }
        },
    }

</script>
<style scoped lang="less">


</style>