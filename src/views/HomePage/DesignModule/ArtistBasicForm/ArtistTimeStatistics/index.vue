<!--美工平均耗时统计-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="美工小组" name="group">
                <ArtistGroupStatistics v-if="activeName == 'group'"></ArtistGroupStatistics>
            </el-tab-pane>
            <el-tab-pane label="产品线" name="productLine">
                <ArtistProductLineStatistics v-if="activeName == 'productLine'"></ArtistProductLineStatistics>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import ArtistGroupStatistics from './ArtistGroupStatistics'
    import ArtistProductLineStatistics from './ArtistProductLineStatistics'

    import {mapGetters} from "vuex";

    export default {
        components: {
            ArtistGroupStatistics,
            ArtistProductLineStatistics,

        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'group',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.artist_time_statistics.activeShow || 'group';
        },
        watch: {
            activeName(val) {
                this.$store.state.artist_time_statistics.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>