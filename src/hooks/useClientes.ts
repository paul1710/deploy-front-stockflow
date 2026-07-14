import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clienteService } from '../services/api';

export function useClientes() {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: () => clienteService.list(),
  });
}

export function useCliente(id: number) {
  return useQuery({
    queryKey: ['clientes', id],
    queryFn: () => clienteService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { identificacion: string; nombres: string; apellidos: string; email: string; telefono: string; direccion: string }) =>
      clienteService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}

export function useUpdateCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { identificacion: string; nombres: string; apellidos: string; email: string; telefono: string; direccion: string } }) =>
      clienteService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => clienteService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}