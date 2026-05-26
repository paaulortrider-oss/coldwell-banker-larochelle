/**
 * crm-api.js
 * ─────────────────────────────────────────────────────────────────
 * Serveur Node.js / Express — Back-end CRM Coldwell Banker
 *
 * LANCEMENT :
 *   1. npm install express cors
 *   2. node crm-api.js
 *   3. API disponible sur http://localhost:3000
 *
 * ROUTES :
 *   POST /api/sauvegarde-prospect   ← appelé par le tunnel à chaque étape
 *   GET  /api/pipeline              ← retourne le Kanban complet (pour debug)
 *   GET  /api/stats                 ← stats rapides du pipeline
 * ─────────────────────────────────────────────────────────────────
 */

const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(express.json());
app.use(cors()); // Autorise les appels depuis le front (localhost ou GitHub Pages)

// ═══════════════════════════════════════════════════════════════════
//  BASE DE DONNÉES EN MÉMOIRE — LE PIPELINE KANBAN
//  (À remplacer par MongoDB ou Supabase en production)
// ═══════════════════════════════════════════════════════════════════

let crmPipeline = {
    // Leads qualifiés : ont passé l'étape email + téléphone
    prospectsVerifies: [],

    // Abandons en cours de route : données partielles précieuses
    // pour la prospection terrain
    terrainPioche: [],

    // Statistiques globales
    stats: {
        totalVisites:    0,
        totalAbandon:    0,
        totalQualifies:  0,
        tauxConversion:  0
    }
};

// ═══════════════════════════════════════════════════════════════════
//  ROUTE PRINCIPALE : Sauvegarde prospect
//  Appelée à chaque étape du tunnel "Le Prisme CB"
// ═══════════════════════════════════════════════════════════════════

app.post('/api/sauvegarde-prospect', (req, res) => {
    const {
        adresse,
        surface,
        quartier,
        email,
        telephone,
        etapeTunnel
    } = req.body;

    // Générer une référence unique CB
    const refCB = `CB-LR-${Date.now().toString(36).toUpperCase()}`;

    // Construire la fiche contact
    const ficheContact = {
        ref:     refCB,
        date:    new Date().toISOString(),
        dateStr: new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        bien: {
            adresse:  adresse  || 'Non renseignée',
            surface:  surface  || 0,
            quartier: quartier || 'La Rochelle'
        },
        contact: {
            email:     email     || null,
            telephone: telephone || null
        },
        etape:  etapeTunnel,
        statut: 'Non qualifié'
    };

    // ── Routage intelligent selon l'étape du tunnel ───────────────
    if (etapeTunnel === 'TERMINE' && telephone && email) {
        // ✅ Lead qualifié : a fourni contact + passé toutes les étapes
        ficheContact.statut = 'Prospect Vérifié';
        crmPipeline.prospectsVerifies.push(ficheContact);
        crmPipeline.stats.totalQualifies++;

        // Ici : déclencher Brevo/SendGrid pour l'email d'estimation
        // envoyerEmailBrevo(email, ficheContact);

        console.log(`\n🟢 [${ficheContact.dateStr}] LEAD QUALIFIÉ`);
        console.log(`   Réf  : ${refCB}`);
        console.log(`   Bien : ${adresse} (${surface}m² — ${quartier})`);
        console.log(`   Tel  : ${telephone} | Email : ${email}`);

    } else {
        // 🟠 Abandon en cours de route — précieux pour la prospection terrain
        ficheContact.statut = `Abandon — Étape ${etapeTunnel}`;
        crmPipeline.terrainPioche.push(ficheContact);
        crmPipeline.stats.totalAbandon++;

        console.log(`\n🟠 [${ficheContact.dateStr}] FICHE PARTIELLE (${etapeTunnel})`);
        if (adresse) console.log(`   Bien : ${adresse}`);
        if (email)   console.log(`   Email: ${email}`);
    }

    // Mise à jour du taux de conversion
    const total = crmPipeline.stats.totalQualifies + crmPipeline.stats.totalAbandon;
    if (total > 0) {
        crmPipeline.stats.tauxConversion =
            Math.round((crmPipeline.stats.totalQualifies / total) * 100);
    }

    res.status(200).json({
        success: true,
        ref:     refCB,
        message: 'Données sauvegardées dans le CRM Coldwell Banker'
    });
});


// ═══════════════════════════════════════════════════════════════════
//  ROUTE DEBUG : Visualiser le pipeline complet
//  GET /api/pipeline
// ═══════════════════════════════════════════════════════════════════

app.get('/api/pipeline', (req, res) => {
    res.json({
        stats:              crmPipeline.stats,
        prospectsVerifies:  crmPipeline.prospectsVerifies,
        terrainPioche:      crmPipeline.terrainPioche.slice(-20) // 20 derniers abandons
    });
});


// ═══════════════════════════════════════════════════════════════════
//  ROUTE STATS : Dashboard rapide
//  GET /api/stats
// ═══════════════════════════════════════════════════════════════════

app.get('/api/stats', (req, res) => {
    res.json({
        ...crmPipeline.stats,
        dernierLead: crmPipeline.prospectsVerifies.slice(-1)[0] || null
    });
});


// ═══════════════════════════════════════════════════════════════════
//  DÉMARRAGE DU SERVEUR
// ═══════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   COLDWELL BANKER — CRM API DÉMARRÉ   ║');
    console.log(`╚════════════════════════════════════════╝`);
    console.log(`\n▸ API    : http://localhost:${PORT}/api/sauvegarde-prospect`);
    console.log(`▸ Stats  : http://localhost:${PORT}/api/stats`);
    console.log(`▸ Kanban : http://localhost:${PORT}/api/pipeline`);
    console.log('\nEn attente de leads...\n');
});
