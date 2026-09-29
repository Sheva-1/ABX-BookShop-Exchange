import React, { useState } from 'react';
import { Listing, Order, UserProfile } from '../../types';
import {
  X,
  Lock,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  Info,
  Clock,
} from 'lucide-react';

interface EscrowCheckoutModalProps {
  listing: Listing | null;
  currentUser: UserProfile;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const EscrowCheckoutModal: React.FC<EscrowCheckoutModalProps> = ({
  listing,
  currentUser,
  onClose,
  onOrderSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'orange_money' | 'mtn_momo' | 'campost'>('orange_money');
  const [phoneNumber, setPhoneNumber] = useState<string>(currentUser.phoneNumber || '694881230');
  const [deliveryQuarter, setDeliveryQuarter] = useState<string>(currentUser.quarter || 'Akwa');
  const [deliveryCity, setDeliveryCity] = useState<string>(currentUser.city || 'Douala');
  
  // Checkout flow states: 'form' | 'ussd_prompt' | 'escrow_locked_success'
  const [step, setStep] = useState<'form' | 'ussd_prompt' | 'escrow_locked_success'>('form');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!listing) return null;

  const { book, type, price, sellerRole } = listing;

  // Commission computation based on PRD:
  // 12% on used parent sellers
  // 8% on independent sellers ("vendeurs poteau")
  // 7% on new B2C books
  let commissionRate = 0.12;
  if (sellerRole === 'seller_pro') {
    commissionRate = 0.07;
  } else if (listing.sellerName.toLowerCase().includes('poteau')) {
    commissionRate = 0.08;
  }

  const commissionAmount = Math.round(price * commissionRate);
  const deliveryFee = 1000; // Fixed shared delivery fee
  const totalAmount = price + deliveryFee;

  const handleInitiatePayment = () => {
    setStep('ussd_prompt');

    // Simulate USSD push and HMAC verified webhook response
    setTimeout(() => {
      // Generate unique random 6-digit OTP delivery code
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const orderNumber = `ABX-CMD-${Math.floor(4000 + Math.random() * 5000)}`;

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        buyerId: currentUser.id,
        buyerName: currentUser.fullName,
        buyerPhone: phoneNumber.startsWith('+237') ? phoneNumber : `+237 ${phoneNumber}`,
        buyerCity: deliveryCity,
        buyerQuarter: deliveryQuarter,
        listingId: listing.id,
        listing,
        agentId: 'usr-agent-01',
        agentName: 'Kamdem Sylvain',
        agentPhone: '+237 655 40 92 11',
        status: 'escrow_locked',
        paymentMethod,
        paymentReference: `${paymentMethod === 'orange_money' ? 'OM' : paymentMethod === 'mtn_momo' ? 'MOMO' : 'CAMP'}-TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
        itemPrice: price,
        platformCommission: commissionAmount,
        deliveryFee,
        totalAmount,
        escrowLockedAt: new Date().toISOString(),
        otpDeliveryCode: generatedOtp,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        inspections: [
          {
            id: `insp-init-${Date.now()}`,
            orderId: `ord-${Date.now()}`,
            inspectionStep: 1,
            inspectorId: listing.sellerId,
            inspectorName: listing.sellerName,
            isApproved: true,
            notes: 'Photos conformes et vidéo de feuilletage validées lors de la publication de l’annonce.',
            checklist: {
              coverIntact: true,
              pagesComplete: true,
              noHeavyInkDamage: true,
              cleanBinding: true,
            },
            photoProofs: listing.imagesUrls,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      setCreatedOrder(newOrder);
      setStep('escrow_locked_success');
      onOrderSuccess(newOrder);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#1C2434] text-white">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold">Consignation Séquestre ABX</h3>
              <p className="text-[11px] text-slate-300">Paiement Mobile Money 100% protégé</p>
            </div>
          </div>
          {step !== 'ussd_prompt' && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Step 1: Form Breakdown */}
        {step === 'form' && (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Book Item Summary */}
            <div className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={listing.imagesUrls[0] || book.coverImage}
                alt={book.title}
                className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold text-[#2B8A88] uppercase block">
                  {book.educationLevel} · {book.subject}
                </span>
                <h4 className="text-sm font-bold text-[#1C2434] truncate mt-0.5">{book.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{book.publisher}</p>
                <div className="mt-1 text-xs font-extrabold text-[#1C2434]">
                  {price.toLocaleString()} FCFA
                </div>
              </div>
            </div>

            {/* Financial Breakdown (Escrow & Commissions) */}
            <div className="space-y-2 text-xs border-y border-slate-100 py-3">
              <div className="flex justify-between text-slate-600">
                <span>Prix du manuel scolaire :</span>
                <span className="font-semibold text-slate-800">{price.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  Frais de livraison fixes (Acheminement P2P) :
                </span>
                <span className="font-semibold text-slate-800">{deliveryFee.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Commission plateforme ({Math.round(commissionRate * 100)}% sur le vendeur) :</span>
                <span>Inclus ({commissionAmount.toLocaleString()} FCFA)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-bold text-[#1C2434]">
                <span>TOTAL À CONSIGNER AU SÉQUESTRE :</span>
                <span className="text-base text-[#2E7D47] font-extrabold">
                  {totalAmount.toLocaleString()} FCFA
                </span>
              </div>
            </div>

            {/* Delivery address details */}
            <div className="space-y-2 text-xs">
              <label className="block font-bold text-slate-700">Lieu de livraison souhaité :</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Ville (ex: Douala)"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#2B8A88]"
                />
                <input
                  type="text"
                  placeholder="Quartier / Repère (ex: Akwa)"
                  value={deliveryQuarter}
                  onChange={(e) => setDeliveryQuarter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#2B8A88]"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Mode de paiement Mobile Money :
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('orange_money')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'orange_money'
                      ? 'border-[#FF7900] bg-orange-50/60 ring-2 ring-[#FF7900]/30 text-orange-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-extrabold">Orange Money</div>
                  <div className="text-[10px] text-orange-800">#150*...</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mtn_momo')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'mtn_momo'
                      ? 'border-[#FFCC00] bg-amber-50/60 ring-2 ring-[#FFCC00]/50 text-amber-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-extrabold">MTN MoMo</div>
                  <div className="text-[10px] text-amber-800">*126#</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('campost')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'campost'
                      ? 'border-[#2B8A88] bg-teal-50/60 ring-2 ring-[#2B8A88]/30 text-teal-950 font-bold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-extrabold">CAMPOST</div>
                  <div className="text-[10px] text-teal-800">PostPay</div>
                </button>
              </div>

              {/* Phone number for USSD prompt */}
              <div className="mt-3">
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Numéro de débit USSD ({paymentMethod === 'orange_money' ? 'Orange' : paymentMethod === 'mtn_momo' ? 'MTN' : 'CAMPOST'}) :
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    +237
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber.replace('+237 ', '')}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="6XX XX XX XX"
                    className="w-full pl-14 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-semibold focus:outline-none focus:border-[#2E7D47]"
                  />
                </div>
              </div>
            </div>

            {/* Escrow Trust Guarantee */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Sécurité Séquestre Absolue :</span>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-snug">
                  L'argent ne quitte pas le compte séquestre tant que vous n'avez pas inspecté le livre à la réception et transmis votre code OTP secret à l'agent logistique.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleInitiatePayment}
              className="w-full py-3.5 px-4 bg-[#2E7D47] hover:bg-[#25663a] text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-emerald-200" />
              <span>Consigner et Payer {totalAmount.toLocaleString()} FCFA</span>
            </button>
          </div>
        )}

        {/* Step 2: USSD Prompt Waiting Simulation */}
        {step === 'ussd_prompt' && (
          <div className="p-8 text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-[#2E7D47] animate-spin" />
              <Smartphone className="w-6 h-6 text-[#2E7D47] absolute inset-0 m-auto" />
            </div>

            <h4 className="text-base font-bold text-[#1C2434]">
              Validation de l'invite Mobile Money...
            </h4>

            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Une notification USSD a été envoyée au <span className="font-bold text-slate-800">+237 {phoneNumber.replace('+237 ', '')}</span>.
              Veuillez saisir votre code PIN secret sur votre téléphone pour autoriser la consignation de <span className="font-bold text-slate-800">{totalAmount.toLocaleString()} FCFA</span>.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 max-w-xs mx-auto">
              <span>Passerelle Mobile Money : CinetPay / Hub2 Secure Switch</span>
            </div>
          </div>
        )}

        {/* Step 3: Success Screen & OTP Code Display */}
        {step === 'escrow_locked_success' && createdOrder && (
          <div className="p-6 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                Paiement Séquestre Consigné avec Succès
              </span>
              <h3 className="text-lg font-bold text-[#1C2434] mt-0.5">
                Commande {createdOrder.orderNumber}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Réf: {createdOrder.paymentReference} · {createdOrder.totalAmount.toLocaleString()} FCFA verrouillés
              </p>
            </div>

            {/* Secret OTP Delivery Code Box */}
            <div className="bg-[#1C2434] text-white p-4 rounded-xl shadow-inner">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest block mb-1">
                Votre Code Secret de Réception (OTP)
              </span>
              <div className="font-mono text-3xl font-extrabold tracking-widest text-emerald-300">
                {createdOrder.otpDeliveryCode}
              </div>
              <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                ⚠️ <strong className="text-white">Règle de sécurité ABX :</strong> Ne communiquez ce code à l'agent logistique qu'APRÈS avoir feuilleté et inspecté le manuel lors de la remise en main propre.
              </p>
            </div>

            {/* Logistics Status */}
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-left text-xs text-teal-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Truck className="w-4 h-4 text-teal-700" />
                <span>Agent mandaté : Kamdem Sylvain (+237 655 40 92 11)</span>
              </div>
              <p className="text-[11px] text-teal-800">
                L'agent va procéder au contrôle physique niveau 2 chez le vendeur puis acheminera le livre à {createdOrder.buyerQuarter}, {createdOrder.buyerCity}.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#1C2434] hover:bg-[#2C384E] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Fermer et Suivre la Commande
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
