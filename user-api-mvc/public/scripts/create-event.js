document.getElementById('eventForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const eventData = {
        "EventName": document.getElementById('event-name').value,
        "EventDesc": document.getElementById('event-description').value,
        "EventStartTime": document.getElementById('event-date').value + "T" + document.getElementById('event-start-time').value + ":00.000Z",
        "EventEndTime": document.getElementById('event-date').value + "T" + document.getElementById('event-end-time').value + ":00.000Z",
        "EntryPrice": document.getElementById('event-price').value,
        "HostID": 3 // Hardcoded for now
    };
    console.log(document.getElementById('event-date').value + document.getElementById('event-start-time').value);
    console.log(eventData);
    // Send the form data using Fetch API
    fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        // Handle successful response
        console.log('Success:', data);
        alert('Event created successfully!');
        window.location.href = `http://localhost:3000/index.html`;
    })
    .catch(error => {
        // Handle errors
        console.error('Error:', error);
        alert('There was an error creating the event.');
    });
});