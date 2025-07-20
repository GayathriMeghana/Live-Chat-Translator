//package comLliveChatTranslator.demo1.service;
//
//
//import comLliveChatTranslator.demo1.entity.User;
//import comLliveChatTranslator.demo1.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//@Service
//public class UserService {
//    @Autowired
//    private UserRepository userRepository;
//
//    public User register(User user) {
//        return userRepository.save(user);
//    }
//
//    public User login(String username, String password) {
//        User user = userRepository.findByUsername(username);
//        return (user != null && user.getPassword().equals(password)) ? user : null;
//    }
//
//    public String getUserPreferredLanguage(Long userId) {
//        return userRepository.findById(userId).get().getPreferredLanguage();
//    }
//
//    public User getUserById(Long id) {
//        return userRepository.findById(id).orElse(null);
//    }
//
//}



package comLliveChatTranslator.demo1.service;
import comLliveChatTranslator.demo1.entity.User;
import comLliveChatTranslator.demo1.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;
@Slf4j
@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 🔐 Register: encode password
    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // 🚪 Login: verify credentials
    public User login(String username, String rawPassword) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    // 🔍 Load by username (for JWT)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>() // Or roles/authorities if needed
        );
    }


    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

//    public User findByUsername(String username) {
//        return userRepository.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }


}
