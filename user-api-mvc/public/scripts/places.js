document.addEventListener('DOMContentLoaded', function() {
    const placesContainer = document.getElementById('placesContainer');
    const addPlaceBtn = document.getElementById('addPlaceBtn');

    // Fetch and display all places
    async function fetchPlaces() {
        try {
            const response = await fetch('http://localhost:3000/places');
            const places = await response.json();

            placesContainer.innerHTML = '';
            places.forEach(place => {
                const placeDiv = document.createElement('div');
                placeDiv.style.border = '1px solid #E5E7EB';
                placeDiv.style.borderRadius = '8px';
                placeDiv.style.padding = '16px';
                placeDiv.innerHTML = `
                    <h3 style="font-size: 18px; font-weight: bold;">Name of place: ${place.name}</h3>
                    <p style="margin: 16px 0; color: #6B7280;">Description: ${place.description}</p>
                    <p style="margin: 16px 0; color: #6B7280;">Operating hours: ${place.operatinghours}</p>
                    <div style="display: flex; align-items: center; margin-bottom: 16px;">
                        <span style="font-size: 14px; color: #6B7280;">Address: ${place.address}</span>
                    </div>
                    <button class="editBtn" data-id="${place.id}" style="background-color: #007bff; color: #fff; padding: 8px; border: none; border-radius: 4px; margin-right: 8px;">Update</button>
                    <button class="deleteBtn" data-id="${place.id}" style="background-color: #ff0000; color: #fff; padding: 8px; border: none; border-radius: 4px;">Delete</button>
                `;
                placesContainer.appendChild(placeDiv);
            });

            // Add event listeners to Edit and Delete buttons
            document.querySelectorAll('.editBtn').forEach(btn => {
                btn.addEventListener('click', (event) => {
                    const placeId = event.target.dataset.id;
                    window.location.href = `updatePlace.html?id=${placeId}`;
                });
            });

            document.querySelectorAll('.deleteBtn').forEach(btn => {
                btn.addEventListener('click', async (event) => {
                    const placeId = event.target.dataset.id;
                    const confirmDelete = confirm('Are you sure you want to delete this place?');
                    if (confirmDelete) {
                        await deletePlace(placeId);
                        fetchPlaces(); // Refresh the list after deletion
                    }
                });
            });

        } catch (error) {
            console.error('Error fetching places:', error);
        }
    }

    // Delete a place
    async function deletePlace(id) {
        try {
            const response = await fetch(`http://localhost:3000/places/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error deleting place');
            }
        } catch (error) {
            console.error('Error deleting place:', error);
        }
    }

    // Event listener for Add Place button
    addPlaceBtn.addEventListener('click', () => {
        window.location.href = '/html/createplace.html';
    });

    // Initial fetch
    fetchPlaces();
});