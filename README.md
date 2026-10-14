# Hundpensionatet-Tassen
Starta projektet: 

Öppna index.html direkt eller starta Live Server i VS Code.

Reflektion:

Det svåraste var att arbeta med localStorage och API-anrop. Jag lärde mig mycket om DOM-manipulation och asynkron JavaScript.

Beskrivning av en bugg:

Jag hade problem med att väder-API:t inte gav några resultat. Efter felsökning med console.log upptäckte jag att geoData.results kunde vara undefined. Jag lade därför till en kontroll innan geoData.results[0] användes. Därefter fungerade applikationen korrekt. ``