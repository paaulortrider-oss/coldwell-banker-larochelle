/**
 * app-logic.js
 * ─────────────────────────────────────────────────────────────────
 * Module 1 : Logique principale de l'application
 *  - Gestion des vues (navigation entre pages)
 *  - Tunnel d'estimation "Le Prisme CB" (7 étapes)
 *  - Intégration CRM (pipeline Kanban)
 * ─────────────────────────────────────────────────────────────────
 */

'use strict';

// ─── ÉTAT GLOBAL DU PROSPECT (tunnel d'estimation) ───────────────
let prospect = {
    typeBien:    '',
    adresse:     '',
    etage:       'Non renseigné',
    surface:     100,
    surfaceExt:  0,
    pieces:      4,
    chambres:    2,
    standing:    'Bon état',
    standingVal: 50,
    prestige:    [],
    nom:         '',
    tel:         '',
    email:       '',
    valBasse:    0,
    valHaute:    0
};

// Instance Lenis (sera assignée depuis animations.js)
window.siteLenis = null;


// ═══════════════════════════════════════════════════════════════════
//  GESTION DES VUES
// ═══════════════════════════════════════════════════════════════════

/**
 * showView(viewId)
 * Active une vue et masque toutes les autres.
 * Gère également l'état du canvas WebGL et du scroll Lenis.
 */
function showView(viewId) {
    // Masquer toutes les vues
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    // Désactiver tous les liens de nav
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    // Activer la vue cible
    const target = document.getElementById('view-' + viewId);
    if (target) target.classList.add('active');

    // Activer le lien nav correspondant
    const navLink = document.querySelector(`.nav-link[data-view="${viewId}"]`);
    if (navLink) navLink.classList.add('active');

    // Références aux éléments globaux
    const canvas  = document.getElementById('webgl-canvas');
    const mainNav = document.getElementById('main-nav');

    if (viewId === 'crm' || viewId === 'estimation') {
        // Vues plein écran : masquer le canvas et la nav principale
        if (canvas)  canvas.style.opacity = '0';
        if (mainNav) mainNav.style.display = 'none';
        if (window.siteLenis) window.siteLenis.stop();
        document.body.style.overflow = 'hidden';

    } else {
        // Vues standard : réafficher la nav
        if (mainNav) mainNav.style.display = 'flex';
        document.body.style.overflow = '';
        if (window.siteLenis) window.siteLenis.start();

        if (viewId === 'home') {
            // Accueil : canvas à pleine opacité, scroll en haut
            if (canvas) canvas.style.opacity = '1';
            if (window.siteLenis) window.siteLenis.scrollTo(0, { immediate: true });
        } else {
            // Sous-pages : canvas très discret
            if (canvas) canvas.style.opacity = '0.08';
            if (window.siteLenis) window.siteLenis.scrollTo(0, { immediate: true });
        }
    }
}

/**
 * accessAdmin()
 * Ouvre la vue CRM Kanban (accès consultant)
 */
function accessAdmin() {
    showView('crm');
}


// ═══════════════════════════════════════════════════════════════════
//  TUNNEL D'ESTIMATION — "LE PRISME CB"
// ═══════════════════════════════════════════════════════════════════

/**
 * openTunnel()
 * Réinitialise et affiche le tunnel d'estimation
 */
function openTunnel() {
    resetTunnelState();
    showView('estimation');
}

/**
 * closeTunnel()
 * Ferme le tunnel et retourne à l'accueil
 */
function closeTunnel() {
    showView('home');
}

/**
 * updateProgress(stepNum)
 * Met à jour les points de progression en bas du tunnel
 */
function updateProgress(stepNum) {
    const progInd = document.getElementById('prog-ind');
    if (!progInd) return;

    if (stepNum > 7 || stepNum === 'loading' || stepNum === 8) {
        progInd.style.display = 'none';
    } else {
        progInd.style.display = 'flex';
        document.querySelectorAll('.prog-dot').forEach(el => el.classList.remove('active'));
        const dot = document.getElementById('dot-' + stepNum);
        if (dot) dot.classList.add('active');
    }
}

/**
 * goToStep(stepNum)
 * Navigue vers une étape du tunnel avec animation fade
 */
function goToStep(stepNum) {
    const allSteps = document.querySelectorAll('.tunnel-step');
    allSteps.forEach(el => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.classList.remove('active');
            el.style.opacity = '';
        }, 250);
    });

    setTimeout(() => {
        const target = document.getElementById('step-' + stepNum);
        if (target) {
            target.classList.add('active');
            // Scroll vers le haut du tunnel
            const tunnelCard = document.querySelector('.tunnel-card');
            if (tunnelCard) tunnelCard.scrollTo({ top: 0, behavior: 'smooth' });
        }
        updateProgress(stepNum);
    }, 260);
}

