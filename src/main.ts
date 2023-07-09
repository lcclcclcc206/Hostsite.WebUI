import { createApp } from 'vue'
import naive from 'naive-ui'
import App from '@/App.vue'
import { createPinia } from 'pinia'

import { router } from '@/Router/index'

const pinia = createPinia();

createApp(App).use(pinia).use(naive).use(router).mount('#app');