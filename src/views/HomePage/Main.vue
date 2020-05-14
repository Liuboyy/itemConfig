<template>
    <section class="s-main">
        <MultipleTab></MultipleTab>
        <!--<transition name='fade' mode='out-in'>-->
        <!---->
        <!--<router-view :key="key"></router-view>-->
        <!--</transition>-->
        <keep-alive :include="keepAlive">
            <router-view></router-view>
        </keep-alive>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        name: "Main",
        data() {
            return {
                isInit: false
            }
        },
        computed: {
            ...mapGetters(['tabLabel']),
            key() {
                return this.$route.path !== undefined ? this.$route.path.replace('/', '') : this.$route;
            },
            keepAlive() {
                return this.tabLabel.map(item => item.path.replace('/', ''));
            }
        }
    }
</script>

<style scoped>

</style>