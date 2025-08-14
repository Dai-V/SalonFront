<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from 'vue-router';
import { useAuthStore } from "../stores/auth";
const authStore = useAuthStore();
const isCollapsed = ref(false)
const router = useRouter();
const navRoutes = router.getRoutes()

onMounted(async () => {
   await checkIsLoggedIn()
    router.beforeEach(async (to, from) => {
  if (!authStore.isLoggedIn && to.name !== 'Login')
    return { name: 'Login' }    
  })
});
function checkIsLoggedIn()
{       
     const response = fetch('http://127.0.0.1:8000/api/is_logged_in/', { 
        credentials: 'include'
     }) 
        .then(response => {
           if (response.status === 401 || response.status === 403) {
                authStore.logout
            } else if (response.status === 200) {
             authStore.login(response.headers.get("x-csrftoken"))
            }
            
        })
    return response
}

function logoutClick(){
        fetch('http://127.0.0.1:8000/api/logout/', {
            method: 'POST',
            headers: new Headers({
                'X-CSRFTOKEN': authStore.csrftoken
            }),
            credentials: 'include',
        }
        ).then(response => {
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
             authStore.logout
             router.push('/login')
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

</script>
<template>
  <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <button class="toggle-btn" @click="isCollapsed = !isCollapsed">
      {{ isCollapsed ? "→" : "←" }}
    </button>

    <h2 class="logo" v-if="!isCollapsed">Navigation</h2>
    <nav>
      <ul>
        <div v-for="route in navRoutes" >
        <li v-if="route.name!=='Login'">
            <router-link :to="route.path" :key="route.name">
            <i class="icon"> {{  route.meta.icon  }}</i>
            <span v-if="!isCollapsed" class="label">{{ route.name }}</span>
            </router-link>
        </li>
        </div>
        <li v-if="authStore.isLoggedIn" >
            <a @click="logoutClick()">
            <i class="icon"> 🚪 </i>
            <span v-if="!isCollapsed" class="label">Logout</span>
            </a>
         </li>
      </ul>
    </nav>
  </div>
</template>


<style scoped>
.sidebar {
  width: 220px;
  height: 100vh;
  background-color: #f0f0f0; /* Light grey */
  color: #1e293b; /* Dark text */
  border-right: 1px solid #cbd5e1; /* Slightly darker grey border */
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
  position: fixed;
  left: 0;
  top: 0;
  transition: width 0.3s;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 70px;
}

.toggle-btn {
  background: none;
  border: none;
  color: #334155;
  font-size: 1.2rem;
  cursor: pointer;
  margin-bottom: 20px;
}

.logo {
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: bold;
  white-space: nowrap;
}

nav ul {
  list-style: none;
  padding: 0;
}

nav li {
  margin-bottom: 15px;
  border: 5px;
  border-style: groove;
}

nav a {
  color: #334155;
  text-decoration: none;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: background 0.2s;
}

nav a:hover {
  background-color: #e2e8f0; /* Slightly darker hover grey */
}

.icon {
  width: 30px;
  text-align: center;
  margin-right: 8px;
}
</style>