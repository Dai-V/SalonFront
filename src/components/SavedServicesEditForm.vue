<script setup>
import {ref,defineEmits} from 'vue'
import { useAuthStore } from '../stores/auth'
import { errorMessages } from 'vue/compiler-sfc';

const emit = defineEmits(['closeForm'])
const props = defineProps({
 ServiceID:Number,
 callReload:Function,

})
const authStore = useAuthStore();
const serviceName = ref('')
const servicePrice = ref('')
const serviceDuration = ref('')
const serviceCode = ref('')
const serviceDescription = ref('')
const nameError = ref('')
const priceError = ref('')
const durationError = ref('')
const codeError = ref('')
const descriptionError = ref('')
const errMsg = ref('')

function getSavedService(){
    fetch('http://127.0.0.1:8000/api/savedservices/'+props.ServiceID+'/', { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
         'X-CSRFTOKEN': authStore.csrftoken
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        serviceCode.value = data.ServiceCode,
        serviceName.value = data.ServiceName,
        servicePrice.value = data.ServicePrice,
        serviceDuration.value = data.ServiceDuration,
        serviceDescription.value = data.ServiceDescription
      })
      .catch(error => {
        console.error(error);
    });
}
function appSubmit() {
    const postData = {
        ServiceID: props.ServiceID,
        ServiceName: serviceName.value,
        ServicePrice: servicePrice.value,
        ServiceDuration: serviceDuration.value,
        ServiceCode: serviceCode.value,
        ServiceDescription : serviceDescription.value
    }
    fetch('http://127.0.0.1:8000/api/savedservices/'+props.ServiceID+'/', { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
         'X-CSRFTOKEN': authStore.csrftoken
      },
      credentials: 'include',
      body: JSON.stringify(postData) 
    })
      .then(response => {
        if (response.ok){
          emit('CloseForm')
          props.callReload()
        } 
        return  response.json()
      })
      .then(data => {
        console.log('Response from server:', data);
        codeError.value = data.ServiceCode,
        nameError.value = data.ServiceName,
        priceError.value = data.ServicePrice,
        durationError.value = data.ServiceDuration,
        descriptionError.value = data.ServiceDescription
      })
      .catch(error => {
        console.error('Error posting custom data:', error);
    });
}

function deleteSavedService() {
    fetch('http://127.0.0.1:8000/api/savedservices/'+props.ServiceID+'/', { 
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
         'X-CSRFTOKEN': authStore.csrftoken
      },
      credentials: 'include',
    })
      .then(response => {
        if (response.ok){
          emit('CloseForm')
          props.callReload()
        } 
        return  response.json()
      })
      .then(data => {
        console.log('Response from server:', data);
      })
      .catch(error => {
        console.error('Error posting custom data:', error);
    });
}
getSavedService()
</script>
<template>
<div id="bookingModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="modal-card">
    <h2 id="modalTitle">Add Service</h2> 
    <form id="bookingForm" @submit.prevent="appSubmit()">
      <div class="two-cols">
        <div>
          <label>Code</label> 
          <input v-model="serviceCode" type="text" required></input>
          <p class="error"> {{ codeError}} </p>
        </div>
        <div>
         </div>
   
      </div>

        <div class="two-cols">
        <div>
          <label>Name</label> 
          <input v-model="serviceName" type="text" required></input>
           <p class="error"> {{ nameError }} </p>
        </div>
        <div>

           </div>
   
      </div>

      <div class="two-cols">
        <div>
            <label>Price</label> 
      <input type="number" v-model="servicePrice" placeholder="0" ></input>
      <p class="error"> {{ priceError }} </p>
        </div>
        <div>

           </div>
   
      </div>

  
      
      <div class="two-cols">
        <div>
        <label> Duration (Minutes)</label> 
          <input type="number" v-model="serviceDuration" placeholder="0"> </input>
          <p class="error"> {{ durationError }} </p>
        </div>
        <div>

        </div>
      </div>

          <div class="two-cols">
        <div>
        <label> Description </label> 
          <textarea  v-model="serviceDescription" rows="2"> </textarea>
          <p class="error"> {{ descriptionError }} </p>
        </div>
        <div>

        </div>
      </div>

     

      <div class="actions">
        <button type="submit" class="primary">Save</button>
        <button type="button" class="btn-ghost" v-on:click="$emit('closeForm')">Cancel</button>
        <button type="button" class="delete" @click="deleteSavedService()">Delete</button>
      </div>
      
      
   
   </form>
  </div>
</div>
</template>

<style scoped>
button.primary { background:#10b981; color:#fff; border:none; padding:10px 14px; border-radius:8px; cursor:pointer; }
button.delete { background:#970101; color:#fff; border:none; padding:10px 14px; border-radius:8px; cursor:pointer;margin-left: auto;} 
.modal { display:flex; position:fixed; inset:0; background:rgba(2,6,23,0.6); z-index:1000; align-items:center; justify-content:center; }
.modal-card { width:600px; background:#fff; border-radius:14px; padding:18px; box-shadow:0 18px 60px rgba(2,6,23,0.25); }
h2 { margin:0 0 8px 0; font-size:25px; }
.grid { display:grid; grid-template-columns: 1fr 120px; gap:10px; align-items:center; }
label { display:block;width:100%; font-size:18px; color:#334155; }
input, select, textarea { display:inline-block;width:30%; padding:8px 10px 10px 10px; border-radius:8px; border:1px solid #e6eef7; background:#f0f0f0; }
.actions { display:flex; gap:8px; margin-top:14px;   justify-content: flex-end;   }
.del-actions { display:flex; gap:8px; margin-top:14px;  }
.btn-ghost { background:transparent; border:1px solid #e6eef7; padding:8px 12px; border-radius:10px; cursor:pointer; }
.add-btn { background:#10b981; color:white; border:none; padding:8px 10px; border-radius:10px; cursor:pointer; }
.small { font-size:13px; color:#64748b; margin-top:6px; }

.remove-btn { color:#dc2626; border-color:#fca5a5; }
.error {color:red; padding:8px 10px 10px 10px; display:inline; width: 40%;}

</style>