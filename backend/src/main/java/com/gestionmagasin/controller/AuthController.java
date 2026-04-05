package com.gestionmagasin.controller;

import com.gestionmagasin.model.Utilisateur;
import com.gestionmagasin.repository.UtilisateurRepository;
import com.gestionmagasin.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    body.get("username"), body.get("password"))
            );
            UserDetails userDetails = userDetailsService.loadUserByUsername(body.get("username"));
            String token = jwtUtil.generateToken(userDetails);
            return ResponseEntity.ok(Map.of("token", token, "username", body.get("username")));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Identifiants incorrects"));
        }
    }

    // Créer le premier admin (à désactiver après)
    @PostMapping("/init")
    public ResponseEntity<?> init(@RequestBody Map<String, String> body) {
        if (utilisateurRepository.count() > 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Un utilisateur existe déjà"));
        }
        Utilisateur u = Utilisateur.builder()
                .username(body.get("username"))
                .password(passwordEncoder.encode(body.get("password")))
                .role("ROLE_ADMIN")
                .build();
        utilisateurRepository.save(u);
        return ResponseEntity.ok(Map.of("message", "Utilisateur admin créé"));
    }
}
