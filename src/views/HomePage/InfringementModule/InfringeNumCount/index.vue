
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="小组汇总" name="summary">
                <InfringeGroupSummary v-if="activeName === 'summary'"></InfringeGroupSummary>
            </el-tab-pane>
            <el-tab-pane label="小组详情" name="details">
                <InfringeGroupDetails v-if="activeName === 'details'"></InfringeGroupDetails>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import InfringeGroupSummary from './InfringeGroupSummary'
    import InfringeGroupDetails from './InfringeGroupDetails'

    import {mapGetters} from "vuex";

    export default {
        components: {
            InfringeGroupSummary,
            InfringeGroupDetails,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'summary',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.infringe_num_count.activeShow || 'summary';
        },
        watch: {
            activeName(val) {
                this.$store.state.infringe_num_count.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>