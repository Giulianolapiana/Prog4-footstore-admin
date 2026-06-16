import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWsStore } from '../../../store/useWsStore';

export function useAdminOrdersFeed() {
  const queryClient = useQueryClient();
  const { isConnected, lastMessage } = useWsStore();

  useEffect(() => {
    if (isConnected && lastMessage) {
      if (lastMessage.event === 'estado_cambiado' || lastMessage.event === 'pedido_cancelado') {
        // Invalidarpara que el Gestor vea el cambio en tiempo real
        queryClient.invalidateQueries({ queryKey: ['admin-pedidos'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }
    }
  }, [isConnected, lastMessage, queryClient]);
}
