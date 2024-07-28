document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');

    if (placeId) {
        const response = await fetch(`http://localhost:3000/places/${placeId}`);
        const place = await response.json();

        document.getElementById('name').value = place.name;
        document.getElementById('description').value = place.description;
        document.getElementById('operatinghours').value = place.operatinghours;
        document.getElementById('address').value = place.address;
    }

    document.getElementById('updateForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const updatedPlace = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            operatinghours: document.getElementById('operatinghours').value,
            address: document.getElementById('address').value
        };

        const response = await fetch(`http://localhost:3000/places/${placeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPlace)
        });

        if (response.ok) 
        {
            alert('Place updated successfully');
            window.location.href = '/html/places.html';
        } 
        else 
        {
            alert('Failed to update place');
        }
    });
});