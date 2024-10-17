const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

search.addEventListener('click', () => {
    const city = document.querySelector('.search-box input').value;

    if (city === '') return;

    const APIKey = 'f70c4cecc558e3bda578ea5ec2db6ba3';

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
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

            const cityId = json.id; // Get city ID directly

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/clear.png';
                    break;

                case 'Rain':
                    image.src = 'images/rain.png';
                    break;

                case 'Snow':
                    image.src = 'images/snow.png';
                    break;

                case 'Clouds':
                    image.src = 'images/cloud.png';
                    break;

                case 'Haze':
                    image.src = 'images/mist.png';
                    break;

                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';

            updateWeatherWidget(cityId); // Use the city ID here
            console.log("Updating widget for city ID:", cityId); // Log city ID
        })
        .catch(error => console.error('Error fetching weather data:', error));
});

function updateWeatherWidget(cityId) {
    window.myWidgetParam = [];
    window.myWidgetParam.push({
        id: 11,
        cityid: cityId, // Use the city ID from the response
        appid: 'f70c4cecc558e3bda578ea5ec2db6ba3',
        units: 'metric',
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
