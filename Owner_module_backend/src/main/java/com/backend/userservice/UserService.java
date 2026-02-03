package com.backend.userservice;

import com.backend.userentity.User;
import com.backend.auth.dto.*;

public interface UserService {

    User registerUser(RegisterRequest request);

    User authenticate(LoginRequest request);

    User getUserById(Long id);

    User updateUser(Long id, User userDetails);

    void changePassword(Long id, String oldPassword, String newPassword);
}
