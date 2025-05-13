# Real Weather 🌦️  

A sleek and responsive weather application offering real-time updates, 5-day forecasts, geolocation support, and persistent search history. Built with modern web technologies and powered by the OpenWeatherMap API.

[![Live Demo](https://img.shields.io/badge/demo-live-green?style=for-the-badge)](https://sh9hid.github.com/realweather)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![image](https://github.com/user-attachments/assets/240fb238-ab50-41f4-ab4d-a333af21b17e)


---

## 🌟 Features

### 🌤️ Real-Time Weather
- Current temperature (°C/°F toggle support)
- Weather condition descriptions
- Wind speed and humidity
- Dynamic weather icons

### 📅 5-Day Forecast
- Daily weather cards
- Date and weekday display
- Min/max temperatures
- Forecast-specific icons
- Wind and humidity metrics
- Responsive grid layout

### 📍 Geolocation Support
- Auto-detects user’s location
- Browser permission handling
- Fallbacks for denied access
- Real-time location-based weather

### 🔍 Search Functionality
- Autocomplete for cities
- Search history (last 5 cities)
- localStorage persistence
- Clickable recent searches
- Search suggestion overlay

### 🎨 Design & UX
- Gradient background animations
- Glassmorphism-inspired card UI
- Smooth transitions and hover effects
- Responsive mobile-first design
- Loading states and error feedback

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- npm v12+
- OpenWeatherMap API key (free from [openweathermap.org](https://openweathermap.org/api))
- Tailwind CSS

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/weather-app.git
cd weather-app

# Install dependencies
npm install
```
## ⚙️ Customization

- **Tailwind Styling**: Modify `tailwind.config.js`
- **Background Gradients**: Edit `index.html`
- **Forecast Days**: Change `slice(0, 5)` in the `renderForecast()` function
- **Search History**: Customize the localStorage key
- **Animation Timing**: Tweak global CSS variables or transition durations

---

## 🛠 Tech Stack

### Frontend
- HTML5 (semantic)
- Tailwind CSS
- Vanilla JavaScript (ES6+)
- Web APIs (Geolocation, localStorage)

### Backend/API Services
- **OpenWeatherMap API**
  - Current Weather
  - 5-Day/3-Hour Forecast
  - Geocoding

### Tooling
- npm (package manager)
- GitHub Actions (CI/CD)
- ESLint & Prettier

---

## 🤝 Contributing

We welcome your contributions! Here's how you can help:

1. **Fork the project**
2. **Create a branch for your feature**:
   ```bash
   git checkout -b feature/your-feature-name

## TODO:
- Beautify the design with tailwind for the app. 

