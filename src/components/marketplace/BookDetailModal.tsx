import React, { useState } from 'react';
import { Listing, BookCondition } from '../../types';
import {
  X,
  ShieldCheck,
  Video,
  Lock,
  MapPin,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRightLeft,
  Truck,
  HeartHandshake,
  Share2,
  AlertCircle,
} from 'lucide-react';

interface BookDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  onInitiateBuy: (listing: Listing) => void;
  onInitiateExchange: (listing: Listing) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  listing,
  onClose,
  onInitiateBuy,
  onInitiateExchange,
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);

  if (!listing) return null;

  const { book, type, condition, price, sellerName, sellerCity, sellerQuarter, hasVideoProof } = listing;

  const isFree = type === 'donation';
  const isExchange = type === 'exchange';
  const isNew = type === 'new_sale';
  const isUsed = type === 'used_sale';

  const conditionLabels: Record<BookCondition, { label: string; desc: string }> = {
    new: { label: 'Neuf sous blister', desc: 'Exemplaire jamais utilisé, sous emballage officiel.' },
    as_new: { label: 'Comme neuf', desc: 'Pages blanches sans annotation, couverture et reliure impeccables.' },
    good_condition: { label: 'Bon état', desc: 'Complet, lisible. Légères traces de crayon ou usure mineure des coins.' },
    fair_condition: { label: 'État moyen (3e main)', desc: 'Pages un peu froissées ou jauni, mais 100% complet pour suivre les cours.' },
  };

  const savingsAmount = book.officialPrice - price;
  const savingsPct = Math.round((savingsAmount / book.officialPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#2E7D47] uppercase tracking-wider">
              {book.educationLevel} · {book.subject}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-medium text-slate-500">ISBN : {book.isbn}</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Media Gallery & Proofs */}
            <div>
              {/* Main Media Preview */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                {isPlayingVideo && listing.videoUrl ? (
                  <video
                    src={listing.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={listing.imagesUrls[activeMediaIndex] || book.coverImage}
                    alt={`Inspection visuelle et couverture du manuel scolaire ${book.title} (${book.educationLevel} ${book.subject})`}
                    className="w-full h-full object-cover"
                  />
                )}

                {hasVideoProof && (
                  <button
                    onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                    className="absolute bottom-3 left-3 bg-[#1C2434]/90 hover:bg-[#1C2434] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-md transition-colors"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isPlayingVideo ? 'Afficher les photos' : 'Voir la vidéo de feuilletage (Niveau 1)'}</span>
                  </button>
                )}
              </div>

              {/* Thumbnails */}
              {listing.imagesUrls.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {listing.imagesUrls.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveMediaIndex(idx);
                        setIsPlayingVideo(false);
                      }}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                        activeMediaIndex === idx && !isPlayingVideo
                          ? 'border-[#2B8A88]'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Photo de preuve d'état ${idx + 1} du manuel ${book.title}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* AI Vision-Inspect Report Summary */}
              {listing.visionInspectionResult && (
                <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs">
                  <div className="flex items-center justify-between font-bold text-emerald-900 mb-1">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      Rapport Qualité IA Niveau 1
                    </span>
                    <span className="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800">
                      Conforme à 94%
                    </span>
                  </div>
                  <ul className="text-emerald-800 space-y-0.5 text-[11px] list-disc list-inside">
                    <li>Reliure intégrale et solide vérifiée</li>
                    <li>Absence de ratures ou surcharges indélébiles</li>
                    <li>{listing.visionInspectionResult.pagesChecked} pages recensées sans manquant</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column: Book Details & Escrow Buying Box */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#1C2434] leading-snug">{book.title}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Par <span className="font-semibold text-slate-700">{book.author}</span> · {book.publisher}
                </p>

                {/* Price & Savings Display */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Prix proposé :</span>
                      {isFree ? (
                        <span className="text-2xl font-extrabold text-[#2E7D47]">0 FCFA (Don)</span>
                      ) : isExchange ? (
                        <span className="text-xl font-extrabold text-[#2B8A88]">Troc Livre / Livre</span>
                      ) : (
                        <span className="text-2xl font-extrabold text-[#1C2434]">
                          {price.toLocaleString()} <span className="text-sm font-semibold">FCFA</span>
                        </span>
                      )}
                    </div>

                    {isUsed && savingsAmount > 0 && (
                      <div className="text-right">
                        <span className="text-xs text-emerald-700 font-bold block">
                          Économie : -{savingsAmount.toLocaleString()} FCFA ({savingsPct}%)
                        </span>
                        <span className="text-[11px] text-slate-400 line-through">
                          Prix neuf : {book.officialPrice.toLocaleString()} FCFA
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Channel Tag */}
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Canal de distribution :</span>
                    <span className="font-bold text-[#1C2434]">
                      {isUsed
                        ? 'Occasion C2C (Particulier)'
                        : isNew
                        ? 'Neuf B2C (Librairie Partenaire)'
                        : isExchange
                        ? 'Troc direct (Livre contre Livre)'
                        : 'Solidaire (Don réversible pour écoles)'}
                    </span>
                  </div>
                </div>

                {/* Condition Box */}
                <div className="mt-3.5 space-y-2">
                  <div className="text-xs">
                    <span className="font-bold text-slate-700">État certifié : </span>
                    <span className="font-semibold text-emerald-700">{conditionLabels[condition].label}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{conditionLabels[condition].desc}</p>
                  </div>

                  {listing.conditionDescription && (
                    <div className="p-2.5 rounded-lg bg-slate-100/70 text-xs text-slate-600 italic">
                      « {listing.conditionDescription} »
                    </div>
                  )}

                  {isExchange && listing.exchangeTargetBookTitle && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                      <span className="font-bold flex items-center gap-1 mb-0.5">
                        <ArrowRightLeft className="w-3.5 h-3.5" /> Manuel souhaité en échange :
                      </span>
                      <span>{listing.exchangeTargetBookTitle}</span>
                    </div>
                  )}
                </div>

                {/* Seller & Logistics Info */}
                <div className="mt-4 pt-3 border-t border-slate-200 text-xs space-y-1.5 text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>Localisation vendeur : {sellerQuarter}, {sellerCity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>Livraison directe P2P par agent ABX : 1 000 FCFA partagés</span>
                  </div>
                </div>

                {/* Escrow Guarantee Box */}
                <div className="mt-4 p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                  <Lock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Garantie Séquestre ABX :</span>
                    <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                      Vos fonds restent bloqués jusqu'à la remise en main propre et la validation de votre code secret OTP à la livraison. En cas de non-conformité, vous êtes remboursé immédiatement.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
                {isFree ? (
                  <button
                    onClick={() => {
                      onClose();
                      onInitiateBuy(listing);
                    }}
                    className="flex-1 py-3 px-4 bg-[#2E7D47] hover:bg-[#25663a] text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Réserver ce don pour une école (0 FCFA)</span>
                  </button>
                ) : isExchange ? (
                  <button
                    onClick={() => {
                      onClose();
                      onInitiateExchange(listing);
                    }}
                    className="flex-1 py-3 px-4 bg-[#2E7D47] hover:bg-[#25663a] text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Proposer un troc de manuel</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      onInitiateBuy(listing);
                    }}
                    className="flex-1 py-3 px-4 bg-[#1C2434] hover:bg-[#2C384E] text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Consigner les fonds & Commander ({price.toLocaleString()} FCFA)</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
