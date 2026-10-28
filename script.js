// ==========================================================================
// ADRESA DE EMAIL A ADMINISTRATORULUI (Schimba cu adresa ta reala!)
// ==========================================================================
const ADMIN_EMAIL = "contact@holdismobility.ro";

// 1. Actualizeaza anul curent in toate subsolurile paginilor
document.querySelectorAll(".currentYear").forEach(el => {
    el.textContent = new Date().getFullYear();
});

// 2. Deschiderea si inchiderea ferestrei "Solicita Evaluare Gratuita"
function openEvalModal() {
    const modal = document.getElementById("evalModal");
    if (modal) {
        document.getElementById("modalFormContent").style.display = "block";
        document.getElementById("modalSuccessMessage").style.display = "none";
        modal.classList.add("open");
    }
}

function closeEvalModal() {
    const modal = document.getElementById("evalModal");
    if (modal) {
        modal.classList.remove("open");
    }
}

// Inchide fereastra daca utilizatorul da click pe fundalul intunecat
window.addEventListener("click", function (event) {
    const modal = document.getElementById("evalModal");
    if (event.target === modal) {
        closeEvalModal();
    }
});

// 3. Trimiterea formularului rapid "Solicita Evaluare Gratuita" (Nume + Telefon)
const quickEvalForm = document.getElementById("quickEvalForm");
if (quickEvalForm) {
    quickEvalForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const nume = document.getElementById("evalNume").value.trim();
        const telefon = document.getElementById("evalTelefon").value.trim();

        const subject = `URGENT: Solicitare Evaluare Gratuită - ${nume} (${telefon})`;
        const body = 
`Bună ziua,

O persoană a apăsat pe butonul „SOLICITĂ EVALUARE GRATUITĂ” de pe site-ul HOLDIS MOBILITY și așteaptă să fie contactată telefonic în cel mai scurt timp:

• Nume: ${nume}
• Număr de telefon: ${telefon}

(Mesaj generat automat din formularul de Evaluare Gratuită)`;

        // Afisam mesajul ca va fi contactat in cel mai scurt timp de catre personal
        document.getElementById("modalFormContent").style.display = "none";
        document.getElementById("modalSuccessMessage").style.display = "block";

        // Trimitem catre adresa de mail a administratorului
        window.location.href = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}

// 4. Logica pentru pagina separata "configurator.html"
function applyPackageItems(packageName) {
    const checkboxes = document.querySelectorAll('input[name="elemente"]');
    if (!checkboxes.length) return;

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
        const r = document.getElementById("radio-silver");
        if (r) r.checked = true;
        itemsToSelect = silverItems;
    } else if (packageName === "Gold") {
        const r = document.getElementById("radio-gold");
        if (r) r.checked = true;
        itemsToSelect = goldItems;
    } else if (packageName === "Platinum") {
        const r = document.getElementById("radio-platinum");
        if (r) r.checked = true;
        itemsToSelect = platinumItems;
    }

    checkboxes.forEach(cb => {
        if (itemsToSelect.includes(cb.value)) {
            cb.checked = true;
        }
    });
}

// Daca utilizatorul vine din pagina Pachete sau Tabel (ex: configurator.html?pachet=Gold), bifam automat pachetul!
window.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const chosenPkg = params.get("pachet");
    if (chosenPkg) {
        applyPackageItems(chosenPkg);
    }
});

// 5. Trimiterea formularului detaliat din "configurator.html"
const customForm = document.getElementById("customPackageForm");
if (customForm) {
    customForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const pachetBaza = document.querySelector('input[name="pachet_baza"]:checked').value;
        const checkedBoxes = document.querySelectorAll('input[name="elemente"]:checked');
        
        let elementeSelectate = [];
        checkedBoxes.forEach(box => elementeSelectate.push("- " + box.value));

        const listaElementeText = elementeSelectate.length > 0 
            ? elementeSelectate.join("\n") 
            : "- Niciun produs individual bifat (se dorește recomandarea specialistului la evaluare)";

        const nume = document.getElementById("nume").value.trim();
        const telefon = document.getElementById("telefon").value.trim();
        const localitate = document.getElementById("localitate").value.trim();
        const emailClient = document.getElementById("email_client").value.trim() || "Nespecificat";
        const mesaj = document.getElementById("mesaj").value.trim() || "Fără observații suplimentare.";

        const subject = `Configurație Pachet & Evaluare HOLDIS MOBILITY - ${nume} (${telefon})`;
        const body = 
`Bună ziua,

Un client a configurat un pachet pe site-ul HOLDIS MOBILITY și așteaptă să fie contactat în cel mai scurt timp:

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
• Pachet de bază: ${pachetBaza}

Produse și servicii bifate:
${listaElementeText}

=========================================
DETALII SUPLIMENTARE:
=========================================
${mesaj}
`;

        const banner = document.getElementById("configSuccessBanner");
        if (banner) banner.style.display = "block";

        window.location.href = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}