package com.spring.carparter.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.spring.carparter.entity.Admin;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminReqDTO {

    private String adminId;
    private String password;

    public static AdminReqDTO From(Admin admin){
        return AdminReqDTO.builder()
                .adminId(admin.getAdminId())
                .password(admin.getPassword())
                .build();
    }






}
