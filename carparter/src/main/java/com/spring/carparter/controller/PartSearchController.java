package com.spring.carparter.controller;

import com.spring.carparter.dto.UsedPartResDTO;
import com.spring.carparter.service.UsedPartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/parts")
public class PartSearchController {

    private final UsedPartService usedPartService;

    @GetMapping("/search")
    public ResponseEntity<List<UsedPartResDTO>> searchParts(@RequestParam("query") String query) {
        List<UsedPartResDTO> results = usedPartService.searchPartsByName(query);
        return ResponseEntity.ok(results);
    }
}