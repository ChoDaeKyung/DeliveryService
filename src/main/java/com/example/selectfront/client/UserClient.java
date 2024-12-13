package com.example.selectfront.client;

import com.example.selectfront.dto.CheckUserIdDTO;
import com.example.selectfront.dto.UpdateNicknameDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name="userClient",url = "${user.api-url}")
public interface UserClient {
    @PostMapping("/user/check-id")  // 외부 API에서 아이디 확인
    Boolean checkUserId(@RequestBody CheckUserIdDTO checkUserIdDTO);

    @PatchMapping("/user/update-nickname")  // 외부 API에서 닉네임 업데이트
    void updateNickname(@RequestBody UpdateNicknameDTO updateNicknameDTO);
}

