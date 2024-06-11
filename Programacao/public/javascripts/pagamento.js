const closeMessage = document.querySelector("#close-message");
const message = document.querySelector(".message");

closeMessage.addEventListener("click", () =>{
  message.style.display = "none";
});

setTimeout(() => {
  message.style.display = "none";
},5000);

//FullName
function toggleFullname() {
    var naoPrimeiraDoacao = document.getElementById('naoPrimeiraDoacao').checked;
    var fullnameField = document.getElementById('campo-fullname');

    if (naoPrimeiraDoacao) {
        fullnameField.style.display = 'none';
    } else {
        fullnameField.style.display = 'block';
    }
}
//Footer
window.addEventListener("scroll", function () {
  var footer = document.getElementById("footer");
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    footer.style.display = "block";
  } else {
    footer.style.display = "none";
  }
});
//CPF
function formatarCPF(event) {
  const input = document.getElementById("cpfInput");
  const inputLength = input.value.length; // Corrigido de nodeValue para value
  if (inputLength === 3 || inputLength === 7) {
    // Corrigido de inputlength para inputLength
    input.value += ".";
  } else if (inputLength === 11) {
    input.value += "-";
  }
}
