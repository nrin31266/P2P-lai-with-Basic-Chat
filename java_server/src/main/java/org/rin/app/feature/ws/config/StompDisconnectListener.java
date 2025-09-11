package org.rin.app.feature.ws.config;


import lombok.extern.slf4j.Slf4j;
import org.rin.app.dto.OnlineUserDto;
import org.rin.app.feature.notification.service.NotificationService;
import org.rin.app.feature.redis.OnlineUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.LocalDateTime;

@Slf4j
@Component
public class StompDisconnectListener implements ApplicationListener<SessionDisconnectEvent> {
    @Autowired
    private OnlineUserService onlineUserService;

    @Autowired
    private NotificationService notificationService;

    @Override
    public void onApplicationEvent(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        String userId = (String) accessor.getSessionAttributes().get("userId");

        if (userId != null) {
            log.warn("User {} disconnected", userId);
            onlineUserService.markOfflineUser(userId);
            notificationService.sendOnlineStatusUpdate(
                    OnlineUserDto.builder()
                            .userId(userId)
                            .isOnline(false)
                            .build()
            );
        } else {
            log.warn("Disconnect event received but userId is null");
        }
    }
}
