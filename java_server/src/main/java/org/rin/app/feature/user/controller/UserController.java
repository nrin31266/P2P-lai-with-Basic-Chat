package org.rin.app.feature.user.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.rin.app.feature.redis.OnlineUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults (level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    OnlineUserService onlineUserService;

    @GetMapping("/online-users")
    public ResponseEntity<List<String>> getOnlineUsers() {
        List<String> onlineUsers = onlineUserService.getAllOnlineUsers();
        return new ResponseEntity<>(onlineUsers, HttpStatus.OK);
    }
}
