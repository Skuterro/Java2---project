package org.example.backend.image.controller;

import jakarta.persistence.Lob;
import lombok.RequiredArgsConstructor;
import org.example.backend.image.model.Image;
import org.example.backend.image.repository.ImageRepository;
import org.example.backend.image.service.ImageService;
import org.example.backend.user.User;
import org.example.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/image")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;
    private final UserRepository userRepository;
    private final ImageRepository imageRepository;

    @PostMapping
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) throws IOException {

        if (file.isEmpty()) throw new FileNotFoundException("You should provide a valid file");
        String imageId = imageService.uploadImage(file);

        Map<String, String> response = new HashMap<>();
        response.put("imageId", imageId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> downloadImage(@PathVariable String id) {
        byte[] imageData = imageService.downloadImage(id);
        return ResponseEntity.status(HttpStatus.OK)
                .contentType(MediaType.valueOf(IMAGE_PNG_VALUE))
                .body(imageData);
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> uploadUserImage(@PathVariable int userId, @RequestParam("image") MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new FileNotFoundException("You should provide a valid file");
        String imageId = imageService.uploadImage(file);
        User user = userRepository.findUserById(userId);
        String oldImageId = user.getImageId();
        user.setImageId(imageId);
        userRepository.save(user);

        Image image = imageRepository.findByImageId(oldImageId);
        if(!Objects.equals(image.getName(), "userDefault")){
            imageRepository.delete(image);
        }

        Map<String, String> response = new HashMap<>();
        response.put("imageId", imageId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}