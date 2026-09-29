import React, { useState } from 'react';
import { runBookMatcherChat, runVisionInspect, runMediatorDisputeResolution } from '../../lib/gemini';
import {
  X,
  Sparkles,
  BookOpen,
  Camera,
  ShieldAlert,
  Send,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AIAssistantsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubjectQuery?: (q: string) => void;
}

export const AIAssistantsDrawer: React.FC<AIAssistantsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectSubjectQuery,
}) => {
  const [activeTab, setActiveTab] = useState<'book_matcher' | 'vision_inspect' | 'mediator'>('book_matcher');

  // Agent 1: Book-Matcher State
  const [matcherQuery, setMatcherQuery] = useState<string>('Quels manuels me conseillez-vous pour la 3ème au Cameroun ?');
  const [matcherLevel, setMatcherLevel] = useState<string>('3ème');
  const [matcherLoading, setMatcherLoading] = useState<boolean>(false);
  const [matcherChatHistory, setMatcherChatHistory] = useState<
    { sender: 'user' | 'assistant'; text: string; savingsTip?: string }[]
  >([
    {
      sender: 'assistant',
      text: `Bonjour ! Je suis **ABX Book-Matcher**, votre conseiller pédagogique pour le programme officiel au Cameroun.

Mon objectif est de vous orienter vers les manuels agréés MINESEC tout en réduisant au maximum le budget de rentrée de votre famille.

Posez-moi une question sur une classe (ex: 6ème, 3ème, 1ère C, Form 4) ou une matière !`,
      savingsTip: 'Conseil ABX : Toujours vérifier le Canal Solidaire (Dons gratuits) avant d’acheter un livre d’occasion.',
    },
  ]);

  // Agent 2: Vision-Inspect State
  const [visionNotes, setVisionNotes] = useState<string>('Annotations au stylo bille sur la page 14');
  const [visionLoading, setVisionLoading] = useState<boolean>(false);
  const [visionResult, setVisionResult] = useState<any>(null);

  // Agent 3: Mediator State
  const [mediatorOrderNum, setMediatorOrderNum] = useState<string>('ABX-CMD-1144');
  const [mediatorDispute, setMediatorDispute] = useState<string>('12 pages arrachées au milieu du livre');
  const [mediatorLoading, setMediatorLoading] = useState<boolean>(false);
  const [mediatorResult, setMediatorResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSendMatcherQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matcherQuery.trim()) return;

    const userText = matcherQuery;
    setMatcherChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);
    setMatcherQuery('');
    setMatcherLoading(true);

    try {
      const response = await runBookMatcherChat(userText, matcherLevel);
      setMatcherChatHistory((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: response.reply,
          savingsTip: response.savingsTip,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setMatcherLoading(false);
    }
  };

  const handleRunVisionTest = async () => {
    setVisionLoading(true);
    try {
      const res = await runVisionInspect('test_manuel_math.webp', 210, visionNotes);
      setVisionResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setVisionLoading(false);
    }
  };

  const handleRunMediatorTest = async () => {
    setMediatorLoading(true);
    try {
      const res = await runMediatorDisputeResolution(
        mediatorOrderNum,
        1500,
        mediatorDispute,
        'Vendeur a déclaré bon état sans page manquante',
        'Contrôle agent rapide lors du ramassage',
        'Acheteur a constaté 12 pages arrachées à la réception et a refusé de donner le code OTP'
      );
      setMediatorResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setMediatorLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-[#1C2434] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2E7D47] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Suite IA Multi-Agents ABX</h2>
              <p className="text-[11px] text-slate-300">
                Book-Matcher · Vision-Inspect · Mediator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Agent Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold p-1">
          <button
            onClick={() => setActiveTab('book_matcher')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'book_matcher'
                ? 'bg-white text-[#2E7D47] font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Book-Matcher</span>
          </button>

          <button
            onClick={() => setActiveTab('vision_inspect')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'vision_inspect'
                ? 'bg-white text-[#2E7D47] font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Vision-Inspect</span>
          </button>

          <button
            onClick={() => setActiveTab('mediator')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'mediator'
                ? 'bg-white text-[#1C2434] font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Mediator</span>
          </button>
        </div>

        {/* Content Body per Agent */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* AGENT 1: BOOK-MATCHER */}
          {activeTab === 'book_matcher' && (
            <div className="space-y-4 flex flex-col h-full">
              {/* Directive Card */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  L'agent recommande les canaux selon la hiérarchie d'économie : <strong>1. Dons (0 FCFA)</strong> → <strong>2. Troc direct</strong> → <strong>3. Occasion (40-60%)</strong> → <strong>4. Neuf</strong>.
                </p>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {matcherChatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#1C2434] text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                      {msg.savingsTip && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                          <span className="font-bold uppercase tracking-wider text-[10px]">Tip:</span>
                          <span>{msg.savingsTip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {matcherLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                    <span>ABX Book-Matcher analyse le programme scolaire officiel...</span>
                  </div>
                )}
              </div>

              {/* Form Input */}
              <form onSubmit={handleSendMatcherQuery} className="pt-2 border-t border-slate-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Posez votre question (ex: Quels livres en 1ère C ?)"
                    value={matcherQuery}
                    onChange={(e) => setMatcherQuery(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#2E7D47]"
                  />
                  <button
                    type="submit"
                    disabled={matcherLoading}
                    className="p-2.5 bg-[#2E7D47] text-white rounded-xl hover:bg-[#25663a] disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* AGENT 2: VISION-INSPECT */}
          {activeTab === 'vision_inspect' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>ABX Vision-Inspect</strong> effectue le contrôle automatisé de niveau 1 : détection de dégradations, pages manquantes, traces d'encre et masquage PII / visages.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <label className="block font-bold text-slate-700">
                  Simulateur d'analyse d'état de manuel :
                </label>
                <input
                  type="text"
                  value={visionNotes}
                  onChange={(e) => setVisionNotes(e.target.value)}
                  placeholder="Ex: Traces d'encre à la page 10, couverture écornée..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#2E7D47]"
                />

                <button
                  onClick={handleRunVisionTest}
                  disabled={visionLoading}
                  className="w-full py-2.5 px-4 bg-[#2E7D47] hover:bg-[#25663a] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>{visionLoading ? 'Analyse en cours...' : 'Tester le diagnostic visuel IA'}</span>
                </button>
              </div>

              {visionResult && (
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[#1C2434] text-sm">Résultat Diagnostic Niveau 1 :</span>
                    <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                      Indice de confiance {Math.round(visionResult.confidence * 100)}%
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">
                      État attribué :
                    </span>
                    <span className="text-base font-extrabold text-[#2E7D47]">
                      {visionResult.conditionLabel}
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Anomalies relevées :</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {visionResult.detectedDefects.map((def: string, i: number) => (
                        <li key={i}>{def}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Bouclier vie privée (Visages & Cartes d'identité) :</span>
                    <span className="font-bold text-emerald-700">✓ Conforme (Flouté)</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AGENT 3: MEDIATOR */}
          {activeTab === 'mediator' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-[#1C2434] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>ABX Mediator</strong> analyse les écarts entre les 3 niveaux d'inspection et soumet une proposition d'arbitrage soumise à l'approbation humaine de l'administrateur.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Numéro de commande :</label>
                  <input
                    type="text"
                    value={mediatorOrderNum}
                    onChange={(e) => setMediatorOrderNum(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Litige signalé :</label>
                  <input
                    type="text"
                    value={mediatorDispute}
                    onChange={(e) => setMediatorDispute(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>

                <button
                  onClick={handleRunMediatorTest}
                  disabled={mediatorLoading}
                  className="w-full py-2.5 px-4 bg-[#1C2434] hover:bg-[#2C384E] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{mediatorLoading ? 'Arbitrage en cours...' : 'Générer l’avis d’arbitrage'}</span>
                </button>
              </div>

              {mediatorResult && (
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[#1C2434] text-sm">Proposition d'Arbitrage Séquestre :</span>
                    <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                      pending_human_approval
                    </span>
                  </div>

                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="text-emerald-800 block text-[10px] uppercase font-bold">
                      Recommandation :
                    </span>
                    <span className="text-sm font-extrabold text-[#1C2434]">
                      {mediatorResult.recommendationLabel}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {mediatorResult.rationale}
                  </p>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600">
                    <strong>Pénalité calculée :</strong> {mediatorResult.assignedPenalty}
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
