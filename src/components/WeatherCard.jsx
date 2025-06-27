import React, { useEffect, useState } from "react";
import axios from "axios";
import { dbFirebase } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import "./WeatherCard.css";

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState("");

  // Get API key from Firestore
  const fetchApiKey = async () => {
    try {
      const docRef = doc(dbFirebase, "storedcredentials", "openweathermap");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().apikey;
      } else {
        throw new Error("API key not found");
      }
    } catch (err) {
      console.error("Error fetching API key:", err);
      setError("Missing API key.");
    }
  };

  const fetchWeather = async (lat, lon, key) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
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

  useEffect(() => {
    const getWeatherWithKey = async () => {
      const key = await fetchApiKey();
      if (!key) return;

      setApiKey(key);

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeather(
              position.coords.latitude,
              position.coords.longitude,
              key
            );
          },
          () => {
            console.warn("Location access denied. Falling back to Edmonton.");
            fetchWeather(53.5461, -113.4938, key); // Edmonton
          }
        );
      } else {
        console.warn("Geolocation not supported. Using fallback.");
        fetchWeather(53.5461, -113.4938, key);
      }
    };

    getWeatherWithKey();
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
    return (
      <div className="weather-card error">
        {error || "Weather unavailable."}
      </div>
    );

  const { temp } = weatherData.main;
  // const description = weatherData.weather?.[0]?.description;

  return (
    <div className="weather-card">
      <div className="weather-header">
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          alt="Weather Icon"
          className="weather-icon"
        />
        <span className="weather-temp">
          {Math.round(temp)}°C
          <p className="weather-city">{weatherData.name}</p>
        </span>
      </div>
      {/* 
      <div className="weather-details">
        <p className="weather-desc">{description}</p>
      </div>
      */}
    </div>
  );
};

export default WeatherCard;
