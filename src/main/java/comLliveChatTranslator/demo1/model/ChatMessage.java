package comLliveChatTranslator.demo1.model;
import lombok.Data;

@Data
public class ChatMessage {
    private Long senderId;
    private Long receiverId;
    private String message;
}
