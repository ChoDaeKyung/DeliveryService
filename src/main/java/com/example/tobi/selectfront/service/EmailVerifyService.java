package com.example.tobi.selectfront.service;

import com.example.tobi.selectfront.client.LoginClient;
import com.example.tobi.selectfront.dto.member.EmailRequestDTO;
import com.example.tobi.selectfront.dto.member.EmailVerifyResponseDTO;
import com.example.tobi.selectfront.dto.member.EmailVerificationRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailVerifyService {
    private final LoginClient loginClient;

    public EmailVerifyResponseDTO sendEmail(String id, EmailRequestDTO email) {
        return loginClient.emailSend(email);
    }
    public EmailVerifyResponseDTO verifyEmail(String id, EmailVerificationRequestDTO email){
        return loginClient.verifyEmail(email);
    }
}
