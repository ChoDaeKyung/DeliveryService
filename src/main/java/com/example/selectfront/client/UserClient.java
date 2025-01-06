package com.example.selectfront.client;


import com.example.selectfront.dto.CheckNicknameDTO;

import com.example.selectfront.dto.CheckUserIdDTO;
import com.example.selectfront.dto.UpdateNicknameDTO;
import feign.Headers;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name="userClient",url = "${user.api-url}")
public interface UserClient {
    @PostMapping (value = "/user/check-id-and-fetch-nickname", consumes = "application/json")
    ResponseEntity<?> checkIdAndFetchNickname(@RequestBody CheckUserIdDTO checkUserIdDTO);

    @PostMapping(value = "/user/check-nickname", consumes = "application/json")
    ResponseEntity<?> checkNickname(@RequestBody CheckNicknameDTO checkNicknameDTO);

    @PostMapping(value = "/user/update-nickname", consumes = "application/json")
    ResponseEntity<String> updateNickname(@RequestBody UpdateNicknameDTO updateNicknameDTO);
}






