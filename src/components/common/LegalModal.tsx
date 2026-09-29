import React from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#1C2434] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPrivacy ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <FileText className="w-5 h-5 text-emerald-400" />
            )}
            <div>
              <h3 className="text-sm sm:text-base font-bold">
                {isPrivacy
                  ? 'Politique de Confidentialité & Protection des Données'
                  : 'Conditions Générales d’Utilisation & de Séquestre (CGU)'}
              </h3>
              <p className="text-[11px] text-slate-300">
                Plateforme ABX (BookShop Exchange) · Conformité Cameroun & RGPD
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {isPrivacy ? (
            <>
              <div>
                <h4 className="font-bold text-[#1C2434] text-sm mb-1">
                  1. Engagement de Confidentialité
                </h4>
                <p>
                  ABX accorde une importance primordiale à la protection de la vie privée des parents d'élèves, des enseignants, des libraires et des partenaires institutionnels. Nous nous engageons à collecter uniquement les informations strictement nécessaires à l'exécution de la transaction et de l'acheminement logistique.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#1C2434] text-sm mb-1">
                  2. Données Collectées & Finalités
                </h4>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li><strong>Identité & Téléphone :</strong> Utilisés exclusivement pour la notification SMS OTP, la coordination de livraison par l'agent et la validation du déblocage séquestre.</li>
                  <li><strong>Localisation de livraison :</strong> Ville et quartier de collecte ou de dépôt pour la planification des tournées locales.</li>
                  <li><strong>Photos & Vidéos de preuve :</strong> Destinées uniquement à l'inspection qualité niveau 1 et à la résolution des litiges.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#1C2434] text-sm mb-1">
                  3. Masquage Automatique des Données Personnelles (PII)
                </h4>
                <p>
                  Conformément aux directives de l'agent <em>ABX Vision-Inspect</em>, toute image contenant accidentellement un visage humain ou un document officiel d'identité est immédiatement traitée par algorithme de floutage avant tout archivage sur nos serveurs sécurisés.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#1C2434] text-sm mb-1">
                  4. Non-Divulgation & Sécurité des Données
                </h4>
                <p>
                  Les coordonnées téléphoniques et adresses exactes des utilisateurs ne sont jamais rendues publiques ni vendues à des tiers publicitaires. Elles demeurent cryptées et invisibles jusqu'à ce que les fonds de la commande soient définitivement consignés au séquestre.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="font-bold text-[#1C2434] text-sm mb-1">
                  1. Objet du Service ABX
                </h4>
                <p>
                  La plateforme ABX (BookShop Exchange) fournit un service d'intermédiation technique, de mise en relation et de sécurisation financière sous séquestre pour l'achat, la vente de seconde main, le troc direct et le don de manuels scolaires conformes aux programmes officiels du MINESEC.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#1C2434] text-sm mb-1">
                  2. Fonctionnement du Séquestre & Commissions
                </h4>
                <p>
                  Lors de toute commande, les fonds payés via Mobile Money (Orange Money, MTN) ou CAMPOST sont séquestrés par la plateforme. Les fonds ne sont libérés au vendeur qu'après saisie du code secret OTP à 6 chiffres par l'acheteur à la livraison. Le barème des commissions est fixé à :
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1 mt-1">
                  <li>12 % pour les vendeurs parents sur le Canal Occasion (C2C).</li>
                  <li>8 % pour les vendeurs indépendants (« vendeurs poteau »).</li>
                  <li>7 % pour les librairies et éditeurs partenaires vendant du neuf (B2C).</li>
                  <li>Frais de livraison fixes et partagés de 1 000 FCFA par commande P2P.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#1C2434] text-sm mb-1">
                  3. Règle d'Exclusion Anti-Récidive & Litiges
                </h4>
                <p>
                  Tout utilisateur (vendeur ou acheteur) ayant accumulé <strong>deux (2) signalements avérés de non-conformité</strong> ou de mauvaise foi lors du contrôle qualité à 3 niveaux est automatiquement exclu et banni de manière irrévocable de la plateforme ABX.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#1C2434] text-sm mb-1">
                  4. Caractère Irréversible des Dons Solidaires
                </h4>
                <p>
                  Les livres scolaires de 3ᵉ main remis dans le cadre du Canal Solidaire constituent des dons fermes et irréversibles destinés exclusivement aux écoles partenaires en zones rurales ou défavorisées.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1C2434] hover:bg-[#2C384E] text-white font-bold rounded-xl text-xs transition-colors"
          >
            J'ai compris et j'accepte
          </button>
        </div>
      </div>
    </div>
  );
};
