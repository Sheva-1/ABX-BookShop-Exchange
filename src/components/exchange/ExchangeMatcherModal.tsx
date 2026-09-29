import React, { useState } from 'react';
import { Listing, UserProfile, ExchangeProposal } from '../../types';
import { MOCK_BOOKS } from '../../data/mockData';
import {
  X,
  ArrowRightLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface ExchangeMatcherModalProps {
  targetListing: Listing | null;
  currentUser: UserProfile;
  onClose: () => void;
  onProposalSubmitted: (proposal: ExchangeProposal) => void;
}

export const ExchangeMatcherModal: React.FC<ExchangeMatcherModalProps> = ({
  targetListing,
  currentUser,
  onClose,
  onProposalSubmitted,
}) => {
  const [offeredBookTitle, setOfferedBookTitle] = useState<string>('Excellence en Mathématiques 5ème');
  const [offeredBookCondition, setOfferedBookCondition] = useState<string>('Bon état');
  const [cashAdjustment, setCashAdjustment] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!targetListing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const proposal: ExchangeProposal = {
      id: `exc-${Date.now()}`,
      offeredListingId: 'lst-offered-user',
      requestedListingId: targetListing.id,
      proposerId: currentUser.id,
      proposerName: currentUser.fullName,
      ownerId: targetListing.sellerId,
      cashAdjustment: Number(cashAdjustment),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    onProposalSubmitted(proposal);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#2E7D47] text-white">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-emerald-100" />
            <div>
              <h3 className="text-base font-bold">Proposition de Troc Direct</h3>
              <p className="text-[11px] text-emerald-100">Échange livre contre livre (0 FCFA d'achat)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {/* Target Book */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Livre que vous souhaitez obtenir :
              </span>
              <div className="flex gap-3">
                <img
                  src={targetListing.imagesUrls[0] || targetListing.book.coverImage}
                  alt={`Manuel scolaire demandé en troc : ${targetListing.book.title} (${targetListing.book.educationLevel} ${targetListing.book.subject})`}
                  className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#1C2434] line-clamp-1">
                    {targetListing.book.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {targetListing.book.educationLevel} · {targetListing.book.subject}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Propriétaire : <strong>{targetListing.sellerName}</strong> ({targetListing.sellerQuarter}, {targetListing.sellerCity})
                  </p>
                </div>
              </div>
            </div>

            {/* Swap visual separator */}
            <div className="flex items-center justify-center my-1 text-[#2E7D47]">
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
            </div>

            {/* Offered Book */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Manuel que vous proposez en échange :
              </label>
              <input
                type="text"
                value={offeredBookTitle}
                onChange={(e) => setOfferedBookTitle(e.target.value)}
                placeholder="Ex: Excellence en Mathématiques 5ème ou Français 5ème"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#2E7D47]"
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">État de votre manuel :</label>
                  <select
                    value={offeredBookCondition}
                    onChange={(e) => setOfferedBookCondition(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="Comme neuf">Comme neuf</option>
                    <option value="Bon état">Bon état</option>
                    <option value="État moyen">État moyen (3e main)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Ajustement financier (FCFA) :</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={cashAdjustment}
                    onChange={(e) => setCashAdjustment(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Logistics explanation for bilateral swaps */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Logistique Croisée en Miroir :</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Si l'autre parent accepte, un agent logistique ABX prendra votre livre, effectuera le contrôle niveau 2, et remettra simultanément les deux ouvrages avec validation des codes OTP.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#2E7D47] hover:bg-[#25663a] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Envoyer la Proposition de Troc Direct</span>
            </button>
          </form>
        ) : (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[#1C2434]">Proposition de Troc Transmise !</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Le parent <strong>{targetListing.sellerName}</strong> a été notifié par SMS. Vous recevrez une confirmation dès acceptation pour planifier la tournée logistique.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#1C2434] text-white text-xs font-bold rounded-xl hover:bg-slate-800"
            >
              Retour au catalogue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
