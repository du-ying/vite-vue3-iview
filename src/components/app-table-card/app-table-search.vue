<template>
  <Col :xs="24" :sm="24" :md="12" :lg="position" v-show="expand && !invisible">
    <FormItem :prop="prop" :label="label" :label-width="labelWidth" :label-for="labelFor">
      <slot></slot>
    </FormItem>
  </Col>
</template>

<script setup>
import { defineProps, onUnmounted, watch } from 'vue'
import { useTableSearchItem } from './useTableSearch.js'

const props = defineProps({
  prop: String,
  label: String,
  labelWidth: Number,
  labelFor: String,
  required: Boolean,
  rules: [Object, Array],
  invisible: { type: Boolean, default: false }
})
const {
  id,
  expand,
  position,
  updateSearchItemInvisible
} = useTableSearchItem()

const unwatch = watch(
    () => props.invisible,
    (currentInvisible) => updateSearchItemInvisible(id, currentInvisible)
)

onUnmounted(() => {
  unwatch()
})

</script>
