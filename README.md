# ABX — BookShop Exchange

> **Marketplace solidaire et sécurisée pour l'achat, la vente, l'échange et le don de manuels scolaires au Cameroun.**

---

## 🎯 Mission d'ABX

Le marché du manuel scolaire au Cameroun fait face à une inflation constante, pesant lourdement sur le budget de rentrée des familles, tandis que des millions de livres d'occasion dorment dans les foyers ou sont gaspillés. 

La mission d'**ABX (BookShop Exchange)** est de restructurer durablement ce secteur à travers trois piliers :
1. **Économique** : Permettre aux familles de réduire de 40% à 60% leurs dépenses scolaires grâce à la seconde main et au troc direct (livre contre livre à 0 FCFA).
2. **Sécuritaire** : Éliminer la fraude et l'incertitude via un système de paiement par compte séquestre Mobile Money (Orange Money, MTN MoMo, CAMPOST) lié à une chaîne de contrôle qualité stricte à 3 niveaux.
3. **Social & Solidaire** : Collecter et réattribuer gratuitement les manuels de 3ᵉ main donnés par les familles vers des écoles partenaires situées en zones défavorisées ou reculées (ex: *Mayo-Oulo, Dimako, Mogodé*).

---

## 🛠️ Core Tech Stack

Conformément aux spécifications d'architecture technique ABX, la plateforme est conçue pour être ultra-légère, réactive et optimisée pour les réseaux mobiles (3G/4G) :

