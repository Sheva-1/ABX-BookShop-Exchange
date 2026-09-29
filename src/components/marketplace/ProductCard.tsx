import React from 'react';
import { Listing } from '../../types';
import { Video, ShieldCheck, MapPin, ArrowRightLeft, Sparkles } from 'lucide-react';

interface ProductCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  onInitiateBuy: (listing: Listing) => void;
  onInitiateExchange: (listing: Listing) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  listing,
  onSelect,
  onInitiateBuy,
  onInitiateExchange,
}) => {
  const { book, type, condition, price, sellerName, sellerQuarter, sellerCity, hasVideoProof } = listing;

  const isFree = type === 'donation';
  const isExchange = type === 'exchange';
  const isNew = type === 'new_sale';
  const isUsed = type === 'used_sale';

  // Savings calculation against official bookstore price
  const savingsPct =
    isUsed && book.officialPrice > price
      ? Math.round(((book.officialPrice - price) / book.officialPrice) * 100)
      : null;

  const conditionLabels: Record<string, string> = {
    new: 'Neuf sous blister',
    as_new: 'Comme neuf',
    good_condition: 'Bon état',
    fair_condition: 'État moyen (3e main)',
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden">
      {/* Image Preview & Channel Banner */}
      <div className="relative aspect-[4/3] sm:aspect-[3/2] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelect(listing)}>
        <img
          src={listing.imagesUrls[0] || book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Video Proof Badge */}
        {hasVideoProof && (
          <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            <Video className="w-3 h-3 text-emerald-400" />
            <span>Vidéo Niveau 1</span>
          </div>
        )}

        {/* Channel Indicator */}
        <div className="absolute top-2 right-2">
          {isFree && (
            <span className="bg-[#2E7D47] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              🎁 Don Gratuit
            </span>
          )}
          {isExchange && (
            <span className="bg-[#2B8A88] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3" />
              Troc
            </span>
          )}
          {isNew && (
            <span className="bg-slate-900 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              ✨ Neuf B2C
            </span>
          )}
          {isUsed && savingsPct && savingsPct > 0 && (
            <span className="bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              -{savingsPct}% économie
            </span>
          )}
        </div>
      </div>

      {/* Book Information */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line without pills (Anti-slop clean typography) */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mb-1">
            <span className="font-bold text-[#2B8A88]">{book.educationLevel}</span>
            <span aria-hidden="true">·</span>
            <span>{book.subject}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[110px]">{book.subsystem === 'francophone' ? 'Francophone' : 'Anglophone'}</span>
          </div>

          {/* Book Title */}
          <h3
            onClick={() => onSelect(listing)}
            className="text-sm font-bold text-[#1C2434] line-clamp-2 hover:text-[#2B8A88] transition-colors cursor-pointer leading-snug"
          >
            {book.title}
          </h3>

          {/* Author & Publisher */}
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {book.author} · {book.publisher}
          </p>

          {/* Condition note */}
          <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-700">{conditionLabels[condition]}</span>
          </div>

          {/* Location & Seller info */}
          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{sellerQuarter}, {sellerCity}</span>
          </div>
        </div>

        {/* Pricing & Call to Actions */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            {isFree ? (
              <div>
                <span className="text-base font-extrabold text-[#2E7D47]">0 FCFA</span>
                <span className="block text-[10px] text-slate-400">Canal Solidaire</span>
              </div>
            ) : isExchange ? (
              <div>
                <span className="text-xs font-bold text-[#2B8A88]">Échange direct</span>
                <span className="block text-[10px] text-slate-400">Frais logistiques min.</span>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-extrabold text-[#1C2434]">
                    {price.toLocaleString()} <span className="text-xs font-semibold">FCFA</span>
                  </span>
                </div>
                {book.officialPrice > price && (
                  <span className="text-[10px] text-slate-400 line-through">
                    Neuf: {book.officialPrice.toLocaleString()} FCFA
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action button */}
          {isFree ? (
            <button
              onClick={() => onSelect(listing)}
              className="px-3 py-1.5 bg-[#2E7D47] hover:bg-[#25663a] text-white text-xs font-bold rounded-lg transition-colors active:scale-95 shadow-xs"
            >
              Demander le Don
            </button>
          ) : isExchange ? (
            <button
              onClick={() => onInitiateExchange(listing)}
              className="px-3 py-1.5 bg-[#2B8A88] hover:bg-[#227573] text-white text-xs font-bold rounded-lg transition-colors active:scale-95 shadow-xs"
            >
              Troc direct
            </button>
          ) : (
            <button
              onClick={() => onInitiateBuy(listing)}
              className="px-3 py-1.5 bg-[#1C2434] hover:bg-[#2C384E] text-white text-xs font-bold rounded-lg transition-colors active:scale-95 shadow-xs"
            >
              Acheter (Séquestre)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
