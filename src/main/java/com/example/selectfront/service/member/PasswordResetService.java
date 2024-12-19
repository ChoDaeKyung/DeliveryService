package com.example.selectfront.service.member;

import com.example.selectfront.client.LoginClient;
import com.example.selectfront.dto.findMemberResponseDTO;
import com.example.selectfront.dto.member.EmailRequestDTO;
import com.example.selectfront.dto.member.EmailUserIdRequestDTO;
import com.example.selectfront.dto.member.UpdatePwTokenRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    private final LoginClient loginClient;
    public findMemberResponseDTO sendPasswordResetLink(EmailUserIdRequestDTO emailUserIdRequestDTO) {
        System.out.println(emailUserIdRequestDTO.getEmail());
        System.out.println(emailUserIdRequestDTO.getUserId());
        return loginClient.sendResetPwd(emailUserIdRequestDTO);
    }

    public findMemberResponseDTO resetPassword(String token, String newPassword) {
       return loginClient.resetPwd(UpdatePwTokenRequestDTO.builder().resetToken(token).password(newPassword).build());
    }
}
