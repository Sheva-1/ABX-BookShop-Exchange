import React from 'react';
import { Logo } from '../common/Logo';
import { UserRole, UserProfile } from '../../types';
import {
  Search,
  Sparkles,
  ShieldAlert,
  User,
  HeartHandshake,
  BookOpen,
  ShoppingBag,
  Truck,
  Building2,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  currentProfile: UserProfile;
  onRoleChange: (newRole: UserRole) => void;
  activeChannel: 'all' | 'used_sale' | 'new_sale' | 'exchange' | 'donation';
  onChannelChange: (channel: 'all' | 'used_sale' | 'new_sale' | 'exchange' | 'donation') => void;
  onOpenAIDrawer: () => void;
  onOpenSellModal: () => void;
  ordersCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: 'catalog' | 'agent_pwa' | 'admin_dashboard' | 'schools_hub' | 'orders_track';
  onNavigateTab: (tab: 'catalog' | 'agent_pwa' | 'admin_dashboard' | 'schools_hub' | 'orders_track') => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentProfile,
  onRoleChange,
  activeChannel,
  onChannelChange,
  onOpenAIDrawer,
  onOpenSellModal,
  ordersCount,
  searchQuery,
  onSearchChange,
  activeTab,
  onNavigateTab,
  onOpenAuthModal,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const rolesList: { role: UserRole; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { role: 'parent', label: 'Parent / Élève', icon: User },
    { role: 'seller_pro', label: 'Librairie & Éditeur B2C', icon: Building2 },
    { role: 'agent', label: 'Agent Logistique PWA', icon: Truck },
    { role: 'school', label: 'École Bénéficiaire', icon: HeartHandshake },
    { role: 'admin', label: 'Admin ABX (Séquestre)', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#1C2434] text-white shadow-md">
      {/* Top Banner: Secure Escrow Notice & Network status */}
      <div className="bg-[#121824] px-4 py-1.5 text-[11px] text-slate-300 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-emerald-300">Séquestre Actif</span>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span className="hidden sm:inline text-slate-300">
            Fonds 100% consignés via Orange Money, MTN MoMo & CAMPOST
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-400">Réseau Cameroun (3G/4G optimisé)</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-300 font-semibold">1 000 FCFA livraison fixe</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Logo Brand */}
          <div
            className="cursor-pointer py-1"
            onClick={() => onNavigateTab('catalog')}
          >
            <Logo size="md" whiteText={true} />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par ISBN, titre, classe (ex: 6ème, 3ème)..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeTab !== 'catalog') onNavigateTab('catalog');
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-800/90 text-sm text-white placeholder-slate-400 rounded-xl border border-slate-700 focus:outline-none focus:border-[#2B8A88] focus:ring-1 focus:ring-[#2B8A88] transition-all"
              />
            </div>
          </div>

          {/* Action Tools & Role Switcher */}
          <div className="flex items-center gap-2">
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAIDrawer}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-[#2B8A88] hover:from-emerald-500 hover:to-[#227573] text-white text-xs font-bold rounded-xl shadow-sm transition-transform active:scale-95"
              title="Assistant IA Multi-Agents (Book-Matcher, Vision-Inspect, Mediator)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span className="hidden sm:inline">Agents IA ABX</span>
              <span className="sm:hidden">IA</span>
            </button>

            {/* Sell CTA (Desktop) */}
            <button
              onClick={onOpenSellModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-[#2E7D47] hover:bg-[#25663a] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              <span>+ Vendre / Troc</span>
            </button>

            {/* Auth / Login Button */}
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors shadow-sm"
              title="Connexion ou Inscription par SMS OTP"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Connexion</span>
            </button>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700 text-xs text-slate-200 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {currentProfile.fullName.charAt(0)}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="font-semibold text-white leading-tight">
                    {currentProfile.fullName.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-emerald-400 capitalize">
                    {rolesList.find((r) => r.role === currentRole)?.label}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Changer d'Espace Profil
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Connecté en : <span className="font-bold text-[#1C2434]">{currentProfile.fullName}</span>
                    </p>
                  </div>
                  <div className="py-1">
                    {rolesList.map((item) => {
                      const Icon = item.icon;
                      const isActive = item.role === currentRole;
                      return (
                        <button
                          key={item.role}
                          onClick={() => {
                            onRoleChange(item.role);
                            setRoleDropdownOpen(false);
                            if (item.role === 'agent') onNavigateTab('agent_pwa');
                            else if (item.role === 'admin') onNavigateTab('admin_dashboard');
                            else if (item.role === 'school') onNavigateTab('schools_hub');
                            else onNavigateTab('catalog');
                          }}
                          className={`w-full px-3.5 py-2 text-xs flex items-center gap-2.5 text-left transition-colors ${
                            isActive
                              ? 'bg-emerald-50 text-[#2E7D47] font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#2E7D47]' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                          {isActive && (
                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2E7D47]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher livre, auteur, classe..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                if (activeTab !== 'catalog') onNavigateTab('catalog');
              }}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 text-xs text-white placeholder-slate-400 rounded-lg border border-slate-700 focus:outline-none focus:border-[#2B8A88]"
            />
          </div>
        </div>

        {/* 3 Channels Navigation Bar (Occasion C2C, Neuf B2C, Solidaire Dons) */}
        <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-800 overflow-x-auto no-scrollbar pb-1 text-xs">
          <button
            onClick={() => {
              onChannelChange('all');
              onNavigateTab('catalog');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium ${
              activeTab === 'catalog' && activeChannel === 'all'
                ? 'bg-white text-[#1C2434] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Tous les Canaux
          </button>

          <button
            onClick={() => {
              onChannelChange('used_sale');
              onNavigateTab('catalog');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-all font-medium ${
              activeTab === 'catalog' && activeChannel === 'used_sale'
                ? 'bg-[#2B8A88] text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-300" />
            <span>Canal Occasion (C2C)</span>
          </button>

          <button
            onClick={() => {
              onChannelChange('exchange');
              onNavigateTab('catalog');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-all font-medium ${
              activeTab === 'catalog' && activeChannel === 'exchange'
                ? 'bg-[#2B8A88] text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🔄 Troc Livre / Livre</span>
          </button>

          <button
            onClick={() => {
              onChannelChange('new_sale');
              onNavigateTab('catalog');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-all font-medium ${
              activeTab === 'catalog' && activeChannel === 'new_sale'
                ? 'bg-white text-[#1C2434] font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Canal Neuf (Librairies B2C)</span>
          </button>

          <button
            onClick={() => {
              onChannelChange('donation');
              onNavigateTab('schools_hub');
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-all font-medium ${
              activeTab === 'schools_hub' || activeChannel === 'donation'
                ? 'bg-[#2E7D47] text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-300" />
            <span>Canal Solidaire & Dons</span>
          </button>

          {/* Quick tab for orders tracking */}
          <button
            onClick={() => onNavigateTab('orders_track')}
            className={`ml-auto px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5 transition-all text-xs font-semibold ${
              activeTab === 'orders_track'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>Mes Commandes Séquestre</span>
            {ordersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-[#1C2434] text-[10px] font-extrabold flex items-center justify-center">
                {ordersCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
