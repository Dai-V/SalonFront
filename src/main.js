import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import ScheduleContainer from './components/Appointment/ScheduleContainer.vue';
import LoginForm from './components/Auth/LoginForm.vue';
import SignupForm from './components/Auth/SignupForm.vue';
import Technicians from './components/Technicians/Technicians.vue'
import SavedServices from './components/Saved Services/SavedServices.vue'
import Customers from './components/Customers/Customers.vue'
const pinia = createPinia()
const routes = [
  { path: '/', name:'Dashboard', component: ScheduleContainer,  meta: { icon: '📊'  }},
  { path: '/appointments', name:'Appointments', component: ScheduleContainer,  meta: { icon: '📅'  }},
  { path: '/technicians', name:'Technicians', component: Technicians,  meta: { icon: '👨' }},
   { path: '/savedservices', name:'Saved Services', component: SavedServices,  meta: { icon: '🛎️' }},
//   { path: '/settings', name:'Settings',component: LoginForm ,  meta: { icon: '⚙️' }},
 { path: '/customers', name:'Customers',component: Customers ,  meta: { icon: '🧑‍🤝‍🧑' }},
  { path: '/login', name:'Login' ,component: LoginForm,  meta: { icon:'🔑' } },
    { path: '/signup', name:'Signup' ,component: SignupForm,  meta: { icon:'🔑' } },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
createApp(App).use(router).use(pinia).mount('#app')
