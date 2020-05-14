<!--IT费用清单-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="服务器费用" name="server">
                <ServerCosts v-if="activeName == 'server'"></ServerCosts>
            </el-tab-pane>
            <el-tab-pane label="其他费用" name="other">
                <OtherCosts v-if="activeName == 'other'"></OtherCosts>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import ServerCosts from './ServerCosts'
    import OtherCosts from './OtherCosts'

    import {mapGetters} from "vuex";

    export default {
        components: {
            ServerCosts,
            OtherCosts,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'server',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.it_expense_list.activeShow || 'server';
        },
        watch: {
            activeName(val) {
                this.$store.state.it_expense_list.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>