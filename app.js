import { services } from "./js/services.js";

const getTimer = document.getElementById("openTimer")
const getDaysOpen = document.getElementById("daysOpen")

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

setInterval(() => {
    updateTimer();
    updateIsOpen();
}, 1000)


// Render services here

function renderServices () {
    const serviceSection = document.querySelector("#services");

    if (!serviceSection) {
        return
    }
    serviceSection.replaceChildren();

    services.forEach(service => {

        const card = document.createElement("div");
        card.id = "service-" + service.id;
        card.classList.add("service-card");

        card.addEventListener("click", () => {
            const details = card.querySelector(".service-details");
            details.classList.toggle("hidden");
        });

        const title = document.createElement("h3");
        title.textContent = service.title;

        const description = document.createElement("p");
        description.textContent = service.description;

        const price = document.createElement("span");
        price.textContent = `${service.price} kr/${service.frequency}`
        

        const details = document.createElement("div");
        details.classList.add("service-details", "hidden");
        details.textContent = service.detailedView;

        card.append(
            title,
            description,
            price,
            details
        );

        serviceSection.appendChild(card)
    });
}

renderServices();

//Render weather and location and if error and loading time

const searchWeather = document.getElementById("searchWeather");
const cityInput = document.getElementById("cityInput");

console.log(searchWeather)

if (searchWeather && cityInput) {
    searchWeather.addEventListener("click", async () => {

        const startTime = performance.now();

        const city = cityInput.value.trim();

        const laodingStatus = document.getElementById("loadingStatus");

        laodingStatus.textContent = "🔄 Hämtar väderdata...";

        cityInput.value = "";

        try {
            const geoResponse = await fetch (
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=sv&format=json`
            );

            const geoData = await geoResponse.json();
            console.log(geoData);
            
            if (!city){
                throw new Error("Du måste ange en ort!");
            }

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

            laodingStatus.textContent = "";

            createLocationWeather(location, weatherData, null, loadTime);

            } catch (error){

                laodingStatus.textContent = "";
                
                createLocationWeather(null, null, error);

            }
    });

}

//render out the data from the API

function createLocationWeather (location, weatherData, error, loadTime) {
        const weatherSection = document.getElementById("weather");
        const pasteWeather = document.createElement("p");
        if(!error){
            pasteWeather.textContent = `
            Ort & land: ${location.name} i ${location.country} | 
            Temperatur: ${weatherData.current.temperature_2m} 
            ${weatherData.current_units.temperature_2m} |
            Laddningstid: ${loadTime} ms
            `;
        } else {
            pasteWeather.textContent = error.message;
        }

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Ta bort"
        removeBtn.id = "removeBtn";

        weatherSection.append(pasteWeather, removeBtn)
        
        removeBtn.addEventListener("click", () => {
            pasteWeather.remove();
            removeBtn.remove();
        });

        return weatherSection
}