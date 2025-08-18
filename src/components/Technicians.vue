<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import TechnicianForm from './TechnicianForm.vue';
import TechnicianEditForm from './TechnicianEditForm.vue';

const router = useRouter();
const authStore = useAuthStore();
const techList = ref ([])
const fullTechList = ref([])
const showTechnicianForm = ref(false)
const techIDEdit = ref(null)
const showTechnicianEditForm = ref(false)
const searchQuery = ref('')
function getTechnicians() {
     fetch("http://127.0.0.1:8000/api/technicians/", { 
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
            techList.value = data
            fullTechList.value = data
            
      })


}
function openTechnicianEditForm(techID) {
    showTechnicianEditForm.value=!showTechnicianEditForm.value
    techIDEdit.value = techID
}

function search() {
    techList.value = fullTechList.value.filter(x => x.TechName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
  x.TechPhone.includes(searchQuery.value) || 
    (x.TechEmail?x.TechEmail:'').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
  (x.TechInfo?x.TechInfo:'').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
  (x.TechID).toString().includes(searchQuery.value.toLowerCase())
)
  }


getTechnicians()
</script>

<template>
<TechnicianForm v-if="showTechnicianForm" @close-form="showTechnicianForm=!showTechnicianForm" :callReload="getTechnicians" />
<TechnicianEditForm v-if="showTechnicianEditForm" @close-form="showTechnicianEditForm=!showTechnicianEditForm" :techID="techIDEdit" :callReload="getTechnicians"/>
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
        <th> ID </th>
         <th> Name </th>
         <th>Phone </th>
         <th> Email </th>
         <th> Additional Info </th>
  </tr>
</thead>
  <tbody>
    <tr v-for="tech in techList" @click="openTechnicianEditForm(tech.TechID)">
        <td> {{tech.TechID}} </td>
        <td> {{tech.TechName}} </td>
        <td> {{tech.TechPhone}} </td>
        <td> {{tech.TechEmail}} </td>
        <td> {{tech.TechInfo}} </td>
  </tr>

  </tbody>
</table>
 <button type="button" class="add-tech" @click="showTechnicianForm=!showTechnicianForm">+ Add</button>
</template>

<style scoped>
.data-table {
  width: 100%;
  border-collapse: collapse; 
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
.add-tech { background:#10b981; color:white; border:none; padding:8px 10px; border-radius:10px; cursor:pointer; margin-top:10px }

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