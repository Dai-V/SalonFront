<script setup>
import { onMounted, ref,h } from 'vue'
import LoginForm from './LoginForm.vue';
import AppointmentForm from './AppointmentForm.vue';



const TimeSlotHeight = 40

let currentDisplayedDate = new Date(); 
let currentDate = ref(null)
var resources = ref(null)
var apps = ref(null)


onMounted(() => {
 reload()
})

function generateResources() {
  fetch('http://127.0.0.1:8000/api/technicians/', { 
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
           console.log(resources.value)

        })

       
  }
        
function getPosition(time, duration){
    const startHour = parseInt(time.split(':')[0]);
    const startMinute = parseInt(time.split(':')[1]);    
    const startPosition = (startHour * TimeSlotHeight * 4) + (startMinute * TimeSlotHeight); // 40px per 15 minutes
    const eventHeight = (duration / 60) * TimeSlotHeight*4;
    return {
        top: (startPosition + TimeSlotHeight)+"px",
        height: eventHeight+"px"
    }
}




function renderEvents(date) {
    // // Clear existing events
    // document.querySelectorAll('.event').forEach(eventEl => eventEl.remove());

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var formattedDate = new Date(date - tzoffset).toISOString().slice(0, -1).split('T')[0];
    
    console.log(formattedDate)  // => '2015-01-26T06:40:36.181'
     fetch("http://127.0.0.1:8000/api/appointments/?Date="+formattedDate, { 
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

function updateSchedule(date) {
    currentDate.value = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    renderEvents(date);
}

// Navigation
function prevDayClick(event){
    currentDisplayedDate.setDate(currentDisplayedDate.getDate() - 1);
     reload()

}

function nextDayClick(event){
    currentDisplayedDate.setDate(currentDisplayedDate.getDate() + 1);
    reload()
}

function reload(){
  generateResources()
  updateSchedule(currentDisplayedDate)
}

</script>

<template>
<LoginForm />
<AppointmentForm />

<div class="schedule-container">
    <div class="schedule-header">
        <h2>Daily Schedule - <span> {{ currentDate }}</span></h2>
        <div class="navigation-buttons">
            <button id="prevDay" @click="prevDayClick">Previous Day</button>
            <button id="nextDay" @click="nextDayClick">Next Day</button>
        </div>
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
                <div v-for="i in 24*4" class="time-slot-placeholder" > </div> 
                <div v-for="app in apps" > 
                    <div v-for="service in app.Services">
                        <div v-if="service.TechID === resource.TechID" class="event" :style="{top: getPosition(service.ServiceStartTime,service.ServiceDuration).top,
                        height: getPosition(service.ServiceStartTime,service.ServiceDuration).height,
                        lineHeight: getPosition(service.ServiceStartTime,service.ServiceDuration).height
                     }">
                    {{ service.ServiceName }}
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
    max-width: 1200px;
    margin: 20px auto;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
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
    border: 1px solid #6a9eff;
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

.event:hover {
  background-color: green
}

</style>
