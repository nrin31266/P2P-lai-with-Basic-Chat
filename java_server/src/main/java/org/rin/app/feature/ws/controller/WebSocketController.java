package org.rin.app.feature.ws.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.rin.app.feature.redis.OnlineUserService;
import org.rin.app.feature.ws.message.SignalMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
public class WebSocketController {
    OnlineUserService onlineUserService;
    SimpMessagingTemplate messagingTemplate;
    @MessageMapping("/ping")
    public void handlePing(Principal principal) {
        String userId = principal != null ? principal.getName() : null;
        if (userId != null && !userId.isEmpty()) {
            log.info("Ping từ userId: {}", userId);
            onlineUserService.markOnlineUser(userId); // Reset TTL
        } else {
            log.warn("Ping không có userId header");
        }
    }

    @MessageMapping("/signal")
    public void handleSignal(SignalMessage signalMessage, Principal principal) {
        String fromUserId = principal != null ? principal.getName() : null;
        if(fromUserId == null || fromUserId.isEmpty()) {
            log.warn("Signal không có userId header");
            return;
        }
        // Xử lý tín hiệu ở đây
        log.info("Signal từ userId: {} đến userId: {}, type: {}", fromUserId, signalMessage.getToUserId(), signalMessage.getType());
        signalMessage.setFromUserId(fromUserId);
        messagingTemplate.convertAndSendToUser(
                signalMessage.getToUserId(),
                "/queue/signal",
                signalMessage
        );
    }
}
