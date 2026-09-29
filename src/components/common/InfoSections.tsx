import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Navigation,
} from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    question: "How does escrow keep my money safe?",
    answer: "When you pay with Orange Money, MTN MoMo, or CAMPOST, your money doesn't go straight to the seller. We hold it safely in our escrow account. The seller only receives the payout after the courier hands the book to you in person, you flip through the pages yourself, and you share your 6-digit confirmation code.",
  },
  {
    question: "What if the book arrives damaged or has missing pages?",
    answer: "If pages are missing, torn, or marked with ink that wasn't shown in the photos, simply do not give your confirmation code to the courier. The delivery is marked as contested, your payment stays safe, and our team reviews the situation to refund you in full.",
  },
  {
    question: "How do direct textbook swaps work?",
    answer: "You list last year's textbook and choose the book your child needs next. Once another parent accepts the swap, a courier picks up both books, checks their condition on the spot, and delivers them at the same time. Neither parent pays retail book prices.",
  },
  {
    question: "Where do donated books go?",
    answer: "Donated books go directly to our partner schools in rural and underserved communities across Cameroon (like Mayo-Oulo, Dimako, and Mogodé). We pick up the books from you for free and deliver them directly into the hands of teachers and students.",
  },
  {
    question: "What fees do you charge?",
    answer: "We charge a 12% fee on used book sales between parents, 8% for street vendors, and 7% on new books sold by official bookstores. Direct home or pickup-point delivery is a simple 1,000 FCFA flat fee split per order.",
  },
];

export const REVIEWS_DATA = [
  {
    id: 1,
    author: "Mrs. Belinga Chantal",
    role: "Mother of 3 students (Collège Libermann, Douala)",
    rating: 5,
    text: "I sold four of my eldest son's 5th-grade textbooks in less than two days, and found his new 4th-grade books at half price. The courier met me right in Bonamoussadi, and I checked every page before giving my confirmation code. It was completely stress-free.",
    date: "3 days ago",
  },
  {
    id: 2,
    author: "Mr. Tagne Joseph",
    role: "Parent (Bépanda, Douala)",
    rating: 5,
    text: "Direct swapping saved me over 18,000 FCFA for the start of term. I traded last year's Maths book for this year's French textbook. Both books were in solid shape without torn pages or scribbles.",
    date: "5 days ago",
  },
  {
    id: 3,
    author: "Dr. Marie-Claire Ndongo",
    role: "Headteacher (Mayo-Oulo Partner School)",
    rating: 5,
    text: "Thanks to the school donation channel, 42 children in our rural primary school had reading and maths books in their hands from the very first week of class. You can trace every single parcel.",
    date: "1 week ago",
  },
];

interface InfoSectionsProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const InfoSections: React.FC<InfoSectionsProps> = ({
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <section className="space-y-12 my-10 border-t border-slate-200/80 pt-10">
      {/* 1. Client Reviews */}
      <div id="reviews-section" className="scroll-mt-24">
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Rated 4.9/5 by more than 3,200 parents</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2434]">
            What parents and teachers say about us
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real families across Douala and Yaoundé share how they saved time and money getting ready for the new school year.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REVIEWS_DATA.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1.5">5.0</span>
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div>
                  <span className="font-bold text-[#1C2434] block">{rev.author}</span>
                  <span className="text-slate-500">{rev.role}</span>
                </div>
                <span className="text-slate-400">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. FAQ Section */}
      <div id="faq-section" className="max-w-3xl mx-auto scroll-mt-24">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#2E7D47]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1C2434]">
            Everything you need to know before you start
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            How our escrow holds your money safely, how swaps work, and how we make sure books are in good shape.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#1C2434] hover:text-[#2E7D47] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#2E7D47]">Q{idx + 1}.</span> {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[#2E7D47]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Physical Address, Contact Details & Route Map */}
      <div id="contact-hub-section" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Contact Details */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#2E7D47] uppercase tracking-wider block">
                Main Hub & Operations Office
              </span>
              <h2 className="text-xl font-bold text-[#1C2434] mt-0.5">
                Come say hello or drop off your books in person
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Our central inspection and donation sorting hub is in downtown Douala (Akwa), easy to get to from anywhere in the city.
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#2E7D47] flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1C2434] block">Address:</span>
                  <span>Boulevard de la Liberté, Immeuble Horizon Akwa (Opposite Hôtel Koumassi), Douala, Cameroon</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#2E7D47] flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1C2434] block">Phone & WhatsApp support:</span>
                  <span>+237 694 88 12 30 / +237 671 22 45 89</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#1C2434] flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1C2434] block">Email:</span>
                  <span>contact@abx-exchange.cm / logistique@abx-exchange.cm</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1C2434] block">Opening hours:</span>
                  <span>Monday to Saturday: 7:30 AM – 6:30 PM | Open 7 days a week during back-to-school season</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <a
                href="https://maps.google.com/?q=4.051056,9.708535"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#1C2434] hover:bg-[#2C384E] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open in Google Maps</span>
              </a>
              <button
                onClick={onOpenTerms}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-[4/3] bg-slate-100">
            <iframe
              title="ABX Douala Akwa Hub location map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15919.265977934446!2d9.69978!3d4.051056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x106112852230a101%3A0x6b8ffba2a5c4efc!2sAkwa%2C%20Douala%2C%20Cameroon!5e0!3m2!1sen!2scm!4v1695900000000!5m2!1sen!2scm"
              className="w-full h-full border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute bottom-2 left-2 bg-[#1C2434] text-white text-[11px] px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>ABX Central Hub · Akwa, Douala</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
