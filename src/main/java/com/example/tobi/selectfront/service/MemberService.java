package com.example.tobi.selectfront.service;

import com.example.tobi.selectfront.client.LoginClient;
import com.example.tobi.selectfront.dto.member.JoinRequestDTO;
import com.example.tobi.selectfront.dto.member.LoginRequestDTO;
import com.example.tobi.selectfront.dto.member.UserLoginResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final LoginClient loginClient;

    public ResponseEntity<String> joinMember(JoinRequestDTO loginRequestDTO) {
        return loginClient.join(loginRequestDTO);
    }

    public UserLoginResponseDTO loginMember(LoginRequestDTO loginRequestDTO) {
        return loginClient.login(loginRequestDTO);
    }

    public boolean checkId(String userId) {
        return loginClient.checkId(userId);
    }
    public boolean checkNickname(String userId) {
        return loginClient.checkName(userId);
    }
}
