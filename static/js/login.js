const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordEye = document.querySelector(".form-element__eye");


function textInput(event) 
{
  let elem = event.target;
  if (elem.value !== "") 
  {
      elem.classList.add("form-element__field_filled");
  }
  else 
  {
      elem.classList.remove("form-element__field_filled");
  }
}

function changeEye() {
    if (passwordInput.type === "password") 
    {
        console.log(passwordInput.type);
        passwordInput.type = "text";
        passwordEye.src = "/static/img/eye_off.svg";
    } 
    else if (passwordInput.type === "text") 
    {
        passwordInput.type = "password";
        passwordEye.src = "/static/img/eye.svg";
    }
}

function initEventListeners() 
{
    emailInput.addEventListener("input", textInput);
    passwordInput.addEventListener("input", textInput);
    passwordEye.addEventListener("click", changeEye);
}

initEventListeners();