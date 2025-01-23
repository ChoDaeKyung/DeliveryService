package com.example.selectfront.controller;



import com.example.selectfront.dto.CheckNicknameDTO;

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

    @GetMapping("/mypage")
    public String myPage() {
        return "mypage";
    }

    @GetMapping("/user/idForUpdate")
    public String idForUpdate() {
        return "idForUpdate";
    }

    // 아이디 확인 및 닉네임 가져오기
    @PostMapping("/user/check-id-and-fetch-nickname")
    @ResponseBody
    public ResponseEntity<?> checkIdAndFetchNickname(@RequestBody CheckUserIdDTO checkUserIdDTO) {


        // 아이디 유효성 확인 및 닉네임 가져오기
        return myPageUserService.checkIdAndFetchNickname(checkUserIdDTO);
    }

    // 닉네임 수정 페이지로 이동
    @GetMapping("/user/nicknameUpdate")
    public String nicknameUpdatePage(@RequestParam String userId, @RequestParam String nickname, Model model) {
        model.addAttribute("userId", userId);
        model.addAttribute("nickname", nickname);
        return "nicknameUpdate";
    }

    // 닉네임 중복 검사 요청 처리
    @PostMapping("/user/check-nickname")
    @ResponseBody
    public ResponseEntity<?> checkNickname(@RequestBody CheckNicknameDTO checkNicknameDTO) {


        return myPageUserService.checkNickname(checkNicknameDTO);

    }

    @PostMapping("/user/update-nickname")
    @ResponseBody
    public ResponseEntity<?> updateNickname(@RequestBody UpdateNicknameDTO updateNicknameDTO) {
        System.out.println("Controller 전달 닉네임: " + updateNicknameDTO.getNickname());
        System.out.println("Controller 전달 id: " + updateNicknameDTO.getUserId());

        boolean success = myPageUserService.updateNickname(updateNicknameDTO);
        System.out.println("서비스 호출 결과: " + success);
        return ResponseEntity.ok(success ? "success" : "fail");
    }





}