// ── Étape 1 : Sélection du type de bien ──────────────────────────
function enregistrerEtape1(type, element) {
    prospect.typeBien = type;
    document.querySelectorAll('#step-1 .hud-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    // Sauvegarde CRM fantôme (abandon possible)
    sauvegarderCRM('ETAPE_1');

    setTimeout(() => { goToStep(2); }, 450);
}

// ── Étape 2 : Adresse ────────────────────────────────────────────
function showRadar() {
    const input   = document.getElementById('tunnel-adresse');
    const radarUI = document.getElementById('radar-ui');
    if (!input || !radarUI) return;
    radarUI.style.display = (input.value.length > 3) ? 'flex' : 'none';
}

function enregistrerEtape2() {
    const adr = document.getElementById('tunnel-adresse')?.value || '';
    if (adr.length < 5) {
        alert('Veuillez saisir une adresse valide (au moins 5 caractères).');
        return;
    }
    prospect.adresse = adr;
    sauvegarderCRM('ETAPE_2');

    // Appartement → étage (étape 3) | Autres → dimensions (étape 4)
    if (prospect.typeBien === 'Appartement') goToStep(3);
    else goToStep(4);
}

// ── Étape 3 : Sélection de l'étage (appartement uniquement) ─────
function selectEtage(value, element) {
    prospect.etage = value;
    document.querySelectorAll('.floor-rect').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    const penthouseAlert = document.getElementById('penthouse-alert');
    if (penthouseAlert) {
        penthouseAlert.style.display = (value === 'Penthouse') ? 'block' : 'none';
    }

    const btnEtage = document.getElementById('btn-valider-etage');
    if (btnEtage) btnEtage.classList.remove('hidden');
}

function enregistrerEtape3() { goToStep(4); }

// ── Étape 4 : Dimensions ─────────────────────────────────────────
function updateSurface(sliderId, displayId, unit) {
    const slider  = document.getElementById(sliderId);
    const display = document.getElementById(displayId);
    if (slider && display) {
        display.textContent = slider.value + (unit ? ' ' + unit : '');
    }
}

function enregistrerEtape4() {
    prospect.surface     = parseInt(document.getElementById('slider-surf')?.value     || 100);
    prospect.surfaceExt  = parseInt(document.getElementById('slider-ext')?.value      || 0);
    prospect.pieces      = parseInt(document.getElementById('slider-pieces')?.value   || 4);
    prospect.chambres    = parseInt(document.getElementById('slider-chambres')?.value || 2);
    sauvegarderCRM('ETAPE_4');
    goToStep(5);
}

// ── Étape 5 : Standing (glissière drag) ──────────────────────────
function dragStanding(e) {
    const box  = document.getElementById('standing-box');
    const rect = box?.getBoundingClientRect();
    if (!rect) return;

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    let percent   = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));

    const overlay = document.getElementById('lux-overlay');
    if (overlay) overlay.style.width = percent + '%';

    prospect.standingVal = percent;

    let text = 'Bon état';
    if (percent < 25)      text = 'À rénover';
    else if (percent > 80) text = 'Matériaux Nobles';
    else if (percent > 65) text = 'Prestations Luxe';

    const standingText = document.getElementById('standing-text');
    if (standingText) standingText.textContent = text;
    prospect.standing = text;
}

function enregistrerEtape5() { goToStep(6); }

// ── Étape 6 : Attributs d'exception ──────────────────────────────
function toggleModule(btn) {
    btn.classList.toggle('active');
    const mod = btn.textContent.trim();
    if (btn.classList.contains('active')) {
        prospect.prestige.push(mod);
    } else {
        prospect.prestige = prospect.prestige.filter(m => m !== mod);
    }
}

function enregistrerEtape6() {
    sauvegarderCRM('ETAPE_6');
    goToStep(7);
}

// ── Étape 7 → Calcul final ───────────────────────────────────────
function lancerCalculFinal() {
    prospect.nom   = document.getElementById('tunnel-nom')?.value   || '';
    prospect.tel   = document.getElementById('tunnel-tel')?.value   || '';
    prospect.email = document.getElementById('tunnel-email')?.value || '';

    if (!prospect.nom || !prospect.tel || !prospect.email) {
        alert('Veuillez renseigner vos coordonnées pour déverrouiller la valeur.');
        return;
    }

    goToStep('loading');

    // Simulation des logs de calcul
    const logs = document.getElementById('loading-logs');
    if (logs) {
        logs.innerHTML = '<p>&gt; Connexion noeud DVF...</p>';
        setTimeout(() => logs.innerHTML += `<p style="color:rgba(255,255,255,0.7)">&gt; Modélisation : ${prospect.typeBien} | Surface : ${prospect.surface}m²</p>`, 900);
        setTimeout(() => logs.innerHTML += '<p style="color:rgba(255,255,255,0.7)">&gt; Application pondération Prestige CB...</p>', 1800);
        setTimeout(() => logs.innerHTML += `<p style="color:var(--gold)">&gt; Calcul de l'Empreinte Valeur CB...</p>`, 2700);
        setTimeout(() => logs.innerHTML += '<p style="color:#4ade80">&gt; Décryptage réussi. Dossier verrouillé.</p>', 3600);
    }

    // Barre de progression GSAP
    if (typeof gsap !== 'undefined') {
        gsap.to('#loading-bar-tunnel', {
            width: '100%',
            duration: 4.5,
            ease: 'power2.inOut',
            onComplete: afficherResultat
        });
    } else {
        // Fallback sans GSAP
        setTimeout(afficherResultat, 4500);
    }
}

