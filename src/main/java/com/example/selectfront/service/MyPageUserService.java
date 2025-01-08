package com.example.selectfront.service;

import com.example.selectfront.client.UserClient;

import com.example.selectfront.dto.CheckUserIdDTO;
import com.example.selectfront.dto.CheckNicknameDTO;

import com.example.selectfront.dto.UpdateNicknameDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyPageUserService {

    private final UserClient userClient; // UserClient는 서비스 계층에서만 사용

    // 아이디 확인 및 닉네임 가져오기
    public ResponseEntity<?> checkIdAndFetchNickname(CheckUserIdDTO  checkUserIdDTO) {
        // FeignClient를 사용하여 백엔드 API 호출
        return userClient.checkIdAndFetchNickname(checkUserIdDTO);
    }

    public ResponseEntity<?> checkNickname(CheckNicknameDTO  checkNicknameDTO) {
        return userClient.checkNickname(checkNicknameDTO);
    }


    public boolean updateNickname(UpdateNicknameDTO updateNicknameDTO) {
        try {
            // Feign 클라이언트 호출 후 String 응답 처리
            ResponseEntity<String> response = userClient.updateNickname(updateNicknameDTO);

            // 응답 상태 코드와 본문 확인
            System.out.println("응답 코드: " + response.getStatusCode());
            System.out.println("응답 본문: " + response.getBody());

            if (response.getStatusCode().is2xxSuccessful()) {
                // 성공적인 응답 처리
                System.out.println("응답 본문: " + response.getBody());
                return true;
            } else {
                System.err.println("닉네임 업데이트 실패: " + response.getStatusCode());
                return false;
            }
        } catch (Exception e) {
            System.err.println("닉네임 업데이트 중 예외 발생: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

}








