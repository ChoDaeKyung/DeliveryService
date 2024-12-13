package com.example.selectfront.service;

import com.example.selectfront.client.UserClient;
import com.example.tobi.selectfront.dto.CheckUserIdDTO;
import com.example.tobi.selectfront.dto.UpdateNicknameDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyPageUserService {

    private final UserClient userClient; // UserClient는 서비스 계층에서만 사용

    public boolean checkId(String userId) {
        CheckUserIdDTO checkUser = new CheckUserIdDTO();
        checkUser.setUserId(userId);
        return userClient.checkUserId(checkUser);
    }

    public void updateNickname(String userId, String newNickname) {
        UpdateNicknameDTO updateNickname = new UpdateNicknameDTO();
        updateNickname.setUserId(userId);
        updateNickname.setNickname(newNickname);
        userClient.updateNickname(updateNickname);
    }
}

