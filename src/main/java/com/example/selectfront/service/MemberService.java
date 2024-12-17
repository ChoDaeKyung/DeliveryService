package com.example.selectfront.service;

import com.example.selectfront.client.LoginClient;
import com.example.selectfront.dto.ClaimsRequestDTO;
import com.example.selectfront.dto.ClaimsResponseDTO;
import com.example.selectfront.dto.member.JoinRequestDTO;
import com.example.selectfront.dto.member.LoginRequestDTO;
import com.example.selectfront.dto.member.UserLoginResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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



    public ClaimsResponseDTO verifyToken(String token) {
        // 요청 DTO 생성
        ClaimsRequestDTO claimsRequestDTO = new ClaimsRequestDTO();
        claimsRequestDTO.setToken(token);
        // LoginClient를 통해 서버와 통신
        ClaimsResponseDTO claims = loginClient.getClaims(claimsRequestDTO);
        System.out.println(claims.getRoles());
        return claims;

    }
}
