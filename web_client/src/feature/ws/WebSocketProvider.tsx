import { createContext, useContext, useEffect, useState } from "react";
import { getWebSocketClient } from "./socket";
import type { CompatClient } from "@stomp/stompjs";
import { useAppSelector } from "../../redux/store";



const WsContext = createContext<CompatClient | null>(null);
export const useWebSocket = () => useContext(WsContext);

const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const userId = useAppSelector(state => state.auth.user?.userId);

  useEffect(() => {
    if (!userId) return;
    const client = getWebSocketClient(userId);

    client.connect(
      {},
      () => {
        console.log("✅ Connected WebSocket");
        setStompClient(client);
      },
      (err: unknown) => {
        console.log("❌ WS connect error", err);
      },

    );

    return () => {
      if (client.connected) {
        client.disconnect(() => {
          console.log("🔌 Disconnected WebSocket");
        });
      }
    };
  }, []);


  return (
    <WsContext.Provider value={stompClient}>{children}</WsContext.Provider>
  );
};

export default WebSocketProvider;
