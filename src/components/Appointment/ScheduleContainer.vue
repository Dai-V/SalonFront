<script setup>
import { onMounted, ref,h ,render, watch} from 'vue'
import AppointmentForm from './AppointmentForm.vue';
import AppointmentEditForm from './AppointmentEditForm.vue';
import {  DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
const TimeSlotHeight = 40

const currentDisplayedDate = ref(new Date()); 
watch(currentDisplayedDate, (newValue) => {
  reload()
});
const resources = ref(null)
const apps = ref(null)
const showAppointmentForm = ref(false)
const showAppointmentEditForm = ref(false)
const appIDEdit = ref(null)
const customerIDEdit = ref(null)
const appStartTime = ref('00:00:00')
const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds 
const formattedDate = ref(new Date(currentDisplayedDate.value - tzoffset).toISOString().slice(0, -1).split('T')[0]); // get correct date

onMounted(() => {
reload()
})
function generateResources() {
  fetch('http://127.0.0.1:8000/api/technicians/?Date='+formattedDate.value, { 
        credentials: 'include'
     }) 
      .then(response =>  {
           if (response.status === 403) {
                throw new Error("Not Authenticated")
            }
            return response.json() 
        })
      .then(data => {
           resources.value = data

        })

       
  } 
function getPosition(time, duration){
    const startHour = parseInt(time.split(':')[0]);
    const startMinute = parseInt(time.split(':')[1]);    
    const startPosition = (startHour * TimeSlotHeight * 4) + (startMinute/15 * TimeSlotHeight); // 40px per 15 minutes
    const eventHeight = (duration / 60) * TimeSlotHeight*4;
    return {
        top: (startPosition + TimeSlotHeight)+"px",
        height: eventHeight+"px"
    }
}
function renderEvents() {
     fetch("http://127.0.0.1:8000/api/appointments/?Date="+formattedDate.value, { 
        credentials: 'include'
     }) 
      .then(response =>  {
           if (response.status === 403) {
                throw new Error("Not Authenticated")
            }
            return response.json() 
        })
      .then(data => {
            apps.value = data
      })

   
}
function reload(){
  formattedDate.value = new Date(currentDisplayedDate.value - tzoffset).toISOString().slice(0, -1).split('T')[0]
  generateResources()
  renderEvents(currentDisplayedDate.value)
}

function openAppointmentForm(i) // 1 i = 15 minutes
{
    let hour = i/4
    let minute = (i%4)*15 
    const date = new Date(); 
    date.setHours(hour, minute, 0, 0); 
    appStartTime.value = date
    showAppointmentForm.value=!showAppointmentForm.value
}
function openAppointmentEditForm(appID,customerID)
{   
    appIDEdit.value = appID
    customerIDEdit.value = customerID
    showAppointmentEditForm.value=!showAppointmentEditForm.value
}
</script>

<template>
<AppointmentForm v-if="showAppointmentForm" @close-form="showAppointmentForm=false" :startTime="appStartTime" :date="formattedDate.slice(0, 10)" :techs="resources" :callReload="reload"/>
<AppointmentEditForm v-if="showAppointmentEditForm" @close-form="showAppointmentEditForm=false" :techs="resources" :appID="appIDEdit" :customerID="customerIDEdit" :callReload="reload"/>

<div class="schedule-container">
    <div class="schedule-header">
        <DatePicker v-model="currentDisplayedDate" is-required />
    </div>
    
    <div class="schedule-grid">
        <div class="time-container">
            <div class="time-column">
            <div class="time-header"> 
            Time 
            </div>
              <div v-for="i in 24" :key="i">
                  <div class="time-slot" v-for="j in 4" :key="j">
                      <div v-if="j===1"> {{ i-1 }}:00</div>
                      <div v-else> {{ i-1 }}:{{ (j-1)*15 }}</div>
                  </div>

              </div>
            </div>
        </div>
      
        <div class="resources-container">
           <div v-for="(resource) in resources" class="resource-column">
                <div class="resource-header"> {{ resource.TechName }} </div>
                <div v-for="i in 24*4" class="time-slot-placeholder" @click="openAppointmentForm(i-1)"> </div> 
                <div v-for="app in apps" @click="openAppointmentEditForm(app.AppID,app.CustomerID)"> 
                    <div v-for="service in app.Services">
                        <div v-if="service.TechID === resource.TechID" class="event" :style="{top: getPosition(service.ServiceStartTime,service.ServiceDuration).top,
                        height: getPosition(service.ServiceStartTime,service.ServiceDuration).height,
                        lineHeight: getPosition(service.ServiceStartTime,service.ServiceDuration).height
                     }">
                     <div v-if="app.AppStatus==='Closed'" class="closedEvent">
                    {{ service.ServiceName }}
                    </div>
                    <div v-else-if="app.AppStatus==='Open'" class="openEvent" >
                    {{ service.ServiceName }}
                    </div>
                    </div>
                    </div>
                </div>
           </div>
        </div>
    </div>
</div>


</template>

<style scoped>
.schedule-container {
    font-family: Arial, sans-serif;
    width:100%;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    border-radius: 10px;
}

.schedule-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #eee;
}

.schedule-grid {
    display: flex;
}

.time-column {
    width: 80px;
    border-right: 1px solid #eee;
    padding: 0px 0;
    text-align: center;
}

.time-container {
    background-color: #e9e9e9;
    padding: 10px 0 0 0;
    text-align: center;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
}
.resource-header {
    background-color: #e9e9e9;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
}
.time-header {
    background-color: #e9e9e9;
    text-align: center;
    font-weight: bold;
    padding-bottom:10px;
    border-bottom: 1px solid #ccc;
}

.time-slot-placeholder:hover {
  background-color: gray
}

.time-slot-placeholder {
  height:40px
}

.time-slot {
    height: 39px; /* Adjust as needed for time resolution */
    line-height: 40px;
    border-bottom: 1px solid #ccc;
}

.resources-container {
    flex-grow: 1;
    display: flex;
}

.resource-column {
    flex: 1;
    border-right: 1px solid #eee;
    position: relative;
}

.resource-column:last-child {
    border-right: none;
}

.resource-header {
    background-color: #e9e9e9;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    border-bottom: 1px solid #ccc;
}

.event {
    position: absolute;
    background-color: #a0c4ff;
    border: 1px solid;
    border-radius: 1px;
    font-size: 1.5em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    text-align: center;
    vertical-align: middle;
    line-height: 160px;   
    width: 100%;
}


.closedEvent {
    background-color: rgb(170, 168, 168);
    border-color:black;
}

.closedEvent:hover,.openEvent:hover{
    background-color:lightgreen;
    border-color:black;
}



.openEvent {
   background-color: #a0c4ff;;
   border-color:green
}

</style>
