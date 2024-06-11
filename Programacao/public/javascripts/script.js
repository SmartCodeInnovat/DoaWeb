const closeMessage = document.querySelector("#close-message");
const message = document.querySelector(".message");
const password = document.getElementById("password");
let icon = document.getElementId("icon");


closeMessage.addEventListener("click", () =>{
    message.style.display = "none";
});

setTimeout(() => {
    message.style.display = "none";
},5000);

function mostrarSenha(){
    var inputPass = document.getElementById('password')
    var btnShowPass = document.getElementById('btn-senha')
 
   if(inputPass.type === 'password'){
     inputPass.setAttribute('type', 'text')
     btnShowPass.classList.replace('bi-eye-fill', 'bi-eye-slash-fill')
   }else {
     inputPass.setAttribute('type', 'password')
     btnShowPass.classList.replace('bi-eye-slash-fill','bi-eye-fill')
   }
 }