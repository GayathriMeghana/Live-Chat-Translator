package comLliveChatTranslator.demo1.entity;
import jakarta.persistence.*;
        import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usersssss")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String preferredLanguage;
}
