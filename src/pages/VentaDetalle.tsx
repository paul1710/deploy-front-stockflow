import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ventaService, type Venta } from '../services/api';
import Button from '../components/Button';

const toDisplayPrice = (value: number | string | null | undefined) => {
  const parsed = typeof value === 'string' ? Number(value) : value;
  if (typeof parsed !== 'number' || Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
};

export default function VentaDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [venta, setVenta] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (!id) return;
        const ventaData = await ventaService.getById(parseInt(id));
        if (!cancelled) {
          setVenta(ventaData);
        }
      } catch {
        if (!cancelled) setError('Error al cargar la venta');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <div>Cargando...</div>;

  if (error || !venta) {
    return (
      <div className="detalle-container">
        <div className="detalle-header">
          <h1>Detalle de Venta</h1>
          <Button onClick={() => navigate('/admin/ventas')}>Volver</Button>
        </div>
        <div className="detalle-error">{error || 'Venta no encontrada'}</div>
      </div>
    );
  }

  return (
    <div className="detalle-container">
      <div className="detalle-header">
        <h1>Detalle de Venta #{venta.id}</h1>
        <Button onClick={() => navigate('/admin/ventas')}>Volver</Button>
      </div>

      <div className="detalle-info">
        <div className="detalle-section">
          <h2>Información de la Venta</h2>
          <div className="detalle-row">
            <span className="detalle-label">Fecha:</span>
            <span className="detalle-value">{formatDate(venta.createdAt)}</span>
          </div>
          <div className="detalle-row">
            <span className="detalle-label">Total:</span>
            <span className="detalle-value total">${toDisplayPrice(venta.total).toFixed(2)}</span>
          </div>
        </div>

        <div className="detalle-section">
          <h2>Datos del Cliente</h2>
          {venta.cliente ? (
            <>
              <div className="detalle-row">
                <span className="detalle-label">Nombre:</span>
                <span className="detalle-value">{venta.cliente.nombres} {venta.cliente.apellidos}</span>
              </div>
              <div className="detalle-row">
                <span className="detalle-label">Identificación:</span>
                <span className="detalle-value">{venta.cliente.identificacion}</span>
              </div>
              <div className="detalle-row">
                <span className="detalle-label">Email:</span>
                <span className="detalle-value">{venta.cliente.email}</span>
              </div>
              <div className="detalle-row">
                <span className="detalle-label">Teléfono:</span>
                <span className="detalle-value">{venta.cliente.telefono}</span>
              </div>
              <div className="detalle-row">
                <span className="detalle-label">Dirección:</span>
                <span className="detalle-value">{venta.cliente.direccion}</span>
              </div>
            </>
          ) : (
            <p>Sin información del cliente</p>
          )}
        </div>
      </div>

      <div className="detalle-section">
        <h2>Productos</h2>
        <table className="detalle-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {venta.detalles?.map((detalle) => (
              <tr key={detalle.id}>
                <td>
                  <div className="detalle-producto">
                    <span className="producto-nombre">
                      {detalle.producto?.nombre || `Producto #${detalle.productoId}`}
                    </span>
                  </div>
                </td>
                <td>{detalle.cantidad}</td>
                <td>${toDisplayPrice(detalle.precioUnitario).toFixed(2)}</td>
                <td>${toDisplayPrice(detalle.subtotal).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="detalle-total">
          <span>Total:</span>
          <span>${toDisplayPrice(venta.total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}