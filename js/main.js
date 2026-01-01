import { getWeatherData, getForecastData, getAQIData } from './api.js';
import { updateCurrentWeather, updateMetrics, updateAQI, updateForecast, showError, clearError } from './ui.js';

async function fetchAllData(city) {
    try {
        clearError();
        const weatherData = await getWeatherData(city);

        // Check if API returned an error (like 404)
        if (weatherData.cod && weatherData.cod !== 200) {
            throw new Error(weatherData.message || "City not found");
        }

        updateCurrentWeather(weatherData);
        updateMetrics(weatherData);

        const { lat, lon } = weatherData.coord;

        const forecastData = await getForecastData(lat, lon);
        updateForecast(forecastData);

        const aqiData = await getAQIData(lat, lon);
        updateAQI(aqiData);

    } catch (error) {
        showError(error.message === "City not found" ? "City not found. Please try again." : "An error occurred. Check connection.");
        console.error(error);
    }
}

document.querySelector('.searchIcon').addEventListener('click', () => {
    const city = document.querySelector('.inputfield').value;
    if (city) fetchAllData(city);
});

document.querySelector('.inputfield').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = e.target.value;
        if (city) fetchAllData(city);
    }
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    fetchAllData('London'); // Default city
});
