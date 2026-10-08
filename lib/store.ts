import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, CurrencyType, PaymentMethod, Product } from '@/types';

interface StoreState {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotalVND: () => number;
  getCartItemCount: () => number;

  // Currency
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // MFA Dedicated Account Detail View
  viewMfaProduct: Product | null;
  setViewMfaProduct: (product: Product | null) => void;

  // Checkout Modal Open state (để ẩn BottomNav trên mobile)
  isCheckoutModalOpen: boolean;
  setCheckoutModalOpen: (open: boolean) => void;

  // Discord Login / Auth Modal
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;

  // Legal / TOS & Warranty Modal
  isLegalModalOpen: boolean;
  legalInitialTab: string;
  setLegalModalOpen: (open: boolean, tab?: string) => void;

  // FAQ & 7 Tutorials Modal
  isTutorialModalOpen: boolean;
  tutorialInitialId: string | null;
  setTutorialModalOpen: (open: boolean, tutorialId?: string | null) => void;

  // Pre-selected Payment Method (đồng bộ giữa product selector và checkout)
  selectedPaymentMethod: PaymentMethod;
  setSelectedPaymentMethod: (method: PaymentMethod) => void;

  // Catalog Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  sortOption: 'popular' | 'newest' | 'price-asc' | 'price-desc';
  setSortOption: (option: 'popular' | 'newest' | 'price-asc' | 'price-desc') => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.cart.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
              isCartOpen: true,
            };
          }
          return {
            cart: [...state.cart, { product, quantity }],
            isCartOpen: true,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          cart: state.cart.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getCartTotalVND: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getCartItemCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Currency
      currency: 'VND',
      setCurrency: (currency) => set({ currency }),

      // Quick View
      quickViewProduct: null,
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),

      // MFA Dedicated Account Detail View
      viewMfaProduct: null,
      setViewMfaProduct: (product) => set({ viewMfaProduct: product }),

      // Checkout Modal
      isCheckoutModalOpen: false,
      setCheckoutModalOpen: (open) => set({ isCheckoutModalOpen: open }),

      // Discord Login / Auth Modal
      isAuthModalOpen: false,
      setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),

      // Legal & TOS Modal
      isLegalModalOpen: false,
      legalInitialTab: 'general',
      setLegalModalOpen: (open, tab = 'general') =>
        set({ isLegalModalOpen: open, legalInitialTab: tab }),

      // FAQ & 7 Tutorials Modal
      isTutorialModalOpen: false,
      tutorialInitialId: null,
      setTutorialModalOpen: (open, tutorialId = null) =>
        set({ isTutorialModalOpen: open, tutorialInitialId: tutorialId }),

      // Pre-selected Payment Method (default to SEPAY)
      selectedPaymentMethod: 'SEPAY',
      setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),

      // Catalog filters
      searchQuery: '',
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      activeCategory: 'all',
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      sortOption: 'popular',
      setSortOption: (sortOption) => set({ sortOption }),
      maxPrice: 50000000,
      setMaxPrice: (maxPrice) => set({ maxPrice }),
      inStockOnly: false,
      setInStockOnly: (inStockOnly) => set({ inStockOnly }),
    }),
    {
      name: 'chin-store-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        currency: state.currency,
      }),
    }
  )
);
