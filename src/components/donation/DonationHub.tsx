import React, { useState } from 'react';
import { BeneficiarySchool, Listing, UserProfile } from '../../types';
import {
  HeartHandshake,
  Building,
  Users,
  BookOpen,
  MapPin,
  CheckCircle2,
  Gift,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface DonationHubProps {
  schools: BeneficiarySchool[];
  donationListings: Listing[];
  currentUser: UserProfile;
  onOpenSellModal: () => void;
  onSelectListing: (listing: Listing) => void;
  onPledgeDirectDonation: (schoolId: string, subject: string, level: string) => void;
}

export const DonationHub: React.FC<DonationHubProps> = ({
  schools,
  donationListings,
  currentUser,
  onOpenSellModal,
  onSelectListing,
  onPledgeDirectDonation,
}) => {
  const [selectedSchool, setSelectedSchool] = useState<BeneficiarySchool | null>(schools[0]);
  const [pledgeSuccess, setPledgeSuccess] = useState<boolean>(false);

  const totalDonationsDelivered = schools.reduce((acc, s) => acc + s.totalDonationsReceived, 0);
  const totalStudentsSupported = schools.reduce((acc, s) => acc + s.studentCount, 0);

  const handlePledge = (subject: string, level: string) => {
    if (!selectedSchool) return;
    onPledgeDirectDonation(selectedSchool.id, subject, level);
    setPledgeSuccess(true);
    setTimeout(() => setPledgeSuccess(false), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Solidarity Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1B4D2E] via-[#2E7D47] to-[#1C2434] p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-xs text-emerald-200 text-xs font-bold mb-3">
            <HeartHandshake className="w-4 h-4 text-emerald-300" />
            <span>Canal Solidaire ABX · Don Irréversible de 3ème Main</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Offrez une seconde vie à vos livres pour équiper les écoles enclavées
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Vos anciens manuels scolaires de 3ème main ont encore une valeur inestimable pour les écoliers et collégiens des zones rurales. ABX organise l'enlèvement gratuit et l'acheminement sécurisé avec preuve de réception.
          </p>

          {/* Impact Metrics */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10">
              <span className="text-2xl font-black text-white">{totalDonationsDelivered}</span>
              <span className="block text-[11px] text-emerald-200">Manuels scolaires distribués</span>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10">
              <span className="text-2xl font-black text-white">{totalStudentsSupported}</span>
              <span className="block text-[11px] text-emerald-200">Élèves soutenus sur le terrain</span>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-2xl font-black text-white">100%</span>
              <span className="block text-[11px] text-emerald-200">Acheminement sans frais donateur</span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onOpenSellModal}
              className="px-5 py-2.5 bg-white text-[#1B4D2E] hover:bg-emerald-50 text-xs font-bold rounded-xl transition-transform active:scale-95 shadow-md flex items-center gap-2"
            >
              <Gift className="w-4 h-4 text-[#2E7D47]" />
              <span>Faire don d'un manuel maintenant</span>
            </button>
          </div>
        </div>
      </div>

      {pledgeSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold">Promesse de don enregistrée avec succès !</span>
            <p className="text-[11px] text-emerald-800">
              Notre équipe logistique ABX prendra contact pour convenir du ramassage à votre domicile ou point relais.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Partner Schools & Wishlists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Schools List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-bold text-[#1C2434] uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-[#2B8A88]" />
            <span>Écoles Partenaires Bénéficiaires</span>
          </h3>

          <div className="space-y-2.5">
            {schools.map((school) => {
              const isSelected = selectedSchool?.id === school.id;
              return (
                <div
                  key={school.id}
                  onClick={() => setSelectedSchool(school)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'bg-white border-[#2E7D47] ring-2 ring-[#2E7D47]/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-[#1C2434] text-sm">{school.name}</h4>
                      <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{school.region} · {school.locality}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                      {school.totalDonationsReceived} reçus
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span>{school.studentCount} élèves scolarisés</span>
                    <span className="text-[#2E7D47] font-semibold">Voir les besoins →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center & Right: Selected School Needs & Express Donation */}
        <div className="lg:col-span-2 space-y-5">
          {selectedSchool && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-[#2E7D47] uppercase tracking-wider">
                    Fiche Établissement
                  </span>
                  <h2 className="text-lg font-bold text-[#1C2434]">{selectedSchool.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Responsable : {selectedSchool.representativeName} · {selectedSchool.contactPhone}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Effectif</span>
                  <span className="text-lg font-black text-[#1C2434]">{selectedSchool.studentCount}</span>
                  <span className="text-[10px] text-slate-400 block">enfants</span>
                </div>
              </div>

              {/* Impact Story */}
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/70 rounded-xl text-xs text-emerald-950">
                <span className="font-bold block mb-1">Impact terrain vérifié :</span>
                <p className="italic text-[11px] leading-relaxed text-emerald-900">
                  « {selectedSchool.impactStory} »
                </p>
              </div>

              {/* Urgent Textbook Wishlist */}
              <div>
                <h4 className="text-xs font-bold text-[#1C2434] uppercase tracking-wider mb-2.5">
                  Besoins urgents de la rentrée pour cette école :
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedSchool.requestedBooks.map((req, idx) => {
                    const remaining = req.quantityRequested - req.quantityReceived;
                    const progress = Math.min(100, Math.round((req.quantityReceived / req.quantityRequested) * 100));

                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 flex flex-col justify-between text-xs space-y-2.5"
                      >
                        <div>
                          <div className="flex justify-between font-bold text-[#1C2434]">
                            <span>{req.subject}</span>
                            <span className="text-[#2B8A88] font-bold">{req.level}</span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Reçus : {req.quantityReceived} / {req.quantityRequested}</span>
                            <span className="font-semibold text-amber-700">Il manque {remaining}</span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                            <div
                              className="h-full bg-[#2E7D47] rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => handlePledge(req.subject, req.level)}
                          className="w-full py-1.5 px-3 bg-[#2E7D47] hover:bg-[#25663a] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>Je donne un livre ({req.level})</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Available Donation Listings Ready for Routing */}
              {donationListings.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-[#1C2434] uppercase tracking-wider mb-2.5">
                    Manuels donnés en attente d'acheminement :
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {donationListings.map((dl) => (
                      <div
                        key={dl.id}
                        onClick={() => onSelectListing(dl)}
                        className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-400 cursor-pointer flex gap-3 transition-all"
                      >
                        <img
                          src={dl.imagesUrls[0] || dl.book.coverImage}
                          alt={dl.book.title}
                          className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-[#2E7D47] block">
                            Don de {dl.sellerName}
                          </span>
                          <h5 className="text-xs font-bold text-[#1C2434] truncate mt-0.5">
                            {dl.book.title}
                          </h5>
                          <p className="text-[11px] text-slate-500">
                            {dl.book.educationLevel} · {dl.sellerQuarter}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
