import React from 'react';
import { OrderStatus } from '../../types';
import { ShieldCheck, Lock, Truck, CheckCircle2, AlertTriangle, RefreshCcw } from 'lucide-react';

interface EscrowBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const EscrowBadge: React.FC<EscrowBadgeProps> = ({
  status,
  size = 'md',
  showDetails = false,
}) => {
  const config = {
    pending_payment: {
      label: 'En attente de paiement',
      sublabel: 'Paiement Mobile Money non initialisé',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: RefreshCcw,
      iconColor: 'text-amber-600',
    },
    escrow_locked: {
      label: 'Fonds Séquestre Verrouillés',
      sublabel: 'Paiement consigné en lieu sûr par ABX',
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      icon: Lock,
      iconColor: 'text-emerald-700',
    },
    assigned_to_agent: {
      label: 'Agent Mandaté · Séquestre Actif',
      sublabel: 'Collecte en cours chez le vendeur',
      color: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: Truck,
      iconColor: 'text-slate-700',
    },
    collected_verified: {
      label: 'Livre Vérifié · En Route',
      sublabel: 'Contrôle niveau 2 validé, en acheminement',
      color: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: ShieldCheck,
      iconColor: 'text-emerald-700',
    },
    delivered_verified: {
      label: 'Livre Remis · Attente OTP',
      sublabel: 'Inspection acheteur niveau 3 en cours',
      color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      icon: ShieldCheck,
      iconColor: 'text-emerald-700',
    },
    completed: {
      label: 'Séquestre Libéré · Transaction Clôturée',
      sublabel: 'Vendeur payé après code OTP valide',
      color: 'bg-emerald-100/70 text-emerald-950 border-emerald-300',
      icon: CheckCircle2,
      iconColor: 'text-emerald-700',
    },
    disputed: {
      label: 'Litige Ouvert · Séquestre Gelé',
      sublabel: 'Arbitrage ABX Mediator en cours',
      color: 'bg-rose-50 text-rose-900 border-rose-200',
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
    },
    refunded: {
      label: 'Acheteur Remboursé',
      sublabel: 'Fonds restitués après non-conformité',
      color: 'bg-slate-100 text-slate-800 border-slate-300',
      icon: RefreshCcw,
      iconColor: 'text-slate-600',
    },
  }[status];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] py-1 px-2.5 gap-1.5',
    md: 'text-xs py-1.5 px-3 gap-2',
    lg: 'text-sm py-2 px-4 gap-2.5 font-medium',
  }[size];

  return (
    <div
      className={`inline-flex items-center rounded-lg border ${config.color} ${sizeClasses} transition-all`}
    >
      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${config.iconColor}`} />
      <div className="flex flex-col">
        <span className="font-semibold leading-tight">{config.label}</span>
        {showDetails && (
          <span className="text-[10px] opacity-75 font-normal">{config.sublabel}</span>
        )}
      </div>
    </div>
  );
};
