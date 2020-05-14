<template>
    <div class="ui-multiple_tab">
        <ul class="clearFix">
            <li class="ui-multiple_tab-item" v-for="(item,i) in tabLabel" :key=i>
                <span @click="handleToggleRouter(item)"
                      :class="item.index === navIndex && 'ui-link'">{{item.name}}</span>
                <i class="el-icon-close" @click="handleRemoveLabel(item.path)"></i>
            </li>
        </ul>
        <div class="ui-close_other" @click="handleCloseOtherLabel">
            <span class="ui-line"></span>关闭其他页
        </div>
    </div>
</template>

<script>
    import {
        mapGetters
    } from 'vuex';
    import routerConfig from '@/router/routerConfig';
    import state from '@/store/state';

    export default {
        name: 'MultipleTab',
        computed: {
            ...mapGetters(['tabLabel', 'navIndex'])
        },
        created () {
            // console.log(this.tabLabel);
            this.$store.commit('SAVE_MULTIPLE_OBJ', this);
        },
        methods: {

            // 切换路由
            handleToggleRouter (route) {

                this.$store.commit('SAVE_NAV_INDEX', route.index);
                this.$router.push(route.path);
                // this.$router.push(`${route.path}?jumpType=tag`);
            },

            // 移除页签
            handleRemoveLabel (path) {
                if (this.tabLabel.length === 1) return;

                for (let i = 0; i < this.tabLabel.length; i++) {
                    if (this.tabLabel[i].path === path) {
                        if (this.tabLabel[i].index === this.navIndex) {
                            if (i > 0) {
                                this.$router.push(this.tabLabel[i - 1].path);
                                this.$store.commit('SAVE_NAV_INDEX', this.tabLabel[i - 1].index);
                            } else {
                                this.$router.push(this.tabLabel[i + 1].path);
                                this.$store.commit('SAVE_NAV_INDEX', this.tabLabel[i + 1].index);
                            }
                        }
                        this.$store.commit('SAVE_TAB_LABELS', {
                            path: path,
                            isRemove: 1,
                            isRemoveInx: i
                        });
                        break;
                    }
                }

            },

            // 移除其他标签
            handleCloseOtherLabel () {
                this.$store.commit('SAVE_TAB_LABELS', {
                    path: routerConfig.navJumpFn(this.navIndex).path,
                    name: routerConfig.navJumpFn(this.navIndex).name,
                    isRemove: 2
                });
            },
        }
    };
</script>

<style scoped lang="less">

    @import (reference) '../assets/less/index';

    @module-bdr_color: #e6e6e6;

    .ui-multiple_tab {
        height: 30px;
        border: 1px solid @base-bdr-color;
        border-bottom: 0 none;
        background: #ffffff;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;

        ul {
            background: #F9F9F9;
            border-bottom: 1px solid @module-bdr_color;
            height: 28px;
        }

        .ui-multiple_tab-item {
            float: left;
            margin-left: 10px;
            height: 30px;
            box-sizing: border-box;
            position: relative;

            span {
                display: inline-block;
                padding: 0 10px;
                line-height: 28px;
                font-size: 12px;
                color: #656565;
                cursor: pointer;
                border-radius: 4px 4px 0 0;
                border: 1px solid transparent;
                border-bottom-color: @module-bdr_color;
            }

            i {
                position: absolute;
                margin-left: 10px;
                margin-right: 0;
                cursor: pointer;
                right: -3px;
                top: 9px;
                display: none;
                font-size: 10px;
            }

            &:hover i {
                display: block;
            }

            span.ui-link {
                padding-right: 28px;
                background: #ffffff;
                border: 1px solid @module-bdr_color;
                border-bottom: 1px solid #ffffff
            }

            span.ui-link + i {
                display: block !important;
                right: 10px;
                top: 8px;
                width: 13px;
                height: 13px;
                border-radius: 50%;
                line-height: 13px;
                color: #fff;
            }
        }

        .ui-close_other {
            position: absolute;
            right: 25px;
            top: 5px;
            font-size: 10px;
            color: #9a9a9a;
            cursor: pointer;

            .ui-line {
                display: inline-block;
                height: 12px;
                width: 1px;
                background: #9a9a9a;
                position: relative;
                top: 2px;
                right: 5px;
            }
        }
    }
</style>
