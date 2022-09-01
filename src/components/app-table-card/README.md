<!-- TOC -->
  * [AppTableCard](#apptablecard)
    * [Props](#props)
    * [Events](#events)
    * [Slots](#slots)
    * [Methods](#methods)
  * [AppTableSearch](#apptablesearch)
    * [Props](#props)
  * [代码示例](#)
<!-- TOC -->

## AppTableCard
### Props
| 属性             | 说明                                                                                                     | 类型      | 默认值                |
|----------------|--------------------------------------------------------------------------------------------------------|---------|--------------------|
| no-toolbar     | 当值为 `true` 时，不展示工具栏版块                                                                                  | Boolean | false              |
| no-page        | 当值为 `true` 时，不展示底部分页 `<Page>` 组件                                                                       | Boolean | false              |
| no-download    | 当值为 `true` 时，不展示工具栏中的下载按钮                                                                              | Boolean | false              |
| no-router      | 默认 `page` 和 `pageSize` 的初始值由 `$route.query` 决定。当值为 `true` 时，取消此依赖                                      | Boolean | false              |
| search-data    | 搜索表单数据对象                                                                                               | Object  | `{}`               |
| total          | 数据总数                                                                                                   | Number  | 0                  |
| loading        | 当表格状态为加载中时，同步查询、重置、刷新三个按钮的状态                                                                           | Boolean | false              |
| page-size-opts | 每页条数切换的配置                                                                                              | Array   | `[10, 20, 30, 40]` |
| columns-data   | 表格列的配置描述。具体项见[组件Table的column](https://www.iviewui.com/view-ui-plus/component/form/table#column_normal) | Array   | `[]`               |
| navigation     | 路由 `$router` 的导航方式。可选值为 `replace` 和 `push`                                                             | String  | replace            |
| resizeable     | 当值为 `true` 时，开启 Window resize 事件，根据窗口高度改变 `default` 插槽 `maxHeight` 属性值                                 | Boolean | false              |


### Events
| 事件名          | 说明                      | 返回值            |
|--------------|-------------------------|----------------|
| export-event | 点击工具栏中的下载按钮，用于导出服务端列表数据 | page, pageSize |
| load-event   | 表格加载事件，用于请求服务端列表数据      | page, pageSize |

### Slots
| 名称      | 说明                                            | 作用域插槽属性                                                                                                           |
|---------|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| search  | 搜索表单插槽，可放置多个子组件 `<AppTableSearch>` ，自动完成响应式布局 |                                                                                                                   |
| extra   | 工具栏左侧插槽                                       |                                                                                                                   |
| default | 主体内容插槽                                        | size：表格尺寸，默认值为 default <br> rebuildColumns：重构表格列，初始选项由 `columns-data` 决定。默认值为 `[]` <br> maxHeight：表格最大高度，默认值为 500 |


### Methods
| 方法名           | 说明                                                                                           | 参数  |
|---------------|----------------------------------------------------------------------------------------------|-----|
| refreshAction | 刷新列表数据。当执行一个删除动作后，也可通过该方法来刷新列表数据。<br>注意，必须在 mounted 函数内执行一次该方法，来完成 - **_页面初始打开后，查询列表数据的效果_** |     |

## AppTableSearch

### Props

| 属性         | 说明                                                            | 类型      | 默认值   |
|------------|---------------------------------------------------------------|---------|-------|
| prop       | 对应搜索表单 `search-data` 里的字段                                     | String  |       |
| label      | 标签文本                                                          | String  |       |
| labelWidth | 表单域标签的的宽度                                                     | Number  |       |
| labelFor   | 指定原生的 label 标签的 for 属性，配合控件的 `element-id` 属性，可以点击 label 时聚焦控件 | String  |       |
| invisible  | 当值为 true 时，该搜索表单不可见                                           | Boolean | false |


## 代码示例
```vue
<template>
  <div class="p-3">
    <AppTableCard ref="card" resizeable
                  :page-size-opts="[50, 100]"
                  :columns-data="columns"
                  :search-data="search"
                  :total="total"
                  :loading="loading"
                  @load-event="loadList"
                  @export-event="exportAction">
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
               :columns="rebuildColumns"
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
    list: [],
    total: 0,
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
      console.log(`导出数据, page=${page}, pageSize=${pageSize}, search=${JSON.stringify(this.search)}`)
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
    // 注意，必须在 mounted 函数内执行以下两行代码 ，来完成【页面初始打开后，查询列表数据的效果】
    this.updateSearchModel(this.$route)
    this.$refs.card.refreshAction()
  }
}
</script>
```
