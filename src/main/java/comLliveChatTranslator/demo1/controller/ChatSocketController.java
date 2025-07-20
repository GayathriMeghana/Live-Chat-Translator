package comLliveChatTranslator.demo1.controller;
import comLliveChatTranslator.demo1.entity.Message;
import comLliveChatTranslator.demo1.model.ChatMessage;
import comLliveChatTranslator.demo1.model.UserStatus;
import comLliveChatTranslator.demo1.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;
import comLliveChatTranslator.demo1.model.TypingStatus;

@RestController
public class ChatSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService messageService;

    @MessageMapping("/chat") // listens to /app/chat
    public void handleChat(ChatMessage chatMessage) {
        // Save and translate message
        Message saved = messageService.sendMessage(
                chatMessage.getSenderId(),
                chatMessage.getReceiverId(),
                chatMessage.getMessage()
        );

        // Send to /topic/messages/{receiverId}
        messagingTemplate.convertAndSend("/topic/messages/" + chatMessage.getReceiverId(), saved);
    }

    @MessageMapping("/typing")
    @SendTo("/topic/typing")
    public TypingStatus handleTyping(@Payload TypingStatus typingStatus) {
        return typingStatus;
    }

    @MessageMapping("/status")
    @SendTo("/topic/status")
    public UserStatus handleUserStatus(@Payload UserStatus userStatus) {
        return userStatus;
    }

}
