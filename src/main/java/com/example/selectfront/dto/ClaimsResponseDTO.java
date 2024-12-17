package com.example.selectfront.dto;

import java.util.List;

public class ClaimsResponseDTO {
    private String userId; // 사용자 ID
    private String roles; // 권한 목록

    // 생성자, Getter, Setter
    public ClaimsResponseDTO() {
    }

    public ClaimsResponseDTO(String userId, String roles) {
        this.userId = userId;
        this.roles = roles;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRoles() {
        return roles;
    }

    public void setRoles(String roles) {
        this.roles = roles;
    }
}
