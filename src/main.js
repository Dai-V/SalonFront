import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import ScheduleContainer from './components/ScheduleContainer.vue';
import LoginForm from './components/LoginForm.vue';
const pinia = createPinia()
const routes = [
  { path: '/', name:'Dashboard', component: ScheduleContainer,  meta: { icon: '📊'  }},
  { path: '/appointments', name:'Appointments', component: ScheduleContainer,  meta: { icon: '📅'  }},
//   { path: '/settings', name:'Settings',component: LoginForm ,  meta: { icon: '⚙️' }},
  { path: '/login', name:'Login' ,component: LoginForm,  meta: { icon:'🔑' } },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
createApp(App).use(router).use(pinia).mount('#app')
