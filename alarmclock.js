document.addEventListener('DOMContentLoaded', () => {
    const clockElement = document.getElementById('currenttime');
    const setAlarmButton = document.getElementById('setAlarmButton');
    const alarmList = document.getElementById('alarmList');

    let alarms = [];

    function DisplayTime() {
        let newtime = new Date();
        let hr = newtime.getHours();
        let min = newtime.getMinutes();
        let sec = newtime.getSeconds();
        let ante_postmeridiem = "AM";

        if (hr >= 12) {
            if (hr > 12) hr -= 12;
            ante_postmeridiem = "PM";
        } else if (hr == 0) {
            hr = 12;
            ante_postmeridiem = "AM";
        }

        hr = hr < 10 ? "0" + hr : hr;
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;

        let currentTime = hr + ":" + min + ":" + sec + " " + ante_postmeridiem;

        clockElement.innerHTML = currentTime;

        checkAlarms(newtime);
    }

    // Check if the current time matches any alarm //
    function checkAlarms(currentTime) {
        alarms.forEach((alarm) => {
            if (!alarm.rung && currentTime >= alarm.date) {
                alert(`Alarm ringing: ${alarm.time}`);
                alarm.rung = true; 
            }
        });
    }

    // Add new alarm//
    setAlarmButton.addEventListener('click', () => {
        const hour = document.getElementById('hour').value;
        const minute = document.getElementById('minute').value;
        const second = document.getElementById('second').value;
        const ampm = document.getElementById('ampm').value;

        // Validate the input fields//
        if (hour === '' || minute === '' || second === '') {
            alert('Kindly fill all the fields.');
            return;
        }

        const formattedHour = hour.padStart(2, '0');
        const formattedMinute = minute.padStart(2, '0');
        const formattedSecond = second.padStart(2, '0');
        const alarmTime = `${formattedHour}:${formattedMinute}:${formattedSecond} ${ampm}`;

        // Convert alarm time to a Date object//
        const now = new Date();
        let alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
            ampm === 'PM' ? parseInt(hour) % 12 + 12 : parseInt(hour) % 12,
            parseInt(minute), parseInt(second));
        
        // If the alarm time is in the past for today, show an alert//
        if (alarmDate < now) {
            alert('The set time has already passed.');
            return;
        }

        addAlarm(alarmTime, alarmDate);

        // Clear the input fields//
        document.getElementById('hour').value = '';
        document.getElementById('minute').value = '';
        document.getElementById('second').value = '';
        document.getElementById('ampm').value = 'AM';
    });

    // Add alarm to the list//
    function addAlarm(time, date) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';

        const timeSpan = document.createElement('span');
        timeSpan.textContent = time;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn-btn-danger';
        deleteButton.style.backgroundColor='red';
        deleteButton.style.border='none';
        deleteButton.style.padding='10px 10px';
        deleteButton.style.boxShadow='2px 2px 5px black';
        deleteButton.style.borderBottomLeftRadius='10px';
        deleteButton.style.borderTopRightRadius='10px';
        deleteButton.style.cursor='pointer';
        
    
        deleteButton.addEventListener('click', () => {
            alarmList.removeChild(listItem);
            removeAlarm(time);
        });

        listItem.appendChild(timeSpan);
        listItem.appendChild(deleteButton);
        alarmList.appendChild(listItem);

        alarms.push({ time, date, rung: false });
    }

    // Remove alarm from the list//
    function removeAlarm(time) {
        alarms = alarms.filter(alarm => alarm.time !== time);
    }

    setInterval(DisplayTime, 1000); // Update the clock every second
    DisplayTime(); // Display the initial time
});
