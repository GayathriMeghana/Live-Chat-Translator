package comLliveChatTranslator.demo1.dto;

import comLliveChatTranslator.demo1.entity.User;

public class LoginResponse {
    private String token;
    private User user;

    public LoginResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }

    // Getters and Setters
}
