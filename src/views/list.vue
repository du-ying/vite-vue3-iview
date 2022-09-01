<template>
  <div class="p-3">
    <AppTableCard ref="card" resizeable
                  :page-size-opts="[50, 100]"
                  :columns-data="columns"
                  :search-data="search"
                  :total="total"
                  :loading="loading"
                  @load-event="loadList"
                  @export-data="exportAction">
      <template #search>
        <AppTableSearch label="关键词" prop="keyword" :invisible="search.type === '2'">
          <Input v-model.trim="search.keyword" />
        </AppTableSearch>

        <AppTableSearch label="类型" prop="type">
          <RadioGroup v-model="search.type">
            <Radio label="1" border>类型1</Radio>
            <Radio label="2" border>类型2</Radio>
          </RadioGroup>
        </AppTableSearch>

        <AppTableSearch label="状态" prop="status">
          <CheckboxGroup v-model="search.status">
            <Checkbox label="3" border>状态3</Checkbox>
            <Checkbox label="4" border>状态4</Checkbox>
          </CheckboxGroup>
        </AppTableSearch>

        <AppTableSearch label="日期" prop="time">
          <DatePicker type="daterange" v-model="search.time" class="w-100" />
        </AppTableSearch>
      </template>
      <template #extra>
        <Button class="mb-3" type="primary" icon="md-add">新增</Button>
      </template>
      <template #default="{ size, rebuildColumns, maxHeight }">
        <Table border stripe class="mt-3"
               :max-height="maxHeight - 16 * 3"
               :columns="(rebuildColumns.length > 0 && rebuildColumns) || columns"
               :data="list"
               :size="size"
               :loading="loading"></Table>
      </template>
    </AppTableCard>
  </div>
</template>

<script>
export default {
  data: () => ({
    columns: [
      { type: 'selection', width: 60, align: 'center' },
      { type: 'index', width: 60, align: 'center' },
      { type: 'expand', title: 'expand', renderHeader: (h, { column, index }) => h('span', 'expand-title'), minWidth: 120 },
      { title: 'ID', key: 'id', minWidth: 100 },
      { title: '姓名', key: 'name', minWidth: 100 },
      { title: 'column1', key: 'column1', minWidth: 100 },
      { title: 'column2', key: 'column2', minWidth: 100 },
      { title: 'column3', key: 'column3', minWidth: 100 },
      { title: 'column4', key: 'column4', minWidth: 100 },
      { title: 'column5', key: 'column5', minWidth: 100 },
      { title: '年龄', key: 'age', minWidth: 100 },
      { title: '操作', key: 'action', fixed: 'right', width: 140, align: 'center' }
    ],
    list: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 },
      { id: 9 },
      { id: 10 },
      { id: 11 },
      { id: 12 },
      { id: 13 },
      { id: 14 },
      { id: 15 },
      { id: 16 },
      { id: 17 },
      { id: 18 },
      { id: 19 },
      { id: 20 },
      { id: 21 },
      { id: 22 },
      { id: 23 },
      { id: 24 },
      { id: 25 },
      { id: 26 },
      { id: 27 },
      { id: 28 },
      { id: 29 },
      { id: 30 }
    ],
    total: 360,
    loading: false,
    search: {
      keyword: '',
      type: '',
      status: [],
      time: ['', '']
    }
  }),
  methods: {
    exportAction (page, pageSize) {
      console.log(`导出数据, page=${page}, pageSize=${pageSize}`)
    },
    updateSearchModel ({ query }) {
      const { keyword, type, status, time } = query
      this.search.keyword = keyword || ''
      this.search.type = type || ''
      this.search.status = this.$lodash.filter((status || '').split(','), item => item.length > 0)
      this.search.time = this.$lodash.map(
          (time || ',').split(','),
          item => this.$Date(item).isValid() ? this.$Date(Number(item)).toDate() : item
      )
    },
    loadList (page, pageSize) {
      console.log(`加载列表数据, page=${page}, pageSize=${pageSize}, search=${JSON.stringify(this.search)}`)
    }
  },
  watch: {
    $route: 'updateSearchModel'
  },
  mounted () {
    this.updateSearchModel(this.$route)
    this.$refs.card.refreshAction()
  }
}
</script>
