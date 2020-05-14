<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    body {
        margin: 0;
        padding: 0;
    }

    .el-table th.gutter,
    .el-table colgroup.gutter{
        display: table-cell!important;
    }

    #app {
        font-family: '微软雅黑';
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        height: 100%;
    }
</style>
