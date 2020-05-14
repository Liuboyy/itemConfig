<!--文案平均耗时统计-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="文案小组" name="group">
                <CopyGroupStatistics v-if="activeName == 'group'"></CopyGroupStatistics>
            </el-tab-pane>
            <el-tab-pane label="产品线" name="productLine">
                <CopyProductLineStatistics v-if="activeName == 'productLine'"></CopyProductLineStatistics>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import CopyGroupStatistics from './CopyGroupStatistics'
    import CopyProductLineStatistics from './CopyProductLineStatistics'
    import CopyGroupChart from './CopyGroupChart'

    import {mapGetters} from "vuex";

    export default {
        components: {
            CopyGroupStatistics,
            CopyProductLineStatistics,
            CopyGroupChart

        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'group',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.copy_time_statistics.activeShow || 'group';
        },
        watch: {
            activeName(val) {
                this.$store.state.copy_time_statistics.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>