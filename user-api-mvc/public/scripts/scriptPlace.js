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
      nameElement.textContent = `Name of place : ${place.name}`;
  
      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = `Description : ${place.description}`;

      const operatinghoursElement = document.createElement("p");
      operatinghoursElement.textContent = `Operating hours: ${place.operatinghours}`;

      const addressElement = document.createElement("p");
      addressElement.textContent = `Address : ${place.address}`;

      const linkContainer = document.createElement("div");
      linkContainer.classList.add("link-container");
  
      const updateLink = document.createElement("a");
      updateLink.textContent = "Update";
      updateLink.href = `http://localhost:3000/html/updateplace.html?id=${place.id}`;
      updateLink.classList.add("link");

      const deleteLink = document.createElement("a");
      deleteLink.textContent = "Delete";
      deleteLink.href = `http://localhost:3000/html/deleteplace.html?id=${place.id}`;
      deleteLink.classList.add("link");

      linkContainer.appendChild(updateLink);
      linkContainer.appendChild(deleteLink);
      // ... add more elements for other book data (optional)
  
      placeItem.appendChild(nameElement);
      placeItem.appendChild(descriptionElement);
      placeItem.appendChild(operatinghoursElement);
      placeItem.appendChild(addressElement);
    
      
      placeItem.appendChild(linkContainer);
      // ... append other elements
  
      placeList.appendChild(placeItem);
    });
}
  
fetchPlaces(); // Call the function to fetch and display book data
