//package comLliveChatTranslator.demo1.controller;
//import comLliveChatTranslator.demo1.entity.User;
//import comLliveChatTranslator.demo1.repository.UserRepository;
//import comLliveChatTranslator.demo1.service.UserService;
//import comLliveChatTranslator.demo1.util.JwtUtil;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.*;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.*;
//
//        import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private AuthenticationManager authManager;
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @Autowired
//    private UserRepository userRepo;
//
//    @PostMapping("/register")
//    public ResponseEntity<String> register(@Valid @RequestBody User user) {
//        Optional<User> existing = userRepo.findByUsername(user.getUsername());
//        if (existing.isPresent()) {
//            return ResponseEntity.badRequest().body("⚠️ Username already exists");
//        }
//
//        // Save new user (consider encrypting password here)
//        userRepo.save(user);
//        return ResponseEntity.ok("✅ Registered successfully");
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody User loginRequest) {
//        try {
//            Authentication auth = authManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(
//                            loginRequest.getUsername(), loginRequest.getPassword())
//            );
//
//            UserDetails userDetails = (UserDetails) auth.getPrincipal();
//
//            // ✅ Fetch User entity by username to get the ID
//            User user = userService.findByUsername(userDetails.getUsername());
//
//            // ✅ Now generate token using username and user ID
//            String token = jwtUtil.generateToken(user.getUsername(), user.getId());
//
//            return ResponseEntity.ok().body(token);
//        } catch (BadCredentialsException e) {
//            return ResponseEntity.status(401).body("❌ Invalid credentials");
//        }
//    }
//}





package comLliveChatTranslator.demo1.controller;

import comLliveChatTranslator.demo1.entity.User;
import comLliveChatTranslator.demo1.repository.UserRepository;
import comLliveChatTranslator.demo1.service.UserService;
import comLliveChatTranslator.demo1.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody User user) {
        Optional<User> existing = userRepo.findByUsername(user.getUsername());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("⚠️ Username already exists");
        }

        // ✅ Hash the password before saving
        user.setPassword(userService.encodePassword(user.getPassword()));
        userRepo.save(user);
        return ResponseEntity.ok("✅ Registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // 1. Verify credentials
        User user = userService.login(request.getUsername(), request.getPassword());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid username or password");
        }

        // 2. Generate JWT token
        UserDetails userDetails = userService.loadUserByUsername(user.getUsername());
        String token = jwtUtil.generateToken(userDetails.getUsername(), user.getId());

        // 3. Custom JSON response with token and minimal user info
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        response.put("user", userInfo);

        return ResponseEntity.ok(response);
    }
}
