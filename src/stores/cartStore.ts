import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Producto } from '../services/api';

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

interface CartState {
  items: CartItem[];
  addItem: (producto: Producto, cantidad?: number) => void;
  removeItem: (productoId: number) => void;
  updateQuantity: (productoId: number, cantidad: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (producto: Producto, cantidad = 1) => {
        set((state) => {
          const existing = state.items.find((item) => item.producto.id === producto.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.producto.id === producto.id
                  ? { ...item, cantidad: item.cantidad + cantidad }
                  : item
              ),
            };
          }
          return { items: [...state.items, { producto, cantidad }] };
        });
      },

      removeItem: (productoId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.producto.id !== productoId),
        }));
      },

      updateQuantity: (productoId: number, cantidad: number) => {
        if (cantidad <= 0) {
          get().removeItem(productoId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.producto.id === productoId ? { ...item, cantidad } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);