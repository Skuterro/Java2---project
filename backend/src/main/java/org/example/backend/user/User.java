package org.example.backend.user;

import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import lombok.*;
import org.example.backend.image.model.Image;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user")
public class User implements UserDetails {
    @Id
    @GeneratedValue
    private int id;
    @Nonnull
    private String username;
    @Nonnull
    private String email;
    @Nonnull
    private String password;
    
    private Float balance;

    @Enumerated(EnumType.STRING)
    private Role role;

    String imageId;

    String refreshToken;

    private String confirmationToken;
    private boolean enabled = false;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    private Integer cases_opened;

    private Double profit;

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
