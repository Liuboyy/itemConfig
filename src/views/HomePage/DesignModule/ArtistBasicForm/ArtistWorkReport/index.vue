<!--美工工作报表-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="小组汇总" name="summary">
                <ArtistGroupSummaryReport v-if="activeName == 'summary'"></ArtistGroupSummaryReport>
            </el-tab-pane>
            <el-tab-pane label="小组详情" name="details">
                <ArtistGroupDetailReport v-if="activeName == 'details'"></ArtistGroupDetailReport>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import ArtistGroupDetailReport from './ArtistGroupDetailReport'
    import ArtistGroupSummaryReport from './ArtistGroupSummaryReport'

    import {mapGetters} from "vuex";

    export default {
        components: {
            ArtistGroupDetailReport,
            ArtistGroupSummaryReport,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'summary',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.artist_work_report.activeShow || 'summary';
        },
        watch: {
            activeName(val) {
                this.$store.state.artist_work_report.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>