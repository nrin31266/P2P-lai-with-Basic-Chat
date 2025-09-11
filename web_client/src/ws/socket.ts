import { CompatClient, Stomp } from "@stomp/stompjs";

let client: CompatClient | null = null;
let currentUserId: string | null = null;

export function getWebSocketClient(userId: string): CompatClient {
  if (!client || currentUserId !== userId) {
    client = Stomp.client(`ws://localhost:8080/ws?userId=${userId}`);
  }
  currentUserId = userId;
  return client;
}
