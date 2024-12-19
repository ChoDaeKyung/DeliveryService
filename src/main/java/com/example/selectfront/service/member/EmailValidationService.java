package com.example.selectfront.service.member;

import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

@Service
public class EmailValidationService {

    private static final String EMAIL_REGEX = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";

    public boolean isValidEmail(String email) {
        Pattern pattern = Pattern.compile(EMAIL_REGEX);
        return !pattern.matcher(email).matches();
    }
}
