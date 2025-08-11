<script setup>
import { ref,defineEmits} from 'vue'
const selectOptions = ref(null)
const selectedOption = ref(null)
const serviceName = ref(null)
const servicePrice= ref(0)
const serviceStartTime = ref(null)
const serviceDuration = ref(0)
const selectedTech = ref(null)

const props = defineProps({
  startTime:Date,
  techs:Array,
  id:Number

})



const emit = defineEmits(["emitChanges"]);


getSavedServices()
function getSavedServices() {
   fetch('http://127.0.0.1:8000/api/savedservices', { 
            method: 'GET',
            credentials: 'include'
     }) 
        .then(response => response.json())
        .then(data => {
          selectOptions.value =  data
        })
}


function onOptionChange(){
    serviceName.value = selectedOption.value.ServiceName
    servicePrice.value =  selectedOption.value.ServicePrice
    serviceDuration.value =  selectedOption.value.ServiceDuration
    let hour = props.startTime.getHours()
    let minute = props.startTime.getMinutes()
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    serviceStartTime.value = hour + ":" + minute
    emitChanges()
}

function emitChanges(){
  if (selectedOption.value){

  const service = ref({
    id:props.id,
    code:selectedOption.value.ServiceCode,
    name:serviceName.value,
    price:servicePrice.value,
    duration:serviceDuration.value,
    start:serviceStartTime.value,
    tech:selectedTech.value
});
  emit('emitChanges',service.value)
}
}
</script>
<template>
<div class="service-row">
    <select v-model="selectedTech" @change="emitChanges()">
    <option v-for="option in props.techs"  :value="option.TechID">
        {{  option.TechName }}
    </option>
    </select>
    <select v-model="selectedOption" @change="onOptionChange();emitChanges()">
    <option v-for="option in selectOptions" :value="option">
        {{ option.ServiceCode }}
    </option>
     </select>
    <input type="text" placeholder="Name" v-model="serviceName" @change="emitChanges()">
    <input type="number"  placeholder="Price"   v-model="servicePrice" @change="emitChanges()" >
    <input type="time"  placeholder ="Start"  v-model="serviceStartTime"@change="emitChanges()" >
    <input type="number"  placeholder="Duration"   v-model="serviceDuration"@change="emitChanges()">
    <!-- <button type="button" onclick="removeService(${serviceCount})" class="btn-ghost remove-btn"> ✕ </button> -->
</div>
</template>

<style scoped>
.service-row { display:flex; gap:8px;  padding-bottom: 8px; }
.service-row input { flex:1;width:70%; padding:8px 10px; border-radius:8px; border:1px solid #e6eef7; background:#fbfdff;}
.service-row select { flex:1;width:70%; padding:8px 10px; border-radius:8px; border:1px solid #e6eef7; background:#fbfdff;}

</style>