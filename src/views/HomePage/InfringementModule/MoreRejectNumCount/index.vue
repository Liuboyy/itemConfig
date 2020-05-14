
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="驳回汇总" name="summary">
                <MoreRejectSummary v-if="activeName === 'summary'"></MoreRejectSummary>
            </el-tab-pane>
            <el-tab-pane label="驳回详情" name="details">
                <MoreRejectDetails v-if="activeName === 'details'"></MoreRejectDetails>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import MoreRejectSummary from './MoreRejectSummary'
    import MoreRejectDetails from './MoreRejectDetails'

    import {mapGetters} from "vuex";

    export default {
        components: {
            MoreRejectSummary,
            MoreRejectDetails,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'summary',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.more_reject_num_count.activeShow || 'summary';
        },
        watch: {
            activeName(val) {
                this.$store.state.more_reject_num_count.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>