package com.example.selectfront.service.member;

import com.example.selectfront.client.LoginClient;
import com.example.selectfront.dto.member.EmailRequestDTO;
import com.example.selectfront.dto.member.EmailUserIdRequestDTO;
import com.example.selectfront.dto.member.EmailVerifyResponseDTO;
import com.example.selectfront.dto.member.EmailVerificationRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailVerifyService {
    private final LoginClient loginClient;

    public EmailVerifyResponseDTO sendEmail(String sessionId, EmailRequestDTO email) {
        return loginClient.emailSend(sessionId,email);
    }
    public EmailVerifyResponseDTO verifyEmail(String sessionId, EmailVerificationRequestDTO email){
        return loginClient.verifyEmail(sessionId,email);
    }
}
