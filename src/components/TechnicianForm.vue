<script setup>
import {ref,defineEmits} from 'vue'
import ServiceRow from './ServiceRow.vue'
import { useAuthStore } from '../stores/auth'

const emit = defineEmits(['closeForm'])
const props = defineProps({
callReload:Function,

})
const authStore = useAuthStore();
const techName = ref('')
const techEmail = ref('')
const techPhone = ref('')
const techInfo = ref('')
const nameError = ref('')
const emailError = ref('')
const infoError = ref('')
const phoneError = ref('')



function appSubmit() {
    const postData = {
        TechName: techName.value,
        TechEmail: techEmail.value,
        TechPhone: techPhone.value,
        techInfo: techInfo.value
    }
    fetch('http://127.0.0.1:8000/api/technicians/', { 
      method: 'POST',
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
        nameError.value = data.TechName,
        emailError.value = data.TechEmail,
        phoneError.value = data.TechPhone,
        infoError.value = data.TechInfo
      })
      .catch(error => {
        console.error('Error posting custom data:', error);
    });
}

</script>
<template>
<div id="bookingModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="modal-card">
    <h2 id="modalTitle">Add Technician</h2>
    <form id="bookingForm" @submit.prevent="appSubmit()">
        <div>
          <label>Name</label>
          <input v-model="techName" type="text" required>
          <p class="error"> {{ nameError }} </p>
        </div>
   

        <div>
          <label>Email</label>
          <input v-model="techEmail" type="email" >
          <p class="error"> {{ emailError }} </p>
        </div>
        <div>
           <label >Phone</label>
          <input type="number" v-model="techPhone"> 
          <p class="error"> {{ phoneError }} </p>
        </div>
        <div>
      <label>Comment</label>
      <input v-model="techInfo" ></input>
      <p class="error"> {{ infoError }} </p>
      </div>


      <div class="actions">
        <button type="submit" class="primary">Save</button>
        <button type="button" class="btn-ghost" v-on:click="$emit('closeForm')">Cancel</button>
      </div>
   </form>
  </div>
</div>
</template>

<style scoped>
button.primary { background:#10b981; color:#fff; border:none; padding:10px 14px; border-radius:8px; cursor:pointer; }
.modal { display:flex; position:fixed; inset:0; background:rgba(2,6,23,0.6); z-index:1000; align-items:center; justify-content:center; }
.modal-card { width:600px; background:#fff; border-radius:14px; padding:18px; box-shadow:0 18px 60px rgba(2,6,23,0.25); }
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
</style>