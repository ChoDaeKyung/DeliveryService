package com.example.selectfront.controller.member;

import com.example.selectfront.dto.findMemberResponseDTO;
import com.example.selectfront.dto.member.EmailRequestDTO;
import com.example.selectfront.dto.member.EmailUserIdRequestDTO;
import com.example.selectfront.dto.member.PasswordResetConfirmDTO;
import com.example.selectfront.service.member.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/password/reset")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    // 비밀번호 재설정 요청 처리
    @PostMapping("/request")
    public ResponseEntity<String> requestPasswordReset(@RequestBody EmailUserIdRequestDTO emailUserIdRequestDTO) {
        findMemberResponseDTO findMemberResponseDTO = passwordResetService.sendPasswordResetLink(emailUserIdRequestDTO);
        if(findMemberResponseDTO.isSuccess()){
            return ResponseEntity.ok(findMemberResponseDTO.getMessage());
        }else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효한 이메일이 아닙니다!");
        }
    }

    // 비밀번호 재설정 처리
    @PostMapping("/update-password")
    public ResponseEntity<String> resetPassword( @RequestBody PasswordResetConfirmDTO request) {
        findMemberResponseDTO findMemberResponseDTO = passwordResetService.resetPassword(request.getResetToken(), request.getNewPassword());
        if(findMemberResponseDTO.isSuccess()){
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().body(findMemberResponseDTO.getMessage());
    }
}
