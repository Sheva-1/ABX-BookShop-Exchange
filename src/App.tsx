/**
 * ABX (BookShop Exchange) - Marketplace Web Responsive & PWA
 * Marketplace de manuels scolaires au Cameroun avec paiement séquestre
 * et chaîne de contrôle qualité à 3 niveaux.
 */

import React, { useState, useEffect } from 'react';
import { UserRole, Listing, Order, BeneficiarySchool, UserProfile, ExchangeProposal } from './types';
import {
  getStoredListings,
  saveListings,
  getStoredOrders,
  saveOrders,
  getStoredSchools,
  saveSchools,
  getStoredRole,
  saveStoredRole,
  getProfileForRole,
} from './lib/storage';
import { MOCK_PROFILES, CURRENT_USER } from './data/mockData';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { BookCatalog } from './components/marketplace/BookCatalog';
import { BookDetailModal } from './components/marketplace/BookDetailModal';
import { EscrowCheckoutModal } from './components/checkout/EscrowCheckoutModal';
import { CreateListingModal } from './components/sell/CreateListingModal';
import { ExchangeMatcherModal } from './components/exchange/ExchangeMatcherModal';
import { DonationHub } from './components/donation/DonationHub';
import { AgentPWAPortal } from './components/agent/AgentPWAPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OrdersTrackingView } from './components/orders/OrdersTrackingView';
import { AIAssistantsDrawer } from './components/ai/AIAssistantsDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { Breadcrumbs, BreadcrumbItem } from './components/common/Breadcrumbs';
import { InfoSections } from './components/common/InfoSections';
import { CookieBanner } from './components/common/CookieBanner';
import { LegalModal } from './components/common/LegalModal';
import { Logo } from './components/common/Logo';
import { CheckCircle2, ShieldCheck, HeartHandshake, ArrowRightLeft } from 'lucide-react';

