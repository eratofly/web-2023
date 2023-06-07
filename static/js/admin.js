const titleInput = document.getElementById("post-title");
const shortDescriptionInput = document.getElementById("post-description");
const authorInput = document.getElementById("post-author");
const publishDateInput = document.getElementById("post-date");
const avatarInput = document.getElementById("author-photo");
const pageImageInput = document.getElementById("article-image");
const publishButton = document.querySelector(".new-post__button");
const contentInput = document.querySelector(".content__text-area");
const cameraAvatar = document.getElementById("image-camera-avatar");
const pageImageSigns = document.querySelector(".page-image__image-signs");
const pageImageDescription = document.querySelector(".post-form__description");


const pagePreviewTitle = document.querySelector(".page-input-field__title");
const cardPreviewTitle = document.querySelector(".card-input-field__title");
const pagePreviewDescription = document.querySelector(".page-input-field__subtitle");
const cardPreviewDescription = document.querySelector(".card-input-field__subtitle");
const cardAuthor = document.querySelector(".info__author");
const cardDate = document.querySelector(".info__date");
const cardImage = document.querySelector(".card-input-field__preview-image");

const avatarButtons = document.querySelector(".avatar__image-buttons");
const avatarRemoveButton = document.getElementById("avatar-remove-btn");

const cardAvatar = document.querySelector(".info__avatar");
const formAvatar = document.querySelector(".avatar__add-avatar");
const avatarUpload = document.querySelector(".avatar__upload-btn");

const postPageImage = document.querySelector(".page-input-field__preview-image");
const formPageImage = document.querySelector(".post-form__page-image");
const pageImageButtons = document.querySelector(".post-form__image-buttons");
const pageImageRemoveButton = document.getElementById("page-image-remove-image");

const titleWarning = document.getElementById("title-warning");
const descriptionWarning = document.getElementById("description-warning");
const authorWarning = document.getElementById("author-warning");
const avatarWarning = document.getElementById("avatar-warning");
const dateWarning = document.getElementById("date-warning");
const pageImageWarning = document.getElementById("page-image-warning");
const contentWarning = document.getElementById("content-warning");

const errorMessage = document.querySelector(".error-message");
const completeMessage = document.querySelector(".complete-message");

const logoutButton = document.getElementById("log_out");

let pageImageBase64 = "";
let avatarBase64 = "";


function textInput(event) {
    let elem = event.target;
    if (elem.value !== "") {
        elem.classList.add("post-form__text-field_filled");
    }
    else {
        elem.classList.remove("post-form__text-field_filled");
    }
}

function previewTitle() {
    pagePreviewTitle.innerHTML = titleInput.value;
    cardPreviewTitle.innerHTML = titleInput.value;
}

function previewDescription() {
    pagePreviewDescription.innerHTML = shortDescriptionInput.value;
    cardPreviewDescription.innerHTML = shortDescriptionInput.value;
}

function previewAuthor() {
    cardAuthor.innerHTML = authorInput.value;
}

function previewDate() {
    cardDate.innerHTML = publishDateInput.valueAsDate.toLocaleDateString("en-US");
}

function removeAvatar() {
    avatarInput.value = null;
    formAvatar.classList.remove("avatar__add-avatar_uploaded");
    cameraAvatar.classList.remove("hidden");
    formAvatar.style.backgroundImage = "";
    cardAvatar.style.backgroundImage = "";
    avatarButtons.classList.add("hidden");
    avatarUpload.classList.remove("hidden");
}

function previewAvatar() {
    const reader  = new FileReader();
    const file = avatarInput.files[0];
  
    reader.onload = function () {
        avatarBase64 = reader.result.replace("data:", "").replace(/^.+,/, "");
        cardAvatar.style.backgroundImage = "url(" + reader.result + ")";
        formAvatar.style.backgroundImage = "url(" + reader.result + ")";
    }
  
    if (file) {
        cameraAvatar.classList.add("hidden");
        formAvatar.classList.add("avatar__add-avatar_uploaded");
        avatarUpload.classList.add("hidden");
        avatarButtons.classList.remove("hidden");
        reader.readAsDataURL(file);
    } 
}

function removePageImage() {
    pageImageInput.value = null;
    formPageImage.classList.remove("post-form__page-image_uploaded");
    pageImageSigns.classList.remove("hidden");
    formPageImage.style.backgroundImage = "";
    postPageImage.style.backgroundImage = "";
    cardImage.style.backgroundImage = "";
    pageImageButtons.classList.add("hidden");
    pageImageDescription.classList.remove("hidden");
}

