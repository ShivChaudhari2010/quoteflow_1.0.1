import { getSlides, logout } from "./api.js";

const quote = document.getElementById("quote");
const logoutBtn = document.getElementById("logoutBtn");
const body = document.body;

let slides = [];
let currentIndex = 0;
let isAnimating = false;

/*
|--------------------------------------------------------------------------
| Load Slides From Backend
|--------------------------------------------------------------------------
*/

async function loadSlides() {
  try {
    slides = await getSlides();

    if (slides.length === 0) {
      quote.textContent = "No Quotes Available";
      return;
    }

    displaySlide(currentIndex);

  } catch (error) {
    console.error(error);

    quote.textContent = "Unable to load quotes.";
  }
}

/*
|--------------------------------------------------------------------------
| Display Slide
|--------------------------------------------------------------------------
*/

function displaySlide(index) {
  const slide = slides[index];

  quote.textContent = slide.text;

  body.style.backgroundColor = slide.backgroundColor;
  body.style.color = slide.textColor;
}

/*
|--------------------------------------------------------------------------
| Next Slide
|--------------------------------------------------------------------------
*/

document.addEventListener("click", () => {

  if (slides.length === 0) return;

  if (isAnimating) return;

  isAnimating = true;

  quote.classList.add("fade-out");

  setTimeout(() => {

    currentIndex++;

    if (currentIndex >= slides.length) {
      currentIndex = 0;
    }

    displaySlide(currentIndex);

    quote.classList.remove("fade-out");

    isAnimating = false;

  }, 350);

});

logoutBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  logout();
});

/*
|--------------------------------------------------------------------------
| Initialize
|--------------------------------------------------------------------------
*/

loadSlides();
