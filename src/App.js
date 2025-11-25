


import "./App.css";
import { Search, MapPin, Wind } from "react-feather";
import getWeather from "./api/api";
import { useState, useRef } from "react";
import dateFormat from "dateformat";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [history, setHistory] = useState([]);

  const weatherRef = useRef(null);

  const scrollToWeather = () => {
    if (weatherRef.current) {
      weatherRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getWeatherbyCity = async () => {
    if (!city) return;
    await fetchWeather(city);
    scrollToWeather();
  };

  const loadFromHistory = async (cityName) => {
    await fetchWeather(cityName);
    scrollToWeather();
  };

  const fetchWeather = async (cityName) => {
    const data = await getWeather(cityName);

    if (data && data.current) {
      setWeather(data.current);
      setForecast(data.forecast);

      setHistory((prev) => {
        const newItem = {
          city: cityName,
          temp: data.current.main.temp,
          icon: data.current.weather[0].icon,
          desc: data.current.weather[0].description,
        };

        const filtered = prev.filter((item) => item.city !== cityName);
        return [newItem, ...filtered];
      });
    }

    setCity("");
  };

  const renderDate = () => {
    return dateFormat(new Date(), "dddd, mmmm dS, h:MM TT");
  };

  return (
    <div className="app">

      <h1>Weather App</h1>

      <div className="input-wrapper">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter City Name"
        />
        <button onClick={getWeatherbyCity}>
          <Search />
        </button>
      </div>

      {history.length > 0 && (
        <div className="history-box">
          <h3>Search History</h3>

          <ul>
            {history.map((item, index) => (
              <li key={index} onClick={() => loadFromHistory(item.city)}>
                <div className="history-item">
                  <img
                    src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                    alt="icon"
                  />
                  <div>
                    <h4>{item.city}</h4>
                    <p>{item.temp}°C • {item.desc}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {weather && weather.weather && (
        <div className="content" ref={weatherRef}>
          <div className="location">
            <MapPin />
            <h2>
              {weather.name} <span>({weather.sys.country})</span>
            </h2>
          </div>

          <p className="datetext">{renderDate()}</p>

          <div className="weatherdesc">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather_image"
            />
            <h3>{weather.weather[0].description}</h3>
          </div>

          <div className="tempstats">
            <h1>{weather.main.temp}°C</h1>
            <h3>Feels Like {weather.main.feels_like}°C</h3>
          </div>

          <div className="windstats">
            <Wind />
            <h3>Wind {weather.wind.speed} Knots at {weather.wind.deg}°</h3>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast-section">
          <h2>5-Day Forecast</h2>

          <div className="forecast-row">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-card">
                <h4>{day.day}</h4>

                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                  alt="forecast icon"
                />

                <p>{day.temp}°C</p>
                <span>{day.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!weather.weather && (
        <div className="content">
          <h4>No Data Found!</h4>
        </div>
      )}
    </div>
  );
}

export default App;
