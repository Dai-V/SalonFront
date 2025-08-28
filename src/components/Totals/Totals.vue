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
                text: '',
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
                text: '',
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
const configTotalsByPaymentType = ref({
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
                text: '',
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
]);

const datasetTotalsByPaymentType = ref([
]);
const techServices = ref([])
const totalsByServices = ref([])
const totalsByPaymentType = ref([])
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
                name: techServices.value[i].TechName + " - Services: " + techServices.value[i].TotalServices + " - Earnings",
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
        totalsByServices.value = total.value.TotalsByServices
        datasetTotalsByServices.value = []
        for (var i in totalsByServices.value) {
            datasetTotalsByServices.value.push({
                name: totalsByServices.value[i].ServiceName + " - Services: " + totalsByServices.value[i].TotalServices + " - Earnings",
                value: totalsByServices.value[i].TotalPayments,
                color: '#ff6400',
                prefix: '',
                suffix: '$',
                rounding: 1
            })
        }
        if (datasetTotalsByServices.value.length === 0) {
            datasetTotalsByServices.value.push({
                name: "No service completed yet",
                value: 0,
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

       totalsByPaymentType.value = total.value.TotalEarningsByPaymentType
       datasetTotalsByPaymentType.value = []
        for (var i in totalsByPaymentType.value) {
            datasetTotalsByPaymentType.value.push({
                name: totalsByPaymentType.value[i].PaymentType,
                value: totalsByPaymentType.value[i].TotalPayments,
                color: '#ff6400',
                prefix: '',
                suffix: '$',
                rounding: 1
            })
        }
        if (datasetTotalsByPaymentType.value.length === 0) {
            datasetTotalsByPaymentType.value.push({
                name: "No service completed yet",
                value: 0,
                color: '#ff6400',
                prefix: '',
                suffix: '$',
                rounding: 1
               
            })
        }
        if (total.value.TotalEarnings>0)
        configTotalsByPaymentType.value.style.layout.target = total.value.TotalEarnings
        else {
              configTotalsByPaymentType.value.style.layout.target=100
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
               <VueUiSparkbar v-if="datasetServicesByTechnicians!==undefined && datasetServicesByTechnicians.length!==0"
                    :config="configServicesByTechnicians"
                    :dataset="datasetServicesByTechnicians"
                />

            </div>
        </div>
        
        <div class="column-right">
             <div v-if="datasetTotalsByServices!==undefined && datasetTotalsByServices.length!==0" >
                <VueUiSparkbar
                    :config="configTotalsByServices"
                    :dataset="datasetTotalsByServices"
                />
            </div>
        </div>
    </div>

         <div class="two-column-layout">
        <div class="column-left">
            <div >
               <VueUiSparkbar v-if="datasetTotalsByPaymentType!==undefined && datasetTotalsByPaymentType.length!==0"
                    :config="configTotalsByPaymentType"
                    :dataset="datasetTotalsByPaymentType"
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
        padding: 15px;
        border: 1px solid #ccc; 
        border-radius: 10px;
        margin-bottom: 20px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    .two-column-layout {
        
        display: grid;
        grid-template-columns: 1fr 1fr; /* Creates two equal-width columns */
        gap: 20px; /* Adds space between columns (optional) */
        border-radius: 10px;
    }

    .column-left,
    .column-right {
         border: 1px solid #ccc; 
        border-radius: 10px;
        padding: 20px;
        background-color: #f0f0f0;
        margin-bottom:20px;
    }
</style>