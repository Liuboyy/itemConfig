
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="海外仓SKU" name="oversea">
                <OverseasSkuWeekReport v-if="activeName === 'oversea'"></OverseasSkuWeekReport>
            </el-tab-pane>
            <el-tab-pane label="核心海外仓SKU" name="core_oversea">
                <OverseasCoreSkuWeekReport v-if="activeName === 'core_oversea'"></OverseasCoreSkuWeekReport>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import OverseasSkuWeekReport from './OverseasSkuWeekReport'
    import OverseasCoreSkuWeekReport from './OverseasCoreSkuWeekReport'

    import {mapGetters} from "vuex";

    export default {
        components: {
            OverseasSkuWeekReport,
            OverseasCoreSkuWeekReport,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'oversea',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.oversea_sku_week_count.activeShow || 'oversea';
        },
        watch: {
            activeName(val) {
                this.$store.state.oversea_sku_week_count.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>