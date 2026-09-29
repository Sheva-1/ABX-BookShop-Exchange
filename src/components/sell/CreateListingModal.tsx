import React, { useState } from 'react';
import { Listing, Book, BookCondition, ListingType, UserProfile } from '../../types';
import { MOCK_BOOKS, CURRICULUM_LEVELS, SUBJECTS } from '../../data/mockData';
import { compressImageToWebP, formatBytes } from '../../lib/compression';
import { runVisionInspect } from '../../lib/gemini';
import {
  X,
  Upload,
  Video,
  Camera,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ArrowRightLeft,
  HeartHandshake,
  DollarSign,
  Info,
} from 'lucide-react';

interface CreateListingModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onListingCreated: (newListing: Listing) => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  currentUser,
  onClose,
  onListingCreated,
}) => {
  const [listingType, setListingType] = useState<ListingType>('used_sale');
  const [selectedBookId, setSelectedBookId] = useState<string>(MOCK_BOOKS[0].id);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customAuthor, setCustomAuthor] = useState<string>('');
  const [customLevel, setCustomLevel] = useState<string>('6ème');
  const [customSubject, setCustomSubject] = useState<string>('Mathématiques');
  const [condition, setCondition] = useState<BookCondition>('good_condition');
  const [conditionDesc, setConditionDesc] = useState<string>('');
  const [price, setPrice] = useState<number>(2500);
  const [exchangeTarget, setExchangeTarget] = useState<string>('');
  
  // Media handling
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  ]);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
    savingsPct: number;
  } | null>({
    originalSize: 1850000, // 1.85 MB simulated original
    compressedSize: 245000, // 245 KB WebP
    savingsPct: 87,
  });

  const [hasVideoProof, setHasVideoProof] = useState<boolean>(true);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  const selectedBook = MOCK_BOOKS.find((b) => b.id === selectedBookId) || MOCK_BOOKS[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await compressImageToWebP(file);
      setUploadedImages([result.dataUrl, ...uploadedImages]);
      setCompressionStats({
        originalSize: result.originalSizeBytes,
        compressedSize: result.compressedSizeBytes,
        savingsPct: result.reductionPercentage,
      });

      // Run AI Vision-Inspect automated check
      setIsAnalyzingAI(true);
      const aiReport = await runVisionInspect(file.name, Math.round(result.compressedSizeBytes / 1024), conditionDesc);
      setAiAnalysisResult(aiReport);
      setCondition(aiReport.verifiedCondition);
      setIsAnalyzingAI(false);
    } catch (err) {
      console.error('Compression failed', err);
    }
  };

  const handleRunAiInspection = async () => {
    setIsAnalyzingAI(true);
    const aiReport = await runVisionInspect('page_flip_preview.webp', 245, conditionDesc);
    setAiAnalysisResult(aiReport);
    setCondition(aiReport.verifiedCondition);
    setIsAnalyzingAI(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookToUse: Book = selectedBookId === 'custom'
      ? {
          id: `bk-custom-${Date.now()}`,
          isbn: '978-284129' + Math.floor(1000 + Math.random() * 9000),
          title: customTitle || 'Manuel scolaire officiel',
          author: customAuthor || 'Inspecteurs Pédagogiques',
          educationLevel: customLevel,
          subsystem: 'francophone',
          subject: customSubject,
          publisher: 'Éditions Nationales Cameroun',
          officialPrice: price > 0 ? Math.round(price * 1.6) : 4000,
          coverImage: uploadedImages[0] || selectedBook.coverImage,
          description: conditionDesc || 'Manuel scolaire d’occasion en bon état d’usage.',
          curriculumYear: '2024-2025',
        }
      : selectedBook;

    const newListing: Listing = {
      id: `lst-${Date.now()}`,
      bookId: bookToUse.id,
      book: bookToUse,
      sellerId: currentUser.id,
      sellerName: currentUser.fullName,
      sellerRole: currentUser.role,
      sellerPhone: currentUser.phoneNumber,
      sellerCity: currentUser.city,
      sellerQuarter: currentUser.quarter,
      type: listingType,
      condition,
      conditionDescription: conditionDesc || 'Livre complet avec couverture plastifiée.',
      price: listingType === 'donation' || listingType === 'exchange' ? 0 : Number(price),
      exchangeTargetBookTitle: listingType === 'exchange' ? exchangeTarget : undefined,
      imagesUrls: uploadedImages.length > 0 ? uploadedImages : [selectedBook.coverImage],
      videoUrl: hasVideoProof ? 'https://assets.mixkit.co/videos/preview/mixkit-flipping-through-a-book-42407-large.mp4' : undefined,
      hasVideoProof,
      isActive: true,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      visionInspectionResult: {
        verifiedCondition: condition,
        detectedDefects: aiAnalysisResult?.detectedDefects || ['Aucune anomalie bloquante'],
        confidence: 0.95,
        pagesChecked: 180,
        inkMarksDetected: false,
        bindingIntact: true,
      },
    };

    onListingCreated(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#1C2434] text-white">
          <div>
            <h3 className="text-base font-bold">Publier un Manuel Scolaire</h3>
            <p className="text-[11px] text-slate-300">
              Contrôle qualité Niveau 1 · Vente, Troc ou Don
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Step 1: Channel Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Choisissez le canal de publication :
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setListingType('used_sale')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  listingType === 'used_sale'
                    ? 'border-[#2E7D47] bg-emerald-50/60 ring-2 ring-[#2E7D47]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C2434]">
                  <DollarSign className="w-3.5 h-3.5 text-[#2E7D47]" />
                  <span>Vente Occasion</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Paiement sécurisé par séquestre (12% com.)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setListingType('exchange')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  listingType === 'exchange'
                    ? 'border-[#2E7D47] bg-emerald-50/60 ring-2 ring-[#2E7D47]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C2434]">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-[#2E7D47]" />
                  <span>Troc Direct</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Échangez livre contre livre (0 FCFA d'achat)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setListingType('donation')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  listingType === 'donation'
                    ? 'border-[#2E7D47] bg-emerald-50/60 ring-2 ring-[#2E7D47]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D47]">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Don Solidaire</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Don irréversible pour écoles en zone rurale
                </p>
              </button>
            </div>
          </div>

          {/* Book Catalog Association */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Sélectionnez l'ouvrage dans le programme officiel :
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#2E7D47]"
            >
              {MOCK_BOOKS.map((b) => (
                <option key={b.id} value={b.id}>
                  [{b.educationLevel}] {b.title} — {b.publisher} (Neuf: {b.officialPrice} FCFA)
                </option>
              ))}
              <option value="custom">+ Autre manuel scolaire agréé...</option>
            </select>
          </div>

          {/* Custom book fields if 'custom' is selected */}
          {selectedBookId === 'custom' && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <input
                type="text"
                placeholder="Titre exact du manuel scolaire"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={customLevel}
                  onChange={(e) => setCustomLevel(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                >
                  {CURRICULUM_LEVELS.filter((l) => l.id !== 'all').map((lvl) => (
                    <option key={lvl.id} value={lvl.label}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
                <select
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                >
                  {SUBJECTS.filter((s) => !s.startsWith('Toutes')).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Pricing or Exchange Specifics */}
          {listingType === 'used_sale' && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">
                  Prix de vente souhaité (FCFA) :
                </label>
                <span className="text-[11px] text-slate-500">
                  Prix librairie neuf : <strong className="text-slate-700">{selectedBook.officialPrice.toLocaleString()} FCFA</strong>
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="500"
                  step="100"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-[#2E7D47]"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-semibold">
                  FCFA
                </span>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                <span>Commission ABX séquestre (12%) : {Math.round(price * 0.12)} FCFA</span>
                <span className="font-semibold text-[#2E7D47]">
                  Vous recevrez : {Math.round(price * 0.88).toLocaleString()} FCFA
                </span>
              </div>
            </div>
          )}

          {listingType === 'exchange' && (
            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2 text-xs">
              <label className="block font-bold text-emerald-950">
                Quel manuel recherchez-vous en échange direct ?
              </label>
              <input
                type="text"
                placeholder="Ex: Excellence en Mathématiques 4ème ou Sciences 4ème"
                value={exchangeTarget}
                onChange={(e) => setExchangeTarget(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#2E7D47]"
                required
              />
              <p className="text-[11px] text-emerald-800">
                Frais d'échange forfaitaires partagés : 500 à 1 000 FCFA lors du croisement logistique.
              </p>
            </div>
          )}

          {/* Condition Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              État physique du livre :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {(['new', 'as_new', 'good_condition', 'fair_condition'] as BookCondition[]).map((c) => {
                const isSelected = condition === c;
                const labels: Record<BookCondition, string> = {
                  new: 'Neuf (Blister)',
                  as_new: 'Comme neuf',
                  good_condition: 'Bon état',
                  fair_condition: 'État moyen (3e main)',
                };
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(c)}
                    className={`p-2.5 rounded-lg border text-center font-medium transition-colors ${
                      isSelected
                        ? 'bg-[#1C2434] text-white border-[#1C2434] shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {labels[c]}
                  </button>
                );
              })}
            </div>
            <textarea
              rows={2}
              placeholder="Précisez l'état : annotations au crayon, coins cornés, présence du nom de l'élève sur la page de garde..."
              value={conditionDesc}
              onChange={(e) => setConditionDesc(e.target.value)}
              className="mt-2 w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-[#2E7D47]"
            />
          </div>

          {/* Media Proof Section (Level 1 Inspection) with Client-Side Compression */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1C2434] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#2E7D47]" />
                  Contrôle Qualité Niveau 1 (Photos & Vidéo de feuilletage)
                </span>
                <p className="text-[11px] text-slate-500">
                  Compression automatique WebP &lt; 300 KB pour économiser vos données mobiles.
                </p>
              </div>

              {compressionStats && (
                <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded">
                  -{compressionStats.savingsPct}% data économisée
                </span>
              )}
            </div>

            {/* Media Upload and preview */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-300 hover:border-[#2E7D47] bg-white rounded-xl transition-colors">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-[10px] font-semibold text-slate-600">Ajouter photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedImages.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                  <img src={img} alt="Aperçu" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">
                    WebP
                  </span>
                </div>
              ))}
            </div>

            {/* Video flip toggle */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-700">Preuve vidéo de feuilletage (15s) jointe</span>
              </div>
              <input
                type="checkbox"
                checked={hasVideoProof}
                onChange={(e) => setHasVideoProof(e.target.checked)}
                className="w-4 h-4 text-[#2E7D47] rounded focus:ring-emerald-500"
              />
            </div>

            {/* Run AI Vision Inspection */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={handleRunAiInspection}
                disabled={isAnalyzingAI}
                className="text-xs font-bold text-[#2E7D47] hover:text-[#25663a] flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isAnalyzingAI ? 'Analyse IA Vision-Inspect en cours...' : 'Lancer le diagnostic IA Vision-Inspect'}
                </span>
              </button>
            </div>

            {/* AI Report preview */}
            {aiAnalysisResult && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1 text-emerald-950">
                <div className="font-bold flex items-center justify-between">
                  <span>Diagnostic ABX Vision-Inspect :</span>
                  <span className="text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded">
                    Fiabilité {Math.round(aiAnalysisResult.confidence * 100)}%
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800">{aiAnalysisResult.feedback}</p>
                <div className="text-[10px] text-emerald-700">
                  État recommandé : <strong>{aiAnalysisResult.conditionLabel}</strong> · Bouclier vie privée actif (visages/PII masqués).
                </div>
              </div>
            )}
          </div>

          {/* Submission button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-[#2E7D47] hover:bg-[#25663a] text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Valider et Publier l'Annonce (Niveau 1)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
