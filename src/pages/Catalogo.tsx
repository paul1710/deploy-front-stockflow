import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductos } from '../hooks/useProductos';
import { useCategorias } from '../hooks/useCategorias';
import { useCart } from '../hooks/useCart';
import Button from '../components/Button';
import { type Producto } from '../services/api';

const toDisplayPrice = (value: number | string | null | undefined) => {
  const parsed = typeof value === 'string' ? Number(value) : value;
  if (typeof parsed !== 'number' || Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
};

export default function Catalogo() {
  const navigate = useNavigate();
  const { data: productos = [], isLoading: loadingProductos, error: errorProductos } = useProductos();
  const { data: categorias = [] } = useCategorias();
  const { addItem } = useCart();

  const [search, setSearch] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  const productosFiltrados = productos.filter((p: Producto) => {
    const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(search.toLowerCase());
    const matchesCategoria = !categoriaId || p.categoriaId === parseInt(categoriaId);
    return matchesSearch && matchesCategoria && p.stock > 0;
  });

  const handleAddToCart = (producto: Producto) => {
    addItem(producto, 1);
  };

  if (loadingProductos) return <div className="flex items-center justify-center p-8">Cargando...</div>;

  return (
    <div className="catalogo-container p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Catálogo de Productos</h1>
        <Button onClick={() => navigate('/admin')}>Volver</Button>
      </div>

      {errorProductos && <div className="text-destructive mb-4">{String(errorProductos)}</div>}

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className="border rounded-lg p-4">
            <div className="mb-2">
              <h3 className="font-semibold">{producto.nombre}</h3>
              <p className="text-sm text-muted-foreground">{producto.descripcion || 'Sin descripción'}</p>
              <p className="text-sm text-muted-foreground">{producto.categoria?.nombre || 'Sin categoría'}</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold">${toDisplayPrice(producto.precio).toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">Stock: {producto.stock}</span>
            </div>
            <Button 
              onClick={() => handleAddToCart(producto)} 
              disabled={producto.stock === 0}
              className="w-full"
            >
              {producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </Button>
          </div>
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No se encontraron productos</div>
      )}
    </div>
  );
}