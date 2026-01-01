const API_KEY = '-----use your api key-------------';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getWeatherData(city) {
    try {
        const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) throw new Error('City not found');
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

export async function getForecastData(lat, lon) {
    try {
        // Using "forecast" endpoint for 5 day / 3 hour forecast
        const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!response.ok) throw new Error('Forecast data not found');
        return await response.json();
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        return null;
    }
}

export async function getAQIData(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        if (!response.ok) throw new Error('AQI data not found');
        return await response.json();
    } catch (error) {
        console.error('Error fetching AQI data:', error);
        return null;
    }
}
