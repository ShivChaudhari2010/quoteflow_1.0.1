// api.js
const API_URL = "/api/slides";

async function parseResponse(response) {
  if (response.status === 401) {
    // Session missing or expired -> send back to login
    window.location.href = "/login.html";
    throw new Error("Not authenticated.");
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message);
  }

  return result;
}

export async function getSlides() {
  const response = await fetch(API_URL);
  const result = await parseResponse(response);
  return result.data;
}

export async function createSlide(slide) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(slide)
  });

  const result = await parseResponse(response);
  return result.data;
}

export async function updateSlide(id, slide) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(slide)
  });

  const result = await parseResponse(response);
  return result.data;
}

export async function deleteSlide(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  await parseResponse(response);
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/login.html";
}
