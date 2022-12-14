<template>
  <Form class="mb-3" ref="tableCardForm" :label-width="100" label-colon
        v-show="!noSearch && visibleSearchBlock"
        :model="searchData">
    <Row ref="tableCardFormItems" :gutter="8" justify="end">
      <slot name="search"></slot>
      <Col :xs="24" :sm="24" :md="12" :lg="8">
        <FormItem :label-width="0" class="text-end">
          <Button type="primary" icon="ios-search" :loading="loading" @click="searchAction">查询</Button>
          <Button class="ms-2" type="default" custom-icon="bi bi-arrow-repeat" :loading="loading" @click="resetAction">重置</Button>
          <a class="ms-2" href="javascript:void(0)" v-show="!noExpand" @click="toggleExpand">
            <span> {{ expandBtn.text }} </span>
            <Icon class="ms-1" :type="expandBtn.icon" />
          </a>
        </FormItem>
      </Col>
    </Row>
  </Form>
  <Row ref="tableCardToolbar">
    <Col class="flex-fill app-table-card__extra">
      <slot name="extra"></slot>
    </Col>
    <Col class="d-flex text-end justify-content-end app-table-card__toolbar mb-3" v-if="!noToolbar">
      <div class="toolbar-item">
        <Tooltip content="刷新" placement="top">
          <Button class="border-0 ivu-btn-icon-only" custom-icon="bi bi-arrow-repeat"
                  @click="refreshAction"
                  :loading="loading" />
        </Tooltip>
      </div>
      <div class="toolbar-item" v-if="!noSearch">
        <Tooltip :content="toggleBtn.text" placement="top">
          <Button class="border-0 ivu-btn-icon-only" @click="visibleSearchBlock = !visibleSearchBlock">
            <Icon class="ms-0" :custom="toggleBtn.icon" />
          </Button>
        </Tooltip>
      </div>
      <div class="toolbar-item">
        <Dropdown @on-click="changeTableSize">
          <Tooltip content="密度" :placement="noDownload && noColumnsSetup ? 'top-end' : 'top'">
            <Button class="border-0 ivu-btn-icon-only">
              <Icon class="ms-0" custom="bi bi-type-h1" />
            </Button>
          </Tooltip>
          <template #list>
            <DropdownMenu class="text-center app-table-card__size">
              <DropdownItem name="default" :selected="size === 'default'">默认</DropdownItem>
              <DropdownItem name="large" :selected="size === 'large'">宽松</DropdownItem>
              <DropdownItem name="small" :selected="size === 'small'">紧凑</DropdownItem>
            </DropdownMenu>
          </template>
        </Dropdown>
      </div>
      <div class="toolbar-item" v-if="!noDownload">
        <Tooltip content="导出数据" :placement="!noColumnsSetup ? 'top' : 'top-end'">
          <Button class="border-0 ivu-btn-icon-only" @click="exportAction">
            <Icon class="ms-0" custom="bi bi-download" />
          </Button>
        </Tooltip>
      </div>
      <div class="toolbar-item" v-if="!noColumnsSetup">
        <Tooltip content="列设置" placement="top-end">
          <Button class="border-0 ivu-btn-icon-only" @click="setupColumns">
            <Icon class="ms-0" custom="bi bi-sliders2" />
          </Button>
        </Tooltip>
      </div>
    </Col>
  </Row>
  <slot name="default" :size="size" :rebuild-columns="rebuildColumns" :max-height="maxHeight"></slot>
  <Page class-name="mt-3 text-center" ref="tableCardPage" show-total show-elevator show-sizer
        @on-change="changePage"
        @on-page-size-change="changePageSize"
        v-if="!noPage"
        v-model="page"
        :total="total"
        :page-size="pageSize"
        :page-size-opts="pageSizeOpts" />
  <AppTableDrawer ref="tableCardDrawer"
                  @rebuild-columns="rebuildColumnsHandler"
                  :columns="columnsData" />
</template>

<script>
import { useTableSearchUtil, useTableSearchGroup } from './useTableSearch.js'
import AppTableDrawer from './app-table-drawer.vue'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { ref } from 'vue'

