<script setup>
import { ref,defineEmits} from 'vue'
const selectOptions = ref()
const selectedOption = ref(null)
const serviceName = ref(null)
const servicePrice= ref(0)
const serviceStartTime = ref(null)
const serviceDuration = ref(0)
const selectedTech = ref(null)

const props = defineProps({
  techs:Array,
  id:Number,
  serviceName:String,
  servicePrice:Number,
  serviceStartTime:String,
  serviceDuration:Number,
  selectedTech:Number,
  selectedOption:String

})



const emit = defineEmits(["emitChanges","removeService"]);


getSavedServices()
function getSavedServices() {
   fetch('http://127.0.0.1:8000/api/savedservices', { 
            method: 'GET',
            credentials: 'include'
     }) 
        .then(response => response.json())
        .then(data => {
          selectOptions.value = data
        })
}


function onOptionChange(){
    for (let i in selectOptions.value)
    if (selectOptions.value[i].ServiceCode === selectedOption.value){
        serviceName.value = selectOptions.value[i].ServiceName
        servicePrice.value =  selectOptions.value[i].ServicePrice
        serviceDuration.value =  selectOptions.value[i].ServiceDuration
    }
        emitChanges()
}

function emitChanges(){
  if (selectedOption.value){
  const service = ref({
    id:props.id,
    code:selectedOption.value,
    name:serviceName.value,
    price:servicePrice.value,
    duration:serviceDuration.value,
    start:serviceStartTime.value,
    tech:selectedTech.value
});

  emit('emitChanges',service.value)
}
}

function onInit(){
    selectedOption.value = props.selectedOption
    serviceName.value = props.serviceName
    serviceDuration.value = props.serviceDuration
    servicePrice.value = props.servicePrice
    serviceStartTime.value = props.serviceStartTime
    selectedTech.value = props.selectedTech
    emitChanges()
}

function removeService(){
    emit('removeService',props.id)
}


onInit()
</script>
<template>
<div class="service-row">
    <select v-model="selectedTech" @change="emitChanges()" required>
    <option v-for="option in props.techs"  :value="option.TechID">
        {{  option.TechName }}
    </option>
    </select>
    <select v-model="selectedOption" @change="onOptionChange()" required>
    <option v-for="option in selectOptions" :value="option.ServiceCode">
        {{ option.ServiceCode }}
    </option>
     </select>
    <input type="text" placeholder="Name" v-model="serviceName" @change="emitChanges()" required>
    <input type="number"  placeholder="Price"   v-model="servicePrice" @change="emitChanges()" required >
    <input type="time"  placeholder ="Start"  v-model="serviceStartTime"@change="emitChanges()" required>
    <input type="number"  placeholder="Duration"   v-model="serviceDuration"@change="emitChanges()" required>
    <button type="button" @click="removeService()" class="btn-ghost remove-btn"> ✕ </button>
</div>
</template>

<style scoped>
.service-row { display:flex; gap:8px;  padding-bottom: 8px; }
.service-row input { flex:1;width:70%; padding:8px 10px; border-radius:8px; border:1px solid #e6eef7; background:#fbfdff;}
.service-row select { flex:1;width:70%; padding:8px 10px; border-radius:8px; border:1px solid #e6eef7; background:#fbfdff;}

</style>