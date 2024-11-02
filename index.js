const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const widgetContainer = document.getElementById('openweathermap-widget-11'); // Reference to the widget container
const sidenav = document.querySelector('.sidenav');
const saveLocationButton = document.querySelector('.save-location'); // Reference to the save button

// Add this function to your existing index.js file
const toggleButton = document.createElement('button');
toggleButton.innerText = 'Switch to °F';
toggleButton.classList.add('toggle-temp');
document.body.appendChild(toggleButton);

let isCelsius = true;

toggleButton.addEventListener('click', () => {
    isCelsius = !isCelsius; // Toggle the temperature unit
    toggleButton.innerText = isCelsius ? 'Switch to °F' : 'Switch to °C'; // Update button text

    // Update displayed temperatures
    const temperatureElements = document.querySelectorAll('.temperature');
    temperatureElements.forEach(tempElement => {
        const currentTemp = parseFloat(tempElement.innerText);
        if (isCelsius) {
            tempElement.innerHTML = `${Math.round((currentTemp - 32) * 5 / 9)}<span>°C</span>`;
        } else {
            tempElement.innerHTML = `${Math.round(currentTemp * 9 / 5 + 32)}<span>°F</span>`;
        }
    });

    // Update the weather widget with the new unit
    const cityId = isFuturePage ? json.city.id : json.id; // Get city ID for future weather
    updateWeatherWidget(cityId); // Call to update the widget with new city ID
});

// Add this function to save the location
function saveLocation(city) {
    let savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];
    if (!savedLocations.includes(city)) {
        savedLocations.push(city);
        localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
        updateSavedLocations();
    }
}

// Add this function to update the saved locations display
function updateSavedLocations() {
    const savedLocationsContainer = document.querySelector('.saved-locations ul');
    savedLocationsContainer.innerHTML = ''; // Clear existing locations
    const savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];
    savedLocations.forEach(location => {
        const locationItem = document.createElement('li');
        locationItem.textContent = location;
        locationItem.addEventListener('click', () => {
            document.querySelector('.search-box input').value = location; // Set input to saved location
            search.click();
         } );// Trigger search
        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-location'); // Add a class for styling
        deleteButton.addEventListener('click', () => {
            deleteLocation(location); // Call the delete function
        });

        locationItem.appendChild(deleteButton); // Append the delete button to the location item
        savedLocationsContainer.appendChild(locationItem);
    });
}

// Function to delete a saved location
function deleteLocation(city) {
    let savedLocations = JSON.parse(localStorage.getItem('savedLocations')) || [];
    savedLocations = savedLocations.filter(location => location !== city); // Remove the city
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations)); // Update local storage
    updateSavedLocations(); // Refresh the displayed list
}

search.addEventListener('click', () => {
    const city = document.querySelector('.search-box input').value;

    if (city === '') return;

    const APIKey = 'f70c4cecc558e3bda578ea5ec2db6ba3';

    // Check if we are on future.html
    const isFuturePage = window.location.pathname.includes('future.html');

    const endpoint = isFuturePage 
        ? `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}` 
        : `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`;

    fetch(endpoint)
        .then(response => response.json())
        .then(json => {
            console.log(json); // Log the response to check city ID and data
            if (json.cod !== 200) {
                container.style.height = '400px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none';
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                console.error(json.message);
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const cityId = isFuturePage ? json.city.id : json.id; // Get city ID for future weather

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            if (isFuturePage) {
                const forecast = json.list[0];
                const temp = isCelsius ? forecast.main.temp : (forecast.main.temp * 9 / 5) + 32;
                image.src = getWeatherImage(forecast.weather[0].main);
                temperature.innerHTML = `${parseInt(temp)}<span>${isCelsius ? '°C' : '°F'}</span>`;
                description.innerHTML = `${forecast.weather[0].description}`;
                humidity.innerHTML = `${forecast.main.humidity}%`;
                wind.innerHTML = `${parseInt(forecast.wind.speed)}Km/h`;
            } else {
                const temp = isCelsius ? json.main.temp : (json.main.temp * 9 / 5) + 32;
                image.src = getWeatherImage(json.weather[0].main);
                temperature.innerHTML = `${parseInt(temp)}<span>${isCelsius ? '°C' : '°F'}</span>`;
                description.innerHTML = `${json.weather[0].description}`;
                humidity.innerHTML = `${json.main.humidity}%`;
                wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;
            }

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';

            updateWeatherWidget(cityId); // Use the city ID here
            console.log("Updating widget for city ID:", cityId); // Log city ID

            // Update the widget container when location is updated
            widgetContainer.innerHTML = ''; // Clear previous widget
            updateWeatherWidget(cityId); // Call to update the widget with new city ID
        })
        .catch(error => console.error('Error fetching weather data:', error));
});

// Call this function on page load to display saved locations
document.addEventListener('DOMContentLoaded', updateSavedLocations);

function getWeatherImage(weatherCondition) {
    switch (weatherCondition) {
        case 'Clear':
            return 'images/clear.png';
        case 'Rain':
            return 'images/rain.png';
        case 'Snow':
            return 'images/snow.png';
        case 'Clouds':
            return 'images/cloud.png';
        case 'Haze':
            return 'images/mist.png';
        default:
            return '';
    }
}

function updateWeatherWidget(cityId) {
    window.myWidgetParam = [];
    window.myWidgetParam.push({
        id: 11,
        cityid: cityId, // Use the city ID from the response
        appid: 'f70c4cecc558e3bda578ea5ec2db6ba3',
        units: isCelsius ? 'metric' : 'imperial', // Use 'imperial' for Fahrenheit
        containerid: 'openweathermap-widget-11',
    });

    const oldScript = document.querySelector('script[src*="weather-widget-generator.js"]');
    if (oldScript) {
        oldScript.remove();
    }
    const script = document.createElement('script');
    script.async = true;
    script.charset = "utf-8";
    script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
    document.body.appendChild(script);
}

// Expand the sidenav on mouse over
sidenav.addEventListener('mouseover', () => {
    sidenav.style.width = '250px'; // Expand on mouse enter
    sidenav.querySelector('h2').style.opacity = '1'; // Show title
    sidenav.querySelector('ul').style.opacity = '1'; // Show menu
});

// Shrink the sidenav on mouse out
sidenav.addEventListener('mouseout', () => {
    sidenav.style.width = '60px'; // Shrink on mouse leave
    sidenav.querySelector('h2').style.opacity = '0'; // Hide title
    sidenav.querySelector('ul').style.opacity = '0'; // Hide menu
});

saveLocationButton.addEventListener('click', () => {
    const city = document.querySelector('.search-box input').value;
    if (city === '') return; // Do nothing if input is empty
    saveLocation(city); // Save the location only when button is clicked
});
