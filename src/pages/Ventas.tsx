import { useNavigate } from 'react-router-dom';
import { useVentas, useDeleteVenta } from '../hooks/useVentas';
import Button from '../components/Button';

const toDisplayPrice = (value: number | string | null | undefined) => {
  const parsed = typeof value === 'string' ? Number(value) : value;
  if (typeof parsed !== 'number' || Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
};

export default function Ventas() {
  const navigate = useNavigate();
  const { data: ventas = [], isLoading, error } = useVentas();
  const deleteMutation = useDeleteVenta();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async (venta: typeof ventas[0]) => {
    if (confirm(`¿Anular la venta #${venta.id}? Esto restaurará el stock.`)) {
      try {
        await deleteMutation.mutateAsync(venta.id);
      } catch {
        console.error('Error al anular la venta');
      }
    }
  };

  if (isLoading) return <div className="flex items-center justify-center p-8">Cargando...</div>;

  return (
    <div className="ventas-container p-4">
      <div className="ventas-header flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Historial de Ventas</h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/catalogo')}>Nueva Venta</Button>
          <Button variant="secondary" onClick={() => navigate('/admin')}>Volver</Button>
        </div>
      </div>

      {error && <div className="text-destructive mb-4">{String(error)}</div>}

      <div className="ventas-table-container overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Cliente</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id} className="border-b hover:bg-muted/50">
                <td className="p-2">#{venta.id}</td>
                <td className="p-2">{formatDate(venta.createdAt)}</td>
                <td className="p-2">
                  {venta.cliente ? (
                    <div>
                      <span className="font-medium">
                        {venta.cliente.nombres} {venta.cliente.apellidos}
                      </span>
                      <span className="text-muted-foreground text-sm ml-2">({venta.cliente.identificacion})</span>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="p-2 font-medium">${toDisplayPrice(venta.total).toFixed(2)}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => navigate(`/admin/ventas/${venta.id}`)}>
                      Ver Detalle
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(venta)}>
                      Anular
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ventas.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No hay ventas registradas</p>
          <Button onClick={() => navigate('/catalogo')}>Realizar Primera Venta</Button>
        </div>
      )}
    </div>
  );
}