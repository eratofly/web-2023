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
    formPageImage.classList.remove("post-form__page-image_uploaded");
    pageImageSigns.classList.remove("hidden");
    formPageImage.style.backgroundImage = "";
    postPageImage.style.backgroundImage = "";
    cardImage.style.backgroundImage = "";
    pageImageButtons.classList.add("hidden");
}

function previewPageImage() {
    const reader  = new FileReader();
    const file = pageImageInput.files[0];

    reader.onload = function () {
        postPageImage.style.backgroundImage = "url(" + reader.result + ")";
        formPageImage.style.backgroundImage = "url(" + reader.result + ")";
        cardImage.style.backgroundImage = "url(" + reader.result + ")";
    }

    if (file) {
        pageImageSigns.classList.add("hidden");
        formPageImage.classList.add("post-form__page-image_uploaded");
        cardImage.classList.add("card-input-field__preview-image_uploaded");
        pageImageButtons.classList.remove("hidden");
        reader.readAsDataURL(file);
    } 
}

function createPost() {
    const avatarFile = avatarInput.files[0]; 
    const pageImageBase64 = pageImageInput.files[0];
    const post = {
        title: titleInput.value,
        description: shortDescriptionInput.value,
        author: authorInput.value,
        avatar: avatarFile.name,
        publishDate: publishDateInput.value,
        pageImage: pageImageBase64.name,
        content: contentInput.value,
  }
  let postJson = JSON.stringify(post); 
  console.log(postJson);
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