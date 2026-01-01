

// Map OpenWeatherMap icon codes to @bybas/weather-icons names
function getAnimatedIcon(code) {
    const mapping = {
        '01d': 'clear-day',
        '01n': 'clear-night',
        '02d': 'partly-cloudy-day',
        '02n': 'partly-cloudy-night',
        '03d': 'cloudy',
        '03n': 'cloudy',
        '04d': 'overcast',
        '04n': 'overcast',
        '09d': 'rain',
        '09n': 'rain',
        '10d': 'partly-cloudy-day-rain',
        '10n': 'partly-cloudy-night-rain',
        '11d': 'thunderstorms',
        '11n': 'thunderstorms',
        '13d': 'snow',
        '13n': 'snow',
        '50d': 'mist',
        '50n': 'mist'
    };
    // Default to clear-day if code not found
    return mapping[code] || 'clear-day';
}

function getIconUrl(code) {
    const iconName = getAnimatedIcon(code);
    return `https://cdn.jsdelivr.net/npm/@bybas/weather-icons@latest/production/fill/all/${iconName}.svg`;
}

export function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.innerText = message;
    errorDiv.style.display = 'block';

    // Auto-hide after 3 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

export function clearError() {
    const errorDiv = document.getElementById('error-message');
    errorDiv.innerText = '';
    errorDiv.style.display = 'none';
}

import { formatDate, formatTime, getDayName, getShortDate } from './utils.js';

export function updateCurrentWeather(data) {
    if (!data) return;

    document.getElementById('CityName').innerText = data.name;
    document.getElementById('CityTemp').innerText = Math.round(data.main.temp);

    // Update main icon
    const mainIcon = document.getElementById('mainWeatherIcon');
    if (mainIcon) {
        mainIcon.src = getIconUrl(data.weather[0].icon);
        mainIcon.style.display = 'block';
    }

    document.getElementById('SkyDesc').innerText = data.weather[0].description;

    document.getElementById('date').innerText = formatDate(data.dt);
    document.getElementById('time').innerText = formatTime(data.dt);

    if (data.sys) {
        document.getElementById('sunriseTime').innerText = formatTime(data.sys.sunrise);
        document.getElementById('sunsetTime').innerText = formatTime(data.sys.sunset);
    }
}

export function updateMetrics(data) {
    if (!data) return;

    const metricsContainer = document.querySelector('.rowOne');
    metricsContainer.innerHTML = `
        <div class="extraMetric d-flex gap-2">
            <img src="assets/images/wind.png" alt="wind" width="35px">
            <div>
                <h6 class="m-0">Wind Speed</h6>
                <h6 class="m-0">${data.wind.speed} m/s</h6>
            </div>
        </div>
        <div class="extraMetric d-flex gap-2">
            <img src="assets/images/images.png" alt="humidity" width="35px" style="filter: hue-rotate(180deg);">
            <div>
                <h6 class="m-0">Humidity</h6>
                <h6 class="m-0">${data.main.humidity}%</h6>
            </div>
        </div>
        <div class="extraMetric d-flex gap-2">
            <img src="assets/images/images.png" alt="pressure" width="35px" style="filter: sepia(1);">
            <div>
                <h6 class="m-0">Pressure</h6>
                <h6 class="m-0">${data.main.pressure} hPa</h6>
            </div>
        </div>
        <div class="extraMetric d-flex gap-2">
            <img src="assets/images/images.png" alt="visibility" width="35px">
            <div>
                <h6 class="m-0">Visibility</h6>
                <h6 class="m-0">${(data.visibility / 1000).toFixed(1)} km</h6>
            </div>
        </div>
    `;
}

export function updateAQI(data) {
    if (!data || !data.list || !data.list[0]) return;

    const list = data.list[0].components;

    $('#no2')[0].innerText = 'NO2';
    $('#no2Value')[0].innerText = list.no2;

    $('#o3')[0].innerText = 'O3';
    $('#o3Value')[0].innerText = list.o3;

    $('#co')[0].innerText = 'CO';
    $('#coValue')[0].innerText = list.co;

    $('#so2')[0].innerText = 'SO2';
    $('#so2Value')[0].innerText = list.so2;
}

export function updateForecast(data) {
    if (!data || !data.list) return;

    // 5 Day Forecast (Taking one reading per day, e.g., noon)
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    const forecastContainer = document.querySelector('.nextFiveDays .d-flex.flex-column.gap-2');

    // Clear existing hardcoded rows except the specific structure if needed, 
    // but easier to rebuild the inner HTML
    forecastContainer.innerHTML = '';

    dailyData.slice(0, 5).forEach(day => {
        const temp = Math.round(day.main.temp);
        const dayName = getDayName(day.dt);
        const dateStr = getShortDate(day.dt);
        const icon = getIconUrl(day.weather[0].icon);

        const row = `
            <div class="foreCastRow d-flex allign-items-center justify-content-between">
                <div class="d-flex gap-3 allign-items-center">
                    <img src="${icon}" alt="weather icon" width="35px">
                    <h6 class="m-0">${temp}&deg;C</h6>
                </div>
                <h6 class="m-0">${dayName}</h6>
                <h6 class="m-0">${dateStr}</h6>
            </div>
        `;
        forecastContainer.innerHTML += row;
    });

    // Today's Hourly Forecast (next few API steps)
    const hourlyContainer = document.querySelector('.todayTempParentDiv');
    hourlyContainer.innerHTML = '';

    data.list.slice(0, 6).forEach(item => {
        const time = formatTime(item.dt);
        const temp = Math.round(item.main.temp);
        const icon = getIconUrl(item.weather[0].icon);

        const card = `
            <div class="todayTemp">
                <h6 class="m-0">${time}</h6>
                <img src="${icon}" alt="weather" width="35px">
                <h5>${temp}&deg;C</h5>
            </div>
        `;
        hourlyContainer.innerHTML += card;
    });
}
