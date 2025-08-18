<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import SavedServicesForm from './SavedServicesForm.vue';
import SavedServicesEditForm from './SavedServicesEditForm.vue';


const router = useRouter();
const authStore = useAuthStore();
const fullSavedServicesList = ref([])
const savedServicesList = ref ([])
const showSavedServicesForm = ref(false)
const showSavedServicesEditForm = ref(false)
const serviceIDEdit = ref(null)
const searchQuery = ref('')

function getSavedServices() {
     fetch("http://127.0.0.1:8000/api/savedservices/", { 
        credentials: 'include',
        method:'GET'
     }) 
      .then(response =>  {
           if (response.status === 403) {
                throw new Error("Not Authenticated")
            }
            return response.json() 
        })
      .then(data => {
            savedServicesList.value = data
            fullSavedServicesList.value = data
            
      })


}
function search() {

    savedServicesList.value = fullSavedServicesList.value.filter(x => x.ServiceCode.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
  x.ServiceName.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
  (x.ServiceDescription?x.ServiceDescription:'').toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    x.ServicePrice.includes(searchQuery.value) || 
x.ServiceDuration.toString().includes(searchQuery.value)
    )
  }


getSavedServices()

function openSavedServicesEditForm(ServiceID) {
    serviceIDEdit.value = ServiceID
    showSavedServicesEditForm.value  = ! showSavedServicesEditForm.value
}
</script>

<template>
<SavedServicesForm v-if="showSavedServicesForm" @close-form="showSavedServicesForm=!showSavedServicesForm" :callReload="getSavedServices"/>
<SavedServicesEditForm v-if="showSavedServicesEditForm" @close-form="showSavedServicesEditForm=!showSavedServicesEditForm" :ServiceID="serviceIDEdit" :callReload="getSavedServices"/>
  <div class="search-bar">
    <input
      type="text"
      placeholder="Search..."
      v-model="searchQuery"
      @input="search()"
    />
  </div>
<table class="data-table">
<thead>
   <tr>
         <th> Code </th>
         <th> Name </th>
         <th> Duration </th>
         <th> Price </th>
         <th> Description </th>
  </tr>
</thead>
  <tbody>
    <tr v-for="service in savedServicesList" @click="openSavedServicesEditForm(service.ServiceID)">
        <td> {{service.ServiceCode}} </td>
        <td> {{service.ServiceName}} </td>
        <td> {{service.ServiceDuration}} </td>
        <td> {{service.ServicePrice}} </td>
        <td> {{service.ServiceDescription }}</td>
  </tr>

  </tbody>
</table>
 <button type="button" class="add-btn" @click="showSavedServicesForm=!showSavedServicesForm">+ Add</button>
</template>

<style scoped>
.data-table {
  width: 100%;
  border-collapse: collapse; 
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
.add-btn { background:#10b981; color:white; border:none; padding:8px 10px; border-radius:10px; cursor:pointer; margin-top:10px }

.data-table td {
  border: 1px solid #ddd; /* Adds borders to cells */
  padding: 15px; /* Adds padding inside cells */
  text-align: left; /* Aligns text to the left */
  cursor:pointer;
  
}

.data-table th {
    padding: 15px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #eee;
    border-right: 1px solid #ddd;
    text-align:left
}

.data-table tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* Alternating row background color */
}

.data-table tbody tr:hover {
  background-color: #e0e0e0; /* Hover effect for rows */
}

.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.search-bar input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-bar button {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>