package com.gestionmagasin.controller;

import com.gestionmagasin.model.Utilisateur;
import com.gestionmagasin.repository.UtilisateurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UtilisateurRepository repo;

    public AuthController(UtilisateurRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.getOrDefault("username", "");
        String password = body.getOrDefault("password", "");

        return repo.findByUsername(username)
            .filter(u -> u.getPassword().equals(password))
            .map(u -> ResponseEntity.ok(Map.of(
                "token", UUID.randomUUID().toString(),
                "username", u.getUsername(),
                "role", u.getRole()
            )))
            .orElse(ResponseEntity.status(401).build());
    }
}
