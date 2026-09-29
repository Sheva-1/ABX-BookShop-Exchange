import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X, Check } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem('abx_cookie_consent_v1');
    if (!consent) {
      // Show banner after brief delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('abx_cookie_consent_v1', 'accepted');
    setIsVisible(false);
  };

  const handleRefuse = () => {
    localStorage.setItem('abx_cookie_consent_v1', 'refused');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-[#1C2434] text-white p-4 rounded-2xl shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#2E7D47]/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Gestion des Cookies & Données</span>
            <button
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Fermer le bandeau cookies"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
            ABX utilise des cookies strictement nécessaires pour sécuriser vos transactions par séquestre et mémoriser vos préférences de navigation conformes aux lois sur la protection des données personnelles.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleAccept}
              className="px-3.5 py-1.5 bg-[#2E7D47] hover:bg-[#25663a] text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 text-xs shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accepter</span>
            </button>
            <button
              onClick={handleRefuse}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-colors text-xs"
            >
              Refuser
            </button>
            <button
              onClick={onOpenPrivacy}
              className="ml-auto text-[11px] text-emerald-400 hover:underline"
            >
              Politique
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
