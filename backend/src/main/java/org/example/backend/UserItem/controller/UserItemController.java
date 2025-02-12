package org.example.backend.UserItem.controller;

import jakarta.annotation.Nonnull;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.backend.UserItem.model.UserItemDTO;
import org.example.backend.UserItem.service.UserItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/useritem")
@CrossOrigin(origins = "http://localhost:5173")
public class UserItemController {

    private final UserItemService userItemService;

    @GetMapping("/details")
    public ResponseEntity<List<UserItemDTO>> getUserItems(
            @Nonnull HttpServletRequest request,
            @RequestParam(required = false, defaultValue = "createdAt") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String direction
    ) {
        return userItemService.getUserItems(request, sortBy, direction);
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> sellUserItem(@PathVariable long id, @Nonnull HttpServletRequest request){
        return userItemService.sellUserItem(id, request);
    }

}
