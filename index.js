const { createElement } = require("react");

// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
// Get elements
const input = document.getElementById("state-input");
const button = document.getElementById("fetch-alerts");
const display = document.getElementById("alerts-display");
const errorBox = document.getElementById("error-message");

// Show/hide error helpers
function showError(message) {
  display.innerHTML = "";            // clear previous results
  errorBox.textContent = message || "Something went wrong.";
  errorBox.classList.remove("hidden");
  console.log(message);
}

function hideError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

// Render alerts
function renderAlerts(data, state) {
  hideError();
  display.innerHTML = "";            // clear previous results

  const count = Array.isArray(data && data.features) ? data.features.length : 0;
  const title = (data && data.title) || `Current watches, warnings, and advisories for ${state}`;

  // Summary line
  const p = document.createElement("p");
  p.textContent = `${title}: ${count}`;
  display.appendChild(p);

  // Headlines list
  if (count > 0) {
    const ul = document.createElement("ul");
    data.features.forEach((f) => {
      const headline = f && f.properties && f.properties.headline;
      if (headline) {
        const li = document.createElement("li");
        li.textContent = headline;
        ul.appendChild(li);
      }
    });
    display.appendChild(ul);
  }
}

// Fetch alerts
function fetchWeatherAlerts(state) {
  const code = String(state || "").trim().toUpperCase();
  const url = `https://api.weather.gov/alerts/active?area=${encodeURIComponent(code)}`;

  return fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} — Failed to fetch alerts`);
      return res.json();
    })
    .then((data) => {
      console.log("Weather alerts data:", data);
      return data;
    });
}

// Button click handler
button.addEventListener("click", () => {
  const state = (input.value || "").trim();
  input.value = "";                  // clear input on click

  if (state.length !== 2) {
    showError("Please enter a valid 2-letter state code (e.g., NY).");
    return;
  }

  hideError();
  display.innerHTML = "<p>Loading…</p>";

  fetchWeatherAlerts(state)
    .then((data) => {
      renderAlerts(data, state.toUpperCase());
    })
    .catch((err) => {
      showError(err.message);
    });
});
