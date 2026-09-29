import React from 'react';
import { QualityInspection, OrderStatus } from '../../types';
import { Check, Clock, AlertCircle, Shield, FileCheck, Truck, UserCheck } from 'lucide-react';

interface InspectionTimelineProps {
  orderStatus: OrderStatus;
  inspections: QualityInspection[];
  otpCode?: string;
  isBuyerOrAdmin?: boolean;
}

export const InspectionTimeline: React.FC<InspectionTimelineProps> = ({
  orderStatus,
  inspections,
  otpCode,
  isBuyerOrAdmin = false,
}) => {
  const step1 = inspections.find((i) => i.inspectionStep === 1);
  const step2 = inspections.find((i) => i.inspectionStep === 2);
  const step3 = inspections.find((i) => i.inspectionStep === 3);

  const isStep1Done = !!step1 && step1.isApproved;
  const isStep2Done =
    (!!step2 && step2.isApproved) ||
    ['collected_verified', 'delivered_verified', 'completed'].includes(orderStatus);
  const isStep3Done =
    (!!step3 && step3.isApproved) || orderStatus === 'completed';

  const isDisputed = orderStatus === 'disputed';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#2B8A88]" />
          <div>
            <h4 className="text-sm font-bold text-[#1C2434]">
              Chaîne de Contrôle Qualité à 3 Niveaux
            </h4>
            <p className="text-xs text-slate-500">
              Traçabilité anti-fraude garantie par séquestre ABX
            </p>
          </div>
        </div>
        {otpCode && (
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg text-right">
            <span className="block text-[10px] uppercase font-bold text-emerald-800">
              Code OTP Livraison
            </span>
            <span className="font-mono text-sm font-extrabold tracking-widest text-[#2E7D47]">
              {isBuyerOrAdmin ? otpCode : '••••••'}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                isStep1Done
                  ? 'bg-[#2E7D47] text-white shadow-sm'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isStep1Done ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div
              className={`w-0.5 h-10 my-1 ${
                isStep2Done ? 'bg-[#2E7D47]' : 'bg-slate-200'
              }`}
            />
          </div>
          <div className="flex-1 pb-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2434] flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-[#2B8A88]" />
                Niveau 1 · Dépôt & Preuve Vidéo (Vendeur)
              </span>
              <span className="text-[11px] text-slate-400">
                {step1?.timestamp ? new Date(step1.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Effectué'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {step1?.notes || 'Photos des faces et vidéo de feuilletage transmises.'}
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                isStep2Done
                  ? 'bg-[#2E7D47] text-white shadow-sm'
                  : orderStatus === 'assigned_to_agent'
                  ? 'bg-amber-400 text-white animate-pulse'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isStep2Done ? (
                <Check className="w-4 h-4" />
              ) : orderStatus === 'assigned_to_agent' ? (
                <Clock className="w-4 h-4" />
              ) : (
                '2'
              )}
            </div>
            <div
              className={`w-0.5 h-10 my-1 ${
                isStep3Done ? 'bg-[#2E7D47]' : isDisputed ? 'bg-rose-400' : 'bg-slate-200'
              }`}
            />
          </div>
          <div className="flex-1 pb-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2434] flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#2B8A88]" />
                Niveau 2 · Collecte & Inspection Physique (Agent PWA)
              </span>
              <span className="text-[11px] text-slate-400">
                {step2?.timestamp ? new Date(step2.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {isStep2Done
                ? step2?.notes || 'Vérification physique terminée : reliure, intégrité des pages et absence de ratures graves.'
                : orderStatus === 'assigned_to_agent'
                ? 'L’agent logistique se déplace pour l’enlèvement et le contrôle.'
                : 'En attente de ramassage.'}
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                isStep3Done
                  ? 'bg-[#2E7D47] text-white shadow-sm'
                  : isDisputed
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isStep3Done ? (
                <Check className="w-4 h-4" />
              ) : isDisputed ? (
                <AlertCircle className="w-4 h-4" />
              ) : (
                '3'
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1C2434] flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#2B8A88]" />
                Niveau 3 · Contrôle Réception & Code OTP (Acheteur)
              </span>
              <span className="text-[11px] text-slate-400">
                {step3?.timestamp ? new Date(step3.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {isStep3Done
                ? 'L’acheteur a inspecté l’ouvrage, validé l’état et transmis le code OTP. Fonds débloqués au vendeur.'
                : isDisputed
                ? 'Refus de conformité signalé à la réception. Dossier transféré à ABX Mediator.'
                : 'L’acheteur vérifie le livre en main propre avant de communiquer le code secret à l’agent.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
