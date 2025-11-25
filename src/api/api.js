


const API_KEY = "aa758761a898fe409f35add6c5c9ddd6";

const getWeather = async (city) => {
  const currentAPI = 
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  const forecastAPI = 
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

  const currentRes = await fetch(currentAPI);
  const current = await currentRes.json();

  const forecastRes = await fetch(forecastAPI);
  const forecastData = await forecastRes.json();

  
  const forecast = forecastData.list
    .filter(item => item.dt_txt.includes("12:00:00"))
    .slice(0, 5)
    .map(item => ({
      day: new Date(item.dt_txt).toLocaleDateString("en-US", { weekday: "long" }),
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      desc: item.weather[0].description
    }));

  return { current, forecast };
};

export default getWeather;
