const closeMessage = document.querySelector("#close-message");
const message = document.querySelector(".message");

closeMessage.addEventListener("click", () =>{
  message.style.display = "none";
});

setTimeout(() => {
  message.style.display = "none";
},5000);

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("donationForm");
  const radioButtons = form.elements["doacao"];
  const cpfInput = document.getElementById("cpfInput");
  const fullnameInput = document.getElementById("fullname");
  const paymentMethod = document.getElementById("payment-method");
  const amountInput = document.getElementById("amount");
  const dateInput = document.getElementById("txtData");
  const submitButton = document.getElementById("submit-button");

  function toggleFullname() {
    const isAnswered = [...radioButtons].some(radio => radio.checked);
    cpfInput.disabled = !isAnswered;
    fullnameInput.disabled = !isAnswered;
    paymentMethod.disabled = !isAnswered;
    amountInput.disabled = !isAnswered;
    dateInput.disabled = !isAnswered;
    submitButton.disabled = !isAnswered;
  }

  // Add event listener to radio buttons to toggle the fields
  [...radioButtons].forEach(radio => {
    radio.addEventListener("change", toggleFullname);
  });
});

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

function formatarValor(input) {
  let valor = input.value.replace(/\D/g, ''); // Remove tudo que não for dígito
  valor = (valor / 100).toFixed(2) + ''; // Divide por 100 para ajustar a posição dos centavos
  valor = valor.replace(".", ","); // Substitui ponto por vírgula

  input.value = 'R$ ' + valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}
