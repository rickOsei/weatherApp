const key = '4145b306d0ddecc38dfe589459ede210';
const input = document.querySelector('input');


async function search() {
    const phrase = input.value;
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`);
    const data = await response.json();
    let ul = document.querySelector('ul');
    ul.innerHTML = '';
    for (let element of data) {
        ul.innerHTML += `<li 
        data-lat =${element.lat} 
        data-lon = ${element.lon} 
        data-name = ${element.name} > 
        ${element.name} 
        <span>${element.country}</span>
        </li>`
    }

    // for (let element of data) {
    //     const {name,lon,lat,country} = element;
    //     ul.innerHTML += `<li 
    //     data-lat ='${lat}'
    //     data-lon = '${lon}'
    //     data-name = '${name}'> 
    //     ${name} 
    //     <span>${country}</span>
    //     </li>`;
    // }
}

const debouncedSearch = _.debounce(() => {
    search();
}, 600);

input.addEventListener('keyup', debouncedSearch);

async function showWeather(lat,lon,name) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
    const data = await response.json();
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = Math.round(data.main.humidity);
    const wind = Math.round(data.wind.speed);
    const icon = data.weather[0].icon;

    document.getElementById('city').innerHTML = name;
    document.getElementById('degrees').innerHTML = temp + '&#8451;';
    document.getElementById('feelsLikeValue').innerHTML = feelsLike + '<span class="measurement">&#8451;</span>';
    document.getElementById('humidityValue').innerHTML = humidity + '<span class="measurement">%</span>';
    document.getElementById('windValue').innerHTML = wind + '<span class="measurement">km/h</span>';
    document.getElementById('icon').src = `http://openweathermap.org/img/wn/${icon}@4x.png`;
    document.querySelector('form').style.display = 'none'
    document.getElementById('weather').style.display = 'block'
}

document.body.addEventListener('click', e=>{
    const li = e.target;
    const {lat, lon, name} = li.dataset;
    localStorage.setItem('lat', lat)
    localStorage.setItem('lon', lon)
    localStorage.setItem('name', name)
    if(!lat) {
        return;
    }

    showWeather(lat,lon,name);
});

document.getElementById('btn').addEventListener('click', ()=>{
    document.querySelector('form').style.display = 'block'
    document.getElementById('weather').style.display = 'none'
})


document.body.onload = ()=>{
    if(localStorage.getItem('lat')){
        const lat = localStorage.getItem('lat');
        const lon = localStorage.getItem('lon');
        const name = localStorage.getItem('name');
        showWeather(lat,lon,name)
    }
};

