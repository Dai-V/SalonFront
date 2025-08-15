<script setup>
import {ref,defineEmits} from 'vue'
import ServiceRow from './ServiceRow.vue'
import { useAuthStore } from '../stores/auth'

const emit = defineEmits(['closeForm'])
const props = defineProps({
  techs:Array,
  callReload: Function,
  appID:Number,

})
const authStore = useAuthStore();
const services = ref([]);
const servicesForm = ref([]);
const appDate = ref(props.date);
const appComment = ref("");
const appStatus = ref("Open");
const appTotal = ref(0);
const paymentType =ref("Visa");


let serviceID = 0;
function addService()  {
  services.value.push({ 
    id: serviceID,
    serviceStartTime:"00:00",
    serviceDuration:0,
    serviceName:"",
    serviceCode:"",
    servicePrice:0,
    techID: ""
   });
  serviceID++;
};

const removeService = (id) => {
  services.value = services.value.filter(service => service.id!==id);
  servicesForm.value = servicesForm.value.filter(service => service.id!==id)
}

const updateServices = (service) => {
    if(!servicesForm.value[service.id])
      servicesForm.value.push(service)
    else {
      servicesForm.value[service.id] = service
    }
}
function getAppointment() {
  fetch('http://127.0.0.1:8000/api/appointments/'+props.appID, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
         'X-CSRFTOKEN': authStore.csrftoken
      },
      credentials: 'include',
    })
      .then(response => 
    {
      if (response.status === 403) {
        throw new Error("Not Authenticated")
      }
      if (response.status === 404) {
        throw new Error("Appointment not found")
      }
      return response.json()
    })
      .then(data => {
        console.log('Response from server:', data);
        for (let service in data.Services){
       services.value.push({ 
    id: serviceID,
    serviceStartTime:data.Services[service].ServiceStartTime,
    serviceDuration:data.Services[service].ServiceDuration,
    serviceName:data.Services[service].ServiceName,
    serviceCode:data.Services[service].ServiceCode,
    servicePrice:data.Services[service].ServicePrice,
    techID: data.Services[service].TechID

          });
        serviceID++;
        }
        appDate.value = data.AppDate
        appComment.value = data.AppComment
        appStatus.value = data.AppStatus
        appTotal.value = data.AppTotal
        paymentType.value = data.PaymentType

      })
      .catch(error => {
        console.error('Error posting custom data:', error);
        emit('closeForm')

      });
}

function appSubmit() {


 const postData = {
      AppStatus: appStatus.value,
      AppComment: appComment.value,
      AppTotal: appTotal.value,
      AppDate: appDate.value,
      AppStatus: appStatus.value,
      PaymentType: paymentType.value,
      CustomerID: 1,
      Services: []

    };
    for (let i in servicesForm.value) {
      let service = {
        ServiceName : servicesForm.value[i].name,
        ServiceCode : servicesForm.value[i].code,
        ServicePrice: servicesForm.value[i].price,
        ServiceStartTime: servicesForm.value[i].start,
        ServiceDuration: servicesForm.value[i].duration,
        TechID: servicesForm.value[i].tech

      }
      postData.Services.push(service)
    }

    fetch('http://127.0.0.1:8000/api/appointments/'+props.appID+'/', { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
         'X-CSRFTOKEN': authStore.csrftoken
      },
      credentials: 'include',
      body: JSON.stringify(postData) 
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response from server:', data);
        emit('closeForm')
        props.callReload()

      })
      .catch(error => {
        console.error('Error posting custom data:', error);
        emit('closeForm')

      });
}
getAppointment()
</script>

<template>
<div id="bookingModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="modal-card">
    <h2 id="modalTitle">Edit Appointment</h2>
    <form id="bookingForm" @submit.prevent="appSubmit()">
      <div class="grid">
        <div>
          <label for="AppDate">Date</label>
          <input v-model="appDate" type="date" id="AppDate" name="AppDate"  required>
        </div>
        <div>
          <label for="AppStatus">Status</label>
          <select v-model="appStatus" id="AppStatus" name="AppStatus">
            <option>Open</option>
            <option>Closed</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      <div class="two-cols">
        <div>
          <label for="AppTotal">Total</label>
          <input v-model="appTotal" type="number" id="AppTotal" name="AppTotal"  placeholder="0">
        </div>
        <div>
          <label for="PaymentType">Payment Type</label>
          <select v-model="paymentType" id="PaymentType" name="PaymentType">
            <option>Cash</option>
            <option>Visa</option>
            <option>Mastercard</option>
          </select>
        </div>
      </div>

      <label for="AppComment">Comment</label>
      <textarea v-model="appComment" id="AppComment" name="AppComment" rows="2"></textarea>

      <div class="services">
        <label>Services</label>
      <div id="servicesContainer">
        <div v-for="service in services" :key="service.id">
        <ServiceRow  :techs="props.techs" :id="service.id"
         @emit-changes="updateServices" @remove-service="removeService" :serviceName="service.serviceName"
  :servicePrice="service.servicePrice"
  :serviceStartTime="service.serviceStartTime" 
  :serviceDuration="service.serviceDuration"
  :selectedTech="service.techID"
  :selectedOption="service.serviceCode"
         />
        </div>
      </div>
       <button type="button" class="add-service" @click="addService()">+ Add Service</button>
      </div>

      <div class="actions">
        <button type="button" class="btn-ghost" v-on:click="$emit('closeForm')">Cancel</button>
        <button type="submit" class="primary">Save Appointment</button>
      </div>
   </form>
  </div>
</div>
</template>

<style scoped>
button.primary { background:#4f46e5; color:#fff; border:none; padding:10px 14px; border-radius:8px; cursor:pointer; }
button.secondary { background:#e25454; color:#fff; border:none; padding:10px 14px; border-radius:8px; cursor:pointer; }
.modal { display:flex; position:fixed; inset:0; background:rgba(2,6,23,0.6); z-index:1000; align-items:center; justify-content:center; }
.modal-card { width:700px; background:#fff; border-radius:14px; padding:18px; box-shadow:0 18px 60px rgba(2,6,23,0.25); }
h2 { margin:0 0 8px 0; font-size:25px; }
.grid { display:grid; grid-template-columns: 1fr 120px; gap:10px; align-items:center; }
label { font-size:20px; color:#334155; }
input, select, textarea { width:90%; padding:8px 10px; border-radius:8px; border:1px solid #e6eef7; background:#fbfdff; }
.actions { display:flex; gap:8px; margin-top:14px; justify-content:flex-end; }
.btn-ghost { background:transparent; border:1px solid #e6eef7; padding:8px 12px; border-radius:10px; cursor:pointer; }
.add-service { background:#10b981; color:white; border:none; padding:8px 10px; border-radius:10px; cursor:pointer; }
.small { font-size:13px; color:#64748b; margin-top:6px; }
.two-cols { display:flex; gap:10px; margin-top:10px; }
.remove-btn { color:#dc2626; border-color:#fca5a5; }

</style>