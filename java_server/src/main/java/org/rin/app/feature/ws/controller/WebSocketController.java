package org.rin.app.feature.ws.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.rin.app.feature.redis.OnlineUserService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
public class WebSocketController {
    OnlineUserService onlineUserService;
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
}
