<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';
import CustomerForm from './CustomerForm.vue';
import CustomerEditForm from './CustomerEditForm.vue';

const router = useRouter();
const authStore = useAuthStore();
const customerList = ref ([])
const fullCustomerList = ref([])
const showCustomerForm = ref(false)
const customerIDEdit = ref(null)
const showCustomerEditForm = ref(false)
const searchQuery = ref('')

function getCustomers() {
     fetch("http://127.0.0.1:8000/api/customers/", { 
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
            customerList.value = data
            fullCustomerList.value = data
            
      })


}
function openCustomerEditForm(customerID) {
    showCustomerEditForm.value=!showCustomerEditForm.value
    customerIDEdit.value = customerID
}

function search() {
    customerList.value = fullCustomerList.value.filter(x => x.CustomerFirstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
  x.CustomerPhone.includes(searchQuery.value) || 
    (x.CustomerEmail?x.CustomerEmail:'').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
  (x.CustomerInfo?x.CustomerInfo:'').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
  (x.CustomerID).toString().includes(searchQuery.value.toLowerCase()) ||
  (x.CustomerLastName).toLowerCase().includes(searchQuery.value.toLowerCase())
)
  }


getCustomers()
</script>

<template>
<CustomerForm v-if="showCustomerForm" @close-form="showCustomerForm=!showCustomerForm" :callReload="getCustomers" />
<CustomerEditForm v-if="showCustomerEditForm" @close-form="showCustomerEditForm=!showCustomerEditForm" :customerID="customerIDEdit" :callReload="getCustomers"/>
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
         <th> First Name </th>
         <th> Last Name </th>
         <th>Phone </th>
         <th> Email </th>
         <th> Additional Info </th>
  </tr>
</thead>
  <tbody>
    <tr v-for="customer in customerList" @click="openCustomerEditForm(customer.CustomerID)">
        <td> {{customer.CustomerID}} </td>
        <td> {{customer.CustomerFirstName}} </td>
        <td> {{customer.CustomerLastName}} </td>
        <td> {{customer.CustomerPhone}} </td>
        <td> {{customer.CustomerEmail}} </td>
        <td> {{customer.CustomerInfo}} </td>
  </tr>

  </tbody>
</table>
 <button type="button" class="add-customer" @click="showCustomerForm=!showCustomerForm">+ Add</button>
</template>

<style scoped>
.data-table {
  width: 100%;
  border-collapse: collapse; 
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  border-radius: 10px;
  border: 1px solid #ccc;
}
.add-customer { background:#10b981; color:white; border:none; padding:8px 10px; border-radius:10px; cursor:pointer; margin-top:10px }

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