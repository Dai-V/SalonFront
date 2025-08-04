const currentDateElement = document.getElementById('currentDate');
const prevDayButton = document.getElementById('prevDay');
const nextDayButton = document.getElementById('nextDay');
var token = document.getElementsByName("csrfToken").value;
const TimeSlotHeight = 160 // per hour, 40 per 15 minutes

let currentDisplayedDate = new Date(); 
// Initialize with today's date



function generateTimeSlots() {
    timeColumn = document.querySelector('.time-column');
    timeColumn.innerHTML = '';
    const timeSlotDiv = document.createElement('div');
    timeSlotDiv.classList.add('time-header');
    timeSlotDiv.textContent = `Time`;
    timeColumn.appendChild(timeSlotDiv);
    for (let i = 0; i < 24; i++) {
        const hour = String(i).padStart(2, '0'); // 2: 00
        for (let j = 0; j < 4; j++){
        const timeSlotDiv = document.createElement('div');
        timeSlotDiv.classList.add('time-slot');
        if (j == 0)
            timeSlotDiv.textContent = `${hour}:00`;
        else  
            timeSlotDiv.textContent = `${hour}:${j*15}`;

        timeColumn.appendChild(timeSlotDiv);
        }
    }
}

function generateResources() {
    resourcesContainer = document.getElementById('resourcesContainer');
    resourcesContainer.innerHTML = '';
      $.ajax({
        url: "http://127.0.0.1:8000/api/technicians/",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" ,
            "X-CSRF-Token": token 
        },
        success: function (data) {
            for (const tech in data) {
            console.log(data[tech])
            const resourceColumn = document.createElement('div');
            resourceColumn.classList.add('resource-column');
            resourceColumn.setAttribute('id', data[tech].TechID);

            const resourceHeader = document.createElement('div');
            resourceHeader.classList.add('resource-header');
            resourceHeader.textContent = data[tech].TechName;
            resourceColumn.appendChild(resourceHeader);
            
            for (let i = 0; i < 24; i++) {
                const timeSlotDiv = document.createElement('div');
                timeSlotDiv.classList.add('time-slot-placeholder'); // Placeholder for event positioning
                timeSlotDiv.style.height = '40px'; // Match time-slot height
                resourceColumn.appendChild(timeSlotDiv);
            }

        resourcesContainer.appendChild(resourceColumn);
        updateSchedule(currentDisplayedDate)
        }},
        error: function (data) {
            failure(data);
        }   
    });
    

        
    };



function renderEvents(date) {
    // Clear existing events
    document.querySelectorAll('.event').forEach(eventEl => eventEl.remove());

    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    formattedDate = new Date(date - tzoffset).toISOString().slice(0, -1).split('T')[0];
    
    console.log(formattedDate)  // => '2015-01-26T06:40:36.181'

    $.ajax({
        url: "http://127.0.0.1:8000/api/appointments/?Date="+formattedDate,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" ,
            "X-CSRF-Token": token 
        },
        success: function (data) {
            for (const app in data) {
                console.log(data[app])
                for (const service in data[app].Services){
                    schedule = data[app].Services[service]
                    const resourceColumn = document.querySelector(`.resource-column[id="${schedule.TechID}"]`)
                     if (resourceColumn) {
                        console.log("Damn")
                        const eventDiv = document.createElement('div');
                        eventDiv.classList.add('event');
                        eventDiv.textContent = schedule['ServiceName'];
                        const startHour = parseInt(schedule['ServiceStartTime'].split(':')[0]);
                        const startMinute = parseInt(schedule['ServiceStartTime'].split(':')[1]);
                        console.log(startHour)
    
                        const startPosition = (startHour * TimeSlotHeight) + (startMinute / 15 * TimeSlotHeight); // 40px per 15 minutes
                        const durationInMinutes = schedule['ServiceDuration']
                        const eventHeight = (durationInMinutes / 60) * TimeSlotHeight;
                        eventDiv.style.top = `${startPosition + 40}px`; // Adjust for header height
                        eventDiv.style.height = `${eventHeight}px`;
                        eventDiv.style.lineHeight = `${eventHeight}px`;
                        resourceColumn.appendChild(eventDiv);
                     }
                }
        
        }},
        error: function (data) {
            failure(data);
        }   
    });
    // 
    //     const resourceColumn = document.querySelector(`.resource-column[id="${event.resourceId}"]`);
    //     if (resourceColumn) {
    //         const eventDiv = document.createElement('div');
    //         eventDiv.classList.add('event');
    //         eventDiv.textContent = event.title;

    //         // Calculate position and height based on start/end times
    //         const startHour = parseInt(event.start.split(':')[0]);
    //         const startMinute = parseInt(event.start.split(':')[1]);
    //         const endHour = parseInt(event.end.split(':')[0]);
    //         const endMinute = parseInt(event.end.split(':')[1]);

    //         const startPosition = (startHour * 50) + (startMinute / 60 * 50); // 50px per hour
    //         const durationInMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    //         const eventHeight = (durationInMinutes / 60) * 50;

    //         eventDiv.style.top = `${startPosition + 40}px`; // Adjust for header height
    //         eventDiv.style.height = `${eventHeight}px`;

    //         resourceColumn.appendChild(eventDiv);
    //     }
    // });
}

function updateSchedule(date) {
    currentDateElement.textContent = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    renderEvents(date);
}

// Navigation
prevDayButton.addEventListener('click', () => {
    currentDisplayedDate.setDate(currentDisplayedDate.getDate() - 1);
    updateSchedule(currentDisplayedDate);
});

nextDayButton.addEventListener('click', () => {
    currentDisplayedDate.setDate(currentDisplayedDate.getDate() + 1);
    updateSchedule(currentDisplayedDate);
});

// Initial load
generateTimeSlots();
generateResources();

