import { API_KEY } from "./API_KEY.js";

const cityInput = document.getElementById("cityInput");
const suggestionsBox = document.getElementById("suggestions");
const getWeatherBtn = document.getElementById("getWeather");
const useLocationBtn = document.getElementById("useLocation");
const recentList = document.getElementById("recentList");

const cityNameEl = document.getElementById("cityName");
const weatherDescEl = document.getElementById("weatherDesc");
const temperatureEl = document.getElementById("temperature");
const weatherIconEl = document.getElementById("weatherIcon");
const weatherDisplay = document.getElementById("weatherDisplay");

// Recent cities functionality
const saveRecentCity = (city) => {
    let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
    cities = cities.filter(c => c !== city);
    cities.unshift(city);
    if (cities.length > 5) cities.pop();
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
        li.className = "px-4 py-2 hover:bg-white/30 cursor-pointer";
        li.textContent = city;
        li.addEventListener("click", () => {
            cityInput.value = city;
            getWeatherByCity(city);
            recentList.classList.add("hidden");
        });
        recentList.appendChild(li);
    });
    
    recentList.classList.remove("hidden");
};

// Event listeners for recent searches
cityInput.addEventListener("focus", renderRecentCities);
cityInput.addEventListener("input", () => {
    if (cityInput.value.trim() === "") renderRecentCities();
});

document.addEventListener("click", (e) => {
    if (!e.target.closest("#recentDropdown") && !e.target.matches("#cityInput")) {
        recentList.classList.add("hidden");
    }
});

// Weather functionality
const getWeatherByCity = (city) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            updateUI(data);
            saveRecentCity(data.name);
            get5DayForecast(city);
        })
        .catch(() => alert("Weather data not found."));
};

const getWeatherByCoords = (lat, lon) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            updateUI(data);
            saveRecentCity(data.name);
        })
        .catch(() => alert("Unable to fetch weather for your location."));
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

// Forecast functionality
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

    const dailyData = forecastList.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 5);

    dailyData.forEach(item => {
        const date = new Date(item.dt_txt).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        const temp = `${Math.round(item.main.temp)}°C`;
        const wind = `${item.wind.speed} m/s`;
        const humidity = `${item.main.humidity}%`;
        const icon = item.weather[0].icon;

        const card = document.createElement("div");
        card.className = "p-4 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white/30 transition-all duration-300";

        card.innerHTML = `
            <div class="flex flex-col items-center space-y-3">
                <p class="text-sm font-semibold text-white/80">${date}</p>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" 
                     alt="${item.weather[0].description}" 
                     class="w-16 h-16 drop-shadow-lg">
                <p class="text-2xl font-bold">${temp}</p>
                
                <div class="w-full space-y-2 mt-2">
                    <div class="flex items-center justify-between text-sm">
                        <span class="flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M5 15l7-7 7 7"/>
                            </svg>
                            <span>Wind</span>
                        </span>
                        <span class="font-medium">${wind}</span>
                    </div>
                    
                    <div class="flex items-center justify-between text-sm">
                        <span class="flex items-center space-x-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                            </svg>
                            <span>Humidity</span>
                        </span>
                        <span class="font-medium">${humidity}</span>
                    </div>
                </div>
            </div>
        `;
        forecastContainer.appendChild(card);
    });
};

// Event listeners
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

// Initialize recent cities on load
window.addEventListener("load", () => {
    if (cityInput.value === "") renderRecentCities();
});