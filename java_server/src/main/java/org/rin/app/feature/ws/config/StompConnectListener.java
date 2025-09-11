package org.rin.app.feature.ws.config;


import lombok.extern.slf4j.Slf4j;
import org.rin.app.feature.notification.service.NotificationService;
import org.rin.app.feature.redis.OnlineUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;

@Component
@Slf4j
public class StompConnectListener implements ApplicationListener<SessionConnectEvent> {
    @Autowired
    private OnlineUserService onlineUserService;

    @Autowired
    private NotificationService notificationService;

    @Override
    public void onApplicationEvent(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String userId = (String) accessor.getSessionAttributes().get("userId");
        log.info("Received online user id: {}.", userId);

        if (userId != null && !userId.isEmpty()) {
            onlineUserService.markOnlineUser(userId);
            notificationService.sendOnlineStatusUpdate(
                    org.rin.app.dto.OnlineUserDto.builder()
                            .userId(userId)
                            .isOnline(true)
                            .build()
            );
        }
    }
}