// ── Calcul DVF + Affichage résultat ──────────────────────────────
function afficherResultat() {
    // Base prix/m² selon le type de bien (données DVF La Rochelle)
    let prixM2 = 4800; // Base : Centre/Vieux-Port

    if (prospect.typeBien === 'Maison de ville')     prixM2 += 400;
    if (prospect.typeBien === 'Villa')               prixM2 += 1800;
    if (prospect.typeBien === 'Propriété Exception') prixM2 += 3800;

    // Bonus étage
    if (prospect.etage === 'Penthouse')             prixM2 += 1500;
    else if (prospect.etage === 'Dernier étage')    prixM2 += 500;

    // Standing
    if (prospect.standingVal > 80)  prixM2 += 1200;
    else if (prospect.standingVal > 65) prixM2 += 700;
    else if (prospect.standingVal < 25) prixM2 -= 900;

    // Attributs prestige
    prixM2 += prospect.prestige.length * 350;

    // Calcul total
    const base        = prospect.surface * prixM2 + (prospect.surfaceExt * (prixM2 * 0.12));
    prospect.valBasse = Math.round(base * 0.94);
    prospect.valHaute = Math.round(base * 1.06);

    goToStep(8);

    // Animation du compteur GSAP
    const resultDiv = document.getElementById('tunnel-result');
    if (resultDiv) {
        if (typeof gsap !== 'undefined') {
            let obj = { val: 0 };
            gsap.to(obj, {
                val: prospect.valBasse,
                duration: 2.5,
                ease: 'power3.out',
                onUpdate: () => {
                    resultDiv.innerHTML = Math.floor(obj.val).toLocaleString('fr-FR') + ' €';
                },
                onComplete: () => {
                    resultDiv.innerHTML =
                        Math.floor(prospect.valBasse).toLocaleString('fr-FR') + ' €' +
                        `<br><span style="font-size:1.5rem; color:rgba(255,255,255,0.4); display:block; margin-top:0.5rem; font-weight:400;">à ${Math.floor(prospect.valHaute).toLocaleString('fr-FR')} €</span>`;
                    // Ajouter au CRM
                    ajouterAuCRM();
                    // Sauvegarder lead qualifié
                    sauvegarderCRM('TERMINE');
                }
            });
        } else {
            resultDiv.innerHTML = Math.floor(prospect.valBasse).toLocaleString('fr-FR') + ' €';
            ajouterAuCRM();
        }
    }
}

// ─────────────────────────────────────────────────────────────────
//  CRM — PIPELINE KANBAN
// ─────────────────────────────────────────────────────────────────

/**
 * ajouterAuCRM()
 * Injecte une carte dans la colonne "Prospect" du Kanban
 */
