async function fetchEvents() {
    const response = await fetch("/events"); // Replace with your API endpoint
    const data = await response.json();
  
    const eventList = document.getElementById("event-list");
  
    data.forEach((event) => {
      const eventItem = document.createElement("div");
      eventItem.classList.add("event"); // Add a CSS class for styling
  
      // Create elements for title, author, etc. and populate with event data
      const eventNameElement = document.createElement("h2");
      eventNameElement.textContent = event.EventName;
  
      const eventDescElement = document.createElement("p");
      eventDescElement.textContent = event.EventDesc;

      const displayLink = document.createElement("a");
      displayLink.textContent = "View";
      displayLink.href = `http://localhost:3000/html/display-event.html?id=${event.EventID}`;
  
      // ... add more elements for other event data (optional)
  
      eventItem.appendChild(eventNameElement);
      eventItem.appendChild(eventDescElement);
      eventItem.appendChild(displayLink);
      // ... append other elements
  
      eventList.appendChild(eventItem);
    });
  }
  
  fetchEvents(); // Call the function to fetch and display event data









  // async function fetchEvent() {
  //   const response = await fetch(`/events/${eventId}`); // Replace with your API endpoint
  //   const data = await response.json();
  
  //   const eventList = document.getElementById("event-list");
  
  //   data.forEach((event) => {
  //     const eventItem = document.createElement("div");
  //     eventItem.classList.add("event"); // Add a CSS class for styling
  
  //     // Create elements for title, author, etc. and populate with event data
  //     const eventNameElement = document.createElement("h2");
  //     eventNameElement.textContent = event.EventName;
  
  //     const eventDescElement = document.createElement("p");
  //     eventDescElement.textContent = event.EventDesc;

  //     const updateLink = document.createElement("a");
  //     updateLink.textContent = "Update";
  //     updateLink.href = `http://localhost:3000/html/update-event.html?id=${event.EventID}`;
  
  //     // ... add more elements for other event data (optional)
  
  //     eventItem.appendChild(eventNameElement);
  //     eventItem.appendChild(eventDescElement);
  //     eventItem.appendChild(updateLink);
  //     // ... append other elements
  
  //     eventList.appendChild(eventItem);
  //   });
  // }
  