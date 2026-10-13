const descriptions = [
    {   id: 1,
        longVersions:
            `
            Nina och Hans är grundarna bakom Tassen och det internationellt välkända forskningsinstitutet Ericssons Dogs.
            `,
        shortVersion: `Nina är specialistveterinär och huvudforskare på Ericssons Dogs. Hans är veterinär, entreprenör och VD. Tillsammans grundade de både Tassen och det globala forskningsinstitutet Ericssons Dogs. Med över tio års gemensamt arbete driver de utvecklingen inom hundhälsa, forskning och omsorg världen över. 🐾`
    },

    {
        id: 2,
        longVersions:
                    ` 
            Nina är specialistveterinär med inriktning på hundhälsa och fungerar som huvudforskare vid Ericssons Dogs. Genom sitt arbete leder Nina forskning kring hundars välbefinnande, beteende, träning och hälsa.
            `
    },

    {
        id: 3,
        longVersions:
                               ` 
            Hans är entreprenör, veterinär och verkställande direktör. Hans ansvarar för den strategiska utvecklingen av både Tassen och Ericssons Dogs, samt samarbeten med hunddagis, hundpensionat och forskningsanläggningar världen över.
            `
    },

    {
        id: 4,
        longVersions:
            `
            Tillsammans grundade Nina och Hans Ericssons Dogs, som idag är ett globalt forskningsinstitut med verksamhet i nära anslutning till tusentals hunddagis och hundpensionat runt om i världen.
            `
    },
    {
        id: 5,
        longVersions:
            `
            Nina och Hans har varit gifta i tio år och träffades under sina studier till veterinärer på Nackademin. Deras gemensamma passion för hundars hälsa och välbefinnande lade grunden för både deras liv tillsammans och deras framgångsrika verksamheter.
            `
    },

]

function renderDescriptions () {
    const omOssCardSelection = document.querySelector("#descriptions");

    omOssCardSelection.replaceChildren();

    descriptions.forEach( description => {

        const omOssCard = document.createElement("div");
        omOssCard.id = "omOssCard-" + description.id;
        omOssCard.classList.add("omOssCard-card");
        
        const toggleDetails = document.createElement("button");
        toggleDetails.classList.add("toggleDetails-Btn")
        toggleDetails.textContent = "Visa mer"

        toggleDetails.addEventListener("click", () => {
            details.classList.toggle("hidden");
            if (details.classList.contains("hidden")) {
                toggleDetails.textContent = "Visa mer"
            } else {
                toggleDetails.textContent = "Visa mindre"
            }
        });
        
        const shortVersion = document.createElement("h2");
        shortVersion.textContent = description.shortVersion;

        const details = document.createElement("h3");
        details.classList.add("omOssCard-details", "hidden");
        details.innerHTML = description.longVersions;


        omOssCard.append(
            shortVersion,
            toggleDetails,
            details
        );
        omOssCardSelection.appendChild(omOssCard);
    });
}

renderDescriptions();