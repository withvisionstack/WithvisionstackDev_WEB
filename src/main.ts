// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import router from './router'
import App from './App.vue'
import './assets/style.css'

const toastOptions: PluginOptions = {
  timeout: 3500,
  closeOnClick: true,
  pauseOnHover: true,
  position: POSITION.TOP_RIGHT, // ✅ Correto
}

createApp(App)
  .use(createPinia())
  .use(router)
  .use(Toast, toastOptions)
  .mount('#app')