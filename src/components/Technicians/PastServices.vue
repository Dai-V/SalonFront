<script setup>
import {ref,defineEmits} from 'vue'
import { useAuthStore } from '../../stores/auth'
const emit = defineEmits(['closeForm'])
const props = defineProps({
techID:Number,
})
const apps = ref([])
const customers = ref([])
function getCustomers() {
    fetch("http://127.0.0.1:8000/api/customers/", { 
        credentials: 'include',
        method: 'GET'
     }) 
      .then(response =>  {
           if (response.status === 403) {
                throw new Error("Not Authenticated")
            }
            return response.json() 
        })
      .then(data => {
            customers.value = data
            console.log(data)
      })
}

getCustomers()

</script>
<template>
<div class="modal">
<div class="modal-card">
<table class="data-table">
<thead>
   <tr>
        <th> Date </th>
        <th> Service Name </th>
        <th> Customer Name </th>
        <th> Price </th>
        <th> Duration </th>
  </tr>
</thead>
  <tbody>
    <template v-for="customer in customers">
    <template v-for="app in customer.Appointments">
    <template v-for="service in app.Services">
    <tr v-if="props.techID == service.TechID" @click="">
        <td> {{app.AppDate}} </td>
        <td> {{service.ServiceName}} </td>
        <td> {{customer.CustomerFirstName}} </td>
        <td> {{service.ServicePrice}} </td>
        <td> {{service.ServiceDuration}} </td>
    </tr>
    </template>
    </template>
    </template>

  </tbody>
</table>
<div class="actions">
        <button type="button" class="btn-ghost" v-on:click="$emit('closeForm')">Exit</button>
</div>
</div>
</div>
</template>
<style scoped>
button.primary { background:#10b981; color:#fff; border:none; padding:10px 14px; border-radius:8px; cursor:pointer; }
button.secondary { background:lightblue; border:1px solid #e6eef7; padding:8px 12px; border-radius:10px; cursor:pointer; margin-top: 10px; width: 150px;}
.modal { display:flex; position:fixed; inset:0; background:rgba(2,6,23,0.6); z-index:1000; align-items:center; justify-content:center; 
}
.modal-card { width:600PX; background:#fff; border-radius:14px; padding:18px; box-shadow:0 18px 60px rgba(2,6,23,0.25); }
h2 { margin:0 0 8px 0; font-size:25px; }
.grid { display:grid; grid-template-columns: 1fr 120px; gap:10px; align-items:center; }
label { display:block;width:100%; font-size:18px; color:#334155; }
input, select, textarea { display:inline-block;width:30%; padding:8px 10px 10px 10px; border-radius:8px; border:1px solid #e6eef7; background:#f0f0f0; }
.actions { display:flex; gap:8px; margin-top:14px; justify-content:flex-start; }
.btn-ghost { background:transparent; border:1px solid #e6eef7; padding:8px 12px; border-radius:10px; cursor:pointer; }
.add-btn { background:#10b981; color:white; border:none; padding:8px 10px; border-radius:10px; cursor:pointer; }
.small { font-size:13px; color:#64748b; margin-top:6px; }

.remove-btn { color:#dc2626; border-color:#fca5a5; }
.error {color:red; padding:8px 10px 10px 10px; display:inline; width: 40%;}
.data-table {
  display:block;
  width: 100%;
  height:500px;
  overflow-y: scroll;
  border-collapse: collapse; 
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  margin:auto;
}

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