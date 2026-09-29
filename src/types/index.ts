export type UserRole = 'parent' | 'seller_pro' | 'school' | 'agent' | 'admin';

export type BookCondition = 'new' | 'as_new' | 'good_condition' | 'fair_condition';

export type ListingType = 'used_sale' | 'new_sale' | 'exchange' | 'donation';

export type OrderStatus =
  | 'pending_payment'
  | 'escrow_locked'
  | 'assigned_to_agent'
  | 'collected_verified'
  | 'delivered_verified'
  | 'completed'
  | 'disputed'
  | 'refunded';

export type ReliabilityScore = 'fiable' | 'regulier' | 'difficile' | 'exclu';

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  city: string;
  quarter: string;
  reliabilityScore: number; // 0 - 5.0
  reputationBadge: ReliabilityScore;
  disputeCount: number;
  isBlocked: boolean;
  avatarUrl?: string;
  schoolName?: string; // If role === 'school'
  storeName?: string;  // If role === 'seller_pro'
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  educationLevel: string; // e.g. "6ème", "5ème", "3ème", "1ère C", "Terminale D", "Form 4"
  subsystem: 'francophone' | 'anglophone';
  subject: string;        // e.g. "Mathématiques", "Français", "Physique-Chimie"
  publisher: string;
  officialPrice: number;  // Price in FCFA
  coverImage: string;
  description: string;
  curriculumYear: string; // "2024-2025"
}

export interface Listing {
  id: string;
  bookId: string;
  book: Book;
  sellerId: string;
  sellerName: string;
  sellerRole: UserRole;
  sellerPhone: string;
  sellerCity: string;
  sellerQuarter: string;
  type: ListingType;
  condition: BookCondition;
  conditionDescription: string;
  price: number; // 0 if donation or exchange
  exchangeTargetBookTitle?: string;
  imagesUrls: string[];
  videoUrl?: string;
  hasVideoProof: boolean;
  isActive: boolean;
  createdAt: string;
  viewsCount: number;
  visionInspectionResult?: {
    verifiedCondition: BookCondition;
    detectedDefects: string[];
    confidence: number;
    pagesChecked: number;
    inkMarksDetected: boolean;
    bindingIntact: boolean;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerCity: string;
  buyerQuarter: string;
  listingId: string;
  listing: Listing;
  agentId?: string;
  agentName?: string;
  agentPhone?: string;
  status: OrderStatus;
  paymentMethod: 'orange_money' | 'mtn_momo' | 'campost';
  paymentReference: string;
  itemPrice: number;
  platformCommission: number;
  deliveryFee: number;
  totalAmount: number;
  escrowLockedAt?: string;
  otpDeliveryCode: string; // 6-digit code provided to buyer
  createdAt: string;
  updatedAt: string;
  inspections: QualityInspection[];
  disputeReason?: string;
  mediatorRecommendation?: {
    action: 'release_to_seller' | 'refund_buyer' | 'partial_refund';
    reason: string;
    confidence: number;
    status: 'pending_human_approval' | 'approved_by_admin';
  };
}

export interface QualityInspection {
  id: string;
  orderId: string;
  inspectionStep: 1 | 2 | 3; // 1: Vendeur, 2: Collecteur, 3: Acheteur
  inspectorId: string;
  inspectorName: string;
  isApproved: boolean;
  notes: string;
  checklist: {
    coverIntact: boolean;
    pagesComplete: boolean;
    noHeavyInkDamage: boolean;
    cleanBinding: boolean;
  };
  photoProofs: string[];
  timestamp: string;
}

export interface BeneficiarySchool {
  id: string;
  name: string;
  region: string;
  locality: string;
  representativeName: string;
  contactPhone: string;
  studentCount: number;
  requestedBooks: {
    subject: string;
    level: string;
    quantityRequested: number;
    quantityReceived: number;
  }[];
  totalDonationsReceived: number;
  impactStory: string;
  photoUrl: string;
}

export interface ExchangeProposal {
  id: string;
  offeredListingId: string;
  requestedListingId: string;
  proposerId: string;
  proposerName: string;
  ownerId: string;
  cashAdjustment: number; // Positive if proposer adds cash, 0 if even
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}
