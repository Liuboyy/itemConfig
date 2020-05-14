
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="用户配置" name="user">
                <UserConfigPage v-if="activeName == 'user'"></UserConfigPage>
            </el-tab-pane>
            <el-tab-pane label="角色配置" name="role">
                <RoleConfigPage v-if="activeName == 'role'"></RoleConfigPage>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import UserConfigPage from './UserConfigPage'
    import RoleConfigPage from './RoleConfigPage'

    import {mapGetters} from "vuex";

    export default {
        components: {
            UserConfigPage,
            RoleConfigPage,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'user',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.product_permit_config.activeShow || 'user';
        },
        watch: {
            activeName(val) {
                this.$store.state.product_permit_config.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>