const API_KEY = 'NSR0qT5SiVI3YA9sG1s6pMkp7YtywVv9';

const city = document.getElementById('city');
const currentTempElement = document.getElementById('current-temp');
const minTempElement = document.getElementById('min-temp');
const maxTempElement = document.getElementById('max-temp');
const precipitationElement = document.getElementById('prec');

navigator.geolocation.watchPosition(async(position) => {
    const { latitude, longitude } = position.coords;
    console.log(latitude);
    console.log(longitude);
    const weatherData = await getWeather(latitude, longitude);
    console.log(weatherData);
    currentTempElement.innerText = `${weatherData.current.temperature_2m} ${weatherData.current_units.temperature_2m}`;
    minTempElement.innerText = `${weatherData.daily.temperature_2m_min[0]} ${weatherData.daily_units.temperature_2m_min}`;
    maxTempElement.innerText = `${weatherData.daily.temperature_2m_max[0]} ${weatherData.daily_units.temperature_2m_max}`;
    precipitationElement.innerText = `${weatherData.current.precipitation} ${weatherData.current_units.precipitation}`;


    const reverseUrl = new URL('/v2/reverse','https://api.geocodify.com');
    reverseUrl.searchParams.set('api_key',API_KEY);
    reverseUrl.searchParams.set('lat',latitude);
    reverseUrl.searchParams.set('lng',longitude);
    const response = await fetch(reverseUrl);
    if(response.ok){
        const geoData = await response.json();
        city.innerText = `${geoData.response.features[0].properties.name}`;
        
    }
});

async function getWeather(lat, long) {
    const url = new URL("/v1/forecast", "https://api.open-meteo.com");
    url.searchParams.set("latitude", lat); 
    url.searchParams.set("longitude", long); 
    url.searchParams.set( 
        "current",
        "temperature_2m,precipitation,rain,showers,snowfall,cloud_cover" 
    );
    url.searchParams.set( 
        "daily",
        "temperature_2m_max,temperature_2m_min,precipitation_sum" 
    );
    url.searchParams.set("timezone","Europe/Berlin"); 
    url.searchParams.set("forecast_days", "7"); 
    const request = new Request(url); 
    const response = await fetch(request); 
    if (response.ok) {
    return response.json(); 
    } else {
        console.log(response.status);
        throw new Error("Network Error")
    };
}
    