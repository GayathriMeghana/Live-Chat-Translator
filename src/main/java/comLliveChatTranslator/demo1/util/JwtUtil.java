//package comLliveChatTranslator.demo1.util;
//
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Component;
//
//import java.security.Key;
//import java.util.Date;
//
//@Component
//public class JwtUtil {
//
//    private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
//    private final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour
//
//    public String generateToken(String username) {
//        return Jwts.builder()
//                .setSubject(username)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                .signWith(secretKey)
//                .compact();
//    }
//
//    public String extractUsername(String token) {
//        return parseClaims(token).getBody().getSubject();
//    }
//
//    public boolean validateToken(String token) {
//        try {
//            parseClaims(token);
//            return true;
//        } catch (JwtException | IllegalArgumentException e) {
//            return false;
//        }
//    }
//
//    private Jws<Claims> parseClaims(String token) {
//        return Jwts.parserBuilder()
//                .setSigningKey(secretKey)
//                .build()
//                .parseClaimsJws(token);
//    }
//}




//
//package comLliveChatTranslator.demo1.util;
//import org.springframework.security.core.userdetails.UserDetails;
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Component;
//
//import java.security.Key;
//import java.util.Date;
//
//@Component
//public class JwtUtil {
//
//    private final String SECRET = "LiveChatTranslatorSecretKeyForJWTEncryption123456"; // Should be at least 32 chars
//    private final long EXPIRATION_TIME = 86400000; // 1 day in ms
//
//    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());
//
//    public String generateToken(String username, Long userId) {
//        return Jwts.builder()
//                .setSubject(username)
//                .claim("userId", userId)
//                .setIssuedAt(new Date(System.currentTimeMillis()))
//                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                .signWith(key, SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    // JwtUtil.java
//    public boolean validateToken(String token, UserDetails userDetails) {
//        final String username = extractUsername(token);
//        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
//    }
//
//
//    public String extractUsername(String token) {
//        return getClaims(token).getSubject();
//    }
//
//    public boolean isTokenExpired(String token) {
//        return extractExpiration(token).before(new Date());
//    }
//
//    public Long extractUserId(String token) {
//        return getClaims(token).get("userId", Long.class);
//    }
//
//    private Claims getClaims(String token) {
//        return Jwts.parserBuilder().setSigningKey(key).build()
//                .parseClaimsJws(token).getBody();
//    }
//}




package comLliveChatTranslator.demo1.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "LiveChatTranslatorSecretKeyForJWTEncryption123456"; // At least 32 chars
    private final long EXPIRATION_TIME = 86400000; // 1 day in ms

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // ✅ Generate token with username and userId
    public String generateToken(String username, Long userId) {
        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Validate the token
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // ✅ Extract username
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // ✅ Extract expiration date (⚠️ THIS was missing)
    public Date extractExpiration(String token) {
        return getClaims(token).getExpiration();
    }

    // ✅ Check expiration
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // ✅ Extract user ID
    public Long extractUserId(String token) {
        return getClaims(token).get("userId", Long.class);
    }

    // ✅ Helper to parse claims
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}







