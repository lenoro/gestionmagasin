package com.gestionmagasin.controller;

import com.gestionmagasin.model.Facture;
import com.gestionmagasin.model.Item;
import com.gestionmagasin.repository.ArticleRepository;
import com.gestionmagasin.repository.ClientRepository;
import com.gestionmagasin.repository.FactureRepository;
import com.gestionmagasin.repository.ItemRepository;
import com.gestionmagasin.repository.VendeurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/factures")
@CrossOrigin(origins = "*")
public class FactureController {

    private final FactureRepository factureRepo;
    private final ItemRepository itemRepo;
    private final ClientRepository clientRepo;
    private final VendeurRepository vendeurRepo;
    private final ArticleRepository articleRepo;

    public FactureController(FactureRepository factureRepo, ItemRepository itemRepo,
                             ClientRepository clientRepo, VendeurRepository vendeurRepo,
                             ArticleRepository articleRepo) {
        this.factureRepo = factureRepo;
        this.itemRepo    = itemRepo;
        this.clientRepo  = clientRepo;
        this.vendeurRepo = vendeurRepo;
        this.articleRepo = articleRepo;
    }

    @GetMapping
    public List<Facture> getAll() {
        return factureRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facture> getById(@PathVariable Long id) {
        return factureRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/client/{clientId}")
    public List<Facture> getByClient(@PathVariable Long clientId) {
        return factureRepo.findByClientId(clientId);
    }

    @GetMapping("/number/{number}")
    public ResponseEntity<Facture> getByNumber(@PathVariable String number) {
        return factureRepo.findByInvoiceNumber(number)
                .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/items")
    public List<Item> getItems(@PathVariable Long id) {
        return itemRepo.findByInvoiceId(id);
    }

    @PostMapping
    public Facture create(@RequestBody Facture facture) {
        if (facture.getInvoiceNumber() == null || facture.getInvoiceNumber().isBlank()) {
            facture.setInvoiceNumber(String.format("FAC-%04d", factureRepo.count() + 1));
        }

        // Charger les entités gérées par ID (évite les entités détachées JPA)
        if (facture.getClient() != null && facture.getClient().getId() != null) {
            facture.setClient(clientRepo.findById(facture.getClient().getId()).orElseThrow());
        }
        if (facture.getVendeur() != null && facture.getVendeur().getId() != null) {
            facture.setVendeur(vendeurRepo.findById(facture.getVendeur().getId()).orElse(null));
        } else {
            facture.setVendeur(null);
        }

        // Extraire les items avant de sauvegarder la facture
        List<Item> inputItems = facture.getItems();
        facture.setItems(null);

        // Sauvegarder la facture (génère l'ID)
        Facture saved = factureRepo.save(facture);

        // Sauvegarder chaque item séparément avec la référence à la facture
        if (inputItems != null) {
            for (Item item : inputItems) {
                item.setId(null);
                item.setInvoice(saved);
                if (item.getArticle() != null && item.getArticle().getId() != null) {
                    item.setArticle(articleRepo.findById(item.getArticle().getId()).orElseThrow());
                }
                itemRepo.save(item);
            }
        }

        // Retourner la facture complète avec ses items
        return factureRepo.findById(saved.getId()).orElse(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facture> update(@PathVariable Long id, @RequestBody Facture data) {
        return factureRepo.findById(id).map(f -> {
            f.setInvoiceNumber(data.getInvoiceNumber());
            f.setInvoiceDate(data.getInvoiceDate());
            f.setClient(data.getClient());
            f.setVendeur(data.getVendeur());
            f.setTotalAmount(data.getTotalAmount());
            f.setStatus(data.getStatus());
            return ResponseEntity.ok(factureRepo.save(f));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!factureRepo.existsById(id)) return ResponseEntity.notFound().build();
        factureRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
