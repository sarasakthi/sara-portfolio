import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WeatherCard.css";

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API key from .env
  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

  // Fetch weather data
  const fetchWeather = async (lat, lon) => {
    if (!API_KEY) {
      setError("API key missing. Check your .env file.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Unable to fetch weather.");
    } finally {
      setLoading(false);
    }
  };

  // Get location and fetch weather
  useEffect(() => {
    const getWeather = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
          },
          () => {
            console.warn("Location access denied. Using Edmonton as fallback.");
            fetchWeather(53.5461, -113.4938); // Edmonton
          }
        );
      } else {
        console.warn("Geolocation not supported. Using Edmonton as fallback.");
        fetchWeather(53.5461, -113.4938); // Edmonton
      }
    };

    getWeather();
  }, []);

  if (loading)
    return (
      <div className="weather-card weather-loading">
        <div className="loading-content">
          <div className="spinner"></div>
          <span className="loading-text">Fetching your weather...</span>
        </div>
      </div>
    );

  if (error || !weatherData || !weatherData.main)
    return <div className="weather-card error">{error || "Weather unavailable."}</div>;

  const { temp } = weatherData.main;
  const { name } = weatherData;
  const weatherIcon = weatherData.weather?.[0]?.icon;

  return (
    <div className="weather-card">
      <div className="weather-header">
        {weatherIcon && (
          <img
            src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
            alt="Weather Icon"
            className="weather-icon"
          />
        )}
        <span className="weather-temp">
          {Math.round(temp)}°C
          <p className="weather-city">{name}</p>
        </span>
      </div>
      {/* Uncomment if you want description */}
      {/* <div className="weather-details">
        <p className="weather-desc">{weatherData.weather?.[0]?.description}</p>
      </div> */}
    </div>
  );
};

export default WeatherCard;
