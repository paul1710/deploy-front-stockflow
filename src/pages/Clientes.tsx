import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Button from '../components/Button';
import { useClientes, useCreateCliente, useUpdateCliente, useDeleteCliente } from '../hooks/useClientes';
import { type Cliente } from '../services/api';

export default function Clientes() {
  const navigate = useNavigate();
  const { data: clientes = [], isLoading, error } = useClientes();
  const createMutation = useCreateCliente();
  const updateMutation = useUpdateCliente();
  const deleteMutation = useDeleteCliente();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    identificacion: '',
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCliente) {
        await updateMutation.mutateAsync({ id: editingCliente.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setModalOpen(false);
      setEditingCliente(null);
      setFormData({ identificacion: '', nombres: '', apellidos: '', email: '', telefono: '', direccion: '' });
    } catch {
      console.error('Error saving cliente');
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      identificacion: cliente.identificacion,
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
    });
    setModalOpen(true);
  };

  const handleDelete = async (cliente: Cliente) => {
    if (confirm(`¿Eliminar cliente "${cliente.nombres} ${cliente.apellidos}"?`)) {
      try {
        await deleteMutation.mutateAsync(cliente.id);
      } catch {
        console.error('Error deleting cliente');
      }
    }
  };

  const openNewModal = () => {
    setEditingCliente(null);
    setFormData({ identificacion: '', nombres: '', apellidos: '', email: '', telefono: '', direccion: '' });
    setModalOpen(true);
  };

  if (isLoading) return <div className="flex items-center justify-center p-8">Cargando...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={() => navigate('/admin')}>Volver</Button>
      </div>

      {error && <div className="text-destructive mb-4">{String(error)}</div>}

      <Button onClick={openNewModal} className="mb-4">Nuevo Cliente</Button>

      <Table
        data={clientes}
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'identificacion', header: 'Identificación' },
          { key: 'nombres', header: 'Nombres' },
          { key: 'apellidos', header: 'Apellidos' },
          { key: 'email', header: 'Email' },
          { key: 'telefono', header: 'Teléfono' },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Identificación"
            value={formData.identificacion}
            onChange={(e) => setFormData({ ...formData, identificacion: e.target.value })}
            required
          />
          <Input
            label="Nombres"
            value={formData.nombres}
            onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
            required
          />
          <Input
            label="Apellidos"
            value={formData.apellidos}
            onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Teléfono"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            required
          />
          <Input
            label="Dirección"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            required
          />
          <div className="flex gap-2 mt-4">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingCliente ? 'Actualizar' : 'Crear'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}