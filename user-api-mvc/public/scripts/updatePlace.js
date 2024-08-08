document.addEventListener('DOMContentLoaded', async function() {
    // Get place ID from URL parameters
    const params = new URLSearchParams(window.location.search);
    const placeId = params.get('id');

    if (!placeId) {
        console.error('No place ID found in URL');
        return;
    }

    // Fetch existing place data
    try {
        const response = await fetch(`http://localhost:3000/places/${placeId}`);
        const place = await response.json();

        // Pre-fill form fields with existing place data
        document.getElementById('name').value = place.name;
        document.getElementById('description').value = place.description;
        document.getElementById('operatinghours').value = place.operatinghours;
        document.getElementById('address').value = place.address;
    } catch (error) {
        console.error('Error fetching place data:', error);
    }

    // Handle form submission
    document.getElementById('updatePlaceForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the form from submitting the default way

        // Create a FormData object to hold the form data
        const formData = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            operatinghours: document.getElementById('operatinghours').value,
            address: document.getElementById('address').value
        };

        // Send the form data using fetch
        try {
            const response = await fetch(`http://localhost:3000/places/${placeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('Success:', data);
            alert('Place updated successfully');
            // Redirect to the home page or another page after successful update
            window.location.href = '/html/places.html';
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to update place');
        }
    });
});