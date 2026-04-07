package com.gestionmagasin.controller;

import com.gestionmagasin.model.Utilisateur;
import com.gestionmagasin.repository.UtilisateurRepository;
import com.gestionmagasin.security.JwtUtil;
import com.gestionmagasin.service.TraceService;
import jakarta.servlet.http.HttpServletRequest;
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

    private final AuthenticationManager  authenticationManager;
    private final UserDetailsService     userDetailsService;
    private final JwtUtil                jwtUtil;
    private final UtilisateurRepository  utilisateurRepository;
    private final PasswordEncoder        passwordEncoder;
    private final TraceService           traceService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body,
                                   HttpServletRequest request) {
        String username = body.get("username");
        String ip       = getClientIp(request);
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, body.get("password"))
            );
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            String token = jwtUtil.generateToken(userDetails);
            traceService.logConnexion(username, true, ip);
            return ResponseEntity.ok(Map.of("token", token, "username", username));
        } catch (BadCredentialsException e) {
            traceService.logConnexion(username, false, ip);
            return ResponseEntity.status(401).body(Map.of("error", "Identifiants incorrects"));
        }
    }

    /** Crée le premier admin (bloqué si un utilisateur existe déjà). */
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

    /** Extrait l'IP réelle même derrière un proxy/nginx. */
    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
