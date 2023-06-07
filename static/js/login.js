const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const passwordEye = document.querySelector(".form-element__eye");

const emailWarning = document.getElementById("email-warning");
const passwordWarning = document.getElementById("password-warning");
const incorrectEmaildWarning = document.getElementById("incorrect-email-warning");

const loginButton = document.querySelector(".login-form__button");

const errorMessageInputs = document.getElementById("check-fields");

const isInputsRequired = document.getElementById("warning-password-email");


async function checkLogin() {
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(re);
    };

    let isWarning = false;

    if (emailInput.value == "") {
        emailWarning.classList.remove("hidden");
        incorrectEmaildWarning.classList.add("hidden");
        emailInput.classList.add("form-element__field_warning");
        isWarning = true;
    }
    else if (!validateEmail(emailInput.value)) {
        emailWarning.classList.add("hidden");
        incorrectEmaildWarning.classList.remove("hidden");
        emailInput.classList.add("form-element__field_warning");
        isWarning = true;
    }
    else {
        emailWarning.classList.add("hidden");
        incorrectEmaildWarning.classList.add("hidden");
        emailInput.classList.remove("form-element__field_warning");
    }

    if (passwordInput.value == "") {
        passwordWarning.classList.remove("hidden");
        passwordInput.classList.add("form-element__field_warning");
        isWarning = true;
    }
    else {
        passwordWarning.classList.add("hidden");
        passwordInput.classList.remove("form-element__field_warning");
    }

    if (isWarning) {
        errorMessageInputs.classList.remove("message_hidden");
    }
    else {
        errorMessageInputs.classList.add("message_hidden");
        const login = {
            email: emailInput.value,
            password: passwordInput.value,
        }
        let loginJson = JSON.stringify(login); 
        console.log(loginJson);
    
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            },
            body: loginJson,
        });
    
        if (!response.ok) {
            console.log(response.status);
            isInputsRequired.classList.remove("message_hidden");
            emailInput.classList.add("form-element__field_warning");
            passwordInput.classList.add("form-element__field_warning");
            isWarning = true;
        }
        else {   
            window.location.href = "/admin";
        }
    }

}

function textInput(event) {
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
        passwordInput.type = "text";
        passwordEye.src = "/static/img/eye_off.svg";
    } 
    else if (passwordInput.type === "text") 
    {
        passwordInput.type = "password";
        passwordEye.src = "/static/img/eye.svg";
    }
}

emailInput.addEventListener("input", textInput);
passwordInput.addEventListener("input", textInput);
passwordEye.addEventListener("click", changeEye);
loginButton.addEventListener("click", checkLogin);