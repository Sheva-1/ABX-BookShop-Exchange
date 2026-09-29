import React from 'react';
import { BookOpen, PackageCheck, Plus, HeartHandshake, ShieldCheck, Truck } from 'lucide-react';
import { UserRole } from '../../types';

interface BottomNavProps {
  activeTab: 'catalog' | 'agent_pwa' | 'admin_dashboard' | 'schools_hub' | 'orders_track';
  onNavigateTab: (tab: 'catalog' | 'agent_pwa' | 'admin_dashboard' | 'schools_hub' | 'orders_track') => void;
  onOpenSellModal: () => void;
  currentRole: UserRole;
  ordersBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onNavigateTab,
  onOpenSellModal,
  currentRole,
  ordersBadgeCount = 0,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around relative h-14">
        {/* Tab 1: Catalogue */}
        <button
          onClick={() => onNavigateTab('catalog')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-colors active:scale-95 ${
            activeTab === 'catalog' ? 'text-[#2E7D47]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">Accueil</span>
        </button>

        {/* Tab 2: Suivi Séquestre */}
        <button
          onClick={() => onNavigateTab('orders_track')}
          className={`flex flex-col items-center justify-center w-14 h-full relative transition-colors active:scale-95 ${
            activeTab === 'orders_track' ? 'text-[#2E7D47]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <PackageCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">Suivi</span>
          {ordersBadgeCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 bg-emerald-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center">
              {ordersBadgeCount}
            </span>
          )}
        </button>

        {/* Tab 3: Raised Center Action: + Vendre / Troc */}
        <div className="relative -top-4 flex items-center justify-center">
          <button
            onClick={onOpenSellModal}
            className="w-13 h-13 rounded-full bg-[#2E7D47] text-white shadow-lg shadow-emerald-900/30 flex flex-col items-center justify-center border-4 border-white active:scale-90 transition-transform"
            aria-label="Vendre ou échanger un manuel scolaire"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 4: Canal Solidaire & Dons */}
        <button
          onClick={() => onNavigateTab('schools_hub')}
          className={`flex flex-col items-center justify-center w-14 h-full transition-colors active:scale-95 ${
            activeTab === 'schools_hub' ? 'text-[#2E7D47]' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <HeartHandshake className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold">Dons</span>
        </button>

        {/* Tab 5: Role context tab (Agent PWA or Admin or Sécurité) */}
        {currentRole === 'agent' ? (
          <button
            onClick={() => onNavigateTab('agent_pwa')}
            className={`flex flex-col items-center justify-center w-14 h-full transition-colors active:scale-95 ${
              activeTab === 'agent_pwa' ? 'text-[#2B8A88]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">Tournée</span>
          </button>
        ) : currentRole === 'admin' ? (
          <button
            onClick={() => onNavigateTab('admin_dashboard')}
            className={`flex flex-col items-center justify-center w-14 h-full transition-colors active:scale-95 ${
              activeTab === 'admin_dashboard' ? 'text-[#1C2434]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-semibold">Admin</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigateTab('catalog')}
            className="flex flex-col items-center justify-center w-14 h-full text-slate-500 hover:text-slate-800 active:scale-95"
          >
            <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-[10px] font-bold">
              ✓
            </div>
            <span className="text-[10px] font-semibold">Séquestre</span>
          </button>
        )}
      </div>
    </div>
  );
};
