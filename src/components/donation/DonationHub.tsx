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
      {/* Solidarity Hero Banner - Flat & Crisp */}
      <div className="rounded-2xl bg-[#1C2434] p-6 sm:p-8 text-white shadow-sm border border-slate-800 relative">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#242F42] text-emerald-400 text-xs font-bold mb-3 border border-slate-700/80">
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
            <span>School Book Donations · Giving old books a second home</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Pass along your child's old books to a classroom in need
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Even well-worn textbooks are pure gold to kids in rural classrooms. We pick up your donated books from home for free and make sure they reach the right school with photos to prove delivery.
          </p>

          {/* Impact Metrics - Flat solid cards */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#242F42] rounded-xl border border-slate-700/60">
              <span className="text-2xl font-black text-white">{totalDonationsDelivered}</span>
              <span className="block text-[11px] text-emerald-400 font-medium">Books delivered so far</span>
            </div>
            <div className="p-3 bg-[#242F42] rounded-xl border border-slate-700/60">
              <span className="text-2xl font-black text-white">{totalStudentsSupported}</span>
              <span className="block text-[11px] text-emerald-400 font-medium">Students supported</span>
            </div>
            <div className="p-3 bg-[#242F42] rounded-xl border border-slate-700/60 col-span-2 sm:col-span-1">
              <span className="text-2xl font-black text-white">100%</span>
              <span className="block text-[11px] text-emerald-400 font-medium">Free pickup for donors</span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onOpenSellModal}
              className="px-5 py-2.5 bg-[#2E7D47] text-white hover:bg-[#25663a] text-xs font-bold rounded-xl transition-transform active:scale-95 shadow-sm flex items-center gap-2"
            >
              <Gift className="w-4 h-4 text-white" />
              <span>Donate a book today</span>
            </button>
          </div>
        </div>
      </div>

      {pledgeSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="font-bold">Thank you! We've saved your donation pledge.</span>
            <p className="text-[11px] text-emerald-800">
              Our delivery team will get in touch to schedule a quick, free doorstep pickup.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Partner Schools & Wishlists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Schools List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-bold text-[#1C2434] uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-[#2E7D47]" />
            <span>Partner Schools</span>
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
                      {school.totalDonationsReceived} received
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span>{school.studentCount} students enrolled</span>
                    <span className="text-[#2E7D47] font-semibold">View wishlist →</span>
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
                    School Profile
                  </span>
                  <h2 className="text-lg font-bold text-[#1C2434]">{selectedSchool.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Contact: {selectedSchool.representativeName} · {selectedSchool.contactPhone}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs text-slate-500 block">Enrollment</span>
                  <span className="text-lg font-black text-[#1C2434]">{selectedSchool.studentCount}</span>
                  <span className="text-[10px] text-slate-400 block">children</span>
                </div>
              </div>

              {/* Impact Story */}
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/70 rounded-xl text-xs text-emerald-950">
                <span className="font-bold block mb-1">From the headteacher:</span>
                <p className="italic text-[11px] leading-relaxed text-emerald-900">
                  "{selectedSchool.impactStory}"
                </p>
              </div>

              {/* Urgent Textbook Wishlist */}
              <div>
                <h4 className="text-xs font-bold text-[#1C2434] uppercase tracking-wider mb-2.5">
                  Textbooks this school is currently asking for:
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
                            <span className="text-[#2E7D47] font-bold">{req.level}</span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Received: {req.quantityReceived} of {req.quantityRequested}</span>
                            <span className="font-semibold text-amber-700">{remaining} still needed</span>
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
                          <span>Pledge this book ({req.level})</span>
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
                    Donated books waiting for delivery:
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
                          alt={`${dl.book.title} (${dl.book.educationLevel} ${dl.book.subject})`}
                          className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-[#2E7D47] block">
                            Gift from {dl.sellerName}
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
