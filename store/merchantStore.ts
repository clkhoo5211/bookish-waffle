import { create } from 'zustand';
import { Merchant, MerchantSearchFilters } from '@/types/merchant';
import { calculateDistance } from '@/lib/utils/distance';

interface MerchantStore {
  // Merchants
  merchants: Merchant[];
  setMerchants: (merchants: Merchant[]) => void;
  addMerchant: (merchant: Merchant) => void;
  
  // User Location
  userLocation: { lat: number; lng: number; city: string; state: string } | null;
  setUserLocation: (location: { lat: number; lng: number; city: string; state: string }) => void;
  
  // Search & Filter
  searchMerchants: (filters: MerchantSearchFilters) => Merchant[];
  updateMerchantDistances: () => void;
  
  // Selected Merchant
  selectedMerchant: Merchant | null;
  setSelectedMerchant: (merchant: Merchant | null) => void;
}

export const useMerchantStore = create<MerchantStore>()((set, get) => ({
  merchants: [
    {
      id: 'nas-fish-chips',
      name: 'Nas Fish n Chips',
      logo: '🍟',
      banner: '/merchants/nas-banner.jpg',
      photo: '/merchants/nas-photo.jpg',
      address: {
        street: '28-G, Jalan Puteri 1/4, Bandar Puteri',
        city: 'Puchong',
        state: 'Selangor',
        postcode: '47100',
        country: 'Malaysia',
        lat: 3.0319,
        lng: 101.6195,
      },
      bnbRebate: 20,
      tokenRebate: 10,
      tokenSymbol: 'NFCT',
      tokenName: 'Nas Fish n Chips Token',
      tokenPurchasePlans: [
        { buy: 100, free: 10 },
        { buy: 200, free: 25 },
      ],
      supportedCurrencies: ['BNB', 'USDT', 'USD1'],
      distance: 0.5,
      about: 'Best Fish & Chips in Malaysia!',
      category: 'Restaurant',
    },
    {
      id: 'roasted-bean',
      name: 'The Roasted Bean Coffee Co.',
      logo: '☕',
      banner: '/merchants/coffee-banner.jpg',
      photo: '/merchants/coffee-photo.jpg',
      address: {
        street: '15-A, Jalan Puteri 2/2, Bandar Puteri',
        city: 'Puchong',
        state: 'Selangor',
        postcode: '47100',
        country: 'Malaysia',
        lat: 3.0325,
        lng: 101.6200,
      },
      bnbRebate: 15,
      tokenRebate: 20,
      tokenSymbol: 'TRBCC',
      tokenName: 'The Roasted Bean Coffee Token',
      tokenPurchasePlans: [
        { buy: 100, free: 10 },
        { buy: 500, free: 75 },
      ],
      supportedCurrencies: ['BNB', 'USDT'],
      distance: 0.8,
      about: 'Premium artisan coffee roasted daily',
      category: 'Cafe',
    },
  ],
  
  setMerchants: (merchants) => set({ merchants }),
  
  addMerchant: (merchant) =>
    set((state) => ({
      merchants: [...state.merchants, merchant],
    })),
  
  userLocation: {
    lat: 3.0319, // Puchong, Selangor
    lng: 101.6195,
    city: 'Puchong',
    state: 'Selangor',
  },
  
  setUserLocation: (location) => {
    set({ userLocation: location });
    get().updateMerchantDistances();
  },
  
  searchMerchants: (filters) => {
    let results = get().merchants;
    
    // Filter by search query
    if (filters.query) {
      const lowerQuery = filters.query.toLowerCase();
      results = results.filter(
        (m) =>
          m.name.toLowerCase().includes(lowerQuery) ||
          m.address.city.toLowerCase().includes(lowerQuery) ||
          m.address.state.toLowerCase().includes(lowerQuery) ||
          m.category.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Filter by max distance
    if (filters.maxDistance && filters.location) {
      results = results.filter(
        (m) => {
          const distance = calculateDistance(
            filters.location!.lat,
            filters.location!.lng,
            m.address.lat,
            m.address.lng
          );
          return distance <= filters.maxDistance!;
        }
      );
    }
    
    // Filter by BNB rebate
    if (filters.minBNBRebate) {
      results = results.filter((m) => m.bnbRebate >= filters.minBNBRebate!);
    }
    
    // Filter by token rebate
    if (filters.minTokenRebate) {
      results = results.filter((m) => m.tokenRebate >= filters.minTokenRebate!);
    }
    
    // Filter by category
    if (filters.category) {
      results = results.filter((m) => m.category === filters.category);
    }
    
    return results;
  },
  
  updateMerchantDistances: () => {
    const { userLocation, merchants } = get();
    if (!userLocation) return;
    
    const updatedMerchants = merchants.map((merchant) => ({
      ...merchant,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        merchant.address.lat,
        merchant.address.lng
      ),
    }));
    
    set({ merchants: updatedMerchants });
  },
  
  selectedMerchant: null,
  setSelectedMerchant: (merchant) => set({ selectedMerchant: merchant }),
}));

