// ==========================================================================
// CONFIGURARE ADRESA EMAIL ADMINISTRATOR
// Schimba adresa de mai jos cu adresa ta reala de email!
// ==========================================================================
const ADMIN_EMAIL = "contact@holdismobility.ro";

// Seteaza anul curent automat in subsolul paginii (Footer)
const yearSpan = document.getElementById("currentYear");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Functie care preselecteaza pachetul si elementele sale cand utilizatorul apasa pe un card
function preselectPackage(packageName) {
    const checkboxes = document.querySelectorAll('input[name="elemente"]');
    
    // Debifam tot mai intai
    checkboxes.forEach(cb => cb.checked = false);

    const silverItems = [
        "2 mânere de sprijin în baie",
        "Taburet de duș",
        "Cadru de sprijin pentru toaletă",
        "Covoraș antiderapant"
    ];

    const goldItems = [
        ...silverItems,
        "Mână curentă de până la 1,5 m (interior)",
        "Mâner de sprijin lângă pat",
        "Organizarea cablurilor existente",
        "Reorganizarea mobilierului"
    ];

    const platinumItems = [
        ...goldItems,
        "Balustradă inox de până la 2 m (scară exterioară)"
    ];

    let itemsToSelect = [];

    if (packageName === "Silver") {
        document.getElementById("radio-silver").checked = true;
        itemsToSelect = silverItems;
    } else if (packageName === "Gold") {
        document.getElementById("radio-gold").checked = true;
        itemsToSelect = goldItems;
    } else if (packageName === "Platinum") {
        document.getElementById("radio-platinum").checked = true;
        itemsToSelect = platinumItems;
    }

    checkboxes.forEach(cb => {
        if (itemsToSelect.includes(cb.value)) {
            cb.checked = true;
        }
    });

    // Derulam lin pagina pana la formularul de configurare
    document.getElementById("configurator").scrollIntoView({ behavior: "smooth" });
}

// Gestionarea trimiterii formularului pe email
const form = document.getElementById("customPackageForm");

if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Preluam pachetul de baza selectat
        const pachetBaza = document.querySelector('input[name="pachet_baza"]:checked').value;

        // Preluam toate elementele bifate
        const checkedBoxes = document.querySelectorAll('input[name="elemente"]:checked');
        let elementeSelectate = [];
        checkedBoxes.forEach(box => elementeSelectate.push("- " + box.value));

        const listaElementeText = elementeSelectate.length > 0 
            ? elementeSelectate.join("\n") 
            : "- Niciun element individual bifat (se dorește consiliere la evaluare)";

        // Preluam datele de contact
        const nume = document.getElementById("nume").value.trim();
        const telefon = document.getElementById("telefon").value.trim();
        const localitate = document.getElementById("localitate").value.trim();
        const emailClient = document.getElementById("email_client").value.trim() || "Nespecificat";
        const mesaj = document.getElementById("mesaj").value.trim() || "Fără observații suplimentare.";

        // Construim subiectul si continutul emailului
        const subject = `Solicitare Evaluare & Pachet HOLDIS MOBILITY - ${nume} (${telefon})`;
        
        const body = 
`Bună ziua,

Un vizitator a configurat un pachet pe site-ul HOLDIS MOBILITY și solicită o evaluare gratuită:

=========================================
DATE DE CONTACT CLIENT:
=========================================
• Nume: ${nume}
• Telefon: ${telefon}
• Localitate / Județ: ${localitate}
• Email: ${emailClient}

=========================================
CONFIGURAȚIA ALEASĂ:
=========================================
• Pachet de pornire: ${pachetBaza}

Elemente selectate:
${listaElementeText}

=========================================
MESAJ / DETALII SUPLIMENTARE:
=========================================
${mesaj}
`;

        // Deschidem clientul de email cu toate campurile completate automat
        const mailtoUrl = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
    });
}