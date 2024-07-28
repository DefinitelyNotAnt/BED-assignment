const returnbtn = document.getElementById("return");


document.addEventListener('DOMContentLoaded', async () => {
    const emailbtn = document.getElementById("sendEmail");
    const terms = document.getElementById("searchTerms");

    emailbtn.addEventListener("click", function (event) {
        event.preventDefault();

        const searchTerms = {
            "searchTerms": terms.value,
            "email": terms.value,
            "username": terms.value
        }
        fetch('http://localhost:3000/users/forgot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchTerms)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            console.log("Email sent.");
            let input = prompt('Email sent. Type out the One-Time Password sent.', "");
            // Handle successful response
            // console.log('Success:', data);
            if (input == data.otp){
                alert('Confirmation Successful! Your password is: 123123123');
                window.location.href = `http://localhost:3000/index.html`;
            }
            else{
                alert('Confirmation Failed.');
            }
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
    })
});

returnbtn.addEventListener("click", function (){
    window.location.href = `http://localhost:3000/index.html`;
})