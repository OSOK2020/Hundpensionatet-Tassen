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
