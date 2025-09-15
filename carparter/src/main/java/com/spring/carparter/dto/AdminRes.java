package com.spring.carparter.dto;

import com.spring.carparter.entity.Admin;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminRes {
    private String adminId;
    private String name;

    public static  AdminRes From(Admin admin){
        return AdminRes.builder()
                .adminId(admin.getAdminId())
                .name(admin.getName())
                .build();
    }






}
