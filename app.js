const statusEl = document.getElementById("status");
const currentEl = document.getElementById("currentWeather");
const forecastEl = document.getElementById("forecast");
const refreshButton = document.getElementById("refreshButton");
const FALLBACK_LOCATION = {
  name: "Tallinn, Eesti",
  latitude: 59.437,
  longitude: 24.7536,
};

const WEATHER_CODES_ET = {
  0: "Selge",
  1: "Peamiselt selge",
  2: "Vahelduv pilvisus",
  3: "Pilves",
  45: "Udu",
  48: "Jäätuv udu",
  51: "Nõrk uduvihm",
  53: "Mõõdukas uduvihm",
  55: "Tugev uduvihm",
  56: "Nõrk jäätuv uduvihm",
  57: "Tugev jäätuv uduvihm",
  61: "Nõrk vihm",
  63: "Mõõdukas vihm",
  65: "Tugev vihm",
  66: "Nõrk jäätuv vihm",
  67: "Tugev jäätuv vihm",
  71: "Nõrk lumesadu",
  73: "Mõõdukas lumesadu",
  75: "Tugev lumesadu",
  77: "Lumeterad",
  80: "Nõrk hoovihm",
  81: "Mõõdukas hoovihm",
  82: "Tugev hoovihm",
  85: "Nõrk lörtsisadu",
  86: "Tugev lörtsisadu",
  95: "Äike",
  96: "Äike koos rahega",
  99: "Tugev äike koos rahega",
};

refreshButton.addEventListener("click", () => {
  loadWeather();
});

function getWeatherText(code) {
  return WEATHER_CODES_ET[code] || "Tundmatu ilm";
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b42318" : "";
}

function formatDay(dateStr) {
  return new Date(dateStr).toLocaleDateString("et-EE", { weekday: "long" });
}

async function fetchWeather(lat, lon) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", lat);
  url.searchParams.set("longitude", lon);
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m"
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max"
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "4");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Ilmaandmete päring ebaõnnestus");
  }
  return response.json();
}

function renderCurrent(data, locationLabel) {
  const current = data.current;
  currentEl.classList.remove("hidden");

  currentEl.innerHTML = `
    <article class="metric">
      <p class="label">Temperatuur</p>
      <p class="value">${Math.round(current.temperature_2m)} °C</p>
    </article>
    <article class="metric">
      <p class="label">Tajutav</p>
      <p class="value">${Math.round(current.apparent_temperature)} °C</p>
    </article>
    <article class="metric">
      <p class="label">Ilm</p>
      <p class="value">${getWeatherText(current.weather_code)}</p>
    </article>
    <article class="metric">
      <p class="label">Tuul</p>
      <p class="value">${Math.round(current.wind_speed_10m)} m/s</p>
    </article>
    <article class="metric">
      <p class="label">Õhuniiskus</p>
      <p class="value">${Math.round(current.relative_humidity_2m)} %</p>
    </article>
    <article class="metric">
      <p class="label">Asukoht</p>
      <p class="value">${locationLabel}</p>
    </article>
  `;
}

function renderForecast(data) {
  const { time, weather_code, temperature_2m_max, temperature_2m_min, wind_speed_10m_max } =
    data.daily;

  forecastEl.innerHTML = "";

  for (let i = 1; i <= 3; i += 1) {
    const card = document.createElement("article");
    card.className = "day-card";
    card.innerHTML = `
      <h3>${formatDay(time[i])}</h3>
      <p>${getWeatherText(weather_code[i])}</p>
      <p>Min: ${Math.round(temperature_2m_min[i])} °C</p>
      <p>Max: ${Math.round(temperature_2m_max[i])} °C</p>
      <p>Tuul: ${Math.round(wind_speed_10m_max[i])} m/s</p>
    `;
    forecastEl.appendChild(card);
  }
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolokatsioon ei ole toetatud."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

async function loadWeather() {
  setStatus("Asukoha küsimine...");
  currentEl.classList.add("hidden");
  forecastEl.innerHTML = "";

  try {
    let lat;
    let lon;
    let locationLabel;

    try {
      const position = await getCurrentPosition();
      lat = position.coords.latitude.toString();
      lon = position.coords.longitude.toString();
      locationLabel = `${Number(lat).toFixed(2)}, ${Number(lon).toFixed(2)}`;
      setStatus("Ilmaandmete laadimine...");
    } catch (geoError) {
      lat = FALLBACK_LOCATION.latitude.toString();
      lon = FALLBACK_LOCATION.longitude.toString();
      locationLabel = FALLBACK_LOCATION.name;
      setStatus("Asukohta ei leitud, kasutan Tallinna andmeid.");
    }

    const data = await fetchWeather(lat, lon);
    renderCurrent(data, locationLabel);
    renderForecast(data);
    if (locationLabel === FALLBACK_LOCATION.name) {
      setStatus("Uuendatud (Tallinn, Eesti).");
    } else {
      setStatus("Uuendatud.");
    }
  } catch (error) {
    setStatus(
      "Ei saanud ilma laadida. Kontrolli asukoha luba ja internetiühendust.",
      true
    );
  }
}

loadWeather();
