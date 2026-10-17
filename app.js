import { services } from "./js/services.js";

const getTimer = document.getElementById("openTimer")
const getDaysOpen = document.getElementById("daysOpen")
console.log(getTimer)
console.log(getDaysOpen)

const openDays = ["Söndag", 
                  "Måndag", 
                  "Tisdag",
                  "Onsdag", 
                  "Torsdag",
                  "Fredag", 
                  "Lördag"
                ];

export function updateTimer() {
    const dateNow = new Date();

    getTimer.textContent = `Klockan är: ${dateNow.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })} och dagens Datum är: `;

    getTimer.textContent += `${dateNow.toLocaleDateString("sv-SE")}`
}

export function getTimeUntilClose () {
    const now= new Date();
    const nextClose = new Date ();

    if (nextClose.getDay() === 6) {
                nextClose.setHours(14, 0, 0, 0);
    } else {
                nextClose.setHours(18, 0, 0, 0);
    };

    const diff = nextClose - now;

    return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor(diff % (1000 * 60 * 60) / (1000 * 60)),
        seconds: Math.floor(diff % (1000 * 60) / 1000)
    }
}

export function updateIsOpen() {
    const dateToday = new Date()
    const dayToday = dateToday.getDay();
    const hourToday = dateToday.getHours();

    getDaysOpen.textContent = ""; 

    const li = document.createElement("li");

    li.textContent = `Idag är det ${openDays[dayToday]}`
    const isWeekday = 
        dayToday >= 1 &&
        dayToday <= 5 &&
        hourToday >= 7 &&
        hourToday < 18;

    const isSaturday = 
        dayToday === 6 &&
        hourToday >= 9 &&
        hourToday < 14;

    if (isWeekday || isSaturday) {
        const {hours, minutes, seconds} = getTimeUntilClose();

        li.textContent += ` - och vi stänger om ${hours} timmar, 
        ${minutes} minuter & ${seconds} sekunder - så vi har öppet 😀`;
    } else {
        const nextOpen = new Date();
        //om det är vardag före 07:00
        if (dayToday >= 1 && dayToday <= 5 && hourToday < 7) { 
            // Öppet
            nextOpen.setHours(7, 0, 0, 0);

        } else if (dayToday === 6 && hourToday < 9) {
            nextOpen.setHours(9, 0, 0, 0);
        } else {
            //Nästa dag kl 07:00
            nextOpen.setDate(nextOpen.getDate() + 1);
            
            if (nextOpen.getDay() === 6) {
                nextOpen.setHours(9, 0, 0, 0);
            } else {
                nextOpen.setHours(7, 0, 0, 0);
            }
            while (nextOpen.getDay() === 0) {
                nextOpen.setDate(nextOpen.getDate() + 1);
                nextOpen.setHours(7, 0, 0, 0);
            }
        }
        const diff = nextOpen - dateToday;

        const hours = Math.floor(diff/ (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000*60)/ 1000));

        li.textContent += ` - vi har stängt 💔
        Vi öppnar igen om ${hours} timmar, 
        ${minutes} minuter och ${seconds} sekunder. 💤`;

    }

    getDaysOpen.appendChild(li)
}

console.log(getTimer);
console.log(getDaysOpen);

setInterval(() => {
    updateTimer();
    updateIsOpen();
}, 1000)



class BuyList {
    constructor() {
        this.buyItem = 
        JSON.parse(localStorage.getItem("buyItem")) || [];
    }

    addBuyItem(buyItem) {
        this.buyItem.push(buyItem);

        localStorage.setItem(
            "buyItem",
            JSON.stringify(this.buyItem)
        );
    }

    getbuyItem() {
        return this.buyItem;
    }

    removeBuyItem(index) {
        this.buyItem.splice(index, 1);

        localStorage.setItem(
            "buyItem",
            JSON.stringify(this.buyItem)
        );
    }

    // getTotalPrice() {
    //     return this.buyItem.reduce(
    //         (sum, item) => sum + item.price,
    //         0
    //     );
    // }

}

console.log(JSON.parse(localStorage.getItem("buyItem")))

// Create buyList here
const buyList = new BuyList();

// Render buyList here

