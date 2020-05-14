
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="用户配置" name="user">
                <PurchasingUserPage v-if="activeName === 'user'"></PurchasingUserPage>
            </el-tab-pane>
            <el-tab-pane label="小组配置" name="group">
                <PurchasingGroupPage v-if="activeName === 'group'"></PurchasingGroupPage>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import PurchasingUserPage from './PurchasingUserPage'
    import PurchasingGroupPage from './PurchasingGroupPage'

    import {mapGetters} from "vuex";

    export default {
        components: {
            PurchasingUserPage,
            PurchasingGroupPage,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'user',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.purchasing_group_config.activeShow || 'user';
        },
        watch: {
            activeName(val) {
                this.$store.state.purchasing_group_config.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>