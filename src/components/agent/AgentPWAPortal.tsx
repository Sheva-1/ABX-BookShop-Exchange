import React, { useState } from 'react';
import { Order, UserProfile, QualityInspection } from '../../types';
import { EscrowBadge } from '../common/EscrowBadge';
import { InspectionTimeline } from '../common/InspectionTimeline';
import {
  Truck,
  MapPin,
  Phone,
  Camera,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  ShieldCheck,
  Check,
  RefreshCw,
  Search,
  PackageCheck,
} from 'lucide-react';

interface AgentPWAPortalProps {
  orders: Order[];
  currentAgent: UserProfile;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const AgentPWAPortal: React.FC<AgentPWAPortalProps> = ({
  orders,
  currentAgent,
  onUpdateOrder,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  
  // Inspection form states
  const [coverIntact, setCoverIntact] = useState<boolean>(true);
  const [pagesComplete, setPagesComplete] = useState<boolean>(true);
  const [noHeavyInkDamage, setNoHeavyInkDamage] = useState<boolean>(true);
  const [cleanBinding, setCleanBinding] = useState<boolean>(true);
  const [agentNotes, setAgentNotes] = useState<string>('');
  const [isPhotoCaptured, setIsPhotoCaptured] = useState<boolean>(true);

  // OTP Code Entry
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState<string>('');

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleValidateLevel2Collection = (isApproved: boolean) => {
    if (!selectedOrder) return;

    if (!isApproved) {
      // Non-conformity detected at collection
      const nonConformInspection: QualityInspection = {
        id: `insp-l2-rej-${Date.now()}`,
        orderId: selectedOrder.id,
        inspectionStep: 2,
        inspectorId: currentAgent.id,
        inspectorName: `${currentAgent.fullName} (Agent Logistique PWA)`,
        isApproved: false,
        notes: agentNotes || 'Non-conformité constatée : état réel dégradé par rapport aux photos de l’annonce.',
        checklist: {
          coverIntact,
          pagesComplete,
          noHeavyInkDamage,
          cleanBinding,
        },
        photoProofs: [selectedOrder.listing.imagesUrls[0]],
        timestamp: new Date().toISOString(),
      };

      const updated: Order = {
        ...selectedOrder,
        status: 'disputed',
        disputeReason: `Refusé lors de la collecte (Niveau 2) par l'agent logistique : ${agentNotes || 'Livre abîmé ou non conforme'}`,
        updatedAt: new Date().toISOString(),
        inspections: [...selectedOrder.inspections, nonConformInspection],
      };

      onUpdateOrder(updated);
      setSuccessNotice('Signalement de non-conformité enregistré. Commande suspendue pour arbitrage ABX Mediator.');
      return;
    }

    // Collection approved
    const level2Inspection: QualityInspection = {
      id: `insp-l2-${Date.now()}`,
      orderId: selectedOrder.id,
      inspectionStep: 2,
      inspectorId: currentAgent.id,
      inspectorName: `${currentAgent.fullName} (Agent Logistique PWA)`,
      isApproved: true,
      notes: agentNotes || 'Inspection physique effectuée avec succès. Reliure intacte, pages complètes sans surcharge indélébile.',
      checklist: {
        coverIntact,
        pagesComplete,
        noHeavyInkDamage,
        cleanBinding,
      },
      photoProofs: [selectedOrder.listing.imagesUrls[0]],
      timestamp: new Date().toISOString(),
    };

    const updated: Order = {
      ...selectedOrder,
      status: 'collected_verified',
      updatedAt: new Date().toISOString(),
      inspections: [...selectedOrder.inspections, level2Inspection],
    };

    onUpdateOrder(updated);
    setSuccessNotice('Contrôle Niveau 2 validé ! Le manuel est maintenant en route vers l’acheteur.');
    setTimeout(() => setSuccessNotice(''), 4000);
  };

  const handleValidateLevel3Delivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length !== 6) {
      setOtpError('Veuillez saisir les 6 chiffres du code OTP fourni par l’acheteur.');
      return;
    }

    // Verify OTP against order OTP
    if (enteredOtp !== selectedOrder.otpDeliveryCode) {
      setOtpError('Code OTP incorrect ! Demandez à l’acheteur de vérifier le code affiché sur son application.');
      return;
    }

    // OTP Validated! Release Escrow to Seller!
    const level3Inspection: QualityInspection = {
      id: `insp-l3-${Date.now()}`,
      orderId: selectedOrder.id,
      inspectionStep: 3,
      inspectorId: selectedOrder.buyerId,
      inspectorName: `${selectedOrder.buyerName} (Acheteur - OTP Validé)`,
      isApproved: true,
      notes: 'Manuel vérifié et accepté par l’acheteur en main propre. Code OTP validé avec succès.',
      checklist: { coverIntact: true, pagesComplete: true, noHeavyInkDamage: true, cleanBinding: true },
      photoProofs: [selectedOrder.listing.imagesUrls[0]],
      timestamp: new Date().toISOString(),
    };

    const completedOrder: Order = {
      ...selectedOrder,
      status: 'completed',
      updatedAt: new Date().toISOString(),
      inspections: [...selectedOrder.inspections, level3Inspection],
    };

    onUpdateOrder(completedOrder);
    setOtpDigits(['', '', '', '', '', '']);
    setSuccessNotice(`Succès ! Code OTP vérifié. Les fonds de ${selectedOrder.itemPrice.toLocaleString()} FCFA ont été débloqués au vendeur.`);
    setTimeout(() => setSuccessNotice(''), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-5">
      {/* PWA Agent Header Banner */}
      <div className="bg-[#1C2434] text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2B8A88] flex items-center justify-center text-white">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Application PWA Agent Logistique
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                v1.0-online
              </span>
            </div>
            <h1 className="text-lg font-bold">{currentAgent.fullName}</h1>
            <p className="text-xs text-slate-300">
              Secteur opérationnel : {currentAgent.city} · {currentAgent.quarter}
            </p>
          </div>
        </div>

        <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 text-xs">
          <span className="text-slate-400 block text-[10px]">Missions assignées :</span>
          <span className="font-extrabold text-white text-base">
            {orders.filter((o) => o.status !== 'completed' && o.status !== 'refunded').length} courses actives
          </span>
        </div>
      </div>

      {successNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{successNotice}</span>
        </div>
      )}

      {/* Orders Selector Bar */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {orders.map((o) => {
          const isSelected = selectedOrder?.id === o.id;
          return (
            <button
              key={o.id}
              onClick={() => {
                setSelectedOrderId(o.id);
                setOtpDigits(['', '', '', '', '', '']);
                setOtpError('');
              }}
              className={`px-3 py-2 rounded-xl text-left border text-xs whitespace-nowrap transition-all flex-shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-white border-[#2B8A88] shadow-md ring-2 ring-[#2B8A88]/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <div>
                <div className="font-bold text-[#1C2434]">{o.orderNumber}</div>
                <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                  {o.listing.book.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedOrder && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Left Column: Mission Briefing & Contact */}
          <div className="space-y-4 md:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-400 uppercase text-[10px]">
                  Détails Commande
                </span>
                <EscrowBadge status={selectedOrder.status} size="sm" />
              </div>

              <div>
                <h3 className="font-bold text-[#1C2434] text-sm">
                  {selectedOrder.listing.book.title}
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {selectedOrder.listing.book.educationLevel} · {selectedOrder.listing.book.subject}
                </p>
                <div className="mt-1 font-bold text-[#1C2434]">
                  {selectedOrder.totalAmount.toLocaleString()} FCFA consigné
                </div>
              </div>

              {/* Point A: Vendeur (Collecte) */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-[#2B8A88] uppercase block">
                  1. Point de Collecte (Vendeur)
                </span>
                <p className="font-bold text-[#1C2434]">{selectedOrder.listing.sellerName}</p>
                <p className="text-slate-500 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {selectedOrder.listing.sellerQuarter}, {selectedOrder.listing.sellerCity}
                </p>
                <a
                  href={`tel:${selectedOrder.listing.sellerPhone}`}
                  className="inline-flex items-center gap-1 text-[11px] text-[#2B8A88] font-bold mt-1"
                >
                  <Phone className="w-3 h-3" />
                  {selectedOrder.listing.sellerPhone}
                </a>
              </div>

              {/* Point B: Acheteur (Livraison) */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-[#2E7D47] uppercase block">
                  2. Point de Livraison (Acheteur)
                </span>
                <p className="font-bold text-[#1C2434]">{selectedOrder.buyerName}</p>
                <p className="text-slate-500 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {selectedOrder.buyerQuarter}, {selectedOrder.buyerCity}
                </p>
                <a
                  href={`tel:${selectedOrder.buyerPhone}`}
                  className="inline-flex items-center gap-1 text-[11px] text-[#2E7D47] font-bold mt-1"
                >
                  <Phone className="w-3 h-3" />
                  {selectedOrder.buyerPhone}
                </a>
              </div>
            </div>

            {/* Quality Timeline */}
            <InspectionTimeline
              orderStatus={selectedOrder.status}
              inspections={selectedOrder.inspections}
              otpCode={selectedOrder.otpDeliveryCode}
              isBuyerOrAdmin={false}
            />
          </div>

          {/* Right Column: Execution Form (Level 2 Inspection OR Level 3 Delivery OTP) */}
          <div className="md:col-span-2 space-y-4">
            {/* Step A: Inspection Checklist at Collection (Level 2) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <ShieldCheck className="w-5 h-5 text-[#2B8A88]" />
                <div>
                  <h3 className="text-sm font-bold text-[#1C2434]">
                    Signalement & Contrôle Qualité Niveau 2 (Collecte)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Vérification physique obligatoire par l'agent lors de la prise en charge
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={coverIntact}
                    onChange={(e) => setCoverIntact(e.target.checked)}
                    className="w-4 h-4 text-[#2E7D47] rounded focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-700">
                    Couverture présente, propre et non arrachée
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={pagesComplete}
                    onChange={(e) => setPagesComplete(e.target.checked)}
                    className="w-4 h-4 text-[#2E7D47] rounded focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-700">
                    Pages complètes (aucun chapitre manquant ou page arrachée)
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={noHeavyInkDamage}
                    onChange={(e) => setNoHeavyInkDamage(e.target.checked)}
                    className="w-4 h-4 text-[#2E7D47] rounded focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-700">
                    Absence d'inscriptions ou ratures lourdes à l'encre indélébile
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={cleanBinding}
                    onChange={(e) => setCleanBinding(e.target.checked)}
                    className="w-4 h-4 text-[#2E7D47] rounded focus:ring-emerald-500"
                  />
                  <span className="font-semibold text-slate-700">
                    Reliure solide et pages solidaires
                  </span>
                </label>
              </div>

              {/* Photo Proof on Site */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-slate-600" />
                  <span className="font-semibold text-slate-700">
                    Photo de preuve inspectée sur place
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  {isPhotoCaptured ? '✓ Photo enregistrée' : 'Prendre photo'}
                </span>
              </div>

              <textarea
                rows={2}
                placeholder="Notes d'inspection (facultatif si conforme, obligatoire en cas d'anomalie)..."
                value={agentNotes}
                onChange={(e) => setAgentNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#2B8A88]"
              />

              {/* Level 2 Actions */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  disabled={selectedOrder.status === 'collected_verified' || selectedOrder.status === 'completed'}
                  onClick={() => handleValidateLevel2Collection(true)}
                  className="flex-1 py-2.5 px-3 bg-[#2E7D47] hover:bg-[#25663a] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Valider Collecte Conforme (Niveau 2)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleValidateLevel2Collection(false)}
                  className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Signaler Non-Conforme</span>
                </button>
              </div>
            </div>

            {/* Step B: Final Delivery & 6-Digit OTP Validation to release Escrow (Level 3) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <KeyRound className="w-5 h-5 text-[#2E7D47]" />
                <div>
                  <h3 className="text-sm font-bold text-[#1C2434]">
                    Remise à l'Acheteur & Déblocage du Séquestre (Niveau 3)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Saisissez le code secret OTP à 6 chiffres communiqué par l'acheteur après son inspection
                  </p>
                </div>
              </div>

              {selectedOrder.status === 'completed' ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-900 space-y-1">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                  <div className="font-bold text-sm">Commande Déjà Livrée & Séquestre Débloqué !</div>
                  <p className="text-[11px] text-emerald-800">
                    Le vendeur a reçu {selectedOrder.itemPrice.toLocaleString()} FCFA sur son portefeuille.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleValidateLevel3Delivery} className="space-y-4">
                  <div className="text-center">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Code OTP Acheteur (6 chiffres) :
                    </label>

                    {/* 6 digits input boxes */}
                    <div className="flex justify-center gap-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          className="w-10 h-12 text-center text-xl font-mono font-extrabold border-2 border-slate-300 focus:border-[#2E7D47] focus:ring-2 focus:ring-[#2E7D47]/20 rounded-xl bg-slate-50 text-[#1C2434] outline-none transition-all"
                        />
                      ))}
                    </div>

                    {otpError && (
                      <p className="text-xs font-semibold text-rose-600 mt-2 flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{otpError}</span>
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-snug">
                    <span className="font-bold text-slate-800">Avis d'arbitrage :</span> Si l'acheteur refuse l'ouvrage en main propre, ne forcez pas la validation. Utilisez le bouton "Signaler Non-Conforme" pour déclencher le remboursement immédiat.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#1C2434] hover:bg-[#2C384E] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                  >
                    <PackageCheck className="w-4 h-4 text-emerald-400" />
                    <span>Valider la Livraison & Débloquer les Fonds Séquestre</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
