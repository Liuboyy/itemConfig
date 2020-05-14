<!--摄影平均耗时统计-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="摄影小组" name="group">
                <PhotoGroupTimeStatistics v-if="activeName == 'group'"></PhotoGroupTimeStatistics>
            </el-tab-pane>
            <el-tab-pane label="任务类型" name="type">
                <PhotoTaskTypeStatistics v-if="activeName == 'type'"></PhotoTaskTypeStatistics>
            </el-tab-pane>
            <el-tab-pane label="产品线" name="productLine">
                <PhotoProductLineStatistics v-if="activeName == 'productLine'"></PhotoProductLineStatistics>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import PhotoGroupTimeStatistics from './PhotoGroupTimeStatistics'
    import PhotoTaskTypeStatistics from './PhotoTaskTypeStatistics'
    import PhotoProductLineStatistics from './PhotoProductLineStatistics'

    import {mapGetters} from "vuex";

    export default {
        components: {
            PhotoGroupTimeStatistics,
            PhotoTaskTypeStatistics,
            PhotoProductLineStatistics
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'group',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.photograph_time_statistics.activeShow || 'group';
        },
        watch: {
            activeName(val) {
                this.$store.state.photograph_time_statistics.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>