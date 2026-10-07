const getTimer = document.getElementById("openTimer")
const getDaysOpen = document.getElementById("daysOpen")

const openDays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"]
console.log(openDays.length)

function updateTimer() {
    const dateNow = new Date();

    getTimer.textContent = `Klockan är: ${dateNow.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })} och dagens Datum är: `;

    getTimer.textContent += `${dateNow.toLocaleDateString("sv-SE")}`
}

function updateIsOpen() {
    const dateToday = new Date()
    const dayToday = new Date().getDay();
    const hourToday = new Date().getHours();
    const timeToday = new Date().toLocaleTimeString();
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
        li.textContent += ` - och klockan är ${timeToday} - så vi har öppet`;
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
            while (nextOpen.getDate() === 0) {
                nextOpen.setDate(nextOpen.getDate() + 1);
                nextOpen.setHours(7, 0, 0, 0);
            }
        }
        const diff = nextOpen - dateToday;
  
        const hours = Math.floor(diff/ (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000*60)/ 1000));

        li.textContent += ` - vi har stängt. Vi öppnar igen om ${hours} timmar, 
        ${minutes} minuter och ${seconds} sekunder.`;
    }

    getDaysOpen.appendChild(li)
}

setInterval(() => {
    updateTimer();
    updateIsOpen();

}, 1000)

const getServiceOne = document.getElementById("service-1")
const getServiceTwo = document.getElementById("service-2")
const getServiceThree = document.getElementById("service-3")
const getServiceFour = document.getElementById("service-4")

getServiceOne.addEventListener("click", () => {

})