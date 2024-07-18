// JavaScript code to fetch and display event details
document.addEventListener("DOMContentLoaded", (event) => {
  async function fetchEventById(eventId) {
    try {
      const response = await fetch(`/events/${eventId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const event = await response.json();
      displayEvent(event);
    } catch (error) {
      console.error("Failed to fetch event:", error);
    }
  }

  function displayEvent(event) {
    const eventDetails = document.getElementById("event-details");
    eventDetails.innerHTML = ""; // Clear previous content

    const eventItem = document.createElement("div");
    eventItem.classList.add("event"); // Add a CSS class for styling

    // Create elements for title, description, start time, end time, etc.
    const eventNameElement = document.createElement("h2");
    eventNameElement.textContent = event.EventName;

    const eventDescElement = document.createElement("p");
    eventDescElement.textContent = event.EventDesc;

    const eventStartTimeElement = document.createElement("p");
    eventStartTimeElement.textContent = `Start Time: ${event.EventStartTime}`;

    const eventEndTimeElement = document.createElement("p");
    eventEndTimeElement.textContent = `End Time: ${event.EventEndTime}`;

    const eventEntryPriceElement = document.createElement("p");
    eventEntryPriceElement.textContent = `Entry Price: $${event.EntryPrice}`;

    const eventHostIdElement = document.createElement("p");
    eventHostIdElement.textContent = `Host ID: ${event.HostID}`;

    const editLink = document.createElement("a");
    editLink.textContent = "Edit";
    editLink.href = `http://localhost:3000/html/update-event.html?id=${eventId}`;

    // Append elements to the event item
    eventItem.appendChild(eventNameElement);
    eventItem.appendChild(eventDescElement);
    eventItem.appendChild(eventStartTimeElement);
    eventItem.appendChild(eventEndTimeElement);
    eventItem.appendChild(eventEntryPriceElement);
    eventItem.appendChild(eventHostIdElement);
    eventItem.appendChild(editLink);

    // Append the event item to the event details container
    eventDetails.appendChild(eventItem);
  }

  // Get the event ID from the URL
  function getEventIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }

  const eventId = getEventIdFromUrl();
  if (eventId) {
    fetchEventById(eventId);
    document
  .getElementById("delete-event-button")
  .addEventListener("click", async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this event?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(`/events/${eventId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        alert("Event deleted successfully");
        // Redirect to another page after deletion, e.g., the events list page
        window.location.href = "../index.html";
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  });
  } else {
    console.error("Event ID is missing in the URL");
  }
});

// Handle event deletion


// // Get the full URL of the current page
// const url = window.location.href;

// // Create a URL object
// const urlObj = new URL(url);

// // Use URLSearchParams to extract the query parameters
// const params = new URLSearchParams(urlObj.search);

// // Get the 'id' parameter value
// const eventId = params.get('id');

// // Log the id to the console
// console.log('Event ID:', eventId);

// // Optionally, you can use the eventId in your application logic
// if (eventId) {
//     // Do something with the eventId, e.g., fetch event details from the server
//     console.log(`Event ID is ${eventId}`);

// } else {
//     console.log('No event ID found in the URL.');
// }
