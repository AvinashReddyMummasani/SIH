// static/js/weather.js
async function loadWeather() {
    const main = document.getElementById("main-content");
    main.innerHTML = `
        <h2>Weather</h2>
        <div style="margin-bottom:15px;">
            <input type="text" id="city" placeholder="Enter city (India)" 
                style="padding:10px;font-size:1rem;width:60%;border-radius:8px;border:1px solid #555;">
            <button id="getWeatherBtn" 
                style="padding:10px 20px;font-size:1rem;border:none;border-radius:8px;background:#0288d1;color:white;cursor:pointer;">Get Weather</button>
        </div>
        <div id="weather-result" style="margin-top:20px;font-size:1.1rem;"></div>
        <canvas id="weatherChart" style="max-width:100%;margin-top:30px;"></canvas>
    `;

    document.getElementById("getWeatherBtn").onclick = async () => {
        const city = document.getElementById("city").value.trim();
        const resultEl = document.getElementById("weather-result");

        if (!city) { 
            alert("Please enter a city in India!"); 
            return; 
        }

        //uses key here
        const apiKey = "3061a1e8e998cb704a999093e947b7ac";
        const weatherUrl =`https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&appid=${apiKey}&units=metric`;

        try {
            // ✅ Call Flask route instead of OpenWeather directly
            const res = await fetch(weatherUrl);
            const data = await res.json();

            if (data.cod !== "200") { 
                resultEl.innerHTML = `<p style="color:red;">❌ City not found! Please check spelling (e.g., Hyderabad, Mumbai, Delhi).</p>`; 
                return; 
            }

            // 🌤️ Current Weather
            const current = data.list[0];
            resultEl.innerHTML = `
                <div style="background:#b2dfdb;padding:15px;border-radius:10px;">
                    <h3>Current Weather in ${data.city.name}</h3>
                    🌡️ Temp: ${current.main.temp}°C<br>
                    🌤️ Condition: ${current.weather[0].description}<br>
                    💧 Humidity: ${current.main.humidity}%<br>
                    🌬️ Wind: ${current.wind.speed} m/s
                </div>
            `;

            // 📊 Forecast Data
            const forecastData = [], labels = [], humidity = [], rain = [];
            for (let i = 0; i < data.list.length; i += 8) {
                const day = data.list[i];
                labels.push(day.dt_txt.split(" ")[0]);
                forecastData.push(day.main.temp);
                humidity.push(day.main.humidity);
                rain.push(day.rain ? day.rain["3h"] || 0 : 0);
            }

            // 💡 Smart Advisory
            let advisory = "✅ All conditions normal.";
            const highTemp = forecastData.some(t => t > 35);
            const rainTomorrow = rain[1] > 0;
            const cloudy3Days = forecastData.filter(t => t < 25).length >= 3;

            if (rainTomorrow) advisory = "🌧️ Rain tomorrow - avoid plowing today.";
            else if (highTemp) advisory = "☀️ High temperature - mulch soil to retain moisture.";
            else if (cloudy3Days) advisory = "☁️ Cloudy for 3 days - watch out for fungal growth.";

            const advisoryDiv = document.createElement("div");
            advisoryDiv.innerHTML = `<h3>Smart Advisory:</h3><p style="font-weight:bold;color:#d32f2f;">${advisory}</p>`;
            resultEl.appendChild(advisoryDiv);

            // 📈 Chart
            const ctx = document.getElementById("weatherChart").getContext("2d");
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        { label: 'Temp (°C)', data: forecastData, borderColor: '#e53935', backgroundColor: '#ef9a9a', fill: false },
                        { label: 'Humidity (%)', data: humidity, borderColor: '#1e88e5', backgroundColor: '#90caf9', fill: false },
                        { label: 'Rain (mm)', data: rain, borderColor: '#43a047', backgroundColor: '#a5d6a7', fill: false }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: { 
                        title: { display: true, text: '5-Day Weather Forecast', font: { size: 18 } } 
                    },
                    interaction: { mode: 'index', intersect: false },
                    scales: { y: { beginAtZero: true } }
                }
            });

        } catch (err) {
            resultEl.innerHTML = `<p style="color:red;">⚠️ Error fetching weather! Check your internet or try again.</p>`;
            console.error(err);
        }
    };
}

