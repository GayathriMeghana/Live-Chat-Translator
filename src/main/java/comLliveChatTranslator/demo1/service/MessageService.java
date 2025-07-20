package comLliveChatTranslator.demo1.service;
import comLliveChatTranslator.demo1.entity.Message;
import comLliveChatTranslator.demo1.repository.MessageRepository;
import comLliveChatTranslator.demo1.service.TranslationService;
import comLliveChatTranslator.demo1.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepo;

    @Autowired
    private TranslationService translationService;

    @Autowired
    private UserRepository userRepository;

    public Message sendMessage(Long senderId, Long receiverId, String text) {
        String targetLang = userRepository.findById(receiverId).get().getPreferredLanguage();
        String sourceLang = userRepository.findById(senderId).get().getPreferredLanguage(); // optional
        String translatedText = translationService.translateText(sourceLang, targetLang, text);

        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setOriginalText(text);
        message.setTranslatedText(translatedText);
        message.setTimestamp(LocalDateTime.now());

        return messageRepo.save(message);
    }
    public List<Message> getChatHistory(Long user1Id, Long user2Id) {
        return messageRepo.findChatHistoryBetweenUsers(user1Id, user2Id);
    }

    public Message getMessageById(Long id) {
        return messageRepo.findById(id).orElseThrow(() -> new RuntimeException("Message not found"));
    }

    public Message saveMessage(Message message) {
        return messageRepo.save(message);
    }


}
