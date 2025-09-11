package org.rin.app.feature.redis;




import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;


@Service
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
public class OnlineUserService {
    final Duration TTL = Duration.ofMinutes(5);
    RedisTemplate<String, String> redisTemplate;


    public void markOnlineUser(String userId) {
        redisTemplate.opsForValue().set("online:" + userId, "1", TTL);

    }
    public void markOfflineUser(String userId) {
        redisTemplate.delete("online:" + userId);
    }

    public List<String> getAllOnlineUsers() {
        return redisTemplate.keys("online:*").stream()
                .map(key -> key.replace("online:", ""))
                .toList();
    }

    public boolean isOnline(String userId) {
        return redisTemplate.hasKey("online:" + userId);
    }
}