export default function App() {
  // Primary States
  const [currentRole, setCurrentRole] = useState<UserRole>(getStoredRole());
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(getProfileForRole(currentRole));
  const [profiles, setProfiles] = useState<UserProfile[]>(MOCK_PROFILES);

  const [listings, setListings] = useState<Listing[]>(getStoredListings());
  const [orders, setOrders] = useState<Order[]>(getStoredOrders());
  const [schools, setSchools] = useState<BeneficiarySchool[]>(getStoredSchools());

  // Navigation & Channels
  const [activeTab, setActiveTab] = useState<'catalog' | 'agent_pwa' | 'admin_dashboard' | 'schools_hub' | 'orders_track'>('catalog');
  const [activeChannel, setActiveChannel] = useState<'all' | 'used_sale' | 'new_sale' | 'exchange' | 'donation'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [detailListing, setDetailListing] = useState<Listing | null>(null);
  const [checkoutListing, setCheckoutListing] = useState<Listing | null>(null);
  const [exchangeListing, setExchangeListing] = useState<Listing | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState<boolean>(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // Synchronize document.title, meta description, and social tags dynamically per view for optimal SEO
  useEffect(() => {
    const titlesMap: Record<string, string> = {
      catalog: activeChannel === 'all'
        ? 'ABX — Marketplace de Manuels Scolaires au Cameroun'
        : activeChannel === 'used_sale'
        ? 'Manuels Scolaires d’Occasion (C2C) — ABX Cameroun'
        : activeChannel === 'exchange'
        ? 'Troc Direct Livre contre Livre — ABX Cameroun'
        : activeChannel === 'new_sale'
        ? 'Manuels Scolaires Neufs B2C (Librairies) — ABX'
        : 'Canal Solidaire & Dons d’Écoles — ABX Cameroun',
      schools_hub: 'Canal Solidaire & Écoles Partenaires — ABX Cameroun',
      agent_pwa: 'Portail PWA Agent Logistique (Contrôle Niveau 2) — ABX',
      admin_dashboard: 'Gouvernance Séquestre & Arbitrage — Admin ABX',
      orders_track: 'Suivi des Séquestres & Codes OTP — ABX Cameroun',
    };

    const descriptionsMap: Record<string, string> = {
      catalog: activeChannel === 'all'
        ? 'Achetez, vendez, échangez ou donnez vos manuels scolaires au Cameroun. Paiement sécurisé sous séquestre Mobile Money et contrôle qualité strict en 3 niveaux.'
        : activeChannel === 'used_sale'
        ? 'Achetez des manuels scolaires d’occasion de 40% à 60% moins chers au Cameroun avec inspection vidéo certifiée et paiement sous séquestre Orange & MTN MoMo.'
        : activeChannel === 'exchange'
        ? 'Échangez vos manuels scolaires de classe précédente sans dépenser 1 FCFA. Troc direct contrôlé en main propre par nos agents logistiques partenaires.'
        : activeChannel === 'new_sale'
        ? 'Achetez vos manuels scolaires neufs au prix officiel réglementé auprès des librairies et éditeurs partenaires au Cameroun avec livraison sécurisée.'
        : 'Faites don de vos livres scolaires de 3e main pour équiper les écoles défavorisées et enclavées du Cameroun. Acheminement solidaire 100% gratuit.',
      schools_hub: 'Découvrez la liste des écoles partenaires et offrez vos manuels scolaires de 3e main aux élèves défavorisés dans les régions du Cameroun.',
      agent_pwa: 'Interface PWA mobile dédiée aux agents logistiques ABX pour l’inspection physique niveau 2 et la validation des remises avec code secret OTP.',
      admin_dashboard: 'Supervision des comptes séquestre, gestion des signalements de non-conformité et arbitrage des litiges avec l’agent IA ABX Mediator.',
      orders_track: 'Suivez vos commandes de manuels scolaires, le statut de votre compte séquestre et accédez à votre code OTP secret pour la livraison en main propre.',
    };

    const newTitle = titlesMap[activeTab] || 'ABX — BookShop Exchange';
    const newDesc = descriptionsMap[activeTab] || descriptionsMap['catalog'];

    document.title = newTitle;

    // Update <meta name="description">
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', newDesc);

    // Update OpenGraph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', newTitle);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', newDesc);

    // Update Canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      const canonicalPath = activeTab === 'schools_hub' ? 'dons-solidaires' : activeChannel !== 'all' ? (activeChannel === 'used_sale' ? 'occasion' : activeChannel === 'exchange' ? 'troc' : activeChannel === 'new_sale' ? 'neuf-librairies' : '') : '';
      canonicalLink.setAttribute('href', `https://abx-exchange.cm/${canonicalPath}`);
    }
  }, [activeTab, activeChannel]);

  // Compute Breadcrumb items for SEO and intuitive UX navigation
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];

    if (activeTab === 'catalog') {
      if (activeChannel === 'all') {
        items.push({ label: 'Catalogue National des Manuels', active: true });
      } else if (activeChannel === 'used_sale') {
        items.push({
          label: 'Catalogue',
          onClick: () => setActiveChannel('all'),
        });
        items.push({ label: 'Canal Occasion (C2C)', active: true });
      } else if (activeChannel === 'exchange') {
        items.push({
          label: 'Catalogue',
          onClick: () => setActiveChannel('all'),
        });
        items.push({ label: 'Troc Direct Livre contre Livre', active: true });
      } else if (activeChannel === 'new_sale') {
        items.push({
          label: 'Catalogue',
          onClick: () => setActiveChannel('all'),
        });
        items.push({ label: 'Canal Neuf (Librairies B2C)', active: true });
      } else {
        items.push({
          label: 'Catalogue',
          onClick: () => setActiveChannel('all'),
        });
        items.push({ label: 'Dons Solidaires', active: true });
      }
    } else if (activeTab === 'schools_hub') {
      items.push({ label: 'Canal Solidaire & Écoles Partenaires', active: true });
    } else if (activeTab === 'agent_pwa') {
      items.push({ label: 'Portail PWA Agent Logistique (Niveau 2)', active: true });
    } else if (activeTab === 'admin_dashboard') {
      items.push({ label: 'Gouvernance & Séquestre Admin', active: true });
    } else if (activeTab === 'orders_track') {
      items.push({ label: 'Suivi des Séquestres & Codes OTP', active: true });
    }

    return items;
  };

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync role change
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    saveStoredRole(role);
    const profile = getProfileForRole(role);
    setCurrentProfile(profile);
    triggerToast(`Espace commuté en mode : ${profile.fullName} (${role.toUpperCase()})`);
  };

  // Handlers for data updates
  const handleListingCreated = (newListing: Listing) => {
    const updated = [newListing, ...listings];
    setListings(updated);
    saveListings(updated);
    triggerToast('Votre annonce a été publiée avec succès ! Preuves Niveau 1 enregistrées.');
  };

  const handleOrderCreated = (newOrder: Order) => {
    const updated = [newOrder, ...orders];
    setOrders(updated);
    saveOrders(updated);
    triggerToast(`Commande ${newOrder.orderNumber} initiée ! Fonds séquestre verrouillés.`);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    const updated = orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
    setOrders(updated);
    saveOrders(updated);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    const updated = profiles.map((p) => (p.id === updatedProfile.id ? updatedProfile : p));
    setProfiles(updated);
  };

  const handlePledgeDirectDonation = (schoolId: string, subject: string, level: string) => {
    const updatedSchools = schools.map((sch) => {
      if (sch.id === schoolId) {
        return {
          ...sch,
          totalDonationsReceived: sch.totalDonationsReceived + 1,
          requestedBooks: sch.requestedBooks.map((req) => {
            if (req.subject === subject && req.level === level) {
              return { ...req, quantityReceived: req.quantityReceived + 1 };
            }
            return req;
          }),
        };
      }
      return sch;
    });
    setSchools(updatedSchools);
    saveSchools(updatedSchools);
    triggerToast(`Merci ! Votre promesse de don pour ${subject} (${level}) a été enregistrée.`);
  };

  const handleExchangeProposalSubmitted = (proposal: ExchangeProposal) => {
    triggerToast('Proposition de troc transmise au parent vendeur !');
  };

  // Separate listings by donations
  const donationListings = listings.filter((l) => l.type === 'donation');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* Global Header */}
      <Header
        currentRole={currentRole}
        currentProfile={currentProfile}
        onRoleChange={handleRoleChange}
        activeChannel={activeChannel}
        onChannelChange={(ch) => {
          setActiveChannel(ch);
          if (ch === 'donation') setActiveTab('schools_hub');
          else setActiveTab('catalog');
        }}
        onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        ordersCount={orders.filter((o) => o.status !== 'completed').length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 max-w-sm bg-[#1C2434] text-white p-3.5 rounded-xl shadow-xl border border-emerald-500/40 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation Bar (SEO Microdata) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3.5 w-full">
        <Breadcrumbs
          items={getBreadcrumbItems()}
          onHomeClick={() => {
            setActiveTab('catalog');
            setActiveChannel('all');
          }}
        />
      </div>

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'catalog' && (
          <>
            <BookCatalog
              listings={listings}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeChannel={activeChannel}
              onChannelChange={setActiveChannel}
              onSelectListing={(lst) => setDetailListing(lst)}
              onInitiateBuy={(lst) => setCheckoutListing(lst)}
              onInitiateExchange={(lst) => setExchangeListing(lst)}
              onOpenSellModal={() => setIsSellModalOpen(true)}
              onOpenAIDrawer={() => setIsAIDrawerOpen(true)}
            />

            {/* Rich SEO Sections: Reviews, FAQ, Physical Address & Interactive Route Map */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <InfoSections
                onOpenPrivacy={() => setLegalModalType('privacy')}
                onOpenTerms={() => setLegalModalType('terms')}
              />
            </div>
          </>
        )}

        {activeTab === 'schools_hub' && (
          <DonationHub
            schools={schools}
            donationListings={donationListings}
            currentUser={currentProfile}
            onOpenSellModal={() => setIsSellModalOpen(true)}
            onSelectListing={(lst) => setDetailListing(lst)}
            onPledgeDirectDonation={handlePledgeDirectDonation}
          />
        )}

        {activeTab === 'agent_pwa' && (
          <AgentPWAPortal
            orders={orders}
            currentAgent={getProfileForRole('agent')}
            onUpdateOrder={handleUpdateOrder}
          />
        )}

        {activeTab === 'admin_dashboard' && (
          <AdminDashboard
            orders={orders}
            profiles={profiles}
            schools={schools}
            listings={listings}
            onUpdateOrder={handleUpdateOrder}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'orders_track' && (
          <OrdersTrackingView
            orders={orders}
            currentUser={currentProfile}
          />
        )}
      </main>

      {/* Comprehensive SEO Footer with Internal Links Matrix */}
      <footer className="bg-[#1C2434] text-white border-t border-slate-700/80 pt-12 pb-24 md:pb-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-700/60">
            {/* Column 1: Brand & Mission */}
            <div className="lg:col-span-2 space-y-3">
              <Logo size="md" whiteText={true} />
              <p className="text-slate-300 text-xs leading-relaxed max-w-sm mt-2">
                ABX (BookShop Exchange) est la première marketplace solidaire de manuels scolaires au Cameroun. Nous réduisons les dépenses de rentrée des familles de 40% à 60% grâce au paiement par séquestre sécurisé, au contrôle qualité physique en 3 niveaux et au troc direct.
              </p>
              <div className="pt-2 flex items-center gap-3 text-[11px] text-emerald-400">
                <span className="flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Séquestre Garanti
                </span>
                <span>·</span>
                <span>Douala & Yaoundé</span>
                <span>·</span>
                <span>MINESEC Conforme</span>
              </div>
            </div>

            {/* Column 2: Canaux de Distribution (Internal Links) */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">
                Canaux Scolaires
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('catalog');
                      setActiveChannel('all');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Catalogue National Général
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('catalog');
                      setActiveChannel('used_sale');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Manuels d’Occasion (C2C)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('catalog');
                      setActiveChannel('exchange');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Troc Direct (0 FCFA)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('catalog');
                      setActiveChannel('new_sale');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Livres Neufs (Librairies B2C)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('schools_hub');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Canal Solidaire & Dons
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Sécurité & Gouvernance (Internal Links) */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">
                Sécurité & Séquestre
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab('orders_track');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Suivi des Séquestres & OTP
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('faq-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      else {
                        setActiveTab('catalog');
                        setTimeout(() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }
                    }}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Contrôle Qualité en 3 Niveaux
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLegalModalType('terms')}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Barème des Commissions (12% / 7%)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLegalModalType('terms')}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Règle Anti-Récidive (2 exclusions)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsAIDrawerOpen(true)}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Arbitrage IA ABX Mediator
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Hub & Légal (Internal Links) */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">
                Hub & Légal
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('contact-hub-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      else {
                        setActiveTab('catalog');
                        setTimeout(() => document.getElementById('contact-hub-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }
                    }}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Siège Akwa Douala & Itinéraire
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('reviews-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      else {
                        setActiveTab('catalog');
                        setTimeout(() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }
                    }}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Avis Vérifiés Parents (4.9/5)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('faq-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      else {
                        setActiveTab('catalog');
                        setTimeout(() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                      }
                    }}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    FAQ Rentrée Scolaire
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLegalModalType('privacy')}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Politique de Confidentialité (RGPD)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLegalModalType('terms')}
                    className="hover:text-white hover:underline transition-colors text-left"
                  >
                    Conditions Générales (CGU)
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Payment Badges */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div>
              © 2026 ABX — BookShop Exchange Cameroun. Tous droits réservés.
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span>Orange Money</span>
              <span>·</span>
              <span>MTN Mobile Money</span>
              <span>·</span>
              <span>CAMPOST</span>
              <span>·</span>
              <button
                onClick={() => setLegalModalType('privacy')}
                className="hover:text-white underline"
              >
                Cookies & Données
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Banner (RGPD Compliance) */}
      <CookieBanner onOpenPrivacy={() => setLegalModalType('privacy')} />

      {/* Legal Modal (Privacy & Terms) */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* Mobile Bottom Navigation Bar (Fixed 64px) */}
      <BottomNav
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        currentRole={currentRole}
        ordersBadgeCount={orders.filter((o) => o.status !== 'completed').length}
      />

      {/* Modals & Drawers */}
      {detailListing && (
        <BookDetailModal
          listing={detailListing}
          onClose={() => setDetailListing(null)}
          onInitiateBuy={(lst) => {
            setDetailListing(null);
            setCheckoutListing(lst);
          }}
          onInitiateExchange={(lst) => {
            setDetailListing(null);
            setExchangeListing(lst);
          }}
        />
      )}

      {checkoutListing && (
        <EscrowCheckoutModal
          listing={checkoutListing}
          currentUser={currentProfile}
          onClose={() => setCheckoutListing(null)}
          onOrderSuccess={handleOrderCreated}
        />
      )}

      {exchangeListing && (
        <ExchangeMatcherModal
          targetListing={exchangeListing}
          currentUser={currentProfile}
          onClose={() => setExchangeListing(null)}
          onProposalSubmitted={handleExchangeProposalSubmitted}
        />
      )}

      {isSellModalOpen && (
        <CreateListingModal
          currentUser={currentProfile}
          onClose={() => setIsSellModalOpen(false)}
          onListingCreated={handleListingCreated}
        />
      )}

      <AIAssistantsDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentRole={currentRole}
        onLoginSuccess={(newProfile) => {
          setCurrentProfile(newProfile);
          setCurrentRole(newProfile.role);
          saveStoredRole(newProfile.role);
          const updatedProfiles = profiles.some(p => p.id === newProfile.id)
            ? profiles.map(p => p.id === newProfile.id ? newProfile : p)
            : [newProfile, ...profiles];
          setProfiles(updatedProfiles);
          triggerToast(`Bienvenue, ${newProfile.fullName} ! Session connectée.`);
        }}
      />
    </div>
  );
}
