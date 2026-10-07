import { updateTimer, updateIsOpen } from "../app.js";

setInterval(() => {
    updateTimer();
    updateIsOpen();
}, 1000)

