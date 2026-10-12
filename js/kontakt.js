import { updateTimer, updateIsOpen } from "../app.js";

setInterval(() => {
    updateTimer();
    updateIsOpen();
}, 1000)

const kontaktForm = document.getElementById("kontakt");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dogNameInput = document.getElementById("dogName");
const dateInput = document.getElementById("date");

const bookingField = {
    name: nameInput,
    email: emailInput,
    phone: phoneInput,
    dogName: dogNameInput,
    date: dateInput
}

const kindergardenCheckbox = document.getElementById("kindergarden");
const dogWalkCheckbox = document.getElementById("dog-walk");
const dogPensionCheckbox = document.getElementById("dog-pension");
const dogActivityCheckbox = document.getElementById("dog-activity");

const serviceOptions = [
    kindergardenCheckbox,
    dogWalkCheckbox,
    dogPensionCheckbox,
    dogActivityCheckbox
];

const messageTextarea = document.getElementById("message");

const saveBtn = document.getElementById("save-Btn");

const prioLow = document.getElementById("low");
const prioMedium = document.getElementById("medium");
const prioHigh = document.getElementById("high");

const prioOptions = [
    prioLow,
    prioMedium,
    prioHigh
];

const sendBtn = document.getElementById("send-Btn");

const contactResults = document.getElementById("kontakt-resultat");

function saveBooking () {

    const newBooking = {
        name: bookingField.name,
        email: bookingField.email,
        phone: bookingField.phone,
        dogName: bookingField.dogName,
        date: bookingField.date
    }

    const savedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    console.log(savedBookings.length)

    savedBookings.push(newBooking);

    localStorage.setItem("bookings", JSON.stringify(savedBookings));

    console.log("Saved name:" + newBooking)
}

saveBtn.addEventListener("click", saveBooking);

function updateBooking() {
    //Get bookings
    const savedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
        console.log(savedBookings.length)
        console.log(savedBookings)
    
        contactResults.innerHTML = "";

    if (savedBookings.length === 0 ) {
        contactResults.textContent = "Du har inga bokningar"
    } 

    savedBookings.forEach((booking) => {
        const bookingItem = document.createElement("li");
        bookingItem.textContent = `
        ${booking.name} - ${booking.dogName} - ${booking.date}
        `
        contactResults.appendChild(bookingItem);
    }); 
}

updateBooking();
