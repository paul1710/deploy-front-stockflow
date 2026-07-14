import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productoService } from '../services/api';

export function useProductos() {
  return useQuery({
    queryKey: ['productos'],
    queryFn: () => productoService.list(),
  });
}

export function useProducto(id: number) {
  return useQuery({
    queryKey: ['productos', id],
    queryFn: () => productoService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { nombre: string; descripcion?: string; precio: number; stock?: number; categoriaId?: number }) =>
      productoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}

export function useUpdateProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { nombre: string; descripcion?: string; precio: number; stock: number; categoriaId?: number } }) =>
      productoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}

export function useDeleteProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productoService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });
}