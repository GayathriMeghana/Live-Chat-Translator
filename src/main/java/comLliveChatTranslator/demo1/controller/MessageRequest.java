package comLliveChatTranslator.demo1.controller;

import lombok.Data;
@Data
public class MessageRequest {
//    private Long senderId;
    private Long receiverId;
    private String originalText;
}
