<template>
  <template v-if="column.type === 'expand'">
    <span v-if="!column.renderHeader">{{ column.title || '' }}</span>
    <RenderHeader v-else :render="column.renderHeader" :column="column" :index="index" />
  </template>
  <template v-else-if="column.type === 'selection'">
    <Checkbox disabled label="" />
  </template>
  <template v-else>
    <span v-if="!column.renderHeader">{{ column.title || '#' }}</span>
    <RenderHeader v-else :render="column.renderHeader" :column="column" :index="index" />
  </template>
</template>

<script setup>
import RenderHeader from 'view-ui-plus/src/components/table/header'

const props = defineProps({
  column: { type: Object, default: () => ({}) },
  index: { type: Number, default: 0 }
})
</script>
