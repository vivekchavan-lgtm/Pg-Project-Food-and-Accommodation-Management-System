package pg.login.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {
    private String message;
    private String username;
    private String email;
    private String fullName;
    private String mobile;
    private String gender;
    private String city;
}