function ajouterAuCRM() {
    const kanbanColumn = document.querySelector('.kanban-column');
    if (!kanbanColumn) return;

    const newCard = document.createElement('div');
    newCard.className = 'bg-white p-4 rounded shadow-sm border-l-4 border-green-500 cursor-pointer hover:shadow-md transition mb-4 text-black';
    newCard.setAttribute('onclick', 'ouvrirFiche()');

    const modulesTxt = prospect.prestige.length > 0
        ? `<span style="font-size:10px; color:#2563eb; font-weight:700; background:#eff6ff; padding:1px 4px; border-radius:2px; display:inline-block; margin-top:4px;">+ ${prospect.prestige.join(', ')}</span>`
        : '';
    const etageTxt = (prospect.typeBien === 'Appartement')
        ? ` (${prospect.etage})`
        : '';

    newCard.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <span style="font-size:10px; font-weight:700; color:#15803d; background:#f0fdf4; padding:3px 8px; border-radius:2px;">Lead Web Qualifié</span>
            <span style="font-size:10px; color:#9ca3af;">À l'instant</span>
        </div>
        <h4 style="font-weight:700; color:#111827; font-size:13px; margin-bottom:3px;">${prospect.nom || 'Prospect'}</h4>
        <p style="font-size:11px; color:#6b7280; margin-bottom:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${prospect.adresse}</p>
        <p style="font-size:11px; color:#374151; font-weight:700;">${prospect.typeBien}${etageTxt}</p>
        <p style="font-size:11px; color:#6b7280;">${prospect.surface} m² hab. · ${prospect.pieces} p. · ${prospect.chambres} ch.</p>
        <p style="font-size:10px; color:#6b7280; margin-top:3px;">État : ${prospect.standing} ${modulesTxt}</p>
        <p style="font-size:13px; font-weight:700; color:#c6a87c; margin-top:10px; padding-top:8px; border-top:1px solid #f3f4f6;">
            ${Math.floor(prospect.valBasse / 1000)}k€ — ${Math.floor(prospect.valHaute / 1000)}k€
        </p>
    `;

    const h3 = kanbanColumn.querySelector('h3');
    if (h3) h3.insertAdjacentElement('afterend', newCard);

    // Mise à jour du compteur de colonne
    const counter = kanbanColumn.querySelector('h3');
    if (counter) {
        const currentCount = kanbanColumn.querySelectorAll('.bg-white').length;
        counter.textContent = `🚨 Prospect (${currentCount})`;
    }
}

/**
 * sauvegarderCRM(etapeTunnel)
 * Appel API back-end à chaque étape (sauvegarde fantôme)
 * Compatible avec crm-api.js (Node.js/Express sur port 3000)
 */
async function sauvegarderCRM(etapeTunnel) {
    try {
        await fetch('/api/sauvegarde-prospect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                adresse:     prospect.adresse,
                surface:     prospect.surface,
                quartier:    detecterQuartier(prospect.adresse),
                email:       prospect.email,
                telephone:   prospect.tel,
                etapeTunnel: etapeTunnel
            })
        });
    } catch {
        // Silencieux en prod (API non disponible en static)
    }
}

/**
 * detecterQuartier(adresse)
 * Détection basique du quartier depuis l'adresse saisie
 */
function detecterQuartier(adresse) {
    const a = adresse.toLowerCase();
    if (a.includes('minimes'))          return 'Les Minimes';
    if (a.includes('fetilly') || a.includes('fétilly')) return 'Fétilly';
    if (a.includes('genette'))          return 'La Genette';
    if (a.includes('vieux') || a.includes('port'))      return 'Vieux-Port';
    if (a.includes('île de ré') || a.includes('ile de re')) return 'Île de Ré';
    return 'La Rochelle Centre';
}

// ─────────────────────────────────────────────────────────────────
//  MODALE FICHE CRM
// ─────────────────────────────────────────────────────────────────
function ouvrirFiche() {
    const modal = document.getElementById('modal-fiche');
    if (modal) { modal.style.display = 'flex'; modal.classList.add('active'); }
}

function fermerFiche() {
    const modal = document.getElementById('modal-fiche');
    if (modal) { modal.style.display = 'none'; modal.classList.remove('active'); }
}

// ─────────────────────────────────────────────────────────────────
//  RESET TUNNEL
// ─────────────────────────────────────────────────────────────────
function resetTunnelState() {
    prospect = {
        typeBien: '', adresse: '', etage: 'Non renseigné',
        surface: 100, surfaceExt: 0, pieces: 4, chambres: 2,
        standing: 'Bon état', standingVal: 50, prestige: [],
        nom: '', tel: '', email: '', valBasse: 0, valHaute: 0
    };

    // Reset UI
    document.querySelectorAll('.hud-option, .floor-rect').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.module-btn').forEach(el => el.classList.remove('active'));

    const fields = ['slider-surf', 'slider-ext', 'slider-pieces', 'slider-chambres'];
    const defaults = [100, 0, 4, 2];
    const displays = ['val-surf', 'val-ext', 'val-pieces', 'val-chambres'];
    const units    = ['m²', 'm²', '', ''];
    fields.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) { el.value = defaults[i]; }
        const disp = document.getElementById(displays[i]);
        if (disp) disp.textContent = defaults[i] + (units[i] ? ' ' + units[i] : '');
    });

    const luxOverlay = document.getElementById('lux-overlay');
    if (luxOverlay) luxOverlay.style.width = '50%';

    const standingText = document.getElementById('standing-text');
    if (standingText) standingText.textContent = 'Bon état';

    ['tunnel-adresse', 'tunnel-nom', 'tunnel-tel', 'tunnel-email'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    const radarUI = document.getElementById('radar-ui');
    if (radarUI) radarUI.style.display = 'none';

    const penthouseAlert = document.getElementById('penthouse-alert');
    if (penthouseAlert) penthouseAlert.style.display = 'none';

    const btnEtage = document.getElementById('btn-valider-etage');
    if (btnEtage) btnEtage.classList.add('hidden');

    goToStep(1);
}
