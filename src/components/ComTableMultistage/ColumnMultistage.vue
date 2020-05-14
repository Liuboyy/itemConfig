<template>
    <el-table-column :prop="col.prop" :label="col.label" align="left">
        <template v-if="col.children">
            <ColumnMultistage
                    v-for="(item, index) in col.children"
                    :key="index"
                    :col="item">
                <slot></slot>
            </ColumnMultistage>
        </template>
    </el-table-column>
</template>

<script>
    export default {
        name: 'ColumnMultistage',
        props: {
            col: {
                type: Object
            }
        }
    }
</script>
<style scoped>
</style>