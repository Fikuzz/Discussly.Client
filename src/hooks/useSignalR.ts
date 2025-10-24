import { useEffect } from 'react';
import { signalRService } from '../services/signalRService';


function useSignalR<T = unknown>(eventHandlers: Record<string, (data: T) => void>) {
  useEffect(() => {
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      signalRService.on(event, handler);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        signalRService.off(event, handler);
      });
    };
  }, [eventHandlers]);
}

export default useSignalR;