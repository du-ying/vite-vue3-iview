<template>
  <Drawer v-model="visible" :width="320" :styles="{ padding: 0 }">
    <template #header>
      <Checkbox class="me-2 app-table-drawer__header"
                @click.prevent="handleCheckAll"
                :indeterminate="indeterminate"
                :model-value="checkAll">
        <span class="fs-6">列设置</span>
      </Checkbox>
    </template>
    <div class="app-table-drawer__body overflow-auto p-3">
      <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
        <Divider size="small" v-show="left.length > 0">固定在左侧</Divider>
        <div class="d-flex py-2 px-3 app-table-drawer__cell" v-for="(item, index) in left" :key="index">
          <div class="w-100">
            <Checkbox :label="item.__id">{{ item.title }}</Checkbox>
          </div>
          <div class="flex-shrink-1 text-nowrap">
            <Tooltip placement="top" content="不固定">
              <Button icon="md-pause" size="small" ghost class="border-0"
                      @click="updatePosition(item, index, 'left', 'center')" />
            </Tooltip>
            <Tooltip placement="top" content="右固定">
              <Button icon="md-skip-forward" size="small" ghost class="border-0"
                      @click="updatePosition(item, index, 'left', 'right')" />
            </Tooltip>
          </div>
        </div>
        <Divider size="small" v-show="left.length > 0 || right.length > 0">不固定</Divider>
        <Draggable group="center" item-key="__id" v-model="center">
          <template #item="{ element, index }">
            <div class="d-flex py-2 px-3 app-table-drawer__cell">
              <div class="w-100">
                <Checkbox :label="element.__id">{{ element.title }}</Checkbox>
              </div>
              <div class="flex-shrink-1 text-nowrap">
                <Tooltip placement="top" content="左固定">
                  <Button icon="md-skip-backward" size="small" ghost class="border-0"
                          @click="updatePosition(element, index, 'center', 'left')" />
                </Tooltip>
                <Tooltip placement="top" content="右固定">
                  <Button icon="md-skip-forward" size="small" ghost class="border-0"
                          @click="updatePosition(element, index, 'center', 'right')" />
                </Tooltip>
              </div>
            </div>
          </template>
        </Draggable>
<!--        <div class="d-flex py-2 px-3 app-table-drawer__cell" v-for="(item, index) in center" :key="index">
          <div class="w-100">
            <Checkbox :label="JSON.stringify(item)">{{ item.title }}</Checkbox>
          </div>
          <div class="flex-shrink-1 text-nowrap">
            <Tooltip placement="top" content="左固定">
              <Button icon="md-skip-backward" size="small" ghost class="border-0"
                      @click="updatePosition(item, index, 'center', 'left')" />
            </Tooltip>
            <Tooltip placement="top" content="右固定">
              <Button icon="md-skip-forward" size="small" ghost class="border-0"
                      @click="updatePosition(item, index, 'center', 'right')" />
            </Tooltip>
          </div>
        </div>-->
        <Divider size="small" v-show="right.length > 0">固定在右侧</Divider>
        <div class="d-flex py-2 px-3 app-table-drawer__cell" v-for="(item, index) in right" :key="index">
          <div class="w-100">
            <Checkbox :label="item.__id">{{ item.title }}</Checkbox>
          </div>
          <div class="flex-shrink-1 text-nowrap">
            <Tooltip placement="top" content="左固定">
              <Button icon="md-skip-backward" size="small" ghost class="border-0"
                      @click="updatePosition(item, index, 'right', 'left')" />
            </Tooltip>
            <Tooltip placement="top" content="不固定">
              <Button icon="md-pause" size="small" ghost class="border-0"
                      @click="updatePosition(item, index, 'right', 'center')" />
            </Tooltip>
          </div>
        </div>
      </CheckboxGroup>
    </div>
    <div class="position-absolute border-top bottom-0 start-0 end-0 text-end app-table-drawer__footer">
      <Button type="default" @click="parseColumnsToInit(columns)">重置</Button>
      <Button type="primary" class="ms-3">确定</Button>
    </div>
  </Drawer>
</template>

<script>
import Draggable from 'vuedraggable'
import { useTableSearchUtil } from './useTableSearch.js'

export default {
  components: { Draggable },
  props: {
    columns: { type: Array, default: () => [] }
  },
  setup () {
    const { getRandomStr } = useTableSearchUtil()
    return {
      getRandomStr
    }
  },
  data: () => ({
    left: [],
    center: [],
    right: [],
    checkAllGroup: [],
    indeterminate: true,
    checkAll: false,
    visible: false,
  }),
  methods: {
    parseColumnsToInit (columns) {
      this.left.splice(0)
      this.center.splice(0)
      this.right.splice(0)
      this.checkAllGroup.splice(0)
      this.indeterminate = false
      this.checkAll = true
      columns.forEach(column => {
        const id = this.getRandomStr(6)
        column.__id = id
        if (column.fixed === 'left') {
          this.left.push(column)
        } else if (column.fixed === 'right') {
          this.right.push(column)
        } else {
          this.center.push(column)
        }
        this.checkAllGroup.push(id)
      })
    },
    updatePosition (column, index, fromPosition, toPosition) {
      this[fromPosition].splice(index, 1)
      this[toPosition].push(column)
    },
    handleCheckAll () {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false

      if (this.checkAll) {
        this.checkAllGroup = this.left.concat(this.center, this.right).map(column => column.__id)
      } else {
        this.checkAllGroup = []
      }
    },
    checkAllGroupChange (data) {
      if (data.length === this.columns.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
  },
  watch: {
    columns (currentColumns) {
      this.parseColumnsToInit(currentColumns)
    },
    visible (currentVisible) {
      if (currentVisible) this.parseColumnsToInit(this.columns)
    }
  }
}
</script>

<style lang="less">
.app-table-drawer {
  &__header {
    .ivu-checkbox-label-text {
      padding-left: 8px;
    }
  }
  &__body {
    height: calc(100% - 53px);
  }
  &__cell {
    color: #515a6e;
    cursor: move;
    transition: background .2s ease-in-out;
    &:hover {
      background: #f3f3f3;
      .ivu-btn-icon-only {
        color: inherit;
      }
    }
    .ivu-btn-icon-only:hover {
      color: #57a3f3 !important;
      background-color: white;
    }
    .ivu-btn:focus {
      box-shadow: none;
    }
    .ivu-checkbox-label-text {
      padding-left: 8px;
    }
  }
  &__footer {
    padding: 10px 16px;
  }
}
</style>
