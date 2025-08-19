<script setup>
import { onMounted, ref,watch } from "vue";
import { useAuthStore } from "../../stores/auth";
import { VueUiSparkbar } from "vue-data-ui";
import "vue-data-ui/style.css"; 
import {  DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
const authStore = useAuthStore();
const total = ref([])
const currentDisplayedDate1 = ref(new Date()); 
const currentDisplayedDate2 = ref(new Date()); 
const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds 
const formattedDate1 = ref(new Date(currentDisplayedDate1.value - tzoffset).toISOString().slice(0, -1).split('T')[0]); // get correct date
const formattedDate2 = ref(new Date(currentDisplayedDate2.value - tzoffset).toISOString().slice(0, -1).split('T')[0]); // get correct date

watch(currentDisplayedDate1, (newValue) => {
currentDisplayedDate2.value = currentDisplayedDate1.value
  reload()
});
watch(currentDisplayedDate2, (newValue) => {
  reload()
});

function reload(){
const formattedDate1 = ref(new Date(currentDisplayedDate1.value - tzoffset).toISOString().slice(0, -1).split('T')[0]); // get correct date
const formattedDate2 = ref(new Date(currentDisplayedDate2.value - tzoffset).toISOString().slice(0, -1).split('T')[0]); // get correct date
  getTotals(formattedDate1.value,formattedDate2.value)
}

const configServicesByTechnicians = ref({
        theme: '',
        customPalette: [],
        style: {
            fontFamily: 'inherit',
            backgroundColor: '#f0f0f0',
            animation: {
                show: true,
                animationFrames: 20
            },
            layout: {
                independant: true,
                percentage: false,
                target: 0,
                showTargetValue: false,
                targetValueText: ''
            },
            gutter: {
                backgroundColor: '#e1e5e8ff',
                opacity: 100
            },
            bar: {
                gradient: {
                    show: true,
                    intensity: 40,
                    underlayerColor: '#FFFFFF'
                }
            },
            labels: {
                fontSize: 16,
                name: {
                    position: 'top-left',
                    width: '100%',
                    color: '#1A1A1Aff',
                    bold: true
                },
                value: {
                    show: true,
                    bold: true
                }
            },
            title: {
                text: 'Totals by Technicians',
                color: '#1A1A1Aff',
                fontSize: 20,
                bold: true,
                textAlign: 'center',
                margin: '0 0 6px 0',
                subtitle: {
                    color: '#CCCCCCff',
                    text: '',
                    fontSize: 16,
                    bold: false
                }
            },
            gap: 4
        }
    });
const configTotalsByServices = ref({
        theme: '',
        customPalette: [],
        style: {
            fontFamily: 'inherit',
            backgroundColor: '#f0f0f0',
            animation: {
                show: true,
                animationFrames: 20
            },
            layout: {
                independant: true,
                percentage: false,
                target: 0,
                showTargetValue: false,
                targetValueText: ''
            },
            gutter: {
                backgroundColor: '#e1e5e8ff',
                opacity: 100
            },
            bar: {
                gradient: {
                    show: true,
                    intensity: 40,
                    underlayerColor: '#FFFFFF'
                }
            },
            labels: {
                fontSize: 16,
                name: {
                    position: 'top-left',
                    width: '100%',
                    color: '#1A1A1Aff',
                    bold: true
                },
                value: {
                    show: true,
                    bold: true
                }
            },
            title: {
                text: 'Totals by Services',
                color: '#1A1A1Aff',
                fontSize: 20,
                bold: true,
                textAlign: 'center',
                margin: '0 0 6px 0',
                subtitle: {
                    color: '#CCCCCCff',
                    text: '',
                    fontSize: 16,
                    bold: false
                }
            },
            gap: 4
        }
    });
const datasetServicesByTechnicians = ref([
    {
        name: 'No Technician Scheduled for this date range',
        value: 0,
        color: '#6376DD',
        prefix: '',
        suffix: '',
        rounding: 1,
    },
]);

const datasetTotalsByServices = ref([
     {
        name: 'No service yet',
        value: '',
        color: '#6376DD',
        prefix: '',
        suffix: '',
        rounding: 1,
    },
]);
const techServices = ref([])
const totalByServices = ref([])
function getTotals(StartDate,EndDate) {
     fetch('http://127.0.0.1:8000/api/totals/?StartDate=' +StartDate+'&'+'EndDate='+EndDate, { 
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
         'X-CSRFTOKEN': authStore.csrftoken
      },
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        data = JSON.parse(data)
        total.value = data

        // get Totals By Technicians
        techServices.value = total.value.TotalServicesByTechnicians
        datasetServicesByTechnicians.value = []
        for (var i in techServices.value) {
            datasetServicesByTechnicians.value.push({
                name: techServices.value[i].TechName + " - Services: " + techServices.value[i].TotalServices + " - Earnings: ",
                value: techServices.value[i].TotalPayments,
                color: '#ff6400',
                prefix: '',
                suffix: '$',
                rounding: 1
            })
        }
        if (total.value.TotalEarnings>0)
        configServicesByTechnicians.value.style.layout.target = total.value.TotalEarnings
        else {
              configServicesByTechnicians.value.style.layout.target=100
        }

        // get Totals By Services
        totalByServices.value = total.value.TotalsByServices
        
        console.log(totalByServices.value)
        for (var i in totalByServices.value) {
            datasetTotalsByServices.value = []
            datasetTotalsByServices.value.push({
                name: totalByServices.value[i].ServiceName + " - Services: " + totalByServices.value[i].TotalServices + " - Earnings: ",
                value: totalByServices.value[i].TotalPayments,
                color: '#ff6400',
                prefix: '',
                suffix: '$',
                rounding: 1
            })
        }
         if (total.value.TotalEarnings>0)
        configTotalsByServices.value.style.layout.target = total.value.TotalEarnings
        else {
              configTotalsByServices.value.style.layout.target=100
        }

      

      })
      .catch(error => {
        console.error('Error posting custom data:', error);

      });
    }
getTotals(formattedDate1.value,formattedDate2.value)
</script>

<template>
   <div class="header">
   <DatePicker v-model="currentDisplayedDate1" style="margin-right:20px" is-required />
   <DatePicker v-model="currentDisplayedDate2" is-required :min-date='currentDisplayedDate1'/>
   </div>
      <div class="two-column-layout">
        <div class="column-left">
            <div >
                <VueUiSparkbar
                    :config="configServicesByTechnicians"
                    :dataset="datasetServicesByTechnicians"
                />
            </div>
        </div>
        
        <div class="column-right">
        </div>
    </div>
        <div class="two-column-layout">
        <div class="column-left">
            <div >
                <VueUiSparkbar
                v-if ="datasetTotalsByServices!==[]"
                    :config="configTotalsByServices"
                    :dataset="datasetTotalsByServices"
                />
            </div>
        </div>
        
        <div class="column-right">
        </div>
    </div>
   
</template>

<style scoped>
.header {
        width: 100%;
        background-color: #f0f0f0;
        padding: 20px;
        border: 10px ;
        border-color:#f1f1f1;
        border-radius: 10px;
        margin-bottom: 20px;
    }

    .two-column-layout {
        display: grid;
        grid-template-columns: 1fr 1fr; /* Creates two equal-width columns */
        gap: 20px; /* Adds space between columns (optional) */
        border-radius: 10px;
    }

    .column-left,
    .column-right {
         border-radius: 10px;
        padding: 20px;
        background-color: #f0f0f0;
        margin-bottom:20px;
    }
</style>