import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { clienteService, ventaService, type Cliente } from '../services/api';
import Button from '../components/Button';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart, total } = useCart();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    clienteId: '',
    nuevoCliente: false,
    identificacion: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const clientesData = await clienteService.list();
        if (!cancelled) {
          setClientes(clientesData);
        }
      } catch {
        if (!cancelled) setError('Error al cargar clientes');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (items.length === 0) {
    navigate('/carrito');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      let clienteId = parseInt(formData.clienteId);

      if (formData.nuevoCliente) {
        const nuevoCliente = await clienteService.create({
          identificacion: formData.identificacion,
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          email: formData.email,
          telefono: formData.telefono,
          direccion: formData.direccion,
        });
        clienteId = nuevoCliente.id;
      }

      const detalles = items.map((item) => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
      }));

      await ventaService.create({ clienteId, detalles });
      clearCart();
      navigate('/admin/ventas');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al procesar la venta';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <Button variant="secondary" onClick={() => navigate('/carrito')}>Volver al Carrito</Button>
      </div>

      {error && <div className="checkout-error">{error}</div>}

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="checkout-section">
          <h2>Datos del Cliente</h2>

          <div className="checkout-field">
            <label>
              <input
                type="checkbox"
                checked={formData.nuevoCliente}
                onChange={(e) => setFormData({ ...formData, nuevoCliente: e.target.checked })}
              />
              ¿Nuevo cliente?
            </label>
          </div>

          {formData.nuevoCliente ? (
            <div className="checkout-fields">
              <div className="checkout-field">
                <label>Identificación *</label>
                <input
                  type="text"
                  value={formData.identificacion}
                  onChange={(e) => setFormData({ ...formData, identificacion: e.target.value })}
                  required
                />
              </div>
              <div className="checkout-field">
                <label>Nombres *</label>
                <input
                  type="text"
                  value={formData.nombres}
                  onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                  required
                />
              </div>
              <div className="checkout-field">
                <label>Apellidos *</label>
                <input
                  type="text"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  required
                />
              </div>
              <div className="checkout-field">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="checkout-field">
                <label>Teléfono *</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  required
                />
              </div>
              <div className="checkout-field">
                <label>Dirección *</label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="checkout-field">
              <label>Seleccionar Cliente *</label>
              <select
                value={formData.clienteId}
                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                required
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombres} {cliente.apellidos} - {cliente.identificacion}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="checkout-section">
          <h2>Resumen del Pedido</h2>
          <div className="checkout-items">
            {items.map((item) => (
              <div key={item.producto.id} className="checkout-item">
                <span>{item.producto.nombre} x {item.cantidad}</span>
                <span>${(item.producto.precio * item.cantidad).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="checkout-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Procesando...' : 'Confirmar Venta'}
        </Button>
      </form>
    </div>
  );
}