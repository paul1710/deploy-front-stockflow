import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriaService } from '../services/api';

export function useCategorias() {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: () => categoriaService.list(),
  });
}

export function useCategoria(id: number) {
  return useQuery({
    queryKey: ['categorias', id],
    queryFn: () => categoriaService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { nombre: string; descripcion?: string }) => categoriaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
}

export function useUpdateCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { nombre: string; descripcion?: string } }) =>
      categoriaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
}

export function useDeleteCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriaService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });
}