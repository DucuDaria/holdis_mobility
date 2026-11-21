// ==========================================================================
// CONFIGURARE DATE CONTACT OFICIALE HOLDIS MOBILITY S.R.L.
// ==========================================================================
const ADMIN_EMAIL = "holdismobility@gmail.com";
const ADMIN_WHATSAPP = "40787665347";

// Seteaza anul curent in footer pe toate paginile
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

// 2. Deschidere Modal Rapid pentru Pachete, Produse Individuale sau Evaluare Gratuita
function openQuickEvalModal() {
    triggerPackageInterest("Evaluare Gratuită a Domiciliului");
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

// Inchidere modal daca utilizatorul da click pe fundalul intunecat
window.addEventListener("click", function (event) {
    const reqModal = document.getElementById("quickRequestModal");
    const tyModal = document.getElementById("thankYouModal");
    if (event.target === reqModal) {
        closeQuickEvalModal();
    }
    if (event.target === tyModal) {
        closeThankYouModal();
    }
});

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

// 4. Trimiterea Formularului Rapid (valabil pe index.html si produse.html)
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

        // Actualizeaza butonul WhatsApp din fereastra de confirmare cu mesajul precompletat
        const waBtn = document.getElementById("tyWhatsAppBtn");
        if (waBtn) {
            const waText = `Bună ziua! Doresc solicitarea: ${optiune}. Nume: ${nume}, Telefon: ${telefon}, Zona: ${zona}.`;
            waBtn.href = `[https://wa.me/$](https://wa.me/$){ADMIN_WHATSAPP}?text=${encodeURIComponent(waText)}`;
        }

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