#Hundpensionatet Tassen
Starta projektet

Öppna index.html direkt i webbläsaren.

För väderfunktionen (Open-Meteo API) behöver projektet köras med Live Server i VS Code eftersom fetch() inte fungerar via file://.

Beskrivning

Detta projekt är en kundsida för Hundpensionatet Tassen. Syftet är att ge besökare information om verksamheten, visa aktuella öppettider, låta användaren skapa bokningsförfrågningar och se aktuellt väder.

Projektet är byggt med:

HTML
CSS
JavaScript
localStorage
Open-Meteo API
Reflektion

Det svåraste med projektet var att arbeta med localStorage och att hålla bokningslistan synkroniserad med användargränssnittet. I början tog jag bort element direkt från DOM:en, vilket gjorde att data och gränssnitt ibland hamnade i otakt. Genom att istället uppdatera arrayen först, spara till localStorage och sedan rendera om listan lärde jag mig vikten av att låta datan vara sanningen.

Jag lärde mig också mer om asynkron JavaScript genom väderfunktionen där jag använde fetch(), async/await och felhantering med try/catch.

Beskrivning av en bugg

Jag hade problem med att väder-API:t inte gav några resultat när användaren skrev in en ort som inte existerade. I konsolen upptäckte jag med console.log() att geoData.results kunde vara undefined. När koden försökte läsa geoData.results[0] uppstod därför ett fel.

För att lösa problemet lade jag till en kontroll som säkerställde att results existerade innan första objektet användes. Om ingen ort hittades visas nu ett felmeddelande i gränssnittet istället för att sidan kraschar.

Scope och this

I projektet använder jag en klass för att hantera bokningar. Inuti klassens metoder används this.bookings för att komma åt objektets egna data.

JavaScript
removeBooking(index) {
this.bookings.splice(index, 1);
localStorage.setItem(
"bookings",
JSON.stringify(this.bookings)
);
}

this syftar här på den aktuella instansen av klassen. Det gör att metoden alltid arbetar med rätt bokningslista utan att behöva skicka runt arrayen mellan olika funktioner. Jag valde denna lösning eftersom den gör koden mer organiserad och lättare att underhålla.

Val av layout

Jag använde CSS Grid för att visa tjänsterna eftersom flera kort med samma struktur passar bra i ett rutnät. Grid gör det enkelt att visa flera tjänster bredvid varandra på större skärmar och automatiskt stapla dem under varandra på mobil.

För vissa mindre delar av sidan använde jag även Flexbox för att centrera innehåll och placera element i kolumn.

Val av loop

När bokningslistan renderas används forEach().

JavaScript
this.bookings.forEach((booking, index) => {
// skapa och rendera bokning
});

Jag valde forEach() eftersom jag vill utföra en åtgärd för varje bokning i arrayen. Funktionen gör koden lättläst och passar bättre än en traditionell for-loop när man inte behöver hantera räknaren manuellt.

Funktioner som återanvänds

Projektet innehåller flera återanvändbara funktioner:

renderBookings()
saveBookings()
updateIsOpen()
updateTimer()

Dessa används på flera ställen i applikationen och hjälper till att hålla koden organiserad.