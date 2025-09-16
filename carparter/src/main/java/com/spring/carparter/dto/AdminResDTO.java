package com.spring.carparter.dto;

import com.spring.carparter.entity.Admin;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminResDTO {
    private String adminId;
    private String name;

    public static AdminResDTO From(Admin admin){
        return AdminResDTO.builder()
                .adminId(admin.getAdminId())
                .name(admin.getName())
                .build();
    }

}
