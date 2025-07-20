//package comLliveChatTranslator.demo1.controller;
//import comLliveChatTranslator.demo1.entity.Message;
//import comLliveChatTranslator.demo1.service.MessageService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/message")
//@CrossOrigin(origins = "*")
//public class MessageController {
//
//    @Autowired
//    private MessageService messageService;
//
//    @PostMapping("/send")
//    public Message sendMessage(@RequestBody MessageRequest request) {
//        return messageService.sendMessage(request.getSenderId(), request.getReceiverId(), request.getOriginalText());
//    }
//
//    @GetMapping("/history")
//    public List<Message> getChatHistory(@RequestParam Long senderId, @RequestParam Long receiverId) {
//        return messageService.getChatHistory(senderId, receiverId);
//    }
//
//}



package comLliveChatTranslator.demo1.controller;

import comLliveChatTranslator.demo1.entity.Message;
import comLliveChatTranslator.demo1.entity.User;
import comLliveChatTranslator.demo1.service.MessageService;
import comLliveChatTranslator.demo1.service.TranslationService;
import comLliveChatTranslator.demo1.service.UserService;
import comLliveChatTranslator.demo1.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/message")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private TranslationService translationService;


    // ✅ Send a message using token for sender identity
    @PostMapping("/send")
    public Message sendMessage(@RequestBody MessageRequest request, Principal principal) {
        System.out.println("Authenticated user: " + principal.getName()); // ✅ Check this!
        // sender username is taken from JWT (you can also use token header if needed)
        String senderUsername = principal.getName();
        User sender = userService.findByUsername(senderUsername);

        return messageService.sendMessage(sender.getId(), request.getReceiverId(), request.getOriginalText());
    }

    // ✅ Get chat history, still require authentication
    @GetMapping("/history")
    public List<Message> getChatHistory(@RequestParam Long receiverId, Principal principal) {
        // 🧠 Authenticated sender
        String senderUsername = principal.getName();
        User sender = userService.findByUsername(senderUsername);

        return messageService.getChatHistory(sender.getId(), receiverId);
    }

    @PostMapping("/translate")
    public ResponseEntity<?> translate(@RequestParam String text,
                                       @RequestParam String from,
                                       @RequestParam String to) {
        String translated = translationService.translateText(from, to, text);
        return ResponseEntity.ok(Map.of("translatedText", translated));
    }

//    @PutMapping("/edit/{messageId}")
//    public ResponseEntity<?> editMessage(@PathVariable Long messageId,
//                                         @RequestBody Map<String, String> body,
//                                         Principal principal) {
//        String username = principal.getName();
//        User sender = userService.findByUsername(username);
//        String newText = body.get("originalText");
//
//        // 1. Find message
//        Message message = messageService.getMessageById(messageId);
//        if (message == null) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Message not found");
//        }
//
//        // 2. Only sender can edit
//        if (!message.getSenderId().equals(sender.getId())) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("❌ You can't edit others' messages");
//        }
//
//        // 3. Update message text
//        message.setOriginalText(newText);
//
//        // 4. Translate again
//        String targetLang = userService.getUserById(message.getReceiverId()).getPreferredLanguage();
//        String translated = translationService.translateText(sender.getPreferredLanguage(), targetLang, newText);
//        message.setTranslatedText(translated);
//
//        // 5. Save and return
//        messageService.saveMessage(message);
//        return ResponseEntity.ok(message);
//    }
@PutMapping("/edit/{messageId}")
public ResponseEntity<?> editMessage(@PathVariable Long messageId,
                                     @RequestBody Map<String, String> body,
                                     Principal principal) {
    try {
        String username = principal.getName(); // could be null if not authenticated
        System.out.println("🔐 Username from principal: " + username);

        User sender = userService.findByUsername(username);
        String newText = body.get("originalText");

        Message message = messageService.getMessageById(messageId);
        if (message == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Message not found");
        }

        if (!message.getSenderId().equals(sender.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("❌ You can't edit others' messages");
        }

        message.setOriginalText(newText);
        String targetLang = userService.getUserById(message.getReceiverId()).getPreferredLanguage();
        String translated = translationService.translateText(sender.getPreferredLanguage(), targetLang, newText);
        message.setTranslatedText(translated);

        messageService.saveMessage(message);
        return ResponseEntity.ok(message);

    } catch (Exception e) {
        e.printStackTrace(); // 🔍 Log actual error
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("❌ Server error: " + e.getMessage());
    }
}




}
