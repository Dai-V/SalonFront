<script setup>
import {ref} from 'vue'
let serviceCount = 0

const serviceRow = ref('')
function openModal() {
  bookingModal.style.display = 'flex';
  addService(); 
}

function closeModal() {
  bookingModal.style.display = 'none';
}

function addService() {

  serviceRow.value +=`
  <div class="service-row">
    <input class="service-input" type="text" name="ServiceName_${serviceCount}" placeholder="Service Name"  required>
    <input type="text" name="ServiceCode_${serviceCount}" placeholder="Code" >
    <input type="number" step="0.01" name="ServicePrice_${serviceCount}" placeholder="Price" >
    <input type="time" name="ServiceStartTime_${serviceCount}" >
    <button type="button" onclick="removeService(${serviceCount})" class="btn-ghost remove-btn"> ✕ </button>
  </div>
  `;

  serviceCount++;
}

// document.getElementById('bookingForm').addEventListener('submit', function(e) {
//   e.preventDefault();

//   const formData = new FormData(this);
//   const appointment = {
//     AppDate: formData.get('AppDate'),
//     AppStatus: formData.get('AppStatus'),
//     AppTotal: parseFloat(formData.get('AppTotal')),
//     AppComment: formData.get('AppComment'),
//     PaymentType: formData.get('PaymentType'),
//     Services: []
//   };

//   for (let i = 0; i < serviceCount; i++) {
//     if (formData.get(`ServiceName_${i}`)) {
//       appointment.Services.push({
//         ServiceName: formData.get(`ServiceName_${i}`),
//         ServiceCode: formData.get(`ServiceCode_${i}`),
//         ServicePrice: parseFloat(formData.get(`ServicePrice_${i}`)),
//         ServiceStartTime: formData.get(`ServiceStartTime_${i}`)
//       });
//     }
//   }

//   console.log(JSON.stringify(appointment, null, 2));
//   closeModal();
// });


</script>

<template>
<p style="margin-top:14px;"><button class="primary" v-on:click="openModal()">Book Appointment</button></p>
<div id="bookingModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="modal-card">
    <h2 id="modalTitle">Book Appointment</h2>
    <form id="bookingForm" onsubmit="handleSubmit(event)">
      <div class="grid">
        <div>
          <label for="AppDate">Date</label>
          <input type="date" id="AppDate" name="AppDate" required>
        </div>
        <div>
          <label for="AppStatus">Status</label>
          <select id="AppStatus" name="AppStatus">
            <option>Open</option>
            <option>Closed</option>
          </select>
        </div>
      </div>

      <div class="two-cols">
        <div>
          <label for="AppTotal">Total</label>
          <input type="number" step="0.01" id="AppTotal" name="AppTotal" required placeholder="131.00">
        </div>
        <div>
          <label for="PaymentType">Payment</label>
          <select id="PaymentType" name="PaymentType">
            <option>Cash</option>
            <option>Visa</option>
            <option>Mastercard</option>
          </select>
        </div>
      </div>

      <label for="AppComment">Comment</label>
      <textarea id="AppComment" name="AppComment" rows="2"></textarea>

      <div class="services">
        <h4>Services</h4>
        <div v-html="serviceRow" id="servicesContainer"></div>
            <!-- <div class="service-row">
    <input type="text" name="ServiceName_${serviceCount}" placeholder="Service Name"  required>
    <input type="text" name="ServiceCode_${serviceCount}" placeholder="Code" >
    <input type="number" step="0.01" name="ServicePrice_${serviceCount}" placeholder="Price" >
    <input type="time" name="ServiceStartTime_${serviceCount}" >
    <button type="button" onclick="removeService(${serviceCount})" class="btn-ghost remove-btn"> ✕ </button> -->
       <button type="button" class="add-service" v-on:click="addService()">+ Add Service</button>
          
      </div>

      <div class="actions">
        <button type="button" class="btn-ghost" v-on:click="closeModal()">Cancel</button>
        <button type="submit" class="primary">Save Appointment</button>
      </div>
   </form>
  </div>
</div>
</template>

<style scoped>
button.primary { background:#4f46e5; color:#fff; border:none; padding:10px 14px; border-radius:8px; cursor:pointer; }
.modal { display:none; position:fixed; inset:0; background:rgba(2,6,23,0.6); z-index:1000; align-items:center; justify-content:center; }
.modal-card { width:520px; background:#fff; border-radius:14px; padding:18px; box-shadow:0 18px 60px rgba(2,6,23,0.25); }
h2 { margin:0 0 8px 0; font-size:20px; }
.grid { display:grid; grid-template-columns: 1fr 120px; gap:10px; align-items:center; }
label { font-size:13px; color:#334155; }
input, select, textarea { width:90%; padding:8px 10px; border-radius:8px; border:1px solid #e6eef7; background:#fbfdff; }
:deep(.services) { margin-top:12px; }
:deep(.service-row) { display:flex; gap:8px;  padding-bottom: 8px; }
:deep(.service-row input) { flex:1;width:90%; padding:8px 10px; border-radius:8px; border:1px solid #e6eef7; background:#fbfdff;}
.actions { display:flex; gap:8px; margin-top:14px; justify-content:flex-end; }
.btn-ghost { background:transparent; border:1px solid #e6eef7; padding:8px 12px; border-radius:10px; cursor:pointer; }
.add-service { background:#10b981; color:white; border:none; padding:8px 10px; border-radius:10px; cursor:pointer; }
.small { font-size:13px; color:#64748b; margin-top:6px; }
.two-cols { display:flex; gap:10px; margin-top:10px; }
.remove-btn { color:#dc2626; border-color:#fca5a5; }

</style>