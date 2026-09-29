import { Book, Listing, Order, BeneficiarySchool, UserProfile, UserRole } from '../types';
import {
  MOCK_BOOKS,
  MOCK_LISTINGS,
  MOCK_ORDERS,
  MOCK_SCHOOLS,
  MOCK_PROFILES,
  CURRENT_USER,
} from '../data/mockData';

const STORAGE_KEYS = {
  LISTINGS: 'abx_listings_v1',
  ORDERS: 'abx_orders_v1',
  SCHOOLS: 'abx_schools_v1',
  CURRENT_ROLE: 'abx_current_role_v1',
};

export function getStoredListings(): Listing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading listings from storage', e);
  }
  return MOCK_LISTINGS;
}

export function saveListings(listings: Listing[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  } catch (e) {
    console.error('Failed saving listings', e);
  }
}

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading orders from storage', e);
  }
  return MOCK_ORDERS;
}

export function saveOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed saving orders', e);
  }
}

export function getStoredSchools(): BeneficiarySchool[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHOOLS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed reading schools from storage', e);
  }
  return MOCK_SCHOOLS;
}

export function saveSchools(schools: BeneficiarySchool[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(schools));
  } catch (e) {
    console.error('Failed saving schools', e);
  }
}

export function getStoredRole(): UserRole {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE);
    if (raw && ['parent', 'seller_pro', 'school', 'agent', 'admin'].includes(raw)) {
      return raw as UserRole;
    }
  } catch (e) {}
  return 'parent';
}

export function saveStoredRole(role: UserRole): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
  } catch (e) {}
}

export function getProfileForRole(role: UserRole): UserProfile {
  const match = MOCK_PROFILES.find((p) => p.role === role);
  return match || CURRENT_USER;
}