function previewPageImage() {
    const reader  = new FileReader();
    const file = pageImageInput.files[0];
    reader.onload = function () {
        pageImageBase64 = reader.result.replace("data:", "").replace(/^.+,/, "");
        postPageImage.style.backgroundImage = "url(" + reader.result + ")";
        formPageImage.style.backgroundImage = "url(" + reader.result + ")";
        cardImage.style.backgroundImage = "url(" + reader.result + ")";
    }

    if (file) {
        pageImageSigns.classList.add("hidden");
        formPageImage.classList.add("post-form__page-image_uploaded");
        cardImage.classList.add("card-input-field__preview-image_uploaded");
        pageImageButtons.classList.remove("hidden");
        pageImageDescription.classList.add("hidden");
        reader.readAsDataURL(file);
    } 
}

async function createPost() {
    if (!checkInputs()) {
        const avatarFile = avatarInput.files[0]; 
        const pageImageFile = pageImageInput.files[0];
        const post = {
            title: titleInput.value,
            description: shortDescriptionInput.value,
            author: authorInput.value,
            avatarName: avatarFile.name,
            pageImage: pageImageBase64,
            avatar: avatarBase64,
            publishDate: publishDateInput.valueAsDate.toLocaleDateString("en-US"),
            pageImageName: pageImageFile.name,
            content: contentInput.value,
        }
        let postJson = JSON.stringify(post); 
        console.log(postJson);

        const response = await fetch("/api/post", {
            method: "POST",
            headers: {
            'Content-Type': 'application/json;charset=utf-8'
            },
            body: postJson,
        });

        if (!response.ok) 
        {
            alert("Error HTTP: " + response.status);
        }
        
        errorMessage.classList.add("message_hidden");
        completeMessage.classList.remove("message_hidden");
        
    }
    else {
        completeMessage.classList.add("message_hidden");
        errorMessage.classList.remove("message_hidden");
    }  
}



function checkInputs() {
    const fileAvatar = avatarInput.files[0];
    const filePageImage = pageImageInput.files[0];
    let isWarning = false;

    if (titleInput.value == "") {
        titleWarning.classList.remove("hidden");
        titleInput.classList.add("post-form__text-field_warning");
        isWarning = true;
    }
    else {
        titleWarning.classList.add("hidden");
        titleInput.classList.remove("post-form__text-field_warning");
    }

    if (shortDescriptionInput.value == "") {
        descriptionWarning.classList.remove("hidden");
        shortDescriptionInput.classList.add("post-form__text-field_warning");
        isWarning = true;
    }
    else {
        descriptionWarning.classList.add("hidden");
        shortDescriptionInput.classList.remove("post-form__text-field_warning");
    }

    if (authorInput.value == "") {
        authorWarning.classList.remove("hidden");
        authorInput.classList.add("post-form__text-field_warning");
        isWarning = true;
    }
    else {
        authorWarning.classList.add("hidden");
        authorInput.classList.remove("post-form__text-field_warning");
    }

    if(!fileAvatar) {
        avatarWarning.classList.remove("hidden");
        isWarning = true;
    }
    else {
        avatarWarning.classList.add("hidden");
    }
    if (publishDateInput.value == "") {
        dateWarning.classList.remove("hidden");
        publishDateInput.classList.add("post-form__text-field_warning");
        isWarning = true;
    }
    else {
        dateWarning.classList.add("hidden");
        publishDateInput.classList.remove("post-form__text-field_warning");
    }

    if(!filePageImage) {
        pageImageWarning.classList.remove("hidden");
        isWarning = true;
    }
    else {
        pageImageWarning.classList.add("hidden");
    }

    if (contentInput.value == "") {
        contentWarning.classList.remove("hidden");
        contentInput.classList.add("content__text-area_warning");
        isWarning = true;
    }
    else {
        contentWarning.classList.add("hidden");
        contentInput.classList.remove("content__text-area_warning");
    }

    return isWarning;
}

async function logout() {
  const response = await fetch("/api/logout");
  if (response.ok) {
      window.location.href = "/login"; 
  } 

}


titleInput.addEventListener("input", textInput);
titleInput.addEventListener("input", previewTitle);

shortDescriptionInput.addEventListener("input", textInput);
shortDescriptionInput.addEventListener("input", previewDescription);

authorInput.addEventListener("input", textInput);
authorInput.addEventListener("input", previewAuthor);

publishDateInput.addEventListener("input", textInput);
publishDateInput.addEventListener("input", previewDate);

avatarInput.addEventListener("input", previewAvatar);
avatarRemoveButton.addEventListener("click", removeAvatar);

pageImageInput.addEventListener("input", previewPageImage);
pageImageRemoveButton.addEventListener("click", removePageImage);

publishButton.addEventListener("click", createPost);

logoutButton.addEventListener("click", logout);


