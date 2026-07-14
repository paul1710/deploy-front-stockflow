import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import { useProductos, useCreateProducto, useUpdateProducto, useDeleteProducto } from '../hooks/useProductos';
import { useCategorias } from '../hooks/useCategorias';
import { type Producto } from '../services/api';

export default function Productos() {
  const navigate = useNavigate();
  const { data: productos = [], isLoading, error } = useProductos();
  const { data: categorias = [] } = useCategorias();
  const createMutation = useCreateProducto();
  const updateMutation = useUpdateProducto();
  const deleteMutation = useDeleteProducto();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoriaId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock) || 0,
        categoriaId: formData.categoriaId ? parseInt(formData.categoriaId) : undefined,
      };

      if (editingProducto) {
        await updateMutation.mutateAsync({ id: editingProducto.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setModalOpen(false);
      setEditingProducto(null);
      setFormData({ nombre: '', descripcion: '', precio: '', stock: '', categoriaId: '' });
    } catch {
      console.error('Error saving producto');
    }
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      categoriaId: producto.categoriaId?.toString() || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (producto: Producto) => {
    if (confirm(`¿Eliminar producto "${producto.nombre}"?`)) {
      try {
        await deleteMutation.mutateAsync(producto.id);
      } catch {
        console.error('Error deleting producto');
      }
    }
  };

  const openNewModal = () => {
    setEditingProducto(null);
    setFormData({ nombre: '', descripcion: '', precio: '', stock: '', categoriaId: '' });
    setModalOpen(true);
  };

  if (isLoading) return <div className="flex items-center justify-center p-8">Cargando...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button onClick={() => navigate('/admin')}>Volver</Button>
      </div>

      {error && <div className="text-destructive mb-4">{String(error)}</div>}

      <Button onClick={openNewModal} className="mb-4">Nuevo Producto</Button>

      <Table
        data={productos}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'nombre', header: 'Nombre' },
          { key: 'descripcion', header: 'Descripción' },
          { key: 'precio', header: 'Precio', render: (p) => `$${p.precio}` },
          { key: 'stock', header: 'Stock' },
          { key: 'categoria', header: 'Categoría', render: (p) => p.categoria?.nombre || '-' },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProducto ? 'Editar Producto' : 'Nuevo Producto'}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <Input
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />
          <Input
            label="Precio"
            type="number"
            step="0.01"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            required
          />
          <Input
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Categoría</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.categoriaId}
              onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingProducto ? 'Actualizar' : 'Crear'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}