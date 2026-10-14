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
console.log(dateInput)

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

const contactResults = document.getElementById("kontakt-resultat");

class NewBooking {
    constructor () {
        this.name = bookingField.name.value,
        this.email = bookingField.email.value,
        this.phone = bookingField.phone.value,
        this.dogName = bookingField.dogName.value,
        this.date = bookingField.date.value,
        this.delete = bookingField.delete,
        this.message = messageTextarea.value,

        this.service = serviceOptions
        .filter(service => service.checked)
        .map(service => service.value)
        .join(" "),

        this.prio = prioOptions.find(prio => prio.checked)?.value || ""
    }

    getFormattedDate(dateValue) {
        const date = new Date(dateValue);

        const datePart = date.toLocaleDateString("sv-SE");

        const weekday = date.toLocaleDateString("sv-SE", {
            weekday: "long",
        });

        const time = date.toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
        }).replace(":", ".");

        return `${datePart} (${weekday}) kl. ${time}`;
    }
    
    isFutureBooking() {
        return new Date(this.date) > new Date();
    }

    static daysUntilBooking(dateValue) {
        const now = new Date();
        const bookingDate = new Date(dateValue);

        const diff = bookingDate - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${days} dagar, ${hours} timmar & ${minutes} minuter`
    }

    isAtLeast24HoursAhead() {
        const bookingDate = new Date(this.date);
        const now = new Date();

        const diffHours = (bookingDate - now) / (1000 * 60 * 60);

        return diffHours >= 24;
    }

    isValidBooking() {
        return this.isFutureBooking() &&
        this.isAtLeast24HoursAhead();
    }
    
    getNewBooking () {
        return {
            name: this.name,
            email: this.email,
            phone: this.phone,
            dogName: this.dogName,
            date: this.date,
            formattedDate: this.getFormattedDate(this.date),
            delete: this.delete,
            message: this.message,
            service: this.service,
            prio: this.prio
        };
    }
}

dateInput.addEventListener("input", () => {
    const booking = new NewBooking();

    if (!booking.isValidBooking()) {
        alert("Bokningar måste göras minst 24 timmar i förväg.");
        
        dateInput.value = "";
    }
});

function saveBooking () {
    const booking = new NewBooking();

    bookingList.addBooking(booking.getNewBooking());

    contactForm.reset();

    console.log("Saved booking:", bookingList)
}

class BookingList {
    constructor() {
        this.bookings = 
        JSON.parse(localStorage.getItem("bookings")) || [];
    }

    addBooking(booking) {
        this.bookings.push(booking);

        localStorage.setItem(
            "bookings",
            JSON.stringify(this.bookings)
        );
    }

    getbookings() {
        return this.bookings;
    }

    removeBooking(index) {
        this.bookings.splice(index, 1);

        localStorage.setItem(
            "bookings",
            JSON.stringify(this.bookings)
        );
    }
}

const bookingList = new BookingList();

function updateBooking() {

    //Get bookings
    const savedBookings = bookingList.getbookings();

    console.log(savedBookings)
    
    contactResults.innerHTML = "";

    if (savedBookings.length === 0 ) {
        contactResults.textContent = "Du har inga bokningar"
    }

    savedBookings.forEach((booking, index) => {
        const bookingItem = document.createElement("li");
        
        const deletedItmes = deleteItem(index);

        bookingItem.innerHTML = `<strong> Prioritet:</strong> (${booking.prio})<br>
       <strong> Ditt namn:</strong> ${booking.name} <br> 
       <strong> Hundens namn:</strong> ${booking.dogName} <br> 
        <strong>Din bokade tid är:</strong> ${booking.formattedDate} <br>
        <strong>Dagar & Timmar kvar:</strong> 
        ${NewBooking.daysUntilBooking(booking.date)} <br>
        <strong>Bokade aktiviteter:</strong> ${booking.service} <br>
        <strong>Meddelande:</strong> ${booking.message}
        `;
        contactResults.append(bookingItem, deletedItmes);
    }); 
}

function createDeleteButtons () {
    const deleteBooking = document.createElement("button");
        deleteBooking.textContent = "Ta bort";
    return deleteBooking
}

function deleteItem (index) {
    const deleteButton = createDeleteButtons();
    
    deleteButton.addEventListener("click", () => {
        bookingList.removeBooking(index);
        
        contactResults.innerHTML= "";
        
        updateBooking();
    });
    
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