// async function loadWeather(){
//     const main = document.getElementById("main-content");
//     main.innerHTML = `
//         <h2>Weather</h2>
//         <div style="margin-bottom:15px;">
//             <input type="text" id="city" placeholder="Enter city (India)" 
//                 style="padding:10px;font-size:1rem;width:60%;border-radius:8px;border:1px solid #555;">
//             <button id="getWeatherBtn" 
//                 style="padding:10px 20px;font-size:1rem;border:none;border-radius:8px;background:#0288d1;color:white;cursor:pointer;">Get Weather</button>
//         </div>
//         <div id="weather-result" style="margin-top:20px;font-size:1.1rem;"></div>
//         <canvas id="weatherChart" style="max-width:100%;margin-top:30px;"></canvas>
//     `;

//     document.getElementById("getWeatherBtn").onclick = async () => {
//         const city = document.getElementById("city").value.trim();
//         const resultEl = document.getElementById("weather-result");

//         if (!city) { 
//             alert("Please enter a city in India!"); 
//             return; 
//         }

//         // ✅ Use FARMGUIDEAPI key
//         const apiKey = "bf25d4e6cc7c392e885660693e67b31b";
//         const weatherUrl =" https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&appid=${apiKey}&units=metric";

//         try {
//             const res = await fetch(weatherUrl);
//             const data = await res.json();

//             if (data.cod !== "200") { 
//                 resultEl.innerHTML = <p style="color:red;">❌ City not found! Please check spelling (e.g., Hyderabad, Mumbai, Delhi).</p>; 
//                 return; 
//             }

//             // 🌤 Current Weather
//             const current = data.list[0];
//             resultEl.innerHTML = `
//                 <div style="background:#b2dfdb;padding:15px;border-radius:10px;">
//                     <h3>Current Weather in ${data.city.name}</h3>
//                     🌡 Temp: ${current.main.temp}°C<br>
//                     🌤 Condition: ${current.weather[0].description}<br>
//                     💧 Humidity: ${current.main.humidity}%<br>
//                     🌬 Wind: ${current.wind.speed} m/s
//                 </div>
//             `;

//             // 📊 Forecast Data
//             const forecastData = [], labels = [], humidity = [], rain = [];
//             for (let i = 0; i < data.list.length; i += 8) {
//                 const day = data.list[i];
//                 labels.push(day.dt_txt.split(" ")[0]);
//                 forecastData.push(day.main.temp);
//                 humidity.push(day.main.humidity);
//                 rain.push(day.rain ? day.rain["3h"] || 0 : 0);
//             }

//             // 💡 Smart Advisory
//             let advisory = "✅ All conditions normal.";
//             const highTemp = forecastData.some(t => t > 35);
//             const rainTomorrow = rain[1] > 0;
//             const cloudy3Days = forecastData.filter(t => t < 25).length >= 3;

//             if (rainTomorrow) advisory = "🌧 Rain tomorrow - avoid plowing today.";
//             else if (highTemp) advisory = "☀ High temperature - mulch soil to retain moisture.";
//             else if (cloudy3Days) advisory = "☁ Cloudy for 3 days - watch out for fungal growth.";

//             const advisoryDiv = document.createElement("div");
//             advisoryDiv.innerHTML = `<h3>Smart Advisory:</h3><p style="font-weight:bold;color:#d32f2f;">${advisory}</p>`;
//             resultEl.appendChild(advisoryDiv);

//             // 📈 Chart
//             const ctx = document.getElementById("weatherChart").getContext("2d");
//             new Chart(ctx, {
//                 type: 'line',
//                 data: {
//                     labels: labels,
//                     datasets: [
//                         { label: 'Temp (°C)', data: forecastData, borderColor: '#e53935', backgroundColor: '#ef9a9a', fill: false },
//                         { label: 'Humidity (%)', data: humidity, borderColor: '#1e88e5', backgroundColor: '#90caf9', fill: false },
//                         { label: 'Rain (mm)', data: rain, borderColor: '#43a047', backgroundColor: '#a5d6a7', fill: false }
//                     ]
//                 },
//                 options: {
//                     responsive: true,
//                     plugins: { 
//                         title: { display: true, text: '5-Day Weather Forecast', font: { size: 18 } } 
//                     },
//                     interaction: { mode: 'index', intersect: false },
//                     scales: { y: { beginAtZero: true } }
//                 }
//             });

//         } catch (err) {
//             resultEl.innerHTML = <p style="color:red;">⚠ Error fetching weather! Check your internet or try again.</p>;
//             console.error(err);
//         }
//     };
// }