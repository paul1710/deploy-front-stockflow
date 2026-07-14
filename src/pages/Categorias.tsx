import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import { useCategorias, useCreateCategoria, useUpdateCategoria, useDeleteCategoria } from '../hooks/useCategorias';
import { type Categoria } from '../services/api';

export default function Categorias() {
  const navigate = useNavigate();
  const { data: categorias = [], isLoading, error } = useCategorias();
  const createMutation = useCreateCategoria();
  const updateMutation = useUpdateCategoria();
  const deleteMutation = useDeleteCategoria();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategoria) {
        await updateMutation.mutateAsync({ id: editingCategoria.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setModalOpen(false);
      setEditingCategoria(null);
      setFormData({ nombre: '', descripcion: '' });
    } catch {
      console.error('Error saving categoria');
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setFormData({ nombre: categoria.nombre, descripcion: categoria.descripcion || '' });
    setModalOpen(true);
  };

  const handleDelete = async (categoria: Categoria) => {
    if (confirm(`¿Eliminar categoría "${categoria.nombre}"?`)) {
      try {
        await deleteMutation.mutateAsync(categoria.id);
      } catch {
        console.error('Error deleting categoria');
      }
    }
  };

  const openNewModal = () => {
    setEditingCategoria(null);
    setFormData({ nombre: '', descripcion: '' });
    setModalOpen(true);
  };

  if (isLoading) return <div className="flex items-center justify-center p-8">Cargando...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Button onClick={() => navigate('/admin')}>Volver</Button>
      </div>

      {error && <div className="text-destructive mb-4">{String(error)}</div>}

      <Button onClick={openNewModal} className="mb-4">Nueva Categoría</Button>

      <Table
        data={categorias}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'nombre', header: 'Nombre' },
          { key: 'descripcion', header: 'Descripción' },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}>
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
          <div className="flex gap-2 mt-4">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingCategoria ? 'Actualizar' : 'Crear'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}