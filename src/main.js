import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import ScheduleContainer from './components/ScheduleContainer.vue';
import LoginForm from './components/LoginForm.vue';
import SignupForm from './components/SignupForm.vue'
import Technicians from './components/Technicians.vue'
import SavedServices from './components/SavedServices.vue'
const pinia = createPinia()
const routes = [
  { path: '/', name:'Dashboard', component: ScheduleContainer,  meta: { icon: '📊'  }},
  { path: '/appointments', name:'Appointments', component: ScheduleContainer,  meta: { icon: '📅'  }},
  { path: '/technicians', name:'Technicians', component: Technicians,  meta: { icon: '👨' }},
   { path: '/savedservices', name:'Saved Services', component: SavedServices,  meta: { icon: '🛎️' }},
//   { path: '/settings', name:'Settings',component: LoginForm ,  meta: { icon: '⚙️' }},
  { path: '/login', name:'Login' ,component: LoginForm,  meta: { icon:'🔑' } },
    { path: '/signup', name:'Signup' ,component: SignupForm,  meta: { icon:'🔑' } },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
createApp(App).use(router).use(pinia).mount('#app')