| Composant | Technologie | Rôle & Bénéfice Clé |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14 (App Router) + React 19** | Rendu ultra-rapide (SSR/PWA), SEO natif pour l'indexation des manuels officiels du MINESEC et cibles tactiles $\ge 48\times 48\text{px}$. |
| **Styling** | **Tailwind CSS** | Design system fluide basé sur les tokens du logo (`#1C2434` Navy, `#2E7D47` Vert Feuille, `#2B8A88` Teal Fleuve, `#4A5568` Gris Montagne). |
| **Backend & BaaS** | **Supabase (PostgreSQL)** | Intégrité financière ACID pour le séquestre, Row Level Security (RLS) pour la protection des données et recherche plein texte (GIN index) par ISBN/titre/matière. |
| **Authentification** | **Supabase Auth (SMS OTP)** | Connexion sans mot de passe adaptée aux usages mobiles en Afrique centrale via numéro de téléphone local (+237). |
| **Paiements Séquestre** | **Passerelles Mobile Money (CinetPay / Hub2)** | Gestion du débit USSD (Orange Money, MTN Mobile Money, CAMPOST) et webhooks sécurisés par signature HMAC. |
| **Compression Médias** | **Client-Side Image Compression** | Conversion automatique des photos en format WebP (< 300 KB) avant envoi pour préserver le forfait data mobile des utilisateurs. |
| **IA Spécialisée** | **Google GenAI (Gemini SDK)** | Suite multi-agents : *ABX Book-Matcher* (programme scolaire), *ABX Vision-Inspect* (analyse d'usure & floutage PII) et *ABX Mediator* (arbitrage). |

---

## 🛡️ Le Parcours Utilisateur & Le Workflow de Contrôle Qualité à 3 Niveaux

Pour instaurer une confiance absolue sans entreposage physique intermédiaire, chaque transaction suit un protocole rigoureux :

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│               CHAÎNE DE CONTRÔLE QUALITÉ & SÉQUESTRE EN 3 ÉTAPES                │
└─────────────────────────────────────────────────────────────────────────────────┘

  [ Étape 1 : Dépôt par le Vendeur / Donateur ]
  ─────────────────────────────────────────────
  • Publication de l'annonce avec photos obligatoires des tranches et de la reliure.
  • Téléversement d'une vidéo de feuilletage de 15 secondes.
  • Validation préliminaire par l'agent IA "Vision-Inspect" (rejet du "Comme neuf" si ratures à l'encre).
  • Consignation des fonds de l'acheteur sur le compte séquestre de la plateforme.

                         │
                         ▼

  [ Étape 2 : Collecte par l'Agent Logistique (PWA Dédiée) ]
  ──────────────────────────────────────────────────────────
  • L'agent logistique mandaté se déplace au point de ramassage (domicile ou point relais).
  • Inspection physique approfondie : présence de toutes les pages, état de la couverture, absence de déchirures majeures.
  • Validation du rapport d'inspection Niveau 2 sur l'application agent PWA avec capture de preuve photo.

                         │
                         ▼

  [ Étape 3 : Livraison & Réception Finale par l'Acheteur ]
  ─────────────────────────────────────────────────────────
  • Acheminement direct P2P chez l'acheteur.
  • Feuilletage et contrôle physique en main propre par l'acheteur avant toute validation.
  • Si conforme : L'acheteur transmet son code secret OTP à 6 chiffres à l'agent.
  • Saisie du code OTP ➔ Déblocage instantané et irrévocable des fonds du séquestre vers le vendeur.
  • Si non conforme : Refus du livre, suspension immédiate du séquestre et arbitrage via l'IA "ABX Mediator".
```

---

## 💼 Modèle Économique & Commissions

- **12%** prélevés sur les ventes d'occasion entre parents (C2C).
- **8%** prélevés sur les ventes des vendeurs indépendants (« vendeurs poteau »).
- **7%** prélevés sur les ventes de livres neufs B2C (libraires et éditeurs partenaires).
- **1 000 FCFA fixes** de frais de livraison partagés par commande d'acheminement direct.
- **Canal Solidaire (Dons)** : 100% gratuit, aucun frais logistique imputé au donateur.

---

## 💻 Installation & Configuration Locale

### 1. Prérequis
- Node.js version 18+ ou 20+
- Un gestionnaire de paquets (`npm`, `pnpm` ou `bun`)

### 2. Cloner le Projet
```bash
git clone https://github.com/votre-organisation/abx-marketplace.git
cd abx-marketplace
```

### 3. Configuration des Variables d'Environnement
Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example` :
```bash
cp .env.example .env
```

Renseignez les variables requises :
```env
# Clé API Gemini pour les agents IA (Book-Matcher, Vision-Inspect, Mediator)
GEMINI_API_KEY="votre_cle_gemini_api"

# URL publique de l'application
APP_URL="http://localhost:3000"

# Configuration Supabase (si connecté à une instance Cloud / Locale)
# NEXT_PUBLIC_SUPABASE_URL="https://votre-projet.supabase.co"
# NEXT_PUBLIC_SUPABASE_ANON_KEY="votre-cle-anon"
```

### 4. Installer les Dépendances
```bash
npm install
```

### 5. Démarrer le Serveur de Développement
```bash
npm run dev
```
L'application est accessible sur [http://localhost:3000](http://localhost:3000).

### 6. Validation du Code & Build de Production
```bash
# Vérification du typage TypeScript et conformité du linting
npm run lint

# Compiler pour la production
npm run build
```

---

## 📁 Structure du Projet

```text
├── index.html                   # Point d'entrée HTML avec balises SEO et thème
├── metadata.json                # Métadonnées de l'application et capacités IA
├── package.json                 # Dépendances et scripts de build
├── vite.config.ts               # Configuration Vite & Tailwind CSS
├── src/
│   ├── main.tsx                 # Racine React 19
│   ├── App.tsx                  # Composant racine, routage des vues et modales
│   ├── index.css                # Styles globaux Tailwind & Tokens de design ABX
│   ├── types/
│   │   └── index.ts             # Typages TypeScript (Books, Orders, Escrow, Inspections)
│   ├── data/
│   │   └── mockData.ts          # Données de référence (Programme officiel MINESEC, Écoles, Profils)
│   ├── lib/
│   │   ├── gemini.ts            # Intégration des 3 Agents IA (Book-Matcher, Vision, Mediator)
│   │   ├── compression.ts       # Compression d'images client-side en WebP (< 300 KB)
│   │   └── storage.ts           # Couche de persistance locale / BaaS
│   └── components/
│       ├── layout/              # Header, BottomNav mobile (64px avec bouton + Vendre surélevé)
│       ├── common/              # Logo officiel, EscrowBadge, InspectionTimeline (3 niveaux)
│       ├── marketplace/         # BookCatalog, ProductCard, BookDetailModal
│       ├── checkout/            # EscrowCheckoutModal (Paiement Séquestre Mobile Money Orange/MTN)
│       ├── sell/                # CreateListingModal (Dépôt d'annonce avec preuve vidéo)
│       ├── exchange/            # ExchangeMatcherModal (Troc direct livre contre livre)
│       ├── donation/            # DonationHub (Répertoire des écoles et promesses de dons)
│       ├── agent/               # AgentPWAPortal (Interface PWA de contrôle physique Niveau 2)
│       ├── admin/               # AdminDashboard (Gouvernance séquestre & arbitrage des litiges)
│       ├── orders/              # OrdersTrackingView (Suivi des commandes et affichage du code OTP)
│       ├── auth/                # AuthModal (Connexion / Inscription par SMS OTP)
│       └── ai/                  # AIAssistantsDrawer (Suite interactive multi-agents ABX)
```

---

## 📄 Licence & Droits
Propriété exclusive du projet **ABX (BookShop Exchange)**. Conçu pour soutenir les familles camerounaises et faciliter l'accès universel aux manuels scolaires.
