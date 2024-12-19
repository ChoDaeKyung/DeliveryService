package com.example.selectfront.controller;

import com.example.selectfront.dto.CheckUserIdDTO;
import com.example.selectfront.dto.UpdateNicknameDTO;
import com.example.selectfront.service.MyPageUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageUserService myPageUserService;

    @GetMapping("/")
    public String myPage() {
        return "mypage";
    }

    @GetMapping("/user/idForUpdate")
    public String idForUpdate() {
        return "idForUpdate";
    }

    @PostMapping("/user/nicknameUpdate")
    public String nicknameUpdatePage(@RequestParam String userId, Model model) {
        model.addAttribute("userId", userId);
        return "nicknameUpdate";
    }

    @PostMapping("/user/check-before-update")
    public ResponseEntity<Void> checkBeforeUpdate(@RequestBody CheckUserIdDTO checkUserIdDTO) {
        boolean isValid = myPageUserService.checkId(checkUserIdDTO.getUserId()); // 백엔드 UserId 호출
        if (isValid) {
            return ResponseEntity.ok().build();  // 아이디 맞으면 OK
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();  // 아이디 틀리면 401
        }
    }

    @PatchMapping("/user/nicknameUpdate")
    public ResponseEntity<String> updateNickname(@RequestBody UpdateNicknameDTO updateNicknameDTO) {
        myPageUserService.updateNickname(updateNicknameDTO.getUserId(),updateNicknameDTO.getNickname()); // 백엔드의 updateNickname 호출
        return ResponseEntity.ok("닉네임이 성공적으로 변경되었습니다.");
    }
}
