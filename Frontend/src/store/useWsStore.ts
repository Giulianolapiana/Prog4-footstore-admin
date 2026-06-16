import { create } from 'zustand';

export interface WsMessage {
  event: 'estado_cambiado' | 'pedido_cancelado' | 'pago_confirmado' | 'WS_CONNECTED';
  pedido_id: number;
  usuario_id: number | null;
  estado_nuevo: string;
  estado_anterior: string | null;
  motivo?: string | null;
  timestamp: string;
}

interface WsState {
  socket: WebSocket | null;
  isConnected: boolean;
  lastMessage: WsMessage | null;
  
  connect: () => void;
  disconnect: () => void;
  clearLastMessage: () => void;
}

export const useWsStore = create<WsState>((set, get) => {
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let retryCount = 0;
  let isIntentionallyClosed = false;

  const connect = () => {
    const currentSocket = get().socket;

    if (currentSocket?.readyState === WebSocket.OPEN || currentSocket?.readyState === WebSocket.CONNECTING) {
      return;
    }

    isIntentionallyClosed = false;
    
    // Obtenemos la URL del backend desde el entorno
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    
    // El websocket está montado en la raíz del servidor, no en /api/v1
    const baseHost = baseUrl.replace('/api/v1', '');
    const wsUrl = `${baseHost.replace(/^http/, 'ws')}/ws/pedidos`;
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      // Reconexión exitosa, reseteamos contadores
      retryCount = 0;
      set({ socket: ws, isConnected: true });
      console.log('✅ [WS] Conectado exitosamente');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as WsMessage;
        console.log('📩 [WS] Nuevo evento:', msg.event, 'Pedido:', msg.pedido_id);
        set({ lastMessage: msg });
      } catch (e) {
        console.error('Error parseando JSON del WS', e);
      }
    };

    ws.onclose = (event) => {
      set({ socket: null, isConnected: false });

      const wasNormal = event.code === 1000;
      const wasAuthRejected = event.code === 1008; 
      // El backend cerró la conexión por cookie inválida

      if (isIntentionallyClosed || wasNormal || wasAuthRejected) {
        console.warn(`[WS] Desconectado permanentemente (Code: ${event.code})`);
        return;
      }

      // Backoff
      retryCount++;
      const delay = Math.min(1000 * 2 ** retryCount, 30_000);
      console.warn(`[WS] Microcorte detectado. Reconectando en ${delay / 1000}s (Intento ${retryCount})`);
      
      retryTimer = setTimeout(() => {
        get().connect();
      }, delay);
    };

    ws.onerror = () => {

    };
  };

  return {
    socket: null,
    isConnected: false,
    lastMessage: null,

    connect,

    disconnect: () => {
      isIntentionallyClosed = true;
      if (retryTimer) clearTimeout(retryTimer);
      const { socket } = get();
      
      if (socket) {
        // Cierre limpio
        if (socket.readyState === WebSocket.CONNECTING) {
            socket.addEventListener("open", () => socket.close(1000), { once: true });
        } else if (socket.readyState === WebSocket.OPEN) {
            socket.close(1000);
        }
      }
      set({ socket: null, isConnected: false, lastMessage: null });
    },

    clearLastMessage: () => set({ lastMessage: null })
  };
});