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

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'catalog' && (
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

      {/* Footer info (Desktop) */}
      <footer className="hidden md:block bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-[#1C2434] tracking-tight">ABX BookShop Exchange</span>
            <span>·</span>
            <span>Marketplace Solidaire de Manuels Scolaires au Cameroun</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Paiement Séquestre MTN · Orange Money · CAMPOST</span>
            <span>·</span>
            <span>Commission 12% C2C / 7% B2C</span>
            <span>·</span>
            <span>Livraison fixe 1 000 FCFA</span>
          </div>
        </div>
      </footer>

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
