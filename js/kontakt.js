import { updateTimer, updateIsOpen } from "../app.js";

setInterval(() => {
    updateTimer();
    updateIsOpen();
}, 1000)

const contactForm = document.getElementById("kontakt");
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
    date: dateInput,
    delete: false
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

const showBookings = document.getElementById("show-Btn");

const prioLow = document.getElementById("low");
const prioMedium = document.getElementById("medium");
const prioHigh = document.getElementById("high");

const prioOptions = [
    prioLow,
    prioMedium,
    prioHigh
];

// const sendBtn = document.getElementById("send-Btn");

const contactResults = document.getElementById("kontakt-resultat");

function saveToLocalStorage (items) {
    return localStorage.setItem("bookings", JSON.stringify(items))
} 

function saveBooking () {

    const newBooking = {
        name: bookingField.name.value,
        email: bookingField.email.value,
        phone: bookingField.phone.value,
        dogName: bookingField.dogName.value,
        date: bookingField.date.value,
        delete: bookingField.delete,
        message: messageTextarea.value,
        service: serviceOptions
        .filter(service => service.checked)
        .map(service => service.value),
        prio: prioOptions.find(prio => prio.checked)?.value || ""
    }

    const savedBookings = getBookingsFromLocalStorage();
    console.log(savedBookings)

    savedBookings.push(newBooking);

    console.log(savedBookings)

    saveToLocalStorage(savedBookings)

    contactForm.reset();

    console.log("Saved booking:" + newBooking)
}

function getBookingsFromLocalStorage() {
       const savedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
       return savedBookings
}

function updateBooking() {
    //Get bookings
    const savedBookings = getBookingsFromLocalStorage();


    console.log(savedBookings)
    
    contactResults.innerHTML = "";

    if (savedBookings.length === 0 ) {
        contactResults.textContent = "Du har inga bokningar"
    } 

    savedBookings.forEach((booking) => {
        const bookingItem = document.createElement("li");
        
        const deletedItmes = deleteItem();

        bookingItem.textContent = `
        ${booking.name} - ${booking.dogName} - ${booking.date}
        ${booking.message}
        `
        contactResults.append(bookingItem, deletedItmes);
    }); 
}

function createDeleteButtons () {
    const deleteBooking = document.createElement("button");
        deleteBooking.textContent = "Ta bort";
    return deleteBooking
}

function deleteItem () {
    const deleteButton = createDeleteButtons();
    const savedBookings = getBookingsFromLocalStorage();
    
    deleteButton.addEventListener("click", () => {
        savedBookings.forEach(booking => {

            booking.delete = true;
            
            saveToLocalStorage(booking)
            
            if (booking.delete === true) {
                const updateBookings = savedBookings.filter(
                    item => item !== booking
                );
                
                saveToLocalStorage(updateBookings);
                
                contactResults.innerHTML = "";

                updateBooking();
            }
        })
    })
    
    return deleteButton
};

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveBooking();
    updateBooking();
});

showBookings.addEventListener("click", (event) => {
    event.preventDefault();
    updateBooking();
})

