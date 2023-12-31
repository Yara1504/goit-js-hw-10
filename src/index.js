import axios from "axios";
import { fetchBreeds, requestServer } from "./cat-api.js";
axios.defaults.headers.common["x-api-key"] = "live_3OWVYTQQ2Xo9ese4BWEtpiPiha6MKejnDoTxXUHGJANI337qKoXrkuvtGOdIgZwF"

const breedSelect = document.querySelector(".breed-select");
const catInfo = document.querySelector(".cat-info");
const loader = document.querySelector(".loader");
const error = document.querySelector(".error");
let currentBreedId = null;

function hideLoader() {
  loader.style.display = "none";
}

function showLoader() {
  loader.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  setupBreedSelect();
  hideLoader();
});

breedSelect.addEventListener("change", (event) => {
  const selectedBreedId = event.target.value;

  if (selectedBreedId) {
    clearCat();
    currentBreedId = selectedBreedId;
    showLoader();
    showCatInfo(selectedBreedId);
  } else {
    clearCatInfo();
    currentBreedId = null;
  }
});

function clearCat() {
  catInfo.innerHTML = "";
  error.style.display = "none";
}  

function showCatInfo(breedId) {
  error.style.display = "none";

  requestServer(breedId)
    .then((data) => {
      if (breedId === currentBreedId) {
        const { name, description, temperament } = data[0].breeds[0];
        const imageUrl = data[0].url;

        const catInfoHTML = `
        <h2>${name}</h2>
        <p><strong>Опис:</strong> ${description}</p>
        <p><strong>Темперамент:</strong> ${temperament}</p>
        <img src="${imageUrl}" alt="${name}" />
      `;

        catInfo.innerHTML = catInfoHTML;
      }
    })
    .catch((err) => {
      console.error(err);
      error.style.display = "block";
    })
    .finally(() => {
      hideLoader();
    });
}

function setupBreedSelect() {
  fetchBreeds()
    .then((breeds) => {
      updateBreedSelect(breeds);
    })
    .catch((err) => {
      console.error(err);
      error.style.display = "block";
    });
}

function updateBreedSelect(breeds) {
  breedSelect.innerHTML = "";
  breeds.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}

setupBreedSelect();