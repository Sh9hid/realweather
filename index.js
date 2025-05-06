import { API_KEY } from "./API_KEY.js";

const cityInput = document.getElementById("cityInput");
const suggestionsBox = document.getElementById("suggestions");
const getWeatherBtn = document.getElementById("getWeather");

// Autocomplete handler
cityInput.addEventListener("input", () => {
  const query = cityInput.value.trim();
  if (query.length < 2) {
    suggestionsBox.innerHTML = "";
    return;
  }

  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      suggestionsBox.innerHTML = "";
      data.forEach(location => {
        const option = document.createElement("div");
        option.className = "suggestion";
        option.textContent = `${location.name}, ${location.country}`;
        option.addEventListener("click", () => {
          cityInput.value = location.name;
          suggestionsBox.innerHTML = "";
        });
        suggestionsBox.appendChild(option);
      });
    })
    .catch(err => console.error("Error fetching suggestions:", err));
});

// Weather fetch handler
getWeatherBtn.addEventListener("click", () => {
  const inputValue = cityInput.value.trim();
  if (!inputValue) return alert("Enter a city");

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${API_KEY}&units=metric`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      alert(`Weather in ${data.name}: ${data.weather[0].description}, ${data.main.temp}°C`);
    })
    .catch(error => {
      alert("Could not fetch weather.");
      console.error(error);
    });
});
