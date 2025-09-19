package com.spring.carparter.security;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
public class CustomUserDetails implements UserDetails {

    private final String userId;
    private final String password;
    private final String name;
    private final String role;
    private final String userType;

    public CustomUserDetails(String userId, String password, String name, String role, String userType) {
        this.userId = userId;
        this.password = password;
        this.name = name;
        this.role = role;
        this.userType = userType;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton((GrantedAuthority) () -> role);
    }

    @Override
    public String getUsername() { return this.userId; }

    // 계정 상태 관련 메서드들
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}