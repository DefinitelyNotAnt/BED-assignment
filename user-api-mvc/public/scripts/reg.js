function returnFalse(){
    const getConfirm = document.getElementById("confirmLabel");
    if (getConfirm.childElementCount < 2){
        const incorrect = document.createElement("div");
        incorrect.classList.add("incorrect");
        incorrect.innerText="Passwords do not match.";
        getConfirm.appendChild(incorrect);
    }
}
function userTaken(){
    const getUser = document.getElementById("createUser");
    if (getUser.childElementCount < 2){
        const incorrect = document.createElement("div");
        incorrect.classList.add("incorrect");
        incorrect.innerText="Username is taken.";
        getUser.appendChild(incorrect);
    }
}