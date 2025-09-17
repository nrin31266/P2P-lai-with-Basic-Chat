package org.rin.app.feature.ws.message;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SignalMessage {
    String toUserId;
    Object signalData;
    String type; // "offer", "answer", "candidate"
    String fromUserId; // Thêm trường fromUserId
}
