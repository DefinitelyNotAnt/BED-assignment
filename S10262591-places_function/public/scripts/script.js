async function fetchPlaces() 
{
    const response = await fetch("/places"); // Replace with your API endpoint
    const data = await response.json();
  
    const placeList = document.getElementById("place-list");
  
    data.forEach((place) => 
    {
      const placeItem = document.createElement("div");
      placeItem.classList.add("place"); // Add a CSS class for styling
  
      // Create elements for title, author, etc. and populate with book data
      const nameElement = document.createElement("h2");
      nameElement.textContent = place.name;
  
      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = `Description : ${place.description}`;

      const operatinghoursElement = document.createElement("p");
      operatinghoursElement.textContent = `Operating hours: ${place.operatinghours}`;

      const addressElement = document.createElement("p");
      addressElement.textContent = `Address : ${place.address}`;
  
      // ... add more elements for other book data (optional)
  
      placeItem.appendChild(nameElement);
      placeItem.appendChild(descriptionElement);
      placeItem.appendChild(operatinghoursElement);
      placeItem.appendChild(addressElement);

      // ... append other elements
  
      placeList.appendChild(placeItem);
    });
}
  
fetchPlaces(); // Call the function to fetch and display book data
