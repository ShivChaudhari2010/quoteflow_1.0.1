// login.js
const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("loginError");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  loginError.classList.add("hidden");

  if (!username) {
    return showError("Username required.");
  }

  if (!password) {
    return showError("Password required.");
  }

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (!result.success) {
      return showError(result.message || "Login failed.");
    }

    // Admins land on the management dashboard, regular users see the slides only
    window.location.href = result.role === "admin" ? "/dashboard.html" : "/index.html";

  } catch (error) {
    console.error(error);
    showError("Unable to reach the server.");
  }
});

function showError(message) {
  loginError.textContent = message;
  loginError.classList.remove("hidden");
}
