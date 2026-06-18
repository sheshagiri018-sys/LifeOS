/* LifeOS – Weather (Open-Meteo, no API key) */
(function(){
  function setWeather(data){
    const wc=data.current_weather||{};
    const temp=Math.round(wc.temperature||0);
    const code=wc.weathercode||0;
    const daily=data.daily||{};
    document.getElementById('weatherTemp').textContent=temp+'°C';
    document.getElementById('weatherDesc').textContent=descFromCode(code);
    document.getElementById('weatherHumidity').textContent=(data.hourly&&data.hourly.relativehumidity_2m?data.hourly.relativehumidity_2m[0]:'--')+'%';
    document.getElementById('weatherWind').textContent=Math.round(wc.windspeed||0)+' km/h';
    if(daily.sunrise&&daily.sunrise[0]){
      const sr=new Date(daily.sunrise[0]);
      document.getElementById('weatherSunrise').textContent=sr.getHours()+':'+String(sr.getMinutes()).padStart(2,'0');
    }
    if(daily.sunset&&daily.sunset[0]){
      const ss=new Date(daily.sunset[0]);
      document.getElementById('weatherSunset').textContent=ss.getHours()+':'+String(ss.getMinutes()).padStart(2,'0');
    }
  }
  function descFromCode(c){
    if(c===0) return 'Clear sky';
    if(c<=2) return 'Partly cloudy';
    if(c===3) return 'Overcast';
    if(c<=49) return 'Foggy';
    if(c<=59) return 'Drizzle';
    if(c<=69) return 'Rainy';
    if(c<=79) return 'Snowy';
    if(c<=82) return 'Rain showers';
    if(c<=99) return 'Thunderstorm';
    return 'Clear';
  }
  function fetchWeather(lat,lon){
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&daily=sunrise,sunset&timezone=auto&forecast_days=1`;
    fetch(url).then(r=>r.json()).then(setWeather).catch(()=>{
      document.getElementById('weatherDesc').textContent='Enable location for weather';
    });
  }
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      p=>fetchWeather(p.coords.latitude,p.coords.longitude),
      ()=>fetchWeather(19.0760,72.8777) // Mumbai default
    );
  } else {
    fetchWeather(19.0760,72.8777);
  }
  // Productivity score chart
  const ctx=document.getElementById('scoreChart');
  if(ctx&&typeof Chart!=='undefined'){
    const tasks=DB.get('tasks',[]);
    const done=tasks.filter(t=>t.done).length;
    const total=tasks.length||1;
    const tp=Math.round((done/total)*100);
    const fp=DB.get('focus_sessions',0)*5;
    const hp=Math.min(100,DB.get('habits_done_today',0)*20);
    const score=Math.round((tp+fp+hp)/3);
    document.getElementById('prodScore').textContent=score;
    document.getElementById('tasksScore').textContent=tp+'%';
    document.getElementById('focusScore').textContent=Math.min(100,fp)+'%';
    document.getElementById('habitsScore').textContent=hp+'%';
    new Chart(ctx,{
      type:'doughnut',
      data:{
        datasets:[{
          data:[score,100-score],
          backgroundColor:['rgba(167,139,250,0.9)','rgba(255,255,255,0.05)'],
          borderWidth:0,
          borderRadius:99
        }]
      },
      options:{cutout:'78%',plugins:{legend:{display:false},tooltip:{enabled:false}},animation:{duration:1200}}
    });
  }
})();
