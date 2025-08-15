<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const techList = ref ([])

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
            
      })


}

getTechnicians()
</script>

<template>
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
    <tr v-for="tech in techList">
        <td> {{tech.TechID}} </td>
        <td> {{tech.TechName}} </td>
        <td> {{tech.TechPhone}} </td>
        <td> {{tech.TechEmail}} </td>
        <td> {{tech.TechInfo}} </td>
  </tr>

  </tbody>
</table>
</template>

<style scoped>
.data-table {
  width: 100%;
  border-collapse: collapse; /* Collapses borders between cells */
}


.data-table td {
  border: 1px solid #ddd; /* Adds borders to cells */
  padding: 15px; /* Adds padding inside cells */
  text-align: left; /* Aligns text to the left */
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