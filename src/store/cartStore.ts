import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItemType = 'product' | 'service';

export interface CartItem {
  id: string;
  type: CartItemType;
  title: string;
  image?: string;
  price: number;
  quantity: number;
  variant?: string;
  // Service-specific
  serviceDate?: string;
  travelers?: number;
  // Product-specific
  shippingWeight?: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getProductItems: () => CartItem[];
  getServiceItems: () => CartItem[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === item.id && i.variant === item.variant
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.variant === item.variant
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getProductItems: () => {
        return get().items.filter((i) => i.type === 'product');
      },

      getServiceItems: () => {
        return get().items.filter((i) => i.type === 'service');
      },
    }),
    {
      name: 'vsk-cart',
    }
  )
);
