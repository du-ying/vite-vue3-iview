import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import ViewUIPlus from 'view-ui-plus'
import _ from 'lodash'
import router from './router/index.js'
import AppTableCard from '@components/app-table-card/app-table-card.vue'
import AppTableSearch from '@components/app-table-card/app-table-search.vue'

const app = createApp(App)

app.config.globalProperties.$lodash = _

app.use(ViewUIPlus)
app.use(router)

app.component('AppTableCard', AppTableCard)
app.component('AppTableSearch', AppTableSearch)

app.mount('#app')
