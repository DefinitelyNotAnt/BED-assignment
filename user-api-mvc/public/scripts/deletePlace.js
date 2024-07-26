document.addEventListener('DOMContentLoaded', async () => 
{
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('id');

    if (!placeId) {
        alert('No place ID found in the URL');
        return;
    }

    document.getElementById('confirmDelete').addEventListener('click', async () => {
        const response = await fetch(`http://localhost:3001/places/${placeId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Place deleted successfully');
            window.location.href = '/html/places.html'; 
        } else {
            alert('Failed to delete place');
        }
    });

    document.getElementById('cancelDelete').addEventListener('click', () => {
        window.location.href = '/html/places.html';
    });
});
