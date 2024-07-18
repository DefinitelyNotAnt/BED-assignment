const form = document.getElementById("loginForm");

function fetchUserSession(){

    const user = document.getElementById("getUser").innerText;
    const password = document.getElementById("getPassword").innerText;
    console.log(user);
    const bodyToSubmit = { 
        "loginName": user,
        "password": password
     }
    fetch('/login', {
          method: 'get',
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
              },
          body: JSON.stringify(bodyToSubmit)
            });
}