<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import SavedServicesForm from './SavedServicesForm.vue';
import SavedServicesEditForm from './SavedServicesEditForm.vue';


const router = useRouter();
const authStore = useAuthStore();
const savedServicesList = ref ([])
const showSavedServicesForm = ref(false)
const showSavedServicesEditForm = ref(false)
const serviceIDEdit = ref(null)

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
            
      })


}
// function openTechnicianEditForm(techID) {
//     showTechnicianEditForm.value=!showTechnicianEditForm.value
//     techIDEdit.value = techID
// }
getSavedServices()
function openSavedServicesEditForm(ServiceID) {
    serviceIDEdit.value = ServiceID
    showSavedServicesEditForm.value  = ! showSavedServicesEditForm.value
}
</script>

<template>
<SavedServicesForm v-if="showSavedServicesForm" @close-form="showSavedServicesForm=!showSavedServicesForm" :callReload="getSavedServices"/>
<SavedServicesEditForm v-if="showSavedServicesEditForm" @close-form="showSavedServicesEditForm=!showSavedServicesEditForm" :ServiceID="serviceIDEdit" :callReload="getSavedServices"/>

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
</style>