import React, { useState } from 'react';
import { Order, UserProfile } from '../../types';
import { EscrowBadge } from '../common/EscrowBadge';
import { InspectionTimeline } from '../common/InspectionTimeline';
import {
  PackageCheck,
  Lock,
  Phone,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface OrdersTrackingViewProps {
  orders: Order[];
  currentUser: UserProfile;
  onSelectOrder?: (order: Order) => void;
}

export const OrdersTrackingView: React.FC<OrdersTrackingViewProps> = ({
  orders,
  currentUser,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#2B8A88] uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Suivi des Fonds Séquestre & Livraisons P2P
          </span>
          <h1 className="text-xl font-bold text-[#1C2434] mt-0.5">
            Mes Commandes et Séquestres ({orders.length})
          </h1>
          <p className="text-xs text-slate-500">
            Fonds conservés en sécurité par ABX jusqu'à la remise et vérification du code secret OTP.
          </p>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Orders List */}
          <div className="lg:col-span-1 space-y-2.5">
            {orders.map((ord) => {
              const isSelected = selectedOrder?.id === ord.id;
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${
                    isSelected
                      ? 'bg-white border-[#2B8A88] ring-2 ring-[#2B8A88]/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#1C2434]">{ord.orderNumber}</span>
                    <EscrowBadge status={ord.status} size="sm" />
                  </div>

                  <div className="flex gap-2.5">
                    <img
                      src={ord.listing.imagesUrls[0] || ord.listing.book.coverImage}
                      alt={ord.listing.book.title}
                      className="w-10 h-14 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#1C2434] truncate">{ord.listing.book.title}</h4>
                      <p className="text-slate-500 text-[11px]">
                        {ord.listing.book.educationLevel} · {ord.listing.book.subject}
                      </p>
                      <div className="font-bold text-[#1C2434] mt-1">
                        {ord.totalAmount.toLocaleString()} FCFA
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Payé par : {ord.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                    <span className="text-[#2B8A88] font-bold">Détails →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Order Detail & OTP Box */}
          {selectedOrder && (
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
                {/* Header of selected order */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1C2434]">
                        Commande {selectedOrder.orderNumber}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-xs text-slate-500">Réf : {selectedOrder.paymentReference}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Commandé le {new Date(selectedOrder.createdAt).toLocaleDateString('fr-FR')} à {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <EscrowBadge status={selectedOrder.status} size="md" showDetails={true} />
                </div>

                {/* Secret OTP Delivery Code Box for Buyer */}
                <div className="bg-gradient-to-r from-[#1C2434] to-[#2C384E] text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                      Code Secret OTP de Réception
                    </span>
                    <p className="text-xs text-slate-300 mt-1 max-w-sm">
                      Communiquez ce code à l'agent logistique <strong>uniquement après</strong> avoir contrôlé et approuvé l'état du manuel à la remise.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 text-center">
                    <span className="text-[10px] text-emerald-300 uppercase font-bold block">
                      Code à 6 chiffres
                    </span>
                    <div className="font-mono text-3xl font-extrabold tracking-widest text-white mt-0.5">
                      {selectedOrder.otpDeliveryCode}
                    </div>
                  </div>
                </div>

                {/* Inspection Timeline */}
                <InspectionTimeline
                  orderStatus={selectedOrder.status}
                  inspections={selectedOrder.inspections}
                  otpCode={selectedOrder.otpDeliveryCode}
                  isBuyerOrAdmin={true}
                />

                {/* Financial Summary */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Prix de l'ouvrage :</span>
                    <span className="font-semibold text-slate-900">{selectedOrder.itemPrice.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Frais de livraison fixes :</span>
                    <span className="font-semibold text-slate-900">{selectedOrder.deliveryFee.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Commission plateforme ({selectedOrder.listing.sellerRole === 'seller_pro' ? '7%' : '12%'}) :</span>
                    <span>{selectedOrder.platformCommission.toLocaleString()} FCFA (séquestre)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-[#1C2434]">
                    <span>Total Consigné au Séquestre :</span>
                    <span className="text-emerald-700 font-extrabold">{selectedOrder.totalAmount.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
          Vous n'avez aucune commande en cours.
        </div>
      )}
    </div>
  );
};
