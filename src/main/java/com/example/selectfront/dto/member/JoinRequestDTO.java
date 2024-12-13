package com.example.selectfront.dto.member;

import com.example.selectfront.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinRequestDTO {
    private String userId;
    private String userName;
    private String password;
    private String nickName;
    private Role role;
}
