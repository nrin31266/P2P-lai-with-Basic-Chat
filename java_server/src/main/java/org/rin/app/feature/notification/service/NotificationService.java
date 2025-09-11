package org.rin.app.feature.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.rin.app.dto.OnlineUserDto;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@RequiredArgsConstructor
public class NotificationService {
    SimpMessagingTemplate messagingTemplate;
    public void sendOnlineStatusUpdate(OnlineUserDto build) {
        messagingTemplate.convertAndSend("/topic/online-users", build);
    }
}
