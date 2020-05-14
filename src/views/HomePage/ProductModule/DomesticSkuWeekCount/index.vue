
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="国内仓SKU" name="domestic">
                <DomesticSkuWeekReport v-if="activeName === 'domestic'"></DomesticSkuWeekReport>
            </el-tab-pane>
            <el-tab-pane label="核心国内仓SKU" name="core_domestic">
                <DomesticCoreSkuWeekReport v-if="activeName === 'core_domestic'"></DomesticCoreSkuWeekReport>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import DomesticSkuWeekReport from './DomesticSkuWeekReport'
    import DomesticCoreSkuWeekReport from './DomesticCoreSkuWeekReport'

    import {mapGetters} from "vuex";

    export default {
        components: {
            DomesticSkuWeekReport,
            DomesticCoreSkuWeekReport,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'domestic',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.domestic_sku_week_count.activeShow || 'domestic';
        },
        watch: {
            activeName(val) {
                this.$store.state.domestic_sku_week_count.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>