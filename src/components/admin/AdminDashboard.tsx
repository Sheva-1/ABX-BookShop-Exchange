import React, { useState } from 'react';
import { Order, UserProfile, BeneficiarySchool, Listing } from '../../types';
import { EscrowBadge } from '../common/EscrowBadge';
import { runMediatorDisputeResolution } from '../../lib/gemini';
import {
  ShieldAlert,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Users,
  Building,
  Sparkles,
  Lock,
  ArrowRight,
  RefreshCcw,
  Check,
  Ban,
  TrendingUp,
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  profiles: UserProfile[];
  schools: BeneficiarySchool[];
  listings: Listing[];
  onUpdateOrder: (updatedOrder: Order) => void;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  profiles,
  schools,
  listings,
  onUpdateOrder,
  onUpdateProfile,
}) => {
  const [selectedDisputeOrderId, setSelectedDisputeOrderId] = useState<string>(
    orders.find((o) => o.status === 'disputed')?.id || orders[0]?.id || ''
  );
  const [isResolvingWithAI, setIsResolvingWithAI] = useState<boolean>(false);
  const [mediatorVerdict, setMediatorVerdict] = useState<any>(null);
  const [actionNotice, setActionNotice] = useState<string>('');

  const disputedOrders = orders.filter((o) => o.status === 'disputed');
  const activeEscrowOrders = orders.filter((o) => ['escrow_locked', 'assigned_to_agent', 'collected_verified'].includes(o.status));
  const completedOrders = orders.filter((o) => o.status === 'completed');

  // Treasury stats
  const totalLockedEscrow = activeEscrowOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalCommissionsEarned = completedOrders.reduce((acc, o) => acc + o.platformCommission, 0);
  const totalDeliveredTransactions = completedOrders.reduce((acc, o) => acc + o.itemPrice, 0);

  const selectedDisputeOrder = orders.find((o) => o.id === selectedDisputeOrderId) || disputedOrders[0] || orders[0];

  const handleRunMediatorAI = async () => {
    if (!selectedDisputeOrder) return;
    setIsResolvingWithAI(true);

    const step1 = selectedDisputeOrder.inspections.find((i) => i.inspectionStep === 1)?.notes || 'Annonce publiée bon état';
    const step2 = selectedDisputeOrder.inspections.find((i) => i.inspectionStep === 2)?.notes || 'Collecte effectuée';
    const step3 = selectedDisputeOrder.inspections.find((i) => i.inspectionStep === 3)?.notes || selectedDisputeOrder.disputeReason || 'Défaut majeur constaté à réception';

    const verdict = await runMediatorDisputeResolution(
      selectedDisputeOrder.orderNumber,
      selectedDisputeOrder.itemPrice,
      selectedDisputeOrder.disputeReason || 'Pages déchirées constatées',
      step1,
      step2,
      step3
    );

    setMediatorVerdict(verdict);
    setIsResolvingWithAI(false);
  };

  const handleApplyResolution = (action: 'refund_buyer' | 'release_to_seller') => {
    if (!selectedDisputeOrder) return;

    if (action === 'refund_buyer') {
      const updated: Order = {
        ...selectedDisputeOrder,
        status: 'refunded',
        updatedAt: new Date().toISOString(),
      };
      onUpdateOrder(updated);

      // Penalize seller with a strike
      const sellerProfile = profiles.find((p) => p.id === selectedDisputeOrder.listing.sellerId);
      if (sellerProfile) {
        const newDisputeCount = sellerProfile.disputeCount + 1;
        const isBanned = newDisputeCount >= 2; // Automatic exclusion after 2 strikes per PRD
        onUpdateProfile({
          ...sellerProfile,
          disputeCount: newDisputeCount,
          reputationBadge: isBanned ? 'exclu' : 'difficile',
          isBlocked: isBanned,
          reliabilityScore: Math.max(1.0, sellerProfile.reliabilityScore - 1.2),
        });
      }

      setActionNotice(`Arbitrage exécuté : Acheteur intégralement remboursé de ${selectedDisputeOrder.totalAmount.toLocaleString()} FCFA.`);
    } else {
      const updated: Order = {
        ...selectedDisputeOrder,
        status: 'completed',
        updatedAt: new Date().toISOString(),
      };
      onUpdateOrder(updated);
      setActionNotice(`Arbitrage exécuté : Fonds de ${selectedDisputeOrder.itemPrice.toLocaleString()} FCFA débloqués en faveur du vendeur.`);
    }

    setTimeout(() => setActionNotice(''), 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#1C2434] text-white p-5 sm:p-6 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>Console Administrateur ABX · Gouvernance Séquestre & Arbitrage</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold">Supervision Plateforme & Litiges</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Surveillance temps réel du compte séquestre, arbitrage des non-conformités et notation des acteurs.
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-bold">{actionNotice}</span>
        </div>
      )}

      {/* Financial Treasury KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Escrow Locked */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Fonds Séquestre Verrouillés</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1C2434]">
            {totalLockedEscrow.toLocaleString()} <span className="text-xs font-bold text-slate-400">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Réparti sur <strong>{activeEscrowOrders.length}</strong> commandes en transit sécurisé
          </div>
        </div>

        {/* Card 2: Platform Commissions Earned */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Commissions Collectées</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#2E7D47]">
            {totalCommissionsEarned.toLocaleString()} <span className="text-xs font-bold text-slate-400">FCFA</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Barèmes appliqués : 12% C2C · 8% Poteau · 7% Neuf B2C
          </div>
        </div>

        {/* Card 3: Dispute rate */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Taux de Litiges / Non-conformité</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1C2434]">
            {((disputedOrders.length / (orders.length || 1)) * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            Objectif Pilote &lt; 3.0% respecté
          </div>
        </div>
      </div>

      {/* Dispute Arbitration Center with ABX Mediator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Arbitrage des Litiges & Écarts d'Inspection
            </span>
            <h2 className="text-base font-bold text-[#1C2434] mt-0.5">
              Dossiers de Non-Conformité Signalés ({disputedOrders.length})
            </h2>
          </div>

          <button
            onClick={handleRunMediatorAI}
            disabled={isResolvingWithAI || !selectedDisputeOrder}
            className="px-3.5 py-2 bg-gradient-to-r from-[#1C2434] to-[#2B8A88] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 hover:opacity-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {isResolvingWithAI ? 'Analyse Mediator en cours...' : 'Solliciter l’IA ABX Mediator'}
            </span>
          </button>
        </div>

        {selectedDisputeOrder ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Left: Dispute Case Details */}
            <div className="space-y-3">
              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1 text-rose-950">
                <div className="flex justify-between font-bold">
                  <span>Dossier : {selectedDisputeOrder.orderNumber}</span>
                  <EscrowBadge status={selectedDisputeOrder.status} size="sm" />
                </div>
                <p className="text-[11px] font-semibold text-rose-900 mt-1">
                  Motif du signalement : {selectedDisputeOrder.disputeReason}
                </p>
                <div className="pt-2 text-[11px] text-rose-800">
                  Montant séquestre bloqué : <strong>{selectedDisputeOrder.totalAmount.toLocaleString()} FCFA</strong>
                </div>
              </div>

              {/* 3 Steps Inspection Proofs History */}
              <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
                <h4 className="font-bold text-slate-700 uppercase text-[10px]">
                  Historique Horodaté des 3 Niveaux de Contrôle :
                </h4>

                {selectedDisputeOrder.inspections.map((insp, idx) => (
                  <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 text-[11px]">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Niveau {insp.inspectionStep} : {insp.inspectorName}</span>
                      <span className={insp.isApproved ? 'text-emerald-700' : 'text-rose-600 font-bold'}>
                        {insp.isApproved ? '✓ Conforme' : '✗ Non Conforme'}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{insp.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: ABX Mediator AI Recommendation & Human Admin Verdict */}
            <div className="space-y-4 flex flex-col justify-between">
              {/* Mediator Card */}
              <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-xl space-y-2 text-teal-950">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5 text-xs text-[#2B8A88]">
                    <Sparkles className="w-4 h-4" />
                    Recommandation IA ABX Mediator :
                  </span>
                  <span className="text-[10px] bg-teal-200 px-2 py-0.5 rounded text-teal-900 font-mono">
                    pending_human_approval
                  </span>
                </div>

                <div className="font-extrabold text-sm text-[#1C2434]">
                  {mediatorVerdict?.recommendationLabel || selectedDisputeOrder.mediatorRecommendation?.action || 'Remboursement de l’acheteur recommandé'}
                </div>

                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {mediatorVerdict?.rationale || selectedDisputeOrder.mediatorRecommendation?.reason}
                </p>

                <div className="text-[10px] text-teal-800 font-semibold pt-1 border-t border-teal-200">
                  Sanction suggérée : {mediatorVerdict?.assignedPenalty || 'Frais de transport imputés au vendeur + Avertissement Strike 1.'}
                </div>
              </div>

              {/* Human Decision Buttons (HITL) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-[#1C2434] block text-xs">
                  Validation Humaine Obligatoire (Admin Decision) :
                </span>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => handleApplyResolution('refund_buyer')}
                    className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Rembourser Acheteur ({selectedDisputeOrder.totalAmount.toLocaleString()} FCFA)</span>
                  </button>

                  <button
                    onClick={() => handleApplyResolution('release_to_seller')}
                    className="flex-1 py-2.5 px-3 bg-[#2E7D47] hover:bg-[#25663a] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Débloquer au Vendeur ({selectedDisputeOrder.itemPrice.toLocaleString()} FCFA)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400 text-xs">
            Aucun litige en attente d'arbitrage. Toutes les transactions se déroulent sans incident.
          </div>
        )}
      </div>

      {/* Users & Reliability Governance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#2B8A88]" />
            <h3 className="text-sm font-bold text-[#1C2434]">
              Gouvernance des Acteurs & Règle d'Exclusion Anti-Récidive
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            2 signalements de non-conformité = Exclusion automatique
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Utilisateur</th>
                <th className="py-2.5 px-3">Rôle</th>
                <th className="py-2.5 px-3">Ville</th>
                <th className="py-2.5 px-3">Note de Fiabilité</th>
                <th className="py-2.5 px-3">Litiges (Strikes)</th>
                <th className="py-2.5 px-3">Statut Compte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profiles.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-bold text-[#1C2434]">{p.fullName}</td>
                  <td className="py-2.5 px-3 text-slate-600 capitalize">{p.role}</td>
                  <td className="py-2.5 px-3 text-slate-500">{p.city}</td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-800">
                    ★ {p.reliabilityScore.toFixed(2)} / 5.0
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-mono font-bold ${
                        p.disputeCount >= 2
                          ? 'text-rose-600'
                          : p.disputeCount === 1
                          ? 'text-amber-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {p.disputeCount} / 2
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {p.isBlocked ? (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[10px]">
                        <Ban className="w-3 h-3" /> Exclu & Banni
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Fiable
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
