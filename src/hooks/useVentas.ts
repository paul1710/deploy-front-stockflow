import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ventaService } from '../services/api';

export function useVentas() {
  return useQuery({
    queryKey: ['ventas'],
    queryFn: () => ventaService.list(),
  });
}

export function useVenta(id: number) {
  return useQuery({
    queryKey: ['ventas', id],
    queryFn: () => ventaService.getById(id),
    enabled: !!id,
  });
}

export function useCreateVenta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { clienteId: number; detalles: { productoId: number; cantidad: number }[] }) =>
      ventaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
  });
}

export function useDeleteVenta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ventaService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
  });
}