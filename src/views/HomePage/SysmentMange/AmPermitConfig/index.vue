
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="用户配置" name="user">
                <AmUserConfigPage v-if="activeName === 'user'"></AmUserConfigPage>
            </el-tab-pane>
            <el-tab-pane label="角色配置" name="role">
                <AmRoleConfigPage v-if="activeName === 'role'"></AmRoleConfigPage>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import AmUserConfigPage from './AmUserConfigPage'
    import AmRoleConfigPage from './AmRoleConfigPage'

    import {mapGetters} from "vuex";

    export default {
        components: {
            AmUserConfigPage,
            AmRoleConfigPage,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'user',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.am_permit_config.activeShow || 'user';
        },
        watch: {
            activeName(val) {
                this.$store.state.am_permit_config.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>