
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="国内仓SKU" name="domestic">
                <DomesticSkuReport v-if="activeName === 'domestic'"></DomesticSkuReport>
            </el-tab-pane>
            <el-tab-pane label="核心国内仓SKU" name="core_domestic">
                <DomesticCoreSkuReport v-if="activeName === 'core_domestic'"></DomesticCoreSkuReport>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import DomesticSkuReport from './DomesticSkuReport'
    import DomesticCoreSkuReport from './DomesticCoreSkuReport'

    import {mapGetters} from "vuex";

    export default {
        components: {
            DomesticSkuReport,
            DomesticCoreSkuReport,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'domestic',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.domestic_sku_count.activeShow || 'domestic';
        },
        watch: {
            activeName(val) {
                this.$store.state.domestic_sku_count.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>