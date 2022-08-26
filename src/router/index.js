import { createRouter, createWebHashHistory } from 'vue-router'
import _ from 'lodash'

const routes = _.values(import.meta.glob('./routes/*.js', {
  import: 'default',
  eager: true
}))

export default createRouter({
  history: createWebHashHistory(),
  routes
})
