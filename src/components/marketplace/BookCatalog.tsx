import React, { useState, useMemo } from 'react';
import { Listing, BookCondition } from '../../types';
import { ProductCard } from './ProductCard';
import { CURRICULUM_LEVELS, SUBJECTS } from '../../data/mockData';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  BookOpen,
  ArrowRightLeft,
  ShoppingBag,
  HeartHandshake,
  CheckCircle,
} from 'lucide-react';

interface BookCatalogProps {
  listings: Listing[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeChannel: 'all' | 'used_sale' | 'new_sale' | 'exchange' | 'donation';
  onChannelChange: (channel: 'all' | 'used_sale' | 'new_sale' | 'exchange' | 'donation') => void;
  onSelectListing: (listing: Listing) => void;
  onInitiateBuy: (listing: Listing) => void;
  onInitiateExchange: (listing: Listing) => void;
  onOpenSellModal: () => void;
  onOpenAIDrawer: () => void;
}

export const BookCatalog: React.FC<BookCatalogProps> = ({
  listings,
  searchQuery,
  onSearchChange,
  activeChannel,
  onChannelChange,
  onSelectListing,
  onInitiateBuy,
  onInitiateExchange,
  onOpenSellModal,
  onOpenAIDrawer,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('Toutes les matières');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'savings'>('recommended');
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      // Channel filter
      if (activeChannel !== 'all') {
        if (activeChannel === 'used_sale' && listing.type !== 'used_sale') return false;
        if (activeChannel === 'new_sale' && listing.type !== 'new_sale') return false;
        if (activeChannel === 'exchange' && listing.type !== 'exchange') return false;
        if (activeChannel === 'donation' && listing.type !== 'donation') return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = listing.book.title.toLowerCase().includes(q);
        const matchesAuthor = listing.book.author.toLowerCase().includes(q);
        const matchesIsbn = listing.book.isbn.toLowerCase().includes(q);
        const matchesSubject = listing.book.subject.toLowerCase().includes(q);
        const matchesLevel = listing.book.educationLevel.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor && !matchesIsbn && !matchesSubject && !matchesLevel) {
          return false;
        }
      }

      // Curriculum Level filter
      if (selectedLevel !== 'all') {
        const lvl = selectedLevel.toLowerCase();
        const bookLvl = listing.book.educationLevel.toLowerCase();
        if (lvl === 'primaire') {
          if (!['sil', 'cp', 'ce1', 'ce2', 'cm1', 'cm2'].some((p) => bookLvl.includes(p))) {
            return false;
          }
        } else if (!bookLvl.includes(lvl.replace('_', ' '))) {
          return false;
        }
      }

      // Subject filter
      if (selectedSubject !== 'Toutes les matières') {
        if (!listing.book.subject.toLowerCase().includes(selectedSubject.toLowerCase())) {
          return false;
        }
      }

      // Condition filter
      if (selectedCondition !== 'all') {
        if (listing.condition !== selectedCondition) return false;
      }

      return true;
    });
  }, [listings, activeChannel, searchQuery, selectedLevel, selectedSubject, selectedCondition]);

  // Sort listings
  const sortedListings = useMemo(() => {
    const list = [...filteredListings];
    if (sortBy === 'price_asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price_desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'savings') {
      return list.sort((a, b) => {
        const savingsA = a.book.officialPrice - a.price;
        const savingsB = b.book.officialPrice - b.price;
        return savingsB - savingsA;
      });
    }
    return list; // recommended default
  }, [filteredListings, sortBy]);

  const activeFiltersCount =
    (selectedLevel !== 'all' ? 1 : 0) +
    (selectedSubject !== 'Toutes les matières' ? 1 : 0) +
    (selectedCondition !== 'all' ? 1 : 0) +
    (activeChannel !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setSelectedLevel('all');
    setSelectedSubject('Toutes les matières');
    setSelectedCondition('all');
    onChannelChange('all');
    onSearchChange('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
      {/* Hero Value Proposition Banner */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#1C2434] via-[#2C384E] to-[#121824] p-5 sm:p-7 text-white shadow-md relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#2B8A88]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -top-10 w-48 h-48 bg-[#2E7D47]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Paiement Séquestre Mobile Money · Contrôle Qualité à 3 Niveaux</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Réduisez le coût de la rentrée scolaire au Cameroun
          </h1>

          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Achetez d'occasion avec preuve vidéo, échangez vos manuels en troc direct, achetez du neuf chez les libraires agréés ou donnez pour les écoles défavorisées.
          </p>

          {/* Quick Pillars */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <span className="block font-bold text-emerald-400">1. Occasion (C2C)</span>
              <span className="text-[11px] text-slate-300">Économies de 40% à 60%</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <span className="block font-bold text-teal-300">2. Troc Direct</span>
              <span className="text-[11px] text-slate-300">Livre contre livre</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <span className="block font-bold text-sky-300">3. Neuf (B2C)</span>
              <span className="text-[11px] text-slate-300">Prix public MINESEC</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
              <span className="block font-bold text-amber-300">4. Solidaire</span>
              <span className="text-[11px] text-slate-300">Dons pour écoles rurales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 mb-6 shadow-xs">
        {/* Horizontal Scrollable Class Level Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1">
            Classe :
          </span>
          {CURRICULUM_LEVELS.slice(0, 10).map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors active:scale-95 ${
                  isSelected
                    ? 'bg-[#1C2434] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lvl.label}
              </button>
            );
          })}
        </div>

        {/* Filters Controls Row */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Select */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-[#2B8A88]"
            >
              {SUBJECTS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            {/* Condition Select */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-[#2B8A88]"
            >
              <option value="all">Tous les états</option>
              <option value="new">Neuf</option>
              <option value="as_new">Comme neuf</option>
              <option value="good_condition">Bon état</option>
              <option value="fair_condition">État moyen (3e main)</option>
            </select>

            {/* Active filters pill with reset */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors font-semibold"
              >
                <X className="w-3.5 h-3.5" />
                <span>Réinitialiser ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-slate-400 font-medium">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#2B8A88]"
            >
              <option value="recommended">Pertinence / Recommandé</option>
              <option value="price_asc">Prix croissant (FCFA)</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="savings">Économie maximale</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-[#1C2434]">
            {filteredListings.length} {filteredListings.length > 1 ? 'manuels disponibles' : 'manuel disponible'}
          </h2>
          <p className="text-xs text-slate-500">
            {activeChannel === 'all'
              ? 'Toutes offres confondues (Occasion, Neuf, Troc et Dons)'
              : activeChannel === 'used_sale'
              ? 'Canal Occasion C2C (séquestre 12% ou 8%)'
              : activeChannel === 'new_sale'
              ? 'Canal Neuf B2C (libraires et éditeurs)'
              : activeChannel === 'exchange'
              ? 'Canal Troc (échange direct livre contre livre)'
              : 'Canal Solidaire (Dons irréversibles pour écoles)'}
          </p>
        </div>

        {/* Fast Action: Ask Book-Matcher AI */}
        <button
          onClick={onOpenAIDrawer}
          className="flex items-center gap-1.5 text-xs font-bold text-[#2B8A88] hover:text-[#227573] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Conseil Programme Scolaire</span>
        </button>
      </div>

      {/* Grid of Products */}
      {sortedListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedListings.map((listing) => (
            <ProductCard
              key={listing.id}
              listing={listing}
              onSelect={onSelectListing}
              onInitiateBuy={onInitiateBuy}
              onInitiateExchange={onInitiateExchange}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto my-8 shadow-xs">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1C2434]">Aucun manuel trouvé</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Aucun livre ne correspond à vos filtres actuels. Modifiez votre recherche ou utilisez notre assistant IA.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Effacer les filtres
            </button>
            <button
              onClick={onOpenAIDrawer}
              className="px-4 py-2 bg-[#2B8A88] hover:bg-[#227573] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demander à l'assistant IA</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
