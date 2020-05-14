
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="海外仓SKU" name="oversea">
                <OverseasSkuReport v-if="activeName === 'oversea'"></OverseasSkuReport>
            </el-tab-pane>
            <el-tab-pane label="核心海外仓SKU" name="core_oversea">
                <OverseasCoreSkuReport v-if="activeName === 'core_oversea'"></OverseasCoreSkuReport>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import OverseasSkuReport from './OverseasSkuReport'
    import OverseasCoreSkuReport from './OverseasCoreSkuReport'

    import {mapGetters} from "vuex";

    export default {
        components: {
            OverseasSkuReport,
            OverseasCoreSkuReport,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'oversea',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.oversea_sku_count.activeShow || 'oversea';
        },
        watch: {
            activeName(val) {
                this.$store.state.oversea_sku_count.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>