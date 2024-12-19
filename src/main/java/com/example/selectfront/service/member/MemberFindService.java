package com.example.selectfront.service.member;

import com.example.selectfront.client.LoginClient;
import com.example.selectfront.dto.findMemberResponseDTO;
import com.example.selectfront.dto.member.EmailRequestDTO;
import com.example.selectfront.dto.member.EmailVerifyResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberFindService {
    private final LoginClient loginClient;

    public findMemberResponseDTO findId(EmailRequestDTO email) {
        findMemberResponseDTO id = loginClient.findId(email);
        System.out.println("상태"+id.isSuccess());
        return id;

    }
}
