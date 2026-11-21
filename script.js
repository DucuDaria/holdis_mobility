// ==========================================================================
// CONFIGURARE DATE CONTACT & ENDPOINT TRIMITERE AUTOMATA EMAIL
// ==========================================================================
const ADMIN_EMAIL = "holdismobility@gmail.com";
const ADMIN_WHATSAPP = "40787665347";

// Endpoint configurabil pentru trimitere automata in fundal (fara mailto:)
// Foloseste FormSubmit AJAX direct catre holdismobility@gmail.com.
// Daca doresti alt serviciu (ex: Formspree / Web3Forms), inlocuieste doar URL-ul de mai jos.
const EMAIL_ENDPOINT = `https://formsubmit.co/ajax/${ADMIN_EMAIL}`;

let waRevealTimer = null;

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

// 2. Deschidere / Inchidere Modal Rapid pentru Pachete, Produse sau Evaluare
function openQuickEvalModal() {
    triggerPackageInterest("Evaluare Gratuită a Domiciliului");
}

function triggerPackageInterest(optionTitle) {
    const modal = document.getElementById("quickRequestModal");
    const label = document.getElementById("modalSelectedPkgLabel");
    const hiddenInput = document.getElementById("quickChosenOption");

    hideFormError();

    if (modal) {
        if (label) label.textContent = optionTitle;
        if (hiddenInput) hiddenInput.value = optionTitle;
        modal.classList.add("open");
    }
}

function closeQuickEvalModal() {
    const modal = document.getElementById("quickRequestModal");
    if (modal) modal.classList.remove("open");
    hideFormError();
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

// 3. Afisare eroare clara in formular (daca trimiterea automata esueaza)
function getOrCreateErrorBox() {
    let errorBox = document.getElementById("formErrorMsg");
    if (!errorBox) {
        const form = document.getElementById("quickContactForm");
        const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
        if (form && submitBtn) {
            errorBox = document.createElement("div");
            errorBox.id = "formErrorMsg";
            errorBox.className = "form-error-msg";
            errorBox.setAttribute("role", "alert");
            form.insertBefore(errorBox, submitBtn);
        }
    }
    return errorBox;
}

function showFormError(htmlMessage) {
    const errorBox = getOrCreateErrorBox();
    if (errorBox) {
        errorBox.innerHTML = htmlMessage;
        errorBox.style.display = "block";
    }
}

function hideFormError() {
    const errorBox = document.getElementById("formErrorMsg");
    if (errorBox) {
        errorBox.style.display = "none";
        errorBox.innerHTML = "";
    }
}

// 4. Pop-up central de confirmare (1. Confirmare in centru -> 2. Optiune WhatsApp dupa)
function showThankYouModal(optiune, waUrl) {
    closeQuickEvalModal();

    const tyModal = document.getElementById("thankYouModal");
    const tyText = document.getElementById("tyConfirmationText");
    const waWrap = document.getElementById("tyWhatsAppWrap");
    const waBtn = document.getElementById("tyWhatsAppBtn");

    if (waRevealTimer) {
        clearTimeout(waRevealTimer);
        waRevealTimer = null;
    }

    if (tyText && optiune) {
        tyText.textContent = `Solicitarea dumneavoastră pentru „${optiune}” a fost trimisă automat către echipa HOLDIS MOBILITY. Un specialist vă va contacta telefonic.`;
    }

    // Ne asiguram ca butonul de WhatsApp NU apare inaintea mesajului de confirmare
    if (waWrap) {
        waWrap.classList.remove("visible");
        waWrap.style.display = "none";
    }

    if (waBtn && waUrl) {
        waBtn.href = waUrl;
    }

    // Pasul 1: Afisam mesajul de confirmare in mijlocul ecranului
    if (tyModal) {
        tyModal.classList.add("open");
    }

    // Pasul 2: Dupa afisarea confirmarii, facem disponibila optiunea non-obligatorie de WhatsApp
    if (waWrap) {
        waRevealTimer = setTimeout(() => {
            waWrap.style.display = "block";
            requestAnimationFrame(() => {
                waWrap.classList.add("visible");
            });
        }, 850);
    }
}

function closeThankYouModal() {
    if (waRevealTimer) {
        clearTimeout(waRevealTimer);
        waRevealTimer = null;
    }

    const tyModal = document.getElementById("thankYouModal");
    const waWrap = document.getElementById("tyWhatsAppWrap");

    if (tyModal) {
        tyModal.classList.remove("open");
    }
    if (waWrap) {
        waWrap.classList.remove("visible");
        waWrap.style.display = "none";
    }
}

// 5. Trimitere automata pe email prin fetch (fara mailto:)
const quickContactForm = document.getElementById("quickContactForm");
if (quickContactForm) {
    quickContactForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        hideFormError();

        const submitBtn = document.getElementById("quickSubmitBtn") || quickContactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.textContent : "Trimite solicitarea";

        const optiune = document.getElementById("quickChosenOption").value.trim();
        const nume = document.getElementById("qNume").value.trim();
        const telefon = document.getElementById("qTelefon").value.trim();
        const zona = document.getElementById("qZona").value.trim();

        // Pregatim link-ul optional de WhatsApp (fara a deschide sau obliga utilizatorul)
        const waText = `Bună ziua! Am trimis o solicitare pentru: ${optiune}. Nume: ${nume}, Telefon: ${telefon}, Zona: ${zona}.`;
        const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(waText)}`;

        // Stare de trimitere
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Se trimite solicitarea...";
        }

        try {
            const response = await fetch(EMAIL_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    _subject: `Solicitare HOLDIS MOBILITY: ${optiune} - ${nume} (${telefon})`,
                    _template: "table",
                    _captcha: "false",
                    Produs_sau_Serviciu: optiune,
                    Nume_Client: nume,
                    Telefon: telefon,
                    Zona: zona,
                    Pagina_Sursa: window.location.href
                })
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok || result.success === false || result.success === "false") {
                throw new Error(result.message || "Serviciul de e-mail nu a confirmat trimiterea.");
            }

            // Succes: resetam formularul si afisam confirmarea in mijlocul ecranului, apoi optiunea de WhatsApp
            quickContactForm.reset();
            showThankYouModal(optiune, waUrl);

        } catch (error) {
            showFormError(
                `Nu am putut trimite automat solicitarea în acest moment. Vă rugăm să încercați din nou sau să ne contactați direct la ` +
                `<a href="tel:+${ADMIN_WHATSAPP}">0787 665 347</a> ori pe ` +
                `<a href="${waUrl}" target="_blank" rel="noopener">WhatsApp</a>.`
            );
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        }
    });
}

// 6. FAQ Accordion pe pagina principala
function toggleFaq(buttonEl) {
    const item = buttonEl.closest(".faq-item");
    const icon = buttonEl.querySelector(".faq-icon");
    if (item) {
        const isOpen = item.classList.toggle("open");
        if (icon) icon.textContent = isOpen ? "−" : "+";
    }
}