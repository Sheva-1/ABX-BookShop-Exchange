import React, { useState } from 'react';
import { UserRole, UserProfile } from '../../types';
import { Logo } from '../common/Logo';
import {
  X,
  Smartphone,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  User,
  Building2,
  Truck,
  HeartHandshake,
  ShieldAlert,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onLoginSuccess: (profile: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [phoneNumber, setPhoneNumber] = useState<string>('694881230');
  const [fullName, setFullName] = useState<string>('Tchouassi Eric');
  const [city, setCity] = useState<string>('Douala');
  const [quarter, setQuarter] = useState<string>('Akwa Nord');
  
  // OTP states: 'phone' | 'otp_verification'
  const [step, setStep] = useState<'phone' | 'otp_verification'>('phone');
  const [otpDigits, setOtpDigits] = useState<string[]>(['4', '2', '8', '1', '9', '0']);
  const [isSendingOtp, setIsSendingOtp] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSendingOtp(true);
    // Simulate Supabase Phone OTP dispatch via SMS gateway (MTN/Orange Cameroon)
    setTimeout(() => {
      setIsSendingOtp(false);
      setStep('otp_verification');
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');

    if (enteredCode.length !== 6) {
      setOtpError('Veuillez renseigner les 6 chiffres du code SMS reçu.');
      return;
    }

    // Success login/signup
    const fullPhoneFormatted = phoneNumber.startsWith('+237')
      ? phoneNumber
      : `+237 ${phoneNumber}`;

    const profile: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: authMode === 'signup' ? fullName : fullName || 'Utilisateur ABX',
      phoneNumber: fullPhoneFormatted,
      role: selectedRole,
      city: city || 'Douala',
      quarter: quarter || 'Akwa',
      reliabilityScore: 5.0,
      reputationBadge: 'fiable',
      disputeCount: 0,
      isBlocked: false,
      storeName: selectedRole === 'seller_pro' ? 'Librairie Partenaire B2C' : undefined,
      schoolName: selectedRole === 'school' ? 'École Bénéficiaire' : undefined,
    };

    onLoginSuccess(profile);
    onClose();
  };

  const handleOtpInput = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const copy = [...otpDigits];
    copy[index] = val.slice(-1);
    setOtpDigits(copy);
    setOtpError('');

    if (val && index < 5) {
      const nextInput = document.getElementById(`sms-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const rolesConfig: { role: UserRole; title: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { role: 'parent', title: 'Parent / Élève', desc: 'Acheter, échanger ou donner des livres', icon: User },
    { role: 'seller_pro', title: 'Libraire / Éditeur (B2C)', desc: 'Vendre des manuels neufs agréés MINESEC', icon: Building2 },
    { role: 'agent', title: 'Agent Logistique PWA', desc: 'Enlèvement physique, contrôle & livraison', icon: Truck },
    { role: 'school', title: 'École Bénéficiaire', desc: 'Recevoir les dons du canal solidaire', icon: HeartHandshake },
    { role: 'admin', title: 'Administrateur ABX', desc: 'Gestion du séquestre et des litiges', icon: ShieldAlert },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#1C2434] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" whiteText={true} showSubtitle={false} />
            <div>
              <h3 className="text-sm font-bold">
                {authMode === 'signin' ? 'Connexion Sécurisée' : 'Créer un Compte ABX'}
              </h3>
              <p className="text-[11px] text-slate-300">
                Authentification par SMS OTP (Orange / MTN)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch Sign In vs Sign Up */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setStep('phone');
            }}
            className={`flex-1 py-2.5 text-center transition-all ${
              authMode === 'signin'
                ? 'bg-white text-[#2E7D47] font-bold border-b-2 border-[#2E7D47]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Se Connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setStep('phone');
            }}
            className={`flex-1 py-2.5 text-center transition-all ${
              authMode === 'signup'
                ? 'bg-white text-[#2E7D47] font-bold border-b-2 border-[#2E7D47]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            S'inscrire (Nouveau Compte)
          </button>
        </div>

        {/* Step 1: Phone / Info Input */}
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="p-5 sm:p-6 space-y-4 text-xs">
            {/* Role Selection */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Sélectionnez votre profil d'utilisateur :
              </label>
              <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {rolesConfig.map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRole === r.role;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setSelectedRole(r.role)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        isSelected
                          ? 'border-[#2E7D47] bg-emerald-50/60 ring-1 ring-[#2E7D47] text-emerald-950 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#2E7D47]' : 'text-slate-400'}`} />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-tight">{r.title}</div>
                        <div className="text-[10px] text-slate-500 truncate">{r.desc}</div>
                      </div>
                      {isSelected && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2E7D47]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extra fields if Signup */}
            {authMode === 'signup' && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom complet :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Tchouassi Eric ou Librairie Centrale"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs font-semibold focus:outline-none focus:border-[#2E7D47]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ville :</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Douala"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#2E7D47]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Quartier :</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Akwa Nord"
                      value={quarter}
                      onChange={(e) => setQuarter(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#2E7D47]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Phone Number */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Numéro de téléphone mobile (Cameroun) :
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">
                  +237
                </span>
                <input
                  type="tel"
                  required
                  placeholder="6XX XX XX XX"
                  value={phoneNumber.replace('+237 ', '')}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-14 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold text-sm tracking-wide focus:outline-none focus:border-[#2E7D47]"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Un code SMS gratuit à 6 chiffres vous sera envoyé via Orange Money ou MTN.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSendingOtp}
              className="w-full py-3 bg-[#2E7D47] hover:bg-[#25663a] disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 text-xs"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isSendingOtp ? 'Envoi du SMS...' : 'Recevoir le Code OTP par SMS'}</span>
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="p-5 sm:p-6 space-y-4 text-xs text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#1C2434]">Saisie du Code SMS (OTP)</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Code envoyé au <strong className="text-slate-800">+237 {phoneNumber.replace('+237 ', '')}</strong>
              </p>
            </div>

            {/* 6 digits input */}
            <div className="flex justify-center gap-1.5 my-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`sms-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInput(idx, e.target.value)}
                  className="w-9 h-11 text-center font-mono font-bold text-lg border-2 border-slate-300 focus:border-[#2E7D47] rounded-xl bg-slate-50 text-[#1C2434] outline-none"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-rose-600 text-xs font-semibold flex items-center justify-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{otpError}</span>
              </p>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-slate-600 hover:underline"
              >
                Modifier le numéro
              </button>
              <button
                type="button"
                onClick={() => setOtpDigits(['4', '2', '8', '1', '9', '0'])}
                className="text-[#2E7D47] font-bold hover:underline"
              >
                Renvoyer le SMS
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1C2434] hover:bg-[#2C384E] text-white font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 text-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Valider le Code & Se Connecter</span>
            </button>
          </form>
        )}

        {/* Security badge */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D47]" />
          <span>Sécurité Supabase Auth (SMS OTP) · Conforme RGPD & Protection PII</span>
        </div>
      </div>
    </div>
  );
};
