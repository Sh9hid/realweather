import { API_KEY } from "./API_KEY.js";

const cityInput = document.getElementById("cityInput");
const suggestionsBox = document.getElementById("suggestions");
const getWeatherBtn = document.getElementById("getWeather");
const useLocationBtn = document.getElementById("useLocation");

const cityNameEl = document.getElementById("cityName");
const weatherDescEl = document.getElementById("weatherDesc");
const temperatureEl = document.getElementById("temperature");
const weatherIconEl = document.getElementById("weatherIcon");
const weatherDisplay = document.getElementById("weatherDisplay");

const getWeatherByCity = (city) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      updateUI(data);
    })
    .catch(() => alert("Weather data not found."));
};

const getWeatherByCoords = (lat, lon) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      updateUI(data);
    })
    .catch(() => alert("Unable to fetch weather for your location."));
};

const updateUI = (data) => {
  weatherDisplay.classList.remove("hidden");

  cityNameEl.textContent = data.name;
  weatherDescEl.textContent = data.weather[0].description;
  temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;

  const iconCode = data.weather[0].icon;
  weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
};

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
      data.forEach(loc => {
        const option = document.createElement("div");
        option.textContent = `${loc.name}, ${loc.country}`;
        option.className = "px-4 py-2 hover:bg-white/30 cursor-pointer";
        option.addEventListener("click", () => {
          cityInput.value = loc.name;
          suggestionsBox.innerHTML = "";
          getWeatherByCity(loc.name);
        });
        suggestionsBox.appendChild(option);
      });
    });
});

getWeatherBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeatherByCity(city);
});

useLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      (error) => {
        console.error(error);
        alert("Unable to retrieve your location. Please allow permission.");
      }
    );
  });