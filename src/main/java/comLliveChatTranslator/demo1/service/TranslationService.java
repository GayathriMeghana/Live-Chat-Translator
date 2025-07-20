package comLliveChatTranslator.demo1.service;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.json.JSONObject;
@Service
public class TranslationService {

    private final String TRANSLATION_API_URL = "http://localhost:5000/translate";

    public String translateText(String sourceLang, String targetLang, String text) {
        RestTemplate restTemplate = new RestTemplate();

        JSONObject json = new JSONObject();
        json.put("source_language", sourceLang);
        json.put("target_language", targetLang);
        json.put("text", text);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(json.toString(), headers);

        ResponseEntity<String> response = restTemplate.postForEntity(TRANSLATION_API_URL, request, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            JSONObject responseBody = new JSONObject(response.getBody());
            return responseBody.getString("translated_text");
        } else {
            throw new RuntimeException("Translation failed with status: " + response.getStatusCode());
        }
    }
}



//
//package comLliveChatTranslator.demo1.service;
//import org.springframework.http.*;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@Service
//public class TranslationService {
//
//    private final RestTemplate restTemplate = new RestTemplate();
//
//    public String translateText(String from, String to, String text) {
//        String flaskUrl = "http://localhost:5000/translate";
//
//        Map<String, String> payload = new HashMap<>();
//        payload.put("source_language", from);
//        payload.put("target_language", to);
//        payload.put("text", text);
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(payload, headers);
//
//        try {
//            ResponseEntity<Map> response = restTemplate.postForEntity(flaskUrl, requestEntity, Map.class);
//            Map responseBody = response.getBody();
//
//            if (responseBody != null && responseBody.containsKey("translated_text")) {
//                return responseBody.get("translated_text").toString();
//            } else {
//                return "Translation failed: Unexpected response.";
//            }
//
//        } catch (Exception e) {
//            return "Translation error: " + e.getMessage();
//        }
//    }
//}
