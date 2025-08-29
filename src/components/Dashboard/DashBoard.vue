<script setup>
import { onMounted, ref,watch } from "vue";
import { useAuthStore } from "../../stores/auth";
const authStore = useAuthStore();
const customersCount = ref(0)
const appsCount = ref(0)
const openAppsCount =ref(0)
const closedAppsCount = ref(0)  
const totalEarnings = ref(0)
const scheduledTechs = ref([])
function getTodayOverView() {
     fetch('http://127.0.0.1:8000/api/dashboard/', { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
         'X-CSRFTOKEN': authStore.csrftoken
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        data = JSON.parse(data)
        console.log(data)
        appsCount.value = data.CountAppointments
        openAppsCount.value = data.CountOpenAppointments
        closedAppsCount.value = data.CountClosedAppointments
        customersCount.value = data.CountCustomers
        totalEarnings.value = data.TotalEarnings
        scheduledTechs.value = data.ScheduledTechs


      })
      .catch(error => {
        console.error('Error posting custom data:', error);

      });
    }
 getTodayOverView()
</script>
<template>
  <div class="container">

    <!-- Main Dashboard -->
    <main class="main">
      <header class="header">
        <h3>Overview</h3>
        <div class="profile">

        </div>
      </header>

      <!-- Stats Boxes -->
      <section class="stats">
        <div class="card"><h3>Clients</h3> <h2>{{customersCount}}</h2></div>
        <div class="card"><h3>Appointments</h3> <h2>{{appsCount}}</h2></div>
        <div class="card"><h3>Open Appointments</h3> <h2>{{openAppsCount}}</h2></div>
        <div class="card"><h3>Closed Appointments</h3> <h2>{{ closedAppsCount }}</h2></div>
        <div class="card"><h3>Earnings</h3>
          <h2>{{ totalEarnings }}$</h2>
        </div>
      </section>
<!-- 
      Charts & Lists
      <section class="grid">
        <div class="card large">
          <h4>Overall Appointments</h4>
          <div class="placeholder">[Bar Chart Here]</div>
        </div>
        <div class="card medium">
          <h4>Scheduled Techs</h4>
          <ul>
            <li v-for="tech in scheduledTechs"> {{tech.TechName }}</li>
          </ul>
        </div>
        <div class="card medium">
          <h4></h4>
          <div class="placeholder"></div>
        </div>
      </section> -->
    </main>

  

  </div>
</template>

<style scoped>


.container {
  display: grid;
  grid-template-columns: 1fr 300px;
  height: 100vh;
}

/* Main Section */
.main {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile img {
  border-radius: 50%;
}

/* Stats cards */
.stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin: 20px 0;
}

.card {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  border: collapse;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  background-color: #f0f0f0;
}

.card h2 {
  margin-top: 10px;
}

/* Grid section */
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 15px;
}

.placeholder {
  background: #eef1f9;
  border: 2px dashed #ccc;
  border-radius: 8px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
}

/* Appointments Panel */
.appointments {
  background: #fff;
  padding: 20px;
  border-left: 1px solid #ddd;
  overflow-y: auto;
}

.appointments h4 {
  margin-bottom: 15px;
}

.appointments ul {
  list-style: none;
}

.appointments li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.appointments img {
  border-radius: 50%;
  margin-right: 8px;
}
</style>