export default {
  inheritAttrs: false,
  props: {
    noToolbar: { type: Boolean, default: false },
    noPage: { type: Boolean, default: false },
    noDownload: { type: Boolean, default: false },
    noRouter: { type: Boolean, default: false },
    searchData: { type: Object, default: () => ({}) },
    total: { type: Number, default: 0 },
    loading: { type: Boolean, default: false },
    pageSizeOpts: { type: Array, default: () => [10, 20, 30, 40] },
    columnsData: { type: Array, default: () => [] },
    navigation: { type: String, default: 'replace' },
    resizeable: { type: Boolean, default: false }
  },
  emits: ['export-event', 'load-event'],
  setup (props) {
    const {
      toggleExpand,
      noSearch,
      noExpand,
      expandBtn
    } = useTableSearchGroup()
    const {
      parseToPlainInfo
    } = useTableSearchUtil()
    const tableCardForm = ref(null)
    const tableCardToolbar = ref(null)
    const tableCardPage = ref(null)
    const tableCardDrawer = ref(null)
    const { height: formHeight } = props.resizeable ? useElementSize(tableCardForm) : { height: ref(0) }
    const { height: toolbarHeight } = props.resizeable ? useElementSize(tableCardToolbar) : { height: ref(0) }
    const { height: pageHeight } = props.resizeable ? useElementSize(tableCardPage) : { height: ref(0) }
    const { height: windowHeight } = props.resizeable ? useWindowSize() : { height: ref(0) }
    return {
      toggleExpand,
      noSearch,
      noExpand,
      expandBtn,
      parseToPlainInfo,
      tableCardForm,
      tableCardToolbar,
      tableCardPage,
      tableCardDrawer,
      formHeight,
      toolbarHeight,
      pageHeight,
      windowHeight
    }
  },
  components: {
    AppTableDrawer
  },
  data: () => ({
    page: 1,
    pageSize: 10,
    visibleSearchBlock: true,
    size: 'default',
    rebuildColumns: []
  }),
  computed: {
    toggleBtn () {
      return this.visibleSearchBlock
          ? { text: '收起查询', icon: 'bi bi-chevron-bar-contract' }
          : { text: '展开查询', icon: 'bi bi-chevron-bar-expand' }
    },
    noColumnsSetup () {
      return this.columnsData.length === 0
    },
    maxHeight () {
      if (this.resizeable) {
        const formHeight = this.formHeight === 0 ? 0 : this.formHeight + 16
        const pageHeight = this.pageHeight === 0 ? 0 : this.pageHeight + 16
        const max = this.windowHeight - formHeight - this.toolbarHeight - pageHeight
        return max < 500 ? 500 : Math.floor(max)
      } else {
        return 500
      }
    }
  },
  methods: {
    rebuildColumnsHandler (columns) {
      this.rebuildColumns = columns
    },
    setupColumns () {
      this.tableCardDrawer.toggleVisible()
    },
    changeTableSize (size) {
      this.size = size
    },
    refreshAction () {
      const { page, pageSize } = this
      this.$emit('load-event', page, pageSize)
    },
    searchAction () {
      this.page = 1
      if (this.noRouter) {
        this.refreshAction()
      } else {
        const { page, pageSize, searchData, $route, $router } = this
        const { path, query } = $route
        const { str: queryStr } = this.parseToPlainInfo(query, { page, pageSize })
        const { str: searchStr, obj: searchObj } = this.parseToPlainInfo(searchData, { page, pageSize })
        if (queryStr === searchStr) {
          this.refreshAction()
        } else {
          $router.replace({ path, query: searchObj })
        }
      }
    },
    resetAction () {
      this.tableCardForm.resetFields()
      this.searchAction()
    },
    exportAction () {
      const { page, pageSize } = this
      this.$emit('export-event', page, pageSize)
    },
    changePage (page) {
      this.page = page
      if (this.noRouter) {
        this.refreshAction()
      } else {
        const { path, query } = this.$route
        const pageSize = this.pageSize
        const newQuery = Object.assign({}, query, { page, pageSize })
        this.$router[this.navigation]({ path, query: newQuery })
      }
    },
    changePageSize (pageSize) {
      this.pageSize = pageSize
      if (this.page === this.tableCardPage.currentPage) {
        this.changePage(1)
      }
    }
  },
  watch: {
    $route: 'refreshAction'
  },
  created () {
    if (this.pageSizeOpts.length > 0) this.pageSize = this.pageSizeOpts[0]
    if (!this.noRouter) {
      const { query } = this.$route
      const { page, pageSize } = query
      if (page && /^\d+$/.test(page)) this.page = this.$lodash.parseInt(page)
      if (pageSize && /^\d+$/.test(pageSize)) this.pageSize = this.$lodash.parseInt(pageSize)
    }
  }
}
</script>

<style lang="less">
.app-table-card {
  &__extra {
    min-height: initial !important;
  }
  &__toolbar {
    flex: 0 0 200px;
    .toolbar-item {
      flex: 0 0 40px;
    }
    .ivu-btn.ivu-btn-default.ivu-btn-icon-only:focus {
      box-shadow: none;
    }
  }
  &__size {
    min-width: 80px;
  }
}
</style>
