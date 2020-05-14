<!--开发平均耗时统计-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="开发小组" name="group">
                <DeveloperGroupTimeStatistics v-if="activeName == 'group'"></DeveloperGroupTimeStatistics>
            </el-tab-pane>
            <el-tab-pane label="产品线" name="product">
                <DeveloperProductLineStatistics v-if="activeName == 'product'"></DeveloperProductLineStatistics>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import DeveloperGroupTimeStatistics from './DeveloperGroupTimeStatistics'
    import DeveloperProductLineStatistics from './DeveloperProductLineStatistics'

    import {mapGetters} from "vuex";

    export default {
        components: {
            DeveloperGroupTimeStatistics,
            DeveloperProductLineStatistics,

        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'group',
            }
        },

        methods: {

        },
        created () {
            this.activeName = this.$store.state.developer_time_statistics.activeShow || 'group';
        },


        watch: {
            activeName(val) {
                this.$store.state.developer_time_statistics.activeShow = val;
            }
        },
    }

</script>
<style scoped lang="less">


</style>