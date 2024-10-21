const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const dateInput = document.getElementById('date-input');
const weatherBox = document.getElementById('weather-box');
const notFound = document.getElementById('not-found');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const weatherImage = document.getElementById('weather-image');
const details = document.getElementById('weather-details');

searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    const date = dateInput.value;

    if (!city || !date) {
        alert("Please enter both city and date.");
        return;
    }

    const APIKey = 'f70c4cecc558e3bda578ea5ec2db6ba3';
    const endpoint = `https://api.weatherapi.com/v1/forecast.json?key=6d625ca188234ab9b80140640242010&q=${city}&dt=${date}`;

    fetchWeatherData(endpoint);
});

function fetchWeatherData(endpoint) {
    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(json => {
            console.log(json);
            handleWeatherResponse(json);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            displayNotFound();
        });
}

function handleWeatherResponse(json) {
    if (json.error) {
        displayNotFound();
        return;
    }

    notFound.style.display = 'none';
    weatherBox.style.display = 'block'; 
    details.style.display = 'block';

    const temp = json.forecast.forecastday[0].day.avgtemp_c;
    temperature.innerHTML = `${temp}<span>°C</span>`;
    
    const forecastDay = json.forecast.forecastday[0];
    description.innerHTML = `${forecastDay.day.condition.text}`;
    humidity.innerHTML = `${forecastDay.day.avghumidity}%`;
    windSpeed.innerHTML = `${forecastDay.day.maxwind_kph} Km/h`;
    weatherImage.src = `https:${forecastDay.day.condition.icon}`;
}

function displayNotFound() {
    notFound.style.display = 'block';
    weatherBox.style.display = 'none';
}
