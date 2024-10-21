const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input'); // Get the city input field
const alertsList = document.getElementById('alerts-list'); // Get the alerts list element
const modal = document.getElementById('alert-modal'); // Get the modal
const modalTitle = document.getElementById('modal-title'); // Get the modal title
const modalDescription = document.getElementById('modal-description'); // Get the modal description
const modalEffective = document.getElementById('modal-effective'); // Get the modal effective date
const closeModal = document.getElementsByClassName('close')[0]; // Get the close button

searchButton.addEventListener('click', () => {
    const cityName = cityInput.value; // Get the value from the input field
    if (!cityName) {
        alert("Please enter a city name."); // Alert if no city name is entered
        return;
    }

    const apiKey = "f70c4cecc558e3bda578ea5ec2db6ba3"; // Your API key
    const apiUrl = `http://api.weatherapi.com/v1/alerts.json?key=6d625ca188234ab9b80140640242010&q=${cityName}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            alertsList.innerHTML = ''; 
            if (data.alerts && data.alerts.alert && data.alerts.alert.length > 0) {
                data.alerts.alert.forEach(alt => {
                    const listItem = document.createElement('li'); // Create a new list item
                    listItem.textContent = `${alt.headline} - ${alt.desc} (Effective: ${alt.effective})`; // Set the alert message
                    alertsList.appendChild(listItem); // Append the list item to the alerts list
                });
            } else {
                alertsList.innerHTML = '<li>No alerts available for this city.</li>'; // Message if no alerts found
            }
        })
        .catch(error => {
            console.error("Error fetching alerts:", error);
            alert("Failed to fetch alerts. Please try again.");
        });
});