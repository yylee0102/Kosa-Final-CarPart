package com.spring.carparter.controller;

import com.spring.carparter.dto.UsedPartResDTO;
import com.spring.carparter.service.UsedPartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/parts")
@CrossOrigin(origins = {"http://localhost:8080", "http://192.168.210.38:8080"})
public class PartSearchController {

    private final UsedPartService usedPartService;

    @GetMapping("/search")
    public ResponseEntity<List<UsedPartResDTO>> searchParts(@RequestParam("query") String query) {
        List<UsedPartResDTO> results = usedPartService.searchPartsByName(query);
        return ResponseEntity.ok(results);
    }
}