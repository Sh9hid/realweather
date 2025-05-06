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
      saveRecentCity(data.name);
      get5DayForecast(city); // Add 5-day forecast
    })
      
    // .catch(() => alert("Weather data not found."));
};

const getWeatherByCoords = (lat, lon) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      updateUI(data);
      saveRecentCity(data.name);
    })
      
    // .catch(() => alert("Unable to fetch weather for your location."));
};

const updateUI = (data) => {
    weatherDisplay.classList.remove("hidden");
  
    cityNameEl.textContent = `${data.name} (${new Date().toISOString().split("T")[0]})`;
    weatherDescEl.textContent = data.weather[0].description;
    temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
  
    const windEl = document.getElementById("windSpeed");
    const humidityEl = document.getElementById("humidity");
  
    windEl.textContent = `Wind: ${data.wind.speed} m/s`;
    humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
  
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
    const recentList = document.getElementById("recentList");

// Helper to store recent cities (max 5)
const saveRecentCity = (city) => {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  cities = cities.filter(c => c !== city); // remove duplicate
  cities.unshift(city);
  if (cities.length > 5) cities.pop(); // limit to 5
  localStorage.setItem("recentCities", JSON.stringify(cities));
  renderRecentCities();
};

const renderRecentCities = () => {
  const cities = JSON.parse(localStorage.getItem("recentCities")) || [];
  recentList.innerHTML = "";
  if (cities.length === 0) {
    recentList.classList.add("hidden");
    return;
  }

  cities.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.className = "px-4 py-2 hover:bg-white/30 cursor-pointer";
    li.addEventListener("click", () => {
      cityInput.value = city;
      getWeatherByCity(city);
      recentList.classList.add("hidden");
    });
    recentList.appendChild(li);
  });

  recentList.classList.remove("hidden");
};
const get5DayForecast = (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        renderForecast(data.list);
      })
      .catch(() => console.log("Forecast not available"));
  };
  
  const renderForecast = (forecastList) => {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "";
  
    // Filter 12:00 pm forecasts of next 5 days
    const dailyData = forecastList.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);
  
    dailyData.forEach(item => {
      const date = new Date(item.dt_txt).toISOString().split("T")[0];
      const temp = `${Math.round(item.main.temp)}°C`;
      const wind = `Wind: ${item.wind.speed} m/s`;
      const humidity = `Humidity: ${item.main.humidity}%`;
      const icon = item.weather[0].icon;
  
      const card = document.createElement("div");
      card.className = "p-4 bg-white/10 rounded shadow text-sm";
  
      card.innerHTML = `
        <p>${date}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon" class="mx-auto">
        <p>${temp}</p>
        <p>${wind}</p>
        <p>${humidity}</p>
      `;
      forecastContainer.appendChild(card);
    });
  };
  
  });