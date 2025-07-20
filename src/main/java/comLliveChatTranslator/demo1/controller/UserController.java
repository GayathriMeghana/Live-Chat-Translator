package comLliveChatTranslator.demo1.controller;
import comLliveChatTranslator.demo1.entity.User;
import comLliveChatTranslator.demo1.service.UserService;
import comLliveChatTranslator.demo1.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import comLliveChatTranslator.demo1.repository.UserRepository;
import org.springframework.http.HttpStatus;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // Register
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    // Login
    @Autowired
    private AuthenticationManager authenticationManager;


    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.login(request.getUsername(), request.getPassword());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }

        // ✅ Use userService instead of deleted CustomUserDetailsService
        UserDetails userDetails = userService.loadUserByUsername(user.getUsername());

        String token = jwtUtil.generateToken(userDetails.getUsername(), user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }





//
//    // Get user by ID (e.g., to check preferred language)
//    @GetMapping("/{id}")
//    public User getUser(@PathVariable Long id) {
//        return userService.getUserById(id);
//    }
//
//    @GetMapping("/others/{id}")
//    public List<User> getOtherUsers(@PathVariable Long id) {
//        return userRepository.findAll()
//                .stream()
//                .filter(user -> !user.getId().equals(id))
//                .toList();
//    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.findByUsername(username);

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("preferredLanguage", user.getPreferredLanguage());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, String> updates, Principal principal) {
        // Get current logged-in username from the JWT-based security context
        String username = principal.getName(); // automatically extracted from JWT

        User user = userService.findByUsername(username);

        String newUsername = updates.get("username");
        String newPassword = updates.get("password");
        String newLang = updates.get("preferredLanguage");

        if (newUsername != null && !newUsername.isBlank()) {
            user.setUsername(newUsername);
        }

        if (newPassword != null && !newPassword.isBlank()) {
            user.setPassword(userService.encodePassword(newPassword));
        }

        if (newLang != null && !newLang.isBlank()) {
            user.setPreferredLanguage(newLang);
        }

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "✅ Profile updated successfully");
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(Principal principal) {
        String username = principal.getName();
        User user = userService.findByUsername(username);

        if (user != null) {
            userRepository.delete(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "🗑️ Account deleted successfully");

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ User not found");
    }

    @GetMapping("/others")
    public List<User> getOtherUsers(Principal principal) {
        String username = principal.getName();
        User currentUser = userService.findByUsername(username);

        return userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .toList();
    }

}
