import { computed, reactive, ref, watch, onUnmounted, onMounted, inject, provide, toRaw } from 'vue'
import _ from 'lodash'
import qs from 'qs'

const addSearchItemSymbol = Symbol()
const updateSearchItemInvisibleSymbol = Symbol()

export function useTableSearchItem () {
  const expand = ref(true)
  const position = reactive({ span: 8, pull: 0 })
  const id = Date.now()
  const invisible = ref(false)

  const addSearchItem = inject(addSearchItemSymbol)
  const updateSearchItemInvisible = inject(updateSearchItemInvisibleSymbol)

  onMounted(() => {
    addSearchItem(id, expand, position, invisible)
  })

  return {
    id,
    expand,
    position,
    updateSearchItemInvisible
  }
}

export function useTableSearchGroup () {
  const group = reactive([])
  const expand = ref(true)
  const noSearch = ref(false)
  const noExpand = ref(false)

  const expandBtn = computed(() => {
    return expand.value
      ? { text: '收起', icon: 'bi bi-chevron-up' }
      : { text: '展开', icon: 'bi bi-chevron-down' }
  })

  const unwatch = watch([group, expand], ([currentGroup, currentExpand]) => {
    noSearch.value = currentGroup.length === 0
    noExpand.value = currentGroup.length <= 2
    const groupByVisible = _.filter(toRaw(currentGroup), item => !item.invisible.value)
    const len = groupByVisible.length
    groupByVisible.forEach((item, index) => {
      if (len === 1) {
        item.position.pull = 8
      } else {
        item.position.pull = index > 0 && ((index + 1) % 3 === 1) ? 8 : 0
      }
      item.expand.value = index >= 2 ? currentExpand : true
    })
  })

  onUnmounted(() => {
    unwatch()
  })

  function toggleExpand () {
    expand.value = !expand.value
  }

  function addSearchItem (id, expand, position, invisible) {
    group.push({ id, expand, position, invisible })
  }

  function updateSearchItemInvisible (id, invisible) {
    const index = _.findIndex(group, ['id', id])
    if (index > -1) group[index].invisible = invisible
  }

  provide(addSearchItemSymbol, addSearchItem)
  provide(updateSearchItemInvisibleSymbol, updateSearchItemInvisible)

  return {
    toggleExpand,
    noSearch,
    noExpand,
    expandBtn
  }
}

export function useTableSearchUtil () {
  function transValue (value) {
    return _.isDate(value) ? String(value.getTime()) : String(value)
  }

  function parseToPlainInfo (...sources) {
    const data = {}
    sources.forEach(item => _.assign(data, item))
    const obj = {}
    _.forEach(data, (value, key) => {
      obj[key] = _.isArray(value)
        ? _.map(value, v => transValue(v)).join()
        : transValue(value)
    })
    const str = qs.stringify(obj, { arrayFormat: 'comma' })
    return { obj, str }
  }

  function getRandomStr (len = 32) {
    const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    const maxPos = $chars.length
    let str = ''
    for (let i = 0; i < len; i++) {
      str += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return str
  }

  function cloneColumns (columns) {
    return _.clone(_.map(toRaw(columns), column => _.clone(toRaw(column))))
  }

  function transformColumns (columns, fixed) {
    return _.map(cloneColumns(columns), column => {
      column.fixed = fixed
      return column
    })
  }

  function getRebuildColumns (checkAllGroup, left, center, right) {
    const allColumns = _.concat(
      transformColumns(left, 'left'),
      transformColumns(center, undefined),
      transformColumns(right, 'right')
    )
    return _.map(
      _.intersectionBy(
        allColumns,
        _.map(checkAllGroup, item => ({ __id: item })),
        '__id'
      ),
      item => {
        delete item.__id
        delete item.__index
        delete item.__fixed
        return item
      }
    )
  }

  function transformInitColumns (left, center, right) {
    const columns = _.orderBy(_.concat(left, center, right), ['__index'], ['asc'])
    const checkAll = _.map(columns, '__id')
    const { left: leftColumns, center: centerColumns, right: rightColumns } = _.groupBy(columns, '__fixed')
    return [leftColumns, centerColumns, rightColumns, checkAll]
  }

  return {
    parseToPlainInfo,
    getRandomStr,
    getRebuildColumns,
    transformInitColumns
  }
}

export function useTableResize () {}
