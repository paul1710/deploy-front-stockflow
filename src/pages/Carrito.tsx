import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import Button from '../components/Button';

const toDisplayPrice = (value: number | string | null | undefined) => {
  const parsed = typeof value === 'string' ? Number(value) : value;
  if (typeof parsed !== 'number' || Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
};

export default function Carrito() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, total, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Carrito de Compras</h1>
          <Button onClick={() => navigate('/admin')}>Volver</Button>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">El carrito está vacío</p>
          <Button onClick={() => navigate('/catalogo')}>Ver Productos</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Carrito de Compras</h1>
        <Button onClick={() => navigate('/catalogo')}>Seguir Comprando</Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Producto</th>
                <th className="p-2 text-left">Precio</th>
                <th className="p-2 text-left">Cantidad</th>
                <th className="p-2 text-left">Subtotal</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.producto.id} className="border-b">
                  <td className="p-2">
                    <div>
                      <span className="font-medium">{item.producto.nombre}</span>
                      <span className="text-sm text-muted-foreground block">
                        {item.producto.categoria?.nombre || 'Sin categoría'}
                      </span>
                    </div>
                  </td>
                  <td className="p-2">${toDisplayPrice(item.producto.precio).toFixed(2)}</td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.producto.id, item.cantidad - 1)}
                        className="w-8 h-8 rounded border flex items-center justify-center"
                      >
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button 
                        onClick={() => updateQuantity(item.producto.id, item.cantidad + 1)}
                        className="w-8 h-8 rounded border flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-2">${(toDisplayPrice(item.producto.precio) * item.cantidad).toFixed(2)}</td>
                  <td className="p-2">
                    <button 
                      onClick={() => removeItem(item.producto.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:w-80 border rounded-lg p-4 h-fit">
          <div className="flex justify-between mb-2">
            <span>Total de artículos:</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between mb-4 font-bold text-lg">
            <span>Total:</span>
            <span>${toDisplayPrice(total).toFixed(2)}</span>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate('/checkout')} className="w-full">Proceder al Checkout</Button>
            <Button variant="secondary" onClick={clearCart} className="w-full">Vaciar Carrito</Button>
          </div>
        </div>
      </div>
    </div>
  );
}