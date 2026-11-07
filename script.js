// ==========================================================================
// CONFIGURARE DATE CONTACT (Schimba cu emailul tau real)
// ==========================================================================
const ADMIN_EMAIL = "contact@holdismobility.ro";

// Seteaza anul curent in footer
document.querySelectorAll(".currentYear").forEach(el => {
    el.textContent = new Date().getFullYear();
});

// 1. Meniul Hamburger (Stanga)
function toggleDrawerMenu() {
    const drawer = document.getElementById("sideDrawer");
    const overlay = document.getElementById("drawerOverlay");
    if (drawer && overlay) {
        drawer.classList.toggle("open");
        overlay.classList.toggle("open");
    }
}

// 2. Deschidere Modal Rapid pentru Pachete sau Evaluare Gratuita
function openQuickEvalModal() {
    triggerPackageInterest("Evaluare Gratuită la Domiciliu");
}

function triggerPackageInterest(optionTitle) {
    const modal = document.getElementById("quickRequestModal");
    const label = document.getElementById("modalSelectedPkgLabel");
    const hiddenInput = document.getElementById("quickChosenOption");
    if (modal) {
        if (label) label.textContent = optionTitle;
        if (hiddenInput) hiddenInput.value = optionTitle;
        modal.classList.add("open");
    }
}

function closeQuickEvalModal() {
    const modal = document.getElementById("quickRequestModal");
    if (modal) modal.classList.remove("open");
}

// 3. Afisare si inchidere Pop-up central: "Mulțumim, vă vom căuta în scurt timp"
function showThankYouModal() {
    closeQuickEvalModal();
    const tyModal = document.getElementById("thankYouModal");
    if (tyModal) {
        tyModal.classList.add("open");
    }
}

function closeThankYouModal() {
    const tyModal = document.getElementById("thankYouModal");
    if (tyModal) {
        tyModal.classList.remove("open");
    }
}

// 4. Trimiterea Formularului Rapid de pe prima pagina
const quickContactForm = document.getElementById("quickContactForm");
if (quickContactForm) {
    quickContactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const optiune = document.getElementById("quickChosenOption").value;
        const nume = document.getElementById("qNume").value.trim();
        const telefon = document.getElementById("qTelefon").value.trim();
        const zona = document.getElementById("qZona").value.trim();

        const subject = `Solicitare ${optiune} - ${nume} (${telefon})`;
        const body =
`Bună ziua,

Un client a solicitat „${optiune}” pe site-ul HOLDIS MOBILITY:

• Nume: ${nume}
• Telefon: ${telefon}
• Zona: ${zona}
`;

        showThankYouModal();

        setTimeout(() => {
            window.location.href = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }, 400);

        quickContactForm.reset();
    });
}

// 5. FAQ Accordion pe pagina principala
function toggleFaq(buttonEl) {
    const item = buttonEl.closest(".faq-item");
    const icon = buttonEl.querySelector(".faq-icon");
    if (item) {
        const isOpen = item.classList.toggle("open");
        if (icon) icon.textContent = isOpen ? "−" : "+";
    }
}

// 6. Logica pentru Configuratorul Dinamic (configurator.html)
function changeQty(inputId, delta) {
    const input = document.getElementById(inputId);
    if (!input) return;
    let current = parseInt(input.value, 10) || 0;
    let next = current + delta;
    if (next < 0) next = 0;
    if (next > 10) next = 10;
    input.value = next;
    updateDynamicSummary();
}

function updateDynamicSummary() {
    const summaryList = document.getElementById("dynamicSummaryList");
    if (!summaryList) return;

    let items = ["✓ Evaluare gratuită oferită de un kinetoterapeut"];

    const qtyInputs = document.querySelectorAll(".qty-controls input[type='number']");
    qtyInputs.forEach(inp => {
        const count = parseInt(inp.value, 10) || 0;
        const label = inp.getAttribute("data-label");
        if (count > 0) {
            items.push(`• ${count} x ${label}`);
        }
    });

    const extraChecks = document.querySelectorAll("input[name='dyn_item']:checked:not(:disabled)");
    extraChecks.forEach(chk => {
        items.push(`• ${chk.value}`);
    });

    summaryList.innerHTML = items.map(i => `<li>${i}</li>`).join("");
}

// Trimiterea formularului din Configuratorul Dinamic
const dynamicConfigForm = document.getElementById("dynamicConfigForm");
if (dynamicConfigForm) {
    dynamicConfigForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const nume = document.getElementById("cNume").value.trim();
        const telefon = document.getElementById("cTelefon").value.trim();
        const localitate = document.getElementById("cLocalitate").value.trim();
        const detalii = document.getElementById("cDetalii").value.trim() || "Fără observații.";

        const listItems = Array.from(document.querySelectorAll("#dynamicSummaryList li"))
            .map(li => li.textContent)
            .join("\n");

        const subject = `Configurație Dinamică HOLDIS MOBILITY - ${nume} (${telefon})`;
        const body =
`Bună ziua,

Un client a trimis o configurație dinamică de pe site-ul HOLDIS MOBILITY:

=========================================
DATE DE CONTACT:
=========================================
• Nume: ${nume}
• Telefon: ${telefon}
• Localitate: ${localitate}

=========================================
ELEMENTE CONFIGURATE:
=========================================
${listItems}

=========================================
OBSERVAȚII:
=========================================
${detalii}
`;

        showThankYouModal();

        setTimeout(() => {
            window.location.href = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }, 400);
    });
}