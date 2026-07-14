import { useCartStore } from '../stores/cartStore';

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const total = items.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    totalItems,
  };
}