function renderBuyList () {
    const buyListSection = document.querySelector("#buyList");

    if (!buyListSection) {
        return;
    }

    buyListSection.innerHTML = "";

    const savedBuyList = buyList.getbuyItem();

    savedBuyList.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.title} - ${item.price} kr`;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Ta bort";

        removeBtn.addEventListener("click", () => {
            buyList.removeBuyItem(index);
            renderBuyList();
        });

        li.append(removeBtn);
        buyListSection.append(li);
    });

    let total = 0;

    savedBuyList.forEach(item => {
        total += item.price;
    });
    const sum = document.createElement("p");
    sum.textContent = `Totalt: ${total}`

    buyListSection.append(sum);
}
// Render buyList here
renderBuyList();

// Render services here

function createServices (services) {

    const serviceSection = document.querySelector("#services");

    if (!serviceSection) {
        return
    }

    const card = document.createElement("div");
    card.id = "service-" + services.id;
    card.classList.add("service-card");

    card.addEventListener("click", () => {
        const details = card.querySelector(".service-details");
        details.classList.toggle("hidden");
    });

    const title = document.createElement("h3");
    title.textContent = services.title;

    const description = document.createElement("p");
    description.textContent = services.description;

    const price = document.createElement("span");
    price.textContent = `${services.price} kr/${services.frequency}`
    
    const details = document.createElement("div");
    details.classList.add("service-details", "hidden");
    details.textContent = services.detailedView;

    //save buyList

    const addBtn = document.createElement("button");
    addBtn.textContent = "Köp";
    addBtn.classList.add("addBtn");

    addBtn.addEventListener("click", () => {

        buyList.addBuyItem({
                        id: services.id,
                        title: services.title,
                        price: services.price
                    });

        console.log(buyList)
        
        renderBuyList();
    });

    card.append(
        title,
        description,
        price,
        details,
        addBtn
    );

    const renderAll = serviceSection.appendChild(card);
    
    return renderAll
}

export function renderServices (services) {
    const isHomePage = window.location.pathname.includes("index");

    services.forEach(service => {
        // Alla tjänster ska renderas ut när man är i fliken tjänster annars är det 5 tjänster åp hemsidan
        if (service.id < 5 && isHomePage) {
            createServices(service);
        } else if (!isHomePage) {
            createServices(service)
        }
    });
}   


renderServices(services);

//Render weather and location and if error and loading time

const searchWeather = document.getElementById("searchWeather");
const cityInput = document.getElementById("cityInput");

console.log(searchWeather)

class WeatherList {
    constructor() {
        this.weatherData =
            JSON.parse(localStorage.getItem("weatherData")) || [];
    }

    addWeather(weather) {
        this.weatherData.push(weather);

        localStorage.setItem(
            "weatherData",
            JSON.stringify(this.weatherData)
        );
    }

    getWeather() {
        return this.weatherData;
    }

    removeWeather(index) {
        this.weatherData.splice(index, 1);

        localStorage.setItem(
            "weatherData",
            JSON.stringify(this.weatherData)
        );
    }
}

const weatherList = new WeatherList();

if (searchWeather && cityInput) {
    searchWeather.addEventListener("click", async () => {

        const startTime = performance.now();

        const city = cityInput.value.trim();

        const weatherSection = document.getElementById("renderWeather");
        const loadingStatus = document.createElement("p");
        loadingStatus.id = "loadingStatus";

        loadingStatus.textContent = "🔄 Hämtar väderdata...";

        weatherSection.prepend(loadingStatus);
        
        cityInput.value = "";

        try {

            if (!city){
                throw new Error("Du måste ange en ort!");
            }
            
            const geoResponse = await fetch (
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=sv&format=json`
            );

            const geoData = await geoResponse.json();
            console.log(geoData);

            // "" === false
            if(!geoData.results) {
                throw new Error(
                    `Ingen ort hittades: ${city}, vänligen skriv in en giltig ort!`
                );
                
            };

            const location = geoData.results[0];

            console.log(location.name)
            console.log(location.latitude)
            console.log(location.longitude)

            const weatherResponse = await fetch (
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,wind_speed_10m`
            );
            const weatherData = await weatherResponse.json();
            console.log(weatherData)

            const endTime = performance.now();

            const loadTime = (endTime - startTime).toFixed(2);

            loadingStatus.remove();

            createLocationWeather(location, weatherData, null, loadTime);

            weatherList.addWeather({
                city: location.name,
                country: location.country,
                temperature: weatherData.current.temperature_2m,
                unit: weatherData.current_units.temperature_2m,
                loadTime,
                searchedAt: new Date().toLocaleString("sv-SE")
            });

            } catch (error){

                loadingStatus.remove();
                
                createLocationWeather(null, null, error);

            }
    });

}

function renderStoredWeather() {

    const weatherSection = document.getElementById("renderWeather");
    
    if (!weatherSection) {
        return
    }

    weatherSection.innerHTML = "";

    const savedWeather = 
        weatherList.getWeather();

    savedWeather.forEach((weather, index) => {
        const weatherCard = document.createElement("div");

        const p = document.createElement("p");

        p.textContent = 
        `Ort & land: ${weather.city}
        - ${weather.country} |
        Temperatur:
        ${weather.temperature}${weather.unit} |
        Laddningstid:
        ${weather.loadTime} ms |
        Sökt: ${weather.searchedAt}`;
        
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Ta bort";

        removeBtn.addEventListener("click", () => {
            weatherList.removeWeather(index);
            renderStoredWeather();
        });
    
        weatherCard.append(p, removeBtn);
        weatherSection.append(weatherCard);
    });
}

renderStoredWeather();

//render out the data from the API

function createLocationWeather (location, weatherData, error, loadTime) {
        const weatherSection = document.getElementById("renderWeather");
        const pasteWeather = document.createElement("p");

        if(!error){
            pasteWeather.textContent = `
            Ort & land: ${location.name} - ${location.country} | 
            Temperatur: ${weatherData.current.temperature_2m} 
            ${weatherData.current_units.temperature_2m} |
            Laddningstid: ${loadTime} ms
            `;
        } else {
            pasteWeather.textContent = error.message;
        }

        const removeBtn = document.createElement("button");
        removeBtn.classList.add("removeBtn");
        removeBtn.textContent = "Ta bort";

        const weatherCard = document.createElement("div");

        weatherCard.append(pasteWeather, removeBtn);

        weatherSection.prepend(weatherCard);
        
        removeBtn.addEventListener("click", () => {
                weatherCard.remove();
        });

        return weatherSection
}