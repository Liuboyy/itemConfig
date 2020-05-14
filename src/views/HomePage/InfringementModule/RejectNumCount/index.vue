
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="驳回汇总" name="summary">
                <RejectNumSummary v-if="activeName === 'summary'"></RejectNumSummary>
            </el-tab-pane>
            <el-tab-pane label="开发驳回详情" name="details">
                <RejectNumDetails v-if="activeName === 'details'"></RejectNumDetails>
            </el-tab-pane>
            <el-tab-pane label="产品线驳回开发详情" name="product_line">
                <ProductLineRejectDetails v-if="activeName === 'product_line'"></ProductLineRejectDetails>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import RejectNumSummary from './RejectNumSummary'
    import RejectNumDetails from './RejectNumDetails'
    import ProductLineRejectDetails from './ProductLineRejectDetails'

    import {mapGetters} from "vuex";

    export default {
        components: {
            RejectNumSummary,
            RejectNumDetails,
            ProductLineRejectDetails
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'summary',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.reject_num_count.activeShow || 'summary';
        },
        watch: {
            activeName(val) {
                this.$store.state.reject_num_count.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>