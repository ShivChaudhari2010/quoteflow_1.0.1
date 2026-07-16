// dashboard.js
import {
  getSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  logout
} from "./api.js";

const container = document.getElementById("slidesContainer");
const addSlideBtn = document.getElementById("addSlideBtn");
const modalOverlay = document.getElementById("modalOverlay");
const cancelBtn = document.getElementById("cancelBtn");
const slideForm = document.getElementById("slideForm");

const deleteModal = document.getElementById("deleteModal");
const deleteQuote = document.getElementById("deleteQuote");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const quoteText = document.getElementById("quoteText");
const backgroundColor = document.getElementById("backgroundColor");
const textColor = document.getElementById("textColor");
const order = document.getElementById("order");

const modalTitle = document.getElementById("modalTitle");
const emptyState = document.getElementById("emptyState");

let editSlideId = null;
let deleteSlideId = null;
let slides = [];

function renderSlides() {
  if (slides.length === 0) {
    emptyState.classList.remove("hidden");
    container.classList.add("hidden");
    return;
  }
  emptyState.classList.add("hidden");
  container.classList.remove("hidden");

  container.innerHTML = "";
  slides.forEach(slide => {
    container.innerHTML += `<div class="slide-card">
            <h3>Order #${slide.order}</h3>
            <p class="quote">
                ${slide.text}
            </p>
            <div class="color-info">
                <span>Background</span>
                <div class="color-box"
                    style="background:${slide.backgroundColor}">
                </div>
            </div>
            <div class="color-info">
                <span>Text Color</span>
                <div class="color-box" style="background:${slide.textColor}; border:1px solid #ddd;">
                </div>
            </div>
            <div class="actions">
               <button class="edit-btn" data-id="${slide._id}"> Edit </button>
               <button class="delete-btn" data-id="${slide._id}"> Delete </button>
            </div>
        </div>`;
  });
}

async function loadSlides() {
  try {
    slides = await getSlides();
    renderSlides();
  } catch (error) {
    console.error(error);
  }
}

function openModal() {
  modalOverlay.classList.remove("hidden");
  modalOverlay.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modalOverlay.classList.add("hidden");
  modalOverlay.setAttribute("aria-hidden", "true");

  slideForm.reset();
  editSlideId = null;
}

function editSlide(id) {
  const slide = slides.find(s => s._id === id);
  if (!slide) return;
  editSlideId = id;
  modalTitle.textContent = "Edit Slide";
  quoteText.value = slide.text;
  backgroundColor.value = slide.backgroundColor;
  textColor.value = slide.textColor;
  order.value = slide.order;
  openModal();
}

function openDeleteModal(id) {
  const slide = slides.find(s => s._id === id);
  if (!slide) return;
  deleteSlideId = id;

  deleteQuote.textContent = slide.text;
  deleteModal.classList.remove("hidden");
}

addSlideBtn.addEventListener("click", () => {
  editSlideId = null;
  modalTitle.textContent = "Add New Slide";
  slideForm.reset();
  backgroundColor.value = "#3498db";
  textColor.value = "#ffffff";
  openModal();
});

cancelBtn.addEventListener("click", closeModal);

slideForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const slideData = {
    order: Number(order.value),
    text: quoteText.value.trim(),
    backgroundColor: backgroundColor.value,
    textColor: textColor.value
  };

  const duplicate = slides.find(
    slide => slide.order === slideData.order && slide._id !== editSlideId
  );

  if (duplicate) {
    alert("Order already exists.");
    return;
  }

  try {
    if (editSlideId === null) {
      await createSlide(slideData);
    } else {
      await updateSlide(editSlideId, slideData);
    }

    closeModal();
    await loadSlides();
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
});

container.addEventListener("click", (event) => {
  const editBtn = event.target.closest(".edit-btn");
  if (editBtn) {
    editSlide(editBtn.dataset.id);
    return;
  }

  const deleteBtn = event.target.closest(".delete-btn");
  if (deleteBtn) {
    openDeleteModal(deleteBtn.dataset.id);
  }
});

cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.classList.add("hidden");
  deleteSlideId = null;
});

confirmDeleteBtn.addEventListener("click", async () => {
  try {
    await deleteSlide(deleteSlideId);
    deleteModal.classList.add("hidden");
    deleteSlideId = null;
    await loadSlides();
  } catch (error) {
    console.error(error);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  logout();
});

// Init
await loadSlides();
