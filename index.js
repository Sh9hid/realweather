import { API_KEY } from "./API_KEY.js"

const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${API_KEY}`;


// Make a GET request
fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data.city.name);
  })
  .catch(error => {
    console.error('Error:', error);
  });