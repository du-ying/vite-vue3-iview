<template>
  <Drawer v-model="visible">
    <template #header>
      <Checkbox class="me-2"
                @click.prevent="handleCheckAll"
                :indeterminate="indeterminate"
                :model-value="checkAll" />
      <span class="fs-6">列设置</span>
    </template>
  </Drawer>
</template>

<script setup>
import { reactive, ref } from 'vue'

const visible = ref(false)
const indeterminate = ref(false)
const checkAll = ref(true)
const checkAllGroup = reactive([])

function handleCheckAll () {
  if (indeterminate.value) {
    checkAll.value = false
  } else {
    checkAll.value = !checkAll.value
  }
  indeterminate.value = false
  if (checkAll.value) {
    // todo 全选
    // checkAllGroup = 全部选项
  } else {
    const len = checkAllGroup.length
    checkAllGroup.splice(0, len)
  }
}

function checkAllGroupChange (data) {}

defineExpose({
  visible
})
</script>
