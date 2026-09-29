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
      {/* Hero Value Proposition Banner - Flat & Crisp with Single Accent Color */}
      <div className="mb-6 rounded-2xl bg-[#1C2434] p-5 sm:p-7 text-white shadow-sm border border-slate-800 relative">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#242F42] text-emerald-400 text-xs font-semibold mb-3 border border-slate-700/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Protected by Mobile Money escrow · Every book checked before you pay</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Cut the cost of school books in Cameroon
          </h1>

          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Buy second-hand books with video proof, swap last year's textbooks directly with another family, pick up brand new ones from approved bookshops, or donate to rural schools.
          </p>

          {/* Quick Pillars - Flat Solid Cards with Single Accent Color */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#242F42] border border-slate-700/60 rounded-xl p-2.5">
              <span className="block font-bold text-emerald-400 text-xs sm:text-[13px] leading-snug">
                Second-hand books
              </span>
              <span className="text-[11px] text-slate-300">Save 40% to 60%</span>
            </div>
            <div className="bg-[#242F42] border border-slate-700/60 rounded-xl p-2.5">
              <span className="block font-bold text-emerald-400 text-xs sm:text-[13px] leading-snug">
                Direct swaps
              </span>
              <span className="text-[11px] text-slate-300">Trade book for book</span>
            </div>
            <div className="bg-[#242F42] border border-slate-700/60 rounded-xl p-2.5">
              <span className="block font-bold text-emerald-400 text-xs sm:text-[13px] leading-snug">
                Brand-new books
              </span>
              <span className="text-[11px] text-slate-300">Official bookstore prices</span>
            </div>
            <div className="bg-[#242F42] border border-slate-700/60 rounded-xl p-2.5">
              <span className="block font-bold text-emerald-400 text-xs sm:text-[13px] leading-snug">
                School donations
              </span>
              <span className="text-[11px] text-slate-300">Sent straight to rural schools</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 mb-6 shadow-xs">
        {/* Horizontal Scrollable Class Level Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1">
            Grade:
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
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-[#2E7D47]"
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
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-[#2E7D47]"
            >
              <option value="all">All conditions</option>
              <option value="new">New</option>
              <option value="as_new">Like new</option>
              <option value="good_condition">Good condition</option>
              <option value="fair_condition">Fair condition (well-read)</option>
            </select>

            {/* Active filters pill with reset */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors font-semibold"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset filters ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#2E7D47]"
            >
              <option value="recommended">Recommended</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="savings">Biggest savings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-[#1C2434]">
            {filteredListings.length} {filteredListings.length === 1 ? 'book available' : 'books available'}
          </h2>
          <p className="text-xs text-slate-500">
            {activeChannel === 'all'
              ? 'All books (second-hand, new, swap, and donations)'
              : activeChannel === 'used_sale'
              ? 'Used books from other families (checked with video)'
              : activeChannel === 'new_sale'
              ? 'Brand-new books from official bookshops'
              : activeChannel === 'exchange'
              ? 'Direct swaps (trade book for book with zero markups)'
              : 'School gifts (free books for rural classrooms)'}
          </p>
        </div>

        {/* Fast Action: Ask Book-Matcher */}
        <button
          onClick={onOpenAIDrawer}
          className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D47] hover:text-[#25663a] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Need help finding a book?</span>
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
          <h3 className="text-base font-bold text-[#1C2434]">No books found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Nothing matches what you're looking for right now. Try clearing some filters or searching for another title.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Clear filters
            </button>
            <button
              onClick={onOpenAIDrawer}
              className="px-4 py-2 bg-[#2E7D47] hover:bg-[#25663a] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask our book helper</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
